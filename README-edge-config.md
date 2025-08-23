# Vercel Edge Config Integration Guide

## 🚀 Overview

OctoTools uses Vercel Edge Config for dynamic tool management with ultra-low latency (<10ms). This system allows real-time control over tool visibility, feature flags, and A/B testing without deployments.

## 📋 Features

### ✅ Implemented

- **Dynamic Tool Management**: Enable/disable tools without deployment
- **Feature Flags**: Control feature rollouts globally
- **A/B Testing**: Experiment with new features
- **Category Management**: Dynamic category configuration
- **Tool Metadata**: Rich metadata with usage stats
- **Performance Monitoring**: Built-in latency tracking
- **Fallback Strategy**: Robust error handling with defaults
- **Development Server**: Local Edge Config simulation
- **TypeScript Support**: Full type safety
- **Client Hooks**: React hooks for easy integration
- **API Routes**: RESTful endpoints for configuration
- **Admin Interface**: Administrative control endpoints
- **Middleware Integration**: Request-level processing

### 🔄 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Next.js App  │────│  Vercel Edge     │────│  Edge Config    │
│                 │    │  Runtime         │    │  Store          │
│  • Pages        │    │  • Middleware    │    │  • Tools        │
│  • Components   │    │  • API Routes    │    │  • Categories   │
│  • Hooks        │    │  • Server Comp   │    │  • Features     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
        │                        │                        │
        ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   Fallback      │    │   Cache Layer    │    │   Admin API     │
│   Defaults      │    │   (5min TTL)     │    │   (Updates)     │
└─────────────────┘    └──────────────────┘    └─────────────────┘
```

## 🛠️ Setup Instructions

### 1. Environment Variables

Create `.env.local` with:

```bash
# Vercel Edge Config
EDGE_CONFIG=ecfg_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Admin Access
ADMIN_SECRET_KEY=your-super-secret-admin-key

# Environment
VERCEL_ENV=development
```

### 2. Development Setup

Start the development Edge Config server:

```bash
# Terminal 1: Start Edge Config dev server
npm run edge-config:dev

# Terminal 2: Start Next.js with Edge Config
EDGE_CONFIG=http://localhost:3001 npm run dev
```

### 3. Production Setup

1. Create Edge Config in Vercel Dashboard
2. Upload initial configuration:

```bash
# Using Vercel CLI
vercel env add EDGE_CONFIG
vercel env add ADMIN_SECRET_KEY
```

## 📊 Configuration Schema

### Tool Configuration

```typescript
interface ToolConfig {
  id: string;
  slug: string;
  name: string;
  description: string;
  enabled: boolean;
  featured: boolean;
  order: number;
  category: string;
  searchVolume: number;
  flags: {
    isNew?: boolean;
    isBeta?: boolean;
    isPro?: boolean;
    isPopular?: boolean;
    isTrending?: boolean;
    isMaintenance?: boolean;
  };
  metadata: {
    lastUpdated: string;
    monthlyUsers?: number;
    averageRating?: number;
    processingLimit?: number;
    keywords?: string[];
  };
}
```

### Feature Flags

```typescript
interface FeatureFlags {
  adsEnabled: boolean;
  maintenanceMode: boolean;
  proEnabled: boolean;
  experiments: {
    newToolChaining: boolean;
    enhancedSearch: boolean;
    darkModeDefault: boolean;
  };
}
```

## 🔧 Usage Examples

### Server Components

```typescript
import { getEnabledTools, getFeaturedTools } from '@/lib/edge-config/tools';

export default async function HomePage() {
  const [tools, featured] = await Promise.all([
    getEnabledTools({ limit: 20 }),
    getFeaturedTools(6)
  ]);

  return (
    <div>
      <FeaturedTools tools={featured} />
      <AllTools tools={tools} />
    </div>
  );
}
```

### Client Components

```typescript
'use client';
import { useToolConfig } from '@/lib/hooks/useToolConfig';

export function ToolGrid() {
  const { tools, isLoading, error } = useToolConfig({
    enabled: true,
    featured: true,
    limit: 12
  });

  if (isLoading) return <LoadingSkeleton />;
  if (error) return <ErrorMessage error={error} />;

  return (
    <div className="grid grid-cols-3 gap-4">
      {tools.map(tool => (
        <ToolCard key={tool.id} tool={tool} />
      ))}
    </div>
  );
}
```

### API Usage

```typescript
// Get all tools
const response = await fetch('/api/tools/config');
const { tools, categories } = await response.json();

// Search tools
const searchResponse = await fetch('/api/tools/search?q=json&limit=5');
const { results } = await searchResponse.json();

// Check tool access
const accessResponse = await fetch('/api/tools/json-formatter/access', {
  method: 'POST',
  body: JSON.stringify({ userPlan: { type: 'free' } }),
});
const { access } = await accessResponse.json();
```

## 🎛️ Admin Operations

### Update Tool Configuration

```bash
curl -X POST http://localhost:3000/api/admin/tools \
  -H "Authorization: Bearer your-admin-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "update_tool",
    "data": {
      "slug": "json-formatter",
      "updates": {
        "enabled": false,
        "flags": { "isMaintenance": true }
      }
    }
  }'
