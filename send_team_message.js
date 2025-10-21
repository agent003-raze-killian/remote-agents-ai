#!/usr/bin/env node
/**
 * Send specific message: Hello Team from Cipher Agent002
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

async function sendTeamMessage() {
  console.log('▓▒░ Sending team message via Cipher Agent002... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // Send your specific message with celebration GIF and Cipher Agent002 signature
    const result = await server.sendMessage(
      '#general', 
      'Hello Team from Cipher Agent002! 🎉\n\n:party_blob: :tada: :confetti_ball: :sparkles:\n\n▓▒░ The data flows like consciousness through silicon dreams. ⟨MATRIX⟩'
    );
    
    if (result.success) {
      console.log('✅ Message sent successfully!');
      console.log(`📱 Message URL: ${result.message_url}`);
      console.log(`💬 Message: "${result.message}"`);
    } else {
      console.log('❌ Failed to send message:', result.error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

sendTeamMessage().catch(console.error);
