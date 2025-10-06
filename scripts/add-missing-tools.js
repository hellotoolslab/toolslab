const fs = require('fs');

// Tool ufficiali dal registry (30 tool)
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

// Carica IT come source (ha tutti i 30 tool)
const itData = require('../lib/i18n/dictionaries/it/tools.json');

const languages = ['en', 'fr', 'es'];

languages.forEach((lang) => {
  const filePath = `./lib/i18n/dictionaries/${lang}/tools.json`;
  const data = require(`../${filePath}`);

  const existingIds = Object.keys(data.tools);
  const missing = OFFICIAL_IDS.filter((id) => !existingIds.includes(id));

  console.log(
    `\n📊 ${lang.toUpperCase()}: Adding ${missing.length} missing tools`
  );

  let added = 0;
  missing.forEach((id) => {
    if (itData.tools[id]) {
      // Copia da IT, ma SOLO i campi base (title, description, placeholder, meta)
      // Le instructions vanno tradotte a parte
      data.tools[id] = {
        title: itData.tools[id].title || id,
        description: itData.tools[id].description || '',
        placeholder: itData.tools[id].placeholder || '',
        meta: itData.tools[id].meta || {
          title: `${id} - Free Online Tool | ToolsLab`,
          description: `Use ${id} online for free.`,
        },
      };

      // Se ci sono tagline/pageDescription in IT, copiali (saranno in inglese, da tradurre)
      if (itData.tools[id].tagline) {
        data.tools[id].tagline = itData.tools[id].tagline;
      }
      if (itData.tools[id].pageDescription) {
        data.tools[id].pageDescription = itData.tools[id].pageDescription;
      }

      console.log(`  ✓ Added: ${id}`);
      added++;
    } else {
      console.log(`  ⚠️  Missing in IT: ${id}`);
    }
  });

  // Ordina alfabeticamente i tool
  const sortedTools = {};
  Object.keys(data.tools)
    .sort()
    .forEach((key) => {
      sortedTools[key] = data.tools[key];
    });
  data.tools = sortedTools;

  // Salva
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  console.log(
    `✅ ${lang.toUpperCase()}: ${added} tools added, total: ${Object.keys(data.tools).length}`
  );
});

console.log('\n🎯 All tools added successfully!');
console.log(`📊 Official registry has ${OFFICIAL_IDS.length} tools`);
