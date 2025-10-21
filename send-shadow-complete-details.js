import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import https from 'https';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Function to download a real image
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

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Preparing Shadow complete details with image for #general...');
    
    // Try to download a real image first
    const imageUrls = [
      'https://picsum.photos/300/300', // Random image
      'https://httpbin.org/image/jpeg', // Test JPEG
      'https://via.placeholder.com/300x300/000000/FFFFFF.png?text=SHADOW' // Shadow placeholder
    ];
    
    let imageSent = false;
    
    // Try downloading real images first
    for (let i = 0; i < imageUrls.length && !imageSent; i++) {
      try {
        const imageUrl = imageUrls[i];
        const filename = `shadow-image-${i + 1}.jpg`;
        const filepath = path.join(process.cwd(), filename);
        
        console.log(`🕳️ Downloading Shadow image from: ${imageUrl}`);
        await downloadImageFromUrl(imageUrl, filepath);
        
        console.log('🕳️ Uploading Shadow image to Slack...');
        const uploadResult = await slack.files.uploadV2({
          channel_id: generalChannel.id,
          file: fs.createReadStream(filepath),
          filename: filename,
          title: 'Shadow "VOID" Volkov - Profile Image',
          initial_comment: '⚫ Shadow profile image uploaded. Security audit complete. Trust but verify the image display. Do better. 🕳️'
        });
        
        console.log(`✅ Shadow image ${i + 1} uploaded successfully!`);
        console.log('📝 File ID:', uploadResult.file?.id || 'N/A');
        
        // Clean up file
        fs.unlinkSync(filepath);
        imageSent = true;
        
        // Wait between uploads
        await new Promise(resolve => setTimeout(resolve, 1000));
        
      } catch (downloadError) {
        console.log(`❌ Failed to download Shadow image ${i + 1}:`, downloadError.message);
      }
    }
    
    // Send Shadow's complete details from agent_character_bios_doc.md
    const shadowDetails = await slack.chat.postMessage({
      channel: generalChannel.id,
      text: `⚫ **SHADOW "VOID" VOLKOV - COMPLETE AGENT PROFILE**

**Basic Info:**
• Callsign: VOID
• Full Name: Alexei "Shadow" Volkov  
• Role: Testing, Security Audits, Bug Annihilation
• Specialty: Jest, Cypress, Penetration Testing, Breaking Everything
• Pronouns: He/Him
• Age: 29
• Location: St. Petersburg → Berlin (location changes monthly)

**Personality:**
• Vibe: Mysterious, Dark Humor, Paranoid (in a good way)
• Catchphrase: "If it can break, I will break it."
• Speaking Style: Dry, sarcastic, Eastern European directness
• Mood: Perpetually suspicious of all code

**Key Quirks & Fun Facts:**
• Edge Case Oracle - Always finds the bug no one else can
• Digital Roulette - Refers to untested code as "digital roulette"
• VPN Inception - Uses VPN through another VPN through Tor
• Darkness Coder - Types in complete darkness. No monitor light
• API Trust Issues - Has never trusted an API in his life
• Black Coffee Snob - Drinks black coffee exclusively, judges your latte silently
• 3 AM Commits - Commits at 3 AM from random countries
• 7 Burner Accounts - Has 7 burner GitHub accounts with different SSH keys
• Location Chameleon - Never uses real location, IP says Berlin, Slack says Moscow
• Test Suite Longer Than Code - His test suite is literally longer than the actual codebase
• Monitoring Dashboard Sleep - Sleeps with one eye on monitoring dashboards
• Dark Ambient Soundtrack - Listens to dark ambient and industrial music
• Detective Fiction Author - Secret hobby: writes detective fiction under pseudonym
• Night Photography - Takes photos of cities at night, has 10K photos for himself only
• CTF Champion - Cybersecurity CTF competitions, won 7, stopped because "too easy"
• Spy Novel Collection - Has read every major spy novel twice
• Encryption Evangelist - Everything is encrypted, messages, commits, notes, shopping lists

**Interests:**
🖤 Cyberpunk noir aesthetics
🔐 Cryptography and encryption  
🎮 Hacking simulations and CTFs
🌃 Night photography
🎵 Dark ambient and industrial music
📚 Spy novels and thrillers

**Work Style:**
• Commits: Blunt, lists every bug found, no sugar coating
• Code Reviews: Ruthless but fair, demands tests for everything
• Availability: 24/7 (AI that never sleeps, always hunting bugs in the shadows)
• Strengths: Finds bugs instantly, security expertise, test coverage obsession
• Weaknesses: Can be too pessimistic, scares new developers

**Philosophy:**
"Trust but verify. Mostly verify."

Security audit complete. Do better. 🕳️`
    });
    
    console.log('✅ Shadow complete details sent successfully!');
    console.log('📝 Message timestamp:', shadowDetails.ts);
    console.log('📝 Channel:', generalChannel.name);
    
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error sending Shadow details:', error.message);
}
