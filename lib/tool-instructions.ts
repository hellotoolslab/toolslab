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
};
