#!/usr/bin/env node

/**
 * Setup script per configurare Edge Config Management
 */

require('dotenv').config({ path: '.env.local' });
const fs = require('fs');
const path = require('path');

console.log(`
╔══════════════════════════════════════════════════════════════╗
║           🔧 Edge Config Management Setup                     ║
╚══════════════════════════════════════════════════════════════╝

Per gestire Edge Config (attivare maintenance mode, modificare features, ecc.)
hai bisogno di configurare l'accesso all'API di Vercel.

📋 STEP DA SEGUIRE:

1. VAI SU VERCEL DASHBOARD
   👉 https://vercel.com/account/tokens

2. CREA UN ACCESS TOKEN
   - Nome: "OctoTools Edge Config Manager"
   - Scope: Full Account
   - Expiration: No Expiration (o come preferisci)
   - Clicca "Create"

3. VAI ALLA TUA EDGE CONFIG
   👉 https://vercel.com/dashboard/stores
   - Clicca sulla tua Edge Config
   - Copia l'Edge Config ID dall'URL
   - Esempio: se l'URL è https://vercel.com/your-team/stores/ecfg_ywzwkqs7c2ti9gzqybsf6bxumys5
   - L'ID è: ecfg_ywzwkqs7c2ti9gzqybsf6bxumys5

4. AGGIUNGI QUESTE VARIABILI A .env.local:
`);

const envExample = `
# Edge Config Management (aggiungi a .env.local)
VERCEL_API_TOKEN=your-vercel-api-token-here
EDGE_CONFIG_ID=ecfg_ywzwkqs7c2ti9gzqybsf6bxumys5
VERCEL_TEAM_ID=team_xxxxx  # Opzionale, solo se usi un team
`;

console.log(envExample);

console.log(`
5. TESTA LA CONFIGURAZIONE:
   npm run edge-config:manage test

📝 NOTE IMPORTANTI:

- Il VERCEL_API_TOKEN è DIVERSO dal token nell'URL di Edge Config
- L'URL di Edge Config (già in .env.local) è per LETTURA
- Il VERCEL_API_TOKEN è per SCRITTURA/GESTIONE
- Non condividere mai questi token pubblicamente!

🔒 SICUREZZA:

- Aggiungi .env.local al .gitignore (già fatto)
- In produzione usa Vercel Environment Variables
- Ruota periodicamente i token per sicurezza

STATO ATTUALE:
`);

// Verifica configurazione attuale
const hasEdgeConfig = !!process.env.EDGE_CONFIG;
const hasApiToken = !!process.env.VERCEL_API_TOKEN;
const hasConfigId = !!process.env.EDGE_CONFIG_ID;

console.log(
  `✅ EDGE_CONFIG URL: ${hasEdgeConfig ? 'Configurato' : '❌ Mancante'}`
);
console.log(
  `${hasApiToken ? '✅' : '❌'} VERCEL_API_TOKEN: ${hasApiToken ? 'Configurato' : 'Mancante'}`
);
console.log(
  `${hasConfigId ? '✅' : '❌'} EDGE_CONFIG_ID: ${hasConfigId ? 'Configurato' : 'Mancante'}`
);

if (hasEdgeConfig && !hasApiToken) {
  console.log(`
⚠️  Hai configurato Edge Config per la LETTURA ma non per la GESTIONE.
    Per abilitare i comandi di gestione, segui gli step sopra.
`);
}

if (hasEdgeConfig && hasApiToken && hasConfigId) {
  console.log(`
🎉 Tutto configurato! Puoi ora usare:

- npm run edge-config:manage maintenance on    # Attiva maintenance mode
- npm run edge-config:manage maintenance off   # Disattiva maintenance mode
- npm run edge-config:manage feature ads on    # Abilita ads
- npm run edge-config:manage feature pro off   # Disabilita pro features
`);
}
