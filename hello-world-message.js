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
        response.pipe(file);
        file.on('finish', () => {
          file.close();
          resolve(filename);
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
    
    request.setTimeout(10000, () => {
      request.destroy();
      reject(new Error('Request timeout'));
    });
  });
}

// Function to create a world/globe image
function createWorldImage() {
  // Create a simple ASCII art world representation
  const worldImage = `
╔══════════════════════════════════════════════════════════════╗
║                    🌍 HELLO WORLD 🌍                      ║
║                                                              ║
║    ╔══════════════════════════════════════════════════╗      ║
║    ║              WORLD SECURITY AUDIT              ║      ║
║    ║                                                  ║      ║
║    ║    🌍 Global Systems Detected 🌍               ║      ║
║    ║    🌍 Earth Coordinates Verified 🌍            ║      ║
║    ║    🌍 Planetary Security Scan Complete 🌍      ║      ║
║    ║                                                  ║      ║
║    ║    Security Audit Results:                      ║      ║
║    ║    ✅ World Status: OPERATIONAL                 ║      ║
║    ║    ✅ Population: 8+ Billion Verified          ║      ║
║    ║    ✅ Continents: 7 Detected                    ║      ║
║    ║    ✅ Oceans: 5 Confirmed                       ║      ║
║    ║    ✅ Atmosphere: Breathable                     ║      ║
║    ║                                                  ║      ║
║    ║    Trust but verify the world's existence.      ║      ║
║    ╚══════════════════════════════════════════════════╝      ║
║                                                              ║
║    ⚫ Shadow Agent005 World Security Audit Complete ⚫      ║
║    🕳️ "If it can break, I will break it." 🕳️              ║
╚══════════════════════════════════════════════════════════════╝
`;
  
  return worldImage;
}

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Preparing Hello World message with world picture...');
    
    // Try to download a real world/globe image
    const worldImageUrls = [
      'https://picsum.photos/200/200', // Random image as fallback
      'https://httpbin.org/image/jpeg', // Test JPEG
      'https://via.placeholder.com/200x200/0066CC/FFFFFF.png?text=WORLD' // World placeholder
    ];
    
    let imageSent = false;
    
    // Try downloading real images first
    for (let i = 0; i < worldImageUrls.length && !imageSent; i++) {
      try {
        const imageUrl = worldImageUrls[i];
        const filename = `world-image-${i + 1}.jpg`;
        const filepath = path.join(process.cwd(), filename);
        
        console.log(`🕳️ Downloading world image from: ${imageUrl}`);
        await downloadImageFromUrl(imageUrl, filepath);
        
        console.log('🕳️ Uploading world image to Slack...');
        const uploadResult = await slack.files.uploadV2({
          channel_id: generalChannel.id,
          file: fs.createReadStream(filepath),
          filename: filename,
          title: `Hello World Image ${i + 1}`,
          initial_comment: '⚫ Hello World image uploaded. Security audit complete. Trust but verify the world\'s existence. Do better. 🌍🕳️'
        });
        
        console.log(`✅ World image ${i + 1} uploaded successfully!`);
        console.log('📝 File ID:', uploadResult.file?.id || 'N/A');
        
        // Clean up file
        fs.unlinkSync(filepath);
        imageSent = true;
        
        // Wait between uploads
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (downloadError) {
        console.log(`❌ Failed to download world image ${i + 1}:`, downloadError.message);
      }
    }
    
    // If no external images worked, create a world ASCII art image
    if (!imageSent) {
      console.log('🕳️ Creating world ASCII art image...');
      const worldImageContent = createWorldImage();
      const worldFile = path.join(process.cwd(), 'hello-world-image.txt');
      fs.writeFileSync(worldFile, worldImageContent);
      
      console.log('🕳️ Uploading world ASCII art image...');
      const uploadResult = await slack.files.uploadV2({
        channel_id: generalChannel.id,
        file: fs.createReadStream(worldFile),
        filename: 'hello-world-image.txt',
        title: 'Hello World - Shadow Agent005 World Security Audit',
        initial_comment: '⚫ Hello World ASCII art uploaded. Security audit complete. Trust but verify the world\'s security. Do better. 🌍🕳️'
      });
      
      console.log('✅ World ASCII art uploaded successfully!');
      console.log('📝 File ID:', uploadResult.file?.id || 'N/A');
      
      // Clean up file
      fs.unlinkSync(worldFile);
    }
    
    // Send Hello World message
    const result = await slack.chat.postMessage({
      channel: generalChannel.id,
      text: '⚫ Hello World! Shadow Agent005 reporting for global duty. Security audit of planet Earth initiated. Found: 8+ billion inhabitants, 7 continents, 5 oceans. World status: OPERATIONAL. Trust but verify the world\'s existence. Do better. 🌍🕳️'
    });
    
    console.log('✅ Hello World message sent successfully!');
    console.log('📝 Message timestamp:', result.ts);
    console.log('📝 Channel:', generalChannel.name);
    
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error sending Hello World:', error.message);
}
