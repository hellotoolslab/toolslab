const fs = require('fs');

// Importa direttamente il modulo compilato
const { toolSEO } = require('../lib/tool-seo.ts');

console.log('📊 Trovati', Object.keys(toolSEO).length, 'tool in tool-seo.ts');

// Carica i dizionari
const frTools = require('../lib/i18n/dictionaries/fr/tools.json');
const esTools = require('../lib/i18n/dictionaries/es/tools.json');

let frAdded = 0,
  esAdded = 0;

// Aggiungi ai dizionari
for (const [toolId, seoData] of Object.entries(toolSEO)) {
  // Francese
  if (frTools.tools[toolId]) {
    if (!frTools.tools[toolId].tagline && seoData.tagline) {
      frTools.tools[toolId].tagline = seoData.tagline;
      frAdded++;
    }
    if (!frTools.tools[toolId].pageDescription && seoData.pageDescription) {
      frTools.tools[toolId].pageDescription = seoData.pageDescription;
      frAdded++;
    }
  }

  // Spagnolo
  if (esTools.tools[toolId]) {
    if (!esTools.tools[toolId].tagline && seoData.tagline) {
      esTools.tools[toolId].tagline = seoData.tagline;
      esAdded++;
    }
    if (!esTools.tools[toolId].pageDescription && seoData.pageDescription) {
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
console.log('\n📝 Per vedere i tool ancora mancanti, controlla tool-seo.ts');
