const fs = require('fs');

// Traduzioni FR
const FR_TRANSLATIONS = {
  'api-tester': {
    title: 'Testeur API',
    description:
      'Testez les endpoints API avec support pour différentes méthodes HTTP et en-têtes',
    placeholder: "Entrez l'URL de l'API...",
    meta: {
      title: 'Testeur API - Outil en Ligne Gratuit | ToolsLab',
      description:
        'Testez les API REST en ligne. Envoyez des requêtes HTTP avec en-têtes personnalisés. Testeur API gratuit.',
    },
  },
  'crontab-builder': {
    title: "Constructeur d'Expressions Crontab",
    description:
      'Analysez, construisez et validez les expressions cron avec constructeur visuel, presets et prochaines exécutions',
    placeholder: 'Entrez une expression cron...',
    meta: {
      title: 'Constructeur Crontab - Outil en Ligne Gratuit | ToolsLab',
      description:
        'Construisez et validez les expressions cron en ligne. Générez crontab avec constructeur visuel. Outil cron gratuit.',
    },
  },
  'curl-to-code': {
    title: 'cURL vers Code',
    description: 'Convertissez les commandes cURL en code pour divers langages',
    placeholder: 'Collez votre commande cURL...',
    meta: {
      title: 'cURL vers Code - Outil en Ligne Gratuit | ToolsLab',
      description:
        'Convertissez cURL en code en ligne. Générez des snippets depuis des commandes curl. Convertisseur cURL gratuit.',
    },
  },
  'favicon-generator': {
    title: 'Générateur Favicon',
    description: 'Générez des favicons pour sites web en différents formats',
    placeholder: 'Téléversez une image...',
    meta: {
      title: 'Générateur Favicon - Outil en Ligne Gratuit | ToolsLab',
      description:
        'Créez des favicons en ligne. Générez des favicons en plusieurs formats. Générateur favicon gratuit.',
    },
  },
  'gradient-generator': {
    title: 'Générateur de Dégradés',
    description: 'Générez des dégradés CSS personnalisés',
    placeholder: 'Choisissez les couleurs...',
    meta: {
      title: 'Générateur de Dégradés CSS - Outil en Ligne Gratuit | ToolsLab',
      description:
        'Créez des dégradés CSS en ligne. Générez du code dégradé personnalisé. Générateur de dégradé gratuit.',
    },
  },
  'image-optimizer': {
    title: "Optimiseur d'Images",
    description: 'Optimisez et compressez les images',
    placeholder: 'Téléversez une image...',
    meta: {
      title: "Optimiseur d'Images - Outil en Ligne Gratuit | ToolsLab",
      description:
        "Optimisez les images en ligne. Compressez les fichiers image. Optimiseur d'images gratuit.",
    },
  },
  'json-validator': {
    title: 'Validateur JSON',
    description: 'Validez la syntaxe et la structure JSON',
    placeholder: 'Collez votre JSON...',
    meta: {
      title: 'Validateur JSON - Outil en Ligne Gratuit | ToolsLab',
      description:
        'Validez JSON en ligne. Vérifiez la syntaxe et la structure JSON. Validateur JSON gratuit.',
    },
  },
  'list-compare': {
    title: 'Comparateur de Listes',
    description:
      'Comparez deux listes pour trouver différences, intersections et unions',
    placeholder: 'Collez la première liste...',
    meta: {
      title: 'Comparateur de Listes - Outil en Ligne Gratuit | ToolsLab',
      description:
        'Comparez les listes en ligne. Trouvez les différences, intersections et unions. Outil de comparaison de listes gratuit.',
    },
  },
  'markdown-preview': {
    title: 'Aperçu Markdown',
    description:
      "Visualisez l'aperçu en direct de markdown avec coloration syntaxique",
    placeholder: 'Collez votre Markdown...',
    meta: {
      title: 'Aperçu Markdown - Outil en Ligne Gratuit | ToolsLab',
      description:
        'Aperçu markdown en temps réel en ligne. Éditeur markdown avec aperçu en direct. Outil markdown gratuit.',
    },
  },
  'base64-to-pdf': {
    title: 'Base64 vers PDF',
    description: 'Convertissez les chaînes Base64 en fichiers PDF',
    placeholder: 'Collez la chaîne Base64...',
    meta: {
      title: 'Base64 vers PDF - Outil en Ligne Gratuit | ToolsLab',
      description:
        'Convertissez Base64 en PDF en ligne. Décodez Base64 et enregistrez comme PDF. Convertisseur gratuit.',
    },
  },
  'color-picker': {
    title: 'Sélecteur de Couleurs',
    description:
      'Choisissez et convertissez les couleurs entre formats HEX, RGB, HSL',
    placeholder: 'Choisissez une couleur...',
    meta: {
      title: 'Sélecteur de Couleurs - Outil en Ligne Gratuit | ToolsLab',
      description:
        'Sélectionnez les couleurs en ligne. Convertissez entre HEX, RGB, HSL. Sélecteur de couleurs gratuit.',
    },
  },
  'json-to-typescript': {
    title: 'JSON vers TypeScript',
    description: 'Convertissez JSON en interfaces TypeScript',
    placeholder: 'Collez votre JSON...',
    meta: {
      title: 'JSON vers TypeScript - Outil en Ligne Gratuit | ToolsLab',
      description:
        'Générez des interfaces TypeScript depuis JSON en ligne. Convertisseur JSON to TypeScript gratuit.',
    },
  },
  'xml-formatter': {
    title: 'Formateur XML',
    description:
      'Formatez, validez et minifiez les documents XML avec coloration syntaxique et support XPath',
    placeholder: 'Collez votre XML...',
    meta: {
      title: 'Formateur XML - Outil en Ligne Gratuit | ToolsLab',
      description:
        'Formatez et validez XML en ligne. Minifiez les documents XML avec support XPath. Formateur XML gratuit.',
    },
  },
};

