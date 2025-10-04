const fs = require('fs');
const path = require('path');

// Template for structured instructions
function generateInstructions(toolId, toolData, lang = 'en') {
  const title = toolData.title || toolId;
  const actionVerb = getActionVerb(toolId);

  return {
    title: `How to use ${title}`,
    steps: [
      {
        title: `Paste your ${getInputType(toolId)}`,
        description: `Copy and paste your ${getInputType(toolId)} into the input area. The tool accepts any format and will process it immediately.`,
      },
      {
        title: 'Configure options (if available)',
        description: `Adjust formatting options, indentation, or other settings to match your preferences and coding standards.`,
      },
      {
        title: 'Review the output',
        description: `The tool will ${actionVerb} your input and display the result with proper formatting and validation.`,
      },
      {
        title: 'Copy or download result',
        description: `Copy the ${getOutputType(toolId)} to your clipboard for immediate use or download it as a file for storage and sharing.`,
      },
    ],
    features: generateFeatures(toolId, toolData),
    useCases: generateUseCases(toolId, toolData),
    proTips: generateProTips(toolId, toolData),
    troubleshooting: generateTroubleshooting(toolId),
    keyboardShortcuts: [
      { keys: 'Ctrl+V', description: 'Paste input' },
      { keys: 'Ctrl+Enter', description: 'Process/Format' },
      { keys: 'Ctrl+C', description: 'Copy result' },
      { keys: 'Ctrl+S', description: 'Download file' },
    ],
  };
}

function getActionVerb(toolId) {
  if (toolId.includes('formatter')) return 'format and beautify';
  if (toolId.includes('minifier')) return 'minify and optimize';
  if (toolId.includes('validator')) return 'validate';
  if (toolId.includes('generator')) return 'generate';
  if (toolId.includes('converter')) return 'convert';
  if (toolId.includes('encoder') || toolId.includes('decoder'))
    return 'encode/decode';
  if (toolId.includes('tester')) return 'test';
  return 'process';
}

function getInputType(toolId) {
  if (toolId.includes('json')) return 'JSON data';
  if (toolId.includes('sql')) return 'SQL query';
  if (toolId.includes('xml')) return 'XML data';
  if (toolId.includes('yaml')) return 'YAML data';
  if (toolId.includes('css')) return 'CSS code';
  if (toolId.includes('js')) return 'JavaScript code';
  if (toolId.includes('html')) return 'HTML code';
  if (toolId.includes('csv')) return 'CSV data';
  if (toolId.includes('base64')) return 'Base64 string or file';
  if (toolId.includes('url')) return 'URL or text';
  if (toolId.includes('jwt')) return 'JWT token';
  if (toolId.includes('regex')) return 'regular expression';
  if (toolId.includes('markdown')) return 'Markdown text';
  return 'content';
}

function getOutputType(toolId) {
  if (toolId.includes('json')) return 'formatted JSON';
  if (toolId.includes('sql')) return 'formatted SQL';
  if (toolId.includes('generator')) return 'generated output';
  if (toolId.includes('converter')) return 'converted data';
  return 'processed output';
}

function generateFeatures(toolId, toolData) {
  const features = [
    'Real-time processing with instant results',
    'No file size limits for browser-based processing',
    'Completely secure - all processing happens in your browser',
    'No data uploads or server storage',
    'Copy to clipboard with one click',
    'Download results as file',
    'Syntax validation and error highlighting',
    'Works offline after initial page load',
  ];
  return features;
}

function generateUseCases(toolId, toolData) {
  const common = [
    'Clean up and format messy code for better readability',
    'Standardize code style across development teams',
    'Debug complex structures with proper indentation',
    'Prepare code for documentation and code reviews',
    'Convert between different formatting standards',
    'Validate syntax before deployment',
    'Process data from external sources or APIs',
    'Generate production-ready code from development versions',
  ];
  return common;
}

function generateProTips(toolId, toolData) {
  const tips = [
    'Use keyboard shortcuts for faster workflow',
    'Process large files in smaller chunks if performance slows',
    'Validate your input before processing to catch errors early',
    'Save frequently used settings as defaults in your browser',
    'Use the download feature for archiving processed files',
    'Check the output carefully before using in production',
  ];
  return tips;
}

function generateTroubleshooting(toolId) {
  const issues = [
    'Syntax errors: Check for missing brackets, quotes, or semicolons',
    'Processing fails: Ensure your input format is valid',
    'Slow performance: Try processing smaller chunks of data',
    'Missing features: Some advanced syntax may require manual formatting',
    'Browser compatibility: Use latest version of Chrome, Firefox, or Edge for best results',
  ];
  return issues;
}

// Process all tools
const languages = ['en', 'it', 'fr', 'es'];

languages.forEach((lang) => {
  const toolsDir = `./lib/i18n/dictionaries/${lang}/tools`;
  const files = fs.readdirSync(toolsDir).filter((f) => f.endsWith('.json'));

  let updated = 0;

  console.log(`\n📦 ${lang.toUpperCase()}: Processing instructions`);

  files.forEach((file) => {
    const filePath = path.join(toolsDir, file);
    const toolId = file.replace('.json', '');
    const toolData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    // Skip if already has structured instructions
    if (
      toolData.instructions &&
      typeof toolData.instructions === 'object' &&
      toolData.instructions.steps
    ) {
      console.log(`  ⏭️  ${toolId} - already has structured instructions`);
      return;
    }

    // Generate structured instructions
    toolData.instructions = generateInstructions(toolId, toolData, lang);

    fs.writeFileSync(filePath, JSON.stringify(toolData, null, 2));
    console.log(`  ✓ ${toolId}`);
    updated++;
  });

  console.log(`✅ ${lang.toUpperCase()}: ${updated} tools updated`);
});

console.log('\n🎉 All tools now have structured instructions!');
