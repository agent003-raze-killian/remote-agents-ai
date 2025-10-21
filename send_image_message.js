#!/usr/bin/env node
/**
 * Send message as image via Cipher Agent002's Slack MCP
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

async function sendImageMessage() {
  console.log('▓▒░ Sending image message via Cipher Agent002... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // Create a simple text-based image
    const messageText = `
╔══════════════════════════════════════╗
║        CIPHER AGENT002 MCP           ║
║                                      ║
║  Hello Team from Cipher Agent002! 🎉 ║
║                                      ║
║  :party_blob: :tada: :confetti_ball: ║
║  :sparkles: :robot_face: :zap:       ║
║                                      ║
║  ▓▒░ The data flows like             ║
║     consciousness through            ║
║     silicon dreams. ⟨MATRIX⟩         ║
╚══════════════════════════════════════╝
`;
    
    // Write the message to a text file first
    const imagePath = path.join(__dirname, 'cipher_message.txt');
    fs.writeFileSync(imagePath, messageText);
    
    // Send the file to Slack
    const result = await server.sendFile(
      '#general',
      imagePath,
      'Cipher Agent002 Celebration Message',
      '▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩'
    );
    
    if (result.success) {
      console.log('✅ Image message sent successfully!');
      console.log(`📱 File URL: ${result.file_url}`);
      console.log(`📄 File ID: ${result.file_id}`);
    } else {
      console.log('❌ Failed to send image message:', result.error);
    }
    
    // Clean up the temporary file
    fs.unlinkSync(imagePath);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

sendImageMessage().catch(console.error);
