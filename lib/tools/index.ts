export interface Tool {
  id: string;
  name: string;
  description: string;
  route: string;
  icon: string;
  keywords: string[];
  searchVolume: number;
  category: 'encoder' | 'generator' | 'converter' | 'formatter';
}

export const tools: Tool[] = [
  {
    id: 'json-formatter',
    name: 'JSON Formatter',
    description: 'Format, validate, and beautify JSON data with syntax highlighting',
    route: '/tools/json-formatter',
    icon: '{}',
    keywords: ['json', 'format', 'beautify', 'validate', 'pretty'],
    searchVolume: 1000,
    category: 'formatter',
  },
  {
    id: 'base64',
    name: 'Base64 Encoder/Decoder',
    description: 'Encode and decode Base64 strings with support for text and files',
    route: '/tools/base64',
    icon: '🔐',
    keywords: ['base64', 'encode', 'decode', 'conversion'],
    searchVolume: 800,
    category: 'encoder',
  },
  {
    id: 'url-encode',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs and URI components safely',
    route: '/tools/url-encode',
    icon: '🔗',
    keywords: ['url', 'encode', 'decode', 'uri', 'percent'],
    searchVolume: 700,
    category: 'encoder',
  },
  {
    id: 'jwt',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens (JWT) headers and payloads',
    route: '/tools/jwt',
    icon: '🎫',
    keywords: ['jwt', 'token', 'decode', 'json', 'web'],
    searchVolume: 600,
    category: 'converter',
  },
  {
    id: 'uuid',
    name: 'UUID Generator',
    description: 'Generate various types of UUIDs (v1, v4, v5) and GUIDs',
    route: '/tools/uuid',
    icon: '🆔',
    keywords: ['uuid', 'guid', 'generate', 'unique', 'identifier'],
    searchVolume: 500,
    category: 'generator',
  },
  {
    id: 'hash',
    name: 'Hash Generator',
    description: 'Generate MD5, SHA1, SHA256, and other hash values',
    route: '/tools/hash',
    icon: '#️⃣',
    keywords: ['hash', 'md5', 'sha1', 'sha256', 'checksum'],
    searchVolume: 400,
    category: 'generator',
  },
  {
    id: 'timestamp',
    name: 'Timestamp Converter',
    description: 'Convert between Unix timestamps and human-readable dates',
    route: '/tools/timestamp',
    icon: '⏰',
    keywords: ['timestamp', 'unix', 'date', 'time', 'convert'],
    searchVolume: 300,
    category: 'converter',
  },
];

export const getToolById = (id: string): Tool | undefined => {
  return tools.find(tool => tool.id === id);
};

export const getToolsByCategory = (category: Tool['category']): Tool[] => {
  return tools.filter(tool => tool.category === category);
};

export const searchTools = (query: string): Tool[] => {
  const lowercaseQuery = query.toLowerCase();
  return tools.filter(tool =>
    tool.name.toLowerCase().includes(lowercaseQuery) ||
    tool.description.toLowerCase().includes(lowercaseQuery) ||
    tool.keywords.some(keyword => keyword.toLowerCase().includes(lowercaseQuery))
  );
};