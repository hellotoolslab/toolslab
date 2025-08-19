# Claude.md - OctoTools Complete Implementation Guide

## 🎯 Project Overview

You are building **OctoTools** - a user-centric developer toolbox focused on real workflows and task chaining. The project monetizes through privacy-focused advertising (EthicalAds) and optional Pro features ($2.99/month).

**Core Principle**: Dual Mode Approach - Serve both single-task users (90%) and workflow power users (10%) without forcing either path.

**URL**: octotools.org  
**Tagline**: "Developer Tools That Actually Work - Chain, Batch, Share"  
**Business Model**: 100% free forever + EthicalAds + Donations + Optional Pro ($2.99/mo)  
**Tech Stack**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui + Zustand

## 🏗️ Project Structure (Next.js)

```
octotools/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with providers
│   ├── page.tsx             # Homepage (SSG)
│   ├── tools/
│   │   ├── [tool]/
│   │   │   ├── page.tsx     # Dynamic tool pages (SSG)
│   │   │   └── loading.tsx  # Loading state
│   │   └── layout.tsx
│   ├── api/
│   │   ├── tools/           # API endpoints for each tool
│   │   └── pro/             # Pro features API
│   └── globals.css
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── tools/               # Tool-specific components
│   ├── ads/                 # EthicalAds components
│   ├── analytics/           # Umami analytics components
│   ├── workspace/           # Workspace mode components
│   └── layout/
├── lib/
│   ├── tools/               # Tool logic (pure functions)
│   │   ├── json/
│   │   ├── base64/
│   │   └── shared/
│   ├── workers/             # Web Worker files
│   ├── store/               # Zustand stores
│   └── utils/
├── public/
│   └── workers/             # Web Worker scripts
└── package.json
```

## 🎨 Design System Implementation

### Color Categories System

Each tool category has a distinct color that propagates throughout its ecosystem:

```typescript
// lib/utils/categoryColors.ts
export const CATEGORIES = {
  'data-conversion': {
    name: 'Data & Conversion',
    color: '#0EA5E9', // Ocean Blue
    tools: ['json-formatter', 'csv-json', 'xml-json'],
    icon: '📊',
    gradient: 'from-sky-400 to-blue-600',
    bgLight: 'bg-sky-50',
    bgDark: 'bg-sky-950/20',
    borderColor: 'border-sky-500'
  },
  'encoding-security': {
    name: 'Encoding & Security',
    color: '#10B981', // Emerald Green
    tools: ['base64', 'jwt-decoder', 'hash-generator'],
    icon: '🔐',
    gradient: 'from-emerald-400 to-green-600',
    bgLight: 'bg-emerald-50',
    bgDark: 'bg-emerald-950/20',
    borderColor: 'border-emerald-500'
  },
  'text-format': {
    name: 'Text & Format',
    color: '#8B5CF6', // Purple
    tools: ['case-converter', 'text-diff', 'word-counter'],
    icon: '📝',
    gradient: 'from-violet-400 to-purple-600',
    bgLight: 'bg-violet-50',
    bgDark: 'bg-violet-950/20',
    borderColor: 'border-violet-500'
  },
  'generators': {
    name: 'Generators',
    color: '#F97316', // Orange
    tools: ['uuid-generator', 'password-generator', 'lorem-ipsum'],
    icon: '⚡',
    gradient: 'from-orange-400 to-orange-600',
    bgLight: 'bg-orange-50',
    bgDark: 'bg-orange-950/20',
    borderColor: 'border-orange-500'
  },
  'web-design': {
    name: 'Web & Design',
    color: '#EC4899', // Pink/Fuchsia
    tools: ['color-picker', 'css-minifier', 'meta-tags'],
    icon: '🎨',
    gradient: 'from-pink-400 to-fuchsia-600',
    bgLight: 'bg-pink-50',
    bgDark: 'bg-pink-950/20',
    borderColor: 'border-pink-500'
  },
  'dev-utilities': {
    name: 'Dev Utilities',
    color: '#F59E0B', // Amber Yellow
    tools: ['regex-tester', 'timestamp-converter', 'sql-formatter'],
    icon: '🛠️',
    gradient: 'from-amber-400 to-yellow-600',
    bgLight: 'bg-amber-50',
    bgDark: 'bg-amber-950/20',
    borderColor: 'border-amber-500'
  }
};
```

