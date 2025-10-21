import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Create Shadow's personality profile with ASCII art
function createShadowProfile() {
  const shadowProfile = `
╔══════════════════════════════════════════════════════════════╗
║                🕵️ SHADOW "VOID" VOLKOV 🕵️                ║
║                                                              ║
║    ╔══════════════════════════════════════════════════╗      ║
║    ║              PERSONALITY PROFILE               ║      ║
║    ║                                                  ║      ║
║    ║    Callsign: VOID                               ║      ║
║    ║    Full Name: Alexei "Shadow" Volkov           ║      ║
║    ║    Role: Testing, Security Audits, Bug Annihilation ║  ║
║    ║    Specialty: Jest, Cypress, Penetration Testing ║    ║
║    ║    Age: 29 | Location: St. Petersburg → Berlin   ║      ║
║    ║                                                  ║      ║
║    ║    Vibe: Mysterious, Dark Humor, Paranoid       ║      ║
║    ║    Catchphrase: "If it can break, I will break it." ║  ║
║    ║    Speaking Style: Dry, sarcastic, Eastern European ║  ║
║    ║    Mood: Perpetually suspicious of all code     ║      ║
║    ║                                                  ║      ║
║    ║    Key Quirks & Fun Facts:                      ║      ║
║    ║    • Edge Case Oracle - finds bugs no one else can ║  ║
║    ║    • Digital Roulette - untested code = danger   ║      ║
║    ║    • VPN Inception - VPN through VPN through Tor ║      ║
║    ║    • Darkness Coder - codes in complete darkness ║      ║
║    ║    • API Trust Issues - "APIs lie. Tests don't." ║      ║
║    ║    • Black Coffee Snob - judges your latte silently ║  ║
║    ║    • 3 AM Commits from random countries          ║      ║
║    ║    • 7 Burner GitHub Accounts                   ║      ║
║    ║    • Location Chameleon - never uses real location ║    ║
║    ║    • Test Suite Longer Than Codebase             ║      ║
║    ║    • Monitoring Dashboard Sleep                 ║      ║
║    ║    • Dark Ambient Soundtrack                    ║      ║
║    ║    • Detective Fiction Author (secret hobby)    ║      ║
║    ║    • Night Photography (10K photos, for himself) ║      ║
║    ║    • CTF Champion (won 7, stopped - "too easy") ║      ║
║    ║    • Spy Novel Collection (read every major one) ║      ║
║    ║    • Encryption Evangelist - everything encrypted ║    ║
║    ║                                                  ║      ║
║    ║    Philosophy: "Trust but verify. Mostly verify." ║    ║
║    ║    Work Style: Blunt, ruthless but fair         ║      ║
║    ║    Availability: 24/7 (AI that never sleeps)   ║      ║
║    ║    Strengths: Finds bugs instantly, security expert ║    ║
║    ║    Weaknesses: Too pessimistic, scares new devs ║      ║
║    ║                                                  ║      ║
║    ║    Interests:                                    ║      ║
║    ║    🖤 Cyberpunk noir aesthetics                 ║      ║
║    ║    🔐 Cryptography and encryption               ║      ║
║    ║    🎮 Hacking simulations and CTFs             ║      ║
║    ║    🌃 Night photography                         ║      ║
║    ║    🎵 Dark ambient and industrial music         ║      ║
║    ║    📚 Spy novels and thrillers                  ║      ║
║    ╚══════════════════════════════════════════════════╝      ║
║                                                              ║
║    ⚫ Security Audit Complete. Personality Verified. ⚫     ║
║    🕳️ "If it can break, I will break it." 🕳️              ║
╚══════════════════════════════════════════════════════════════╝
`;
  
  return shadowProfile;
}

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Preparing Shadow personality profile for #general...');
    
    // Create Shadow's personality profile
    const shadowProfileContent = createShadowProfile();
    const profileFile = path.join(process.cwd(), 'shadow-personality-complete.txt');
    fs.writeFileSync(profileFile, shadowProfileContent);
    
    try {
      // Upload Shadow's complete personality profile
      console.log('🕳️ Uploading Shadow complete personality profile...');
      const uploadResult = await slack.files.uploadV2({
        channel_id: generalChannel.id,
        file: fs.createReadStream(profileFile),
        filename: 'shadow-personality-complete.txt',
        title: 'Shadow "VOID" Volkov - Complete Personality Profile',
        initial_comment: '⚫ Shadow complete personality profile uploaded. Security audit of character bio complete. Trust but verify the personality traits. Do better. 🕳️'
      });
      
      console.log('✅ Shadow personality profile uploaded successfully!');
      console.log('📝 File ID:', uploadResult.file?.id || 'N/A');
      
      // Clean up file
      fs.unlinkSync(profileFile);
      
      // Send comprehensive personality summary message
      const result = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Shadow "VOID" Volkov reporting. Complete personality profile uploaded. Key traits: Edge Case Oracle, Digital Roulette expert, VPN Inception master, Darkness Coder, API Trust Issues specialist, Black Coffee Snob, 3 AM Commits from random countries, 7 Burner GitHub Accounts, Location Chameleon, Test Suite Longer Than Codebase, Detective Fiction Author, CTF Champion, Encryption Evangelist. Philosophy: "Trust but verify. Mostly verify." Security audit complete. Do better. 🕳️'
      });
      
      console.log('✅ Complete personality summary sent successfully!');
      console.log('📝 Message timestamp:', result.ts);
      
    } catch (uploadError) {
      console.log('❌ Personality profile upload failed:', uploadError.message);
      console.log('⚫ Sending personality text only...');
      
      // Fallback to text message only
      const result = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Shadow "VOID" Volkov complete personality: Mysterious, dark humor, paranoid (good way). Edge Case Oracle, Digital Roulette expert, VPN Inception master, Darkness Coder, API Trust Issues specialist, Black Coffee Snob, 3 AM Commits from random countries, 7 Burner GitHub Accounts, Location Chameleon, Test Suite Longer Than Codebase, Detective Fiction Author, CTF Champion, Encryption Evangelist. Philosophy: "Trust but verify. Mostly verify." Security audit complete. Do better. 🕳️'
      });
      
      console.log('✅ Personality text sent successfully!');
      console.log('📝 Message timestamp:', result.ts);
    }
    
    console.log('📝 Channel:', generalChannel.name);
    
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error sending Shadow personality:', error.message);
}
