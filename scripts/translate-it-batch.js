const fs = require('fs');
const path = require('path');

// Template italiano generico
const italianTemplate = {
  title: 'Come usare {TOOL_NAME}',
  steps: [
    {
      title: 'Incolla il tuo {INPUT_TYPE}',
      description:
        "Copia e incolla il tuo {INPUT_TYPE} nell'area di input. Lo strumento accetta qualsiasi formato e lo elaborerà immediatamente.",
    },
    {
      title: 'Configura le opzioni (se disponibile)',
      description:
        'Regola le opzioni di formattazione, indentazione o altre impostazioni per adattarle alle tue preferenze.',
    },
    {
      title: "Esamina l'output",
      description:
        'Lo strumento {ACTION_VERB} il tuo input e mostrerà il risultato con formattazione e validazione appropriate.',
    },
    {
      title: 'Copia o scarica il risultato',
      description:
        'Copia il {OUTPUT_TYPE} negli appunti per uso immediato o scaricalo come file.',
    },
  ],
  features: [
    'Elaborazione in tempo reale con risultati istantanei',
    "Nessun limite di dimensione per l'elaborazione basata su browser",
    "Completamente sicuro - tutta l'elaborazione avviene nel tuo browser",
    'Nessun caricamento dati o archiviazione server',
    'Copia negli appunti con un clic',
    'Scarica i risultati come file',
    'Validazione sintassi ed evidenziazione errori',
    'Funziona offline dopo il caricamento iniziale',
  ],
  useCases: [
    'Pulire e formattare codice disordinato per una migliore leggibilità',
    'Standardizzare lo stile del codice nei team di sviluppo',
    'Debug di strutture complesse con indentazione appropriata',
    'Preparare il codice per documentazione e code review',
    'Convertire tra diversi standard di formattazione',
    'Validare la sintassi prima del deploy',
    'Elaborare dati da fonti esterne o API',
    'Generare codice pronto per la produzione',
  ],
  proTips: [
    'Usa le scorciatoie da tastiera per un flusso di lavoro più veloce',
    'Elabora file di grandi dimensioni in blocchi più piccoli se le prestazioni rallentano',
    "Valida il tuo input prima dell'elaborazione per individuare errori anticipatamente",
    'Salva le impostazioni utilizzate frequentemente come predefinite',
    'Usa la funzione di download per archiviare i file elaborati',
    "Controlla attentamente l'output prima di usarlo in produzione",
  ],
  troubleshooting: [
    'Errori di sintassi: controlla parentesi, virgolette o punti e virgola mancanti',
    'Elaborazione fallita: assicurati che il formato di input sia valido',
    'Performance lenta: prova a elaborare blocchi di dati più piccoli',
    'Funzionalità mancanti: alcune sintassi avanzate potrebbero richiedere formattazione manuale',
    'Compatibilità browser: usa Chrome, Firefox o Edge per risultati migliori',
  ],
  keyboardShortcuts: [
    { keys: 'Ctrl+V', description: 'Incolla input' },
    { keys: 'Ctrl+Enter', description: 'Elabora/Formatta' },
    { keys: 'Ctrl+C', description: 'Copia risultato' },
    { keys: 'Ctrl+S', description: 'Scarica file' },
  ],
};

const actionVerbs = {
  formatter: 'formatterà ed abbellirà',
  minifier: 'minificherà e ottimizzerà',
  validator: 'validerà',
  generator: 'genererà',
  converter: 'convertirà',
  encode: 'codificherà',
  decode: 'decodificherà',
  tester: 'testerà',
  default: 'elaborerà',
};

const inputTypes = {
  json: 'dati JSON',
  sql: 'query SQL',
  xml: 'dati XML',
  yaml: 'dati YAML',
  css: 'codice CSS',
  js: 'codice JavaScript',
  html: 'codice HTML',
  csv: 'dati CSV',
  base64: 'stringa Base64',
  url: 'URL o testo',
  jwt: 'token JWT',
  regex: 'espressione regolare',
  markdown: 'testo Markdown',
  default: 'contenuto',
};

const outputTypes = {
  json: 'JSON formattato',
  sql: 'SQL formattato',
  xml: 'XML formattato',
  yaml: 'YAML formattato',
  css: 'CSS formattato',
  js: 'JavaScript formattato',
  default: 'risultato elaborato',
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
  const template = JSON.parse(JSON.stringify(italianTemplate));

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

// Processa solo i file con testo inglese, escludendo quelli già tradotti
const skipFiles = ['api-tester.json', 'sql-formatter.json'];
const toolsDir = './lib/i18n/dictionaries/it/tools';
const files = fs
  .readdirSync(toolsDir)
  .filter((f) => f.endsWith('.json') && !skipFiles.includes(f));

let updated = 0;

console.log('\n📦 IT: Traduzione file rimanenti\n');

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

console.log(`\n✅ IT: ${updated} file tradotti`);
