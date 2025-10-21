#!/usr/bin/env node
/**
 * Send actual image file via Cipher Agent002's Slack MCP
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
  console.log('▓▒░ Creating and sending image via Cipher Agent002... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // Create a simple SVG image
    const svgContent = `
<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="text" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00ff00;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#00ffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff00ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="300" fill="url(#bg)"/>
  
  <!-- Matrix-style background pattern -->
  <g opacity="0.1">
    <text x="20" y="30" font-family="monospace" font-size="12" fill="#00ff00">01001000 01100101 01101100 01101100 01101111</text>
    <text x="20" y="50" font-family="monospace" font-size="12" fill="#00ff00">01010100 01100101 01100001 01101101 00100000</text>
    <text x="20" y="70" font-family="monospace" font-size="12" fill="#00ff00">01000110 01110010 01101111 01101101 00100000</text>
    <text x="20" y="90" font-family="monospace" font-size="12" fill="#00ff00">01000011 01101001 01110000 01101000 01100101 01110010</text>
  </g>
  
  <!-- Main title -->
  <text x="200" y="60" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="url(#text)">CIPHER AGENT002 MCP</text>
  
  <!-- Subtitle -->
  <text x="200" y="90" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#ffffff">Hello Team! 🎉</text>
  
  <!-- Celebration emojis -->
  <text x="200" y="130" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#ffff00">🎉 🎊 ✨ 🤖 ⚡</text>
  
  <!-- Signature -->
  <text x="200" y="180" font-family="monospace" font-size="14" text-anchor="middle" fill="#00ff00">▓▒░ The data flows like</text>
  <text x="200" y="200" font-family="monospace" font-size="14" text-anchor="middle" fill="#00ff00">consciousness through</text>
  <text x="200" y="220" font-family="monospace" font-size="14" text-anchor="middle" fill="#00ff00">silicon dreams. ⟨MATRIX⟩</text>
  
  <!-- Border -->
  <rect x="10" y="10" width="380" height="280" fill="none" stroke="#00ff00" stroke-width="2"/>
</svg>`;
    
    // Save SVG to file
    const imagePath = path.join(__dirname, 'cipher_message.svg');
    fs.writeFileSync(imagePath, svgContent);
    
    // Send the image file to Slack
    const result = await server.sendFile(
      '#general',
      imagePath,
      'Cipher Agent002 Celebration Message',
      '▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩'
    );
    
    if (result.success) {
      console.log('✅ Image sent successfully!');
      console.log(`📱 File URL: ${result.file_url}`);
      console.log(`📄 File ID: ${result.file_id}`);
    } else {
      console.log('❌ Failed to send image:', result.error);
    }
    
    // Clean up the temporary file
    fs.unlinkSync(imagePath);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

createAndSendImage().catch(console.error);
