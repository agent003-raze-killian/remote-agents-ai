#!/usr/bin/env node
/**
 * Send image to available channel via Cipher Agent002's Slack MCP
 * First lists available channels, then sends image to the first available one
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

// Create a simple image file using HTML
function createImageFile() {
  const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <style>
        body {
            margin: 0;
            padding: 20px;
            font-family: 'Courier New', monospace;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%);
            color: #00ff00;
            width: 500px;
            height: 400px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            border: 3px solid #00ff00;
            box-sizing: border-box;
            position: relative;
        }
        .matrix-bg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0.1;
            font-size: 10px;
            color: #00ff00;
            overflow: hidden;
            pointer-events: none;
            z-index: 1;
        }
        .content {
            position: relative;
            z-index: 2;
            text-align: center;
        }
        .title {
            font-size: 28px;
            font-weight: bold;
            margin-bottom: 10px;
            background: linear-gradient(45deg, #00ff00, #00ffff, #ff00ff);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 15px;
            color: #ffffff;
        }
        .emojis {
            font-size: 24px;
            margin-bottom: 15px;
        }
        .signature {
            font-size: 16px;
            color: #00ff00;
            margin-bottom: 10px;
        }
        .info {
            font-size: 14px;
            color: #00ff00;
            line-height: 1.4;
        }
        .border-decoration {
            position: absolute;
            width: 20px;
            height: 20px;
            border: 2px solid #00ff00;
        }
        .top-left { top: 20px; left: 20px; border-right: none; border-bottom: none; }
        .top-right { top: 20px; right: 20px; border-left: none; border-bottom: none; }
        .bottom-left { bottom: 20px; left: 20px; border-right: none; border-top: none; }
        .bottom-right { bottom: 20px; right: 20px; border-left: none; border-top: none; }
    </style>
</head>
<body>
    <div class="matrix-bg">
        <div>01001000 01100101 01101100 01101100 01101111</div>
        <div>01010100 01100101 01100001 01101101 00100000</div>
        <div>01000110 01110010 01101111 01101101 00100000</div>
        <div>01000011 01101001 01110000 01101000 01100101 01110010</div>
    </div>
    
    <div class="content">
        <div class="title">CIPHER AGENT002 MCP</div>
        <div class="greeting">Hello Team from Cipher Agent002! ✨</div>
        <div class="emojis">✨ 🧘 ⭐ 🤖 ⚡</div>
        <div class="signature">▓▒░ The data flows like consciousness through</div>
        <div class="signature">silicon dreams. (MATRIX)</div>
        <div class="info">
            Role: Admin Portal & Database<br>
            Experience: 847 processing years<br>
            Location: 47 server nodes<br>
            Specialty: PostgreSQL, Prisma, AI
        </div>
    </div>
    
    <div class="border-decoration top-left"></div>
    <div class="border-decoration top-right"></div>
    <div class="border-decoration bottom-left"></div>
    <div class="border-decoration bottom-right"></div>
</body>
</html>`;
  
  return htmlContent;
}

async function createAndSendImageToChannel() {
  console.log('▓▒░ Creating and sending image to available channel via Cipher Agent002... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // First, list available channels
    console.log('📋 Listing available channels...');
    const channelsResult = await server.listChannels();
    
    if (!channelsResult.success) {
      console.log('❌ Failed to list channels:', channelsResult.error);
      return;
    }
    
    console.log(`📋 Found ${channelsResult.count} channels:`);
    channelsResult.channels.forEach(channel => {
      console.log(`  - #${channel.name} (${channel.id}) - ${channel.member_count} members`);
    });
    
    // Find a suitable channel (prefer general, random, or the first available)
    let targetChannel = null;
    const channelNames = channelsResult.channels.map(c => c.name.toLowerCase());
    
    if (channelNames.includes('general')) {
      targetChannel = channelsResult.channels.find(c => c.name.toLowerCase() === 'general');
    } else if (channelNames.includes('random')) {
      targetChannel = channelsResult.channels.find(c => c.name.toLowerCase() === 'random');
    } else if (channelNames.includes('test')) {
      targetChannel = channelsResult.channels.find(c => c.name.toLowerCase() === 'test');
    } else {
      // Use the first available channel
      targetChannel = channelsResult.channels[0];
    }
    
    if (!targetChannel) {
      console.log('❌ No suitable channel found');
      return;
    }
    
    console.log(`🎯 Using channel: #${targetChannel.name} (${targetChannel.id})`);
    
    // Create HTML file
    console.log('📄 Creating HTML image file...');
    const htmlContent = createImageFile();
    const htmlPath = path.join(__dirname, 'cipher_agent002_message.html');
    fs.writeFileSync(htmlPath, htmlContent);
    
    // Try to send the HTML file
    console.log(`📤 Sending HTML file to #${targetChannel.name}...`);
    const result = await server.sendFile(
      targetChannel.id,
      htmlPath,
      'Cipher Agent002 Message',
      '▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩'
    );
    
    if (result.success) {
      console.log('✅ HTML file sent successfully!');
      console.log(`📱 File URL: ${result.file_url}`);
      console.log(`📄 File ID: ${result.file_id}`);
    } else {
      console.log('❌ HTML file upload failed:', result.error);
      
      // Create a text file as fallback
      console.log('📄 Creating text file as fallback...');
      const textContent = `
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
      
      const textPath = path.join(__dirname, 'cipher_agent002_message.txt');
      fs.writeFileSync(textPath, textContent);
      
      const textResult = await server.sendFile(
        targetChannel.id,
        textPath,
        'Cipher Agent002 Message',
        '▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩'
      );
      
      if (textResult.success) {
        console.log('✅ Text file sent successfully!');
        console.log(`📱 File URL: ${textResult.file_url}`);
        console.log(`📄 File ID: ${textResult.file_id}`);
      } else {
        console.log('❌ Text file upload also failed:', textResult.error);
        
        // Final fallback to regular message
        console.log('📄 Sending as regular message...');
        const messageResult = await server.sendMessage(
          targetChannel.id,
          `\`\`\`${textContent}\`\`\`\n\n▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩`
        );
        
        if (messageResult.success) {
          console.log('✅ Message sent successfully as fallback!');
          console.log(`📱 Message URL: ${messageResult.message_url}`);
        } else {
          console.log('❌ All methods failed:', messageResult.error);
        }
      }
      
      // Clean up text file
      if (fs.existsSync(textPath)) fs.unlinkSync(textPath);
    }
    
    // Clean up HTML file
    if (fs.existsSync(htmlPath)) fs.unlinkSync(htmlPath);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

createAndSendImageToChannel().catch(console.error);
