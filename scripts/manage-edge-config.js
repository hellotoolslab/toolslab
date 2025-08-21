#!/usr/bin/env node

/**
 * Script per gestire Vercel Edge Config di OctoTools
 * Permette di visualizzare, modificare, abilitare/disabilitare tool
 */

const https = require('https');

const EDGE_CONFIG_URL = process.env.EDGE_CONFIG;

if (!EDGE_CONFIG_URL) {
  console.error('❌ EDGE_CONFIG environment variable is required');
  process.exit(1);
}

/**
 * Funzione per fare richieste HTTPS
 */
function makeRequest(url, method, data) {
  return new Promise((resolve, reject) => {
    const parsedUrl = new URL(url);
    const options = {
      hostname: parsedUrl.hostname,
      port: 443,
      path: parsedUrl.pathname + parsedUrl.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
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
 * Ottieni API URL per modifiche
 */
function getApiUrl() {
  const configId = EDGE_CONFIG_URL.match(/ecfg_[^?]+/)?.[0];
  const token = EDGE_CONFIG_URL.match(/token=([^&]+)/)?.[1];

  if (!configId || !token) {
    throw new Error('Invalid Edge Config URL format');
  }

  return `https://api.vercel.com/v1/edge-config/${configId}/items?token=${token}`;
}

/**
 * Visualizza configurazione corrente
 */
async function showConfig() {
  try {
    const response = await makeRequest(EDGE_CONFIG_URL, 'GET');

    if (response.status !== 200) {
      console.error('❌ Failed to get config:', response.status);
      return;
    }

    const config = response.data;

    console.log('📋 Current Edge Config:');
    console.log('=======================');

    if (config.tools) {
      console.log(`\n🛠️  Tools (${Object.keys(config.tools).length}):`);
      Object.entries(config.tools).forEach(([slug, tool]) => {
        const status = tool.enabled ? '✅' : '❌';
        const featured = tool.featured ? '⭐' : '  ';
        console.log(`   ${status} ${featured} ${tool.name} (${slug})`);
      });
    }

    if (config.categories) {
      console.log(
        `\n📁 Categories (${Object.keys(config.categories).length}):`
      );
      Object.entries(config.categories).forEach(([id, cat]) => {
        const status = cat.enabled ? '✅' : '❌';
        console.log(`   ${status} ${cat.name} (${id})`);
      });
    }

    if (config.features) {
      console.log('\n🎯 Feature Flags:');
      console.log(`   Ads: ${config.features.adsEnabled ? '✅' : '❌'}`);
      console.log(
        `   Maintenance: ${config.features.maintenanceMode ? '🚧' : '✅'}`
      );
      console.log(`   Pro: ${config.features.proEnabled ? '✅' : '❌'}`);
    }

    if (config.meta) {
      console.log('\n📊 Meta:');
      console.log(`   Version: ${config.meta.version}`);
      console.log(`   Environment: ${config.meta.environment}`);
      console.log(
        `   Last Updated: ${new Date(config.meta.lastUpdated).toLocaleString()}`
      );
    }
  } catch (error) {
    console.error('❌ Error showing config:', error.message);
  }
}

/**
 * Abilita/disabilita un tool
 */
async function toggleTool(toolSlug, enabled) {
  try {
    // Prima ottieni la configurazione corrente
    const currentResponse = await makeRequest(EDGE_CONFIG_URL, 'GET');
    if (currentResponse.status !== 200) {
      throw new Error('Failed to get current config');
    }

    const config = currentResponse.data;

    if (!config.tools || !config.tools[toolSlug]) {
      console.error(`❌ Tool "${toolSlug}" not found`);
      return;
    }

    // Aggiorna il tool
    const updatedTool = {
      ...config.tools[toolSlug],
      enabled: enabled,
    };

    const updatedTools = {
      ...config.tools,
      [toolSlug]: updatedTool,
    };

    // Invia l'aggiornamento
    const apiUrl = getApiUrl();
    const response = await makeRequest(apiUrl, 'PATCH', {
      items: [
        {
          operation: 'upsert',
          key: 'tools',
          value: updatedTools,
        },
      ],
    });

    if (response.status === 200 || response.status === 204) {
      const status = enabled ? 'enabled' : 'disabled';
      console.log(`✅ Tool "${toolSlug}" ${status} successfully!`);
    } else {
      console.error(
        '❌ Failed to update tool:',
        response.status,
        response.data
      );
    }
  } catch (error) {
    console.error('❌ Error toggling tool:', error.message);
  }
}

/**
 * Modifica feature flags
 */
async function updateFeatures(updates) {
  try {
    // Ottieni configurazione corrente
    const currentResponse = await makeRequest(EDGE_CONFIG_URL, 'GET');
    if (currentResponse.status !== 200) {
      throw new Error('Failed to get current config');
    }

    const config = currentResponse.data;
    const currentFeatures = config.features || {};

    // Merge delle modifiche
    const updatedFeatures = {
      ...currentFeatures,
      ...updates,
    };

    // Invia aggiornamento
    const apiUrl = getApiUrl();
    const response = await makeRequest(apiUrl, 'PATCH', {
      items: [
        {
          operation: 'upsert',
          key: 'features',
          value: updatedFeatures,
        },
      ],
    });

    if (response.status === 200 || response.status === 204) {
      console.log('✅ Feature flags updated successfully!');
      Object.entries(updates).forEach(([key, value]) => {
        console.log(`   ${key}: ${value}`);
      });
    } else {
      console.error(
        '❌ Failed to update features:',
        response.status,
        response.data
      );
    }
  } catch (error) {
    console.error('❌ Error updating features:', error.message);
  }
}

/**
 * Aggiunge un nuovo tool
 */
async function addTool(toolData) {
  try {
    // Ottieni configurazione corrente
    const currentResponse = await makeRequest(EDGE_CONFIG_URL, 'GET');
    if (currentResponse.status !== 200) {
      throw new Error('Failed to get current config');
    }

    const config = currentResponse.data;
    const currentTools = config.tools || {};

    // Controlla se esiste già
    if (currentTools[toolData.slug]) {
      console.error(`❌ Tool "${toolData.slug}" already exists`);
      return;
    }

    // Aggiungi il nuovo tool
    const updatedTools = {
      ...currentTools,
      [toolData.slug]: {
        id: toolData.slug,
        slug: toolData.slug,
        name: toolData.name,
        description: toolData.description,
        enabled: toolData.enabled !== false,
        featured: toolData.featured || false,
        order: toolData.order || 999,
        category: toolData.category || 'dev-utilities',
        searchVolume: toolData.searchVolume || 0,
        icon: toolData.icon || 'Tool',
        flags: toolData.flags || {},
        metadata: {
          lastUpdated: new Date().toISOString(),
          monthlyUsers: toolData.monthlyUsers || 0,
          averageRating: toolData.averageRating || 5.0,
          processingLimit: toolData.processingLimit || 1000,
          keywords: toolData.keywords || [toolData.name.toLowerCase()],
          ...toolData.metadata,
        },
      },
    };

    // Invia aggiornamento
    const apiUrl = getApiUrl();
    const response = await makeRequest(apiUrl, 'PATCH', {
      items: [
        {
          operation: 'upsert',
          key: 'tools',
          value: updatedTools,
        },
      ],
    });

    if (response.status === 200 || response.status === 204) {
      console.log(`✅ Tool "${toolData.name}" added successfully!`);
    } else {
      console.error('❌ Failed to add tool:', response.status, response.data);
    }
  } catch (error) {
    console.error('❌ Error adding tool:', error.message);
  }
}

/**
 * Menu interattivo
 */
function showHelp() {
  console.log('🔧 OctoTools Edge Config Manager');
  console.log('=================================');
  console.log('');
  console.log('📋 Commands:');
  console.log(
    '  node scripts/manage-edge-config.js show                    # Show current config'
  );
  console.log(
    '  node scripts/manage-edge-config.js enable <tool-slug>      # Enable a tool'
  );
  console.log(
    '  node scripts/manage-edge-config.js disable <tool-slug>     # Disable a tool'
  );
  console.log(
    '  node scripts/manage-edge-config.js maintenance on|off     # Toggle maintenance mode'
  );
  console.log(
    '  node scripts/manage-edge-config.js ads on|off             # Toggle ads'
  );
  console.log(
    '  node scripts/manage-edge-config.js add-tool <json>         # Add new tool (JSON string)'
  );
  console.log('');
  console.log('📝 Examples:');
  console.log('  node scripts/manage-edge-config.js show');
  console.log('  node scripts/manage-edge-config.js disable json-formatter');
  console.log('  node scripts/manage-edge-config.js maintenance on');
  console.log(
    '  node scripts/manage-edge-config.js add-tool \'{"name":"Test Tool","slug":"test-tool","description":"A test"}\''
  );
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command || command === 'help') {
    showHelp();
    return;
  }

  switch (command) {
    case 'show':
      await showConfig();
      break;

    case 'enable':
      const enableSlug = args[1];
      if (!enableSlug) {
        console.error('❌ Tool slug required');
        return;
      }
      await toggleTool(enableSlug, true);
      break;

    case 'disable':
      const disableSlug = args[1];
      if (!disableSlug) {
        console.error('❌ Tool slug required');
        return;
      }
      await toggleTool(disableSlug, false);
      break;

    case 'maintenance':
      const maintenanceMode = args[1] === 'on';
      await updateFeatures({ maintenanceMode });
      break;

    case 'ads':
      const adsEnabled = args[1] === 'on';
      await updateFeatures({ adsEnabled });
      break;

    case 'add-tool':
      const toolJson = args[1];
      if (!toolJson) {
        console.error('❌ Tool JSON required');
        return;
      }
      try {
        const toolData = JSON.parse(toolJson);
        await addTool(toolData);
      } catch (e) {
        console.error('❌ Invalid JSON:', e.message);
      }
      break;

    default:
      console.error(`❌ Unknown command: ${command}`);
      showHelp();
  }
}

main().catch((error) => {
  console.error('❌ Script failed:', error);
  process.exit(1);
});
