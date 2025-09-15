export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  categories: string[]; // Array of category IDs from categories: Category[]
  keywords: string[];
  isPopular?: boolean;
  isNew?: boolean;
  searchVolume: number;
  label?: 'popular' | 'new' | 'coming-soon' | 'test' | ''; // Tool label for badges
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  tools: Tool[];
}

// Tool data
export const tools: Tool[] = [
  // Data & Conversion Tools
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description:
      'Format, validate and beautify JSON data with syntax highlighting',
    icon: '📋',
    route: '/tools/json-formatter',
    categories: ['data', 'formatters'],
    keywords: ['json', 'format', 'validate', 'prettify', 'parse'],
    isPopular: true,
    searchVolume: 8500,
    label: '',
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    description: 'Convert CSV files to JSON format with customizable options',
    icon: '🔄',
    route: '/tools/csv-to-json',
    categories: ['data'],
    keywords: [
      'csv',
      'json',
      'convert',
      'data',
      'transform',
      'spreadsheet',
      'excel',
    ],
    isPopular: true,
    searchVolume: 7200,
    label: 'new',
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries with proper indentation',
    icon: '🗃️',
    route: '/tools/sql-formatter',
    categories: ['formatters', 'data', 'text'],
    keywords: ['sql', 'format', 'database', 'query', 'beautify'],
    searchVolume: 6800,
    label: 'new',
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description:
      'Format, validate, and minify XML documents with syntax highlighting and XPath support',
    icon: '📄',
    route: '/tools/xml-formatter',
    categories: ['formatters', 'data'],
    keywords: [
      'xml',
      'formatter',
      'beautify',
      'minify',
      'validate',
      'parser',
      'xpath',
      'namespace',
      'schema',
      'soap',
      'rss',
      'svg',
      'markup',
      'xsd',
      'dtd',
    ],
    isPopular: true,
    searchVolume: 8900,
    label: 'new',
  },

  // Encoding & Security Tools
  {
    id: 'base64-encode',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings with file support',
    icon: '🔐',
    route: '/tools/base64-encode',
    categories: ['encoding'],
    keywords: ['base64', 'encode', 'decode', 'encryption', 'security'],
    isPopular: true,
    searchVolume: 9200,
    label: '',
  },
  {
    id: 'url-encode',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URL components and query parameters',
    icon: '🔗',
    route: '/tools/url-encode',
    categories: ['encoding'],
    keywords: ['url', 'encode', 'decode', 'percent', 'uri'],
    isPopular: true,
    searchVolume: 7800,
    label: 'new',
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256 and other hash functions',
    icon: '#️⃣',
    route: '/tools/hash-generator',
    categories: ['encoding'],
    keywords: ['hash', 'md5', 'sha1', 'sha256', 'checksum'],
    isPopular: true,
    searchVolume: 6500,
    label: '',
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and validate JSON Web Tokens (JWT)',
    icon: '🎫',
    route: '/tools/jwt-decoder',
    categories: ['encoding'],
    keywords: ['jwt', 'json', 'web', 'token', 'decode'],
    isNew: true,
    searchVolume: 5800,
    label: 'new',
  },
  {
    id: 'base64-to-pdf',
    name: 'Base64 to PDF',
    description: 'Convert Base64 encoded data to PDF files and download them',
    icon: '📄',
    route: '/tools/base64-to-pdf',
    categories: ['data'],
    keywords: ['base64', 'pdf', 'convert', 'download', 'decode', 'file'],
    searchVolume: 3200,
    label: '',
  },

  // Text & Format Tools
  {
    id: 'text-diff',
    name: 'Text Diff Checker',
    description:
      'Compare files and code with advanced diff features and syntax highlighting',
    icon: '📝',
    route: '/tools/text-diff',
    categories: ['text', 'dev'],
    keywords: [
      'diff',
      'compare',
      'text',
      'difference',
      'merge',
      'patch',
      'git',
      'code',
      'file',
    ],
    searchVolume: 5200,
    label: 'new',
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Preview and convert Markdown to HTML in real-time',
    icon: '📖',
    route: '/tools/markdown-preview',
    categories: ['text'],
    keywords: ['markdown', 'preview', 'html', 'convert', 'format'],
    searchVolume: 4800,
    label: 'coming-soon',
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions with live matching',
    icon: '🔍',
    route: '/tools/regex-tester',
    categories: ['text'],
    keywords: ['regex', 'regexp', 'pattern', 'test', 'match'],
    isPopular: true,
    searchVolume: 7500,
    label: '',
  },

  // Generators
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUID/GUID in various formats (v1, v4, etc.)',
    icon: '🆔',
    route: '/tools/uuid-generator',
    categories: ['generators'],
    keywords: ['uuid', 'guid', 'generate', 'unique', 'identifier'],
    isPopular: true,
    searchVolume: 8200,
    label: '',
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure passwords with customizable options',
    icon: '🔑',
    route: '/tools/password-generator',
    categories: ['generators'],
    keywords: ['password', 'generate', 'secure', 'random', 'strong'],
    isPopular: true,
    searchVolume: 9500,
    label: '',
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description:
      'Generate QR codes with advanced customization, logos, batch processing and developer tools',
    icon: '📱',
    route: '/tools/qr-generator',
    categories: ['generators', 'dev', 'web'],
    keywords: [
      'qr',
      'code',
      'generate',
      'barcode',
      'scan',
      'wifi',
      'vcard',
      'batch',
      'svg',
      'logo',
      'api',
      'developer',
    ],
    isPopular: true,
    searchVolume: 9800,
    label: 'new',
  },

  // Web & Design Tools
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick colors and get HEX, RGB, HSL values',
    icon: '🎨',
    route: '/tools/color-picker',
    categories: ['web'],
    keywords: ['color', 'picker', 'hex', 'rgb', 'hsl'],
    searchVolume: 5800,
    label: 'coming-soon',
  },
  {
    id: 'image-optimizer',
    name: 'Image Optimizer',
    description: 'Compress and optimize images for web use',
    icon: '🖼️',
    route: '/tools/image-optimizer',
    categories: ['web'],
    keywords: ['image', 'optimize', 'compress', 'resize', 'webp'],
    isNew: true,
    searchVolume: 4500,
    label: 'coming-soon',
  },
  {
    id: 'favicon-generator',
    name: 'Favicon Generator',
    description:
      'Generate complete favicon packages with all sizes and formats',
    icon: '🖥️',
    route: '/tools/favicon-generator',
    categories: ['web', 'image'],
    keywords: [
      'favicon',
      'icon',
      'apple-touch-icon',
      'android-chrome',
      'website-icon',
      'ico',
      'png',
    ],
    isNew: true,
    searchVolume: 3200,
    label: '',
  },

  // Dev Utilities
  {
    id: 'api-tester',
    name: 'API Tester',
    description: 'Test REST APIs with custom headers and body',
    icon: '🔧',
    route: '/tools/api-tester',
    categories: ['dev'],
    keywords: ['api', 'rest', 'test', 'http', 'request'],
    searchVolume: 6800,
    label: 'coming-soon',
  },
  {
    id: 'json-validator',
    name: 'JSON Schema Validator',
    description: 'Validate JSON against schema definitions',
    icon: '✅',
    route: '/tools/json-validator',
    categories: ['dev'],
    keywords: ['json', 'schema', 'validate', 'check', 'format'],
    searchVolume: 4200,
    label: 'coming-soon',
  },
  {
    id: 'crontab-builder',
    name: 'Crontab Expression Builder',
    description:
      'Parse, build, and validate cron expressions with visual builder, presets, and next execution times',
    icon: '⏰',
    route: '/tools/crontab-builder',
    categories: ['dev'],
    keywords: [
      'crontab',
      'cron',
      'scheduler',
      'unix',
      'linux',
      'automation',
      'parser',
      'builder',
      'expression',
    ],
    isPopular: true,
    searchVolume: 5500,
    label: '',
  },
];

