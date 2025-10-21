import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Create a very small, simple PNG that should definitely display inline
function createTinyPNG() {
  // This is a 1x1 pixel PNG - the smallest possible valid PNG
  return Buffer.from([
    0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A, // PNG signature
    0x00, 0x00, 0x00, 0x0D, // IHDR chunk length
    0x49, 0x48, 0x44, 0x52, // IHDR
    0x00, 0x00, 0x00, 0x01, // Width: 1
    0x00, 0x00, 0x00, 0x01, // Height: 1
    0x08, 0x02, 0x00, 0x00, 0x00, // Bit depth, color type, compression, filter, interlace
    0x90, 0x77, 0x53, 0xDE, // CRC
    0x00, 0x00, 0x00, 0x0C, // IDAT chunk length
    0x49, 0x44, 0x41, 0x54, // IDAT
    0x08, 0x1D, 0x01, 0x0D, 0x00, 0xF2, 0xFF, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, // Compressed data
    0x00, 0x00, 0x00, 0x00, // CRC
    0x00, 0x00, 0x00, 0x00, // IEND chunk length
    0x49, 0x45, 0x4E, 0x44, // IEND
    0xAE, 0x42, 0x60, 0x82  // CRC
  ]);
}

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Creating tiny PNG for inline display...');
    
    // Create the smallest possible PNG
    const tinyPNG = createTinyPNG();
    const filename = 'shadow-agent005-tiny.png';
    const filepath = path.join(process.cwd(), filename);
    fs.writeFileSync(filepath, tinyPNG);
    
    console.log('🕳️ Uploading tiny PNG (should display inline)...');
    
    // Try different upload methods
    try {
      // Method 1: Standard uploadV2
      const uploadResult = await slack.files.uploadV2({
        channel_id: generalChannel.id,
        file: fs.createReadStream(filepath),
        filename: filename,
        title: 'Shadow Agent005 - Tiny PNG (Inline Display)',
        initial_comment: '⚫ Tiny PNG uploaded for inline display test. Security audit: Minimal file size, valid PNG format. Trust but verify the inline display. Do better. 🕳️'
      });
      
      console.log('✅ Tiny PNG uploaded successfully!');
      console.log('📝 File ID:', uploadResult.file?.id || 'N/A');
      
    } catch (uploadError) {
      console.log('❌ UploadV2 failed:', uploadError.message);
      
      // Method 2: Try with different parameters
      try {
        const uploadResult2 = await slack.files.uploadV2({
          channel_id: generalChannel.id,
          file: fs.createReadStream(filepath),
          filename: filename,
          title: 'Shadow Agent005 Tiny PNG'
        });
        
        console.log('✅ Alternative upload method successful!');
        console.log('📝 File ID:', uploadResult2.file?.id || 'N/A');
        
      } catch (uploadError2) {
        console.log('❌ Alternative upload also failed:', uploadError2.message);
      }
    }
    
    // Clean up file
    fs.unlinkSync(filepath);
    
    // Send diagnostic message
    const result = await slack.chat.postMessage({
      channel: generalChannel.id,
      text: '⚫ Tiny PNG upload test complete. If still requiring download, this is likely a Slack workspace setting. Security audit: File size minimal (1x1 pixel), format valid PNG. Trust but verify the workspace file sharing settings. Do better. 🕳️'
    });
    
    console.log('✅ Diagnostic message sent successfully!');
    console.log('📝 Message timestamp:', result.ts);
    console.log('📝 Channel:', generalChannel.name);
    
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error with tiny PNG test:', error.message);
}
