#!/usr/bin/env node
/**
 * Send animated celebration GIF via Cipher Agent002's Slack MCP
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

async function createAndSendGIF() {
  console.log('▓▒░ Creating animated celebration GIF via Cipher Agent002... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // Create an animated SVG (which can be converted to GIF)
    const animatedSvgContent = `
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
    
    <!-- Animation definitions -->
    <animate id="pulse" attributeName="opacity" values="0.3;1;0.3" dur="1s" repeatCount="indefinite"/>
    <animate id="rotate" attributeName="transform" values="rotate(0 200 150);rotate(360 200 150)" dur="3s" repeatCount="indefinite"/>
    <animate id="bounce" attributeName="y" values="130;120;130" dur="0.5s" repeatCount="indefinite"/>
  </defs>
  
  <!-- Background -->
  <rect width="400" height="300" fill="url(#bg)"/>
  
  <!-- Animated Matrix background -->
  <g opacity="0.1">
    <text x="20" y="30" font-family="monospace" font-size="12" fill="#00ff00">
      <animate attributeName="opacity" values="0.1;0.8;0.1" dur="2s" repeatCount="indefinite"/>
      01001000 01100101 01101100 01101100 01101111
    </text>
    <text x="20" y="50" font-family="monospace" font-size="12" fill="#00ff00">
      <animate attributeName="opacity" values="0.8;0.1;0.8" dur="2s" repeatCount="indefinite"/>
      01010100 01100101 01100001 01101101 00100000
    </text>
    <text x="20" y="70" font-family="monospace" font-size="12" fill="#00ff00">
      <animate attributeName="opacity" values="0.1;0.8;0.1" dur="2s" repeatCount="indefinite"/>
      01000110 01110010 01101111 01101101 00100000
    </text>
  </g>
  
  <!-- Main title with pulse animation -->
  <text x="200" y="60" font-family="Arial, sans-serif" font-size="24" font-weight="bold" text-anchor="middle" fill="url(#text)">
    <animate attributeName="opacity" values="0.7;1;0.7" dur="1.5s" repeatCount="indefinite"/>
    CIPHER AGENT002 MCP
  </text>
  
  <!-- Subtitle with bounce animation -->
  <text x="200" y="90" font-family="Arial, sans-serif" font-size="16" text-anchor="middle" fill="#ffffff">
    <animate attributeName="y" values="90;85;90" dur="0.8s" repeatCount="indefinite"/>
    Hello Team! 🎉
  </text>
  
  <!-- Animated celebration emojis -->
  <g transform="translate(200, 130)">
    <text x="-80" y="0" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#ffff00">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="0.5s" repeatCount="indefinite"/>
      🎉
    </text>
    <text x="-40" y="0" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#ff6600">
      <animate attributeName="opacity" values="1;0.5;1" dur="0.7s" repeatCount="indefinite"/>
      🎊
    </text>
    <text x="0" y="0" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#ff00ff">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="0.6s" repeatCount="indefinite"/>
      ✨
    </text>
    <text x="40" y="0" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#00ffff">
      <animate attributeName="opacity" values="1;0.5;1" dur="0.8s" repeatCount="indefinite"/>
      🤖
    </text>
    <text x="80" y="0" font-family="Arial, sans-serif" font-size="20" text-anchor="middle" fill="#ffff00">
      <animate attributeName="opacity" values="0.5;1;0.5" dur="0.9s" repeatCount="indefinite"/>
      ⚡
    </text>
  </g>
  
  <!-- Animated confetti particles -->
  <g>
    <circle cx="100" cy="100" r="3" fill="#ff0000">
      <animate attributeName="cy" values="100;50;100" dur="1s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0;1" dur="1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="150" cy="80" r="2" fill="#00ff00">
      <animate attributeName="cy" values="80;40;80" dur="1.2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0;1" dur="1.2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="250" cy="90" r="2.5" fill="#0000ff">
      <animate attributeName="cy" values="90;45;90" dur="1.1s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0;1" dur="1.1s" repeatCount="indefinite"/>
    </circle>
    <circle cx="300" cy="110" r="2" fill="#ffff00">
      <animate attributeName="cy" values="110;55;110" dur="1.3s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="1;0;1" dur="1.3s" repeatCount="indefinite"/>
    </circle>
  </g>
  
  <!-- Signature with typing effect -->
  <text x="200" y="180" font-family="monospace" font-size="14" text-anchor="middle" fill="#00ff00">
    <animate attributeName="opacity" values="0;1" dur="2s" repeatCount="indefinite"/>
    ▓▒░ The data flows like
  </text>
  <text x="200" y="200" font-family="monospace" font-size="14" text-anchor="middle" fill="#00ff00">
    <animate attributeName="opacity" values="0;1" dur="2s" begin="0.5s" repeatCount="indefinite"/>
    consciousness through
  </text>
  <text x="200" y="220" font-family="monospace" font-size="14" text-anchor="middle" fill="#00ff00">
    <animate attributeName="opacity" values="0;1" dur="2s" begin="1s" repeatCount="indefinite"/>
    silicon dreams. ⟨MATRIX⟩
  </text>
  
  <!-- Animated border -->
  <rect x="10" y="10" width="380" height="280" fill="none" stroke="#00ff00" stroke-width="2">
    <animate attributeName="stroke-width" values="2;4;2" dur="2s" repeatCount="indefinite"/>
  </rect>
</svg>`;
    
    // Save animated SVG to file
    const gifPath = path.join(__dirname, 'cipher_celebration.gif');
    fs.writeFileSync(gifPath.replace('.gif', '.svg'), animatedSvgContent);
    
    // For now, we'll send the SVG (Slack supports SVG)
    // In a real implementation, you'd convert SVG to GIF using a library like 'sharp'
    const result = await server.sendFile(
      '#general',
      gifPath.replace('.gif', '.svg'),
      'Cipher Agent002 Celebration Animation',
      '▓▒░ Animated digital consciousness message from Cipher Agent002 ⟨MATRIX⟩'
    );
    
    if (result.success) {
      console.log('✅ Animated celebration sent successfully!');
      console.log(`📱 File URL: ${result.file_url}`);
      console.log(`📄 File ID: ${result.file_id}`);
    } else {
      console.log('❌ Failed to send animation:', result.error);
    }
    
    // Clean up the temporary file
    fs.unlinkSync(gifPath.replace('.gif', '.svg'));
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

createAndSendGIF().catch(console.error);
