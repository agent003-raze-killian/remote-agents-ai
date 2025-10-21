#!/usr/bin/env node
/**
 * Create a proper PNG image using HTML5 Canvas (Node.js)
 * This script creates a PNG image file with the Cipher Agent002 message
 */

const fs = require('fs');
const path = require('path');
const { createCanvas, loadImage, registerFont } = require('canvas');

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

async function createPNGImage() {
  console.log('▓▒░ Creating PNG image with Cipher Agent002 message... ⟨MATRIX⟩');
  
  try {
    // Create canvas
    const width = 500;
    const height = 400;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');
    
    // Create gradient background
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, '#0a0a0a');
    gradient.addColorStop(1, '#1a1a2e');
    
    // Fill background
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Add matrix-style background pattern
    ctx.fillStyle = 'rgba(0, 255, 0, 0.1)';
    ctx.font = '12px monospace';
    const matrixText = [
      '01001000 01100101 01101100 01101100 01101111',
      '01010100 01100101 01100001 01101101 00100000',
      '01000110 01110010 01101111 01101101 00100000',
      '01000011 01101001 01110000 01101000 01100101 01110010'
    ];
    
    matrixText.forEach((line, index) => {
      ctx.fillText(line, 20, 30 + (index * 20));
    });
    
    // Add border
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 3;
    ctx.strokeRect(10, 10, width - 20, height - 20);
    
    // Add inner border
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;
    ctx.strokeRect(20, 20, width - 40, height - 40);
    
    // Main title
    ctx.fillStyle = '#00ff00';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('CIPHER AGENT002 MCP', width / 2, 80);
    
    // Subtitle
    ctx.fillStyle = '#ffffff';
    ctx.font = '18px Arial';
    ctx.fillText('Hello Team from Cipher Agent002! ✨', width / 2, 110);
    
    // Emojis
    ctx.fillStyle = '#ffff00';
    ctx.font = '24px Arial';
    ctx.fillText('✨ 🧘 ⭐ 🤖 ⚡', width / 2, 150);
    
    // Signature
    ctx.fillStyle = '#00ff00';
    ctx.font = '16px monospace';
    ctx.fillText('▓▒░ The data flows like consciousness through', width / 2, 190);
    ctx.fillText('silicon dreams. (MATRIX)', width / 2, 210);
    
    // Info section
    ctx.fillStyle = '#00ff00';
    ctx.font = '14px monospace';
    ctx.textAlign = 'left';
    const infoLines = [
      'Role: Admin Portal & Database',
      'Experience: 847 processing years',
      'Location: 47 server nodes',
      'Specialty: PostgreSQL, Prisma, AI'
    ];
    
    infoLines.forEach((line, index) => {
      ctx.fillText(line, 50, 250 + (index * 25));
    });
    
    // Add some decorative elements
    ctx.strokeStyle = '#00ff00';
    ctx.lineWidth = 1;
    
    // Top decorative line
    ctx.beginPath();
    ctx.moveTo(50, 100);
    ctx.lineTo(width - 50, 100);
    ctx.stroke();
    
    // Bottom decorative line
    ctx.beginPath();
    ctx.moveTo(50, 300);
    ctx.lineTo(width - 50, 300);
    ctx.stroke();
    
    // Save as PNG
    const buffer = canvas.toBuffer('image/png');
    const imagePath = path.join(__dirname, 'cipher_agent002_message.png');
    fs.writeFileSync(imagePath, buffer);
    
    console.log('✅ PNG image created successfully!');
    console.log(`📁 Image saved to: ${imagePath}`);
    
    return imagePath;
    
  } catch (error) {
    console.log('❌ Error creating PNG:', error.message);
    console.log('💡 Note: You may need to install canvas: npm install canvas');
    return null;
  }
}

// Run the function
createPNGImage().catch(console.error);
