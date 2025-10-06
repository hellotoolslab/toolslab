const fs = require('fs');
const path = require('path');

// Leggi il file tool-seo.ts come testo
const toolSeoContent = fs.readFileSync('./lib/tool-seo.ts', 'utf8');

// Estrai i dati SEO con regex
const toolSeoData = {};
const toolRegex =
  /{\s*id:\s*'([^']+)',\s*tagline:\s*'([^']+)',\s*(?:seoDescription|metaDescription):\s*'([^']+)',?\s*}/g;

let match;
while ((match = toolRegex.exec(toolSeoContent)) !== null) {
  toolSeoData[match[1]] = {
    tagline: match[2],
    pageDescription: match[3],
  };
}

console.log(
  '📊 Trovati',
  Object.keys(toolSeoData).length,
  'tool in tool-seo.ts'
);

// Carica i dizionari
const frTools = require('../lib/i18n/dictionaries/fr/tools.json');
const esTools = require('../lib/i18n/dictionaries/es/tools.json');

let frAdded = 0,
  esAdded = 0;

// Aggiungi ai dizionari
for (const [toolId, seoData] of Object.entries(toolSeoData)) {
  // Francese
  if (frTools.tools[toolId]) {
    if (!frTools.tools[toolId].tagline) {
      frTools.tools[toolId].tagline = seoData.tagline;
      frAdded++;
    }
    if (!frTools.tools[toolId].pageDescription) {
      frTools.tools[toolId].pageDescription = seoData.pageDescription;
      frAdded++;
    }
  }

  // Spagnolo
  if (esTools.tools[toolId]) {
    if (!esTools.tools[toolId].tagline) {
      esTools.tools[toolId].tagline = seoData.tagline;
      esAdded++;
    }
    if (!esTools.tools[toolId].pageDescription) {
      esTools.tools[toolId].pageDescription = seoData.pageDescription;
      esAdded++;
    }
  }
}

// Salva i file
fs.writeFileSync(
  './lib/i18n/dictionaries/fr/tools.json',
  JSON.stringify(frTools, null, 2)
);
fs.writeFileSync(
  './lib/i18n/dictionaries/es/tools.json',
  JSON.stringify(esTools, null, 2)
);

console.log('✅ FR: aggiunti', frAdded, 'campi');
console.log('✅ ES: aggiunti', esAdded, 'campi');
console.log('⚠️  I testi sono in inglese - da tradurre gradualmente');
