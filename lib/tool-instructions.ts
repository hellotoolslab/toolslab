export interface ToolInstructionStep {
  title: string;
  description: string;
}

export interface ToolInstruction {
  id: string;
  title: string;
  steps: ToolInstructionStep[];
  features: string[];
  useCases: string[];
  proTips: string[];
  troubleshooting: string[];
  keyboardShortcuts?: { keys: string; description: string }[];
}

export const toolInstructions: Record<string, ToolInstruction> = {
  'json-validator': {
    id: 'json-validator',
    title: 'How to use JSON Validator',
    steps: [
      {
        title: 'Enter or upload JSON data',
        description:
          'Paste your JSON in the editor or drag and drop JSON files up to 50MB. The validator supports nested objects, arrays, and all JSON data types with real-time syntax highlighting.',
      },
      {
        title: 'Choose validation level',
        description:
          'Select from Basic (syntax only), Structural (object validation), Schema (JSON Schema compliance), or Security (vulnerability detection). Each level provides increasingly detailed analysis.',
      },
      {
        title: 'Add JSON Schema (optional)',
        description:
          'Provide a JSON Schema (Draft 7, 2019-09, or 2020-12) in the schema editor to validate data structure, required fields, data types, and constraints. Supports $ref, allOf, oneOf, and conditional schemas.',
      },
      {
        title: 'Review validation results',
        description:
          'Examine detailed error reports with line numbers, error types, and fix suggestions. View performance metrics, structural analysis, and security audit results in organized tabs.',
      },
      {
        title: 'Export and share results',
        description:
          'Download validation reports as JSON/HTML, copy error summaries to clipboard, or generate developer-friendly code snippets for API testing and documentation.',
      },
    ],
    features: [
      'Multi-level validation (Basic, Structural, Schema, Security)',
      'JSON Schema Draft 7, 2019-09, and 2020-12 support',
      'Real-time syntax highlighting with CodeMirror',
      'Detailed error reporting with line numbers and fix suggestions',
      'Performance metrics and validation timing',
      'Security vulnerability detection and audit',
      'Large file support up to 50MB with Web Workers',
      'Export validation results to JSON, HTML, and CSV formats',
    ],
    useCases: [
      'API response validation for REST and GraphQL endpoints',
      'Configuration file validation for applications',
      'Data structure verification for databases and imports',
      'JSON Schema compliance testing for API specifications',
      'Security auditing of JSON payloads for vulnerabilities',
      'Development testing and debugging JSON data',
      'Educational tool for learning JSON and schema validation',
      'Quality assurance for data migration and transformation',
    ],
    proTips: [
      'Use Web Workers for large files to maintain browser responsiveness',
      'Enable security validation to detect potential injection attacks',
      'Combine with API testing to validate endpoint responses',
      'Use schema $ref to modularize complex validation rules',
      'Export validation results for automated testing workflows',
      'Check performance metrics to optimize JSON structure',
    ],
    troubleshooting: [
      'Large files slow? Enable Web Workers in settings for better performance',
      'Schema validation fails? Verify schema format matches Draft 7/2019-09/2020-12',
      'Unicode characters display incorrectly? Check file encoding is UTF-8',
      'Memory issues with huge files? Use streaming validation mode',
      'False security warnings? Review security validation rules in documentation',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+Enter', description: 'Run validation' },
      { keys: 'Ctrl+Shift+F', description: 'Format/beautify JSON' },
      { keys: 'Ctrl+F', description: 'Search in JSON' },
      { keys: 'Ctrl+/', description: 'Toggle comments (JSON5 mode)' },
      { keys: 'F8', description: 'Go to next error' },
      { keys: 'Shift+F8', description: 'Go to previous error' },
    ],
  },

  'text-diff': {
    id: 'text-diff',
    title: 'How to use Text Diff Checker',
    steps: [
      {
        title: 'Enter or upload your texts',
        description:
          'Paste your text in the left and right editors, or drag and drop files directly into each pane. Supports text files, code files, and documents up to 10MB.',
      },
      {
        title: 'Choose comparison mode',
        description:
          'Select between side-by-side, inline, or unified diff views. Toggle options like ignore whitespace, case sensitivity, and syntax highlighting for code files.',
      },
      {
        title: 'Review highlighted differences',
        description:
          'Changes are color-coded: green for additions, red for deletions, yellow for modifications. Use keyboard shortcuts (F3/Shift+F3) to navigate between changes.',
      },
      {
        title: 'Export or share results',
        description:
          'Generate patch files for Git, export as HTML with highlighting preserved, or copy unified diff to clipboard. Share diff URLs with colleagues using the share button.',
      },
      {
        title: 'Apply advanced options',
        description:
          'Configure context lines for unified view, enable word-level or character-level diff, detect file types automatically, or use three-way merge for conflict resolution.',
      },
    ],
    features: [
      'Side-by-side, inline, and unified diff views',
      'Syntax highlighting for 20+ programming languages',
      'Git-style patch generation and application',
      'Line, word, and character-level diff granularity',
      'Whitespace and case sensitivity options',
      'Large file support with Web Worker processing',
      'File drag & drop with encoding detection',
      'Export to HTML, PDF, or patch formats',
      'Synchronized scrolling between panes',
      'Keyboard shortcuts for efficient navigation',
    ],
    useCases: [
      'Code review and pull request comparison',
      'Document version tracking and changes',
      'Git conflict resolution and merging',
      'Configuration file comparison',
      'Legal document redlining',
      'Translation and localization review',
      'Database schema evolution tracking',
      'Log file analysis and debugging',
    ],
    proTips: [
      'Use Ctrl+F to search within either pane, with results highlighted in both',
      'Enable "Show invisibles" to see tabs, spaces, and line endings',
      'Triple-click to select entire lines for quick copying',
      'Use the minimap for quick navigation in large files',
      'Hold Alt while scrolling to scroll only one pane',
      'Drag the divider between panes to adjust their width',
    ],
    troubleshooting: [
      'Binary files show hexdump comparison instead of text diff',
      'Large files (>10MB) may take longer to process - be patient',
      'If syntax highlighting is incorrect, manually select the file type',
      'Encoding issues? Try re-uploading with UTF-8 encoding',
      'For three-way merge, ensure all three versions are provided',
    ],
    keyboardShortcuts: [
      { keys: 'F3', description: 'Jump to next change' },
      { keys: 'Shift+F3', description: 'Jump to previous change' },
      { keys: 'Ctrl+F', description: 'Find in text' },
      { keys: 'Ctrl+G', description: 'Go to line number' },
      { keys: 'Ctrl+S', description: 'Download diff as file' },
      { keys: 'Ctrl+Shift+C', description: 'Copy diff to clipboard' },
      { keys: 'Alt+V', description: 'Toggle diff view mode' },
      { keys: 'Alt+W', description: 'Toggle whitespace visibility' },
    ],
  },

  'base64-to-pdf': {
    id: 'base64-to-pdf',
    title: 'How to use Base64 to PDF Converter',
    steps: [
      {
        title: 'Paste Base64 encoded data',
        description:
          'Copy and paste your Base64 encoded PDF data into the input text area. The data should start with standard Base64 characters (A-Z, a-z, 0-9, +, /).',
      },
      {
        title: 'Validate the Base64 data',
        description:
          'The tool automatically validates your Base64 input and checks if it represents valid PDF data by examining the PDF header signature.',
      },
      {
        title: 'Preview PDF information',
        description:
          'View the decoded file size and PDF metadata before downloading. This helps verify you have the correct PDF content.',
      },
      {
        title: 'Download the PDF file',
        description:
          'Click the "Download PDF" button to convert and save the PDF file to your device with the filename of your choice.',
      },
    ],
    features: [
      'Real-time Base64 validation and format checking',
      'PDF header signature verification for valid PDF files',
      'File size calculation and preview before download',
      'Automatic PDF metadata extraction when available',
      'Custom filename support for downloaded files',
      'Large Base64 data support (up to 50MB decoded)',
      'Secure client-side processing with no server uploads',
      'Error handling for corrupted or invalid data',
    ],
    useCases: [
      'Converting PDF attachments from email APIs',
      'Processing PDF documents from REST API responses',
      'Recovering PDF files from database BLOB storage',
      'Converting embedded PDF data in JSON payloads',
      'Testing PDF generation in web applications',
      'Extracting PDF files from Base64 encoded strings',
      'Document processing workflows and automation',
      'Debugging PDF encoding/decoding issues',
    ],
    proTips: [
      'Ensure your Base64 data starts with "JVBERi0" for valid PDF files',
      'Remove any data URL prefixes like "data:application/pdf;base64," before pasting',
      'Use this tool to verify PDF integrity after Base64 encoding/decoding',
      'Combine with Base64 encoder tool for complete PDF conversion workflows',
      'Check file size preview to ensure complete data was pasted',
      'For large PDFs, consider breaking into smaller chunks if browser crashes',
    ],
    troubleshooting: [
      'Invalid Base64 format: Ensure data contains only valid Base64 characters',
      'Not a PDF file: Verify the decoded data starts with PDF header (%PDF-)',
      'File too large: Browser memory limits may prevent very large file processing',
      'Download fails: Try using a different filename or check browser permissions',
      'Corrupted PDF: Source Base64 data may be incomplete or corrupted',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+V', description: 'Paste Base64 data into input field' },
      { keys: 'Ctrl+A', description: 'Select all text in input area' },
      { keys: 'Ctrl+C', description: 'Copy error messages or file info' },
    ],
  },

  'json-formatter': {
    id: 'json-formatter',
    title: 'How to use JSON Formatter',
    steps: [
      {
        title: 'Paste your JSON data',
        description:
          'Copy and paste your JSON string into the input area. You can paste minified, unformatted JSON from any source.',
      },
      {
        title: 'Choose formatting option',
        description:
          'Select "Format & Validate" to beautify your JSON with proper indentation, or "Minify" to compress it into a single line.',
      },
      {
        title: 'Set indentation preferences',
        description:
          'Choose between 2 or 4 spaces for indentation to match your coding standards or project requirements.',
      },
      {
        title: 'Review the formatted output',
        description:
          'The tool validates your JSON and displays any syntax errors with line numbers for easy debugging.',
      },
    ],
    features: [
      'Real-time JSON validation with detailed error messages',
      'Syntax highlighting for better readability',
      'Format (beautify) or minify JSON data',
      'Customizable indentation (2 or 4 spaces)',
      'JSON key search and highlighting functionality',
      'Large file support up to 10MB',
      'Line numbers for easy navigation',
    ],
    useCases: [
      'Debug malformed JSON from API responses',
      'Format minified JSON for code review',
      'Validate JSON configuration files',
      'Search for specific keys in complex JSON structures',
      'Clean up JSON data for documentation',
      'Prepare JSON for database storage',
      'Convert between formatted and minified JSON',
    ],
    proTips: [
      'Use Ctrl+A to select all text quickly',
      'Use the search feature to quickly find specific keys in large JSON files',
      'The tool automatically detects and highlights syntax errors',
      'Large JSON files are processed efficiently with Web Workers',
      'Copy the formatted output directly to your clipboard',
      'Use the minify option to reduce JSON file size for production',
    ],
    troubleshooting: [
      'If JSON appears invalid, check for trailing commas or unescaped quotes',
      'Ensure all strings are properly quoted with double quotes',
      'Verify that all brackets and braces are properly closed',
      "Remove any JavaScript comments as they're not valid in JSON",
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+A', description: 'Select all text' },
      { keys: 'Ctrl+F', description: 'Search for keys in JSON' },
      { keys: 'Ctrl+C', description: 'Copy formatted output' },
      { keys: 'Ctrl+V', description: 'Paste JSON input' },
    ],
  },

  'base64-encode': {
    id: 'base64-encode',
    title: 'How to use Base64 Encoder/Decoder',
    steps: [
      {
        title: 'Select encoding or decoding mode',
        description:
          'Choose "Encode" to convert text or files to Base64 format, or "Decode" to convert Base64 back to original format.',
      },
      {
        title: 'Input your data',
        description:
          'For text: paste directly into the text area. For files: drag and drop or click to select files up to 50MB.',
      },
      {
        title: 'Process the conversion',
        description:
          'Click the encode/decode button. The tool processes data locally in your browser for maximum security.',
      },
      {
        title: 'Copy or download results',
        description:
          'Copy the Base64 string to clipboard or download decoded files directly to your device.',
      },
    ],
    features: [
      'Text and file Base64 encoding/decoding',
      'Support for images, documents, and binary files',
      'File size support up to 50MB',
      'Drag and drop file interface',
      'Real-time processing with progress indication',
      'Direct download of decoded files',
    ],
    useCases: [
      'Embed images directly in HTML/CSS using Data URLs',
      'Encode files for API transmission',
      'Store binary data in JSON or XML',
      'Email attachment encoding',
      'Decode Base64 content from web sources',
      'Convert images for use in web applications',
    ],
    proTips: [
      'Base64 increases data size by approximately 33%',
      'Use for small to medium files to avoid memory issues',
      'Great for embedding icons and small images in code',
      'Always verify decoded content matches original',
      'Use MIME type prefixes for Data URLs (data:image/png;base64,)',
    ],
    troubleshooting: [
      'Invalid Base64 errors usually indicate corrupted or incomplete data',
      'Remove any whitespace or line breaks from Base64 strings',
      'Ensure the Base64 string uses valid characters (A-Z, a-z, 0-9, +, /, =)',
      'For large files, consider splitting the process or using smaller chunks',
    ],
  },

  'hash-generator': {
    id: 'hash-generator',
    title: 'How to use Hash Generator',
    steps: [
      {
        title: 'Enter text to hash',
        description:
          'Type or paste the text you want to generate hash values for. This can be passwords, data, or any string content.',
      },
      {
        title: 'Select hash algorithms',
        description:
          'Choose from MD5, SHA-1, SHA-256, SHA-512, or generate all hash types simultaneously for comparison.',
      },
      {
        title: 'Generate hash values',
        description:
          'Click generate to create cryptographic hash values. All processing happens locally for security.',
      },
      {
        title: 'Copy hash results',
        description:
          'Click on any hash value to copy it to your clipboard. Each algorithm produces a unique hash string.',
      },
    ],
    features: [
      'Multiple hash algorithms: MD5, SHA-1, SHA-256, SHA-512',
      'Real-time hash generation as you type',
      'One-click copy to clipboard',
      'Uppercase and lowercase output options',
      'File hash generation support',
      'Batch processing for multiple strings',
    ],
    useCases: [
      'Verify file integrity and detect changes',
      'Generate password hashes for storage',
      'Create checksums for data validation',
      'Security auditing and forensics',
      'Database record deduplication',
      'API authentication and tokens',
    ],
    proTips: [
      'SHA-256 is recommended for new applications requiring security',
      'MD5 is fast but not cryptographically secure - use for checksums only',
      'SHA-512 provides the highest security but larger hash size',
      'Always use salt when hashing passwords',
      'Different input produces completely different hash values',
    ],
    troubleshooting: [
      'Empty input produces empty hash - ensure text is entered',
      'Identical input always produces identical hash values',
      'Leading/trailing whitespace affects hash results',
      'Use consistent text encoding (UTF-8) for reproducible results',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+A', description: 'Select all input text' },
      { keys: 'Enter', description: 'Generate all hashes' },
      { keys: 'Ctrl+C', description: 'Copy selected hash' },
    ],
  },

  'uuid-generator': {
    id: 'uuid-generator',
    title: 'How to use UUID Generator',
    steps: [
      {
        title: 'Select UUID version',
        description:
          'Choose UUID v1 (timestamp-based) or v4 (random) depending on your requirements and use case.',
      },
      {
        title: 'Set generation quantity',
        description:
          'Specify how many UUIDs to generate at once. You can create single UUIDs or bulk generate up to 1000.',
      },
      {
        title: 'Configure output format',
        description:
          'Choose uppercase, lowercase, or with/without hyphens based on your system requirements.',
      },
      {
        title: 'Generate and copy UUIDs',
        description:
          'Click generate to create UUIDs. Copy individual UUIDs or select all for bulk operations.',
      },
    ],
    features: [
      'UUID v1 (timestamp-based) and v4 (random) generation',
      'Bulk generation up to 1000 UUIDs at once',
      'Multiple output formats (uppercase, lowercase, no hyphens)',
      'One-click copy for individual UUIDs',
      'Select all functionality for bulk copying',
      'Format validation and verification',
    ],
    useCases: [
      'Database primary keys and unique identifiers',
      'API request and transaction IDs',
      'File and resource naming',
      'Session tokens and temporary IDs',
      'Distributed system node identification',
      'Test data generation for development',
    ],
    proTips: [
      "Use UUID v4 for most applications - it's more secure and random",
      'UUID v1 includes timestamp and MAC address information',
      'Always verify UUID uniqueness in your specific use case',
      'Store UUIDs efficiently using binary format in databases',
      'Use consistent formatting across your entire application',
    ],
    troubleshooting: [
      'UUID v1 may expose MAC address - use v4 for privacy',
      'Ensure proper UUID validation in your application code',
      'Some systems require specific UUID formatting - check requirements',
      'Large bulk generations may take a moment to process',
    ],
    keyboardShortcuts: [
      { keys: 'Enter', description: 'Generate new UUID(s)' },
      { keys: 'Ctrl+A', description: 'Select all generated UUIDs' },
      { keys: 'Ctrl+C', description: 'Copy selected content' },
    ],
  },

  'password-generator': {
    id: 'password-generator',
    title: 'How to use Password Generator',
    steps: [
      {
        title: 'Set password length',
        description:
          'Choose password length between 4-128 characters. Longer passwords provide better security (minimum 12 recommended).',
      },
      {
        title: 'Configure character sets',
        description:
          'Select which character types to include: uppercase, lowercase, numbers, and special symbols based on system requirements.',
      },
      {
        title: 'Set additional options',
        description:
          'Choose to exclude ambiguous characters (0, O, l, I) and ensure at least one character from each selected set.',
      },
      {
        title: 'Generate and copy password',
        description:
          'Click generate to create a secure password. Copy it immediately and store it securely in a password manager.',
      },
    ],
    features: [
      'Customizable length from 4 to 128 characters',
      'Multiple character sets: uppercase, lowercase, numbers, symbols',
      'Exclude ambiguous characters option (0, O, l, I)',
      'Ensure character diversity across all selected sets',
      'Real-time password strength indicator',
      'One-click copy to clipboard',
    ],
    useCases: [
      'Generate secure passwords for new accounts',
      'Create temporary passwords for user accounts',
      'Generate API keys and authentication tokens',
      'Create secure database connection strings',
      'Generate random salts for cryptographic functions',
      'Bulk password generation for testing',
    ],
    proTips: [
      'Use at least 12 characters for good security, 16+ for high security',
      'Include all character types unless system restrictions apply',
      'Avoid dictionary words, personal information, or patterns',
      'Store generated passwords in a reputable password manager',
      'Never reuse passwords across different accounts',
    ],
    troubleshooting: [
      "If password doesn't meet system requirements, adjust character sets",
      "Some systems don't allow certain special characters - test first",
      'Extremely long passwords may cause issues in some forms',
      'Always test generated passwords in target system before finalizing',
    ],
    keyboardShortcuts: [
      { keys: 'Enter', description: 'Generate new password' },
      { keys: 'Ctrl+C', description: 'Copy password to clipboard' },
      { keys: 'Space', description: 'Regenerate password' },
    ],
  },

  'regex-tester': {
    id: 'regex-tester',
    title: 'How to use Regex Tester',
    steps: [
      {
        title: 'Enter your regular expression',
        description:
          'Type your regex pattern in the pattern field. Include forward slashes and flags (g, i, m) as needed.',
      },
      {
        title: 'Input test text',
        description:
          'Paste or type the text you want to test against your regex pattern in the test string area.',
      },
      {
        title: 'Set regex flags',
        description:
          'Toggle global (g), case-insensitive (i), and multiline (m) flags based on your matching requirements.',
      },
      {
        title: 'View live results',
        description:
          'See real-time matches highlighted in the text, with match details and capture groups displayed below.',
      },
    ],
    features: [
      'Live regex matching with real-time highlighting',
      'Support for global, case-insensitive, and multiline flags',
      'Match details with capture groups and positions',
      'Syntax highlighting for regex patterns',
      'Match count and replacement preview',
      'Common regex pattern library and examples',
    ],
    useCases: [
      'Validate email addresses and phone numbers',
      'Extract data from log files and text documents',
      'Search and replace text in bulk processing',
      'Validate user input in forms and applications',
      'Parse structured data from APIs and files',
      'Debug and test regex patterns before implementation',
    ],
    proTips: [
      'Use the global flag (g) to find all matches, not just the first one',
      'Test your regex with various edge cases and malformed input',
      'Use capture groups () to extract specific parts of matches',
      'Escape special characters with backslash when matching literals',
      'Start simple and build complexity gradually when creating patterns',
    ],
    troubleshooting: [
      'If no matches found, check for typos in pattern or test string',
      'Remember to escape special regex characters like . + * ? ^ $ { } ( ) | [ ]',
      "Use case-insensitive flag if case doesn't matter in your matches",
      'Multiline flag changes behavior of ^ and $ anchors',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+Enter', description: 'Test regex pattern' },
      { keys: 'Ctrl+/', description: 'Toggle regex comments' },
      { keys: 'F3', description: 'Find next match' },
    ],
  },

  'favicon-generator': {
    id: 'favicon-generator',
    title: 'How to use Favicon Generator',
    steps: [
      {
        title: 'Upload your source image',
        description:
          'Select a high-quality square image (minimum 512x512 pixels). PNG files with transparency work best for clean results.',
      },
      {
        title: 'Preview generated sizes',
        description:
          'Review how your favicon looks at different sizes (16x16, 32x32, 180x180, etc.) and adjust source image if needed.',
      },
      {
        title: 'Configure generation options',
        description:
          'Choose which favicon formats and sizes to include based on your platform requirements (web, iOS, Android).',
      },
      {
        title: 'Download favicon package',
        description:
          'Get a complete ZIP file containing all favicon formats, sizes, and the HTML code to implement them.',
      },
    ],
    features: [
      'Generate favicons for all major platforms and devices',
      'Multiple sizes: 16x16, 32x32, 57x57, 76x76, 120x120, 152x152, 180x180, 192x192, 512x512',
      'Support for ICO, PNG, and SVG formats',
      'Apple Touch Icons for iOS devices',
      'Android Chrome icons and web app manifest',
      'Complete HTML implementation code provided',
    ],
    useCases: [
      'Create professional website favicons from logos',
      'Generate app icons for progressive web applications',
      'Prepare icons for browser bookmarks and tabs',
      'Create touch icons for mobile devices',
      'Generate icons for Windows tile displays',
      'Prepare complete icon packages for web deployment',
    ],
    proTips: [
      'Use square images with at least 512x512 pixel resolution',
      'Simple, bold designs work better at small favicon sizes',
      'Test your favicon on both light and dark browser themes',
      "Include the provided HTML code in your website's <head> section",
      'Consider how your icon looks when scaled to 16x16 pixels',
    ],
    troubleshooting: [
      'If favicon appears blurry, use a higher resolution source image',
      'Complex designs may not be visible at smaller sizes - simplify if needed',
      'Ensure source image is square for best results across all sizes',
      'Clear browser cache after updating favicon to see changes',
    ],
  },

  'crontab-builder': {
    id: 'crontab-builder',
    title: 'How to use Crontab Expression Builder',
    steps: [
      {
        title: 'Choose input method',
        description:
          'Select "Build" to create a cron expression using the visual interface, or "Parse" to analyze an existing cron expression.',
      },
      {
        title: 'Set schedule parameters',
        description:
          'Use dropdown menus to set minutes, hours, days, months, and day-of-week values. Use "*" for "any" value.',
      },
      {
        title: 'Use preset shortcuts',
        description:
          'Select from common presets like @daily, @weekly, @monthly, or build custom schedules with specific timing.',
      },
      {
        title: 'Verify execution times',
        description:
          'Review the human-readable description and next execution times to confirm your schedule is correct.',
      },
    ],
    features: [
      'Visual cron expression builder with dropdown menus',
      'Parse and explain existing cron expressions',
      'Common preset shortcuts (@daily, @weekly, @monthly, etc.)',
      'Next execution time calculator with timezone support',
      'Human-readable schedule descriptions',
      'Cron expression validation and error detection',
    ],
    useCases: [
      'Schedule automated backups and maintenance tasks',
      'Set up recurring data processing jobs',
      'Configure log rotation and cleanup scripts',
      'Schedule report generation and email sending',
      'Automate deployment and build processes',
      'Set up monitoring and health check routines',
    ],
    proTips: [
      'Use */N syntax for "every N" intervals (*/5 = every 5 minutes)',
      'Comma-separate multiple values: 1,15,30 for specific times',
      'Use ranges with hyphens: 9-17 for business hours',
      'Test cron expressions in development before production use',
      'Consider server timezone when scheduling tasks',
    ],
    troubleshooting: [
      'If expression shows error, check each field for valid values',
      'Minutes: 0-59, Hours: 0-23, Days: 1-31, Months: 1-12, Weekdays: 0-7',
      'Remember that 0 and 7 both represent Sunday',
      'Verify timezone settings match your server environment',
    ],
    keyboardShortcuts: [
      { keys: 'Tab', description: 'Navigate between fields' },
      { keys: 'Enter', description: 'Generate expression' },
      { keys: 'Ctrl+C', description: 'Copy cron expression' },
    ],
  },

  'xml-formatter': {
    id: 'xml-formatter',
    title: 'How to use XML Formatter',
    steps: [
      {
        title: 'Input your XML document',
        description:
          'Paste XML data into the input area or upload an XML file. The tool automatically validates syntax and highlights any errors.',
      },
      {
        title: 'Choose processing mode',
        description:
          'Select Format to beautify, Minify to compress, or Validate to check syntax. Configure indentation and preservation options.',
      },
      {
        title: 'Search XML elements',
        description:
          'Use the search feature to find specific elements, attributes (@name), or XPath expressions (//user/@id) within your document.',
      },
      {
        title: 'View results and metadata',
        description:
          'Review formatted output with syntax highlighting, structure statistics, and namespace information. Copy or download the result.',
      },
    ],
    features: [
      'Format XML with customizable indentation (2 or 4 spaces)',
      'Minify XML by removing unnecessary whitespace',
      'Real-time syntax validation with error highlighting',
      'XPath-style search for elements and attributes',
      'Namespace detection and analysis',
      'Structure tree visualization with nesting levels',
      'Preserve or remove comments and CDATA sections',
      'Sort attributes alphabetically',
      'Handle multiple XML encodings (UTF-8, UTF-16, ISO-8859-1)',
      'Process large XML files with Web Workers',
    ],
    useCases: [
      'Format and validate SOAP web service messages',
      'Process RSS and Atom feed files',
      'Clean up Android layout and manifest files',
      'Format Maven POM and build configuration files',
      'Validate and beautify SVG graphics',
      'Process .NET Web.config and App.config files',
      'Format DocBook and XHTML documents',
      'Debug XML API responses and requests',
    ],
    proTips: [
      'Use XPath search with // for any depth: //user finds all user elements',
      'Search attributes with @ prefix: @id finds all id attributes',
      'Enable "Preserve Comments" to keep documentation in config files',
      'Sort attributes for consistent formatting across team projects',
      'Use minify mode to reduce file size for production deployments',
      'Check namespace declarations when working with SOAP or complex schemas',
    ],
    troubleshooting: [
      'If validation fails, check for unclosed tags or mismatched elements',
      'Encoding errors: ensure input matches declared encoding in XML declaration',
      'Large files may need chunked processing - enable Web Worker mode',
      'Namespace errors often indicate missing xmlns declarations',
      'CDATA sections must be properly closed with ]]>',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+F', description: 'Focus search field' },
      { keys: 'Ctrl+Enter', description: 'Format XML' },
      { keys: 'Ctrl+M', description: 'Minify XML' },
      { keys: 'Ctrl+C', description: 'Copy formatted result' },
      { keys: 'Ctrl+D', description: 'Download result' },
    ],
  },

  'csv-to-json': {
    id: 'csv-to-json',
    title: 'How to use CSV to JSON Converter',
    steps: [
      {
        title: 'Input your CSV data',
        description:
          'Paste CSV data directly into the input area or upload a CSV file using the file picker. The tool automatically detects headers and delimiters.',
      },
      {
        title: 'Configure parsing options',
        description:
          'Set custom delimiter (comma, semicolon, tab, pipe), choose whether first row contains headers, and select data type detection preferences.',
      },
      {
        title: 'Preview the conversion',
        description:
          'Review the parsed JSON structure in real-time. The tool shows row count, column detection, and any parsing warnings.',
      },
      {
        title: 'Choose output format',
        description:
          'Select between array of objects (default), nested structure, or compact array format. Customize property names if needed.',
      },
      {
        title: 'Export the JSON',
        description:
          'Copy the formatted JSON to clipboard or download as a .json file. Choose between minified or pretty-printed output.',
      },
    ],
    features: [
      'Automatic delimiter detection (comma, semicolon, tab, pipe)',
      'Smart header row detection and custom header mapping',
      'Data type inference (numbers, booleans, dates, nulls)',
      'Multiple output formats (array, nested, compact)',
      'Large file support with streaming for performance',
      'Quote handling for fields with delimiters',
      'Empty field and null value handling options',
      'Real-time preview with syntax highlighting',
    ],
    useCases: [
      'Converting spreadsheet exports to JSON for APIs',
      'Migrating CSV data to NoSQL databases',
      'Transforming Excel exports for web applications',
      'Processing data from legacy systems',
      'Creating JSON fixtures from CSV test data',
      'Importing CSV data into JavaScript applications',
      'Converting analytics reports to JSON format',
      'Preparing data for visualization libraries',
    ],
    proTips: [
      'Enable "Detect Types" to automatically convert numbers and booleans',
      'Use custom headers when CSV lacks header row or needs renaming',
      'Choose semicolon delimiter for European CSV formats',
      'Preview first before converting large files to check formatting',
      'Use compact format to reduce JSON file size by 30-40%',
      'Handle dates carefully - consider keeping as strings for compatibility',
    ],
    troubleshooting: [
      'Parsing errors: Check for unclosed quotes or mixed delimiters',
      'Wrong columns: Verify delimiter setting matches your CSV format',
      'Missing data: Ensure CSV is properly formatted with consistent columns',
      'Type issues: Disable type detection if numbers contain leading zeros',
      'Memory errors: For very large files, consider splitting into chunks',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+V', description: 'Paste CSV data' },
      { keys: 'Ctrl+A', description: 'Select all JSON output' },
      { keys: 'Ctrl+C', description: 'Copy JSON to clipboard' },
      { keys: 'Ctrl+S', description: 'Download JSON file' },
    ],
  },

  'sql-formatter': {
    id: 'sql-formatter',
    title: 'How to use SQL Formatter',
    steps: [
      {
        title: 'Paste your SQL query',
        description:
          'Copy and paste your SQL query or script into the input area. The tool accepts minified, unformatted SQL from any database system.',
      },
      {
        title: 'Select SQL dialect',
        description:
          'Choose your database system (MySQL, PostgreSQL, SQLite, SQL Server) for dialect-specific formatting and keyword recognition.',
      },
      {
        title: 'Configure formatting options',
        description:
          'Customize indentation size, keyword casing (uppercase/lowercase), and line break preferences to match your coding standards.',
      },
      {
        title: 'Review formatted output',
        description:
          'The tool validates SQL syntax and displays formatted query with proper indentation, keyword highlighting, and improved readability.',
      },
      {
        title: 'Copy or download result',
        description:
          'Copy the formatted SQL to clipboard for immediate use or download as a .sql file for storage and sharing.',
      },
    ],
    features: [
      'Multi-dialect support (MySQL, PostgreSQL, SQLite, SQL Server)',
      'Intelligent keyword recognition and case conversion',
      'Customizable indentation (2, 4, or tab spacing)',
      'SQL syntax validation with error highlighting',
      'Complex query parsing including CTEs, subqueries, and joins',
      'Comment preservation and formatting',
      'Large SQL script support up to 5MB',
      'Export formatted SQL as downloadable file',
    ],
    useCases: [
      'Format messy SQL queries for better readability',
      'Standardize SQL code style across development teams',
      'Debug complex queries with proper indentation',
      'Prepare SQL scripts for documentation and code review',
      'Convert between different SQL formatting standards',
      'Clean up auto-generated SQL from query builders',
      'Format stored procedures and database migration scripts',
      'Prepare SQL queries for production deployment',
    ],
    proTips: [
      'Use uppercase keywords for better SQL readability and standards',
      'Choose 4-space indentation for optimal balance of readability and compactness',
      'Select the correct SQL dialect to ensure proper keyword recognition',
      'Format large scripts in sections if performance becomes slow',
      'Preserve original comments - they contain important context',
      'Use consistent formatting across your entire codebase',
    ],
    troubleshooting: [
      'Syntax errors: Check for missing semicolons, unclosed parentheses, or quotes',
      'Unrecognized keywords: Verify SQL dialect selection matches your database',
      'Formatting issues: Ensure SQL is valid before formatting',
      'Performance slow: Break very large scripts into smaller chunks',
      'Missing features: Some advanced dialect-specific syntax may need manual formatting',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+V', description: 'Paste SQL query' },
      { keys: 'Ctrl+Enter', description: 'Format SQL' },
      { keys: 'Ctrl+A', description: 'Select all formatted output' },
      { keys: 'Ctrl+C', description: 'Copy formatted SQL' },
      { keys: 'Ctrl+S', description: 'Download SQL file' },
    ],
  },

  'jwt-decoder': {
    id: 'jwt-decoder',
    title: 'How to use JWT Decoder',
    steps: [
      {
        title: 'Input your JWT token',
        description:
          'Paste the complete JWT token into the input area. JWT tokens consist of three Base64URL-encoded parts separated by dots: header.payload.signature',
      },
      {
        title: 'Configure decoding options',
        description:
          'Enable structure validation to verify the token format, time analysis for expiration checks, and tool suggestions for related processing options.',
      },
      {
        title: 'Review decoded sections',
        description:
          'Examine the decoded header (algorithm and token type), payload (claims and user data), and signature information in separate expandable sections.',
      },
      {
        title: 'Analyze security and claims',
        description:
          'Check the security analysis for algorithm warnings, review standard and custom claims with descriptions, and validate expiration status.',
      },
      {
        title: 'Export or copy results',
        description:
          'Copy individual sections (header, payload, signature) or download the complete decoded token data as a JSON file for further analysis.',
      },
    ],
    features: [
      'Decode JWT header, payload, and signature sections',
      'Validate token structure with detailed error reporting',
      'Analyze standard JWT claims with descriptions (iss, sub, aud, exp, etc.)',
      'Security assessment for signing algorithms and best practices',
      'Expiration and time-based claim validation with relative time display',
      'Support for all JWT algorithms including RS256, HS256, ES256, etc.',
      'Claims categorization (standard vs custom claims)',
      'Token metadata analysis (sizes, structure validity)',
      'Sample JWT tokens for testing and learning',
      'Real-time decoding with debounced input processing',
    ],
    useCases: [
      'Debug authentication and authorization issues in web applications',
      'Analyze JWT tokens from OAuth 2.0 and OpenID Connect flows',
      'Inspect API authentication tokens for troubleshooting',
      'Validate token expiration and time-based claims',
      'Extract user information and permissions from bearer tokens',
      'Audit JWT implementation security and best practices',
      'Understand token structure for development and testing',
      'Parse tokens from single sign-on (SSO) systems',
      'Analyze refresh tokens and access tokens in microservices',
      'Debug mobile app authentication token issues',
      'Inspect Firebase, Auth0, or custom JWT implementations',
      'Validate token signing algorithms and security configurations',
    ],
    proTips: [
      'Look for the "exp" claim to verify token expiration - expired tokens should be rejected',
      'Check the "alg" field in the header to ensure secure algorithms (avoid "none")',
      'Standard claims like "iss" (issuer) and "aud" (audience) are critical for security validation',
      'Use the security analysis to identify potential vulnerabilities in your JWT implementation',
      'Symmetric algorithms (HS256) require the same key for signing and verification',
      'Asymmetric algorithms (RS256, ES256) allow public key verification without exposing the private key',
      'The "iat" (issued at) claim helps track token age and freshness',
      "Custom claims should follow your application's security requirements and data minimization practices",
    ],
    troubleshooting: [
      'Invalid structure error: Ensure the token has exactly three parts separated by dots',
      'Base64URL decoding failed: Check for URL-safe encoding (- and _ instead of + and /)',
      'JSON parsing errors: Verify that header and payload sections contain valid JSON',
      'Missing required dots: JWT tokens must have two dots separating three sections',
      'Token appears truncated: Ensure you copied the complete token without line breaks or truncation',
      'Signature section issues: Empty signatures are valid for unsigned tokens (alg: "none")',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+V', description: 'Paste JWT token' },
      { keys: 'Ctrl+Enter', description: 'Decode token' },
      { keys: 'Ctrl+C', description: 'Copy decoded result' },
      { keys: 'Ctrl+D', description: 'Download JSON file' },
      { keys: 'Ctrl+F', description: 'Focus search field' },
    ],
  },

  'url-encode': {
    id: 'url-encode',
    title: 'How to use URL Encoder/Decoder',
    steps: [
      {
        title: 'Enter URL or text to process',
        description:
          'Paste your URL, query parameters, or text containing special characters into the input field. The tool supports full URLs, URL components, or plain text.',
      },
      {
        title: 'Choose processing mode',
        description:
          'Select "Auto" for automatic detection (recommended), "Encode" to convert special characters to percent-encoded format (%20 for spaces, %21 for !, etc.), or "Decode" to convert percent-encoded characters back to readable text.',
      },
      {
        title: 'Select encoding type',
        description:
          'Choose between "URL Component" (encodes most special characters for path/query use) or "Full URL" (preserves URL structure like ://?# while encoding other characters).',
      },
      {
        title: 'View real-time results',
        description:
          'The encoded/decoded result appears instantly as you type. Invalid percent-encoded sequences are highlighted with error messages.',
      },
      {
        title: 'Copy or download results',
        description:
          'Use the copy button to copy results to clipboard or download as text file for batch URL processing workflows.',
      },
    ],
    features: [
      'Automatic mode detection (encode vs decode)',
      'Real-time URL encoding and decoding',
      'Support for URL components and full URLs',
      'International character handling (UTF-8)',
      'Query parameter parsing and encoding',
      'Invalid sequence detection and validation',
      'Batch processing for multiple URLs',
      'Copy to clipboard functionality',
      'Download results as text files',
    ],
    useCases: [
      'Preparing URLs with special characters for HTTP requests',
      'Decoding query parameters from web forms',
      'Processing URLs with international characters',
      'Debugging URL-related issues in web applications',
      'Converting spaces and symbols for safe URL transmission',
      'Preparing API endpoint URLs with encoded parameters',
      'Processing log files containing encoded URLs',
      'Validating URL encoding in web development',
      'Converting URLs for email or document embedding',
      'Batch processing URLs from CSV or text files',
    ],
    proTips: [
      'Use "Auto" mode for intelligent encoding/decoding detection - it analyzes your input automatically',
      'Use "URL Component" encoding for individual query parameters and path segments',
      'Use "Full URL" encoding to preserve URL structure while encoding special characters',
      'International characters are automatically converted to UTF-8 percent encoding',
      'Query parameters can be processed individually for better control',
      'Invalid percent sequences (like %ZZ) are automatically detected and highlighted',
      'Use batch mode to process multiple URLs from clipboard or file input',
    ],
    troubleshooting: [
      'Invalid percent encoding: Check for incomplete sequences like % followed by non-hex characters',
      'Special characters not encoding: Ensure you selected the correct encoding mode',
      'Query parameters malformed: Use & to separate parameters and = for key-value pairs',
      'International characters displaying incorrectly: Modern browsers handle UTF-8 automatically',
      'URL structure broken after encoding: Use "URL Component" for parts, not full URLs',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+V', description: 'Paste URL to encode/decode' },
      { keys: 'Ctrl+C', description: 'Copy encoded/decoded result' },
      { keys: 'Ctrl+E', description: 'Toggle encode/decode mode' },
      { keys: 'Ctrl+Enter', description: 'Process URL' },
      { keys: 'Ctrl+D', description: 'Download results' },
    ],
  },

  'qr-generator': {
    id: 'qr-generator',
    title: 'How to use QR Code Generator',
    steps: [
      {
        title: 'Select QR code content type',
        description:
          'Choose from URL, WiFi credentials, vCard contact, Email, SMS, Geo location, or plain text. Each type provides specialized input fields for optimal QR code generation.',
      },
      {
        title: 'Enter your content data',
        description:
          'Fill in the relevant fields based on your selected type. For URLs, enter the complete web address. For WiFi, provide SSID, password, and security type. For contacts, add name, phone, and email.',
      },
      {
        title: 'Customize appearance and settings',
        description:
          'Set QR code size (100x100 to 2000x2000), choose error correction level (L/M/Q/H), adjust margin size, and select foreground/background colors. Upload a logo for branded QR codes.',
      },
      {
        title: 'Generate and preview QR code',
        description:
          'Click generate to create your QR code with real-time preview. The tool validates content, optimizes settings, and shows readability score with device compatibility warnings.',
      },
      {
        title: 'Export in multiple formats',
        description:
          'Download as PNG, SVG, PDF for printing, or copy as Base64/Data URL for web embedding. Use batch generation for multiple QR codes from CSV/JSON input.',
      },
    ],
    features: [
      'Multiple content types: URL, WiFi, vCard, Email, SMS, Geo, Crypto addresses',
      'Advanced customization: Size, colors, error correction, margins, logo embedding',
      'Multiple export formats: PNG, SVG, PDF, Base64, Data URL',
      'Batch generation from CSV, JSON, or text lists',
      'Real-time validation and readability scoring',
      'API integration preview with cURL commands',
      'Built-in QR scanner for reverse engineering',
      'Template system with presets for common use cases',
      'Size optimization with compression suggestions',
      'Mobile-responsive preview and testing',
    ],
    useCases: [
      'Generate WiFi QR codes for easy guest network access',
      'Create vCard QR codes for business card contact sharing',
      'Generate URL QR codes for marketing campaigns and websites',
      'Create email and SMS QR codes for direct communication',
      'Generate geo-location QR codes for event venues and addresses',
      'Create cryptocurrency payment QR codes with amount specification',
      'Bulk generate QR codes for inventory management and tracking',
      'Generate API endpoint QR codes for mobile app integration',
      'Create authentication QR codes for 2FA and login systems',
      'Generate social media profile QR codes for easy following',
      'Create event QR codes with calendar integration (iCal format)',
      'Generate app store QR codes for mobile app downloads',
    ],
    proTips: [
      'Use higher error correction (H=30%) for printed QR codes that might get damaged',
      'Keep URLs short - use URL shorteners for better scannability and smaller QR codes',
      'Test QR codes on different devices and apps before mass distribution',
      'Use contrast ratios of at least 3:1 between foreground and background colors',
      'Logo size should not exceed 30% of the QR code area to maintain readability',
      'For batch generation, use CSV format with headers: type,content,size,filename',
      'SVG format scales infinitely - perfect for print materials and high-DPI displays',
      'Use Medium (M=15%) error correction for most digital use cases',
      'Add margins (quiet zone) of at least 4 modules for reliable scanning',
      'Test print quality at actual size before mass printing campaigns',
    ],
    troubleshooting: [
      'QR code not scanning: Increase error correction level or reduce logo size',
      'Low readability score: Improve color contrast or increase QR code size',
      'Logo placement issues: Center logo and ensure it covers finder patterns',
      'Batch import failing: Check CSV format with proper headers and encoding',
      'Large file sizes: Use PNG for photos, SVG for graphics, reduce dimensions if needed',
      'Mobile scanning issues: Test with multiple QR scanner apps and devices',
      'Print quality poor: Use vector SVG format or high-DPI PNG (300+ DPI)',
      'WiFi QR not working: Verify SSID spelling and password accuracy',
      'URL QR leads nowhere: Test URL accessibility and ensure HTTPS when needed',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+G', description: 'Generate QR code' },
      { keys: 'Ctrl+C', description: 'Copy QR code as Data URL' },
      { keys: 'Ctrl+S', description: 'Download QR code' },
      { keys: 'Ctrl+U', description: 'Switch to URL content type' },
      { keys: 'Ctrl+W', description: 'Switch to WiFi content type' },
      { keys: 'Ctrl+T', description: 'Switch to text content type' },
      { keys: 'Ctrl+B', description: 'Open batch generation mode' },
      { keys: 'F5', description: 'Regenerate with same settings' },
    ],
  },

  'color-picker': {
    id: 'color-picker',
    title: 'How to use Color Picker',
    steps: [
      {
        title: 'Select a color using the interface',
        description:
          'Use the color wheel for intuitive HSV selection, spectrum bar for linear picking, or click the eyedropper icon to pick colors from anywhere on your screen (in supported browsers). You can also input values directly in any format.',
      },
      {
        title: 'Convert between color formats',
        description:
          'Your selected color is automatically converted to HEX, RGB, HSL, HSV, CMYK, and LAB formats. Click any format tab to view and copy values. Use the copy button next to each format for quick clipboard access.',
      },
      {
        title: 'Generate color palettes',
        description:
          'Choose a harmony type (complementary, triadic, analogous, split-complementary, tetradic, or monochromatic) to generate a professional color palette. Adjust the base color to see real-time palette updates.',
      },
      {
        title: 'Check contrast and accessibility',
        description:
          'Use the contrast checker to verify WCAG AA/AAA compliance for text on backgrounds. The tool shows exact contrast ratios and provides suggestions for accessible alternatives if needed.',
      },
      {
        title: 'Export for development',
        description:
          'Generate code for CSS variables, SCSS, Tailwind classes, JavaScript objects, or design system tokens. Export palettes as JSON, Adobe ASE, or image swatches for use in your projects.',
      },
    ],
    features: [
      'Multiple color format conversion (HEX, RGB, HSL, HSV, CMYK, LAB)',
      'Interactive color wheel and spectrum bar interfaces',
      'Eyedropper API for screen color picking',
      'Professional palette generation with multiple harmony types',
      'WCAG contrast checker with AA/AAA compliance indicators',
      'Color blindness simulator (8 types)',
      'CSS, SCSS, Tailwind, and JavaScript code generation',
      'Material Design and Bootstrap color mapping',
      'Gradient generator with multiple stops',
      'Image color extraction and dominant palette analysis',
      'Batch color conversion and processing',
      'Recent colors history and favorite palettes',
    ],
    useCases: [
      'Web developers selecting brand colors for websites',
      'UI/UX designers creating accessible color schemes',
      'Frontend developers converting design colors to code',
      'Accessibility specialists checking contrast ratios',
      'Brand designers developing color palettes',
      'Mobile app developers needing platform-specific color codes',
      'Print designers converting RGB to CMYK',
      'Theme creators for VS Code, terminals, or applications',
      'Marketing teams maintaining brand consistency',
      'Data visualization experts choosing distinguishable colors',
      'Game developers creating color-based mechanics',
      'CSS framework users finding Tailwind/Bootstrap equivalents',
    ],
    proTips: [
      'Use keyboard arrows for fine-tuning color values in any input field',
      'Double-click color swatches to quickly copy HEX values',
      'Hold Shift while using the color wheel for saturation-only adjustments',
      'Press spacebar to quickly toggle between HEX/RGB/HSL formats',
      'Use the temperature slider to make colors warmer or cooler',
      'Export palettes as CSS custom properties for easy theme switching',
      'Check contrast with both black and white text for versatility',
      'Use monochromatic palettes for consistent, professional designs',
      'Test colors in color blindness simulator before finalizing',
      'Save project-specific palettes for consistent color usage',
    ],
    troubleshooting: [
      'Eyedropper not working: Check browser compatibility and permissions',
      'Colors look different in print: Use CMYK values for print design',
      'Contrast checker shows failure: Try darker shades or increase font size',
      'Palette colors clash: Use analogous or monochromatic harmonies for subtlety',
      'Color picker lag: Disable real-time preview for performance on older devices',
    ],
    keyboardShortcuts: [
      { keys: 'C', description: 'Copy current color as HEX' },
      { keys: 'H', description: 'Switch to HEX format' },
      { keys: 'R', description: 'Switch to RGB format' },
      { keys: 'L', description: 'Switch to HSL format' },
      { keys: 'P', description: 'Generate palette' },
      { keys: 'E', description: 'Activate eyedropper' },
      { keys: 'Space', description: 'Toggle format display' },
      { keys: '↑/↓', description: 'Adjust brightness' },
      { keys: '←/→', description: 'Adjust hue' },
      { keys: 'Shift+↑/↓', description: 'Adjust saturation' },
    ],
  },

  'gradient-generator': {
    id: 'gradient-generator',
    title: 'How to use Gradient Generator',
    steps: [
      {
        title: 'Choose gradient type and direction',
        description:
          'Select linear, radial, or conic gradient type. For linear gradients, adjust the angle (0-360°). For radial gradients, set shape, size, and center position. For conic gradients, configure start angle and center point.',
      },
      {
        title: 'Add and customize color stops',
        description:
          'Click the + button to add color stops, use the color picker to select colors, and drag the position sliders to control placement (0-100%). You can have up to 10 color stops for complex gradients.',
      },
      {
        title: 'Fine-tune with visual editor',
        description:
          'Use the real-time preview to see your gradient changes instantly. Adjust preview size to test how the gradient looks at different dimensions. Click on color stop indicators for quick selection.',
      },
      {
        title: 'Export your gradient',
        description:
          'Copy CSS code with browser compatibility prefixes, generate Tailwind CSS classes, or export as SVG. Toggle between simple and compatible CSS formats based on your browser support needs.',
      },
      {
        title: 'Save and organize gradients',
        description:
          'Save your favorite gradients to local storage, browse preset collections by category (sunset, ocean, neon, pastel), or generate random gradients with color harmony algorithms.',
      },
    ],
    features: [
      'Linear, radial, and conic gradient support',
      'Visual color stop editor with drag and drop',
      'Real-time preview with resizable canvas',
      'Up to 10 color stops with alpha transparency',
      'CSS output with browser compatibility prefixes',
      'Tailwind CSS class generation (approximation)',
      'SVG gradient export for graphics',
      'Preset collections organized by categories',
      'Random gradient generator with color theory',
      'Local storage for saving favorite gradients',
      'Keyboard shortcuts for efficiency',
      'Color harmony algorithms for pleasing combinations',
    ],
    useCases: [
      'Website background designs and hero sections',
      'UI component styling for buttons and cards',
      'Mobile app background gradients',
      'Social media graphics and banners',
      'Email template backgrounds',
      'CSS framework customization',
      'Brand color palette development',
      'Creative coding and generative art projects',
      'Print design color transitions',
      'Data visualization color schemes',
      'Game UI and interface design',
      'Marketing material backgrounds',
    ],
    proTips: [
      'Use 2-3 color stops for clean, professional gradients',
      'Test gradients at different screen sizes to ensure they work on mobile',
      'Use analogous colors (next to each other on color wheel) for harmonious gradients',
      'Save gradients with descriptive names to build a personal library',
      'Use conic gradients for creating rainbow or circular spectrum effects',
      'Export SVG format for scalable graphics and icons',
      'Copy compatible CSS for older browser support',
      'Use radial gradients for spotlight or fade effects',
    ],
    troubleshooting: [
      'Gradient appears banded: Increase color stops or use closer color values',
      'Colors look different in production: Check browser color profile settings',
      'Gradient not visible: Ensure sufficient contrast between stops',
      'SVG export not working: Conic gradients are not supported in SVG format',
      'Performance issues: Limit complex gradients on mobile devices',
      'Browser compatibility: Use vendor prefixes for older browser support',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+C', description: 'Copy CSS code' },
      { keys: 'Ctrl+R', description: 'Generate random gradient' },
      { keys: 'Ctrl+S', description: 'Save to favorites' },
      { keys: '+', description: 'Add color stop' },
      { keys: '-', description: 'Remove selected color stop' },
      { keys: 'L', description: 'Switch to linear gradient' },
      { keys: 'R', description: 'Switch to radial gradient' },
      { keys: 'C', description: 'Switch to conic gradient' },
    ],
  },

  'json-to-csv': {
    id: 'json-to-csv',
    title: 'How to use JSON to CSV Converter',
    steps: [
      {
        title: 'Input your JSON data',
        description:
          'Paste JSON data or upload a JSON file (up to 10MB). Supports JSON arrays of objects, single objects, and nested structures. The converter automatically validates JSON syntax and provides error reporting with line numbers.',
      },
      {
        title: 'Configure conversion options',
        description:
          'Choose delimiter (comma, semicolon, tab, pipe), text qualifier (single/double quotes), and line endings (CRLF/LF). Enable auto-flattening for nested objects with customizable separator, configure null value handling, and set default values for missing fields.',
      },
      {
        title: 'Select and organize columns',
        description:
          'Auto-detect columns from JSON or manually select which fields to include. Drag and drop to reorder columns, rename column headers with custom mapping, and apply filters to exclude specific rows based on field values.',
      },
      {
        title: 'Preview and validate output',
        description:
          'Review the formatted CSV in the interactive preview table with syntax highlighting. Check statistics (rows, columns, empty fields) and verify data transformation accuracy. Scroll through large datasets with virtualized rendering for performance.',
      },
      {
        title: 'Export your CSV data',
        description:
          'Download as .csv file with chosen encoding (UTF-8 with/without BOM), copy to clipboard for quick paste into spreadsheets, or generate shareable download link. Compatible with Excel, Google Sheets, and database imports.',
      },
    ],
    features: [
      'Flexible JSON input with array and single object support',
      'Automatic nested object flattening with configurable separator',
      'Custom column selection and drag-and-drop reordering',
      'Multiple delimiter options (comma, semicolon, tab, pipe)',
      'Text qualifier configuration for special characters',
      'Null/undefined value handling with custom placeholders',
      'Real-time preview with virtualized table rendering',
      'Large file processing up to 10MB with streaming',
      'Excel and Google Sheets compatible output formats',
      'Batch processing for multiple JSON conversions',
      'UTF-8 encoding with optional BOM for Excel compatibility',
      'Row filtering based on field conditions',
    ],
    useCases: [
      'Export API response data to Excel for analysis',
      'Convert JSON logs to tabular format for reporting',
      'Migrate data between databases and applications',
      'Prepare datasets for machine learning and data science',
      'Generate CSV reports from application data',
      'Transform NoSQL database exports to relational format',
      'Create backup files in portable CSV format',
      'Import JSON data into spreadsheet applications',
      'Convert configuration files for legacy systems',
      'Process webhook payloads for data warehousing',
    ],
    proTips: [
      'Use dot notation separator for nested objects to maintain hierarchy',
      'Enable header row for better Excel/Google Sheets compatibility',
      'Configure UTF-8 BOM for proper character display in Excel',
      'Use semicolon delimiter for European Excel versions',
      'Apply filters before conversion to reduce output size',
      'Preview large files with pagination to verify structure',
      'Save custom column mappings for repeated conversions',
      'Use pipe delimiter for data with commas and quotes',
    ],
    troubleshooting: [
      'Special characters display incorrectly? Enable UTF-8 BOM for Excel',
      'Nested arrays not flattening? Use array index notation in settings',
      'Large file processing slow? Enable streaming mode for files over 5MB',
      'Excel showing data in one column? Check delimiter matches regional settings',
      'Missing columns in output? Verify all JSON objects have consistent structure',
      'Memory issues with huge datasets? Process in batches of 1000 records',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+V', description: 'Paste JSON data' },
      { keys: 'Ctrl+Enter', description: 'Convert to CSV' },
      { keys: 'Ctrl+D', description: 'Download CSV file' },
      { keys: 'Ctrl+C', description: 'Copy CSV to clipboard' },
      { keys: 'Ctrl+Z', description: 'Undo last change' },
      { keys: 'Ctrl+Shift+R', description: 'Reset all options' },
    ],
  },

  'list-compare': {
    id: 'list-compare',
    title: 'How to use List Compare & Diff Tool',
    steps: [
      {
        title: 'Add your lists',
        description:
          'Start with 2 lists and add up to 10 total. Input via textarea, upload files (.txt, .csv, .json), or paste clipboard content. Auto-detect separators (newline, comma, semicolon, tab) or configure manually. Each list can contain up to 100,000 elements.',
      },
      {
        title: 'Configure comparison settings',
        description:
          'Choose comparison mode: Set Operations (union, intersection, difference), Sequential Compare (position-based), Smart Compare (ignore case/spaces), Fuzzy Matching (similarity threshold), or Developer Mode (package versions, URLs, code patterns). Configure sorting and transformation options.',
      },
      {
        title: 'Apply pre-processing transforms',
        description:
          'Clean and prepare your data with transformations: sort alphabetically/numerically, remove duplicates, filter by length/pattern, convert case, add prefix/suffix, extract patterns with regex, or apply custom JavaScript functions for advanced processing.',
      },
      {
        title: 'Analyze results with visualizations',
        description:
          'View results in multiple formats: Venn diagrams for 2-3 lists, tabular view with color-coded differences, unified list with origin badges, matrix view for membership across lists, or detailed statistics with overlap percentages and similarity metrics.',
      },
      {
        title: 'Export in developer formats',
        description:
          'Export results in various formats: JavaScript/TypeScript arrays, Python lists, SQL IN clauses, JSON with metadata, CSV with membership columns, Markdown tables, or generate test assertions. Copy to clipboard or download as files.',
      },
    ],
    features: [
      'Support for 2-10 lists with up to 100k elements each',
      'Multiple input methods: textarea, file upload, clipboard paste',
      'Auto-detection of separators and data formats',
      'Advanced set operations: union, intersection, symmetric difference',
      'Fuzzy matching with configurable similarity threshold',
      'Developer-specific comparisons: package versions, URLs, code patterns',
      'Smart case-insensitive and whitespace-normalized comparison',
      'Regex pattern matching and wildcard support',
      'Interactive Venn diagrams and data visualizations',
      'Pre-processing: sorting, deduplication, filtering, transformations',
      'Multiple export formats for different programming languages',
      'Performance optimization with Web Workers for large datasets',
    ],
    useCases: [
      'Compare package.json dependencies between projects',
      'Analyze git branch file differences for code reviews',
      'Find missing API endpoints between service versions',
      'Identify duplicate entries across multiple data sources',
      'Compare database schema columns and indexes',
      'Analyze log files for new errors or warnings',
      'Merge and deduplicate contact lists from different sources',
      'Compare configuration files across environments',
      'Find overlap in marketing email lists for campaigns',
      'Analyze A/B test groups for proper randomization',
      'Compare file lists for backup verification',
      'Identify missing translations in localization files',
    ],
    proTips: [
      'Use developer mode for comparing package.json dependencies automatically',
      'Enable fuzzy matching (85% threshold) for finding similar but not identical items',
      'Sort lists before comparison to identify sequential patterns',
      'Use regex filtering to extract specific patterns (emails, URLs, IDs)',
      'Export as SQL IN clause for database queries with filtered results',
      'Save frequently used lists as named sets for quick reuse',
      'Use case-insensitive mode when comparing file names or identifiers',
      'Enable trim whitespace to handle copy-paste formatting inconsistencies',
    ],
    troubleshooting: [
      'Large lists slow? Enable Web Worker mode in settings for better performance',
      'Unexpected differences? Check case sensitivity and whitespace handling settings',
      'File upload fails? Ensure file size is under 10MB and format is supported',
      'Fuzzy matching too aggressive? Increase similarity threshold to 90-95%',
      'Results incomplete? Check if auto-detect separator identified format correctly',
      'Export format issues? Verify special characters are properly escaped for target language',
      'Memory issues? Process large datasets in smaller chunks or use streaming mode',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+Enter', description: 'Run comparison' },
      { keys: 'Ctrl+N', description: 'Add new list' },
      { keys: 'Ctrl+D', description: 'Duplicate current list' },
      { keys: 'Ctrl+Shift+C', description: 'Copy results to clipboard' },
      { keys: 'Ctrl+Shift+D', description: 'Download results' },
      { keys: 'Ctrl+R', description: 'Reset all lists' },
      { keys: 'Ctrl+S', description: 'Save current configuration' },
      { keys: 'Ctrl+Z', description: 'Undo last operation' },
    ],
  },

  'curl-to-code': {
    id: 'curl-to-code',
    title: 'How to use cURL to Code Converter',
    steps: [
      {
        title: 'Paste your cURL command',
        description:
          'Copy and paste your cURL command from browser DevTools, API documentation, or terminal. Supports multi-line commands with backslashes, all cURL flags (-X, -H, -d, -F, -u, etc.), and complex authentication methods. Auto-detects command structure and parameters.',
      },
      {
        title: 'Select target language and framework',
        description:
          'Choose from 15+ programming languages and their frameworks: JavaScript (Fetch, Axios, jQuery), Python (requests, httpx, aiohttp), Go, Java, PHP, Ruby, Rust, Swift, Kotlin, C#, and more. Each language offers multiple HTTP client options with specific benefits.',
      },
      {
        title: 'Configure generation options',
        description:
          'Customize code output with error handling (try-catch), async/await patterns, environment variables for sensitive data, type inference for responses, retry logic with exponential backoff, logging statements, and comprehensive documentation comments.',
      },
      {
        title: 'Review and enhance generated code',
        description:
          'Examine production-ready code with proper error handling, response parsing, status checking, and best practices. Use the type inference panel to see generated interfaces/types. Preview mock responses and test data. Add authentication flows and caching layers as needed.',
      },
      {
        title: 'Export code and tests',
        description:
          'Copy code to clipboard with one click, download as properly formatted files with correct extensions, generate unit tests for the HTTP client code, export complete SDK classes for multiple endpoints, or create API documentation from the cURL command.',
      },
    ],
    features: [
      'Support for ALL cURL flags and options (-X, -H, -d, -F, -u, -b, --data-binary, etc.)',
      '15+ programming languages with multiple framework options each',
      'Automatic type inference from JSON payloads and responses',
      'Error handling with language-specific try-catch patterns',
      'Async/await code generation where supported',
      'Environment variable extraction for sensitive data',
      'Retry logic with configurable exponential backoff',
      'Authentication support: Basic, Bearer, OAuth2, API Keys',
      'File upload and multipart/form-data handling',
      'Cookie and session management code generation',
      'Proxy configuration and SSL certificate options',
      'Import from HAR files, Postman collections, and OpenAPI specs',
      'Batch conversion for multiple cURL commands to SDK',
      'Unit test generation with mocking frameworks',
      'Real-time syntax highlighting and validation',
    ],
    useCases: [
      'Convert API documentation cURL examples to client code',
      'Transform browser DevTools network requests to code',
      'Migrate from one HTTP client library to another',
      'Generate SDK clients from API endpoint collections',
      'Create test suites from recorded HTTP traffic',
      'Build authentication flows from OAuth2 cURL commands',
      'Convert Postman collections to native code',
      'Generate GraphQL client code from cURL queries',
      'Create webhook handlers from cURL examples',
      'Build CI/CD pipeline HTTP requests from cURL',
      'Convert legacy cURL scripts to modern async code',
      'Generate API integration code for mobile apps',
    ],
    proTips: [
      'Use "Extract to Environment" to automatically move API keys to .env variables',
      'Enable type inference for TypeScript/Go/Java to get strongly-typed responses',
      'Select async variants (aiohttp, httpx) for high-performance Python code',
      'Use the SDK Builder mode to combine multiple cURL commands into one class',
      'Enable retry logic for production code dealing with flaky APIs',
      'Export to Postman format for team collaboration and testing',
      'Use mock response generation for unit testing without real API calls',
      'Enable verbose logging during development, disable for production',
      'Choose streaming clients for large file downloads or SSE endpoints',
      'Use the GraphQL mode for better query/mutation handling',
    ],
    troubleshooting: [
      'Complex cURL not parsing? Check for proper escape characters and quotes',
      'Authentication failing? Verify header format matches target language requirements',
      'File uploads not working? Ensure multipart boundary is correctly generated',
      'Binary data issues? Use base64 encoding for binary payloads',
      'Timeout errors? Increase timeout values in generation options',
      'SSL certificate errors? Add certificate verification options for development',
      'Proxy not working? Check proxy URL format and authentication',
      'Large payloads truncated? Enable streaming mode for large data transfers',
      'Cookie handling issues? Verify cookie jar initialization in generated code',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+Enter', description: 'Convert cURL to code' },
      { keys: 'Ctrl+Shift+F', description: 'Format cURL command' },
      { keys: 'Ctrl+L', description: 'Change target language' },
      { keys: 'Ctrl+C', description: 'Copy generated code' },
      { keys: 'Ctrl+S', description: 'Download as file' },
      { keys: 'Ctrl+T', description: 'Generate tests' },
      { keys: 'Ctrl+E', description: 'Extract environment variables' },
      { keys: 'Ctrl+I', description: 'Import from file' },
      { keys: 'Alt+Enter', description: 'Convert and copy' },
    ],
  },

  'json-to-typescript': {
    id: 'json-to-typescript',
    title: 'How to use JSON to TypeScript Converter',
    steps: [
      {
        title: 'Paste or import JSON data',
        description:
          'Enter your JSON data directly, upload a .json file, or fetch from a URL endpoint. The tool validates JSON syntax and provides detailed error reporting.',
      },
      {
        title: 'Configure generation options',
        description:
          'Customize naming conventions (PascalCase, camelCase), choose between interfaces or type aliases, set array notation preferences, and configure optional property handling.',
      },
      {
        title: 'Customize advanced settings',
        description:
          'Enable features like readonly properties, separate type extraction, enum detection, date inference, and custom root interface naming for your specific needs.',
      },
      {
        title: 'Generate and export TypeScript',
        description:
          'Review the generated interfaces with syntax highlighting, copy to clipboard, or download as .ts/.d.ts files. Export includes proper interface dependencies and ordering.',
      },
      {
        title: 'Optional schema generation',
        description:
          'Generate accompanying Zod schemas, JSON Schema, or validation functions for runtime type checking and API validation.',
      },
    ],
    features: [
      'Smart type inference with union type detection',
      'Nested interface extraction and dependency resolution',
      'Date, UUID, email, and URL pattern recognition',
      'Optional property handling for null/undefined values',
      'Enum detection from repeated string values',
      'Circular reference detection and handling',
      'Multiple naming convention support',
      'Readonly and immutable property options',
      'Zod schema and JSON Schema generation',
      'Export as TypeScript declarations or implementation files',
      'Syntax highlighting with error detection',
      'Batch processing for multiple JSON files',
    ],
    useCases: [
      'Generate types for REST API responses and requests',
      'Convert configuration objects to typed interfaces',
      'Create TypeScript definitions for external JSON data',
      'Generate types for database query results',
      'Convert GraphQL response shapes to TypeScript',
      'Create interface definitions for form schemas',
      'Generate types for JSON-based configuration files',
      'Convert OpenAPI specification examples to types',
      'Create mock data generators with proper typing',
      'Generate validation schemas for runtime type checking',
    ],
    proTips: [
      'Use PascalCase naming for interface names following TypeScript conventions',
      'Enable readonly properties for immutable data structures like API responses',
      'Extract nested interfaces separately for better code organization and reusability',
      'Use union types detection for APIs that return different response formats',
      'Enable date inference for ISO 8601 timestamp strings in API responses',
      'Generate Zod schemas alongside interfaces for runtime validation',
      'Use strict optional handling for APIs with consistent null handling',
      'Enable enum detection for string values that represent constants',
    ],
    troubleshooting: [
      'Invalid JSON? Check for trailing commas, unquoted keys, or syntax errors',
      'Missing types? Ensure all required properties are represented in sample JSON',
      'Wrong type inference? Provide more comprehensive JSON examples with edge cases',
      'Circular references? Enable reference handling or simplify nested structures',
      'Performance issues? Process large JSON files in smaller chunks',
      'Type conflicts? Check for inconsistent property types across nested objects',
      'Export issues? Verify generated TypeScript compiles without errors',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+Enter', description: 'Generate TypeScript interfaces' },
      { keys: 'Ctrl+C', description: 'Copy generated TypeScript code' },
      { keys: 'Ctrl+S', description: 'Download as TypeScript file' },
      { keys: 'Ctrl+Shift+F', description: 'Format and validate JSON input' },
      { keys: 'Ctrl+R', description: 'Reset to default settings' },
    ],
  },

  'css-minifier': {
    id: 'css-minifier',
    title: 'How to use CSS Minifier/Beautifier',
    steps: [
      {
        title: 'Paste or upload your CSS code',
        description:
          'Enter CSS directly in the editor with syntax highlighting, upload CSS files (up to 10MB), or drag and drop files into the editor. Supports CSS3, CSS4, and modern CSS features including grid, flexbox, custom properties, and container queries.',
      },
      {
        title: 'Choose between minify or beautify mode',
        description:
          'Toggle instantly between minification for production (removes unnecessary characters) and beautification for development (adds proper formatting). Each mode has customizable options for fine-tuning the output.',
      },
      {
        title: 'Configure optimization settings',
        description:
          'For minification: enable color optimization, unit simplification, rule merging, and vendor prefix handling. For beautification: set indentation type/size, line breaks, bracket positioning, and alignment preferences.',
      },
      {
        title: 'Review statistics and warnings',
        description:
          'Check compression ratio, size reduction percentage, and processing metrics. Review warnings for deprecated properties, invalid selectors, or potential compatibility issues. See detailed breakdown of optimizations applied.',
      },
      {
        title: 'Export optimized CSS',
        description:
          'Copy to clipboard with one click, download as .css or .min.css file, or generate shareable links. View side-by-side comparison of original vs optimized CSS. Save presets for consistent processing across projects.',
      },
    ],
    features: [
      'Advanced CSS minification with 60%+ compression rates',
      'Intelligent beautification with customizable formatting rules',
      'Color optimization (hex shortening, rgb to named colors)',
      'Unit optimization (0px to 0, decimal simplification)',
      'Duplicate rule removal and adjacent rule merging',
      'Vendor prefix management (add needed, remove obsolete)',
      'Media query consolidation and optimization',
      'Keyframe animation optimization',
      'CSS variable preservation and optimization',
      'Syntax validation with error line highlighting',
      'Real-time preview with live updates',
      'Support for SASS/SCSS syntax (basic)',
      'Large file processing with Web Workers',
      'Import from URL or multiple files',
      'Export with source maps for debugging',
    ],
    useCases: [
      'Optimize production stylesheets for faster page loads',
      'Format minified CSS for debugging and editing',
      'Reduce CSS bundle size for web applications',
      'Clean up legacy CSS with redundant rules',
      'Prepare CSS for CDN deployment',
      'Merge multiple CSS files with deduplication',
      'Convert development CSS to production-ready format',
      'Analyze CSS for optimization opportunities',
      'Standardize CSS formatting across team projects',
      'Validate CSS syntax before deployment',
      'Optimize CSS for email templates',
      'Process CSS for AMP pages with strict size limits',
    ],
    proTips: [
      'Use aggressive minification for production, keeping license comments with /*!',
      'Enable gzip size preview to see actual transfer size after compression',
      'Preserve custom properties (CSS variables) when minifying modern CSS',
      'Use media query merging to reduce redundant @media declarations',
      'Keep source maps in development for easier debugging of minified CSS',
      'Test minified CSS in target browsers before production deployment',
      'Use beautify mode with consistent settings for team collaboration',
      'Enable vendor prefix removal only if you use autoprefixer in build process',
    ],
    troubleshooting: [
      'CSS breaking after minification? Check preserve important comments option',
      'Colors changing unexpectedly? Disable aggressive color optimization',
      'Calc() expressions broken? Ensure whitespace preservation in calc values',
      'Custom properties not working? Enable CSS variable preservation',
      'Large file processing slow? Enable Web Worker mode for files over 500KB',
      'Vendor prefixes missing? Configure target browser list in settings',
      'Formatting inconsistent? Check indentation and line ending settings',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+Enter', description: 'Process CSS (minify/beautify)' },
      { keys: 'Ctrl+M', description: 'Toggle minify mode' },
      { keys: 'Ctrl+B', description: 'Toggle beautify mode' },
      { keys: 'Ctrl+C', description: 'Copy result to clipboard' },
      { keys: 'Ctrl+S', description: 'Download processed CSS' },
      { keys: 'Ctrl+Shift+C', description: 'Compare original vs result' },
      { keys: 'Ctrl+Z', description: 'Undo last change' },
      { keys: 'F2', description: 'Jump to next CSS error' },
    ],
  },

  'js-minifier': {
    id: 'js-minifier',
    title: 'How to use JavaScript Minifier/Beautifier',
    steps: [
      {
        title: 'Paste or upload your JavaScript code',
        description:
          'Enter JavaScript code directly with ES2024+ syntax support, upload .js/.ts/.mjs files (up to 15MB), or drag and drop files. Supports modern JavaScript features including classes, arrow functions, destructuring, async/await, modules, decorators, and private fields.',
      },
      {
        title: 'Select processing mode and compression level',
        description:
          'Choose between minification (removes unnecessary characters) and beautification (adds proper formatting). For minification, select compression levels from Basic (safe) to Aggressive (maximum compression with advanced optimizations).',
      },
      {
        title: 'Configure optimization options',
        description:
          'Enable advanced features: variable renaming (mangle), dead code elimination, function inlining, property mangling, string compression, numeric optimization, control flow flattening, and tree shaking simulation for bundle size reduction.',
      },
      {
        title: 'Set source map and debugging options',
        description:
          'Generate source maps for debugging minified code, preserve function names for stack traces, maintain original line numbers in comments, and configure development vs production build settings.',
      },
      {
        title: 'Process and export optimized JavaScript',
        description:
          'Review compression statistics showing size reduction, processing time, and applied optimizations. Download as .min.js with optional source maps, copy to clipboard, or export as modules with ES6/CommonJS compatibility.',
      },
    ],
    features: [
      'Advanced JavaScript minification with 70%+ compression rates',
      'ES2024+ syntax support including modern features and proposals',
      'Intelligent code beautification with customizable formatting',
      'Variable and property name mangling for maximum compression',
      'Dead code elimination and unreachable code removal',
      'Function inlining and call optimization',
      'String and numeric literal optimization',
      'Control flow flattening and code obfuscation',
      'Source map generation for debugging support',
      'Tree shaking simulation for bundle analysis',
      'Syntax validation with detailed error reporting',
      'Large file processing with Web Workers',
      'TypeScript support with type stripping',
      'Module format preservation (ES6, CommonJS, UMD)',
      'License comment preservation options',
    ],
    useCases: [
      'Optimize production JavaScript bundles for faster loading',
      'Format minified JavaScript for debugging and code review',
      'Reduce bundle size for mobile and low-bandwidth applications',
      'Obfuscate code for intellectual property protection',
      'Prepare JavaScript libraries for CDN distribution',
      'Optimize third-party dependencies before bundling',
      'Analyze bundle composition and identify optimization opportunities',
      'Convert development code to production-ready format',
      'Standardize JavaScript formatting across development teams',
      'Validate JavaScript syntax before deployment',
      'Process legacy code for modern build pipelines',
      'Optimize JavaScript for email templates and embedded contexts',
    ],
    proTips: [
      'Use aggressive minification only after thorough testing - it can break dynamic code',
      'Enable source maps in development for easier debugging of minified code',
      'Preserve license comments with /*! to maintain attribution in production',
      'Use variable mangling carefully with libraries that rely on function/property names',
      'Test minified code in target browsers, especially for advanced ES6+ features',
      'Combine with gzip compression for maximum size reduction (check preview)',
      'Use tree shaking simulation to identify unused code before bundling',
      'Keep original formatting for development builds, minify only for production',
    ],
    troubleshooting: [
      'Code breaking after minification? Disable advanced optimizations like mangling',
      'Dynamic property access failing? Exclude specific property names from mangling',
      'eval() or Function() constructor issues? Use basic minification level',
      'Source maps not working? Ensure proper file paths and hosting configuration',
      'Large files processing slowly? Enable Web Worker mode for files over 1MB',
      'TypeScript errors? Use TypeScript-specific processing mode',
      'Module imports broken? Check module format preservation settings',
      'Stack traces unclear? Enable function name preservation in production',
    ],
    keyboardShortcuts: [
      {
        keys: 'Ctrl+Enter',
        description: 'Process JavaScript (minify/beautify)',
      },
      { keys: 'Ctrl+M', description: 'Toggle minify mode' },
      { keys: 'Ctrl+B', description: 'Toggle beautify mode' },
      { keys: 'Ctrl+C', description: 'Copy result to clipboard' },
      { keys: 'Ctrl+S', description: 'Download processed JavaScript' },
      { keys: 'Ctrl+Shift+S', description: 'Download with source map' },
      { keys: 'Ctrl+Shift+C', description: 'Compare original vs result' },
      { keys: 'Ctrl+O', description: 'Toggle advanced optimizations' },
      { keys: 'F2', description: 'Jump to next JavaScript error' },
    ],
  },

  'unix-timestamp-converter': {
    id: 'unix-timestamp-converter',
    title: 'How to use Unix Timestamp Converter',
    steps: [
      {
        title: 'Enter timestamp or date',
        description:
          'Paste a Unix timestamp (seconds or milliseconds) or a human-readable date string. The tool automatically detects the input format and suggests the appropriate conversion method.',
      },
      {
        title: 'Select timezone and options',
        description:
          'Choose your desired timezone from the dropdown (defaults to UTC) and select output format preferences. Enable batch processing for multiple timestamps or relative time calculations.',
      },
      {
        title: 'Choose output format',
        description:
          'Select from multiple date formats including ISO 8601, RFC 2822, human-readable, SQL format, or create a custom format pattern using date-fns format strings.',
      },
      {
        title: 'Review conversion results',
        description:
          'View the converted results with multiple format options, timezone information, relative time calculations, and code examples in popular programming languages.',
      },
      {
        title: 'Copy or export results',
        description:
          'Copy individual results to clipboard, download batch results as CSV/JSON, or copy ready-to-use code snippets for your preferred programming language.',
      },
    ],
    features: [
      'Bidirectional conversion (timestamp ⟷ date)',
      'Automatic input format detection',
      'Timezone support with IANA database',
      'Batch processing for multiple timestamps',
      'Custom date format patterns',
      'Relative time calculations',
      'Code generation for 8+ languages',
      'Multiple output formats (ISO, RFC, SQL, etc.)',
      'Real-time validation and error handling',
      'Timezone offset display',
      'Current timestamp generation',
      'Copy and export functionality',
    ],
    useCases: [
      'Convert database timestamps for API responses',
      'Debug log files with Unix timestamps',
      'Analyze server logs and performance metrics',
      'Convert timestamps for data visualization',
      'Process CSV files with timestamp columns',
      'Validate API timestamp responses',
      'Convert timestamps for different timezone displays',
      'Generate code for timestamp handling in applications',
      'Batch process large datasets with timestamps',
      'Compare timestamps across different systems',
      'Convert cron job execution times',
      'Process event logs for system monitoring',
    ],
    proTips: [
      'Use batch mode to process CSV files with timestamp columns',
      'Enable relative time to see time differences from current moment',
      'Copy code examples to implement timestamp conversion in your app',
      'Use custom format patterns for specific date formatting requirements',
      'Select appropriate timezone when working with global applications',
      'Generate current timestamp for testing and development',
    ],
    troubleshooting: [
      'Invalid timestamp? Check if value is within valid Unix timestamp range',
      'Wrong timezone? Verify timezone name matches IANA timezone database',
      'Unexpected date? Confirm if timestamp is in seconds or milliseconds',
      'Batch processing errors? Ensure each line contains only one timestamp/date',
      'Custom format not working? Check date-fns format pattern documentation',
      'Code examples not accurate? Verify input timestamp and timezone settings',
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+Enter', description: 'Convert timestamp/date' },
      { keys: 'Ctrl+C', description: 'Copy primary result' },
      { keys: 'Ctrl+T', description: 'Insert current timestamp' },
      { keys: 'Ctrl+R', description: 'Reset all fields' },
      { keys: 'Ctrl+B', description: 'Toggle batch mode' },
    ],
  },

  'yaml-json-converter': {
    id: 'yaml-json-converter',
    title: 'How to use YAML to JSON Converter',
    steps: [
      {
        title: 'Paste or upload your data',
        description:
          'Enter YAML or JSON in the input editor, or drag and drop files (.yaml, .yml, .json). The tool automatically detects the input format and shows the appropriate conversion direction.',
      },
      {
        title: 'Select conversion direction',
        description:
          'Choose YAML to JSON or JSON to YAML using the direction toggle. The tool auto-detects format by default, but you can manually override if needed for ambiguous inputs.',
      },
      {
        title: 'Configure conversion options',
        description:
          'Adjust settings like date format (ISO/Unix), indentation (2/4 spaces), key sorting (alphabetical/original), and special value handling (NaN, Infinity, null representations).',
      },
      {
        title: 'Handle advanced YAML features',
        description:
          'The converter processes anchors/aliases, merge keys, multi-document files, custom tags, and preserves comments (optional). Configure reference expansion and document splitting preferences.',
      },
      {
        title: 'Review and export results',
        description:
          'Check validation errors with line numbers, view conversion warnings for data loss, and export as .json/.yaml/.yml files. Generate TypeScript interfaces or JSON Schema from your data.',
      },
    ],
    features: [
      'Bidirectional conversion between YAML and JSON formats',
      'Auto-detection of input format with manual override option',
      'Multi-document YAML support with --- separator',
      'Anchors and aliases resolution (&anchor, *alias)',
      'Merge key support (<<: *defaults) for YAML inheritance',
      'Custom tag handling (!!binary, !!timestamp, etc.)',
      'Comment preservation option for round-trip conversion',
      'Date/timestamp conversion (ISO 8601, Unix, string)',
      'Special number handling (hex, octal, Infinity, NaN)',
      'Multiline string preservation (|, >, |-, >+)',
      'TypeScript interface generation from JSON output',
      'JSON Schema generation for validation',
      'Real-time syntax validation with error highlighting',
      'Key ordering control (alphabetical, original, none)',
    ],
    useCases: [
      'Convert Kubernetes manifests to JSON for API processing',
      'Transform Docker Compose files for container orchestration',
      'Process CI/CD pipeline configs (GitHub Actions, GitLab CI)',
      'Convert Swagger/OpenAPI specifications between formats',
      'Transform Ansible playbooks and inventories',
      'Process Serverless Framework configurations',
      'Convert Helm chart values for Kubernetes deployments',
      'Transform AWS CloudFormation templates',
      'Process configuration files for various tools and frameworks',
      'Debug and validate YAML syntax errors',
    ],
    proTips: [
      'Use multi-document support to convert multiple YAML files in one operation',
      'Enable anchor expansion when converting YAML with complex references to JSON',
      'Preserve comments by enabling comment mode for documentation-heavy files',
      'Use TypeScript generation to create type-safe interfaces from API responses',
      'Configure date format based on your target system requirements',
      'Enable key sorting for consistent JSON output across conversions',
    ],
    troubleshooting: [
      'Invalid YAML? Check indentation (must use spaces, not tabs), and ensure proper colon spacing',
      'Anchors not working? Verify anchor names are unique and references use correct syntax',
      'Data loss warnings? Some YAML features like tags and comments cannot be preserved in JSON',
      'Large file issues? Files over 10MB may require longer processing time',
      'Multiline strings corrupted? Check that block scalar indicators (|, >) are properly formatted',
      "JSON to YAML failing? Ensure JSON is valid and doesn't contain circular references",
    ],
    keyboardShortcuts: [
      { keys: 'Ctrl+Enter', description: 'Convert data' },
      { keys: 'Ctrl+Shift+S', description: 'Swap input/output' },
      { keys: 'Ctrl+C', description: 'Copy output to clipboard' },
      { keys: 'Ctrl+D', description: 'Download converted file' },
      { keys: 'Ctrl+K', description: 'Clear all editors' },
    ],
  },
};
