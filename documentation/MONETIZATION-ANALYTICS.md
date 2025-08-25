# ToolsLab - Monetization & Analytics Setup Guide 🧪

## 📊 Analytics with Umami

### Why Umami?

- **Open Source**: 100% free and self-hostable (or $9/month cloud)
- **Privacy-first**: No cookies, GDPR/CCPA compliant by default
- **Lightweight**: <6KB script, minimal performance impact
- **Real-time**: Live dashboard with instant metrics
- **Simple**: Clean interface, easy to understand
- **Flexible**: Self-host for free or use cloud service

### Setup Options

#### Option 1: Umami Cloud (Easiest)

1. **Sign up at [umami.is](https://umami.is)**
2. **Add website**: toolslab.dev
3. **Get your Website ID**
4. **Configure `.env.local`**:

```env
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://analytics.umami.is/script.js
NEXT_PUBLIC_UMAMI_HOST_URL=https://analytics.umami.is
```

#### Option 2: Self-Hosted (Free)

1. **Deploy Umami** on your server:

```bash
# Using Docker
docker run -d \
  --name umami \
  -p 3000:3000 \
  -e DATABASE_URL=postgresql://username:password@localhost:5432/umami \
  ghcr.io/umami-software/umami:postgresql-latest

# Or deploy to Vercel/Railway/Heroku (free tiers available)
```

2. **Configure `.env.local`**:

```env
NEXT_PUBLIC_UMAMI_WEBSITE_ID=your-website-id
NEXT_PUBLIC_UMAMI_SCRIPT_URL=https://your-umami.com/script.js
NEXT_PUBLIC_UMAMI_HOST_URL=https://your-umami.com
```

### Custom Events Tracked

```typescript
// Automatic tracking (by Umami):
- Page views with referrer
- Unique visitors
- Session duration
- Browser & OS
- Device type
- Country (from IP, privacy-safe)

// Custom events (our implementation):
- Tool Usage: tool-format, tool-decode, etc.
- Conversions: donation, pro_signup
- Performance: processing time per tool
- Errors: tool errors for debugging
- User Level: first_time, returning, power
```

### Using Analytics in Components

```typescript
import { useUmami } from '@/components/analytics/UmamiProvider';

function YourTool() {
  const { logToolAction, trackPerformance } = useUmami();

  const handleProcess = async () => {
    const startTime = Date.now();

    try {
      // Your tool logic
      const result = await processData(input);

      // Track success
      logToolAction('json-formatter', 'format', true, {
        inputSize: input.length,
        outputSize: result.length,
      });

      // Track performance
      trackPerformance('json-formatter', 'format', Date.now() - startTime);
    } catch (error) {
      // Track error
      logToolAction('json-formatter', 'format', false, {
        error: error.message,
      });
    }
  };
}
```

## 💰 EthicalAds Implementation

### Why EthicalAds?

- **Privacy-focused**: No user tracking or profiling
- **Developer audience**: Relevant ads for your users
- **High CPM**: $8-12 CPM for developer traffic
- **Trust**: Used by Read the Docs, JSFiddle, etc.
- **Simple**: One line of code, no complex setup

### Setup Instructions

1. **Apply at [ethicalads.io](https://www.ethicalads.io/publishers/)**
   - Mention: Developer tools site
   - Expected traffic: Growing from 10k to 100k monthly
   - Content type: Technical/Developer tools

2. **Get approved** (usually 2-3 days)

3. **Get your Publisher ID** and add to `.env.local`:

```env
NEXT_PUBLIC_ENABLE_ADS=false  # Keep false until ready
NEXT_PUBLIC_ETHICAL_ADS_PUBLISHER=your-publisher-id
```

### Ad Activation Strategy

#### Phase 1: Launch (Month 1)

```env
NEXT_PUBLIC_ENABLE_ADS=false
```

- No ads shown
- Build initial user base
- Focus on tool quality

#### Phase 2: Soft Launch (Month 2)

```env
NEXT_PUBLIC_ENABLE_ADS=true
```

- Ads enabled but hidden for first-time users
- Only returning users see ads
- Monitor feedback

#### Phase 3: Full Monetization (Month 3+)

- All users see ads (except first visit)
- Pro users never see ads
- A/B test ad placements

### Ad Placement Rules

```typescript
// Current implementation logic:
if (!adsEnabled) return null;           // Env variable control
if (proUser) return null;               // Pro users never see ads
if (userLevel === 'first_time') return null; // First visit = no ads
if (adError) return null;               // Failed to load = hide

// Placements:
- Header: 728x90 horizontal (desktop only)
- Sidebar: 300x250 vertical (desktop only)
- Footer: 728x90 horizontal (all devices)
- Never in tool work areas
```

### Testing Ads Locally

```bash
# Run with ads enabled
npm run dev:ads

# Or set in .env.local
NEXT_PUBLIC_ENABLE_ADS=true
```

To force show ads even as first-time user (for testing):

```tsx
<EthicalAd placement="sidebar" force={true} />
```

## 📈 Metrics to Track

### Key Performance Indicators (KPIs)

#### User Engagement

- **Daily Active Users** (target: 1,000 by month 3)
- **Tools per Session** (target: 2.5 average)
- **Session Duration** (target: 3+ minutes)
- **Bounce Rate** (target: <40%)

#### Tool Performance

- **Most Used Tools** (optimize these first)
- **Tool Completion Rate** (target: >90%)
- **Error Rate** (target: <1%)
- **Processing Time** (target: <500ms)

#### Monetization

- **Ad Revenue** (track CPM trends)
- **Ad CTR** (target: 0.5-1%)
- **Donation Rate** (target: 0.5% of users)
- **Pro Conversion** (target: 2% of returning users)

### Umami Dashboard Features

1. **Real-time Dashboard**: See live visitors and events
2. **Custom Events**: Track specific tool actions
3. **Funnel Analysis**: User journey from landing to conversion
4. **Retention**: How many users return
5. **Technology**: Browser, OS, device breakdown
6. **Geography**: Country/region distribution (privacy-safe)

### Dashboard Access

1. **Umami Dashboard**:
   - Cloud: analytics.umami.is/websites/[your-id]
   - Self-hosted: your-umami.com/dashboard
2. **Public Share Link**: Create shareable dashboard (optional)
3. **API Access**: Query data programmatically for custom reports

## 🚀 Launch Checklist

### Before Launch

- [ ] Tools working perfectly
- [ ] Umami analytics configured
- [ ] `.env.local` setup complete
- [ ] Ads disabled (`NEXT_PUBLIC_ENABLE_ADS=false`)

### Week 1

- [ ] Monitor Umami real-time dashboard
- [ ] Track tool usage patterns
- [ ] Identify most popular tools
- [ ] Fix any reported bugs

### Week 2-4

- [ ] Apply to EthicalAds
- [ ] Optimize based on analytics
- [ ] Add tools based on demand
- [ ] Prepare for ad activation

### Month 2

- [ ] Enable ads (`NEXT_PUBLIC_ENABLE_ADS=true`)
- [ ] Monitor ad revenue
- [ ] A/B test ad placements
- [ ] Launch Pro subscriptions

## 🎯 Revenue Goals

### Conservative Projections

| Month | MAU | Ad Revenue\* | Donations | Pro | Total |
| ----- | --- | ------------ | --------- | --- | ----- |
| 1     | 8k  | $0           | $15       | $0  | $15   |
| 2     | 15k | $120         | $30       | $0  | $150  |
| 3     | 30k | $280         | $60       | $30 | $370  |
| 6     | 50k | $500         | $150      | $90 | $740  |

\*Ads enabled from Month 2

### Success Metrics

- **Break-even**: Month 1 (domain cost only)
- **Profitable**: Month 2 ($100+ profit)
- **Sustainable**: Month 6 ($500+ profit)
- **Goal**: $1,500/month by Year 1

## 📝 Privacy Policy Notes

Since we're using privacy-focused tools, the privacy policy is simple:

```markdown
### Analytics (Umami)

- No cookies used
- No personal data collected
- IP addresses anonymized
- GDPR/CCPA compliant

### Advertising (EthicalAds)

- No user tracking
- No behavioral targeting
- Privacy-focused ads

### Data Storage

- Tool history: Local storage only (never sent to servers)
- No user accounts required
- We don't sell or share any data
```

## 🔧 Quick Commands Reference

```bash
# Development
npm run dev                 # No ads, normal dev
npm run dev:ads            # With ads enabled

# Production
npm run build              # Build without ads
npm run build:prod         # Build with ads enabled

# Analytics Testing
# Visit your site and check:
# - Umami Dashboard for real-time data
# - Browser console for trackEvent calls
# - Network tab for umami script loading
```

## 🆚 Umami vs Other Analytics

| Feature       | Umami         | Google Analytics | Plausible     |
| ------------- | ------------- | ---------------- | ------------- |
| Privacy       | ✅ No cookies | ❌ Cookies       | ✅ No cookies |
| GDPR          | ✅ Compliant  | ⚠️ Banner needed | ✅ Compliant  |
| Self-host     | ✅ Free       | ❌               | ❌            |
| Cloud Price   | $9/mo         | Free\*           | $9/mo         |
| Script Size   | 6KB           | 45KB             | 1KB           |
| Real-time     | ✅            | ✅               | ✅            |
| Custom Events | ✅            | ✅               | ✅            |
| API Access    | ✅            | ✅               | ✅            |

\*GA4 is free but has privacy concerns

## 📊 Custom Umami Reports

Create custom reports by querying Umami API:

```typescript
// Example: Daily tool usage report
async function getToolUsageReport() {
  const response = await fetch(`${UMAMI_API}/websites/${WEBSITE_ID}/events`, {
    headers: {
      Authorization: `Bearer ${UMAMI_API_TOKEN}`,
    },
    params: {
      startAt: Date.now() - 86400000, // 24 hours ago
      endAt: Date.now(),
      event: 'tool-*',
    },
  });

  return response.json();
}
```

## 🎨 Umami Dashboard Embedding

You can embed Umami dashboard in your admin panel:

```html
<iframe
  src="https://analytics.umami.is/share/[share-id]/toolslab"
  width="100%"
  height="600"
  frameborder="0"
/>
```

This provides a complete analytics solution that respects user privacy while giving you all the insights you need to grow ToolsLab! 🧪
