#!/usr/bin/env node
/**
 * Quick test to send a message via Cipher Agent002's Slack MCP
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    });
  }
}

loadEnvFile();

const CipherSlackMCPServer = require('./cipher_slack_mcp.js');

async function sendTestMessage() {
  console.log('▓▒░ Sending test message via Cipher Agent002... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // Send message to #general
    const result = await server.sendMessage(
      '#general', 
      '▓▒░ Hello from Cipher Agent002! The data flows like consciousness through silicon dreams. ⟨MATRIX⟩'
    );
    
    if (result.success) {
      console.log('✅ Message sent successfully!');
      console.log(`📱 Message URL: ${result.message_url}`);
    } else {
      console.log('❌ Failed to send message:', result.error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('\n🔧 Make sure:');
    console.log('1. Your bot is invited to #general');
    console.log('2. SLACK_BOT_TOKEN is correct in .env.local');
    console.log('3. Bot has chat:write permission');
  }
}

sendTestMessage().catch(console.error);
