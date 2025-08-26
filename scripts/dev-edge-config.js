#!/usr/bin/env node

/**
 * Development script for Edge Config simulation
 * Provides local Edge Config server for development and testing
 */

const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.EDGE_CONFIG_PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Load default configuration
let edgeConfig = null;

async function loadDefaultConfig() {
  try {
    // Import the default configuration
    const defaultsPath = path.join(__dirname, '../lib/edge-config/defaults.ts');
    console.log(`📁 Loading default config from: ${defaultsPath}`);

    // For development, we'll use a simplified version
    edgeConfig = {
      tools: {
        'json-formatter': {
          id: 'json-formatter',
          slug: 'json-formatter',
          name: 'JSON Formatter',
          description:
            'Format, validate, and minify JSON data with syntax highlighting',
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
      },
      categories: {
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
      },
      features: {
        adsEnabled: false,
        maintenanceMode: false,
        proEnabled: true,
        experiments: {
          newToolChaining: true,
          enhancedSearch: false,
          darkModeDefault: false,
        },
      },
      settings: {
        maxFeaturedTools: 6,
        cacheTtl: 3600,
        analytics: {
          enabled: false,
        },
      },
      meta: {
        lastUpdated: new Date().toISOString(),
        version: '1.0.0-dev',
        environment: 'development',
      },
    };

    console.log('✅ Default configuration loaded');
    console.log(`📊 Tools: ${Object.keys(edgeConfig.tools).length}`);
    console.log(`📁 Categories: ${Object.keys(edgeConfig.categories).length}`);
  } catch (error) {
    console.error('❌ Failed to load default configuration:', error);
    process.exit(1);
  }
}

// Routes

// Get all configuration
app.get('/', (req, res) => {
  console.log('📡 GET / - Full configuration requested');
  res.json(edgeConfig);
});

// Get specific key
app.get('/:key', (req, res) => {
  const { key } = req.params;
  console.log(`📡 GET /${key} - Specific key requested`);

  if (edgeConfig && edgeConfig[key]) {
    res.json(edgeConfig[key]);
  } else {
    res.status(404).json({ error: `Key "${key}" not found` });
  }
});

// Update configuration (for testing)
app.post('/update', (req, res) => {
  const updates = req.body;
  console.log('📝 POST /update - Configuration update:', Object.keys(updates));

  if (edgeConfig) {
    Object.assign(edgeConfig, updates);
    edgeConfig.meta.lastUpdated = new Date().toISOString();

    res.json({
      success: true,
      message: 'Configuration updated',
      updatedKeys: Object.keys(updates),
    });
  } else {
    res.status(500).json({ error: 'Configuration not loaded' });
  }
});

// Toggle tool enabled status
app.post('/toggle-tool/:slug', (req, res) => {
  const { slug } = req.params;
  console.log(`🔄 POST /toggle-tool/${slug} - Toggle tool status`);

  if (edgeConfig?.tools?.[slug]) {
    edgeConfig.tools[slug].enabled = !edgeConfig.tools[slug].enabled;
    edgeConfig.meta.lastUpdated = new Date().toISOString();

    res.json({
      success: true,
      tool: slug,
      enabled: edgeConfig.tools[slug].enabled,
    });
  } else {
    res.status(404).json({ error: `Tool "${slug}" not found` });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    config: edgeConfig ? 'loaded' : 'not loaded',
    tools: edgeConfig ? Object.keys(edgeConfig.tools).length : 0,
  });
});

// Error handling
app.use((error, req, res, next) => {
  console.error('❌ Server error:', error);
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not found',
    path: req.path,
  });
});

async function startServer() {
  await loadDefaultConfig();

  app.listen(PORT, () => {
    console.log('🚀 Development Edge Config Server started');
    console.log(`📡 Server: http://localhost:${PORT}`);
    console.log(`🔍 Health: http://localhost:${PORT}/health`);
    console.log(`📋 Tools: http://localhost:${PORT}/tools`);
    console.log(`📁 Categories: http://localhost:${PORT}/categories`);
    console.log('');
    console.log('📝 Available endpoints:');
    console.log('  GET  /           - Full configuration');
    console.log('  GET  /:key       - Specific key');
    console.log('  POST /update     - Update configuration');
    console.log('  POST /toggle-tool/:slug - Toggle tool status');
    console.log('  GET  /health     - Health check');
    console.log('');
    console.log('⚡ To use this with your Next.js app:');
    console.log(`   EDGE_CONFIG=http://localhost:${PORT}`);
    console.log('');
  });
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Edge Config server...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Shutting down Edge Config server...');
  process.exit(0);
});

// Start the server
startServer().catch((error) => {
  console.error('❌ Failed to start server:', error);
  process.exit(1);
});
