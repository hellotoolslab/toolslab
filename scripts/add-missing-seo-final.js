const fs = require('fs');
const path = require('path');

const SEO_DATA = {
  'api-tester': {
    en: {
      title: 'API Tester',
      description:
        'Test API endpoints with support for various HTTP methods and headers',
      tagline: 'Test REST APIs with custom headers and request builder',
      pageDescription:
        'Professional API testing tool for developers. Send HTTP requests with custom headers, methods, and body data. Test RESTful endpoints, debug API responses, and validate authentication flows. Supports GET, POST, PUT, DELETE, PATCH methods with real-time response viewing.',
    },
    it: {
      title: 'Tester API',
      description:
        'Testa endpoint API con supporto per vari metodi HTTP e headers',
      tagline: 'Testa API REST con headers personalizzati e request builder',
      pageDescription:
        'Strumento professionale per test API per sviluppatori. Invia richieste HTTP con headers, metodi e dati body personalizzati. Testa endpoint RESTful, debug risposte API e valida flussi autenticazione. Supporta metodi GET, POST, PUT, DELETE, PATCH con visualizzazione risposte in tempo reale.',
    },
    fr: {
      title: 'Testeur API',
      description:
        'Testez les endpoints API avec support pour différentes méthodes HTTP et en-têtes',
      tagline:
        'Testez les API REST avec en-têtes personnalisés et constructeur de requêtes',
      pageDescription:
        "Outil professionnel de test API pour développeurs. Envoyez des requêtes HTTP avec en-têtes, méthodes et données body personnalisés. Testez les endpoints RESTful, déboguez les réponses API et validez les flux d'authentification. Supporte les méthodes GET, POST, PUT, DELETE, PATCH avec visualisation des réponses en temps réel.",
    },
    es: {
      title: 'Probador API',
      description:
        'Prueba endpoints API con soporte para varios métodos HTTP y encabezados',
      tagline:
        'Prueba API REST con encabezados personalizados y constructor de solicitudes',
      pageDescription:
        'Herramienta profesional de prueba API para desarrolladores. Envía solicitudes HTTP con encabezados, métodos y datos body personalizados. Prueba endpoints RESTful, depura respuestas API y valida flujos de autenticación. Soporta métodos GET, POST, PUT, DELETE, PATCH con visualización de respuestas en tiempo real.',
    },
  },
  'image-optimizer': {
    en: {
      title: 'Image Optimizer',
      description: 'Optimize and compress images',
      tagline: 'Compress images with smart optimization for web and mobile',
      pageDescription:
        'Professional image optimization tool that reduces file size by up to 80% while maintaining visual quality. Supports JPG, PNG, WebP, and AVIF formats with adjustable compression levels. Perfect for web developers optimizing page speed and mobile app developers reducing bundle size. Batch process multiple images with real-time preview.',
    },
    it: {
      title: 'Ottimizzatore Immagini',
      description: 'Ottimizza e comprimi immagini',
      tagline:
        'Comprimi immagini con ottimizzazione intelligente per web e mobile',
      pageDescription:
        "Strumento professionale ottimizzazione immagini che riduce dimensione file fino all'80% mantenendo qualità visiva. Supporta formati JPG, PNG, WebP e AVIF con livelli compressione regolabili. Perfetto per sviluppatori web che ottimizzano velocità pagina e sviluppatori app mobile che riducono dimensione bundle. Elabora batch multiple immagini con anteprima in tempo reale.",
    },
    fr: {
      title: "Optimiseur d'Images",
      description: 'Optimisez et compressez les images',
      tagline:
        'Compressez les images avec optimisation intelligente pour web et mobile',
      pageDescription:
        "Outil professionnel d'optimisation d'images qui réduit la taille des fichiers jusqu'à 80% tout en maintenant la qualité visuelle. Supporte les formats JPG, PNG, WebP et AVIF avec niveaux de compression ajustables. Parfait pour les développeurs web optimisant la vitesse des pages et les développeurs d'applications mobiles réduisant la taille des bundles. Traitement par lots de plusieurs images avec aperçu en temps réel.",
    },
    es: {
      title: 'Optimizador de Imágenes',
      description: 'Optimiza y comprime imágenes',
      tagline:
        'Comprime imágenes con optimización inteligente para web y móvil',
      pageDescription:
        'Herramienta profesional de optimización de imágenes que reduce el tamaño del archivo hasta un 80% manteniendo la calidad visual. Soporta formatos JPG, PNG, WebP y AVIF con niveles de compresión ajustables. Perfecto para desarrolladores web optimizando velocidad de página y desarrolladores de aplicaciones móviles reduciendo tamaño de bundle. Procesa lotes de múltiples imágenes con vista previa en tiempo real.',
    },
  },
  'markdown-preview': {
    en: {
      title: 'Markdown Preview',
      description: 'Live preview markdown with syntax highlighting',
      tagline: 'Preview markdown in real-time with GitHub-flavored rendering',
      pageDescription:
        'Professional markdown editor with live preview and GitHub-flavored markdown support. Features syntax highlighting, table support, task lists, and emoji rendering. Perfect for developers writing documentation, README files, and technical content. Export to HTML with customizable themes.',
    },
    it: {
      title: 'Anteprima Markdown',
      description:
        'Visualizza anteprima live markdown con evidenziazione sintassi',
      tagline:
        'Anteprima markdown in tempo reale con rendering GitHub-flavored',
      pageDescription:
        'Editor markdown professionale con anteprima live e supporto GitHub-flavored markdown. Funzionalità evidenziazione sintassi, supporto tabelle, task list e rendering emoji. Perfetto per sviluppatori che scrivono documentazione, file README e contenuti tecnici. Export HTML con temi personalizzabili.',
    },
    fr: {
      title: 'Aperçu Markdown',
      description:
        "Visualisez l'aperçu en direct de markdown avec coloration syntaxique",
      tagline: 'Aperçu markdown en temps réel avec rendu GitHub-flavored',
      pageDescription:
        'Éditeur markdown professionnel avec aperçu en direct et support GitHub-flavored markdown. Fonctionnalités coloration syntaxique, support tableaux, listes de tâches et rendu emoji. Parfait pour développeurs écrivant documentation, fichiers README et contenu technique. Export HTML avec thèmes personnalisables.',
    },
    es: {
      title: 'Vista Previa Markdown',
      description:
        'Visualiza vista previa en vivo de markdown con resaltado de sintaxis',
      tagline:
        'Vista previa markdown en tiempo real con renderizado GitHub-flavored',
      pageDescription:
        'Editor markdown profesional con vista previa en vivo y soporte GitHub-flavored markdown. Características resaltado de sintaxis, soporte tablas, listas de tareas y renderizado emoji. Perfecto para desarrolladores escribiendo documentación, archivos README y contenido técnico. Export HTML con temas personalizables.',
    },
  },
};

const languages = ['en', 'it', 'fr', 'es'];

languages.forEach((lang) => {
  const toolsDir = `./lib/i18n/dictionaries/${lang}/tools`;
  let updated = 0;

  console.log(`\n📦 ${lang.toUpperCase()}: Adding final SEO data`);

  Object.entries(SEO_DATA).forEach(([toolId, langData]) => {
    const filePath = path.join(toolsDir, `${toolId}.json`);

    if (fs.existsSync(filePath)) {
      const toolData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      const seoData = langData[lang];

      // Update all fields
      Object.assign(toolData, {
        title: seoData.title,
        description: seoData.description,
        tagline: seoData.tagline,
        pageDescription: seoData.pageDescription,
      });

      fs.writeFileSync(filePath, JSON.stringify(toolData, null, 2));
      console.log(`  ✓ ${toolId}`);
      updated++;
    }
  });

  console.log(`✅ ${lang.toUpperCase()}: ${updated} tools updated`);
});

console.log('\n🎉 All tools now have complete SEO data!');
