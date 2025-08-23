#!/usr/bin/env node

/**
 * Script per inizializzare Edge Config con la struttura di base
 */

require('dotenv').config({ path: '.env.local' });
const https = require('https');

const VERCEL_API_TOKEN = process.env.VERCEL_API_TOKEN;
const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID;
const VERCEL_TEAM_ID = process.env.VERCEL_TEAM_ID;

if (!VERCEL_API_TOKEN || !EDGE_CONFIG_ID) {
  console.error('❌ VERCEL_API_TOKEN and EDGE_CONFIG_ID are required');
  console.error('Run: node scripts/setup-edge-config-management.js');
  process.exit(1);
}

function makeRequest(path, method, data) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.vercel.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${VERCEL_API_TOKEN}`,
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

async function initializeEdgeConfig() {
  console.log('🚀 Initializing Edge Config with base structure...\n');

  const initialConfig = {
    items: [
      {
        operation: 'upsert',
        key: 'features',
        value: {
          maintenanceMode: false,
          adsEnabled: false,
          proEnabled: true,
          betaFeatures: false,
          apiEnabled: true,
          workspaceEnabled: true,
        },
      },
      {
        operation: 'upsert',
        key: 'tools',
        value: {
          'json-formatter': {
            id: 'json-formatter',
            slug: 'json-formatter',
            name: 'JSON Formatter',
            description: 'Format, validate, and minify JSON data',
            enabled: true,
            featured: true,
            order: 1,
            category: 'data-conversion',
            searchVolume: 165000,
            icon: 'FileJson',
            flags: {
              showInNav: true,
              allowAnonymous: true,
              requiresAuth: false,
            },
            metadata: {
              lastUpdated: new Date().toISOString(),
              monthlyUsers: 45000,
              averageRating: 4.9,
              processingLimit: 10000,
              keywords: [
                'json',
                'formatter',
                'validator',
                'beautify',
                'minify',
              ],
            },
          },
          base64: {
            id: 'base64',
            slug: 'base64',
            name: 'Base64 Encoder/Decoder',
            description: 'Encode and decode Base64 strings',
            enabled: true,
            featured: true,
            order: 2,
            category: 'encoding-security',
            searchVolume: 246000,
            icon: 'Lock',
            flags: {
              showInNav: true,
              allowAnonymous: true,
              requiresAuth: false,
            },
            metadata: {
              lastUpdated: new Date().toISOString(),
              monthlyUsers: 62000,
              averageRating: 4.8,
              processingLimit: 5000,
              keywords: ['base64', 'encode', 'decode', 'converter'],
            },
          },
          'url-encoder': {
            id: 'url-encoder',
            slug: 'url-encoder',
            name: 'URL Encoder/Decoder',
            description: 'Encode and decode URLs',
            enabled: true,
            featured: false,
            order: 3,
            category: 'encoding-security',
            searchVolume: 89000,
            icon: 'Link',
            flags: {
              showInNav: true,
              allowAnonymous: true,
              requiresAuth: false,
            },
            metadata: {
              lastUpdated: new Date().toISOString(),
              monthlyUsers: 28000,
              averageRating: 4.7,
              processingLimit: 2000,
              keywords: ['url', 'encode', 'decode', 'percent', 'encoding'],
            },
          },
        },
      },
      {
        operation: 'upsert',
        key: 'categories',
        value: {
          'data-conversion': {
            id: 'data-conversion',
            name: 'Data & Conversion',
            description: 'Tools for data format conversion and manipulation',
            enabled: true,
            order: 1,
            color: '#0EA5E9',
            icon: '📊',
          },
          'encoding-security': {
            id: 'encoding-security',
            name: 'Encoding & Security',
            description: 'Encoding, decoding, and security tools',
            enabled: true,
            order: 2,
            color: '#10B981',
            icon: '🔐',
          },
          'text-format': {
            id: 'text-format',
            name: 'Text & Format',
            description: 'Text manipulation and formatting tools',
            enabled: true,
            order: 3,
            color: '#8B5CF6',
            icon: '📝',
          },
          generators: {
            id: 'generators',
            name: 'Generators',
            description: 'Generate various types of data',
            enabled: true,
            order: 4,
            color: '#F97316',
            icon: '⚡',
          },
          'web-design': {
            id: 'web-design',
            name: 'Web & Design',
            description: 'Web development and design tools',
            enabled: true,
            order: 5,
            color: '#EC4899',
            icon: '🎨',
          },
          'dev-utilities': {
            id: 'dev-utilities',
            name: 'Dev Utilities',
            description: 'Developer utilities and helpers',
            enabled: true,
            order: 6,
            color: '#F59E0B',
            icon: '🛠️',
          },
        },
      },
      {
        operation: 'upsert',
        key: 'meta',
        value: {
          version: '1.0.0',
          environment: 'development',
          lastUpdated: new Date().toISOString(),
          totalTools: 3,
          activeTools: 3,
          totalCategories: 6,
          apiVersion: 'v1',
        },
      },
      {
        operation: 'upsert',
        key: 'limits',
        value: {
          anonymous: {
            dailyRequests: 1000,
            maxFileSize: 1048576, // 1MB
            maxProcessingTime: 30000, // 30 seconds
            rateLimitPerMinute: 60,
          },
          authenticated: {
            dailyRequests: 10000,
            maxFileSize: 10485760, // 10MB
            maxProcessingTime: 120000, // 2 minutes
            rateLimitPerMinute: 300,
          },
          pro: {
            dailyRequests: -1, // unlimited
            maxFileSize: 104857600, // 100MB
            maxProcessingTime: 600000, // 10 minutes
            rateLimitPerMinute: -1, // unlimited
          },
        },
      },
    ],
  };

  let path = `/v1/edge-config/${EDGE_CONFIG_ID}/items`;
  if (VERCEL_TEAM_ID) {
    path += `?teamId=${VERCEL_TEAM_ID}`;
  }

  try {
    console.log('📤 Sending initial configuration...');
    const response = await makeRequest(path, 'PATCH', initialConfig);

    if (response.status === 200 || response.status === 204) {
      console.log('✅ Edge Config initialized successfully!\n');
      console.log('📊 Summary:');
      console.log('   - Features configured');
      console.log('   - 3 tools added');
      console.log('   - 6 categories created');
      console.log('   - Limits set');
      console.log('   - Metadata initialized\n');
      console.log('🎉 You can now use the management commands:');
      console.log('   npm run edge-config:manage show');
      console.log('   npm run edge-config:manage maintenance on/off');
      console.log('   npm run edge-config:manage ads on/off');
    } else {
      console.error('❌ Failed to initialize:', response.status);
      console.error(JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Check if running directly
if (require.main === module) {
  initializeEdgeConfig();
}

module.exports = { initializeEdgeConfig };
