// lib/seo/discovery.ts
import { promises as fs } from 'fs';
import path from 'path';
import { getCompleteConfig } from '@/lib/edge-config/client';
import { tools as staticTools } from '@/data/tools';

interface ToolInfo {
  slug: string;
  path: string;
  name?: string;
  description?: string;
  category?: string;
  source: 'filesystem' | 'edge-config' | 'static-data' | 'dynamic-route';
  exists: boolean;
  lastModified?: Date;
  priority?: number;
  searchVolume?: number;
  featured?: boolean;
  popular?: boolean;
  new?: boolean;
}

export class ToolDiscovery {
  private toolsCache: Map<string, ToolInfo> = new Map();
  private hasDynamicRouting: boolean = false;

  // Main discovery method - finds ALL tools from ALL sources
  async discoverAllTools(): Promise<ToolInfo[]> {
    console.log('🔍 Starting tool discovery...');
    const tools = new Map<string, ToolInfo>();

    // 1. Scan static tools data first (primary source)
    const staticToolsData = await this.scanStaticTools();
    console.log(`📁 Found ${staticToolsData.length} tools in static data`);
    staticToolsData.forEach((tool) => tools.set(tool.slug, tool));

    // 2. Scan file system for tool pages
    const fileSystemTools = await this.scanFileSystem();
    console.log(`📂 Found ${fileSystemTools.length} tool pages in filesystem`);
    fileSystemTools.forEach((tool) => {
      if (tools.has(tool.slug)) {
        // Merge with existing, keep static data but update existence
        const existing = tools.get(tool.slug)!;
        tools.set(tool.slug, {
          ...existing,
          exists: true,
          source: 'static-data',
        });
      } else {
        tools.set(tool.slug, tool);
      }
    });

    // 3. Read from Edge Config (if available)
    const edgeConfigTools = await this.scanEdgeConfig();
    console.log(`☁️ Found ${edgeConfigTools.length} tools in Edge Config`);
    edgeConfigTools.forEach((tool) => {
      if (tools.has(tool.slug)) {
        // Merge with existing, Edge Config takes priority for metadata
        const existing = tools.get(tool.slug)!;
        tools.set(tool.slug, { ...existing, ...tool, exists: existing.exists });
      } else {
        tools.set(tool.slug, tool);
      }
    });

    // 4. Check for dynamic routes
    const hasDynamic = await this.checkForDynamicRoutes();
    if (hasDynamic) {
      console.log(
        '🎯 Dynamic routing detected - tools from config will be routed'
      );
      this.hasDynamicRouting = true;
    }

    // 5. Scan API routes
    const apiRoutes = await this.scanAPIRoutes();
    console.log(`🔌 Found ${apiRoutes.length} API routes`);

    const allTools = Array.from(tools.values());
    console.log(`✅ Total tools discovered: ${allTools.length}`);

    // Cache results
    this.toolsCache = tools;

    return allTools;
  }

  // Scan static tools data from /data/tools.ts
  private async scanStaticTools(): Promise<ToolInfo[]> {
    try {
      return staticTools.map((tool) => ({
        slug: tool.slug,
        path: `/tools/${tool.slug}`,
        name: tool.name,
        description: tool.description,
        category: tool.category,
        source: 'static-data' as const,
        exists: true, // Assume exists if in static data
        featured: tool.featured,
        popular: tool.popular,
        new: (tool as any).new,
        priority: tool.featured ? 0.9 : tool.popular ? 0.8 : 0.7,
      }));
    } catch (error) {
      console.warn('Could not read static tools data:', error);
      return [];
    }
  }

