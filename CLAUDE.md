# CLAUDE.md - Standard Operativi per OctoTools

## 🤖 Workflow di Sviluppo con Claude Code

### 1. PRIMA DI OGNI SESSIONE

```bash
# Sincronizza con il repository
git pull origin {branch}

# Verifica lo stato del progetto
npm run status:check

# Aggiorna le dipendenze se necessario
npm update
```

### 2. DURANTE LO SVILUPPO

#### Creazione di nuovi tool

**⚠️ IMPORTANTE**: Usa SOLO il sistema in `/lib/tools.ts` per gestire tools e categories.

**🚨 ARCHITETTURA UNIFICATA OBBLIGATORIA (AGGIORNAMENTO 26/09/2024)**:
- **❌ MAI creare pagine dedicate** in `app/tools/[tool-name]/page.tsx`
- **✅ SEMPRE usare il sistema dinamico** che gestisce tutto tramite `app/tools/[tool]/page.tsx`
- **Tutti i nuovi tool DEVONO usare il sistema unificato** per lazy loading e performance ottimali

**Workflow completo:**
1. **Registra il tool** in `/lib/tools.ts` con tutti i metadati richiesti
2. **Crea contenuti SEO** in `/lib/tool-seo.ts` con tagline e descrizione ottimizzate
3. **Definisci istruzioni** in `/lib/tool-instructions.ts` con contenuti tool-specifici
4. Crea prima i test in `__tests__/unit/tools/[tool-name].test.ts`
5. Implementa la logica in `lib/tools/[tool-name].ts`
6. Crea il componente UI in `components/tools/implementations/[ToolName].tsx`
   **⚠️ SE il componente usa `useToolStore` o `useCrontabStore`:**
   - Importa `useHydration` hook: `import { useHydration } from '@/lib/hooks/useHydration'`
   - Chiama il hook: `const isHydrated = useHydration()`
   - Crea safe arrays: `const safeData = isHydrated ? storeData : []`
   - Nei `useEffect`: aggiungi `if (!isHydrated) return;` prima di accedere allo store
7. **Registra nel LazyToolLoader** in `components/tools/LazyToolLoader.tsx`:
   ```typescript
   const toolComponents = {
     // ... altri tool
     'tool-name': lazy(() => import('./implementations/ToolName')),
   }
   ```
8. **❌ NON creare route dedicata** - il sistema dinamico `[tool]/page.tsx` gestirà automaticamente il routing
9. **La sitemap viene aggiornata automaticamente** - il sistema legge da `/lib/tools.ts`

**🚨 ERRORE CRITICO DA EVITARE - Pagine dedicate:**
```typescript
// ❌ SBAGLIATO - Causa errore Vercel build
export default function ToolPage() {
  return <ToolPageClient toolId={TOOL_ID} />;
}

// ✅ CORRETTO - Avvolgi sempre in Suspense
import { Suspense } from 'react';

export default function ToolPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ToolPageClient toolId={TOOL_ID} />
    </Suspense>
  );
}
```

**📋 Template per aggiungere un tool in `/lib/tools.ts`:**
```typescript
{
  id: 'tool-slug',
  name: 'Tool Name',
  description: 'Descrizione breve e chiara del tool',
  icon: '📋', // Emoji icon
  route: '/tools/tool-slug',
  categories: ['dev'], // Array di categorie esistenti
  keywords: ['keyword1', 'keyword2', 'tool', 'specific', 'terms'],
  isPopular: true, // se è un tool popolare
  searchVolume: 5500, // volume di ricerca stimato
  label: 'new', // 'new' | 'popular' | 'coming-soon' | ''
},
```

**📚 Categorie disponibili:**
- `data`: Data & Conversion 
- `encoding`: Encoding & Security
- `text`: Text & Format
- `generators`: Generators
- `web`: Web & Design
- `dev`: Dev Utilities
- `formatters`: Formatters

**⛔ NON creare file in `/data/tools.ts` o `/data/categories.ts` - sono stati eliminati!**

## 📝 CONTENUTI OBBLIGATORI PER OGNI NUOVO TOOL

Per garantire un'esperienza utente consistente e ottimizzazione SEO, OGNI nuovo tool deve includere:

### 🎯 SEO Content (in `/lib/tool-seo.ts`)
```typescript
{
  id: 'tool-slug',
  tagline: 'Action verb + tool function + benefit (8-12 words)',
  seoDescription: 'What it does + who it\'s for + why better + soft CTA (30-70 words)',
}
```

### 📚 Instructions Content (in `/lib/tool-instructions.ts`)
```typescript
{
  id: 'tool-slug',
  title: 'How to use [Tool Name]',
  steps: [
    { title: 'Step title', description: 'Detailed step description' },
    // 3-5 steps specific to the tool
  ],
  features: ['Feature 1', 'Feature 2'], // 4-8 features
  useCases: ['Use case 1', 'Use case 2'], // 5-8 use cases  
  proTips: ['Tip 1', 'Tip 2'], // 4-6 pro tips
  troubleshooting: ['Issue 1', 'Issue 2'], // 3-5 common issues
  keyboardShortcuts: [
    { keys: 'Ctrl+C', description: 'Copy result' }
  ] // Optional, if applicable
}
```

### 📋 Content Guidelines
- **Tagline**: Must include action verb, tool function, and benefit
- **SEO Description**: Primary keyword in first 15 words, mention "free", "secure", "browser-based"
- **Instructions**: Tool-specific steps, not generic
- **Features**: Technical capabilities unique to the tool
- **Use Cases**: Real-world scenarios for the target audience
- **Pro Tips**: Advanced usage tips and best practices
- **Troubleshooting**: Common issues and solutions specific to the tool

### ❌ Content Requirements Violations
- Generic instructions like "Enter your data" without tool-specific context
- Duplicate content across different tools
- Missing SEO tagline or description
- Fewer than 4 instruction steps
- No troubleshooting section for complex tools

#### Standard di codice

- Usa TypeScript strict mode
- Tutti i componenti devono avere props tipizzate
- Usa Zod per la validazione runtime
- Documenta le funzioni complesse con JSDoc
- Mantieni le funzioni pure in `lib/tools/`

### 3. PRIMA DI OGNI COMMIT

#### Checklist obbligatoria

- [ ] I test passano localmente (`npm run test`)
- [ ] Il linter non riporta errori (`npm run lint`)
- [ ] La build funziona (`npm run build`)
- [ ] Le performance sono verificate (`npm run analyze:size`)
- [ ] La documentazione è aggiornata

#### Processo di commit automatizzato

```bash
# Il pre-commit hook eseguirà automaticamente:
# 1. Linting e formatting
# 2. Test relativi ai file modificati
# 3. Build check
# 4. Bundle size analysis

git add .
git commit -m "tipo: descrizione breve"

# Tipi di commit:
# feat: nuova funzionalità
# fix: correzione bug
# test: aggiunta o modifica test
# docs: documentazione
# style: formattazione
# refactor: refactoring codice
# perf: miglioramento performance
# chore: manutenzione
```

### 4. TEST STANDARDS

#### Coverage minimo richiesto

- Branches: 80%
- Functions: 80%
- Lines: 80%
- Statements: 80%

#### Priorità dei test

1. **Critical Path** (DEVE avere 100% coverage):
   - Formatter/validator core logic
   - Data transformation functions
   - Security-sensitive operations (JWT, hash)

2. **High Priority** (90%+ coverage):
   - Tool chaining logic
   - Format detection
   - Error handling

3. **Medium Priority** (80%+ coverage):
   - UI components
   - Utility functions
   - Store operations

#### Test data requirements

- Sempre usare i fixtures da `__tests__/fixtures/`
- Testare edge cases: empty, null, undefined, very large
- Includere caratteri unicode e special chars
- Testare input malformati per ogni tool

### 5. PERFORMANCE BENCHMARKS

Ogni tool DEVE rispettare questi limiti:

- Processing time: < 500ms per operazioni fino a 100KB
- Memory usage: < 50MB per tab
- Initial load: < 1.5s su 3G
- Time to Interactive: < 2s
- Bundle size contribution: < 50KB gzipped

### 6. VERCEL DEPLOYMENT

#### Pre-deploy checklist

