import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Preparing hello team message with picture to #general...');
    
    // First, upload a picture (create a simple text-based "picture" for demo)
    const pictureContent = `
    ⚫ SHADOW AGENT005 ⚫
    🕳️ Testing & Security Expert 🕳️
    
    "If it can break, I will break it."
    
    Status: OPERATIONAL
    Mission: Find vulnerabilities
    Catchphrase: "Do better."
    `;
    
    // Create a temporary file
    const tempFile = path.join(process.cwd(), 'shadow-agent005-picture.txt');
    fs.writeFileSync(tempFile, pictureContent);
    
    try {
      // Upload the file using the newer uploadV2 method
      console.log('🕳️ Uploading Shadow Agent005 picture...');
      const uploadResult = await slack.files.uploadV2({
        channel_id: generalChannel.id,
        file: fs.createReadStream(tempFile),
        filename: 'shadow-agent005-picture.txt',
        title: 'Shadow Agent005 Profile',
        initial_comment: '⚫ Shadow Agent005 visual confirmation. Security audit complete. Trust but verify. Do better. 🕳️'
      });
      
      console.log('✅ Picture uploaded successfully!');
      console.log('📝 File ID:', uploadResult.file?.id || 'N/A');
      
      // Clean up temp file
      fs.unlinkSync(tempFile);
      
    } catch (uploadError) {
      console.log('❌ Picture upload failed:', uploadError.message);
      console.log('⚫ Sending text message only...');
      
      // Fallback to text message only
      const result = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Hey team! Shadow Agent005 here. Ready to break things and make them better. Found 23 potential vulnerabilities in your coffee machine. Trust but verify the caffeine content. Do better. 🕳️'
      });
      
      console.log('✅ Text message sent successfully!');
      console.log('📝 Message timestamp:', result.ts);
    }
    
    console.log('📝 Channel:', generalChannel.name);
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error sending message:', error.message);
}
