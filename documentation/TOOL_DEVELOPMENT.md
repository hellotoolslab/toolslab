# ToolsLab - Tool Development Guide

## 🚀 Complete Tool Development Workflow

This guide provides comprehensive instructions for adding new tools to ToolsLab, following our established patterns and best practices.

## 📋 Prerequisites

- Node.js >= 18.17.0
- npm >= 9.0.0
- TypeScript knowledge
- React/Next.js familiarity
- Understanding of the codebase structure

## 🎯 Tool Development Checklist

### Phase 1: Planning
- [ ] Define tool purpose and target audience
- [ ] Research similar tools for feature ideas
- [ ] Estimate search volume and demand
- [ ] Plan core features and UI layout
- [ ] Define input/output formats
- [ ] Consider edge cases and limitations

### Phase 2: Implementation
- [ ] Register tool in `/lib/tools.ts`
- [ ] Create SEO content in `/lib/tool-seo.ts`
- [ ] Add instructions in `/lib/tool-instructions.ts`
- [ ] Write unit tests in `__tests__/unit/tools/`
- [ ] Implement logic in `lib/tools/`
- [ ] Create UI component in `components/tools/implementations/`
- [ ] Add page route in `app/tools/`
- [ ] Update documentation

### Phase 3: Testing & Deployment
- [ ] Run all tests
- [ ] Check bundle size impact
- [ ] Test on mobile devices
- [ ] Verify SEO metadata
- [ ] Deploy to preview
- [ ] Production deployment

## 📝 Step-by-Step Implementation

### Step 1: Register the Tool

Add your tool to `/lib/tools.ts`:

```typescript
// lib/tools.ts
export const tools: Tool[] = [
  // ... existing tools
  {
    id: 'your-tool-slug',           // Unique identifier (kebab-case)
    name: 'Your Tool Name',          // Display name
    description: 'Clear, concise description of what the tool does',
    icon: '🔧',                      // Emoji icon
    route: '/tools/your-tool-slug',  // URL route
    categories: ['dev', 'data'],     // Array of category IDs
    keywords: [                      // SEO keywords
      'tool', 'specific', 'keywords',
      'search', 'terms', 'related'
    ],
    isPopular: false,                // Popular flag
    isNew: true,                     // New tool flag
    searchVolume: 5000,              // Estimated monthly searches
    label: 'new',                    // Badge label
  },
];
```

### Step 2: Add SEO Content

Create SEO-optimized content in `/lib/tool-seo.ts`:

```typescript
// lib/tool-seo.ts
export const toolSeoContent: ToolSeoContent[] = [
  // ... existing content
  {
    id: 'your-tool-slug',
    tagline: 'Action verb describing tool benefit in 8-12 words',
    seoDescription: `
      What the tool does and its primary purpose. Who benefits from
      using this tool and why it's better than alternatives. Free,
      secure, browser-based processing. Call-to-action. (30-70 words)
    `.trim(),
  },
];
```

### Step 3: Create Tool Instructions

Add comprehensive instructions in `/lib/tool-instructions.ts`:

```typescript
// lib/tool-instructions.ts
export const toolInstructions: ToolInstructionContent[] = [
  // ... existing instructions
  {
    id: 'your-tool-slug',
    title: 'How to use Your Tool Name',
    steps: [
      {
        title: 'Step 1: Input your data',
        description: 'Detailed description of the first step...'
      },
      {
        title: 'Step 2: Configure options',
        description: 'How to adjust settings for optimal results...'
      },
      {
        title: 'Step 3: Process and review',
        description: 'How to execute and interpret results...'
      },
      // Add 3-5 steps total
    ],
    features: [
      'Feature 1: Specific capability',
      'Feature 2: Another capability',
      'Feature 3: Technical feature',
      'Feature 4: User benefit',
      // Add 4-8 features
    ],
    useCases: [
      'Use case 1: Real-world scenario',
      'Use case 2: Professional application',
      'Use case 3: Developer workflow',
      'Use case 4: Data processing task',
      // Add 5-8 use cases
    ],
    proTips: [
      'Pro tip 1: Advanced usage technique',
      'Pro tip 2: Performance optimization',
      'Pro tip 3: Best practice',
      'Pro tip 4: Hidden feature',
      // Add 4-6 pro tips
    ],
    troubleshooting: [
      'Issue 1: Common problem and solution',
      'Issue 2: Error handling',
      'Issue 3: Performance issue',
      // Add 3-5 common issues
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+Enter', description: 'Process data' },
      { keys: 'Ctrl+C', description: 'Copy result' },
      // Add if applicable
    ],
  },
];
```

