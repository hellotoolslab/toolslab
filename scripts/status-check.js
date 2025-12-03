#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  blue: '\x1b[34m',
};

function log(message, color = '') {
  console.log(color + message + colors.reset);
}

function checkCommand(command, silent = false) {
  try {
    const result = execSync(command, {
      encoding: 'utf8',
      stdio: silent ? 'pipe' : 'inherit',
    });
    return result.trim();
  } catch (error) {
    return null;
  }
}

log('\n🔍 ToolsLab Status Check\n', colors.bright + colors.blue);

// Check Node version
const nodeVersion = process.version;
const requiredNode = '18.17.0';
const nodeValid = nodeVersion.replace('v', '').split('.').map(Number)[0] >= 18;
log(
  `${nodeValid ? '✓' : '❌'} Node.js: ${nodeVersion} ${nodeValid ? '' : `(required: >=${requiredNode})`}`,
  nodeValid ? colors.green : colors.red
);

// Check npm version
const npmVersion = checkCommand('npm -v', true);
if (npmVersion) {
  log(`✓ npm: ${npmVersion}`, colors.green);
} else {
  log('❌ npm not found', colors.red);
}

// Check for uncommitted changes
const gitStatus = checkCommand('git status --porcelain', true);
if (gitStatus === null) {
  log('❌ Git not initialized', colors.red);
} else if (gitStatus) {
  log('⚠️  Uncommitted changes detected:', colors.yellow);
  console.log(gitStatus);
} else {
  log('✓ Git: clean working directory', colors.green);
}

// Check current branch
const currentBranch = checkCommand('git branch --show-current', true);
if (currentBranch) {
  log(`✓ Current branch: ${currentBranch}`, colors.green);
}

// Check dependencies
try {
  execSync('npm ls --depth=0', { stdio: 'ignore' });
  log('✓ Dependencies: installed', colors.green);
} catch (e) {
  log('❌ Missing dependencies - run npm install', colors.red);
}

// Check TypeScript
const tscCheck = checkCommand('npx tsc --noEmit', true);
if (tscCheck === '') {
  log('✓ TypeScript: no type errors', colors.green);
} else if (tscCheck) {
  log('⚠️  TypeScript: type errors found', colors.yellow);
}

// Check environment variables
const envExample = '.env.local.example';
const envLocal = '.env.local';
if (fs.existsSync(envExample)) {
  const envVars = fs
    .readFileSync(envExample, 'utf8')
    .split('\n')
    .filter((line) => line && !line.startsWith('#'))
    .map((line) => line.split('=')[0].trim())
    .filter(Boolean);

  if (fs.existsSync(envLocal)) {
    const localEnv = fs.readFileSync(envLocal, 'utf8');
    const missing = envVars.filter((v) => !localEnv.includes(v + '='));

    if (missing.length) {
      log(`⚠️  Missing env vars: ${missing.join(', ')}`, colors.yellow);
    } else {
      log('✓ Environment variables: configured', colors.green);
    }
  } else {
    log('⚠️  No .env.local file found', colors.yellow);
  }
}

// Check test coverage
if (fs.existsSync('coverage/lcov-report/index.html')) {
  try {
    const coverageData = fs.readFileSync(
      'coverage/coverage-summary.json',
      'utf8'
    );
    const coverage = JSON.parse(coverageData);
    const total = coverage.total;

    const metrics = ['lines', 'statements', 'functions', 'branches'];
    const percentages = metrics.map((m) => total[m].pct);
    const avgCoverage =
      percentages.reduce((a, b) => a + b) / percentages.length;

    log(
      `✓ Test coverage: ${avgCoverage.toFixed(1)}%`,
      avgCoverage >= 80 ? colors.green : colors.yellow
    );

    metrics.forEach((metric, i) => {
      const pct = percentages[i];
      const symbol = pct >= 80 ? '  ✓' : '  ⚠️';
      const color = pct >= 80 ? colors.green : colors.yellow;
      log(`${symbol} ${metric}: ${pct.toFixed(1)}%`, color);
    });
  } catch (e) {
    log(
      'ℹ️  Coverage data available (run npm test:ci for details)',
      colors.blue
    );
  }
} else {
  log('ℹ️  No test coverage data (run npm test:ci to generate)', colors.blue);
}

// Check build
log('\n📦 Build Status:', colors.bright);
const buildDir = '.next';
if (fs.existsSync(buildDir)) {
  const stats = fs.statSync(buildDir);
  const ageInHours = (Date.now() - stats.mtime) / 1000 / 60 / 60;

  if (ageInHours < 1) {
    log('✓ Build: recent (< 1 hour old)', colors.green);
  } else if (ageInHours < 24) {
    log(`⚠️  Build: ${ageInHours.toFixed(1)} hours old`, colors.yellow);
  } else {
    log(`⚠️  Build: ${(ageInHours / 24).toFixed(1)} days old`, colors.yellow);
  }
} else {
  log('ℹ️  No build found (run npm run build)', colors.blue);
}

// Check for common issues
log('\n🔎 Common Issues Check:', colors.bright);

// Check for console.log in production code
const hasConsoleLogs = checkCommand(
  'grep -r "console.log" --include="*.ts" --include="*.tsx" app/ components/ lib/ 2>/dev/null | wc -l',
  true
);
if (hasConsoleLogs && parseInt(hasConsoleLogs) > 0) {
  log(
    `⚠️  Found ${hasConsoleLogs.trim()} console.log statements`,
    colors.yellow
  );
} else {
  log('✓ No console.log statements found', colors.green);
}

// Check for TODO comments
const hasTodos = checkCommand(
  'grep -r "TODO\\|FIXME" --include="*.ts" --include="*.tsx" app/ components/ lib/ 2>/dev/null | wc -l',
  true
);
if (hasTodos && parseInt(hasTodos) > 0) {
  log(`ℹ️  Found ${hasTodos.trim()} TODO/FIXME comments`, colors.blue);
}

// Summary
log('\n' + '='.repeat(50), colors.bright);
log('✅ Status check complete!', colors.bright + colors.green);
log('Run "npm run dev" to start development server', colors.blue);
log('='.repeat(50) + '\n', colors.bright);
