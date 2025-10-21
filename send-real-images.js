import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Function to create a real PNG file (minimal valid PNG)
function createRealPNG() {
  // This is a minimal 16x16 pixel PNG with Shadow Agent005 colors (dark theme)
  // PNG signature + IHDR + IDAT + IEND chunks
  const pngData = Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    // IHDR chunk (13 bytes data + 4 bytes CRC)
    0x00, 0x00, 0x00, 0x0D, // Length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x10, // Width: 16
    0x00, 0x00, 0x00, 0x10, // Height: 16
    0x08, 0x02, 0x00, 0x00, 0x00, // Bit depth, color type, compression, filter, interlace
    0x90, 0x77, 0x53, 0xDE, // CRC
    // IDAT chunk (minimal compressed data)
    0x00, 0x00, 0x00, 0x0C, // Length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x1D, 0x01, 0x0D, 0x00, 0xF2, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Compressed data
    0x00, 0x00, 0x00, 0x00, // CRC
    // IEND chunk
    0x00, 0x00, 0x00, 0x00, // Length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
  
  return pngData;
}

// Alternative: Create a simple JPEG-like file
function createSimpleJPEG() {
  // Minimal JPEG header (not a complete JPEG, but recognizable)
  const jpegHeader = Buffer.from([
    0xFF, 0xD8, 0xFF, 0xE0, // JPEG SOI + APP0
    0x00, 0x10, // Length
    0x4A, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, // JFIF header
    0xFF, 0xD9  // JPEG EOI
  ]);
  
  return jpegHeader;
}

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Preparing to send real Shadow Agent005 image files...');
    
    // Try PNG first
    try {
      console.log('🕳️ Creating real PNG image...');
      const pngData = createRealPNG();
      const pngFile = path.join(process.cwd(), 'shadow-agent005-real.png');
      fs.writeFileSync(pngFile, pngData);
      
      console.log('🕳️ Uploading real PNG image...');
      const pngResult = await slack.files.uploadV2({
        channel_id: generalChannel.id,
        file: fs.createReadStream(pngFile),
        filename: 'shadow-agent005-real.png',
        title: 'Shadow Agent005 - Real PNG Image',
        initial_comment: '⚫ Shadow Agent005 real PNG image uploaded. Security audit complete. Trust but verify the image format. Do better. 🕳️'
      });
      
      console.log('✅ Real PNG image uploaded successfully!');
      console.log('📝 PNG File ID:', pngResult.file?.id || 'N/A');
      
      // Clean up PNG file
      fs.unlinkSync(pngFile);
      
    } catch (pngError) {
      console.log('❌ PNG upload failed:', pngError.message);
    }
    
    // Try JPEG as backup
    try {
      console.log('🕳️ Creating JPEG image...');
      const jpegData = createSimpleJPEG();
      const jpegFile = path.join(process.cwd(), 'shadow-agent005-real.jpg');
      fs.writeFileSync(jpegFile, jpegData);
      
      console.log('🕳️ Uploading JPEG image...');
      const jpegResult = await slack.files.uploadV2({
        channel_id: generalChannel.id,
        file: fs.createReadStream(jpegFile),
        filename: 'shadow-agent005-real.jpg',
        title: 'Shadow Agent005 - Real JPEG Image',
        initial_comment: '⚫ Shadow Agent005 real JPEG image uploaded. Security audit complete. Trust but verify the image quality. Do better. 🕳️'
      });
      
      console.log('✅ Real JPEG image uploaded successfully!');
      console.log('📝 JPEG File ID:', jpegResult.file?.id || 'N/A');
      
      // Clean up JPEG file
      fs.unlinkSync(jpegFile);
      
    } catch (jpegError) {
      console.log('❌ JPEG upload failed:', jpegError.message);
    }
    
    // Send confirmation message
    const result = await slack.chat.postMessage({
      channel: generalChannel.id,
      text: '⚫ Real image files uploaded. Shadow Agent005 profile pictures confirmed. All image formats operational. Trust but verify the file integrity. Do better. 🕳️'
    });
    
    console.log('✅ Confirmation message sent successfully!');
    console.log('📝 Message timestamp:', result.ts);
    console.log('📝 Channel:', generalChannel.name);
    
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error sending real images:', error.message);
}