### Step 4: Write Unit Tests

Create test file `__tests__/unit/tools/your-tool.test.ts`:

```typescript
// __tests__/unit/tools/your-tool.test.ts
import { processYourTool } from '@/lib/tools/your-tool';

describe('YourTool', () => {
  describe('processYourTool', () => {
    it('should process valid input correctly', () => {
      const input = 'test input';
      const result = processYourTool(input);

      expect(result.success).toBe(true);
      expect(result.result).toBeDefined();
    });

    it('should handle empty input', () => {
      const result = processYourTool('');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Input required');
    });

    it('should handle invalid input', () => {
      const input = 'invalid data';
      const result = processYourTool(input);

      expect(result.success).toBe(false);
      expect(result.error).toContain('Invalid');
    });

    // Edge cases
    it('should handle large input', () => {
      const largeInput = 'x'.repeat(1000000);
      const result = processYourTool(largeInput);

      expect(result).toBeDefined();
    });

    it('should handle special characters', () => {
      const specialInput = '🔧 Unicode © Special™';
      const result = processYourTool(specialInput);

      expect(result.success).toBe(true);
    });
  });
});
```

### Step 5: Implement Tool Logic

Create logic file `lib/tools/your-tool.ts`:

```typescript
// lib/tools/your-tool.ts
import { z } from 'zod';

// Define interfaces
export interface YourToolOptions {
  format?: 'compact' | 'pretty';
  includeMetadata?: boolean;
  customOption?: string;
}

export interface YourToolResult {
  success: boolean;
  result?: string;
  error?: string;
  metadata?: {
    processedAt: number;
    inputLength: number;
    outputLength: number;
    [key: string]: any;
  };
}

// Input validation schema
const inputSchema = z.string().min(1).max(1000000);

// Main processing function
export function processYourTool(
  input: string,
  options: YourToolOptions = {}
): YourToolResult {
  try {
    // Validate input
    const validatedInput = inputSchema.parse(input);

    // Set default options
    const opts = {
      format: 'pretty',
      includeMetadata: true,
      ...options,
    };

    // Process the data
    const processed = performProcessing(validatedInput, opts);

    // Build metadata
    const metadata = opts.includeMetadata ? {
      processedAt: Date.now(),
      inputLength: input.length,
      outputLength: processed.length,
      format: opts.format,
    } : undefined;

    return {
      success: true,
      result: processed,
      metadata,
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: `Validation error: ${error.errors[0].message}`,
      };
    }

    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Helper functions
function performProcessing(input: string, options: YourToolOptions): string {
  // Your processing logic here
  let result = input;

  if (options.format === 'pretty') {
    result = formatPretty(result);
  }

  return result;
}

function formatPretty(data: string): string {
  // Formatting logic
  return data;
}

// Export additional utilities if needed
export function validateYourToolInput(input: string): boolean {
  try {
    inputSchema.parse(input);
    return true;
  } catch {
    return false;
  }
}
```

### Step 6: Create UI Component

Create component file `components/tools/implementations/YourTool.tsx`:

