const fs = require('fs');
const path = require('path');

// French translations for common instruction patterns
const translations = {
  // Titles
  'How to use': 'Comment utiliser',

  // Steps common phrases
  'Paste your': 'Collez votre',
  'Copy and paste your': 'Copiez et collez votre',
  'into the input area': 'dans la zone de saisie',
  'The tool accepts any format and will process it immediately':
    "L'outil accepte n'importe quel format et le traitera immédiatement",

  'Configure options (if available)': 'Configurer les options (si disponible)',
  'Adjust formatting options, indentation, or other settings to match your preferences and coding standards':
    "Ajustez les options de formatage, l'indentation ou d'autres paramètres pour correspondre à vos préférences et normes de codage",

  'Review the output': 'Examiner la sortie',
  'The tool will': "L'outil va",
  'your input and display the result with proper formatting and validation':
    'votre saisie et afficher le résultat avec le formatage et la validation appropriés',

  'Copy or download result': 'Copier ou télécharger le résultat',
  'Copy the': 'Copiez le',
  'to your clipboard for immediate use or download it as a file for storage and sharing':
    'dans votre presse-papiers pour une utilisation immédiate ou téléchargez-le en tant que fichier pour le stockage et le partage',

  // Action verbs
  'format and beautify': 'formater et embellir',
  'minify and optimize': 'minifier et optimiser',
  validate: 'valider',
  generate: 'générer',
  convert: 'convertir',
  'encode/decode': 'encoder/décoder',
  test: 'tester',
  process: 'traiter',

  // Data types
  'JSON data': 'données JSON',
  'SQL query': 'requête SQL',
  'XML data': 'données XML',
  'YAML data': 'données YAML',
  'CSS code': 'code CSS',
  'JavaScript code': 'code JavaScript',
  'HTML code': 'code HTML',
  'CSV data': 'données CSV',
  'Base64 string or file': 'chaîne Base64 ou fichier',
  'URL or text': 'URL ou texte',
  'JWT token': 'jeton JWT',
  'regular expression': 'expression régulière',
  'Markdown text': 'texte Markdown',
  content: 'contenu',

  // Output types
  'formatted JSON': 'JSON formaté',
  'formatted SQL': 'SQL formaté',
  'generated output': 'sortie générée',
  'converted data': 'données converties',
  'processed output': 'sortie traitée',

  // Features
  'Real-time processing with instant results':
    'Traitement en temps réel avec résultats instantanés',
  'No file size limits for browser-based processing':
    'Aucune limite de taille de fichier pour le traitement basé sur le navigateur',
  'Completely secure - all processing happens in your browser':
    'Complètement sécurisé - tout le traitement se fait dans votre navigateur',
  'No data uploads or server storage':
    'Aucun téléchargement de données ou stockage sur serveur',
  'Copy to clipboard with one click':
    'Copier dans le presse-papiers en un clic',
  'Download results as file': 'Télécharger les résultats sous forme de fichier',
  'Syntax validation and error highlighting':
    'Validation de la syntaxe et mise en évidence des erreurs',
  'Works offline after initial page load':
    'Fonctionne hors ligne après le chargement initial de la page',

  // Use Cases
  'Clean up and format messy code for better readability':
    'Nettoyer et formater le code désordonné pour une meilleure lisibilité',
  'Standardize code style across development teams':
    'Standardiser le style de code dans les équipes de développement',
  'Debug complex structures with proper indentation':
    'Déboguer les structures complexes avec une indentation appropriée',
  'Prepare code for documentation and code reviews':
    'Préparer le code pour la documentation et les revues de code',
  'Convert between different formatting standards':
    'Convertir entre différents standards de formatage',
  'Validate syntax before deployment':
    'Valider la syntaxe avant le déploiement',
  'Process data from external sources or APIs':
    "Traiter les données provenant de sources externes ou d'API",
  'Generate production-ready code from development versions':
    'Générer du code prêt pour la production à partir des versions de développement',

  // Pro Tips
  'Use keyboard shortcuts for faster workflow':
    'Utilisez les raccourcis clavier pour un flux de travail plus rapide',
  'Process large files in smaller chunks if performance slows':
    'Traitez les gros fichiers en petits morceaux si les performances ralentissent',
  'Validate your input before processing to catch errors early':
    'Validez votre saisie avant le traitement pour détecter les erreurs tôt',
  'Save frequently used settings as defaults in your browser':
    'Enregistrez les paramètres fréquemment utilisés par défaut dans votre navigateur',
  'Use the download feature for archiving processed files':
    'Utilisez la fonction de téléchargement pour archiver les fichiers traités',
  'Check the output carefully before using in production':
    "Vérifiez attentivement la sortie avant de l'utiliser en production",

  // Troubleshooting
  'Syntax errors: Check for missing brackets, quotes, or semicolons':
    'Erreurs de syntaxe : vérifiez les crochets, guillemets ou points-virgules manquants',
  'Processing fails: Ensure your input format is valid':
    'Le traitement échoue : assurez-vous que le format de saisie est valide',
  'Slow performance: Try processing smaller chunks of data':
    'Performance lente : essayez de traiter de plus petits morceaux de données',
  'Missing features: Some advanced syntax may require manual formatting':
    'Fonctionnalités manquantes : certaines syntaxes avancées peuvent nécessiter un formatage manuel',
  'Browser compatibility: Use latest version of Chrome, Firefox, or Edge for best results':
    'Compatibilité navigateur : utilisez la dernière version de Chrome, Firefox ou Edge pour de meilleurs résultats',

  // Keyboard shortcuts
  'Paste input': 'Coller la saisie',
  'Process/Format': 'Traiter/Formater',
  'Copy result': 'Copier le résultat',
  'Download file': 'Télécharger le fichier',
};

