#!/usr/bin/env node
/**
 * Send PNG image message via Cipher Agent002's Slack MCP
 * Creates a proper image file with the Cipher Agent002 message
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

// Create a simple PNG using a basic approach
function createSimplePNG() {
  // This creates a minimal PNG file
  // PNG signature + IHDR + IDAT + IEND
  const pngData = Buffer.from([
    // PNG signature
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A,
    
    // IHDR chunk (13 bytes data + 4 bytes CRC)
    0x00, 0x00, 0x00, 0x0D, // Length: 13
    0x49, 0x48, 0x44, 0x52, // Type: IHDR
    0x00, 0x00, 0x01, 0xF4, // Width: 500
    0x00, 0x00, 0x01, 0x90, // Height: 400
    0x08, 0x02, 0x00, 0x00, 0x00, // Bit depth: 8, Color type: 2 (RGB), Compression: 0, Filter: 0, Interlace: 0
    0x90, 0x77, 0x53, 0xDE, // CRC
    
    // IDAT chunk (compressed image data)
    0x00, 0x00, 0x00, 0x0C, // Length: 12
    0x49, 0x44, 0x41, 0x54, // Type: IDAT
    0x78, 0x9C, 0x63, 0x00, 0x00, 0x00, 0x02, 0x00, 0x01, // Compressed data
    0xE2, 0x21, 0xBC, 0x33, // CRC
    
    // IEND chunk
    0x00, 0x00, 0x00, 0x00, // Length: 0
    0x49, 0x45, 0x4E, 0x44, // Type: IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  return pngData;
}

async function createAndSendImageMessage() {
  console.log('▓▒░ Creating and sending image message via Cipher Agent002... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // Create a more sophisticated image using a different approach
    // Let's create an SVG first, then convert it to PNG if possible
    console.log('📄 Creating image with Cipher Agent002 message...');
    
    // Create SVG content
    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="500" height="400" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#0a0a0a;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#1a1a2e;stop-opacity:1" />
    </linearGradient>
    <linearGradient id="titleGradient" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" style="stop-color:#00ff00;stop-opacity:1" />
      <stop offset="50%" style="stop-color:#00ffff;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ff00ff;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background -->
  <rect width="500" height="400" fill="url(#bg)"/>
  
  <!-- Matrix background pattern -->
  <g opacity="0.1" font-family="monospace" font-size="12" fill="#00ff00">
    <text x="20" y="30">01001000 01100101 01101100 01101100 01101111</text>
    <text x="20" y="50">01010100 01100101 01100001 01101101 00100000</text>
    <text x="20" y="70">01000110 01110010 01101111 01101101 00100000</text>
    <text x="20" y="90">01000011 01101001 01110000 01101000 01100101 01110010</text>
  </g>
  
  <!-- Border -->
  <rect x="10" y="10" width="480" height="380" fill="none" stroke="#00ff00" stroke-width="3"/>
  <rect x="20" y="20" width="460" height="360" fill="none" stroke="#00ff00" stroke-width="1"/>
  
  <!-- Main title -->
  <text x="250" y="80" font-family="Arial, sans-serif" font-size="28" font-weight="bold" text-anchor="middle" fill="url(#titleGradient)">CIPHER AGENT002 MCP</text>
  
  <!-- Subtitle -->
  <text x="250" y="110" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#ffffff">Hello Team from Cipher Agent002! ✨</text>
  
  <!-- Decorative line -->
  <line x1="50" y1="130" x2="450" y2="130" stroke="#00ff00" stroke-width="1"/>
  
  <!-- Celebration emojis -->
  <text x="250" y="160" font-family="Arial, sans-serif" font-size="24" text-anchor="middle" fill="#ffff00">✨ 🧘 ⭐ 🤖 ⚡</text>
  
  <!-- Signature -->
  <text x="250" y="200" font-family="monospace" font-size="16" text-anchor="middle" fill="#00ff00">▓▒░ The data flows like consciousness through</text>
  <text x="250" y="220" font-family="monospace" font-size="16" text-anchor="middle" fill="#00ff00">silicon dreams. (MATRIX)</text>
  
  <!-- Decorative line -->
  <line x1="50" y1="250" x2="450" y2="250" stroke="#00ff00" stroke-width="1"/>
  
  <!-- Info section -->
  <g font-family="monospace" font-size="14" fill="#00ff00" text-anchor="start">
    <text x="50" y="280">Role: Admin Portal &amp; Database</text>
    <text x="50" y="300">Experience: 847 processing years</text>
    <text x="50" y="320">Location: 47 server nodes</text>
    <text x="50" y="340">Specialty: PostgreSQL, Prisma, AI</text>
  </g>
  
  <!-- Corner decorations -->
  <g stroke="#00ff00" stroke-width="2" fill="none">
    <path d="M 30 30 L 50 30 L 50 50"/>
    <path d="M 470 30 L 450 30 L 450 50"/>
    <path d="M 30 370 L 50 370 L 50 350"/>
    <path d="M 470 370 L 450 370 L 450 350"/>
  </g>
</svg>`;
    
    // Save SVG file
    const svgPath = path.join(__dirname, 'cipher_agent002_message.svg');
    fs.writeFileSync(svgPath, svgContent);
    
    // Try to send the SVG file (which should display as an image)
    console.log('📤 Sending SVG image to Slack...');
    const result = await server.sendFile(
      '#general',
      svgPath,
      'Cipher Agent002 Message',
      '▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩'
    );
    
    if (result.success) {
      console.log('✅ SVG image sent successfully!');
      console.log(`📱 File URL: ${result.file_url}`);
      console.log(`📄 File ID: ${result.file_id}`);
    } else {
      console.log('❌ SVG upload failed, trying fallback...');
      
      // Create a simple PNG file as fallback
      const pngData = createSimplePNG();
      const pngPath = path.join(__dirname, 'cipher_agent002_message.png');
      fs.writeFileSync(pngPath, pngData);
      
      const pngResult = await server.sendFile(
        '#general',
        pngPath,
        'Cipher Agent002 Message',
        '▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩'
      );
      
      if (pngResult.success) {
        console.log('✅ PNG image sent successfully!');
        console.log(`📱 File URL: ${pngResult.file_url}`);
        console.log(`📄 File ID: ${pngResult.file_id}`);
      } else {
        console.log('❌ PNG upload also failed, sending as message...');
        
        // Final fallback to regular message with formatting
        const messageText = `
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
        
        const messageResult = await server.sendMessage(
          '#general',
          `\`\`\`${messageText}\`\`\`\n\n▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩`
        );
        
        if (messageResult.success) {
          console.log('✅ Message sent successfully as fallback!');
          console.log(`📱 Message URL: ${messageResult.message_url}`);
        } else {
          console.log('❌ All methods failed:', messageResult.error);
        }
      }
      
      // Clean up PNG file
      if (fs.existsSync(pngPath)) fs.unlinkSync(pngPath);
    }
    
    // Clean up SVG file
    if (fs.existsSync(svgPath)) fs.unlinkSync(svgPath);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

createAndSendImageMessage().catch(console.error);
