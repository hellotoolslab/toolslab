export interface Tool {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  keywords: string[];
  searchVolume: number;
  category: 'data' | 'encoding' | 'text' | 'generators' | 'web' | 'dev';
  categoryColor: string;
  isNew?: boolean;
  label?: 'popular' | 'new' | 'coming-soon' | 'test' | '';
}

export interface ToolCategory {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  tools: Tool[];
}

export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description:
      'Format, validate, and beautify JSON data with syntax highlighting',
    route: '/tools/json-formatter',
    icon: '{}',
    keywords: ['json', 'format', 'beautify', 'validate', 'pretty'],
    searchVolume: 1000,
    category: 'data',
    categoryColor: 'data',
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description:
      'Encode and decode Base64 strings with support for text and files',
    route: '/tools/base64',
    icon: '🔐',
    keywords: ['base64', 'encode', 'decode', 'conversion'],
    searchVolume: 800,
    category: 'encoding',
    categoryColor: 'encoding',
  },
  {
    id: 'url-encode',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs and URI components safely',
    route: '/tools/url-encode',
    icon: '🔗',
    keywords: ['url', 'encode', 'decode', 'uri', 'percent'],
    searchVolume: 700,
    category: 'encoding',
    categoryColor: 'encoding',
  },
  {
    id: 'jwt',
    name: 'JWT Decoder',
    description:
      'Decode and inspect JSON Web Tokens (JWT) headers and payloads',
    route: '/tools/jwt',
    icon: '🎫',
    keywords: ['jwt', 'token', 'decode', 'json', 'web'],
    searchVolume: 600,
    category: 'encoding',
    categoryColor: 'encoding',
  },
  {
    id: 'uuid',
    name: 'UUID Generator',
    description: 'Generate various types of UUIDs (v1, v4, v5) and GUIDs',
    route: '/tools/uuid',
    icon: '🆔',
    keywords: ['uuid', 'guid', 'generate', 'unique', 'identifier'],
    searchVolume: 500,
    category: 'generators',
    categoryColor: 'generators',
  },
  {
    id: 'hash',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256, and other hash values',
    route: '/tools/hash',
    icon: '#️⃣',
    keywords: ['hash', 'md5', 'sha1', 'sha256', 'checksum'],
    searchVolume: 400,
    category: 'encoding',
    categoryColor: 'encoding',
  },
  {
    id: 'timestamp',
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates',
    route: '/tools/timestamp',
    icon: '⏰',
    keywords: ['timestamp', 'unix', 'date', 'time', 'convert'],
    searchVolume: 300,
    category: 'dev',
    categoryColor: 'dev',
  },
];

export const categories: ToolCategory[] = [
  {
    id: 'data',
    name: 'Data & Conversion',
    description: 'JSON, CSV, XML formatting and data transformation tools',
    icon: '📊',
    color: 'data',
    tools: tools.filter((tool) => tool.category === 'data'),
  },
  {
    id: 'encoding',
    name: 'Encoding & Security',
    description: 'Base64, JWT, Hash, and encryption/decryption utilities',
    icon: '🔒',
    color: 'encoding',
    tools: tools.filter((tool) => tool.category === 'encoding'),
  },
  {
    id: 'text',
    name: 'Text & Format',
    description: 'Case converters, text diff, character counters',
    icon: '📝',
    color: 'text',
    tools: tools.filter((tool) => tool.category === 'text'),
  },
  {
    id: 'generators',
    name: 'Generators',
    description: 'UUID, passwords, Lorem Ipsum, and random data generators',
    icon: '⚡',
    color: 'generators',
    tools: tools.filter((tool) => tool.category === 'generators'),
  },
  {
    id: 'web',
    name: 'Web & Design',
    description: 'Color pickers, CSS utilities, meta tag generators',
    icon: '🎨',
    color: 'web',
    tools: tools.filter((tool) => tool.category === 'web'),
  },
  {
    id: 'dev',
    name: 'Dev Utilities',
    description: 'Regex tester, SQL formatter, timestamp converters',
    icon: '🛠️',
    color: 'dev',
    tools: tools.filter((tool) => tool.category === 'dev'),
  },
];

export const getToolById = (id: string): Tool | undefined => {
  return tools.find((tool) => tool.id === id);
};

export const getToolsByCategory = (category: Tool['category']): Tool[] => {
  return tools.filter((tool) => tool.category === category);
};

export const getCategoryById = (id: string): ToolCategory | undefined => {
  return categories.find((category) => category.id === id);
};

export const getCategoryByTool = (tool: Tool): ToolCategory | undefined => {
  return categories.find((category) => category.id === tool.category);
};

export const getPopularTools = (): Tool[] => {
  return tools.filter((tool) => tool.label === 'popular');
};

export const getNewTools = (): Tool[] => {
  return tools.filter((tool) => tool.isNew);
};

export const searchTools = (query: string): Tool[] => {
  const lowercaseQuery = query.toLowerCase();
  return tools.filter(
    (tool) =>
      tool.name.toLowerCase().includes(lowercaseQuery) ||
      tool.description.toLowerCase().includes(lowercaseQuery) ||
      tool.keywords.some((keyword) =>
        keyword.toLowerCase().includes(lowercaseQuery)
      )
  );
};

export const getCategoryColorClass = (categoryColor: string): string => {
  return `category-${categoryColor}`;
};
