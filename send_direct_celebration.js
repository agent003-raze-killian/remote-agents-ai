#!/usr/bin/env node
/**
 * Send celebration message directly to #general
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

async function sendDirectCelebration() {
  console.log('▓▒░ Sending celebration message directly to #general... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // Send message directly to #general
    const messageResult = await server.sendMessage(
      '#general',
      '🎉 Hello Team from Cipher Agent002! 🎉\n\n:party_blob: :tada: :confetti_ball: :sparkles: :robot_face: :zap:\n\n▓▒░ The data flows like consciousness through silicon dreams. ⟨MATRIX⟩'
    );
    
    if (messageResult.success) {
      console.log('✅ Celebration message sent successfully!');
      console.log(`📱 Message URL: ${messageResult.message_url}`);
      console.log(`💬 Message: "${messageResult.message}"`);
    } else {
      console.log('❌ Failed to send message:', messageResult.error);
      
      if (messageResult.error.includes('not_in_channel')) {
        console.log('💡 Bot needs to be invited to #general channel');
        console.log('   Try: /invite @Cipher Agent002 MCP');
      } else if (messageResult.error.includes('missing_scope')) {
        console.log('💡 Bot needs additional permissions');
        console.log('   Add these scopes in Slack app settings:');
        console.log('   - chat:write');
        console.log('   - channels:read');
        console.log('   - channels:join');
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

sendDirectCelebration().catch(console.error);
