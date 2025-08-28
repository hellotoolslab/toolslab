# VPN Production Configuration

Questa documentazione spiega come il sistema VPN è configurato per la produzione per evitare spam di chiamate API.

## 🚀 Configurazione Produzione vs Development

### Development (Attivo)

- ✅ **VPN Debug Info**: Componente visibile in basso a destra
- ✅ **Auto Check**: Controlli automatici ogni 5 minuti
- ✅ **Health Check**: Monitoraggio salute VPN attivo
- ✅ **Chiamate API**: `/api/check-vpn` e `/api/vpn-health` chiamate regolarmente
- ✅ **Cache Duration**: 5 minuti (per testing rapido)
- ✅ **Logging**: Console logs attivi

### Production (Ottimizzato)

- ❌ **VPN Debug Info**: Completamente disabilitato
- ❌ **Auto Check**: Disabilitato per default (configurable)
- ❌ **Health Check**: Disabilitato per default (configurable)
- ❌ **Chiamate API**: Solo una chiamata iniziale per notifica
- ✅ **Cache Duration**: 30 minuti (riduce traffico)
- ❌ **Logging**: Console logs disabilitati

## 🔧 Variabili d'Ambiente

### File: `.env.production`

```bash
# VPN Support Configuration (Production)
NEXT_PUBLIC_VPN_MODE_ENABLED=true                 # Abilita sistema VPN
NEXT_PUBLIC_VPN_DEBUG_MODE=false                  # Disabilita debug
NEXT_PUBLIC_HSTS_DISABLED=true                    # HSTS rimosso
NEXT_PUBLIC_CORPORATE_VPN_SUPPORT=true            # Supporto VPN aziendali
NEXT_PUBLIC_VPN_AUTO_CHECK_PRODUCTION=false       # Disabilita controlli automatici
```

### Controllo Granulare

- `NEXT_PUBLIC_VPN_AUTO_CHECK_PRODUCTION=false` → Zero chiamate automatiche
- `NEXT_PUBLIC_VPN_AUTO_CHECK_PRODUCTION=true` → Controlli ogni ora (invece di 5 min)

## 📊 Comportamento in Produzione

### VPNNotification Component

- ✅ **Prima visita**: Una sola chiamata a `/api/check-vpn`
- ✅ **Session Cache**: Usa `sessionStorage` per evitare chiamate ripetute
- ✅ **Dismiss persistente**: `localStorage` ricorda la scelta utente

### VPNProvider (Hook globale)

- ❌ **Auto Check**: Disabilitato (non fa chiamate periodiche)
- ❌ **Health Check**: Disabilitato (non monitora continuamente)
- ✅ **Cache estesa**: 30 minuti invece di 5
- ✅ **Manual trigger**: Solo su richiesta esplicita

### Middleware

- ✅ **Sempre attivo**: Detection header-based (zero API calls)
- ✅ **Headers VPN**: Imposta `X-VPN-Mode` automaticamente
- ✅ **Anti-HSTS**: Headers sempre applicati

## 🎯 Risultato Produzione

### Traffico API Minimizzato

1. **Utente nuovo**: 1 chiamata a `/api/check-vpn`
2. **Utente ricorrente**: 0 chiamate (tutto cached/sessionStorage)
3. **VPN detection**: Principalmente via middleware (header-based)
4. **Background calls**: Zero (tutti i controlli automatici disabilitati)

### Performance Ottimizzata

- **Cache VPN**: 30 minuti in produzione vs 5 minuti in dev
- **Network requests**: Ridotte del 95% rispetto alla versione development
- **Bundle size**: VPNDebugInfo tree-shaken in produzione
- **Console logs**: Completamente rimossi in produzione

## 🔍 Verifica Configurazione

### Test Production Build Localmente

```bash
# 1. Build con configurazione produzione
NODE_ENV=production npm run build

# 2. Verifica nessun debug component
# VPNDebugInfo non deve apparire

# 3. Verifica chiamate API minime
# Apri DevTools → Network → Reload
# Dovrebbe vedere solo 1 chiamata iniziale a /api/check-vpn (se VPN)
```

### Monitoring Produzione

```bash
# Controlla headers VPN senza API calls
curl -I https://toolslab.dev -H "x-forwarded-for: 10.0.0.1"
# Dovrebbe vedere: x-vpn-mode: true

# Verifica manuale health check (se necessario)
curl https://toolslab.dev/api/vpn-health -H "x-forwarded-for: 10.0.0.1"
```

## ⚡ Riabilitazione Monitoraggio (Se Necessario)

Se in futuro servisse riabilitare il monitoraggio automatico:

```bash
# In Vercel Environment Variables
NEXT_PUBLIC_VPN_AUTO_CHECK_PRODUCTION=true
```

Questo riabiliterebbe:

- Controlli automatici ogni 60 minuti (non 5)
- Health check periodico
- Cache comunque estesa (30 min)
- Debug info sempre disabilitato

## 📈 Vantaggi Configurazione Produzione

1. **Riduzione traffico API**: -95%
2. **Migliori performance**: Cache estesa
3. **Meno overhead**: Zero background tasks
4. **Bundle più piccolo**: Debug code tree-shaken
5. **UX fluida**: Detection istantanea via middleware
6. **Costs ridotti**: Meno invocazioni Vercel Functions

La soluzione mantiene **piena funzionalità VPN** (detection, headers, compatibilità) ma elimina il "rumore" di chiamate continue in produzione.
