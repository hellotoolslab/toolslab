/**
 * Default Edge Config fallback data
 * Used when Edge Config is unavailable or fails to load
 * Ensures the site remains functional with core tools
 */

import { EdgeConfigSchema, ToolConfig, CategoryConfig } from './types';

export const DEFAULT_CATEGORIES: Record<string, CategoryConfig> = {
  'data-conversion': {
    id: 'data-conversion',
    name: 'Data & Conversion',
    description:
      'Tools for converting and formatting data between different formats',
    order: 1,
    enabled: true,
    color: '#0EA5E9',
    icon: 'Database',
  },
  'encoding-security': {
    id: 'encoding-security',
    name: 'Encoding & Security',
    description: 'Encoding, decoding, and security-related utilities',
    order: 2,
    enabled: true,
    color: '#10B981',
    icon: 'Shield',
  },
  'text-format': {
    id: 'text-format',
    name: 'Text & Format',
    description: 'Text processing and formatting tools',
    order: 3,
    enabled: true,
    color: '#8B5CF6',
    icon: 'Type',
  },
  generators: {
    id: 'generators',
    name: 'Generators',
    description: 'Generate UUIDs, passwords, and other random data',
    order: 4,
    enabled: true,
    color: '#F97316',
    icon: 'Zap',
  },
  'web-design': {
    id: 'web-design',
    name: 'Web & Design',
    description: 'Tools for web development and design workflows',
    order: 5,
    enabled: true,
    color: '#EC4899',
    icon: 'Palette',
  },
  'dev-utilities': {
    id: 'dev-utilities',
    name: 'Dev Utilities',
    description: 'Developer utilities for debugging and testing',
    order: 6,
    enabled: true,
    color: '#F59E0B',
    icon: 'Wrench',
  },
};

