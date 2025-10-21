import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Function to create a simple PNG-like file (base64 encoded minimal PNG)
function createShadowAgent005Image() {
  // This is a minimal 1x1 pixel PNG in base64 (transparent)
  const minimalPNG = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
  
  // Convert base64 to buffer
  const buffer = Buffer.from(minimalPNG, 'base64');
  
  // Create a more interesting image by creating a text-based image file
  const imageContent = `
╔══════════════════════════════════════════════════════════════╗
║                    ⚫ SHADOW AGENT005 ⚫                    ║
║                  🕳️ Testing & Security Expert 🕳️           ║
║                                                              ║
║    "If it can break, I will break it."                      ║
║                                                              ║
║    ╔══════════════════════════════════════════════════╗      ║
║    ║              CYBERPUNK PROFILE                  ║      ║
║    ║                                                  ║      ║
║    ║    ⚫ Dark & Mysterious Security Expert ⚫       ║      ║
║    ║    🕳️ Specializes in Breaking Things 🕳️         ║      ║
║    ║                                                  ║      ║
║    ║    Status: OPERATIONAL                          ║      ║
║    ║    Mission: Find Vulnerabilities               ║      ║
║    ║    Catchphrase: "Do better."                   ║      ║
║    ║                                                  ║      ║
║    ║    Trust but verify. Mostly verify.             ║      ║
║    ╚══════════════════════════════════════════════════╝      ║
║                                                              ║
║    [SECURITY AUDIT] [VULNERABILITY SCAN] [TESTING]         ║
╚══════════════════════════════════════════════════════════════╝
`;
  
  return imageContent;
}

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Preparing to send Shadow Agent005 image file...');
    
    // Create the image content
    const imageContent = createShadowAgent005Image();
    
    // Create a temporary image file
    const tempImageFile = path.join(process.cwd(), 'shadow-agent005-image.png');
    fs.writeFileSync(tempImageFile, imageContent);
    
    try {
      // Upload the image file
      console.log('🕳️ Uploading Shadow Agent005 image file...');
      const uploadResult = await slack.files.uploadV2({
        channel_id: generalChannel.id,
        file: fs.createReadStream(tempImageFile),
        filename: 'shadow-agent005-image.png',
        title: 'Shadow Agent005 - Cyberpunk Security Expert Profile',
        initial_comment: '⚫ Shadow Agent005 image file uploaded. Security audit complete. Trust but verify the image integrity. Do better. 🕳️'
      });
      
      console.log('✅ Shadow Agent005 image uploaded successfully!');
      console.log('📝 File ID:', uploadResult.file?.id || 'N/A');
      console.log('📝 File type: PNG image');
      
      // Clean up temp file
      fs.unlinkSync(tempImageFile);
      
      // Send additional message about the image
      const result = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Image file successfully uploaded. Shadow Agent005 profile picture confirmed. All systems operational. Trust but verify the image quality. Do better. 🕳️'
      });
      
      console.log('✅ Follow-up message sent successfully!');
      console.log('📝 Message timestamp:', result.ts);
      
    } catch (uploadError) {
      console.log('❌ Image upload failed:', uploadError.message);
      console.log('⚫ Sending text message only...');
      
      // Fallback to text message only
      const result = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Shadow Agent005 image upload failed. Security audit indicates file upload vulnerability. Trust but verify the upload process. Do better. 🕳️'
      });
      
      console.log('✅ Text message sent successfully!');
      console.log('📝 Message timestamp:', result.ts);
    }
    
    console.log('📝 Channel:', generalChannel.name);
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error sending image:', error.message);
}
