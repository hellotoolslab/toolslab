const fs = require('fs');

const enTools = require('../lib/i18n/dictionaries/en/tools.json').tools;
const frTools = require('../lib/i18n/dictionaries/fr/tools.json');
const esTools = require('../lib/i18n/dictionaries/es/tools.json');

let frCount = 0,
  esCount = 0;

for (const [toolId, enTool] of Object.entries(enTools)) {
  // Francese
  if (frTools.tools[toolId]) {
    if (!frTools.tools[toolId].tagline && enTool.tagline) {
      frTools.tools[toolId].tagline = enTool.tagline;
      frCount++;
    }
    if (!frTools.tools[toolId].pageDescription && enTool.pageDescription) {
      frTools.tools[toolId].pageDescription = enTool.pageDescription;
      frCount++;
    }
  }

  // Spagnolo
  if (esTools.tools[toolId]) {
    if (!esTools.tools[toolId].tagline && enTool.tagline) {
      esTools.tools[toolId].tagline = enTool.tagline;
      esCount++;
    }
    if (!esTools.tools[toolId].pageDescription && enTool.pageDescription) {
      esTools.tools[toolId].pageDescription = enTool.pageDescription;
      esCount++;
    }
  }
}

fs.writeFileSync(
  './lib/i18n/dictionaries/fr/tools.json',
  JSON.stringify(frTools, null, 2)
);
fs.writeFileSync(
  './lib/i18n/dictionaries/es/tools.json',
  JSON.stringify(esTools, null, 2)
);

console.log('✅ FR: aggiunti', frCount, 'campi');
console.log('✅ ES: aggiunti', esCount, 'campi');
console.log('⚠️  I campi sono in inglese - richiedono traduzione manuale');
