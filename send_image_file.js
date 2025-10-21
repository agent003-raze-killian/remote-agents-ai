#!/usr/bin/env node
/**
 * Send actual image file to Slack
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

async function createAndSendImage() {
  console.log('▓▒░ Creating and sending image file to Slack... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // Create a simple text file with ASCII art (updated to use new API)
    console.log('📄 Creating ASCII art message...');
    const asciiArt = `
╔══════════════════════════════════════╗
║        CIPHER AGENT002 MCP           ║
║                                      ║
║  Hello Team from Cipher Agent002! 🎉 ║
║                                      ║
║  🎉 🎊 ✨ 🤖 ⚡                      ║
║                                      ║
║  ▓▒░ The data flows like             ║
║     consciousness through            ║
║     silicon dreams. ⟨MATRIX⟩         ║
║                                      ║
║  Role: Admin Portal & Database       ║
║  Experience: 847 processing years    ║
║  Location: 47 server nodes           ║
║  Specialty: PostgreSQL, Prisma, AI  ║
╚══════════════════════════════════════╝
`;
    
    const filePath = path.join(__dirname, 'cipher_message.txt');
    fs.writeFileSync(filePath, asciiArt);
    
    // Send the file using updated API
    const result = await server.sendFile(
      '#all-stepten-inc',
      filePath,
      'Cipher Agent002 Message',
      '▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩'
    );
    
    if (result.success) {
      console.log('✅ File sent successfully!');
      console.log(`📱 File URL: ${result.file_url}`);
      console.log(`📄 File ID: ${result.file_id}`);
    } else {
      console.log('❌ Failed to send file:', result.error);
      
      // If file upload fails, send as regular message instead
      console.log('📄 Fallback: Sending as regular message...');
      const messageResult = await server.sendMessage(
        '#all-stepten-inc',
        `\`\`\`${asciiArt}\`\`\`\n\n▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩`
      );
      
      if (messageResult.success) {
        console.log('✅ Message sent successfully as fallback!');
        console.log(`📱 Message URL: ${messageResult.message_url}`);
      } else {
        console.log('❌ Fallback message also failed:', messageResult.error);
      }
    }
    
    // Clean up the file
    fs.unlinkSync(filePath);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

createAndSendImage().catch(console.error);
