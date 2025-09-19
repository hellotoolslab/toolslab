export interface ToolSEO {
  id: string;
  tagline: string; // 8-12 words, catchy and memorable
  seoDescription: string; // 30-70 words, includes primary keyword, benefit, soft CTA
}

export const toolSEO: Record<string, ToolSEO> = {
  'json-validator': {
    id: 'json-validator',
    tagline: 'Validate JSON with advanced schema support and error detection',
    seoDescription:
      'Professional JSON validator with JSON Schema support, real-time error reporting, and security auditing. Validate API responses, configuration files, and data structures with Draft 7/2019-09/2020-12 schema support. Features syntax highlighting, detailed error diagnostics, performance metrics, and security vulnerability detection. Perfect for developers and API testing.',
  },

  'text-diff': {
    id: 'text-diff',
    tagline: 'Compare files and code with professional diff visualization',
    seoDescription:
      'Professional text comparison tool with syntax highlighting, patch generation, and side-by-side diff views. Compare code files, documents, and text with line-by-line differences, change tracking, and unified diff output. Features Git-style patches, whitespace options, and export to HTML/PDF. Perfect for developers reviewing code changes.',
  },

  'gradient-generator': {
    id: 'gradient-generator',
    tagline: 'Create stunning CSS gradients with visual editor and presets',
    seoDescription:
      'Professional CSS gradient generator with linear, radial, and conic gradients. Create beautiful backgrounds with visual color stop editor, preset collections, and real-time preview. Export to CSS, Tailwind classes, and SVG. Features drag-and-drop interface, color harmony generator, and browser compatibility. Perfect for web designers and developers creating modern UI backgrounds.',
  },

  'json-formatter': {
    id: 'json-formatter',
    tagline: 'Format, validate and beautify JSON instantly online',
    seoDescription:
      'Format and validate JSON data with our free online JSON formatter. Debug malformed JSON, beautify minified code, and validate syntax with real-time error detection. Perfect for developers working with APIs, config files, and data processing. Search keys, customize indentation, and process large files securely in your browser.',
  },

  'base64-encode': {
    id: 'base64-encode',
    tagline: 'Encode and decode Base64 files and text instantly',
    seoDescription:
      'Free Base64 encoder and decoder for text, images, and files up to 50MB. Perfect for web developers embedding images in HTML/CSS, API data transmission, and email attachments. Drag-and-drop interface with secure browser-based processing. Download decoded files directly or copy encoded strings to clipboard.',
  },

  'base64-to-pdf': {
    id: 'base64-to-pdf',
    tagline: 'Convert Base64 data to PDF files instantly',
    seoDescription:
      'Convert Base64 encoded data to PDF files with instant download. Perfect for developers working with document APIs, email attachments, and data processing workflows. Secure browser-based conversion with no server uploads. Validate Base64 input, preview PDF metadata, and download converted files directly to your device.',
  },

  'hash-generator': {
    id: 'hash-generator',
    tagline: 'Generate secure MD5, SHA256 and SHA512 hashes',
    seoDescription:
      'Generate cryptographic hash values using MD5, SHA-1, SHA-256, and SHA-512 algorithms. Perfect for password hashing, file integrity verification, and security auditing. Real-time hash generation with one-click copying. All processing happens locally in your browser for maximum security and privacy.',
  },

  'uuid-generator': {
    id: 'uuid-generator',
    tagline: 'Generate unique UUIDs and GUIDs instantly online',
    seoDescription:
      'Generate UUID v1 and v4 identifiers for databases, APIs, and applications. Create single UUIDs or bulk generate up to 1000 with customizable formatting. Perfect for developers building distributed systems, database schemas, and unique identification systems. Free, secure, and browser-based generation.',
  },

  'password-generator': {
    id: 'password-generator',
    tagline: 'Create ultra-secure passwords with custom options instantly',
    seoDescription:
      'Generate strong, secure passwords with customizable length (4-128 characters) and character sets. Configure uppercase, lowercase, numbers, and symbols with options to exclude ambiguous characters. Perfect for creating account passwords, API keys, and secure authentication tokens. Real-time strength indicator included.',
  },

  'regex-tester': {
    id: 'regex-tester',
    tagline: 'Test and debug regular expressions with live matching',
    seoDescription:
      'Test regular expressions with real-time matching and highlighting. Debug regex patterns with live feedback, capture group details, and match positions. Perfect for developers validating email addresses, parsing data, and building text processing applications. Supports global, case-insensitive, and multiline flags.',
  },

  'favicon-generator': {
    id: 'favicon-generator',
    tagline: 'Generate complete favicon packages for all devices',
    seoDescription:
      'Create professional favicons for websites and web apps from any image. Generate all required sizes (16x16 to 512x512) in ICO, PNG, and SVG formats. Includes Apple Touch Icons, Android Chrome icons, and complete HTML implementation code. Perfect for web developers and designers building professional websites.',
  },

  'csv-to-json': {
    id: 'csv-to-json',
    tagline: 'Convert CSV data to JSON format with smart parsing',
    seoDescription:
      'Transform CSV files and data into JSON format with automatic header detection and custom delimiter support. Perfect for data migration, API integration, and spreadsheet processing. Handles large files with streaming, preserves data types, and offers multiple output formats. Free, secure browser-based conversion with no file uploads.',
  },

  'crontab-builder': {
    id: 'crontab-builder',
    tagline: 'Build and parse cron expressions with visual interface',
    seoDescription:
      'Create and validate cron expressions using our visual builder with dropdown menus and common presets. Parse existing crontab entries with human-readable descriptions and next execution times. Perfect for system administrators, DevOps engineers, and developers scheduling automated tasks and deployments.',
  },

  'xml-formatter': {
    id: 'xml-formatter',
    tagline:
      'Format, validate and minify XML with XPath search and namespace support',
    seoDescription:
      'Professional XML formatter with syntax validation, beautification, and minification. Features XPath search, namespace analysis, and structure visualization. Perfect for SOAP, RSS, SVG, and configuration files. Handles large XML documents efficiently with real-time validation and error highlighting. Free, secure browser-based XML processing.',
  },

  'jwt-decoder': {
    id: 'jwt-decoder',
    tagline: 'Decode and analyze JWT tokens with security validation instantly',
    seoDescription:
      'Professional JWT decoder with claims analysis, security validation, and expiration checking. Decode JSON Web Tokens safely with detailed header, payload, and signature information. Perfect for debugging authentication issues, analyzing token claims, and validating JWT security. Supports all JWT algorithms with real-time security recommendations and time-based claim analysis.',
  },

  'url-encode': {
    id: 'url-encode',
    tagline: 'Encode and decode URLs and query parameters safely',
    seoDescription:
      'URL encode and decode components and query parameters for web development. Handle special characters, spaces, and international text in URLs safely. Perfect for API developers, web forms, and HTTP request handling. Supports percent-encoding standards with real-time conversion and validation.',
  },

  'timestamp-converter': {
    id: 'timestamp-converter',
    tagline: 'Convert Unix timestamps to human-readable dates instantly',
    seoDescription:
      'Convert Unix timestamps to readable dates and vice versa with timezone support. Perfect for developers working with databases, APIs, and log files. Handle epoch time, milliseconds, and various date formats with real-time conversion. Essential tool for system integration and data processing.',
  },

  'sql-formatter': {
    id: 'sql-formatter',
    tagline: 'Format and beautify SQL queries with syntax highlighting',
    seoDescription:
      'Format and beautify SQL queries with proper indentation, keyword highlighting, and syntax validation. Perfect for database developers, data analysts, and SQL optimization. Supports multiple SQL dialects (MySQL, PostgreSQL, SQLite) with customizable formatting options. Free, secure browser-based SQL formatter with no data uploads.',
  },

  'qr-generator': {
    id: 'qr-generator',
    tagline:
      'Generate advanced QR codes with logos, batch processing and developer tools',
    seoDescription:
      'Professional QR code generator with logo embedding, WiFi/vCard creation, and batch processing. Features SVG export, API integration, error correction levels, and size optimization. Perfect for developers building authentication systems, contact sharing, and marketing campaigns. Supports URL, email, SMS, geo-location, and crypto addresses with real-time validation.',
  },

  'color-picker': {
    id: 'color-picker',
    tagline: 'Pick colors with contrast checker and palette generator',
    seoDescription:
      'Professional color picker for developers and designers with HEX, RGB, HSL, HSV, CMYK, and LAB formats. Generate color palettes, check WCAG contrast ratios, simulate color blindness, and export to CSS, Tailwind, Material Design. Features eyedropper API, gradient generator, and design system integration. Free browser-based tool with accessibility compliance checking.',
  },

  'json-to-csv': {
    id: 'json-to-csv',
    tagline: 'Convert JSON to CSV with advanced formatting and column mapping',
    seoDescription:
      'Free JSON to CSV converter with advanced flattening, column mapping, and formatting options. Transform JSON arrays, nested objects, and complex data structures into Excel-compatible CSV files. Features drag-and-drop column ordering, custom delimiters, header configuration, and real-time preview. Perfect for data export, API response conversion, and spreadsheet integration. Secure browser-based processing with no file uploads.',
  },

  'list-compare': {
    id: 'list-compare',
    tagline: 'Compare multiple lists with advanced diff and set operations',
    seoDescription:
      'Professional list comparison tool with set operations (union, intersection, difference), fuzzy matching, and developer-friendly output formats. Compare up to 10 lists simultaneously with smart algorithms for package dependencies, git files, API endpoints, and data analysis. Features Venn diagrams, regex matching, duplicate detection, and export to JSON, CSV, SQL. Perfect for developers, data analysts, and system administrators managing lists, arrays, and datasets.',
  },

  'curl-to-code': {
    id: 'curl-to-code',
    tagline: 'Convert cURL commands to production-ready code in any language',
    seoDescription:
      'Free cURL to code converter transforms cURL commands into production-ready code for JavaScript, Python, Go, Java, PHP, Ruby, and 15+ languages. Features automatic error handling, type inference, async/await support, and best practices integration. Perfect for API developers converting documentation examples, debugging network requests, and building SDK clients. Supports all cURL flags, authentication methods, multipart uploads, and generates unit tests. Secure browser-based conversion with no data uploads.',
  },

  'json-to-typescript': {
    id: 'json-to-typescript',
    tagline:
      'Generate TypeScript interfaces from JSON with intelligent type inference',
    seoDescription:
      'Advanced JSON to TypeScript converter with smart type inference, optional properties, and nested interface support. Convert API responses, configuration objects, and complex JSON structures to production-ready TypeScript interfaces. Features union types, enum detection, date parsing, custom naming conventions, and immutable options. Includes Zod schema generation, validation code, and mock data generators. Perfect for TypeScript developers building type-safe applications with external APIs.',
  },
};
