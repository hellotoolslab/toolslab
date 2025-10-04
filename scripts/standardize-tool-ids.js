const fs = require('fs');

// ID ufficiali dal registry tools.ts (30 tool)
const OFFICIAL_IDS = [
  'json-formatter',
  'csv-to-json',
  'json-to-csv',
  'sql-formatter',
  'xml-formatter',
  'base64-encode',
  'url-encode',
  'hash-generator',
  'jwt-decoder',
  'base64-to-pdf',
  'text-diff',
  'markdown-preview',
  'regex-tester',
  'uuid-generator',
  'password-generator',
  'qr-generator',
  'color-picker',
  'image-optimizer',
  'favicon-generator',
  'gradient-generator',
  'api-tester',
  'json-validator',
  'crontab-builder',
  'list-compare',
  'curl-to-code',
  'json-to-typescript',
  'css-minifier',
  'js-minifier',
  'yaml-json-converter',
  'unix-timestamp-converter',
];

// Mapping vecchi ID -> nuovi ID
const ID_MAPPING = {
  'base64-decode': 'base64-encode', // Il tool encoder/decoder è unificato
  'url-decoder': 'url-encode',
  'url-encoder': 'url-encode',
  'qr-code-generator': 'qr-generator',
  'html-escape': 'html-entities-encoder', // Da verificare se esiste
  'html-unescape': 'html-entities-decoder', // Da verificare se esiste
  'diff-checker': 'text-diff',
  'unix-timestamp': 'unix-timestamp-converter',
  'list-comparator': 'list-compare',
  'markdown-previewer': 'markdown-preview',
  'javascript-minifier': 'js-minifier',
  'html-minifier': 'html-minifier', // Da verificare se esiste
  'color-converter': 'color-converter', // Da verificare se esiste
  'markdown-to-html': 'markdown-to-html', // Da verificare se esiste
  'xml-to-json': 'xml-to-json', // Da verificare se esiste
  'yaml-to-json': 'yaml-json-converter',
  'json-to-yaml': 'yaml-json-converter',
  'lorem-ipsum': 'lorem-ipsum', // Da verificare se esiste
  'text-case-converter': 'text-case-converter', // Da verificare se esiste
  'image-converter': 'image-converter', // Da verificare se esiste
};

const languages = ['en', 'it', 'fr', 'es'];

languages.forEach((lang) => {
  const filePath = `./lib/i18n/dictionaries/${lang}/tools.json`;

  if (!fs.existsSync(filePath)) {
    console.log(`⏭️  Skip ${lang}: file not found`);
    return;
  }

  const data = require(`../${filePath}`);
  const oldTools = data.tools;
  const newTools = {};

  let renamed = 0;
  let kept = 0;
  let skipped = 0;

  Object.entries(oldTools).forEach(([oldId, toolData]) => {
    // Se l'ID è già ufficiale, mantienilo
    if (OFFICIAL_IDS.includes(oldId)) {
      newTools[oldId] = toolData;
      kept++;
      return;
    }

    // Se c'è un mapping, usa il nuovo ID
    if (ID_MAPPING[oldId]) {
      const newId = ID_MAPPING[oldId];

      // Se il nuovo ID è ufficiale, rinomina
      if (OFFICIAL_IDS.includes(newId)) {
        newTools[newId] = toolData;
        console.log(`  ✓ ${lang}: ${oldId} → ${newId}`);
        renamed++;
      } else {
        // Il nuovo ID non è ufficiale, skippa
        console.log(
          `  ⚠️  ${lang}: ${oldId} → ${newId} (NOT OFFICIAL, skipped)`
        );
        skipped++;
      }
    } else {
      // Nessun mapping trovato, skippa
      console.log(`  ⚠️  ${lang}: ${oldId} (no mapping, skipped)`);
      skipped++;
    }
  });

  // Salva il file aggiornato
  data.tools = newTools;
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log(
    `\n✅ ${lang.toUpperCase()}: ${kept} kept, ${renamed} renamed, ${skipped} skipped`
  );
  console.log(`   Total tools: ${Object.keys(newTools).length}\n`);
});

console.log('\n🎯 Standardization complete!');
console.log(`📊 Official IDs: ${OFFICIAL_IDS.length}`);
