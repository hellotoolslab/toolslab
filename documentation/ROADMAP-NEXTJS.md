# OctoTools Next.js Development Roadmap

## 🚀 Quick Start Commands

```bash
# Create Next.js project with all optimizations
npx create-next-app@latest octotools --typescript --tailwind --app --src-dir --import-alias "@/*"
cd octotools

# Install core dependencies
npm install zustand @codemirror/lang-json @codemirror/lang-sql codemirror comlink
npm install @radix-ui/react-* class-variance-authority clsx tailwind-merge
npm install sharp sql-formatter papaparse
npm install -D @types/node

# Install shadcn/ui CLI
npx shadcn-ui@latest init

# Add shadcn components
npx shadcn-ui@latest add button input textarea card toast tabs

# Development
npm run dev

# Build for production
npm run build
npm run start
```

## 📅 Development Timeline (Optimized for Next.js)

### Day 1: Next.js Foundation & First Tool (5 hours)

#### Morning Session (3 hours)
```bash
# Project setup
npx create-next-app@latest octotools --typescript --tailwind --app
cd octotools
npm install zustand comlink @codemirror/lang-json codemirror
```

**Tasks:**
- [ ] Setup Next.js with TypeScript
- [ ] Configure Tailwind + shadcn/ui
- [ ] Create layout with dark mode toggle
- [ ] Setup Zustand store
- [ ] Homepage with tool grid (SSG)
- [ ] SEO component setup

#### Afternoon Session (2 hours)
- [ ] JSON Formatter tool (complete)
- [ ] Web Worker integration for JSON
- [ ] Deploy to Vercel (preview)

---

## 🤖 Claude Code Prompts (Next.js Optimized)

### Prompt 1: Next.js Foundation with Zustand

```
Create a Next.js 14 application called OctoTools with App Router, TypeScript, and Tailwind CSS.

Project Structure:
```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx           # Homepage
├── tools/
│   ├── [tool]/
│   │   ├── page.tsx   # Dynamic tool pages
│   │   └── loading.tsx
│   └── layout.tsx
├── api/
│   └── tools/
└── globals.css

components/
├── ui/               # shadcn/ui components
├── tools/           # Tool components
├── layout/          # Header, Footer
└── providers/       # Theme, Store providers

lib/
├── store/           # Zustand stores
├── tools/           # Tool logic
├── workers/         # Web Workers
└── utils/
```

Core Features:
1. Homepage with tool grid (use generateStaticParams for SSG)
2. Dark mode with next-themes
3. Zustand store for:
   - Tool history
   - User level tracking
   - Chained data between tools
   - Workspace state
4. Responsive header with navigation
5. Tool cards with hover effects

Setup Zustand store (lib/store/toolStore.ts):
```typescript
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
  userLevel: 'first_time' | 'returning' | 'power';
  
  addToHistory: (operation: ToolOperation) => void;
  setChainedData: (data: any) => void;
  getUserLevel: () => 'first_time' | 'returning' | 'power';
}
```

Create these pages:
- Homepage: Grid of tool cards, search functionality
- Tool template: Dynamic [tool] route
- 404 page with octopus theme

Use these tools array for initial setup:
- JSON Formatter (json-formatter)
- Base64 Encoder/Decoder (base64)
- URL Encoder/Decoder (url-encode)
- JWT Decoder (jwt)
- UUID Generator (uuid)
- Hash Generator (hash)
- Timestamp Converter (timestamp)

Each tool should have:
- Name, description, icon, keywords
- Route path
- Search volume (for prioritization)

Implement SEO with generateMetadata for each tool page.
```

### Prompt 2: JSON Formatter with Web Workers

