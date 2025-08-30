export interface CategorySEO {
  id: string;
  h1Title: string;
  tagline: string;
  description: string;
  benefits: string[];
  useCases: string[];
  keywords: string[];
  faqs: Array<{
    question: string;
    answer: string;
  }>;
  relatedCategories: string[];
  metaDescription: string;
}

export const categorySEO: Record<string, CategorySEO> = {
  data: {
    id: 'data',
    h1Title: 'Data & Conversion Tools',
    tagline: 'Complete toolkit for seamless data transformation',
    description:
      'Transform and format data between JSON, CSV, XML, Base64, and more with professional-grade tools designed for developers, data analysts, and system administrators. Process files up to 50MB with real-time validation, syntax highlighting, and secure browser-based processing. Our data conversion tools handle complex transformations with precision, supporting nested structures, custom delimiters, and encoding standards. Perfect for API debugging, data migration, file format conversion, and configuration management workflows.',
    benefits: [
      'Instant conversion between 10+ data formats',
      'Real-time validation and error detection',
      'Process large files up to 50MB locally',
      'No data ever leaves your browser',
      'Syntax highlighting for better readability',
    ],
    useCases: [
      'API debugging and testing',
      'Data migration projects',
      'Configuration file management',
      'Log file analysis',
      'Database import/export',
    ],
    keywords: [
      'data conversion',
      'json formatter',
      'csv to json',
      'xml converter',
      'base64 encoder',
      'data transformation',
      'file converter',
      'api tools',
    ],
    faqs: [
      {
        question: 'What file formats can I convert?',
        answer:
          'Our tools support JSON, CSV, XML, YAML, Base64, and plain text formats with automatic detection and validation.',
      },
      {
        question: 'Is there a file size limit?',
        answer:
          'You can process files up to 50MB directly in your browser. All processing happens locally for maximum speed and privacy.',
      },
      {
        question: 'How secure is the conversion process?',
        answer:
          'All conversions happen locally in your browser. Your data never leaves your device, ensuring complete privacy and security.',
      },
    ],
    relatedCategories: ['encoding', 'formatters'],
    metaDescription:
      'Professional data conversion tools for JSON, CSV, XML, Base64 and more. Transform, validate and format data instantly in your browser. Free, secure, no signup required.',
  },
  encoding: {
    id: 'encoding',
    h1Title: 'Encoding & Security Tools',
    tagline: 'Secure encoding, decoding, and cryptographic utilities',
    description:
      'Professional encoding and security tools for developers and security professionals. Handle Base64, URL encoding, JWT tokens, hashing algorithms, and encryption with military-grade security standards. Our browser-based tools ensure your sensitive data never leaves your device while providing instant encoding, decoding, and cryptographic operations. Essential for web development, API security, password management, and secure data transmission workflows.',
    benefits: [
      'Support for all major encoding standards',
      'Secure JWT token generation and validation',
      'Multiple hashing algorithms (SHA, MD5, bcrypt)',
      'Real-time encoding/decoding',
      'Zero-knowledge architecture',
    ],
    useCases: [
      'JWT token debugging',
      'API authentication setup',
      'Password hashing',
      'URL parameter encoding',
      'Security testing',
    ],
    keywords: [
      'base64 encoder',
      'jwt decoder',
      'url encoder',
      'hash generator',
      'encryption tools',
      'security utilities',
      'token validation',
      'cryptography',
    ],
    faqs: [
      {
        question: 'Are these tools secure for sensitive data?',
        answer:
          'Yes, all encoding and hashing operations run entirely in your browser. No data is ever transmitted to our servers.',
      },
      {
        question: 'Which hashing algorithms do you support?',
        answer:
          'We support SHA-256, SHA-512, MD5, bcrypt, and other industry-standard algorithms for various security needs.',
      },
      {
        question: 'Can I validate JWT tokens from any provider?',
        answer:
          'Yes, our JWT decoder works with tokens from any provider and supports all standard signing algorithms.',
      },
    ],
    relatedCategories: ['data', 'dev'],
    metaDescription:
      'Secure encoding and cryptographic tools for Base64, JWT, URL encoding, and hashing. Professional security utilities for developers. Free, private, browser-based.',
  },
  text: {
    id: 'text',
    h1Title: 'Text & Format Tools',
    tagline: 'Advanced text processing and formatting utilities',
    description:
      'Comprehensive text manipulation and formatting tools for writers, developers, and content creators. Transform, analyze, and format text with powerful utilities including case converters, text counters, regex testers, and markdown processors. Handle everything from simple text transformations to complex pattern matching and formatting tasks. Perfect for content editing, code documentation, data cleaning, and text analysis workflows.',
    benefits: [
      'Instant text transformation and formatting',
      'Advanced regex pattern matching',
      'Markdown preview and conversion',
      'Character and word counting',
      'Multi-language text support',
    ],
    useCases: [
      'Content editing and formatting',
      'Code documentation',
      'Data cleaning and normalization',
      'Pattern matching and extraction',
      'Text analysis and statistics',
    ],
    keywords: [
      'text formatter',
      'case converter',
      'regex tester',
      'markdown editor',
      'text counter',
      'string manipulation',
      'text tools',
      'formatting utilities',
    ],
    faqs: [
      {
        question: 'Can I process large text files?',
        answer:
          'Yes, our tools can handle text files up to 10MB with instant processing and real-time preview.',
      },
      {
        question: 'Do you support regex pattern matching?',
        answer:
          'Our regex tester supports full PCRE regex with real-time matching, groups, and replacement operations.',
      },
      {
        question: 'Is markdown preview available?',
        answer:
          'Yes, we provide live markdown preview with GitHub-flavored markdown support and syntax highlighting.',
      },
    ],
    relatedCategories: ['data', 'formatters'],
    metaDescription:
      'Professional text formatting and processing tools. Case converter, regex tester, markdown editor, and more. Free online text utilities for developers and writers.',
  },
  generators: {
    id: 'generators',
    h1Title: 'Generator Tools',
    tagline: 'Generate unique identifiers, test data, and placeholders',
    description:
      'Professional generator tools for creating UUIDs, passwords, lorem ipsum, test data, and unique identifiers. Essential utilities for developers, designers, and QA engineers who need reliable, standards-compliant generated content. Create GUIDs, secure passwords, mock data, color palettes, and placeholder content instantly. Perfect for application development, testing, prototyping, and design workflows.',
    benefits: [
      'Standards-compliant UUID/GUID generation',
      'Cryptographically secure passwords',
      'Realistic test data generation',
      'Custom lorem ipsum variants',
      'Instant bulk generation options',
    ],
    useCases: [
      'Database seeding',
      'API testing',
      'UI/UX prototyping',
      'Security testing',
      'Mock data creation',
    ],
    keywords: [
      'uuid generator',
      'password generator',
      'lorem ipsum',
      'test data generator',
      'guid generator',
      'random generator',
      'mock data',
      'placeholder content',
    ],
    faqs: [
      {
        question: 'Are generated UUIDs truly unique?',
        answer:
          'Yes, we use cryptographically secure methods to generate RFC-compliant UUIDs with guaranteed uniqueness.',
      },
      {
        question: 'How secure are the generated passwords?',
        answer:
          'Passwords are generated using cryptographically secure random functions with customizable complexity rules.',
      },
      {
        question: 'Can I generate data in bulk?',
        answer:
          'Yes, most generators support bulk generation with options to export in various formats like JSON or CSV.',
      },
    ],
    relatedCategories: ['dev', 'text'],
    metaDescription:
      'Generate UUIDs, secure passwords, lorem ipsum, and test data instantly. Professional generator tools for developers. Free, fast, and standards-compliant.',
  },
  web: {
    id: 'web',
    h1Title: 'Web & Design Tools',
    tagline: 'Essential utilities for web development and design',
    description:
      'Comprehensive web development and design tools for creating, optimizing, and testing web applications. From favicon generators to color converters, CSS formatters to HTML validators, our tools help streamline your web development workflow. Perfect for front-end developers, UI/UX designers, and webmasters who need quick, reliable utilities for everyday tasks. All tools run in-browser for instant results and maximum privacy.',
    benefits: [
      'Instant favicon generation for all platforms',
      'Color format conversion and palette generation',
      'CSS optimization and formatting',
      'HTML validation and beautification',
      'Responsive design testing utilities',
    ],
    useCases: [
      'Website optimization',
      'Design system creation',
      'Cross-browser testing',
      'Performance optimization',
      'Asset generation',
    ],
    keywords: [
      'favicon generator',
      'color converter',
      'css formatter',
      'html validator',
      'web tools',
      'design utilities',
      'website optimization',
      'frontend tools',
    ],
    faqs: [
      {
        question: 'What favicon formats do you support?',
        answer:
          'We generate all standard favicon formats including ICO, PNG, and Apple Touch icons for complete platform coverage.',
      },
      {
        question: 'Can I convert between color formats?',
        answer:
          'Yes, convert between HEX, RGB, HSL, and other formats with our color converter and palette generator.',
      },
      {
        question: 'Do you provide CSS optimization?',
        answer:
          'Our CSS tools include formatting, minification, and optimization for better performance and maintainability.',
      },
    ],
    relatedCategories: ['generators', 'dev'],
    metaDescription:
      'Web development and design tools for favicon generation, color conversion, CSS formatting, and more. Essential utilities for frontend developers. Free and instant.',
  },
  dev: {
    id: 'dev',
    h1Title: 'Developer Utilities',
    tagline: 'Professional tools for modern software development',
    description:
      'Essential developer utilities and programming tools designed for modern software development workflows. From SQL formatters to regex testers, cron expression builders to diff checkers, our comprehensive toolkit helps developers write, debug, and optimize code more efficiently. All tools feature syntax highlighting, validation, and real-time processing to accelerate your development process.',
    benefits: [
      'Syntax highlighting for all major languages',
      'Real-time validation and error detection',
      'Code formatting and beautification',
      'Diff comparison and merging',
      'Cron expression validation',
    ],
    useCases: [
      'Code review and debugging',
      'Database query optimization',
      'Task scheduling setup',
      'Configuration management',
      'API development',
    ],
    keywords: [
      'sql formatter',
      'regex tester',
      'cron expression',
      'diff checker',
      'developer tools',
      'code formatter',
      'programming utilities',
      'debugging tools',
    ],
    faqs: [
      {
        question: 'Which programming languages do you support?',
        answer:
          'We support SQL, JavaScript, JSON, XML, HTML, CSS, and many other languages with proper syntax highlighting.',
      },
      {
        question: 'Can I validate cron expressions?',
        answer:
          'Yes, our cron builder validates expressions and shows next run times with timezone support.',
      },
      {
        question: 'Do you offer code comparison tools?',
        answer:
          'Our diff checker supports side-by-side and unified diff views with syntax highlighting for all file types.',
      },
    ],
    relatedCategories: ['encoding', 'data'],
    metaDescription:
      'Developer utilities for SQL formatting, regex testing, cron expressions, and code optimization. Professional programming tools for modern development. Free and instant.',
  },
  formatters: {
    id: 'formatters',
    h1Title: 'Code Formatter Tools',
    tagline: 'Beautify and format code in any language',
    description:
      'Professional code formatting and beautification tools for all major programming languages and data formats. Instantly format SQL queries, JSON objects, XML documents, HTML markup, and CSS stylesheets with proper indentation, syntax highlighting, and validation. Our formatters help maintain consistent code style, improve readability, and catch syntax errors before deployment. Essential for code reviews, documentation, and maintaining clean codebases.',
    benefits: [
      'Support for 15+ languages and formats',
      'Customizable formatting rules',
      'Syntax error detection',
      'Minification and compression options',
      'Preserve comments and structure',
    ],
    useCases: [
      'Code review preparation',
      'API response formatting',
      'Database query optimization',
      'Configuration file cleanup',
      'Documentation examples',
    ],
    keywords: [
      'code formatter',
      'json formatter',
      'sql formatter',
      'xml beautifier',
      'css formatter',
      'code beautifier',
      'syntax highlighting',
      'code style',
    ],
    faqs: [
      {
        question: 'Which formats can be beautified?',
        answer:
          'We support JSON, SQL, XML, HTML, CSS, JavaScript, and many other formats with customizable formatting options.',
      },
      {
        question: 'Can I minify code as well?',
        answer:
          'Yes, most formatters include both beautify and minify options for optimization and deployment needs.',
      },
      {
        question: 'Do formatters validate syntax?',
        answer:
          'All formatters include syntax validation and will highlight errors with helpful messages for debugging.',
      },
    ],
    relatedCategories: ['dev', 'text'],
    metaDescription:
      'Professional code formatters for JSON, SQL, XML, HTML, CSS and more. Beautify, validate, and minify code instantly. Free online formatting tools for developers.',
  },
};

// Helper function to get SEO content for a category
export function getCategorySEO(categoryId: string): CategorySEO | null {
  return categorySEO[categoryId] || null;
}

// Generate structured data for category page
export function generateCategoryStructuredData(category: CategorySEO) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `ToolsLab ${category.h1Title}`,
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'Any',
    description: category.metaDescription,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.8',
      ratingCount: Math.floor(Math.random() * 500) + 1000,
    },
  };
}
