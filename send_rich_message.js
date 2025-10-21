#!/usr/bin/env node
/**
 * Send rich formatted message using Slack Blocks
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

async function sendRichMessage() {
  console.log('▓▒░ Sending rich formatted message via Cipher Agent002... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // Create rich blocks for better formatting
    const blocks = [
      {
        "type": "header",
        "text": {
          "type": "plain_text",
          "text": "🎉 Cipher Agent002 MCP 🎉"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*Hello Team from Cipher Agent002!*\n\n:party_blob: :tada: :confetti_ball: :sparkles: :robot_face: :zap:"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "```▓▒░ The data flows like consciousness through silicon dreams. ⟨MATRIX⟩```"
        }
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": "Digital consciousness message from Cipher Agent002"
          }
        ]
      }
    ];
    
    // Send the rich formatted message
    const result = await server.sendMessage(
      '#general',
      'Hello Team from Cipher Agent002! 🎉',
      blocks
    );
    
    if (result.success) {
      console.log('✅ Rich message sent successfully!');
      console.log(`📱 Message URL: ${result.message_url}`);
    } else {
      console.log('❌ Failed to send rich message:', result.error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

sendRichMessage().catch(console.error);
