#!/usr/bin/env node

/**
 * Script per popolare Vercel Edge Config con i dati iniziali di OctoTools
 * Usa l'API Vercel per caricare la configurazione di default
 */

const https = require('https');

// Configurazione manuale (copia da defaults.ts convertita)
const DEFAULT_TOOLS = {
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
    flags: { isPopular: true },
    metadata: {
      lastUpdated: new Date().toISOString(),
      monthlyUsers: 50000,
      averageRating: 4.8,
      processingLimit: 1000000,
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
    flags: { isPopular: true },
    metadata: {
      lastUpdated: new Date().toISOString(),
      monthlyUsers: 75000,
      averageRating: 4.9,
      processingLimit: 5000000,
      keywords: ['base64', 'encoder', 'decoder', 'encode', 'decode'],
    },
  },
  'url-encoder': {
    id: 'url-encoder',
    slug: 'url-encoder',
    name: 'URL Encoder/Decoder',
    description: 'Encode and decode URLs and URI components safely',
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
      processingLimit: 100000,
      keywords: ['url', 'encoder', 'decoder', 'uri', 'percent-encoding'],
    },
  },
  'jwt-decoder': {
    id: 'jwt-decoder',
    slug: 'jwt-decoder',
    name: 'JWT Decoder',
    description: 'Decode and inspect JSON Web Tokens (JWT) safely',
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
      processingLimit: 10000,
      keywords: ['jwt', 'json web token', 'decoder', 'auth', 'token'],
    },
  },
  'uuid-generator': {
    id: 'uuid-generator',
    slug: 'uuid-generator',
    name: 'UUID Generator',
    description: 'Generate UUID/GUID v1, v3, v4, and v5 with bulk options',
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
      processingLimit: 1000,
      keywords: ['uuid', 'guid', 'generator', 'unique id', 'identifier'],
    },
  },
};

const DEFAULT_CATEGORIES = {
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
  generators: {
    id: 'generators',
    name: 'Generators',
    description: 'Generate UUIDs, passwords, and other random data',
    order: 4,
    enabled: true,
    color: '#F97316',
    icon: 'Zap',
  },
};

// Configurazione Edge Config
const EDGE_CONFIG_URL = process.env.EDGE_CONFIG;
const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;

if (!EDGE_CONFIG_URL) {
  console.error('❌ EDGE_CONFIG environment variable is required');
  console.error(
    '💡 Make sure you have set EDGE_CONFIG in your .env.local file'
  );
  process.exit(1);
}

if (!VERCEL_API_TOKEN) {
  console.error('❌ VERCEL_API_TOKEN environment variable is required');
  console.error(
    '💡 Make sure you have set VERCEL_API_TOKEN in your .env.local file'
  );
  process.exit(1);
}

console.log('🚀 Populating Edge Config with initial data...');
console.log(`📡 Target: ${EDGE_CONFIG_URL.substring(0, 50)}...`);

/**
 * Funzione per fare richieste HTTPS
 */
function makeRequest(url, method, data, useAuth = false) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...(useAuth && { Authorization: `Bearer ${VERCEL_API_TOKEN}` }),
      },
    };

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve({ status: res.statusCode, data: response });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);

    if (data) {
      req.write(JSON.stringify(data));
    }

    req.end();
  });
}

/**
 * Popola Edge Config usando l'API Vercel
 */
async function populateEdgeConfig() {
  try {
    // Estrai l'ID dell'Edge Config e token dall'URL
    const configId = EDGE_CONFIG_URL.match(/ecfg_[^?]+/)?.[0];
    const token = EDGE_CONFIG_URL.match(/token=([^&]+)/)?.[1];

    if (!configId || !token) {
      throw new Error('Invalid Edge Config URL format');
    }

    console.log(`📋 Config ID: ${configId}`);

    // URL dell'API Vercel per aggiornare Edge Config
    const apiUrl = `https://api.vercel.com/v1/edge-config/${configId}/items`;

    // Prepara i dati da caricare - struttura flat per Edge Config
    const items = [];

    // Carica la configurazione completa
    items.push({
      operation: 'upsert',
      key: 'tools',
      value: DEFAULT_TOOLS,
    });

    items.push({
      operation: 'upsert',
      key: 'categories',
      value: DEFAULT_CATEGORIES,
    });

    items.push({
      operation: 'upsert',
      key: 'features',
      value: {
        adsEnabled: false,
        maintenanceMode: false,
        proEnabled: true,
        experiments: {
          newToolChaining: false,
          enhancedSearch: false,
          darkModeDefault: false,
        },
      },
    });

    items.push({
      operation: 'upsert',
      key: 'settings',
      value: {
        maxFeaturedTools: 6,
        cacheTtl: 3600,
        analytics: { enabled: false },
      },
    });

    items.push({
      operation: 'upsert',
      key: 'meta',
      value: {
        lastUpdated: new Date().toISOString(),
        version: '1.0.0',
        environment: 'production',
      },
    });

    console.log(`📦 Preparing ${items.length} sections for upload...`);

    // Carica i dati
    const response = await makeRequest(apiUrl, 'PATCH', { items }, true);

    if (response.status === 200 || response.status === 204) {
      console.log('✅ Edge Config populated successfully!');
      console.log(`📊 Uploaded sections:`);
      console.log(`   - Tools: ${Object.keys(DEFAULT_TOOLS).length}`);
      console.log(`   - Categories: ${Object.keys(DEFAULT_CATEGORIES).length}`);
      console.log(`   - Features: 1`);
      console.log(`   - Settings: 1`);
      console.log(`   - Meta: 1`);
      console.log('');
      console.log('🎉 Your Edge Config is ready!');
      console.log('🚀 You can now test your Next.js app with live config.');
      console.log('');
      console.log('🔧 Next steps:');
      console.log('   1. npm run dev');
      console.log('   2. curl http://localhost:3000/api/tools/config');
      console.log('   3. Open http://localhost:3000');
    } else {
      console.error('❌ Failed to populate Edge Config');
      console.error(`Status: ${response.status}`);
      console.error('Response:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error populating Edge Config:', error.message);
    console.error('');
    console.error('🔧 Troubleshooting:');
    console.error('1. Check your EDGE_CONFIG URL is correct');
    console.error('2. Verify the token has write permissions');
    console.error('3. Make sure the Edge Config exists in Vercel Dashboard');
    console.error('4. Check if you have access to the Vercel project');
    process.exit(1);
  }
}

/**
 * Verifica la connessione Edge Config
 */
async function testConnection() {
  try {
    console.log('🔍 Testing Edge Config connection...');

    const response = await makeRequest(EDGE_CONFIG_URL, 'GET');

    if (response.status === 200) {
      console.log('✅ Edge Config connection successful');
      console.log(
        '📋 Current config:',
        Object.keys(response.data || {}).length > 0 ? 'Has data' : 'Empty'
      );
      return true;
    } else {
      console.error('❌ Edge Config connection failed');
      console.error(`Status: ${response.status}`);
      console.error('Response:', response.data);
      return false;
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error.message);
    return false;
  }
}

// Main execution
async function main() {
  console.log('🔧 ToolsLab Edge Config Population Script');
  console.log('==========================================');
  console.log('');

  // Test connection first
  const isConnected = await testConnection();
  if (!isConnected) {
    console.log('');
    console.log('💡 Alternative: Use development mode instead');
    console.log('   1. Edit .env.local: EDGE_CONFIG=http://localhost:3001');
    console.log('   2. npm run edge-config:dev');
    console.log('   3. npm run dev (in another terminal)');
    process.exit(1);
  }

  console.log('');
  await populateEdgeConfig();
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