// Traduzioni ES
const ES_TRANSLATIONS = {
  'api-tester': {
    title: 'Probador API',
    description:
      'Prueba endpoints API con soporte para varios métodos HTTP y encabezados',
    placeholder: 'Ingresa la URL de la API...',
    meta: {
      title: 'Probador API - Herramienta Online Gratuita | ToolsLab',
      description:
        'Prueba API REST en línea. Envía solicitudes HTTP con encabezados personalizados. Probador API gratuito.',
    },
  },
  'crontab-builder': {
    title: 'Constructor de Expresiones Crontab',
    description:
      'Analiza, construye y valida expresiones cron con constructor visual, presets y próximas ejecuciones',
    placeholder: 'Ingresa una expresión cron...',
    meta: {
      title: 'Constructor Crontab - Herramienta Online Gratuita | ToolsLab',
      description:
        'Construye y valida expresiones cron en línea. Genera crontab con constructor visual. Herramienta cron gratuita.',
    },
  },
  'curl-to-code': {
    title: 'cURL a Código',
    description: 'Convierte comandos cURL en código para varios lenguajes',
    placeholder: 'Pega tu comando cURL...',
    meta: {
      title: 'cURL a Código - Herramienta Online Gratuita | ToolsLab',
      description:
        'Convierte cURL en código en línea. Genera snippets desde comandos curl. Convertidor cURL gratuito.',
    },
  },
  'favicon-generator': {
    title: 'Generador Favicon',
    description: 'Genera favicons para sitios web en diferentes formatos',
    placeholder: 'Sube una imagen...',
    meta: {
      title: 'Generador Favicon - Herramienta Online Gratuita | ToolsLab',
      description:
        'Crea favicons en línea. Genera favicons en múltiples formatos. Generador favicon gratuito.',
    },
  },
  'gradient-generator': {
    title: 'Generador de Degradados',
    description: 'Genera degradados CSS personalizados',
    placeholder: 'Elige los colores...',
    meta: {
      title:
        'Generador de Degradados CSS - Herramienta Online Gratuita | ToolsLab',
      description:
        'Crea degradados CSS en línea. Genera código de degradado personalizado. Generador de degradado gratuito.',
    },
  },
  'image-optimizer': {
    title: 'Optimizador de Imágenes',
    description: 'Optimiza y comprime imágenes',
    placeholder: 'Sube una imagen...',
    meta: {
      title: 'Optimizador de Imágenes - Herramienta Online Gratuita | ToolsLab',
      description:
        'Optimiza imágenes en línea. Comprime archivos de imagen. Optimizador de imágenes gratuito.',
    },
  },
  'json-validator': {
    title: 'Validador JSON',
    description: 'Valida sintaxis y estructura JSON',
    placeholder: 'Pega tu JSON...',
    meta: {
      title: 'Validador JSON - Herramienta Online Gratuita | ToolsLab',
      description:
        'Valida JSON en línea. Verifica sintaxis y estructura JSON. Validador JSON gratuito.',
    },
  },
  'list-compare': {
    title: 'Comparador de Listas',
    description:
      'Compara dos listas para encontrar diferencias, intersecciones y uniones',
    placeholder: 'Pega la primera lista...',
    meta: {
      title: 'Comparador de Listas - Herramienta Online Gratuita | ToolsLab',
      description:
        'Compara listas en línea. Encuentra diferencias, intersecciones y uniones. Herramienta de comparación de listas gratuita.',
    },
  },
  'markdown-preview': {
    title: 'Vista Previa Markdown',
    description:
      'Visualiza vista previa en vivo de markdown con resaltado de sintaxis',
    placeholder: 'Pega tu Markdown...',
    meta: {
      title: 'Vista Previa Markdown - Herramienta Online Gratuita | ToolsLab',
      description:
        'Vista previa markdown en tiempo real en línea. Editor markdown con vista previa en vivo. Herramienta markdown gratuita.',
    },
  },
  'base64-to-pdf': {
    title: 'Base64 a PDF',
    description: 'Convierte cadenas Base64 en archivos PDF',
    placeholder: 'Pega la cadena Base64...',
    meta: {
      title: 'Base64 a PDF - Herramienta Online Gratuita | ToolsLab',
      description:
        'Convierte Base64 a PDF en línea. Decodifica Base64 y guarda como PDF. Convertidor gratuito.',
    },
  },
  'color-picker': {
    title: 'Selector de Color',
    description: 'Elige y convierte colores entre formatos HEX, RGB, HSL',
    placeholder: 'Elige un color...',
    meta: {
      title: 'Selector de Color - Herramienta Online Gratuita | ToolsLab',
      description:
        'Selecciona colores en línea. Convierte entre HEX, RGB, HSL. Selector de color gratuito.',
    },
  },
  'json-to-typescript': {
    title: 'JSON a TypeScript',
    description: 'Convierte JSON en interfaces TypeScript',
    placeholder: 'Pega tu JSON...',
    meta: {
      title: 'JSON a TypeScript - Herramienta Online Gratuita | ToolsLab',
      description:
        'Genera interfaces TypeScript desde JSON en línea. Convertidor JSON to TypeScript gratuito.',
    },
  },
  'xml-formatter': {
    title: 'Formateador XML',
    description:
      'Formatea, valida y minifica documentos XML con resaltado de sintaxis y soporte XPath',
    placeholder: 'Pega tu XML...',
    meta: {
      title: 'Formateador XML - Herramienta Online Gratuita | ToolsLab',
      description:
        'Formatea y valida XML en línea. Minifica documentos XML con soporte XPath. Formateador XML gratuito.',
    },
  },
};

