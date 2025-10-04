const fs = require('fs');
const path = require('path');

// Template spagnolo generico
const spanishTemplate = {
  title: 'Cómo usar {TOOL_NAME}',
  steps: [
    {
      title: 'Pega tu {INPUT_TYPE}',
      description:
        'Copia y pega tu {INPUT_TYPE} en el área de entrada. La herramienta acepta cualquier formato y lo procesará inmediatamente.',
    },
    {
      title: 'Configura las opciones (si disponible)',
      description:
        'Ajusta las opciones de formato, indentación u otras configuraciones para que coincidan con tus preferencias.',
    },
    {
      title: 'Examina la salida',
      description:
        'La herramienta {ACTION_VERB} tu entrada y mostrará el resultado con formato y validación apropiados.',
    },
    {
      title: 'Copia o descarga el resultado',
      description:
        'Copia el {OUTPUT_TYPE} al portapapeles para uso inmediato o descárgalo como archivo.',
    },
  ],
  features: [
    'Procesamiento en tiempo real con resultados instantáneos',
    'Sin límite de tamaño para procesamiento basado en navegador',
    'Completamente seguro - todo el procesamiento ocurre en tu navegador',
    'Sin carga de datos ni almacenamiento en servidor',
    'Copiar al portapapeles con un clic',
    'Descargar resultados como archivo',
    'Validación de sintaxis y resaltado de errores',
    'Funciona sin conexión después de la carga inicial',
  ],
  useCases: [
    'Limpiar y formatear código desordenado para mejor legibilidad',
    'Estandarizar el estilo de código en equipos de desarrollo',
    'Depurar estructuras complejas con indentación apropiada',
    'Preparar código para documentación y revisiones de código',
    'Convertir entre diferentes estándares de formato',
    'Validar sintaxis antes del despliegue',
    'Procesar datos de fuentes externas o APIs',
    'Generar código listo para producción',
  ],
  proTips: [
    'Usa atajos de teclado para un flujo de trabajo más rápido',
    'Procesa archivos grandes en fragmentos más pequeños si el rendimiento disminuye',
    'Valida tu entrada antes del procesamiento para detectar errores temprano',
    'Guarda las configuraciones frecuentes como predeterminadas',
    'Usa la función de descarga para archivar archivos procesados',
    'Verifica cuidadosamente la salida antes de usar en producción',
  ],
  troubleshooting: [
    'Errores de sintaxis: verifica paréntesis, comillas o puntos y coma faltantes',
    'Fallo de procesamiento: asegúrate de que el formato de entrada sea válido',
    'Rendimiento lento: intenta procesar fragmentos de datos más pequeños',
    'Funciones faltantes: algunas sintaxis avanzadas pueden requerir formato manual',
    'Compatibilidad de navegador: usa Chrome, Firefox o Edge para mejores resultados',
  ],
  keyboardShortcuts: [
    { keys: 'Ctrl+V', description: 'Pegar entrada' },
    { keys: 'Ctrl+Enter', description: 'Procesar/Formatear' },
    { keys: 'Ctrl+C', description: 'Copiar resultado' },
    { keys: 'Ctrl+S', description: 'Descargar archivo' },
  ],
};

const actionVerbs = {
  formatter: 'formateará y embellecerá',
  minifier: 'minificará y optimizará',
  validator: 'validará',
  generator: 'generará',
  converter: 'convertirá',
  encode: 'codificará',
  decode: 'decodificará',
  tester: 'probará',
  default: 'procesará',
};

const inputTypes = {
  json: 'datos JSON',
  sql: 'consulta SQL',
  xml: 'datos XML',
  yaml: 'datos YAML',
  css: 'código CSS',
  js: 'código JavaScript',
  html: 'código HTML',
  csv: 'datos CSV',
  base64: 'cadena Base64',
  url: 'URL o texto',
  jwt: 'token JWT',
  regex: 'expresión regular',
  markdown: 'texto Markdown',
  default: 'contenido',
};

const outputTypes = {
  json: 'JSON formateado',
  sql: 'SQL formateado',
  xml: 'XML formateado',
  yaml: 'YAML formateado',
  css: 'CSS formateado',
  js: 'JavaScript formateado',
  default: 'resultado procesado',
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
  const template = JSON.parse(JSON.stringify(spanishTemplate));

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
const toolsDir = './lib/i18n/dictionaries/es/tools';
const files = fs
  .readdirSync(toolsDir)
  .filter((f) => f.endsWith('.json') && !skipFiles.includes(f));

let updated = 0;

console.log('\n📦 ES: Traduciendo archivos restantes\n');

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

console.log(`\n✅ ES: ${updated} archivos traducidos`);