function translateText(text) {
  let translated = text;

  // Replace exact matches first (longer phrases)
  const sortedKeys = Object.keys(translations).sort(
    (a, b) => b.length - a.length
  );

  for (const key of sortedKeys) {
    translated = translated.replace(new RegExp(key, 'g'), translations[key]);
  }

  return translated;
}

function translateInstructions(instructions) {
  if (!instructions || typeof instructions !== 'object') return instructions;

  const translated = { ...instructions };

  // Translate title
  if (translated.title) {
    translated.title = translateText(translated.title);
  }

  // Translate steps
  if (translated.steps && Array.isArray(translated.steps)) {
    translated.steps = translated.steps.map((step) => ({
      title: translateText(step.title),
      description: translateText(step.description),
    }));
  }

  // Translate features
  if (translated.features && Array.isArray(translated.features)) {
    translated.features = translated.features.map((f) => translateText(f));
  }

  // Translate use cases
  if (translated.useCases && Array.isArray(translated.useCases)) {
    translated.useCases = translated.useCases.map((u) => translateText(u));
  }

  // Translate pro tips
  if (translated.proTips && Array.isArray(translated.proTips)) {
    translated.proTips = translated.proTips.map((t) => translateText(t));
  }

  // Translate troubleshooting
  if (translated.troubleshooting && Array.isArray(translated.troubleshooting)) {
    translated.troubleshooting = translated.troubleshooting.map((t) =>
      translateText(t)
    );
  }

  // Translate keyboard shortcuts
  if (
    translated.keyboardShortcuts &&
    Array.isArray(translated.keyboardShortcuts)
  ) {
    translated.keyboardShortcuts = translated.keyboardShortcuts.map((k) => ({
      keys: k.keys,
      description: translateText(k.description),
    }));
  }

  return translated;
}

// Process all FR tools
const toolsDir = './lib/i18n/dictionaries/fr/tools';
const files = fs.readdirSync(toolsDir).filter((f) => f.endsWith('.json'));

let updated = 0;

console.log('\n📦 FR: Translating English text to French\n');

files.forEach((file) => {
  const filePath = path.join(toolsDir, file);
  const toolId = file.replace('.json', '');
  const toolData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  // Check if has English instructions
  const hasEnglishInstructions =
    toolData.instructions &&
    typeof toolData.instructions === 'object' &&
    toolData.instructions.title &&
    toolData.instructions.title.includes('How to use');

  if (hasEnglishInstructions) {
    toolData.instructions = translateInstructions(toolData.instructions);
    fs.writeFileSync(filePath, JSON.stringify(toolData, null, 2));
    console.log(`  ✓ ${toolId}`);
    updated++;
  } else {
    console.log(`  ⏭️  ${toolId} - no English instructions found`);
  }
});

console.log(`\n✅ FR: ${updated} tools translated`);
