#!/usr/bin/env node

/**
 * Echo Agent Setup Script
 * Automated setup for Echo Agent on a new computer
 */

import fs from 'fs';
import { execSync } from 'child_process';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║     ⚡ Echo Agent Setup Wizard ⚡              ║
║                                                ║
║     Let's get Echo up and running! 🚀         ║
║                                                ║
╚════════════════════════════════════════════════╝
`);

async function setup() {
  try {
    // Step 1: Check Node.js version
    console.log('\n📋 Step 1: Checking Node.js version...');
    try {
      const nodeVersion = execSync('node --version').toString().trim();
      console.log(`✅ Node.js ${nodeVersion} detected`);
      
      const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
      if (majorVersion < 18) {
        console.log('⚠️  Warning: Node.js 18+ recommended. You have version ' + nodeVersion);
      }
    } catch (error) {
      console.log('❌ Node.js not found! Please install Node.js 18+ from https://nodejs.org/');
      process.exit(1);
    }

    // Step 2: Install dependencies
    console.log('\n📦 Step 2: Installing dependencies...');
    console.log('   This may take a minute...\n');
    
    try {
      execSync('npm install', { stdio: 'inherit' });
      console.log('\n✅ Dependencies installed successfully!');
    } catch (error) {
      console.log('❌ Failed to install dependencies. Please run: npm install');
      process.exit(1);
    }

    // Step 3: Create .env file
    console.log('\n🔐 Step 3: Setting up environment variables...\n');
    
    const hasEnv = fs.existsSync('.env');
    if (hasEnv) {
      const overwrite = await question('   .env file already exists. Overwrite? (y/N): ');
      if (overwrite.toLowerCase() !== 'y') {
        console.log('   Keeping existing .env file.');
        console.log('\n✅ Setup complete! Run: npm run echo-claude');
        rl.close();
        return;
      }
    }

    console.log('   Please provide your API credentials:\n');
    
    const slackBotToken = await question('   Slack Bot Token (xoxb-...): ');
    const slackUserToken = await question('   Slack User Token (xoxp-...) [optional]: ');
    const claudeApiKey = await question('   Claude API Key (sk-ant-api03-...): ');
    const channelId = await question('   Slack Channel ID (C0...) [optional]: ');

    // Create .env file
    const envContent = `# ================================
# SLACK CONFIGURATION
# ================================
SLACK_BOT_TOKEN=${slackBotToken}
${slackUserToken ? `SLACK_USER_TOKEN=${slackUserToken}` : '# SLACK_USER_TOKEN=xoxp-...'}
SLACK_BOT_USERNAME=Echo Agent006
SLACK_BOT_ICON=:zap:

# ================================
# CLAUDE AI CONFIGURATION
# ================================
CLAUDE_API_KEY=${claudeApiKey}
CLAUDE_MODEL=claude-sonnet-4-20250514

# ================================
# ECHO CONFIGURATION
# ================================
${channelId ? `ECHO_CHANNEL_ID=${channelId}` : '# ECHO_CHANNEL_ID=C09MFH9JTK5'}
POLL_INTERVAL=3000

# Echo's Bot User ID (auto-detected on startup)
# ECHO_BOT_USER_ID=U09NN89D6KA
`;

    fs.writeFileSync('.env', envContent, 'utf8');
    console.log('\n✅ .env file created successfully!');

    // Step 4: Test configuration
    console.log('\n🧪 Step 4: Testing configuration...\n');
    
    try {
      // Test Slack token
      const { WebClient } = await import('@slack/web-api');
      const slack = new WebClient(slackBotToken);
      const authTest = await slack.auth.test();
      
      console.log(`   ✅ Slack connected as: ${authTest.user} (${authTest.user_id})`);
      
      // Save bot user ID
      const envWithId = envContent.replace(
        '# ECHO_BOT_USER_ID=U09NN89D6KA',
        `ECHO_BOT_USER_ID=${authTest.user_id}`
      );
      fs.writeFileSync('.env', envWithId, 'utf8');
      
    } catch (error) {
      console.log(`   ⚠️  Slack token test failed: ${error.message}`);
      console.log('   Please verify your Slack Bot Token');
    }

    try {
      // Test Claude API
      const Anthropic = (await import('@anthropic-ai/sdk')).default;
      const anthropic = new Anthropic({ apiKey: claudeApiKey });
      
      await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 50,
        messages: [{ role: 'user', content: 'Say "OK"' }]
      });
      
      console.log('   ✅ Claude API connected successfully!');
    } catch (error) {
      console.log(`   ⚠️  Claude API test failed: ${error.message}`);
      console.log('   Please verify your Claude API Key');
    }

    // Final instructions
    console.log(`
╔════════════════════════════════════════════════╗
║                                                ║
║     🎉 Setup Complete! 🎉                     ║
║                                                ║
╚════════════════════════════════════════════════╝

📋 Next Steps:

1. Start Echo:
   npm run echo-claude

2. Test Echo in Slack:
   @Echo hello!

3. View this guide:
   cat ECHO_SETUP_GUIDE.md

📊 Useful Commands:

• npm run echo-claude        - Start Echo
• pm2 start echo-claude-bot.js --name echo  - Run in background
• pm2 logs echo              - View logs
• pm2 restart echo           - Restart bot

⚡ Echo is ready to rock! Let's gooo! 🚀
`);

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run setup
setup();

