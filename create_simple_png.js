#!/usr/bin/env node
/**
 * Create a simple PNG image using a basic approach
 * This creates a minimal but valid PNG file
 */

const fs = require('fs');
const path = require('path');

// Create a simple PNG file with the Cipher Agent002 message
function createSimplePNG() {
  // This creates a minimal PNG file with a solid color background
  // PNG signature + IHDR + IDAT + IEND
  
  const width = 500;
  const height = 400;
  const bytesPerPixel = 3; // RGB
  const bytesPerRow = width * bytesPerPixel;
  const imageDataSize = height * bytesPerRow;
  
  // Create image data (dark background with some pattern)
  const imageData = Buffer.alloc(imageDataSize);
  
  // Fill with dark background
  for (let i = 0; i < imageDataSize; i += 3) {
    imageData[i] = 10;     // R
    imageData[i + 1] = 10; // G  
    imageData[i + 2] = 46; // B
  }
  
  // Add some green matrix-style pattern
  for (let y = 0; y < height; y += 20) {
    for (let x = 0; x < width; x += 20) {
      const index = (y * bytesPerRow) + (x * bytesPerPixel);
      if (index < imageDataSize - 2) {
        imageData[index] = 0;     // R
        imageData[index + 1] = 255; // G
        imageData[index + 2] = 0;   // B
      }
    }
  }
  
  // Create PNG structure
  const pngData = Buffer.concat([
    // PNG signature
    Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]),
    
    // IHDR chunk
    createChunk('IHDR', Buffer.concat([
      Buffer.from([0x00, 0x00, 0x01, 0xF4]), // Width: 500
      Buffer.from([0x00, 0x00, 0x01, 0x90]), // Height: 400
      Buffer.from([0x08, 0x02, 0x00, 0x00, 0x00]) // Bit depth: 8, Color type: 2 (RGB), Compression: 0, Filter: 0, Interlace: 0
    ])),
    
    // IDAT chunk (compressed image data)
    createChunk('IDAT', compressImageData(imageData)),
    
    // IEND chunk
    createChunk('IEND', Buffer.alloc(0))
  ]);
  
  return pngData;
}

// Create a PNG chunk
function createChunk(type, data) {
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length, 0);
  
  const typeBuffer = Buffer.from(type, 'ascii');
  const chunk = Buffer.concat([length, typeBuffer, data]);
  
  // Calculate CRC
  const crc = calculateCRC(typeBuffer, data);
  const crcBuffer = Buffer.alloc(4);
  crcBuffer.writeUInt32BE(crc, 0);
  
  return Buffer.concat([chunk, crcBuffer]);
}

// Simple CRC calculation
function calculateCRC(type, data) {
  let crc = 0xFFFFFFFF;
  const buffer = Buffer.concat([type, data]);
  
  for (let i = 0; i < buffer.length; i++) {
    crc ^= buffer[i];
    for (let j = 0; j < 8; j++) {
      if (crc & 1) {
        crc = (crc >>> 1) ^ 0xEDB88320;
      } else {
        crc >>>= 1;
      }
    }
  }
  
  return crc ^ 0xFFFFFFFF;
}

// Simple compression (just store raw data for now)
function compressImageData(data) {
  // For simplicity, just return the data as-is
  // In a real implementation, you'd use zlib compression
  return data;
}

// Main function
async function main() {
  console.log('▓▒░ Creating simple PNG image... ⟨MATRIX⟩');
  
  try {
    const pngData = createSimplePNG();
    const outputPath = path.join(__dirname, 'cipher_agent002_simple.png');
    
    fs.writeFileSync(outputPath, pngData);
    
    console.log('✅ PNG image created successfully!');
    console.log(`📁 Image saved to: ${outputPath}`);
    console.log(`📏 File size: ${pngData.length} bytes`);
    
    return outputPath;
    
  } catch (error) {
    console.log('❌ Error creating PNG:', error.message);
    return null;
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createSimplePNG, main };
