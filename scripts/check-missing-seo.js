const fs = require('fs');
const path = require('path');

const toolsDir = './lib/i18n/dictionaries/en/tools';
const files = fs.readdirSync(toolsDir);

console.log('🔍 TOOL SENZA TAGLINE/PAGEDESCRIPTION:\n');

let missing = 0;

files.forEach((file) => {
  const toolData = JSON.parse(
    fs.readFileSync(path.join(toolsDir, file), 'utf8')
  );
  const toolId = file.replace('.json', '');

  if (!toolData.tagline || !toolData.pageDescription) {
    console.log(`❌ ${toolId}`);
    if (!toolData.tagline) console.log(`   Missing: tagline`);
    if (!toolData.pageDescription) console.log(`   Missing: pageDescription`);
    missing++;
  }
});

console.log(`\n📊 Total missing: ${missing}/30`);
