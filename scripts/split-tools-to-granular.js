const fs = require('fs');
const path = require('path');

const languages = ['en', 'it', 'fr', 'es'];

languages.forEach((lang) => {
  const toolsFilePath = `./lib/i18n/dictionaries/${lang}/tools.json`;
  const toolsDir = `./lib/i18n/dictionaries/${lang}/tools`;

  // Leggi il file tools.json
  const toolsData = require(`../${toolsFilePath}`);
  const tools = toolsData.tools;

  console.log(
    `\n📦 ${lang.toUpperCase()}: Splitting ${Object.keys(tools).length} tools`
  );

  let count = 0;

  // Crea un file per ogni tool
  Object.entries(tools).forEach(([toolId, toolData]) => {
    const fileName = `${toolId}.json`;
    const filePath = path.join(toolsDir, fileName);

    // Scrivi il file JSON per questo tool
    fs.writeFileSync(filePath, JSON.stringify(toolData, null, 2));

    console.log(`  ✓ ${fileName}`);
    count++;
  });

  console.log(
    `✅ ${lang.toUpperCase()}: ${count} files created in ${toolsDir}/`
  );
});

console.log('\n🎉 All tools split into individual files!');
console.log('\n📁 Structure created:');
console.log('lib/i18n/dictionaries/{lang}/tools/');
console.log('  ├── json-formatter.json');
console.log('  ├── sql-formatter.json');
console.log('  ├── base64-encode.json');
console.log('  └── ... (30 files per language)');