```
Create a JSON Formatter tool for the Next.js OctoTools app with Web Worker processing.

Structure:
1. app/tools/json-formatter/page.tsx - SSG page
2. components/tools/JsonFormatter.tsx - Client component
3. lib/workers/jsonWorker.ts - Web Worker
4. lib/tools/json.ts - Pure logic functions

Features:
- CodeMirror 6 editor for input/output
- Format, minify, validate functions
- Web Worker for processing (using Comlink)
- Error highlighting with line numbers
- Copy to clipboard with toast notification
- Download as file
- Character/line count
- Sample JSON button

Web Worker Setup (lib/workers/jsonWorker.ts):
```typescript
import * as Comlink from 'comlink';

class JSONProcessor {
  format(input: string): { success: boolean; result?: string; error?: string } {
    try {
      const parsed = JSON.parse(input);
      return {
        success: true,
        result: JSON.stringify(parsed, null, 2)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        line: this.getErrorLine(error.message)
      };
    }
  }
  
  minify(input: string): { success: boolean; result?: string; error?: string } {
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
  
  validate(input: string): { valid: boolean; error?: string } {
    try {
      JSON.parse(input);
      return { valid: true };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }
}

Comlink.expose(new JSONProcessor());
```

Component features:
- Real-time validation as user types (debounced)
- Syntax highlighting for JSON
- Dark mode support
- Mobile responsive (stack editors vertically)
- Tool chaining suggestions if JWT detected
- Save to history in Zustand

SEO Content (server-side rendered):
- H1: JSON Formatter & Validator
- Description of tool
- How to use section
- Common use cases
- FAQ with structured data

Performance:
- Use dynamic import for CodeMirror
- Lazy load Web Worker
- Virtual scrolling for large JSON
- Debounce validation
```

### Prompt 3: Tool Chaining System

```
Implement a tool chaining system for OctoTools using Zustand and Next.js navigation.

Core Features:
1. Smart detection of output types
2. Suggested next tools based on output
3. Direct data passing between tools
4. URL parameters for tool initialization

Implementation:

1. Create lib/utils/formatDetector.ts:
```typescript
export function detectFormat(input: string): {
  type: string;
  confidence: number;
  suggestedTools: string[];
} {
  // Check for JWT
  if (/^eyJ[\w-]+\.eyJ[\w-]+\.[\w-]+$/.test(input)) {
    return {
      type: 'jwt',
      confidence: 0.95,
      suggestedTools: ['jwt-decoder', 'base64']
    };
  }
  
  // Check for Base64
  if (/^[A-Za-z0-9+/]+=*$/.test(input) && input.length % 4 === 0) {
    return {
      type: 'base64',
      confidence: 0.8,
      suggestedTools: ['base64', 'url-encoder']
    };
  }
  
  // Check for JSON
  try {
    JSON.parse(input);
    return {
      type: 'json',
      confidence: 0.9,
      suggestedTools: ['json-formatter', 'jwt-decoder']
    };
  } catch {}
  
  // Add more detections...
}
```

2. Create components/ToolChainSuggestions.tsx:
- Shows after successful tool operation
- Progressive disclosure based on user level
- Smooth transitions
- Pass data via Zustand chainedData

3. Update tool pages to accept URL params:
```typescript
// app/tools/[tool]/page.tsx
export default function ToolPage({ 
  params, 
  searchParams 
}: { 
  params: { tool: string };
  searchParams: { [key: string]: string };
}) {
  // Handle searchParams.input, searchParams.data, etc.
  // Pre-populate tool with chained data
}
```

4. Create useToolChaining hook:
- Manages data flow between tools
- Tracks chain history
- Suggests workflow templates
- Handles URL parameter generation

5. Add keyboard shortcuts:
- Cmd+Enter: Process
- Cmd+Shift+C: Copy result
- Cmd+K: Command palette
- Arrow keys: Navigate suggestions

UI Components:
- Suggestion cards with tool icons
- Data flow visualization (optional)
- "Continue with" button group
- Workflow save option for power users
```

### Prompt 4: Workspace Mode Implementation

```
Create a Workspace Mode for power users in OctoTools using react-resizable-panels.

Features:
1. Split screen with 2-4 tool panels
2. Resizable panels (horizontal/vertical)
3. Data sharing between panels
4. Save/load workspace layouts
5. Only show to power users (5+ tool uses)

Implementation:

1. Install dependencies:
```bash
npm install react-resizable-panels
```

2. Create components/workspace/WorkspaceMode.tsx:
```typescript
import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { useToolStore } from '@/lib/store/toolStore';

interface WorkspacePanel {
  id: string;
  tool: string;
  size: number;
  data?: any;
}

export function WorkspaceMode() {
  const { userLevel } = useToolStore();
  const [panels, setPanels] = useState<WorkspacePanel[]>([
    { id: '1', tool: 'json-formatter', size: 50 },
    { id: '2', tool: 'jwt-decoder', size: 50 }
  ]);
  
  // Progressive disclosure - only for power users
  if (userLevel !== 'power') return null;
  
  return (
    <div className="h-screen">
      <WorkspaceHeader 
        onSave={saveWorkspace}
        onLoad={loadWorkspace}
        onAddPanel={addPanel}
      />
      
      <PanelGroup direction="horizontal">
        {panels.map((panel, index) => (
          <React.Fragment key={panel.id}>
            <Panel defaultSize={panel.size} minSize={20}>
              <WorkspacePanel 
                panel={panel}
                onDataChange={(data) => shareData(panel.id, data)}
              />
            </Panel>
            {index < panels.length - 1 && (
              <PanelResizeHandle className="w-2 bg-gray-200 hover:bg-blue-500" />
            )}
          </React.Fragment>
        ))}
      </PanelGroup>
    </div>
  );
}
```

3. Create WorkspacePanel component:
- Tool selector dropdown
- Full tool functionality
- Data input/output connectors
- Minimize/maximize/close buttons

4. Add workspace templates:
```typescript
const WORKSPACE_TEMPLATES = {
  'api-debugging': {
    name: 'API Debugging',
    panels: [
      { tool: 'json-formatter', size: 40 },
      { tool: 'jwt-decoder', size: 30 },
      { tool: 'base64', size: 30 }
    ]
  },
  'data-processing': {
    name: 'Data Processing',
    panels: [
      { tool: 'csv-json', size: 33 },
      { tool: 'json-formatter', size: 33 },
      { tool: 'sql-formatter', size: 34 }
    ]
  }
};
```

5. Data sharing between panels:
- Use Zustand for workspace state
- Visual indicators for data flow
- Drag & drop data between panels
- Auto-update linked panels

6. Persistence:
- Save workspace layouts to localStorage
- Quick workspace switcher
- Export/import workspace configs
```

### Prompt 5: Performance Optimization & PWA

```
Optimize OctoTools for performance and add PWA capabilities.

1. Web Workers for all heavy processing:

Create lib/workers/toolWorker.ts:
```typescript
import * as Comlink from 'comlink';
import { formatSQL } from 'sql-formatter';
import Papa from 'papaparse';

class ToolWorker {
  // JSON operations
  async processJSON(input: string, operation: 'format' | 'minify' | 'validate') {
    // Process in worker thread
  }
  
  // SQL formatting
  async formatSQL(query: string, dialect: string) {
    return formatSQL(query, { language: dialect });
  }
  
  // CSV processing
  async parseCSV(input: string, options: Papa.ParseConfig) {
    return Papa.parse(input, options);
  }
  
  // Batch operations
  async batchProcess(items: any[], processor: string, options: any) {
    const results = [];
    for (const item of items) {
      results.push(await this[processor](item, options));
    }
    return results;
  }
}

Comlink.expose(new ToolWorker());
```

2. Image optimization with Sharp WASM:
```typescript
// lib/workers/imageWorker.ts
import init, { compress_image, convert_format } from '@/lib/wasm/image_processor';

class ImageWorker {
  constructor() {
    init(); // Initialize WASM
  }
  
  async convertImage(buffer: ArrayBuffer, format: string, quality: number) {
    const input = new Uint8Array(buffer);
    return convert_format(input, format, quality);
  }
  
  async compressImage(buffer: ArrayBuffer, maxSize: number) {
    const input = new Uint8Array(buffer);
    return compress_image(input, maxSize);
  }
}
```

3. PWA Configuration:

Create public/manifest.json:
```json
{
  "name": "OctoTools - Developer Tools",
  "short_name": "OctoTools",
  "description": "Developer tools that actually work",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#3B82F6",
  "background_color": "#ffffff",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

4. Service Worker (public/sw.js):
```javascript
const CACHE_NAME = 'octotools-v1';
const urlsToCache = [
  '/',
  '/tools/json-formatter',
  '/tools/base64',
  // ... other static routes
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
```

5. Performance optimizations:
- Lazy load tools with dynamic imports
- Virtual scrolling for large data
- Debounce/throttle user inputs
- Preload critical fonts
- Use next/font for font optimization
- Image lazy loading with next/image
- Code splitting per route

6. Monitoring:
- Integrate Vercel Analytics
- Add Web Vitals tracking
- Error boundary components
- Sentry for error tracking
```

### Prompt 6: Monetization & Analytics Integration

```
Add monetization with EthicalAds and analytics with Plausible to OctoTools.

1. EthicalAds Integration (Already Created):

The EthicalAd component is ready in components/ads/EthicalAd.tsx with:
```typescript
- Environment variable toggle (NEXT_PUBLIC_ENABLE_ADS)
- Progressive disclosure (no ads for first-time users)
- Multiple placement options (header, sidebar, footer)
- Error handling and fallbacks
- Dismissible option for better UX

Usage in pages:
```typescript
import { EthicalAd } from '@/components/ads/EthicalAd';

// In your component
<EthicalAd placement="sidebar" />

// For testing with first-time users
<EthicalAd placement="header" force={true} />
```

2. Analytics with Plausible (Already Created):

The PlausibleProvider is ready in components/analytics/PlausibleProvider.tsx with:
- Automatic pageview tracking
- Custom event tracking
- Tool usage metrics
- Conversion tracking
- Error tracking

Usage:
```typescript
import { usePlausible } from '@/components/analytics/PlausibleProvider';

const { logToolAction, trackConversion } = usePlausible();

// Track tool usage
logToolAction('json-formatter', 'format', true, {
  inputSize: 1024,
  duration: 150
});

// Track conversions
trackConversion('donation', 5.00);
```

3. Pro Features System:

Create app/api/pro/route.ts:
```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: NextRequest) {
  const { email } = await request.json();
  
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price: process.env.STRIPE_PRICE_ID, // $2.99/month
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: `${request.headers.get('origin')}/pro/success`,
      cancel_url: `${request.headers.get('origin')}/pro/cancel`,
      customer_email: email,
    });
    