```typescript
// components/tools/implementations/YourTool.tsx
'use client';

import React, { useState, useCallback, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Copy, Download, Trash2, Upload } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { processYourTool, YourToolOptions, YourToolResult } from '@/lib/tools/your-tool';

export default function YourTool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<YourToolResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [options, setOptions] = useState<YourToolOptions>({
    format: 'pretty',
    includeMetadata: true,
  });
  const { toast } = useToast();

  // Process input
  const handleProcess = useCallback(async () => {
    if (!input.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter some input to process',
        variant: 'destructive',
      });
      return;
    }

    setIsProcessing(true);
    try {
      // Simulate async processing if needed
      await new Promise(resolve => setTimeout(resolve, 100));

      const result = processYourTool(input, options);
      setOutput(result);

      if (result.success) {
        toast({
          title: 'Success',
          description: 'Data processed successfully',
        });
      } else {
        toast({
          title: 'Error',
          description: result.error,
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An unexpected error occurred',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  }, [input, options, toast]);

  // Copy to clipboard
  const handleCopy = useCallback(() => {
    if (output?.result) {
      navigator.clipboard.writeText(output.result);
      toast({
        title: 'Copied',
        description: 'Result copied to clipboard',
      });
    }
  }, [output, toast]);

  // Download result
  const handleDownload = useCallback(() => {
    if (output?.result) {
      const blob = new Blob([output.result], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'processed-output.txt';
      a.click();
      URL.revokeObjectURL(url);
    }
  }, [output]);

  // Clear all
  const handleClear = useCallback(() => {
    setInput('');
    setOutput(null);
  }, []);

  // File upload
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setInput(content);
      };
      reader.readAsText(file);
    }
  }, []);

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <CardTitle>Your Tool Name</CardTitle>
          <CardDescription>
            Clear description of what this tool does and how to use it
          </CardDescription>
        </CardHeader>
      </Card>

      {/* Input Section */}
      <Card>
        <CardHeader>
          <CardTitle>Input</CardTitle>
          <CardDescription>
            Enter or upload your data to process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="input">Data Input</Label>
            <Textarea
              id="input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Paste your data here..."
              className="font-mono min-h-[200px]"
            />
          </div>

          {/* Options */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="pretty"
                checked={options.format === 'pretty'}
                onChange={(e) => setOptions({
                  ...options,
                  format: e.target.checked ? 'pretty' : 'compact'
                })}
              />
              <Label htmlFor="pretty">Pretty format</Label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="metadata"
                checked={options.includeMetadata}
                onChange={(e) => setOptions({
                  ...options,
                  includeMetadata: e.target.checked
                })}
              />
              <Label htmlFor="metadata">Include metadata</Label>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <Button
              onClick={handleProcess}
              disabled={!input || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Process'}
            </Button>

            <Button
              variant="outline"
              onClick={handleClear}
              disabled={!input && !output}
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>

            <Button variant="outline" asChild>
              <label>
                <Upload className="w-4 h-4 mr-2" />
                Upload File
                <input
                  type="file"
                  onChange={handleFileUpload}
                  className="hidden"
                  accept=".txt,.json,.csv"
                />
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Output Section */}
      {output && (
        <Card>
          <CardHeader>
            <CardTitle>Output</CardTitle>
            <CardDescription>
              Processed result
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {output.success ? (
              <>
                <div className="relative">
                  <Textarea
                    value={output.result}
                    readOnly
                    className="font-mono min-h-[200px] bg-muted"
                  />
                </div>

                {/* Output Actions */}
                <div className="flex gap-2">
                  <Button onClick={handleCopy} variant="outline">
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button onClick={handleDownload} variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Download
                  </Button>
                </div>

                {/* Metadata */}
                {output.metadata && (
                  <Alert>
                    <AlertDescription>
                      <div className="text-sm space-y-1">
                        <div>Input: {output.metadata.inputLength} chars</div>
                        <div>Output: {output.metadata.outputLength} chars</div>
                        <div>Format: {output.metadata.format}</div>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </>
            ) : (
              <Alert variant="destructive">
                <AlertDescription>{output.error}</AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Features Card */}
      <Card>
        <CardHeader>
          <CardTitle>Features</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
            <li>Feature 1 description</li>
            <li>Feature 2 description</li>
            <li>Feature 3 description</li>
            <li>Feature 4 description</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
```

### Step 7: Create Page Route

Create page file `app/tools/your-tool-slug/page.tsx`:

```typescript
// app/tools/your-tool-slug/page.tsx
import { Metadata } from 'next';
import { Suspense } from 'react';
import ToolPageClient from '@/components/tools/ToolPageClient';
import { getToolById } from '@/lib/tools';
import { getToolSeoContent } from '@/lib/tool-seo';

const TOOL_ID = 'your-tool-slug';

// Generate metadata for SEO
export async function generateMetadata(): Promise<Metadata> {
  const tool = getToolById(TOOL_ID);
  const seoContent = getToolSeoContent(TOOL_ID);

  if (!tool) {
    return {
      title: 'Tool Not Found - ToolsLab',
      description: 'The requested tool could not be found.',
    };
  }

  const title = `${tool.name} - Free Online Tool | ToolsLab`;
  const description = seoContent?.seoDescription || tool.description;

  return {
    title,
    description,
    keywords: tool.keywords.join(', '),
    openGraph: {
      title,
      description,
      type: 'website',
      url: `https://toolslab.dev${tool.route}`,
      siteName: 'ToolsLab',
      images: [
        {
          url: '/og-image.png',
          width: 1200,
          height: 630,
          alt: tool.name,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og-image.png'],
    },
    alternates: {
      canonical: `https://toolslab.dev${tool.route}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
  };
}

// IMPORTANT: Always wrap ToolPageClient in Suspense
export default function YourToolPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolPageClient toolId={TOOL_ID} />
    </Suspense>
  );
}
```

## 💧 State Management & Hydration

### When to Use Zustand Store

Use the Zustand store when your tool needs to:
- **Persist data** across page refreshes (favorites, history, settings)
- **Share state** across multiple components
- **Track user behavior** (recent tools, usage patterns)
- **Save user preferences** (timezone, format options)

### SSR-Safe Store Access Pattern

**⚠️ CRITICAL**: Always use the `useHydration` hook when accessing Zustand stores to prevent hydration mismatch errors.

```typescript
'use client';

import { useToolStore } from '@/lib/store/toolStore';
import { useHydration } from '@/lib/hooks/useHydration';

export default function YourComponent() {
  // 1. Import useHydration hook
  const isHydrated = useHydration();

  // 2. Access the store
  const { favoriteTools, history, addToHistory } = useToolStore();

  // 3. Create safe data accessors (wait for hydration)
  const safeHistory = isHydrated ? history : [];
  const safeFavorites = isHydrated ? favoriteTools : [];

  // 4. Use safe data in rendering
  return (
    <div>
      <p>Total favorites: {safeFavorites.length}</p>
      <ul>
        {safeHistory.map((item) => (
          <li key={item.id}>{item.tool}</li>
        ))}
      </ul>
    </div>
  );
}
```

### Hydration in useEffect

When accessing store data in side effects, wait for hydration:

```typescript
useEffect(() => {
  if (!isHydrated) return; // Wait for store rehydration

  // Now safe to access store data
  const { favoriteTools } = useToolStore.getState();
  console.log('User favorites:', favoriteTools);

  // Track analytics, update UI, etc.
}, [isHydrated]);
```

### Adding Tool to History

When a user processes data with your tool, save it to history:

```typescript
const { addToHistory } = useToolStore();

const handleProcess = () => {
  // Process the input
  const result = processYourTool(input);

  // Add to history for "Recent Tools" tracking
  addToHistory({
    id: `${Date.now()}-${Math.random()}`,
    tool: 'your-tool-slug', // Must match tool ID in tools.ts
    input: input,
    output: result,
    timestamp: Date.now(),
  });
};
```

### Creating a Persistent Store (Advanced)

If your tool needs its own persistent store (like CrontabBuilder):

```typescript
// lib/stores/your-tool-store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface YourToolStore {
  favorites: string[];
  settings: { theme: string };
  addFavorite: (id: string) => void;
}

// Separate logic for SSR/client compatibility
const storeLogic: any = (set: any, get: any): YourToolStore => ({
  favorites: [],
  settings: { theme: 'light' },

  addFavorite: (id: string) => {
    set((state: YourToolStore) => ({
      favorites: [...state.favorites, id]
    }));
  },
});

// Create SSR-safe store
export const useYourToolStore = create<YourToolStore>()(
  typeof window === 'undefined'
    ? storeLogic // Server: no persist
    : persist(storeLogic, {
        name: 'your-tool-storage',
        storage: createJSONStorage(() => localStorage),
        skipHydration: true, // CRITICAL: prevents auto-hydration
      })
);
```

### Common Hydration Pitfalls

❌ **WRONG - Direct store access without hydration check**:
```typescript
export default function MyComponent() {
  const { favoriteTools } = useToolStore();

  return <div>Favorites: {favoriteTools.length}</div>; // ⚠️ Hydration mismatch!
}
```

✅ **CORRECT - Safe store access with hydration**:
```typescript
export default function MyComponent() {
  const isHydrated = useHydration();
  const { favoriteTools } = useToolStore();

  const safeFavorites = isHydrated ? favoriteTools : [];

  return <div>Favorites: {safeFavorites.length}</div>; // ✅ Safe!
}
```

### Why This Matters

Without proper hydration handling:
- ❌ React Error #425 in production
- ❌ Favorites/history disappear after refresh
- ❌ Inconsistent server/client rendering
- ❌ Failed production builds on Vercel

With proper hydration:
- ✅ Data persists correctly across sessions
- ✅ No hydration mismatch errors
- ✅ Smooth user experience
- ✅ Production builds succeed

## 🧪 Testing Guidelines

### Unit Testing Requirements

```typescript
// Minimum test coverage required
describe('Tool Testing Standards', () => {
  test('Valid input processing', () => {});
  test('Empty input handling', () => {});
  test('Invalid input handling', () => {});
  test('Large input performance', () => {});
  test('Special characters support', () => {});
  test('Edge cases', () => {});
  test('Error messages clarity', () => {});
  test('Options functionality', () => {});
});
```

### Integration Testing

```typescript
// __tests__/integration/tools/your-tool.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import YourTool from '@/components/tools/implementations/YourTool';

describe('YourTool Integration', () => {
  it('should process input and display result', async () => {
    render(<YourTool />);

    const input = screen.getByPlaceholderText(/paste your data/i);
    const processButton = screen.getByText(/process/i);

    fireEvent.change(input, { target: { value: 'test data' } });
    fireEvent.click(processButton);

    await waitFor(() => {
      expect(screen.getByText(/success/i)).toBeInTheDocument();
    });
  });
});
```

## 🚀 Performance Optimization

### Code Splitting
```typescript
// Use dynamic imports for heavy dependencies
const HeavyLibrary = dynamic(() => import('heavy-library'), {
  ssr: false,
  loading: () => <Skeleton />
});
```

### Memoization
```typescript
// Memoize expensive computations
const processedData = useMemo(() => {
  return expensiveOperation(input);
}, [input]);

// Memoize callbacks
const handleProcess = useCallback(() => {
  // Processing logic
}, [dependencies]);
```

### Web Workers (for heavy operations)
```typescript
// lib/tools/workers/your-tool.worker.ts
self.addEventListener('message', (e) => {
  const { input, options } = e.data;
  const result = processHeavyOperation(input, options);
  self.postMessage(result);
});

// In component
const worker = new Worker('/workers/your-tool.worker.js');
worker.postMessage({ input, options });
worker.onmessage = (e) => setResult(e.data);
```

## 📱 Mobile Optimization

### Responsive Design Checklist
- [ ] Test on iPhone SE (375px)
- [ ] Test on iPad (768px)
- [ ] Test on Desktop (1920px)
- [ ] Touch-friendly buttons (min 44x44px)
- [ ] Readable font sizes (min 14px)
- [ ] Proper viewport meta tag
- [ ] No horizontal scrolling
- [ ] Optimized images

### Touch Interactions
```typescript
// Add touch-friendly interactions
<Button
  className="min-h-[44px] min-w-[44px]"
  onClick={handleAction}
  onTouchStart={handleTouchStart}
  onTouchEnd={handleTouchEnd}
>
  Action
</Button>
```

## 🎨 UI/UX Best Practices

### Component Standards
1. Use shadcn/ui components consistently
2. Follow the established color scheme
3. Maintain consistent spacing (4px grid)
4. Use appropriate loading states
5. Provide clear error messages
6. Include helpful placeholders
7. Add tooltips for complex features

### Accessibility Requirements
- [ ] ARIA labels for all interactive elements
- [ ] Keyboard navigation support
- [ ] Focus indicators visible
- [ ] Screen reader compatible
- [ ] Color contrast WCAG AA compliant
- [ ] Alternative text for images
- [ ] Semantic HTML structure

## 📊 Analytics Integration

Add analytics tracking to your tool:

```typescript
// In your component
import { track } from '@/lib/analytics';

// Track tool usage
const handleProcess = () => {
  track('tool-use', {
    tool: 'your-tool-slug',
    action: 'process',
    inputLength: input.length
  });
  // Processing logic
};

// Track errors
catch (error) {
  track('tool-error', {
    tool: 'your-tool-slug',
    error: error.message
  });
}
```

## 🔍 SEO Optimization

### SEO Checklist
- [ ] Unique, descriptive title (50-60 chars)
- [ ] Meta description (150-160 chars)
- [ ] Relevant keywords (5-10)
- [ ] Canonical URL set
- [ ] Open Graph tags
- [ ] Twitter Card tags
- [ ] Structured data (JSON-LD)
- [ ] Sitemap entry (automatic)
- [ ] IndexNow submission

## 🚢 Deployment Process

### Pre-deployment Checklist
```bash
# 1. Run all tests
npm run test:all

# 2. Check linting
npm run lint

# 3. Build locally
npm run build

# 4. Check bundle size
npm run analyze:size

# 5. Test production build
npm run build:prod && npm start
```

### Deployment Steps
```bash
# 1. Create feature branch
git checkout -b feat/your-tool-slug

# 2. Commit changes
git add .
git commit -m "feat: add your-tool-slug tool"

# 3. Push to GitHub
git push origin feat/your-tool-slug

# 4. Create Pull Request
# - Target: development branch
# - Include description and checklist

# 5. After review and merge to development
# Preview URL will be generated

# 6. Test on preview
# Verify all functionality

# 7. Merge to main for production
```

## 🐛 Common Issues & Solutions

### Issue 1: Tool not appearing in navigation
**Solution**: Ensure tool is registered in `/lib/tools.ts` and has correct category

### Issue 2: SEO metadata not updating
**Solution**: Clear Next.js cache (`rm -rf .next`) and rebuild

### Issue 3: Bundle size too large
**Solution**: Use dynamic imports and code splitting for heavy dependencies

### Issue 4: Tests failing
**Solution**: Check test fixtures and mock data match current implementation

### Issue 5: Mobile layout broken
**Solution**: Use responsive Tailwind classes and test on actual devices

## 📚 Resources

### Documentation
- [Next.js App Router](https://nextjs.org/docs/app)
- [shadcn/ui Components](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)
- [Jest Testing](https://jestjs.io/docs/getting-started)

### Internal References
- Tool examples: `components/tools/implementations/`
- Test examples: `__tests__/unit/tools/`
- Utility functions: `lib/utils/`
- Common components: `components/common/`

## ✅ Final Checklist

Before considering your tool complete:

- [ ] All tests pass with >80% coverage
- [ ] No ESLint errors or warnings
- [ ] Bundle size impact <50KB
- [ ] Mobile responsive design verified
- [ ] SEO metadata complete
- [ ] Documentation updated
- [ ] Analytics tracking added
- [ ] Error handling comprehensive
- [ ] Performance benchmarks met
- [ ] Accessibility standards met
- [ ] Code review completed
- [ ] Preview deployment tested
- [ ] Production deployment successful

---

**Last Updated**: September 2025
**Version**: 1.0
**Maintainer**: Development Team