  // Scan actual file system for tool pages
  private async scanFileSystem(): Promise<ToolInfo[]> {
    const tools: ToolInfo[] = [];
    const possiblePaths = [
      'app/tools',
      'app/(tools)',
      'src/app/tools',
      'src/app/(tools)',
      'pages/tools',
      'src/pages/tools',
    ];

    for (const basePath of possiblePaths) {
      try {
        const fullPath = path.join(process.cwd(), basePath);
        const exists = await fs
          .access(fullPath)
          .then(() => true)
          .catch(() => false);

        if (exists) {
          console.log(`  Scanning: ${basePath}`);
          const entries = await fs.readdir(fullPath, { withFileTypes: true });

          for (const entry of entries) {
            // Skip special Next.js folders and files
            if (
              entry.name.startsWith('_') ||
              entry.name.startsWith('.') ||
              entry.name === 'layout.tsx'
            )
              continue;

            if (entry.isDirectory()) {
              // Check if it's a dynamic route
              if (entry.name.startsWith('[') && entry.name.endsWith(']')) {
                this.hasDynamicRouting = true;
                console.log(`  Found dynamic route: ${entry.name}`);
                continue;
              }

              // Check if it's a tool directory with a page file
              const toolPath = path.join(fullPath, entry.name);
              const hasPage = await this.hasPageFile(toolPath);

              if (hasPage) {
                // Try to read metadata from the page file
                const metadata = await this.extractMetadataFromFile(
                  path.join(toolPath, 'page.tsx')
                );

                tools.push({
                  slug: entry.name,
                  path: `/tools/${entry.name}`,
                  name: metadata?.name || this.formatName(entry.name),
                  description: metadata?.description,
                  source: 'filesystem',
                  exists: true,
                  lastModified: await this.getFileModifiedDate(toolPath),
                });
              }
            }
          }
        }
      } catch (error) {
        // Path doesn't exist, continue
        continue;
      }
    }

    return tools;
  }

  // Check if directory has a page file
  private async hasPageFile(dirPath: string): Promise<boolean> {
    const pageFiles = [
      'page.tsx',
      'page.ts',
      'page.jsx',
      'page.js',
      'index.tsx',
      'index.ts',
      'index.jsx',
      'index.js',
    ];

    for (const file of pageFiles) {
      const filePath = path.join(dirPath, file);
      const exists = await fs
        .access(filePath)
        .then(() => true)
        .catch(() => false);
      if (exists) return true;
    }

    return false;
  }

  // Check for dynamic [tool] or [slug] routes
  private async checkForDynamicRoutes(): Promise<boolean> {
    const dynamicPatterns = [
      'app/tools/[tool]',
      'app/tools/[slug]',
      'app/tools/[id]',
      'app/tools/[[...slug]]',
      'app/(tools)/[tool]',
      'src/app/tools/[tool]',
      'pages/tools/[tool]',
    ];

    for (const pattern of dynamicPatterns) {
      const fullPath = path.join(process.cwd(), pattern);
      const exists = await fs
        .access(fullPath)
        .then(() => true)
        .catch(() => false);

      if (exists) {
        console.log(`  Dynamic route found: ${pattern}`);
        return true;
      }
    }

    return false;
  }

  // Read tools from Edge Config
  private async scanEdgeConfig(): Promise<ToolInfo[]> {
    try {
      const configResult = await getCompleteConfig();

      if (!configResult.success) {
        console.log('  Edge Config not available or failed');
        return [];
      }

      const config = configResult.data;

      if (config.tools) {
        return Object.entries(config.tools)
          .filter(([_, tool]: [string, any]) => tool.enabled !== false)
          .map(([slug, tool]: [string, any]) => ({
            slug,
            path: `/tools/${slug}`,
            name: tool.name,
            description: tool.description,
            category: tool.category,
            searchVolume: tool.searchVolume,
            priority: tool.featured ? 0.9 : tool.popular ? 0.8 : 0.7,
            featured: tool.featured,
            popular: tool.popular,
            source: 'edge-config' as const,
            exists: this.hasDynamicRouting, // Only exists if we have dynamic routing
            lastModified: tool.updatedAt
              ? new Date(tool.updatedAt)
              : new Date(),
          }));
      }
    } catch (error) {
      console.error('  Error reading Edge Config:', error);
    }

    return [];
  }

  // Find all API routes
  private async scanAPIRoutes(): Promise<ToolInfo[]> {
    const apiPaths = [
      'app/api/tools',
      'src/app/api/tools',
      'pages/api/tools',
      'src/pages/api/tools',
    ];

    const apis: ToolInfo[] = [];

    for (const apiPath of apiPaths) {
      try {
        const fullPath = path.join(process.cwd(), apiPath);
        const exists = await fs
          .access(fullPath)
          .then(() => true)
          .catch(() => false);

        if (exists) {
          const entries = await fs.readdir(fullPath, { withFileTypes: true });

          for (const entry of entries) {
            if (entry.isDirectory() && !entry.name.startsWith('[')) {
              // Check for route.ts in the directory
              const routePath = path.join(fullPath, entry.name, 'route.ts');
              const hasRoute = await fs
                .access(routePath)
                .then(() => true)
                .catch(() => false);

              if (hasRoute) {
                apis.push({
                  slug: entry.name,
                  path: `/api/tools/${entry.name}`,
                  source: 'filesystem',
                  exists: true,
                });
              }
            } else if (
              entry.isFile() &&
              !entry.name.startsWith('route.') &&
              !entry.name.startsWith('[')
            ) {
              const name = entry.name.replace(/\.(ts|js|tsx|jsx)$/, '');
              apis.push({
                slug: name,
                path: `/api/tools/${name}`,
                source: 'filesystem',
                exists: true,
              });
            }
          }
        }
      } catch (error) {
        // Continue
        continue;
      }
    }

    return apis;
  }

