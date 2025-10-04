const fs = require('fs');
const path = require('path');

// Generic French instructions template
const frenchInstructionsTemplate = {
  title: 'Comment utiliser {TOOL_NAME}',
  steps: [
    {
      title: 'Collez votre {INPUT_TYPE}',
      description:
        "Copiez et collez votre {INPUT_TYPE} dans la zone de saisie. L'outil accepte tout format et le traitera immédiatement.",
    },
    {
      title: 'Configurez les options (si disponible)',
      description:
        "Ajustez les options de formatage, l'indentation ou d'autres paramètres pour correspondre à vos préférences.",
    },
    {
      title: 'Examinez la sortie',
      description:
        "L'outil va {ACTION_VERB} votre saisie et afficher le résultat avec formatage et validation appropriés.",
    },
    {
      title: 'Copiez ou téléchargez le résultat',
      description:
        'Copiez le {OUTPUT_TYPE} dans votre presse-papiers pour utilisation immédiate ou téléchargez-le en tant que fichier.',
    },
  ],
  features: [
    'Traitement en temps réel avec résultats instantanés',
    'Aucune limite de taille pour le traitement basé sur navigateur',
    'Complètement sécurisé - tout le traitement se fait dans votre navigateur',
    'Aucun téléchargement de données ou stockage serveur',
    'Copier dans le presse-papiers en un clic',
    'Télécharger les résultats sous forme de fichier',
    'Validation de syntaxe et mise en évidence des erreurs',
    'Fonctionne hors ligne après le chargement initial',
  ],
  useCases: [
    'Nettoyer et formater le code désordonné pour une meilleure lisibilité',
    'Standardiser le style de code dans les équipes de développement',
    'Déboguer les structures complexes avec une indentation appropriée',
    'Préparer le code pour la documentation et les revues de code',
    'Convertir entre différents standards de formatage',
    'Valider la syntaxe avant le déploiement',
    "Traiter les données provenant de sources externes ou d'API",
    'Générer du code prêt pour la production',
  ],
  proTips: [
    'Utilisez les raccourcis clavier pour un flux de travail plus rapide',
    'Traitez les gros fichiers en petits morceaux si les performances ralentissent',
    'Validez votre saisie avant le traitement pour détecter les erreurs tôt',
    'Enregistrez les paramètres fréquemment utilisés par défaut',
    'Utilisez la fonction de téléchargement pour archiver les fichiers',
    'Vérifiez attentivement la sortie avant utilisation en production',
  ],
  troubleshooting: [
    'Erreurs de syntaxe : vérifiez les crochets, guillemets ou points-virgules manquants',
    'Échec de traitement : assurez-vous que le format de saisie est valide',
    'Performance lente : essayez de traiter de plus petits morceaux de données',
    'Fonctionnalités manquantes : certaines syntaxes avancées peuvent nécessiter un formatage manuel',
    'Compatibilité navigateur : utilisez Chrome, Firefox ou Edge pour de meilleurs résultats',
  ],
  keyboardShortcuts: [
    { keys: 'Ctrl+V', description: "Coller l'entrée" },
    { keys: 'Ctrl+Enter', description: 'Traiter/Formater' },
    { keys: 'Ctrl+C', description: 'Copier le résultat' },
    { keys: 'Ctrl+S', description: 'Télécharger le fichier' },
  ],
};

const actionVerbs = {
  formatter: 'formater et embellir',
  minifier: 'minifier et optimiser',
  validator: 'valider',
  generator: 'générer',
  converter: 'convertir',
  encode: 'encoder',
  decode: 'décoder',
  tester: 'tester',
  default: 'traiter',
};

const inputTypes = {
  json: 'données JSON',
  sql: 'requête SQL',
  xml: 'données XML',
  yaml: 'données YAML',
  css: 'code CSS',
  js: 'code JavaScript',
  html: 'code HTML',
  csv: 'données CSV',
  base64: 'chaîne Base64',
  url: 'URL ou texte',
  jwt: 'jeton JWT',
  regex: 'expression régulière',
  markdown: 'texte Markdown',
  default: 'contenu',
};

const outputTypes = {
  json: 'JSON formaté',
  sql: 'SQL formaté',
  xml: 'XML formaté',
  yaml: 'YAML formaté',
  css: 'CSS formaté',
  js: 'JavaScript formaté',
  default: 'résultat traité',
};

function getActionVerb(toolId) {
  if (toolId.includes('formatter')) return actionVerbs.formatter;
  if (toolId.includes('minifier')) return actionVerbs.minifier;
  if (toolId.includes('validator')) return actionVerbs.validator;
  if (toolId.includes('generator')) return actionVerbs.generator;
  if (toolId.includes('converter')) return actionVerbs.converter;
  if (toolId.includes('encode')) return actionVerbs.encode;
  if (toolId.includes('decode')) return actionVerbs.decode;
  if (toolId.includes('tester')) return actionVerbs.tester;
  return actionVerbs.default;
}

function getInputType(toolId) {
  for (const [key, value] of Object.entries(inputTypes)) {
    if (toolId.includes(key) && key !== 'default') return value;
  }
  return inputTypes.default;
}

function getOutputType(toolId) {
  for (const [key, value] of Object.entries(outputTypes)) {
    if (toolId.includes(key) && key !== 'default') return value;
  }
  return outputTypes.default;
}

function generateInstructions(toolId, toolTitle) {
  const template = JSON.parse(JSON.stringify(frenchInstructionsTemplate));

  template.title = template.title.replace('{TOOL_NAME}', toolTitle);

  const inputType = getInputType(toolId);
  const actionVerb = getActionVerb(toolId);
  const outputType = getOutputType(toolId);

  template.steps[0].title = template.steps[0].title.replace(
    '{INPUT_TYPE}',
    inputType
  );
  template.steps[0].description = template.steps[0].description.replace(
    '{INPUT_TYPE}',
    inputType
  );
  template.steps[2].description = template.steps[2].description.replace(
    '{ACTION_VERB}',
    actionVerb
  );
  template.steps[3].description = template.steps[3].description.replace(
    '{OUTPUT_TYPE}',
    outputType
  );

  return template;
}

// Process remaining files (skip already translated ones)
const skipFiles = [
  'api-tester.json',
  'json-formatter.json',
  'sql-formatter.json',
];
const toolsDir = './lib/i18n/dictionaries/fr/tools';
const files = fs
  .readdirSync(toolsDir)
  .filter((f) => f.endsWith('.json') && !skipFiles.includes(f));

let updated = 0;

console.log('\n📦 FR: Translating remaining files\n');

files.forEach((file) => {
  const filePath = path.join(toolsDir, file);
  const toolId = file.replace('.json', '');
  const toolData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

  const hasEnglishInstructions =
    toolData.instructions &&
    typeof toolData.instructions === 'object' &&
    toolData.instructions.title &&
    toolData.instructions.title.includes('How to use');

  if (hasEnglishInstructions) {
    toolData.instructions = generateInstructions(toolId, toolData.title);
    fs.writeFileSync(filePath, JSON.stringify(toolData, null, 2));
    console.log(`  ✓ ${toolId}`);
    updated++;
  }
});

console.log(`\n✅ FR: ${updated} files translated`);
