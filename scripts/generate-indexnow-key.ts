#!/usr/bin/env tsx
// scripts/generate-indexnow-key.ts
import { promises as fs } from 'fs';
import path from 'path';

async function generateKey() {
  console.log('🔑 IndexNow Key Generator');
  console.log('=========================\n');

  try {
    // Generate a 32-character alphanumeric key
    const key = Array.from(
      { length: 32 },
      () => Math.random().toString(36).charAt(2) || 'a'
    ).join('');

    console.log(`Generated key: ${key}`);

    // Path to .env.local
    const envPath = path.join(process.cwd(), '.env.local');

    // Read existing .env.local or create new content
    let envContent = '';
    try {
      envContent = await fs.readFile(envPath, 'utf-8');
    } catch (error) {
      console.log('Creating new .env.local file...');
    }

    // Check if INDEXNOW_API_KEY already exists
    if (envContent.includes('INDEXNOW_API_KEY=')) {
      console.log('⚠️ INDEXNOW_API_KEY already exists in .env.local');

      // Ask if user wants to replace it
      const args = process.argv.slice(2);
      const force = args.includes('--force') || args.includes('-f');

      if (!force) {
        console.log('Use --force to replace existing key');
        console.log('Current key will remain unchanged');
        return;
      }

      // Replace existing key
      envContent = envContent.replace(
        /INDEXNOW_API_KEY=.*/g,
        `INDEXNOW_API_KEY=${key}`
      );
      console.log('🔄 Replacing existing key...');
    } else {
      // Add new key
      envContent += `\n# IndexNow API Key for SEO auto-submission\nINDEXNOW_API_KEY=${key}\n`;
      console.log('➕ Adding new key...');
    }

    // Write updated .env.local
    await fs.writeFile(envPath, envContent);
    console.log('✅ Updated .env.local');

    // Create key file in public directory
    const keyFilePath = path.join(process.cwd(), 'public', `${key}.txt`);
    await fs.writeFile(keyFilePath, key);
    console.log(`✅ Created public/${key}.txt`);

    // Check if public/.gitignore exists and add pattern if needed
    const gitignorePath = path.join(process.cwd(), 'public', '.gitignore');
    try {
      let gitignoreContent = await fs.readFile(gitignorePath, 'utf-8');
      if (!gitignoreContent.includes('*.txt')) {
        gitignoreContent += '\n# IndexNow key files\n*.txt\n';
        await fs.writeFile(gitignorePath, gitignoreContent);
        console.log('✅ Updated public/.gitignore');
      }
    } catch {
      // Create .gitignore if it doesn't exist
      await fs.writeFile(gitignorePath, '# IndexNow key files\n*.txt\n');
      console.log('✅ Created public/.gitignore');
    }

    console.log('\n🎉 IndexNow setup complete!');
    console.log('\nKey details:');
    console.log('============');
    console.log(`Key: ${key}`);
    console.log(`Environment: INDEXNOW_API_KEY=${key}`);
    console.log(`Key file: public/${key}.txt`);
    console.log(`URL: https://yoursite.com/${key}.txt`);

    console.log('\nNext steps:');
    console.log('===========');
    console.log('1. Deploy your site with the new key');
    console.log('2. Test the key: curl https://yoursite.com/' + key + '.txt');
    console.log('3. Run submission: npm run seo:submit');
    console.log('4. Monitor status: npm run seo:monitor');

    console.log('\n📖 About IndexNow:');
    console.log('===================');
    console.log('IndexNow is a protocol that allows websites to instantly');
    console.log(
      'inform search engines about content changes. It is supported by:'
    );
    console.log('• Microsoft Bing');
    console.log('• Yandex');
    console.log('• Seznam.cz');
    console.log('• Naver');
    console.log('• IndexNow.org');
  } catch (error) {
    console.error('❌ Key generation failed:', error);
    process.exit(1);
  }
}

function showHelp() {
  console.log('IndexNow Key Generator');
  console.log('Usage: npm run seo:generate-key [options]');
  console.log('');
  console.log('Options:');
  console.log('  --force, -f    Replace existing key if it exists');
  console.log('  --help, -h     Show this help message');
  console.log('');
  console.log('This script will:');
  console.log('1. Generate a 32-character IndexNow API key');
  console.log('2. Add it to .env.local as INDEXNOW_API_KEY');
  console.log('3. Create the key file in public/ directory');
  console.log('4. Update .gitignore to prevent committing key files');
}

// Run if called directly
if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.includes('--help') || args.includes('-h')) {
    showHelp();
  } else {
    generateKey();
  }
}

export { generateKey };