export const DEFAULT_TOOLS: Record<string, ToolConfig> = {
  'json-formatter': {
    id: 'json-formatter',
    slug: 'json-formatter',
    name: 'JSON Formatter',
    description:
      'Format, validate, and minify JSON data with syntax highlighting',
    longDescription:
      'A powerful JSON formatter that validates, beautifies, and minifies JSON data. Features include syntax highlighting, error detection with line numbers, and support for large files.',
    enabled: true,
    featured: true,
    order: 1,
    category: 'data-conversion',
    searchVolume: 165000,
    icon: 'Braces',
    flags: {
      isPopular: true,
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
      monthlyUsers: 50000,
      averageRating: 4.8,
      processingLimit: 1000000, // 1MB for free tier
      keywords: ['json', 'formatter', 'validator', 'beautify', 'minify'],
    },
  },
  'base64-encode': {
    id: 'base64-encode',
    slug: 'base64-encode',
    name: 'Base64 Encoder/Decoder',
    description:
      'Encode and decode Base64 strings with support for files and images',
    longDescription:
      'Comprehensive Base64 encoding and decoding tool. Supports text, files, and images with real-time conversion and validation.',
    enabled: true,
    featured: true,
    order: 2,
    category: 'encoding-security',
    searchVolume: 246000,
    icon: 'Binary',
    flags: {
      isPopular: true,
    },
    metadata: {
      lastUpdated: new Date().toISOString(),
      monthlyUsers: 75000,
      averageRating: 4.9,
      processingLimit: 5000000, // 5MB for free tier
      keywords: ['base64', 'encoder', 'decoder', 'encode', 'decode'],
    },
  },
  'url-encoder': {
    id: 'url-encoder',
    slug: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs and URI components safely',
    longDescription:
      'URL encoding and decoding tool that handles special characters, spaces, and international characters in URLs and URI components.',
    enabled: true,
    featured: true,
    order: 3,
    category: 'encoding-security',
    searchVolume: 89000,
    icon: 'Link',
    flags: {},
    metadata: {
      lastUpdated: new Date().toISOString(),
      monthlyUsers: 25000,
      averageRating: 4.7,
      processingLimit: 100000, // 100KB for free tier
      keywords: ['url', 'encoder', 'decoder', 'uri', 'percent-encoding'],
    },
  },
  'jwt-decoder': {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens (JWT) safely',
    longDescription:
      'Secure JWT decoder that parses and displays JWT headers, payloads, and signatures. Validates token structure and expiration times.',
    enabled: true,
    featured: true,
    order: 4,
    category: 'encoding-security',
    searchVolume: 60000,
    icon: 'Key',
    flags: {},
    metadata: {
      lastUpdated: new Date().toISOString(),
      monthlyUsers: 18000,
      averageRating: 4.6,
      processingLimit: 10000, // 10KB for free tier
      keywords: ['jwt', 'json web token', 'decoder', 'auth', 'token'],
    },
  },
  'uuid-generator': {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUID/GUID v1, v3, v4, and v5 with bulk options',
    longDescription:
      'Generate universally unique identifiers (UUIDs) in multiple versions. Supports bulk generation and various UUID formats.',
    enabled: true,
    featured: true,
    order: 5,
    category: 'generators',
    searchVolume: 45000,
    icon: 'Hash',
    flags: {},
    metadata: {
      lastUpdated: new Date().toISOString(),
      monthlyUsers: 12000,
      averageRating: 4.5,
      processingLimit: 1000, // 1000 UUIDs for free tier
      keywords: ['uuid', 'guid', 'generator', 'unique id', 'identifier'],
    },
  },
  'hash-generator': {
    id: 'hash-generator',
    slug: 'hash-generator',
    name: 'Hash Generator',
    description:
      'Generate MD5, SHA1, SHA256, SHA512 and other cryptographic hashes',
    longDescription:
      'Generate cryptographic hashes using various algorithms. Supports text input and file hashing with multiple hash formats.',
    enabled: true,
    featured: false,
    order: 6,
    category: 'encoding-security',
    searchVolume: 32000,
    icon: 'Lock',
    flags: {},
    metadata: {
      lastUpdated: new Date().toISOString(),
      monthlyUsers: 8000,
      averageRating: 4.4,
      processingLimit: 1000000, // 1MB for free tier
      keywords: ['hash', 'md5', 'sha1', 'sha256', 'checksum'],
    },
  },
  'timestamp-converter': {
    id: 'timestamp-converter',
    slug: 'timestamp-converter',
    name: 'Timestamp Converter',
    description:
      'Convert between Unix timestamps, ISO dates, and human-readable formats',
    longDescription:
      'Convert timestamps between different formats including Unix timestamps, ISO 8601, and human-readable dates.',
    enabled: true,
    featured: false,
    order: 7,
    category: 'dev-utilities',
    searchVolume: 28000,
    icon: 'Clock',
    flags: {},
    metadata: {
      lastUpdated: new Date().toISOString(),
      monthlyUsers: 6000,
      averageRating: 4.3,
      processingLimit: 1000, // 1000 conversions for free tier
      keywords: ['timestamp', 'unix', 'date', 'time', 'converter'],
    },
  },
};

export const DEFAULT_EDGE_CONFIG: EdgeConfigSchema = {
  tools: DEFAULT_TOOLS,
  categories: DEFAULT_CATEGORIES,
  features: {
    adsEnabled: process.env.NODE_ENV === 'production',
    maintenanceMode: false,
    comingSoon: false,
    proEnabled: true,
    experiments: {
      newToolChaining: false,
      enhancedSearch: false,
      darkModeDefault: false,
    },
  },
  settings: {
    maxFeaturedTools: 6,
    cacheTtl: 3600, // 1 hour
    analytics: {
      enabled: process.env.NODE_ENV === 'production',
      trackingId: process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID,
    },
  },
  meta: {
    lastUpdated: new Date().toISOString(),
    version: '1.0.0',
    environment: process.env.NODE_ENV as
      | 'development'
      | 'staging'
      | 'production',
  },
};

/**
 * Core tools that should always be available even in fallback mode
 * These are the most essential tools for the platform
 */
export const CORE_TOOL_SLUGS = [
  'json-formatter',
  'base64-encode',
  'url-encoder',
  'jwt-decoder',
  'uuid-generator',
];

/**
 * Maximum number of tools to cache in memory
 * Prevents memory bloat in long-running processes
 */
export const MAX_CACHE_SIZE = 100;

/**
 * Default cache TTL in milliseconds (5 minutes)
 */
// Reduced cache TTL for faster feature flag updates (30 seconds instead of 5 minutes)
export const DEFAULT_CACHE_TTL = 30 * 1000;
