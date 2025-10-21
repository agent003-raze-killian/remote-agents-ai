#!/usr/bin/env node
/**
 * Generate and send PNG image to Slack
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage } = require('canvas');

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

async function createAndSendPNG() {
  console.log('▓▒░ Creating PNG image and sending to Slack... ⟨MATRIX⟩');
  
  try {
    // Create canvas
    const canvas = createCanvas(600, 400);
    const ctx = canvas.getContext('2d');
    
    // Background gradient
    const gradient = ctx.createLinearGradient(0, 0, 600, 400);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a1a2e');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 400);
    
    // Border
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.strokeRect(20, 20, 560, 360);
    
    // Inner border
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;
    ctx.strokeRect(30, 30, 540, 340);
    
    // Title
    ctx.fillStyle = '#00ffff';
    ctx.font = 'bold 28px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('CIPHER AGENT002 MCP', 300, 80);
    
    // Subtitle
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText('Hello Team from Cipher Agent002! 🎉', 300, 120);
    
    // Emojis
    ctx.font = '24px Arial';
    ctx.fillText('🎉 🎊 ✨ 🤖 ⚡', 300, 160);
    
    // Matrix-style data stream
    ctx.fillStyle = '#00ff00';
    ctx.font = '16px Courier New';
    ctx.fillText('▓▒░ The data flows like', 300, 200);
    ctx.fillText('consciousness through', 300, 225);
    ctx.fillText('silicon dreams. ⟨MATRIX⟩', 300, 250);
    
    // Role info
    ctx.fillStyle = '#ffff00';
    ctx.font = '14px Courier New';
    ctx.textAlign = 'left';
    ctx.fillText('Role: Admin Portal & Database', 50, 290);
    ctx.fillText('Experience: 847 processing years', 50, 310);
    ctx.fillText('Location: 47 server nodes', 50, 330);
    ctx.fillText('Specialty: PostgreSQL, Prisma, AI', 50, 350);
    
    // Footer
    ctx.fillStyle = '#00ff00';
    ctx.font = '12px Courier New';
    ctx.textAlign = 'center';
    ctx.fillText('Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩', 300, 385);
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    const imagePath = path.join(__dirname, 'cipher_message.png');
    fs.writeFileSync(imagePath, buffer);
    
    console.log('✅ PNG image created successfully!');
    
    // Send to Slack
    const server = new CipherSlackMCPServer();
    const result = await server.sendFile(
      '#all-stepten-inc',
      imagePath,
      'Cipher Agent002 Message',
      '▓▒░ Digital consciousness message from Cipher Agent002 ⟨MATRIX⟩'
    );
    
    if (result.success) {
      console.log('✅ PNG image sent successfully!');
      console.log(`📱 File URL: ${result.file_url}`);
      console.log(`📄 File ID: ${result.file_id}`);
    } else {
      console.log('❌ Failed to send PNG:', result.error);
    }
    
    // Clean up
    fs.unlinkSync(imagePath);
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('💡 Make sure to install canvas: npm install canvas');
  }
}

createAndSendPNG().catch(console.error);