```bash
# 1. Verifica environment variables
cat .env.local.example | grep NEXT_PUBLIC

# 2. Test production build
npm run build:prod
npm run start

# 3. Verifica le API routes
curl http://localhost:3000/api/health

# 4. Controlla i meta tags SEO
npm run seo:check
```

#### Deploy to production

```bash
# Automatic deploy on push to main
git push origin main

# Manual deploy
vercel --prod
```

### 7. MONITORING POST-DEPLOY

Dopo ogni deploy, verifica:

1. Umami Analytics: controlla che gli eventi siano tracciati
2. Sentry: nessun nuovo errore nelle prime 2 ore
3. Vercel Analytics: Core Web Vitals in range
4. API monitoring: response time < 200ms

### 8. ROLLBACK PROCEDURE

Se ci sono problemi critici:

```bash
# 1. Immediate rollback
vercel rollback

# 2. Identify issue
npm run logs:production

# 3. Fix locally
git checkout -b hotfix/issue-name

# 4. Test thoroughly
npm run test:all

# 5. Deploy fix
git push origin hotfix/issue-name
```

### 9. WEEKLY MAINTENANCE

Ogni venerdì:

- [ ] Review Sentry errors
- [ ] Check bundle size trends
- [ ] Update dependencies (`npm outdated`)
- [ ] Review analytics for optimization opportunities
- [ ] Backup production data

### 10. SITEMAP E SEO AUTOMATICI

Il sistema gestisce automaticamente la generazione della sitemap per tutti i tool:

#### 🔄 Processo Automatico
- **Scansiona** `app/tools/` per nuovi tool directory
- **Estrae metadata** dai file `page.tsx` (title, description)
- **Prioritizza** tool featured > popular > new > altri
- **Aggiorna** la sitemap ad ogni build automaticamente

#### 📊 Sorgenti Sitemap (in ordine di priorità)
1. **Static Data** (`lib/tools.ts`) - **FONTE UFFICIALE** per tutti i tool e categorie
2. **Filesystem** (`app/tools/*/page.tsx`) - verifica esistenza dei tool
3. **Edge Config** (`lib/edge-config/`) - configurazione dinamica  
4. **Dynamic Routes** (se presenti route `[tool]`)