    return NextResponse.json({ sessionId: session.id });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
```

3. Pro Features Component:
```typescript
// components/ProFeatures.tsx
export function ProFeatures() {
  const { proUser } = useToolStore();
  
  if (proUser) {
    return <ProUserDashboard />;
  }
  
  return (
    <Card className="p-6 bg-gradient-to-r from-blue-500 to-purple-600">
      <h3 className="text-white text-xl font-bold mb-4">
        OctoTools Pro - $2.99/month
      </h3>
      
      <ul className="text-white space-y-2 mb-6">
        <li>✓ No ads</li>
        <li>✓ Unlimited history</li>
        <li>✓ API access (1000 calls/day)</li>
        <li>✓ Priority processing</li>
        <li>✓ Custom workspaces</li>
        <li>✓ Export to multiple formats</li>
      </ul>
      
      <Button 
        onClick={subscribeToPro}
        className="w-full bg-white text-blue-600"
      >
        Upgrade to Pro
      </Button>
      
      <p className="text-xs text-white/80 mt-4">
        Cancel anytime. Supports development.
      </p>
    </Card>
  );
}
```

4. Donation Widget:
```typescript
// components/DonationWidget.tsx
export function DonationWidget() {
  const [showThankYou, setShowThankYou] = useState(false);
  
  return (
    <div className="fixed bottom-4 right-4">
      <Button
        className="bg-yellow-500 hover:bg-yellow-600"
        onClick={() => window.open('https://buymeacoffee.com/octotools')}
      >
        <Coffee className="mr-2" />
        Buy me a coffee
      </Button>
      
      {showThankYou && (
        <div className="absolute bottom-full mb-2 p-4 bg-white rounded-lg shadow-lg">
          <p>Thank you for supporting OctoTools! 🐙</p>
          <p className="text-sm text-gray-600">
            Your donation keeps the tools free for everyone.
          </p>
        </div>
      )}
    </div>
  );
}
```

5. Revenue tracking dashboard (admin only):
```typescript
// app/admin/revenue/page.tsx
export default async function RevenueDashboard() {
  const stats = await getRevenueStats();
  
  return (
    <div className="grid grid-cols-3 gap-6">
      <Card>
        <CardHeader>Carbon Ads</CardHeader>
        <CardContent>${stats.carbonAds}/month</CardContent>
      </Card>
      
      <Card>
        <CardHeader>Pro Subscribers</CardHeader>
        <CardContent>{stats.proUsers} users</CardContent>
      </Card>
      
      <Card>
        <CardHeader>Donations</CardHeader>
        <CardContent>${stats.donations}/month</CardContent>
      </Card>
    </div>
  );
}
```
```

---

## 📦 Package.json Configuration

```json
{
  "name": "octotools",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "analyze": "ANALYZE=true next build"
  },
  "dependencies": {
    "next": "14.2.x",
    "react": "^18",
    "react-dom": "^18",
    "zustand": "^4.5.x",
    "codemirror": "^6.0.x",
    "@codemirror/lang-json": "^6.0.x",
    "@codemirror/lang-sql": "^6.0.x",
    "comlink": "^4.4.x",
    "@radix-ui/react-*": "latest",
    "class-variance-authority": "^0.7.x",
    "clsx": "^2.1.x",
    "tailwind-merge": "^2.2.x",
    "sharp": "^0.33.x",
    "sql-formatter": "^15.x",
    "papaparse": "^5.4.x",
    "react-resizable-panels": "^2.0.x",
    "next-themes": "^0.3.x",
    "stripe": "^14.x"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/react": "^18",
    "@types/react-dom": "^18",
    "typescript": "^5",
    "tailwindcss": "^3.4",
    "eslint": "^8",
    "eslint-config-next": "14.2.x",
    "@next/bundle-analyzer": "^14.2.x"
  }
}
```

## 🎯 Launch Checklist

### Pre-Launch (Day 0)
- [ ] Buy octotools.org domain
- [ ] Setup Vercel account
- [ ] Setup Carbon Ads account
- [ ] Setup Stripe for Pro subscriptions
- [ ] Create GitHub repo

### MVP Launch (Day 4)
- [ ] 7 core tools working
- [ ] Mobile responsive
- [ ] Dark mode
- [ ] Basic SEO
- [ ] Deployed to production
- [ ] Analytics connected

### Full Launch (Day 14)
- [ ] 15+ tools
- [ ] Tool chaining working
- [ ] Workspace mode for power users
- [ ] Carbon Ads integrated
- [ ] Pro subscription available
- [ ] API endpoints documented
- [ ] PWA installable

### Post-Launch
- [ ] Submit to Product Hunt
- [ ] Create landing video
- [ ] Write launch blog post
- [ ] Share on dev communities
- [ ] Monitor and optimize based on usage