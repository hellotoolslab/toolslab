const fs = require('fs');
const path = require('path');

// Read and parse tool-seo.ts
const toolSeoContent = fs.readFileSync('./lib/tool-seo.ts', 'utf8');

// Extract toolSEO object using regex
const toolSeoMatch = toolSeoContent.match(
  /export const toolSEO[\s\S]*?= ({[\s\S]*?});/
);
const toolSEOString = toolSeoMatch[1];

// Parse each tool entry
const toolSEO = {};
const toolRegex =
  /'([^']+)':\s*{[^}]*tagline:\s*'([^']*)'[^}]*pageDescription:\s*'([^']*)'[^}]*}/g;

let match;
while ((match = toolRegex.exec(toolSEOString)) !== null) {
  toolSEO[match[1]] = {
    tagline: match[2],
    pageDescription: match[3],
  };
}

const languages = ['en', 'it', 'fr', 'es'];

languages.forEach((lang) => {
  const toolsDir = `./lib/i18n/dictionaries/${lang}/tools`;
  let updated = 0;

  console.log(`\n📦 ${lang.toUpperCase()}: Updating SEO data`);

  Object.entries(toolSEO).forEach(([toolId, seoData]) => {
    const filePath = path.join(toolsDir, `${toolId}.json`);

    if (fs.existsSync(filePath)) {
      const toolData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

      // Add tagline and pageDescription if missing
      let hasUpdates = false;

      if (seoData.tagline && !toolData.tagline) {
        toolData.tagline = seoData.tagline;
        hasUpdates = true;
      }

      if (seoData.pageDescription && !toolData.pageDescription) {
        toolData.pageDescription = seoData.pageDescription;
        hasUpdates = true;
      }

      if (hasUpdates) {
        fs.writeFileSync(filePath, JSON.stringify(toolData, null, 2));
        console.log(`  ✓ ${toolId}`);
        updated++;
      }
    }
  });

  console.log(`✅ ${lang.toUpperCase()}: ${updated} tools updated`);
});

console.log('\n🎯 SEO data copied to all granular files!');