// Applica traduzioni FR
const frData = require('../lib/i18n/dictionaries/fr/tools.json');
let frUpdated = 0;

Object.entries(FR_TRANSLATIONS).forEach(([toolId, translation]) => {
  if (frData.tools[toolId]) {
    Object.assign(frData.tools[toolId], translation);
    console.log(`✓ FR: ${toolId} tradotto`);
    frUpdated++;
  }
});

fs.writeFileSync(
  './lib/i18n/dictionaries/fr/tools.json',
  JSON.stringify(frData, null, 2)
);

// Applica traduzioni ES
const esData = require('../lib/i18n/dictionaries/es/tools.json');
let esUpdated = 0;

Object.entries(ES_TRANSLATIONS).forEach(([toolId, translation]) => {
  if (esData.tools[toolId]) {
    Object.assign(esData.tools[toolId], translation);
    console.log(`✓ ES: ${toolId} tradotto`);
    esUpdated++;
  }
});

fs.writeFileSync(
  './lib/i18n/dictionaries/es/tools.json',
  JSON.stringify(esData, null, 2)
);

console.log(`\n✅ FR: ${frUpdated} tool tradotti`);
console.log(`✅ ES: ${esUpdated} tool tradotti`);
console.log('\n🎯 Traduzioni completate!');