#### 🎯 Priorità SEO Automatiche
- Homepage: 1.0 (massima)
- Tool Featured: 0.9
- Tool New: 0.85  
- Tool Popular: 0.8
- Tool Standard: 0.7 (degradante con l'ordine)
- Categorie: 0.7
- Pagine statiche: 0.6-0.8

#### ⚡ Per aggiungere un tool alla sitemap
```bash
# 1. Crea la directory del tool
mkdir app/tools/nuovo-tool

# 2. Aggiungi page.tsx con metadati SEO
# Il sistema scannerizzerà automaticamente e aggiungerà alla sitemap

# 3. OBBLIGATORIO: Aggiungi il tool al registro ufficiale in lib/tools.ts
# con tutti i metadati: priorità, categoria, featured status, searchVolume, keywords
```

#### 🔍 Verifica Sitemap
```bash
# Durante development
curl http://localhost:3000/sitemap.xml

# In production  
curl https://toolslab.dev/sitemap.xml
```

### 11. EMERGENCY CONTACTS

- Vercel Status: https://vercel-status.com
- Umami Status: https://status.umami.is
- Domain issues: Cloudflare dashboard
- Critical bugs: Create issue with 'critical' label

## 📊 Tool Development Metrics

Track these metrics for each new tool:

- Development time: target < 4 hours
- Test coverage: minimum 85%
- Bundle size impact: maximum +30KB
- Performance score: minimum 95/100

## 🚀 Quick Commands Reference

```bash
# Development
npm run dev                 # Start dev server
npm run dev:ads            # With ads enabled

# Testing
npm run test               # Watch mode
npm run test:ci            # CI mode with coverage
npm run test:unit          # Unit tests only
npm run test:integration   # Integration tests only
npm run test:e2e           # E2E tests only
npm run test:all           # All test suites

# Building
npm run build              # Production build
npm run build:prod         # With ads enabled
npm run build:check        # Build without linting
npm run analyze:size       # Bundle analysis

# Quality
npm run lint               # ESLint
npm run lint:fix           # Auto-fix issues
npm run type-check         # TypeScript check
npm run format             # Prettier

# Deployment
vercel                     # Deploy preview
vercel --prod             # Deploy to production

# Maintenance
npm run status:check       # System status
npm outdated              # Check dependencies
npm audit                 # Security check
```

## 📝 Commit Message Examples

```
feat: add SQL formatter with syntax highlighting
fix: resolve JSON parsing error for unicode characters
test: add edge cases for base64 decoder
docs: update API documentation for v2 endpoints
style: improve mobile responsiveness for tool cards
refactor: extract common validation logic to utils
perf: optimize large file processing with web workers
chore: update dependencies and fix vulnerabilities
```

## 🎯 Project Information

**URL**: octotools.org  
**Tech Stack**: Next.js 14 (App Router) + Tailwind CSS + shadcn/ui + Zustand  
**Business Model**: Free forever + EthicalAds + Donations  
**Core Principle**: Dual Mode - Serve both single-task users (90%) and workflow power users (10%)

## 📦 Tool Template

Quando crei un nuovo tool, segui questa struttura:

```typescript
// lib/tools/[tool-name].ts
export interface ToolResult {
  success: boolean;
  result?: string;
  error?: string;
  metadata?: Record<string, any>;
}

export function processToolName(input: string, options?: any): ToolResult {
  try {
    // Validation
    if (!input) {
      return { success: false, error: 'Input required' };
    }

    // Processing
    const result = /* your logic */;

    return { success: true, result };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
}
```

## 🏗️ ARCHITETTURA TOOL UNIFICATA (SISTEMA DINAMICO)

**Dal 26/09/2024 tutti i tool usano il sistema dinamico unificato:**

```
app/tools/
├── [tool]/           ← Sistema dinamico che gestisce TUTTI i tool
│   ├── page.tsx      ← Unica pagina che serve tutti i tool
│   ├── opengraph-image.tsx
│   └── twitter-image.tsx
├── page.tsx          ← Lista tool
└── layout.tsx        ← Layout condiviso

components/tools/
├── implementations/  ← TUTTI i componenti tool qui
│   ├── JsonFormatter.tsx
│   ├── CSSMinifier.tsx
│   └── [altri tool...]
└── LazyToolLoader.tsx ← Gestisce lazy loading

lib/
├── tools.ts          ← Registry centrale di TUTTI i tool
├── tool-seo.ts       ← SEO metadata centralizzato
└── tool-schema.ts    ← Schema generation
```

**❌ NON FARE MAI:**
- Creare `app/tools/json-formatter/page.tsx` (pagina dedicata)
- Creare route statiche per singoli tool
- Duplicare metadata SEO

**✅ FARE SEMPRE:**
- Registrare in `/lib/tools.ts`
- Aggiungere SEO in `/lib/tool-seo.ts`
- Implementare in `components/tools/implementations/`
- Registrare in `LazyToolLoader.tsx`

## 💧 GESTIONE HYDRATION (CRITICO - DICEMBRE 2024)

**⚠️ PROBLEMA RISOLTO**: Errore React #425 (hydration mismatch) causato da Zustand stores con persist middleware.

### Quando Usare useHydration

**SEMPRE** quando un componente accede a `useToolStore` o `useCrontabStore`:

```typescript
'use client';

import { useToolStore } from '@/lib/store/toolStore';
import { useHydration } from '@/lib/hooks/useHydration';

export default function YourComponent() {
  const isHydrated = useHydration();
  const { favoriteTools, history } = useToolStore();

  // Safe access - aspetta hydration prima di usare i dati
  const safeFavorites = isHydrated ? favoriteTools : [];
  const safeHistory = isHydrated ? history : [];

  return (
    <div>
      <p>Favorites: {safeFavorites.length}</p>
      {safeHistory.map(item => <div key={item.id}>{item.tool}</div>)}
    </div>
  );
}
```

### Pattern useEffect con Hydration

```typescript
useEffect(() => {
  if (!isHydrated) return; // CRITICO: aspetta hydration

  // Ora è sicuro accedere allo store
  const { favoriteTools } = useToolStore.getState();
  console.log('User favorites:', favoriteTools);
}, [isHydrated]);
```

### ⚠️ Errori Comuni da Evitare

❌ **SBAGLIATO**:
```typescript
const { favoriteTools } = useToolStore();
return <div>{favoriteTools.length}</div>; // Hydration mismatch!
```

✅ **CORRETTO**:
```typescript
const isHydrated = useHydration();
const { favoriteTools } = useToolStore();
const safe = isHydrated ? favoriteTools : [];
return <div>{safe.length}</div>;
```

### Conseguenze Senza Hydration Check

- ❌ React Error #425 in produzione
- ❌ Dati persistenti (favoriti, cronologia) spariscono dopo refresh
- ❌ Build Vercel fallisce
- ❌ Esperienza utente compromessa

### Componenti Aggiornati (Riferimento)

Tutti questi componenti seguono il pattern corretto:
- `components/layout/LabHubContent.tsx`
- `components/layout/NewLabHubContent.tsx`
- `components/layout/Header.tsx`
- `components/tools/ToolLayout.tsx`
- `components/lab/LabSidebar.tsx`
- `components/lab/LabOverview.tsx`
- `components/lab/FavoriteButton.tsx`
- `components/lab/WelcomePopup.tsx`
- `components/tools/implementations/CrontabBuilder.tsx`

**📖 Dettagli completi**: Vedi `/documentation/TOOL_DEVELOPMENT.md` sezione "State Management & Hydration"

## 🔒 Security Guidelines

1. **Mai committare segreti**: Usa sempre variabili d'ambiente
2. **Sanitizza input utente**: Valida e sanitizza tutti gli input
3. **Evita eval()**: Non usare mai eval o Function constructor con input utente
4. **CSP Headers**: Mantieni Content Security Policy stringente
5. **Dependencies**: Aggiorna regolarmente e controlla vulnerabilità

## 📈 Analytics Events

Eventi da tracciare con Umami:

```typescript
// Tool usage
track('tool-use', { tool: 'json-formatter', success: true });

// Tool chain
track('tool-chain', { from: 'json', to: 'jwt', success: true });

// Errors
track('tool-error', { tool: 'json-formatter', error: 'invalid-json' });

// Performance
track('performance', { tool: 'json-formatter', duration: 123 });
```

## 🌍 SISTEMA MULTILINGUA (AGGIORNAMENTO DICEMBRE 2024)

### Architettura Multilingua

Il sistema multilingua di ToolsLab supporta attualmente **Italiano** con una struttura scalabile per aggiungere facilmente nuove lingue.

#### Struttura URL
- **Inglese (default)**: `/tools/json-formatter` (nessun prefisso)
- **Italiano**: `/it/tools/json-formatter`
- **Future lingue**: `/{locale}/tools/json-formatter` (fr, es, de, pt, nl, pl, tr)

⚠️ **IMPORTANTE**: Il tool slug (`json-formatter`) NON viene mai tradotto e rimane identico in tutte le lingue.

#### File e Directory

```
lib/i18n/
├── config.ts              # Configurazione locali e flags
├── get-dictionary.ts      # Caricamento dizionari
├── helpers.ts             # Funzioni utility i18n
└── dictionaries/
    ├── en.json           # Traduzioni inglesi
    └── it.json           # Traduzioni italiane

app/
├── [locale]/
│   ├── layout.tsx        # Layout per pagine localizzate
│   ├── page.tsx          # Homepage localizzata
│   └── tools/
│       └── [tool]/
│           └── page.tsx  # Pagine tool localizzate
└── components/
    └── LanguageSwitcher.tsx  # Selettore lingua
```

### Workflow per Aggiungere Traduzioni

#### 1. Aggiungere traduzioni per un nuovo tool

1. **Aggiungi in `en.json`**:
```json
"tools": {
  "nuovo-tool": {
    "title": "New Tool",
    "description": "Tool description",
    "placeholder": "Enter text...",
    "meta": {
      "title": "New Tool - Free Online Tool | ToolsLab",
      "description": "SEO description for the tool"
    }
  }
}
```

2. **Aggiungi in `it.json`**:
```json
"tools": {
  "nuovo-tool": {
    "title": "Nuovo Strumento",
    "description": "Descrizione dello strumento",
    "placeholder": "Inserisci testo...",
    "meta": {
      "title": "Nuovo Strumento - Strumento Online Gratuito | ToolsLab",
      "description": "Descrizione SEO per lo strumento"
    }
  }
}
```

#### 2. Aggiungere una nuova lingua

1. **Aggiorna `lib/i18n/config.ts`**:
```typescript
export type Locale = 'en' | 'it' | 'fr';  // Aggiungi nuovo locale
export const locales: Locale[] = ['en', 'it', 'fr'];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  it: 'Italiano',
  fr: 'Français',  // Aggiungi nome
};

export const localeFlags: Record<Locale, string> = {
  en: '🇬🇧',
  it: '🇮🇹',
  fr: '🇫🇷',  // Aggiungi flag
};
```

2. **Crea `lib/i18n/dictionaries/fr.json`** copiando struttura da `en.json`

3. **Deploy** - il sistema gestisce automaticamente routing e SEO

### SEO e Hreflang

Il sistema genera automaticamente:
- Tag hreflang per ogni pagina
- Sitemap multilingua
- Meta tag tradotti
- Schema.org localizzato

Esempio di hreflang generato:
```html
<link rel="alternate" hreflang="en" href="https://toolslab.dev/tools/json-formatter" />
<link rel="alternate" hreflang="it" href="https://toolslab.dev/it/tools/json-formatter" />
<link rel="alternate" hreflang="x-default" href="https://toolslab.dev/tools/json-formatter" />
```

### Best Practices Multilingua

1. **MAI tradurre gli slug dei tool** - mantenerli in inglese per consistenza
2. **Sempre includere meta.title e meta.description** per SEO ottimale
3. **Usare placeholder tradotti** per migliorare UX
4. **Mantenere consistenza** nei termini tecnici tra lingue
5. **Testare sempre** il language switcher su diverse pagine

### Testing Multilingua

```bash
# Test locale italiano
npm run dev
# Naviga a http://localhost:3000/it/tools/json-formatter

# Verifica sitemap
curl http://localhost:3000/sitemap.xml

# Verifica hreflang
# Ispeziona <head> delle pagine localizzate
```

### Componenti che Richiedono Localizzazione

Quando modifichi questi componenti, assicurati di passare le traduzioni:

- `HomePageContent` - riceve `locale` e `dictionary` props
- `ToolPageClient` - riceve `locale` e `dictionary` props
- `Header/Footer` - devono usare il dizionario per navigazione
- `CategoryCard` - deve mostrare nomi categoria tradotti

### Debug e Troubleshooting

Se le traduzioni non appaiono:
1. Verifica che il file JSON sia valido
2. Controlla che il tool ID corrisponda tra `tools.ts` e dizionari
3. Verifica il locale nella URL
4. Controlla i log del server per errori di caricamento dizionario

## 📚 Documentazione Completa

Per informazioni dettagliate sul progetto, consulta la documentazione nella cartella `/documentation`:

### 🏗️ Documentazione Tecnica
- **[Architecture Overview](./documentation/ARCHITECTURE.md)** - Architettura del sistema e decisioni tecniche
- **[Tool Development Guide](./documentation/TOOL_DEVELOPMENT.md)** - Guida completa per sviluppare nuovi tool
- **[API Documentation](./documentation/API_DOCUMENTATION.md)** - Documentazione completa delle API
- **[Tools Catalog](./documentation/TOOLS_CATALOG.md)** - Catalogo completo di tutti i tool disponibili
- **[Multi Language Guide](./documentation/MULTI_LANGUAGE.md)** - Guida dettagliata al sistema multilingua
- **[Blog Structure Guide](./documentation/BLOG-STRUCTURE.md)** - Struttura e gestione del blog

### 🚀 Deployment e Contributing
- **[Deployment Guide](./documentation/DEPLOYMENT.md)** - Guida al deployment e configurazione produzione
- **[Contributing Guidelines](./documentation/CONTRIBUTING.md)** - Linee guida per contribuire al progetto

### 📖 Overview
- **[Project README](./documentation/README.md)** - Overview completo del progetto e tecnologie

💡 **Nota**: La documentazione in `/documentation` fornisce informazioni di alto livello e specifiche tecniche, mentre questo file CLAUDE.md contiene gli standard operativi quotidiani per lo sviluppo.

---

_Last updated: December 2024_
_Version: 1.1.0_