  // Discover categories
  async discoverCategories(): Promise<string[]> {
    const categories = new Set<string>();

    // From static tools data
    staticTools.forEach((tool) => {
      if (tool.category) categories.add(tool.category);
    });

    // From Edge Config
    try {
      const configResult = await getCompleteConfig();
      if (configResult.success && configResult.data.categories) {
        Object.keys(configResult.data.categories).forEach((cat) =>
          categories.add(cat)
        );
      }

      // Also check tools for their categories
      if (configResult.success && configResult.data.tools) {
        Object.values(configResult.data.tools).forEach((tool: any) => {
          if (tool.category) categories.add(tool.category);
        });
      }
    } catch (error) {
      // Continue
    }

    // From filesystem
    const categoryPaths = [
      'app/category',
      'app/categories',
      'src/app/category',
    ];

    for (const catPath of categoryPaths) {
      try {
        const fullPath = path.join(process.cwd(), catPath);
        const exists = await fs
          .access(fullPath)
          .then(() => true)
          .catch(() => false);

        if (exists) {
          const entries = await fs.readdir(fullPath, { withFileTypes: true });
          entries.forEach((entry) => {
            if (entry.isDirectory() && !entry.name.startsWith('[')) {
              categories.add(entry.name);
            }
          });
        }
      } catch (error) {
        // Continue
      }
    }

    return Array.from(categories);
  }

  // Extract metadata from file content
  private async extractMetadataFromFile(filePath: string): Promise<any> {
    try {
      const content = await fs.readFile(filePath, 'utf-8');

      // Look for metadata exports
      const metadataMatch = content.match(
        /export\s+(?:const|async function)\s+generateMetadata[^{]*{([^}]+)}/s
      );
      if (metadataMatch) {
        // Simple extraction of title and description
        const titleMatch = metadataMatch[1].match(/title:\s*['"`]([^'"`]+)/);
        const descMatch = metadataMatch[1].match(
          /description:\s*['"`]([^'"`]+)/
        );

        return {
          name: titleMatch?.[1],
          description: descMatch?.[1],
        };
      }
    } catch (error) {
      // Continue
    }

    return null;
  }

  // Get file modified date
  private async getFileModifiedDate(filePath: string): Promise<Date> {
    try {
      const stats = await fs.stat(filePath);
      return stats.mtime;
    } catch {
      return new Date();
    }
  }

  // Find static pages (about, privacy, etc)
  async discoverStaticPages(): Promise<string[]> {
    const pages: string[] = [];
    const commonPages = [
      'about',
      'privacy',
      'terms',
      'contact',
      'blog',
      'docs',
      'api',
    ];

    for (const page of commonPages) {
      const paths = [
        `app/${page}`,
        `app/(marketing)/${page}`,
        `src/app/${page}`,
        `pages/${page}`,
      ];

      for (const p of paths) {
        const fullPath = path.join(process.cwd(), p);
        const exists = await fs
          .access(fullPath)
          .then(() => true)
          .catch(() => false);
        if (exists) {
          pages.push(`/${page}`);
          break;
        }
      }
    }

    return pages;
  }

  // Helper to format tool name from slug
  private formatName(slug: string): string {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  // Get cached tools or discover fresh
  async getTools(fresh: boolean = false): Promise<ToolInfo[]> {
    if (fresh || this.toolsCache.size === 0) {
      return this.discoverAllTools();
    }

    return Array.from(this.toolsCache.values());
  }

  // Get static tools only (for build-time)
  async getStaticTools(): Promise<ToolInfo[]> {
    return this.scanStaticTools();
  }

  // Get static categories only (for build-time)
  getStaticCategories(): string[] {
    const categories = new Set<string>();

    staticTools.forEach((tool) => {
      if (tool.category) {
        categories.add(tool.category);
      }
    });

    return Array.from(categories);
  }

  // Get single tool by slug
  async getTool(slug: string): Promise<ToolInfo | null> {
    const tools = await this.getTools();
    return tools.find((t) => t.slug === slug) || null;
  }

  // Check if system has dynamic routing capability
  hasDynamicRoutes(): boolean {
    return this.hasDynamicRouting;
  }
}
