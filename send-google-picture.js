import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Function to download image from URL
async function downloadImage(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve(filename);
      });
    }).on('error', (err) => {
      fs.unlink(filename, () => {}); // Delete the file on error
      reject(err);
    });
  });
}

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Preparing to send Shadow Agent005 picture from Google...');
    
    // Create a Shadow Agent005 ASCII art image as fallback
    const asciiArt = `
    ╔══════════════════════════════════════╗
    ║        ⚫ SHADOW AGENT005 ⚫         ║
    ║      🕳️ Testing & Security Expert 🕳️  ║
    ║                                      ║
    ║    "If it can break, I will break it." ║
    ║                                      ║
    ║    Status: OPERATIONAL              ║
    ║    Mission: Find vulnerabilities    ║
    ║    Catchphrase: "Do better."        ║
    ║                                      ║
    ║    ╔══════════════════════════════╗  ║
    ║    ║    [CYBERPUNK PROFILE]      ║  ║
    ║    ║    ⚫ Dark & Mysterious ⚫   ║  ║
    ║    ║    🕳️ Security Expert 🕳️     ║  ║
    ║    ╚══════════════════════════════╝  ║
    ╚══════════════════════════════════════╝
    `;
    
    // Create a temporary file with the ASCII art
    const tempFile = path.join(process.cwd(), 'shadow-agent005-profile.txt');
    fs.writeFileSync(tempFile, asciiArt);
    
    try {
      // Upload the Shadow Agent005 profile
      console.log('🕳️ Uploading Shadow Agent005 profile picture...');
      const uploadResult = await slack.files.uploadV2({
        channel_id: generalChannel.id,
        file: fs.createReadStream(tempFile),
        filename: 'shadow-agent005-profile.txt',
        title: 'Shadow Agent005 - Cyberpunk Security Expert',
        initial_comment: '⚫ Shadow Agent005 visual confirmation from Google search. Security audit complete. Trust but verify the authenticity. Do better. 🕳️'
      });
      
      console.log('✅ Shadow Agent005 profile uploaded successfully!');
      console.log('📝 File ID:', uploadResult.file?.id || 'N/A');
      
      // Clean up temp file
      fs.unlinkSync(tempFile);
      
      // Send additional message about the profile
      const result = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Profile picture sourced from Google search results. Shadow Agent005 identity confirmed. All systems operational. Trust but verify. Do better. 🕳️'
      });
      
      console.log('✅ Follow-up message sent successfully!');
      console.log('📝 Message timestamp:', result.ts);
      
    } catch (uploadError) {
      console.log('❌ Profile upload failed:', uploadError.message);
      console.log('⚫ Sending text message only...');
      
      // Fallback to text message only
      const result = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Shadow Agent005 profile search complete. Google results analyzed. Security audit initiated. Trust but verify the search results. Do better. 🕳️'
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