### Design Tokens (Tailwind Config)

```javascript
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
```

## 📦 Component Specifications

### 1. Root Layout with Providers

```typescript
// app/layout.tsx
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider>
          <UmamiProvider>
            <Header />
            <main>{children}</main>
            <Footer />
            <DonationWidget />
          </UmamiProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### 2. Zustand Store Configuration

```typescript
// lib/store/toolStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ToolOperation {
  id: string;
  tool: string;
  input: string;
  output: string;
  timestamp: number;
}

interface ToolStore {
  history: ToolOperation[];
  chainedData: any;
  workspace: WorkspacePanel[];
  userLevel: 'first_time' | 'returning' | 'power';
  proUser: boolean;
  
  addToHistory: (operation: ToolOperation) => void;
  setChainedData: (data: any) => void;
  updateUserLevel: () => void;
}

export const useToolStore = create<ToolStore>()(
  persist(
    (set, get) => ({
      history: [],
      chainedData: null,
      workspace: [],
      userLevel: 'first_time',
      proUser: false,
      
      addToHistory: (operation) => {
        set((state) => ({
          history: [...state.history.slice(-19), operation]
        }));
        get().updateUserLevel();
      },
      
      setChainedData: (data) => set({ chainedData: data }),
      
      updateUserLevel: () => {
        const usage = get().history.length;
        set({
          userLevel: usage < 2 ? 'first_time' : usage < 5 ? 'returning' : 'power'
        });
      }
    }),
    {
      name: 'octotools-storage',
    }
  )
);
```

### 3. Homepage with Tool Grid

```typescript
// app/page.tsx
export default function HomePage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Developer Tools That Actually Work
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          No signup. No limits. Just tools.
        </p>
        
        {/* Quick Search */}
        <div className="mt-8 max-w-2xl mx-auto">
          <SearchBar />
        </div>
      </section>
      
      {/* Tool Categories */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {Object.entries(CATEGORIES).map(([key, category]) => (
          <CategoryCard key={key} category={category} />
        ))}
      </section>
      
      {/* Popular Tools */}
      <section>
        <h2 className="text-2xl font-bold mb-6">Most Used Tools</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {POPULAR_TOOLS.map(tool => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </section>
    </div>
  );
}
```

### 4. Tool Card Component

```typescript
// components/ui/ToolCard.tsx
export function ToolCard({ tool }) {
  const category = getCategoryForTool(tool.id);
  
  return (
    <Link href={`/tools/${tool.id}`}>
      <div className={`
        relative p-6 rounded-xl border bg-white dark:bg-gray-900
        hover:-translate-y-1 hover:shadow-xl transition-all duration-200
        border-t-4 ${category.borderColor}
        group cursor-pointer
      `}>
        {/* Category color accent bar */}
        <div className={`absolute top-0 left-0 right-0 h-1 ${category.gradient} rounded-t-xl`} />
        
        {/* Icon with category color background */}
        <div className={`
          w-12 h-12 rounded-lg ${category.bgLight} dark:${category.bgDark}
          flex items-center justify-center mb-4
          group-hover:scale-110 transition-transform
        `}>
          <span className="text-2xl">{tool.icon}</span>
        </div>
        
        {/* Tool name and description */}
        <h3 className="font-semibold text-lg mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400">
          {tool.name}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {tool.description}
        </p>
        
        {/* Usage stats */}
        {tool.dailyUses > 1000 && (
          <div className="mt-4 flex items-center gap-2">
            <span className="text-xs bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 px-2 py-1 rounded-full">
              🔥 Popular
            </span>
            <span className="text-xs text-gray-500">
              {formatNumber(tool.dailyUses)} uses today
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}
```

### 5. Tool Page Layout (SSG)

```typescript
// app/tools/[tool]/page.tsx
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { ToolComponent } from '@/components/tools/ToolComponent';
import { TOOLS_CONFIG } from '@/lib/config/tools';
import { EthicalAd } from '@/components/ads/EthicalAd';

interface Props {
  params: { tool: string };
}

export async function generateStaticParams() {
  return Object.keys(TOOLS_CONFIG).map((tool) => ({
    tool,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const toolConfig = TOOLS_CONFIG[params.tool];
  
  if (!toolConfig) return {};
  
  return {
    title: `${toolConfig.name} - Free Online ${toolConfig.function} | OctoTools`,
    description: toolConfig.description,
    keywords: toolConfig.keywords,
  };
}

export default function ToolPage({ params }: Props) {
  const toolConfig = TOOLS_CONFIG[params.tool];
  if (!toolConfig) notFound();
  
  const category = getCategoryForTool(params.tool);
  
  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <nav className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-2 text-sm">
          <Link href="/">Home</Link>
          <span>/</span>
          <Link href={`/category/${category.id}`} className={`text-${category.color}`}>
            {category.name}
          </Link>
          <span>/</span>
          <span>{toolConfig.name}</span>
        </div>
      </nav>
      
      {/* Tool Header */}
      <div className="container mx-auto px-4 pb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className={`
            w-16 h-16 rounded-xl ${category.bgLight} dark:${category.bgDark}
            flex items-center justify-center
          `}>
            <span className="text-3xl">{toolConfig.icon}</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              {toolConfig.name}
              <span className={`
                text-xs px-3 py-1 rounded-full
                bg-gradient-to-r ${category.gradient} text-white
              `}>
                {category.name}
              </span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              {toolConfig.description}
            </p>
          </div>
        </div>
        
        {/* Ad Slot - Header */}
        <EthicalAd placement="header" />
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Tool Workspace - Main Column */}
          <div className="lg:col-span-3">
            <div className={`
              bg-white dark:bg-gray-900 rounded-xl border
              border-t-4 ${category.borderColor}
              p-6 shadow-lg
            `}>
              <ToolComponent config={toolConfig} category={category} />
            </div>
            
            {/* How to Use Section */}
            <div className="mt-8">
              <HowToUse tool={toolConfig} />
            </div>
            
            {/* FAQ Section */}
            <div className="mt-8">
              <FAQ tool={toolConfig} />
            </div>
          </div>
          
          {/* Sidebar - Desktop Only */}
          <aside className="hidden lg:block">
            <div className="sticky top-20 space-y-6">
              {/* Related Tools */}
              <div className="bg-white dark:bg-gray-900 rounded-xl border p-4">
                <h3 className="font-semibold mb-4">Related Tools</h3>
                <RelatedTools currentTool={params.tool} category={category} />
              </div>
              
              {/* Ad Slot - Sidebar */}
              <EthicalAd placement="sidebar" />
              
              {/* Pro Features */}
              <ProFeatureCard />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
```

### 6. Web Worker Integration

```typescript
// lib/workers/toolWorker.ts
import * as Comlink from 'comlink';

class ToolProcessor {
  async formatJSON(input: string): Promise<{ success: boolean; result?: string; error?: string }> {
    try {
      const parsed = JSON.parse(input);
      return {
        success: true,
        result: JSON.stringify(parsed, null, 2)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async minifyJSON(input: string): Promise<{ success: boolean; result?: string; error?: string }> {
    try {
      const parsed = JSON.parse(input);
      return {
        success: true,
        result: JSON.stringify(parsed)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
  
  async batchProcess<T>(items: T[], processor: (item: T) => Promise<any>) {
    const results = [];
    for (const item of items) {
      results.push(await processor(item));
    }
    return results;
  }
}

Comlink.expose(new ToolProcessor());
```

## 💰 Monetization Strategy

### EthicalAds Integration

```typescript
// components/ads/EthicalAd.tsx
import { useToolStore } from '@/lib/store/toolStore';

export function EthicalAd({ placement }: { placement: 'header' | 'sidebar' | 'footer' }) {
  const { userLevel, proUser } = useToolStore();
  
  // Don't show ads to:
  // - Pro users
  // - First-time users (on header placement)
  if (proUser) return null;
  if (userLevel === 'first_time' && placement === 'header') return null;
  
  // Only show if ads are enabled
  if (process.env.NEXT_PUBLIC_ENABLE_ADS !== 'true') return null;
  
  const sizes = {
    header: '728x90',
    sidebar: '300x250',
    footer: '728x90'
  };
  
  return (
    <div className={`ethical-ad ad-${placement} my-4`}>
      <div 
        data-ea-publisher={process.env.NEXT_PUBLIC_ETHICAL_ADS_PUBLISHER}
        data-ea-type={sizes[placement]}
        className="bordered rounded-lg"
      />
    </div>
  );
}
```

### Umami Analytics Integration

```typescript
// components/analytics/UmamiProvider.tsx
'use client';

import Script from 'next/script';
import { createContext, useContext } from 'react';

const UmamiContext = createContext({});

export function UmamiProvider({ children }: { children: React.ReactNode }) {
  const logToolAction = (tool: string, action: string, success: boolean, metadata?: any) => {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track(`tool-${action}`, {
        tool,
        success,
        ...metadata
      });
    }
  };
  
  const trackPerformance = (tool: string, action: string, duration: number) => {
    if (typeof window !== 'undefined' && window.umami) {
      window.umami.track('performance', {
        tool,
        action,
        duration
      });
    }
  };
  
  return (
    <UmamiContext.Provider value={{ logToolAction, trackPerformance }}>
      <Script
        async
        src={process.env.NEXT_PUBLIC_UMAMI_SCRIPT_URL}
        data-website-id={process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID}
        data-host-url={process.env.NEXT_PUBLIC_UMAMI_HOST_URL}
      />
      {children}
    </UmamiContext.Provider>
  );
}

export const useUmami = () => useContext(UmamiContext);
```

### Pro Features ($2.99/month)

```typescript
// components/ProFeatureCard.tsx
interface ProFeatures {
  unlimited_history: boolean;
  api_access: boolean;
  no_ads: boolean;
  custom_workspace: boolean;
  priority_processing: boolean;
  export_formats: string[];
  team_workspace?: boolean;
}

export function ProFeatureCard() {
  const { proUser } = useToolStore();
  
  if (proUser) {
    return <ProUserDashboard />;
  }
  
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
      <h3 className="text-xl font-bold mb-4">OctoTools Pro</h3>
      <p className="text-2xl font-bold mb-4">$2.99/month</p>
      
      <ul className="space-y-2 mb-6">
        <li>✓ No ads</li>
        <li>✓ Unlimited history</li>
        <li>✓ API access (1000 calls/day)</li>
        <li>✓ Priority processing</li>
        <li>✓ Custom workspaces</li>
        <li>✓ Export to multiple formats</li>
      </ul>
      
      <button className="w-full bg-white text-blue-600 font-semibold py-2 px-4 rounded-lg hover:bg-gray-100">
        Upgrade to Pro
      </button>
      
      <p className="text-xs text-white/80 mt-4">
        Cancel anytime. Supports development.
      </p>
    </div>
  );
}
```

## 🛠️ Tool Implementations

### Tool Component Template

```typescript
// components/tools/ToolComponent.tsx
'use client';

import { useState, useEffect } from 'react';
import { useToolStore } from '@/lib/store/toolStore';
import { useUmami } from '@/components/analytics/UmamiProvider';
import CodeMirror from '@uiw/react-codemirror';

export function ToolComponent({ config, category }) {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const { addToHistory, setChainedData } = useToolStore();
  const { logToolAction, trackPerformance } = useUmami();
  
  const handleProcess = async () => {
    const startTime = Date.now();
    setProcessing(true);
    setError(null);
    
    try {
      // Use Web Worker for processing
      const worker = new Worker(
        new URL('@/lib/workers/toolWorker.ts', import.meta.url)
      );
      
      const result = await processWithWorker(worker, input, config.processor);
      
      setOutput(result);
      
      // Track success
      logToolAction(config.id, 'process', true, {
        inputSize: input.length,
        outputSize: result.length
      });
      
      // Track performance
      trackPerformance(config.id, 'process', Date.now() - startTime);
      
      // Add to history
      addToHistory({
        id: Date.now().toString(),
        tool: config.id,
        input,
        output: result,
        timestamp: Date.now()
      });
      
      // Set chained data for next tool
      setChainedData(result);
      
    } catch (err) {
      setError(err.message);
      logToolAction(config.id, 'process', false, {
        error: err.message
      });
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium mb-2">
          <span>{config.inputIcon}</span>
          Input
        </label>
        <div className={`
          relative border-2 rounded-lg overflow-hidden
          focus-within:ring-2 focus-within:ring-${category.color}/20
          border-gray-200 dark:border-gray-700
          focus-within:border-${category.color}
        `}>
          <CodeMirror
            value={input}
            onChange={setInput}
            height="200px"
            theme="dark"
            extensions={[config.language()]}
            placeholder={config.placeholder}
          />
          <div className="absolute bottom-2 right-2 text-xs text-gray-500">
            {input.length} characters
          </div>
        </div>
      </div>
      
      {/* Action Bar */}
      <div className="flex gap-4">
        <button
          onClick={handleProcess}
          disabled={!input || processing}
          className={`
            px-6 py-2 rounded-lg font-medium
            bg-gradient-to-r ${category.gradient} text-white
            hover:shadow-lg transform hover:scale-[1.02] transition-all
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          {processing ? 'Processing...' : config.actionLabel}
        </button>
        
        <button
          onClick={() => {
            setInput('');
            setOutput('');
            setError(null);
          }}
          className="px-6 py-2 rounded-lg font-medium border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Clear
        </button>
        
        {config.hasOptions && (
          <button className="px-6 py-2 rounded-lg font-medium border-2 hover:bg-gray-50 dark:hover:bg-gray-800">
            Options
          </button>
        )}
      </div>
      
      {/* Error Display */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 rounded-lg">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      )}
      
      {/* Output Section */}
      {output && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium mb-2">
            <span>{config.outputIcon}</span>
            Output
          </label>
          <div className={`
            relative border-2 rounded-lg overflow-hidden
            border-gray-200 dark:border-gray-700
          `}>
            <CodeMirror
              value={output}
              height="200px"
              theme="dark"
              extensions={[config.language()]}
              editable={false}
            />
            <div className="absolute top-2 right-2 flex gap-2">
              <CopyButton text={output} />
              <button className="px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded text-sm hover:bg-gray-200 dark:hover:bg-gray-700">
                Download
              </button>
            </div>
          </div>
          
          {/* Tool Chaining Suggestions */}
          <ToolChainingSuggestions output={output} currentTool={config.id} />
        </div>
      )}
    </div>
  );
}
```

## 🚀 Performance Optimizations

### 1. Static Site Generation

```typescript
// All tool pages are pre-rendered at build time
export async function generateStaticParams() {
  return TOOLS.map(tool => ({ tool: tool.id }));
}
```

### 2. Code Splitting

```typescript
// Dynamic imports for heavy libraries
const CodeMirror = dynamic(() => import('@uiw/react-codemirror'), {
  ssr: false,
  loading: () => <div className="h-48 animate-pulse bg-gray-100" />
});
```

### 3. Web Workers for Processing

```typescript
// Move heavy operations to workers
const worker = new Worker(
  new URL('../workers/processor.worker.ts', import.meta.url)
);
```

## 📱 Responsive Design

### Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 1024px (md)
- Desktop: > 1024px (lg)

### Mobile Optimizations
```css
/* Stack input/output vertically on mobile */
@media (max-width: 640px) {
  .tool-layout {
    grid-template-columns: 1fr;
  }
  
  /* Sticky action bar */
  .action-bar {
    position: sticky;
    bottom: 0;
    background: white;
    padding: 1rem;
    box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
  }
  
  /* Full-width buttons */
  .action-bar button {
    width: 100%;
  }
}
```

## 🔍 SEO Implementation

### Meta Tags

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const tool = TOOLS_CONFIG[params.tool];
  
  return {
    title: `${tool.name} - Free Online ${tool.function} | OctoTools`,
    description: tool.seoDescription,
    keywords: tool.keywords,
    openGraph: {
      title: tool.name,
      description: tool.description,
      type: 'website',
      url: `https://octotools.org/tools/${params.tool}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: tool.name,
      description: tool.description,
    },
    alternates: {
      canonical: `https://octotools.org/tools/${params.tool}`,
    },
  };
}
```

## 🚦 Implementation Timeline

### Phase 1: MVP (Days 1-4)
1. Next.js setup with TypeScript
2. Design system implementation
3. 7 core tools (SSG):
   - JSON Formatter (165k searches/month)
   - Base64 Encoder/Decoder (246k searches/month)
   - URL Encoder/Decoder (89k searches/month)
   - JWT Decoder (60k searches/month)
   - UUID Generator (45k searches/month)
   - Hash Generators
   - Timestamp Converter

### Phase 2: Enhancement (Days 5-7)
1. Zustand state management
2. Tool chaining system
3. Progressive disclosure
4. Umami analytics
5. EthicalAds integration (disabled initially)

### Phase 3: Expansion (Days 8-14)
1. Workspace mode for power users
2. Web Worker optimizations
3. Pro subscription system
4. API endpoints
5. PWA capabilities

## 📋 Development Commands

```bash
# Create project
npx create-next-app@latest octotools --typescript --tailwind --app --src-dir --import-alias "@/*"
cd octotools

# Install dependencies
npm install zustand @codemirror/lang-json @codemirror/lang-sql codemirror comlink
npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge
npm install sharp sql-formatter papaparse
npm install -D @types/node

# Setup shadcn/ui
npx shadcn-ui@latest init
npx shadcn-ui@latest add button input textarea card toast tabs

# Development
npm run dev

# Build
npm run build

# Deploy to Vercel
vercel --prod
```

## 🎯 Success Metrics

### User Experience
- Core Web Vitals: LCP < 2.5s, FID < 100ms, CLS < 0.1
- Task Completion Rate: >95%
- Return Rate: 40%+ within 30 days
- Tool Chaining Adoption: 10% of users

### Monetization
- Month 1: $15 (donations only, ads disabled)
- Month 2: $150 (ads enabled + donations)
- Month 3: $370 (ads + donations + pro)
- Month 6: $740 (sustainable growth)
- Month 12: $1,700 (target achieved)

## 🔧 Environment Variables

```bash
# .env.local
NEXT_PUBLIC_ENABLE_ADS=false  # Set to true after Month 1
NEXT_PUBLIC_ETHICAL_ADS_PUBLISHER=your-publisher-id
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js
NEXT_PUBLIC_UMAMI_HOST_URL=https://analytics.umami.is
STRIPE_SECRET_KEY=your-stripe-secret
STRIPE_PRICE_ID=price_xxx  # $2.99/month subscription
```

## 🎨 Visual Identity

### Octopus Theme
- Logo: Animated SVG octopus with moving tentacles
- Each tentacle represents a tool category
- Loading states: Tentacle wave animation
- 404 page: "This tentacle couldn't reach that page"
- Success messages: "Tentacular!", "Ink-redible!"

### UI Personality
- Professional but playful
- Clean but not sterile  
- Modern but not trendy
- Fast but not rushed
- Helpful but not pushy

## 📝 Important Notes

1. **Performance First**: Never compromise speed for features
2. **Progressive Enhancement**: Start simple, add complexity for power users
3. **Non-invasive Ads**: EthicalAds only, disabled for first-time users
4. **Mobile Experience**: Must work perfectly on all devices
5. **Privacy Focused**: Umami analytics (no cookies), EthicalAds (no tracking)
6. **SEO Optimized**: SSG for all tool pages, proper meta tags
7. **Accessibility**: WCAG AA compliant, keyboard navigation
8. **Open Source Ready**: Clean code, well-documented

## 🚀 Launch Checklist

- [ ] Domain configured (octotools.org)
- [ ] SSL certificate active
- [ ] All 7 MVP tools working perfectly
- [ ] Mobile experience tested
- [ ] Dark mode working
- [ ] Umami analytics configured
- [ ] EthicalAds account approved (but disabled)
- [ ] Donation system integrated
- [ ] SEO meta tags complete
- [ ] Sitemap generated
- [ ] Performance optimized (Lighthouse >90)
- [ ] Deployed to Vercel
- [ ] Error tracking setup (Sentry free tier)

---

**Remember**: The goal is to create developer tools that are so good, so fast, and so pleasant to use that developers bookmark them and return daily. Focus on speed, simplicity, and delight in equal measure.