#!/usr/bin/env node

/**
 * Script per gestire gli override locali di configurazione
 * Permette di testare diverse configurazioni senza modificare Edge Config
 */

const fs = require('fs');
const path = require('path');

const ENV_FILE_PATH = path.join(process.cwd(), '.env.local');

// Mappatura dei flag ai nomi delle variabili d'ambiente
const FLAG_MAPPING = {
  ads: 'LOCAL_OVERRIDE_ADS',
  maintenance: 'LOCAL_OVERRIDE_MAINTENANCE',
  pro: 'LOCAL_OVERRIDE_PRO',
  beta: 'LOCAL_OVERRIDE_BETA',
};

function readEnvFile() {
  if (!fs.existsSync(ENV_FILE_PATH)) {
    console.error('❌ .env.local file not found');
    process.exit(1);
  }
  return fs.readFileSync(ENV_FILE_PATH, 'utf8');
}

function writeEnvFile(content) {
  fs.writeFileSync(ENV_FILE_PATH, content);
}

function updateEnvVariable(content, varName, value) {
  const regex = new RegExp(`^${varName}=.*$`, 'gm');

  if (regex.test(content)) {
    // Variable exists, update it
    return content.replace(regex, `${varName}=${value}`);
  } else {
    // Variable doesn't exist, add it
    return content + `\n${varName}=${value}`;
  }
}

function removeEnvVariable(content, varName) {
  const regex = new RegExp(`^${varName}=.*$\\n?`, 'gm');
  return content.replace(regex, '');
}

function showCurrentOverrides() {
  const content = readEnvFile();
  console.log('\n📋 Current Local Overrides:\n');

  let hasOverrides = false;

  for (const [flag, envVar] of Object.entries(FLAG_MAPPING)) {
    const regex = new RegExp(`^${envVar}=(.*)$`, 'm');
    const match = content.match(regex);

    if (match) {
      const value = match[1];
      const emoji = value === 'true' ? '✅' : value === 'false' ? '❌' : '❓';
      console.log(
        `   ${emoji} ${flag}: ${value || '(empty - uses Edge Config)'}`
      );
      hasOverrides = true;
    }
  }

  if (!hasOverrides) {
    console.log('   No local overrides configured (using Edge Config values)');
  }

  console.log('\n💡 Tip: Restart the dev server after changing overrides\n');
}

function setOverride(flag, value) {
  const envVar = FLAG_MAPPING[flag];

  if (!envVar) {
    console.error(`❌ Unknown flag: ${flag}`);
    console.log('Available flags:', Object.keys(FLAG_MAPPING).join(', '));
    process.exit(1);
  }

  let content = readEnvFile();

  if (value === 'clear' || value === 'reset') {
    content = removeEnvVariable(content, envVar);
    console.log(`🗑️  Cleared local override for ${flag}`);
    console.log('   Will now use Edge Config value');
  } else if (value === 'on' || value === 'true') {
    content = updateEnvVariable(content, envVar, 'true');
    console.log(`✅ Set local override: ${flag} = true`);
  } else if (value === 'off' || value === 'false') {
    content = updateEnvVariable(content, envVar, 'false');
    console.log(`❌ Set local override: ${flag} = false`);
  } else {
    console.error(`❌ Invalid value: ${value}`);
    console.log('Use: on/true, off/false, or clear/reset');
    process.exit(1);
  }

  writeEnvFile(content);
  console.log(
    '\n⚠️  Remember to restart the dev server for changes to take effect!\n'
  );
}

function clearAllOverrides() {
  let content = readEnvFile();

  for (const envVar of Object.values(FLAG_MAPPING)) {
    content = removeEnvVariable(content, envVar);
  }

  writeEnvFile(content);
  console.log('🗑️  Cleared all local overrides');
  console.log('   Will now use Edge Config values for all features');
  console.log('\n⚠️  Remember to restart the dev server!\n');
}

// Parse command line arguments
const args = process.argv.slice(2);

if (args.length === 0 || args[0] === 'show' || args[0] === 'list') {
  showCurrentOverrides();
} else if (args[0] === 'clear-all' || args[0] === 'reset-all') {
  clearAllOverrides();
} else if (args.length === 2) {
  const [flag, value] = args;
  setOverride(flag, value);
} else {
  console.log(`
📋 Local Config Override Manager

Usage:
  node scripts/local-config.js                    # Show current overrides
  node scripts/local-config.js show               # Show current overrides
  node scripts/local-config.js <flag> <value>     # Set an override
  node scripts/local-config.js <flag> clear       # Clear an override
  node scripts/local-config.js clear-all          # Clear all overrides

Flags:
  ads         - Advertisement display
  maintenance - Maintenance mode
  pro         - Pro features
  beta        - Beta features

Values:
  on/true     - Enable the feature
  off/false   - Disable the feature
  clear/reset - Remove override (use Edge Config)

Examples:
  node scripts/local-config.js ads on            # Enable ads locally
  node scripts/local-config.js maintenance off   # Disable maintenance locally
  node scripts/local-config.js beta clear        # Use Edge Config for beta
  node scripts/local-config.js clear-all         # Remove all overrides

Note: Restart the dev server after changing overrides!
  `);
}
