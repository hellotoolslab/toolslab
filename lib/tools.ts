export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: string;
  route: string;
  category: string;
  categoryColor: string;
  keywords: string[];
  isPopular?: boolean;
  isNew?: boolean;
  searchVolume: number;
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
    description: 'Format, validate and beautify JSON data with syntax highlighting',
    icon: '📋',
    route: '/tools/json-formatter',
    category: 'Data & Conversion',
    categoryColor: 'data',
    keywords: ['json', 'format', 'validate', 'prettify', 'parse'],
    isPopular: true,
    searchVolume: 8500
  },
  {
    id: 'csv-to-json',
    name: 'CSV to JSON',
    description: 'Convert CSV files to JSON format with customizable options',
    icon: '🔄',
    route: '/tools/csv-to-json',
    category: 'Data & Conversion',
    categoryColor: 'data',
    keywords: ['csv', 'json', 'convert', 'data', 'transform'],
    isPopular: true,
    searchVolume: 7200
  },
  {
    id: 'sql-formatter',
    name: 'SQL Formatter',
    description: 'Format and beautify SQL queries with proper indentation',
    icon: '🗃️',
    route: '/tools/sql-formatter',
    category: 'Data & Conversion',
    categoryColor: 'data',
    keywords: ['sql', 'format', 'database', 'query', 'beautify'],
    searchVolume: 6800
  },
  {
    id: 'xml-formatter',
    name: 'XML Formatter',
    description: 'Format and validate XML documents with syntax highlighting',
    icon: '📄',
    route: '/tools/xml-formatter',
    category: 'Data & Conversion',
    categoryColor: 'data',
    keywords: ['xml', 'format', 'validate', 'markup', 'document'],
    searchVolume: 5500
  },

  // Encoding & Security Tools
  {
    id: 'base64-encode',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings with file support',
    icon: '🔐',
    route: '/tools/base64',
    category: 'Encoding & Security',
    categoryColor: 'encoding',
    keywords: ['base64', 'encode', 'decode', 'encryption', 'security'],
    isPopular: true,
    searchVolume: 9200
  },
  {
    id: 'url-encode',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URL components and query parameters',
    icon: '🔗',
    route: '/tools/url-encode',
    category: 'Encoding & Security',
    categoryColor: 'encoding',
    keywords: ['url', 'encode', 'decode', 'percent', 'uri'],
    isPopular: true,
    searchVolume: 7800
  },
  {
    id: 'hash-generator',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256 and other hash functions',
    icon: '#️⃣',
    route: '/tools/hash-generator',
    category: 'Encoding & Security',
    categoryColor: 'encoding',
    keywords: ['hash', 'md5', 'sha1', 'sha256', 'checksum'],
    isPopular: true,
    searchVolume: 6500
  },
  {
    id: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and validate JSON Web Tokens (JWT)',
    icon: '🎫',
    route: '/tools/jwt-decoder',
    category: 'Encoding & Security',
    categoryColor: 'encoding',
    keywords: ['jwt', 'json', 'web', 'token', 'decode'],
    isNew: true,
    searchVolume: 5800
  },

  // Text & Format Tools
  {
    id: 'text-diff',
    name: 'Text Diff Checker',
    description: 'Compare two texts and highlight differences',
    icon: '📝',
    route: '/tools/text-diff',
    category: 'Text & Format',
    categoryColor: 'text',
    keywords: ['diff', 'compare', 'text', 'difference', 'merge'],
    searchVolume: 5200
  },
  {
    id: 'markdown-preview',
    name: 'Markdown Preview',
    description: 'Preview and convert Markdown to HTML in real-time',
    icon: '📖',
    route: '/tools/markdown-preview',
    category: 'Text & Format',
    categoryColor: 'text',
    keywords: ['markdown', 'preview', 'html', 'convert', 'format'],
    searchVolume: 4800
  },
  {
    id: 'regex-tester',
    name: 'Regex Tester',
    description: 'Test and debug regular expressions with live matching',
    icon: '🔍',
    route: '/tools/regex-tester',
    category: 'Text & Format',
    categoryColor: 'text',
    keywords: ['regex', 'regexp', 'pattern', 'test', 'match'],
    isPopular: true,
    searchVolume: 7500
  },

  // Generators
  {
    id: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUID/GUID in various formats (v1, v4, etc.)',
    icon: '🆔',
    route: '/tools/uuid-generator',
    category: 'Generators',
    categoryColor: 'generators',
    keywords: ['uuid', 'guid', 'generate', 'unique', 'identifier'],
    isPopular: true,
    searchVolume: 8200
  },
  {
    id: 'password-generator',
    name: 'Password Generator',
    description: 'Generate secure passwords with customizable options',
    icon: '🔑',
    route: '/tools/password-generator',
    category: 'Generators',
    categoryColor: 'generators',
    keywords: ['password', 'generate', 'secure', 'random', 'strong'],
    isPopular: true,
    searchVolume: 9500
  },
  {
    id: 'qr-generator',
    name: 'QR Code Generator',
    description: 'Generate QR codes for text, URLs, and other data',
    icon: '📱',
    route: '/tools/qr-generator',
    category: 'Generators',
    categoryColor: 'generators',
    keywords: ['qr', 'code', 'generate', 'barcode', 'scan'],
    searchVolume: 6200
  },

  // Web & Design Tools  
  {
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick colors and get HEX, RGB, HSL values',
    icon: '🎨',
    route: '/tools/color-picker',
    category: 'Web & Design',
    categoryColor: 'web',
    keywords: ['color', 'picker', 'hex', 'rgb', 'hsl'],
    searchVolume: 5800
  },
  {
    id: 'image-optimizer',
    name: 'Image Optimizer',
    description: 'Compress and optimize images for web use',
    icon: '🖼️',
    route: '/tools/image-optimizer',
    category: 'Web & Design',
    categoryColor: 'web',
    keywords: ['image', 'optimize', 'compress', 'resize', 'webp'],
    isNew: true,
    searchVolume: 4500
  },

  // Dev Utilities
  {
    id: 'api-tester',
    name: 'API Tester',
    description: 'Test REST APIs with custom headers and body',
    icon: '🔧',
    route: '/tools/api-tester',
    category: 'Dev Utilities',
    categoryColor: 'dev',
    keywords: ['api', 'rest', 'test', 'http', 'request'],
    searchVolume: 6800
  },
  {
    id: 'json-validator',
    name: 'JSON Schema Validator',
    description: 'Validate JSON against schema definitions',
    icon: '✅',
    route: '/tools/json-validator',
    category: 'Dev Utilities',
    categoryColor: 'dev',
    keywords: ['json', 'schema', 'validate', 'check', 'format'],
    searchVolume: 4200
  }
];