```

### Toggle Tool Status

```bash
curl -X POST http://localhost:3000/api/admin/tools \
  -H "Authorization: Bearer your-admin-secret" \
  -H "Content-Type: application/json" \
  -d '{
    "action": "toggle_tool",
    "data": {
      "slug": "json-formatter",
      "enabled": true
    }
  }'
```

### Clear Cache

```bash
curl -X POST http://localhost:3000/api/admin/tools \
  -H "Authorization: Bearer your-admin-secret" \
  -H "Content-Type: application/json" \
  -d '{ "action": "clear_cache" }'
```

## 📈 Performance Monitoring

### Built-in Metrics

```typescript
import { withPerformanceMonitoring } from '@/lib/edge-config/client';

const monitoredFunction = withPerformanceMonitoring(async () => {
  // Your function logic
}, 'operation-name');
```

### Health Checks

```bash
# Check Edge Config health
npm run edge-config:health

# Check API health
curl http://localhost:3000/api/admin/tools \
  -H "Authorization: Bearer your-admin-secret" \
  -d '{"action": "health_check"}'
```

## 🔄 A/B Testing

### Middleware Implementation

The middleware automatically handles A/B testing:

```typescript
// Headers added by middleware
X-Search-Variant: a | b
X-Chaining-Variant: a | b
X-User-Country: US
```

### Client-side Usage

```typescript
'use client';
import { headers } from 'next/headers';

export function SearchComponent() {
  const variant = headers().get('X-Search-Variant');

  return variant === 'b' ?
    <EnhancedSearch /> :
    <StandardSearch />;
}
```

## 🚦 Error Handling

### Fallback Strategy

1. **Edge Config Available**: Use live configuration
2. **Edge Config Slow/Failed**: Use cached data
3. **No Cache Available**: Use hardcoded defaults
4. **Complete Failure**: Serve core tools only

### Error Monitoring

```typescript
// Automatic error logging
console.error('Edge Config error:', {
  type: error.type,
  message: error.message,
  timestamp: error.timestamp,
  operation: 'getToolsConfig',
});
```

## 🧪 Testing

### Unit Tests

```bash
npm run test:unit -- --testNamePattern="Edge Config"
```

### Integration Tests

```bash
# Start dev server first
npm run edge-config:dev

# Run integration tests
npm run test:integration -- --testNamePattern="Tool Config"
```

### Load Testing

```bash
# Test Edge Config performance
for i in {1..100}; do
  curl -s -w "%{time_total}\n" \
    http://localhost:3001/tools \
    -o /dev/null
done | awk '{sum+=$1; count++} END {print "Average:", sum/count*1000, "ms"}'
```

## 📝 Best Practices

### 1. Configuration Design

- Keep configurations under 512KB limit
- Use meaningful tool slugs
- Implement proper versioning
- Add descriptive metadata

### 2. Performance

- Cache aggressively (5-minute TTL)
- Use stale-while-revalidate pattern
- Monitor response times
- Implement circuit breakers

### 3. Error Handling

- Always provide fallbacks
- Log errors but don't block
- Use graceful degradation
- Test failure scenarios

### 4. Security

- Never store sensitive data in Edge Config
- Validate all admin requests
- Use proper authentication
- Rate limit API calls

### 5. Monitoring

- Track configuration changes
- Monitor performance metrics
- Alert on failures
- Log A/B test results

## 🐛 Troubleshooting

### Common Issues

1. **Edge Config Not Loading**

   ```bash
   # Check environment variable
   echo $EDGE_CONFIG

   # Test connectivity
   npm run edge-config:health
   ```

2. **Slow Response Times**

   ```bash
   # Check cache statistics
   curl http://localhost:3000/api/admin/tools \
     -d '{"action": "health_check"}'
   ```

3. **Configuration Not Updating**
   ```bash
   # Clear cache
   curl -X POST http://localhost:3000/api/admin/tools \
     -H "Authorization: Bearer your-admin-secret" \
     -d '{"action": "clear_cache"}'
   ```

### Debug Mode

```bash
# Enable debug logging
NEXT_PUBLIC_DEBUG_MODE=true npm run dev
```

## 🔮 Future Enhancements

- [ ] Real-time configuration updates via WebSocket
- [ ] Advanced A/B testing with statistical significance
- [ ] Configuration versioning and rollback
- [ ] Visual admin dashboard
- [ ] Automated performance optimization
- [ ] Multi-region configuration sync
- [ ] Advanced analytics and insights
- [ ] Configuration templates and presets

---

## 📞 Support

For issues or questions:

1. Check the troubleshooting guide above
2. Review the TypeScript interfaces in `/lib/edge-config/types.ts`
3. Test with the development server: `npm run edge-config:dev`
4. Check middleware logs for A/B testing issues