// Group tools by category
export const categories: Category[] = [
  {
    id: 'data',
    name: 'Data & Conversion',
    description:
      'Transform and format data between different formats like JSON, CSV, XML, and SQL.',
    icon: '📊',
    tools: getToolsByCategory('data'),
  },
  {
    id: 'encoding',
    name: 'Encoding & Security',
    description:
      'Encode, decode, hash, and secure your data with various encryption methods.',
    icon: '🔐',
    tools: getToolsByCategory('encoding'),
  },
  {
    id: 'text',
    name: 'Text & Format',
    description:
      'Process, compare, and format text content with powerful text manipulation tools.',
    icon: '📝',
    tools: getToolsByCategory('text'),
  },
  {
    id: 'generators',
    name: 'Generators',
    description:
      'Generate UUIDs, passwords, QR codes, and other useful content for development.',
    icon: '⚡',
    tools: getToolsByCategory('generators'),
  },
  {
    id: 'web',
    name: 'Web & Design',
    description:
      'Tools for web developers and designers including color pickers and image optimization.',
    icon: '🎨',
    tools: getToolsByCategory('web'),
  },
  {
    id: 'dev',
    name: 'Dev Utilities',
    description:
      'Development utilities for testing APIs, validating schemas, and debugging code.',
    icon: '🔧',
    tools: getToolsByCategory('dev'),
  },
  {
    id: 'formatters',
    name: 'Formatters',
    description:
      'Format and beautify code, SQL, JSON, XML and other structured data.',
    icon: '🪄',
    tools: getToolsByCategory('formatters'),
  },
];

// Helper functions
export function getPopularTools(): Tool[] {
  return tools
    .filter((tool) => tool.isPopular)
    .sort((a, b) => b.searchVolume - a.searchVolume)
    .map((tool) => ({
      ...tool,
      keywords: tool.keywords || [], // Ensure keywords is always an array
    }));
}

export function searchTools(query: string): Tool[] {
  const searchTerm = query.toLowerCase();
  return tools
    .filter(
      (tool) =>
        tool.label !== 'coming-soon' &&
        (tool.name.toLowerCase().includes(searchTerm) ||
          tool.description.toLowerCase().includes(searchTerm) ||
          tool.keywords.some((keyword) =>
            keyword.toLowerCase().includes(searchTerm)
          ))
    )
    .sort((a, b) => b.searchVolume - a.searchVolume);
}

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter((tool) => {
    return tool.categories.includes(categoryId);
  });
}

export function getToolById(id: string): Tool | undefined {
  return tools.find((tool) => tool.id === id);
}

export function getCategoryColorClass(categoryColor: string): string {
  const colorClasses = {
    data: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
    encoding: 'border-green-500 bg-green-50 dark:bg-green-950',
    text: 'border-purple-500 bg-purple-50 dark:bg-purple-950',
    generators: 'border-orange-500 bg-orange-50 dark:bg-orange-950',
    web: 'border-pink-500 bg-pink-50 dark:bg-pink-950',
    dev: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950',
    formatters: 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950',
  };
  return (
    colorClasses[categoryColor as keyof typeof colorClasses] ||
    'border-blue-500 bg-blue-50 dark:bg-blue-950'
  );
}

export function getCategoryByTool(tool: Tool): Category | undefined {
  return categories.find((category) =>
    category.tools.some((t) => t.id === tool.id)
  );
}

export function getAllTools(): Tool[] {
  return tools;
}
