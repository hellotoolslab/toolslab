# CLAUDE.md - Standard Operativi per OctoTools

## 🤖 Workflow di Sviluppo con Claude Code

### 1. PRIMA DI OGNI SESSIONE

```bash
# Sincronizza con il repository
git pull origin main

# Verifica lo stato del progetto
npm run status:check

# Aggiorna le dipendenze se necessario
npm update
```

### 2. DURANTE LO SVILUPPO

#### Creazione di nuovi tool

1. Usa sempre il template standard in `templates/tool-template.tsx`
2. Crea prima i test in `__tests__/unit/tools/[tool-name].test.ts`
3. Implementa la logica in `lib/tools/[tool-name].ts`
4. Crea il componente UI in `components/tools/[ToolName].tsx`
5. Aggiungi la route in `app/tools/[tool-name]/page.tsx`

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

### 10. EMERGENCY CONTACTS

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

---

_Last updated: November 2024_  
_Version: 1.0.0_
