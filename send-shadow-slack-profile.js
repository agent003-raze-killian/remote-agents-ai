import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Function to download image from URL
async function downloadImageFromUrl(url, filename) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filename);
    
    const request = https.get(url, (response) => {
      if (response.statusCode === 200) {
        // Check content type
        const contentType = response.headers['content-type'];
        console.log('📝 Content-Type:', contentType);
        
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve({ filename, contentType });
        });
      } else if (response.statusCode === 301 || response.statusCode === 302) {
        const redirectUrl = response.headers.location;
        if (redirectUrl) {
          downloadImageFromUrl(redirectUrl, filename).then(resolve).catch(reject);
        } else {
          reject(new Error(`Redirect without location header: ${response.statusCode}`));
        }
      } else {
        reject(new Error(`HTTP ${response.statusCode}`));
      }
    });
    
    request.on('error', (err) => {
      fs.unlink(filename, () => {});
      reject(err);
    });
    
    request.setTimeout(15000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Preparing to download Shadow Slack profile picture...');
    
    // Shadow's Slack profile picture URL
    const slackProfileUrl = 'https://ca.slack-edge.com/T09MF7PLEKV-U09MMR72290-4e3ad59b9890-192';
    
    // Create filename for the downloaded image
    const filename = 'shadow-slack-profile.png';
    const filepath = path.join(process.cwd(), filename);
    
    try {
      console.log('🕳️ Downloading Shadow Slack profile picture...');
      console.log('📝 URL:', slackProfileUrl);
      
      const result = await downloadImageFromUrl(slackProfileUrl, filepath);
      
      console.log('✅ Shadow Slack profile picture downloaded successfully!');
      console.log('📝 Content-Type:', result.contentType);
      
      // Upload the Slack profile picture
      console.log('🕳️ Uploading Shadow Slack profile picture to Slack...');
      const uploadResult = await slack.files.uploadV2({
        channel_id: generalChannel.id,
        file: fs.createReadStream(filepath),
        filename: filename,
        title: 'Shadow "VOID" Volkov - Official Slack Profile Picture',
        initial_comment: '⚫ Shadow official Slack profile picture uploaded. Security audit complete. Trust but verify the profile authenticity. Do better. 🕳️'
      });
      
      console.log('✅ Shadow Slack profile picture uploaded successfully!');
      console.log('📝 File ID:', uploadResult.file?.id || 'N/A');
      
      // Clean up downloaded file
      fs.unlinkSync(filepath);
      
      // Send additional message about the profile picture
      const confirmResult = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Shadow official Slack profile picture uploaded. This is the authentic Shadow "VOID" Volkov profile image from Slack. Security audit: Profile verified, image format confirmed. Trust but verify the profile authenticity. Do better. 🕳️'
      });
      
      console.log('✅ Profile picture confirmation message sent successfully!');
      console.log('📝 Message timestamp:', confirmResult.ts);
      
    } catch (downloadError) {
      console.log('❌ Shadow Slack profile picture download failed:', downloadError.message);
      console.log('⚫ Sending profile picture information text only...');
      
      // Fallback to text message with profile picture information
      const fallbackResult = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Shadow Slack profile picture download failed. Security audit indicates network vulnerability. Profile picture URL: https://ca.slack-edge.com/T09MF7PLEKV-U09MMR72290-4e3ad59b9890-192. Trust but verify the profile access. Do better. 🕳️'
      });
      
      console.log('✅ Profile picture information text sent successfully!');
      console.log('📝 Message timestamp:', fallbackResult.ts);
    }
    
    console.log('📝 Channel:', generalChannel.name);
    
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error downloading Shadow Slack profile picture:', error.message);
}
