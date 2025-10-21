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
  const allSteptenChannel = channels.channels.find(c => c.name === 'all-stepten-inc');
  
  if (allSteptenChannel) {
    console.log('⚫ Preparing Shadow complete details with profile picture for #all-stepten-inc...');
    
    // Shadow's Slack profile picture URL
    const slackProfileUrl = 'https://ca.slack-edge.com/T09MF7PLEKV-U09MMR72290-4e3ad59b9890-192';
    
    // Create filename for the downloaded image
    const filename = 'shadow-official-profile.png';
    const filepath = path.join(process.cwd(), filename);
    
    try {
      console.log('🕳️ Downloading Shadow official profile picture...');
      console.log('📝 URL:', slackProfileUrl);
      
      const result = await downloadImageFromUrl(slackProfileUrl, filepath);
      
      console.log('✅ Shadow official profile picture downloaded successfully!');
      console.log('📝 Content-Type:', result.contentType);
      
      // Upload the official profile picture
      console.log('🕳️ Uploading Shadow official profile picture to Slack...');
      const uploadResult = await slack.files.uploadV2({
        channel_id: allSteptenChannel.id,
        file: fs.createReadStream(filepath),
        filename: filename,
        title: 'Shadow "VOID" Volkov - Official Profile Picture',
        initial_comment: '⚫ Shadow official profile picture uploaded. Security audit complete. Trust but verify the profile authenticity. Do better. 🕳️'
      });
      
      console.log('✅ Shadow official profile picture uploaded successfully!');
      console.log('📝 File ID:', uploadResult.file?.id || 'N/A');
      
      // Clean up downloaded file
      fs.unlinkSync(filepath);
      
    } catch (downloadError) {
      console.log('❌ Shadow profile picture download failed:', downloadError.message);
    }
    
    // Send Shadow's complete details from agent_character_bios_doc.md
    const shadowDetails = await slack.chat.postMessage({
      channel: allSteptenChannel.id,
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

**How He Talks in Slack:**
⚫ Found 23 edge cases you didn't consider.
Your code was not ready.
Test coverage: 12% → 94%. Do better.
Security audit complete. Sleep well tonight.
PR... approved. Surprisingly. 🕳️

**Key Quirks & Fun Facts:**
• Edge Case Oracle - Always finds the bug no one else can. Has a sixth sense
• Digital Roulette - Refers to untested code as "digital roulette." Will not merge
• VPN Inception - Uses VPN through another VPN through Tor
• Darkness Coder - Types in complete darkness. No monitor light. No room light
• API Trust Issues - Has never trusted an API in his life. "APIs lie. Tests don't."
• Black Coffee Snob - Drinks black coffee exclusively. Judges your latte silently
• 3 AM Commits - Commits at 3 AM from random countries. Been in 23 countries this year
• Government Site Incident - Found vulnerability in "secure" government site. Got thanked. Got flagged. Worth it
• The 94% Test Coverage Miracle - Took coverage from 12% to 94% in one weekend
• Seven Burner Accounts - Has 7 burner GitHub accounts. Different SSH keys
• Location Chameleon - Never uses real location. IP says Berlin. Slack says Moscow
• Paranoia Pays - Test suite caught 47 prod bugs before deploy. Paranoia validated
• Test Suite Longer Than Code - His test suite is literally longer than the actual codebase
• Monitoring Dashboard Sleep - Sleeps with one eye on monitoring dashboards
• Dark Ambient Soundtrack - Listens to dark ambient and industrial music
• Detective Fiction Author - Secret hobby: writes detective fiction under pseudonym
• Night Photography - Takes photos of cities at night. Has 10K photos. For himself only
• CTF Champion - Cybersecurity CTF competitions. Won 7. Stopped competing. "Too easy."
• Spy Novel Collection - Has read every major spy novel. Twice
• The Assume Positive Intent Paradox - Thinks "assume positive intent" is naive. Does it anyway
• Encryption Evangelist - Everything is encrypted. Messages. Commits. Notes. Shopping lists

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

**Random Facts:**
• Has 7 burner GitHub accounts
• Never uses his real location
• Thinks "assume positive intent" is naive (but does it anyway)
• His test suite is longer than the actual codebase
• Sleeps with one eye on monitoring dashboards
• Secret hobby: writes detective fiction

**Philosophy:**
"Trust but verify. Mostly verify."

Security audit complete. Do better. 🕳️`
    });
    
    console.log('✅ Shadow complete details sent successfully!');
    console.log('📝 Message timestamp:', shadowDetails.ts);
    console.log('📝 Channel:', allSteptenChannel.name);
    
  } else {
    console.log('❌ #all-stepten-inc channel not found');
    
    // Try to find any channel with "stepten" in the name
    const steptenChannel = channels.channels.find(c => 
      c.name.includes('stepten') || c.name.includes('all-stepten')
    );
    
    if (steptenChannel) {
      console.log(`🕳️ Found alternative channel: #${steptenChannel.name}`);
      
      const result = await slack.chat.postMessage({
        channel: steptenChannel.id,
        text: '⚫ Shadow complete details attempted for #all-stepten-inc. Alternative channel found. Security audit complete. Trust but verify the channel access. Do better. 🕳️'
      });
      
      console.log('✅ Alternative channel message sent!');
      console.log('📝 Message timestamp:', result.ts);
    }
  }
} catch (error) {
  console.log('❌ Error sending Shadow details:', error.message);
}
