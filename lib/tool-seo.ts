export interface ToolSEO {
  id: string;
  tagline: string; // 8-12 words, catchy and memorable
  seoDescription: string; // 30-70 words, includes primary keyword, benefit, soft CTA
}

export const toolSEO: Record<string, ToolSEO> = {
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

  'crontab-builder': {
    id: 'crontab-builder',
    tagline: 'Build and parse cron expressions with visual interface',
    seoDescription:
      'Create and validate cron expressions using our visual builder with dropdown menus and common presets. Parse existing crontab entries with human-readable descriptions and next execution times. Perfect for system administrators, DevOps engineers, and developers scheduling automated tasks and deployments.',
  },

  'url-encode': {
    id: 'url-encode',
    tagline: 'Encode and decode URLs and query parameters safely',
    seoDescription:
      'URL encode and decode components and query parameters for web development. Handle special characters, spaces, and international text in URLs safely. Perfect for API developers, web forms, and HTTP request handling. Supports percent-encoding standards with real-time conversion and validation.',
  },

  'jwt-decoder': {
    id: 'jwt-decoder',
    tagline: 'Decode and inspect JSON Web Tokens securely',
    seoDescription:
      'Decode JWT tokens to inspect headers, payloads, and claims for authentication debugging. Validate token structure and expiration times without compromising security. Perfect for developers working with OAuth, API authentication, and security implementations. All processing happens locally in your browser.',
  },

  'timestamp-converter': {
    id: 'timestamp-converter',
    tagline: 'Convert Unix timestamps to human-readable dates instantly',
    seoDescription:
      'Convert Unix timestamps to readable dates and vice versa with timezone support. Perfect for developers working with databases, APIs, and log files. Handle epoch time, milliseconds, and various date formats with real-time conversion. Essential tool for system integration and data processing.',
  },
};
