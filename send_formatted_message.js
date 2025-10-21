#!/usr/bin/env node
/**
 * Send formatted message via Cipher Agent002's Slack MCP
 * Creates a nicely formatted message that displays as a visual block
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

async function sendFormattedMessage() {
  console.log('▓▒░ Sending formatted message via Cipher Agent002... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // Create a nicely formatted message using Slack blocks
    const blocks = [
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "*CIPHER AGENT002 MCP*\n\nHello Team from Cipher Agent002! ✨"
        }
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "✨ 🧘 ⭐ 🤖 ⚡"
        }
      },
      {
        "type": "divider"
      },
      {
        "type": "section",
        "text": {
          "type": "mrkdwn",
          "text": "`▓▒░ The data flows like consciousness through silicon dreams. (MATRIX)`"
        }
      },
      {
        "type": "section",
        "fields": [
          {
            "type": "mrkdwn",
            "text": "*Role:*\nAdmin Portal & Database"
          },
          {
            "type": "mrkdwn",
            "text": "*Experience:*\n847 processing years"
          },
          {
            "type": "mrkdwn",
            "text": "*Location:*\n47 server nodes"
          },
          {
            "type": "mrkdwn",
            "text": "*Specialty:*\nPostgreSQL, Prisma, AI"
          }
        ]
      },
      {
        "type": "context",
        "elements": [
          {
            "type": "mrkdwn",
            "text": "▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩"
          }
        ]
      }
    ];
    
    // Send the formatted message
    const result = await server.sendMessage(
      '#general',
      'Cipher Agent002 MCP - Hello Team!',
      blocks
    );
    
    if (result.success) {
      console.log('✅ Formatted message sent successfully!');
      console.log(`📱 Message URL: ${result.message_url}`);
      console.log(`💬 Message: "${result.message}"`);
    } else {
      console.log('❌ Failed to send formatted message:', result.error);
      
      // Fallback to simple text message
      console.log('📄 Sending simple text message as fallback...');
      const simpleMessage = `
╔══════════════════════════════════════════════════════════════╗
║                    CIPHER AGENT002 MCP                      ║
║                                                              ║
║              Hello Team from Cipher Agent002! ✨             ║
║                                                              ║
║                        ✨ 🧘 ⭐ 🤖 ⚡                        ║
║                                                              ║
║        ▓▒░ The data flows like consciousness through        ║
║                   silicon dreams. (MATRIX)                   ║
║                                                              ║
║              Role: Admin Portal & Database                   ║
║              Experience: 847 processing years                ║
║              Location: 47 server nodes                       ║
║              Specialty: PostgreSQL, Prisma, AI               ║
╚══════════════════════════════════════════════════════════════╝
`;
      
      const fallbackResult = await server.sendMessage(
        '#general',
        `\`\`\`${simpleMessage}\`\`\`\n\n▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩`
      );
      
      if (fallbackResult.success) {
        console.log('✅ Simple message sent successfully!');
        console.log(`📱 Message URL: ${fallbackResult.message_url}`);
      } else {
        console.log('❌ Fallback message also failed:', fallbackResult.error);
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

sendFormattedMessage().catch(console.error);