// Group tools by category
export const categories: Category[] = [
  {
    id: 'data',
    name: 'Data & Conversion',
    description: 'Transform and format data between different formats like JSON, CSV, XML, and SQL.',
    icon: '📊',
    tools: tools.filter(tool => tool.categoryColor === 'data')
  },
  {
    id: 'encoding',
    name: 'Encoding & Security',
    description: 'Encode, decode, hash, and secure your data with various encryption methods.',
    icon: '🔐',
    tools: tools.filter(tool => tool.categoryColor === 'encoding')
  },
  {
    id: 'text',
    name: 'Text & Format',
    description: 'Process, compare, and format text content with powerful text manipulation tools.',
    icon: '📝',
    tools: tools.filter(tool => tool.categoryColor === 'text')
  },
  {
    id: 'generators',
    name: 'Generators',
    description: 'Generate UUIDs, passwords, QR codes, and other useful content for development.',
    icon: '⚡',
    tools: tools.filter(tool => tool.categoryColor === 'generators')
  },
  {
    id: 'web',
    name: 'Web & Design',
    description: 'Tools for web developers and designers including color pickers and image optimization.',
    icon: '🎨',
    tools: tools.filter(tool => tool.categoryColor === 'web')
  },
  {
    id: 'dev',
    name: 'Dev Utilities',
    description: 'Development utilities for testing APIs, validating schemas, and debugging code.',
    icon: '🔧',
    tools: tools.filter(tool => tool.categoryColor === 'dev')
  }
];

// Helper functions
export function getPopularTools(): Tool[] {
  return tools.filter(tool => tool.isPopular).sort((a, b) => b.searchVolume - a.searchVolume);
}

export function searchTools(query: string): Tool[] {
  const searchTerm = query.toLowerCase();
  return tools.filter(tool => 
    tool.name.toLowerCase().includes(searchTerm) ||
    tool.description.toLowerCase().includes(searchTerm) ||
    tool.keywords.some(keyword => keyword.toLowerCase().includes(searchTerm))
  ).sort((a, b) => b.searchVolume - a.searchVolume);
}

export function getToolsByCategory(categoryId: string): Tool[] {
  return tools.filter(tool => tool.categoryColor === categoryId);
}

export function getToolById(id: string): Tool | undefined {
  return tools.find(tool => tool.id === id);
}

export function getCategoryColorClass(categoryColor: string): string {
  const colorClasses = {
    data: 'border-blue-500 bg-blue-50 dark:bg-blue-950',
    encoding: 'border-green-500 bg-green-50 dark:bg-green-950',
    text: 'border-purple-500 bg-purple-50 dark:bg-purple-950',
    generators: 'border-orange-500 bg-orange-50 dark:bg-orange-950',
    web: 'border-pink-500 bg-pink-50 dark:bg-pink-950',
    dev: 'border-yellow-500 bg-yellow-50 dark:bg-yellow-950'
  };
  return colorClasses[categoryColor as keyof typeof colorClasses] || 'border-blue-500 bg-blue-50 dark:bg-blue-950';
}

export function getCategoryByTool(tool: Tool): Category | undefined {
  return categories.find(category => category.tools.some(t => t.id === tool.id));
}