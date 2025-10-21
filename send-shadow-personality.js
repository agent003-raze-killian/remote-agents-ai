import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Shadow's personality from the character bios document
const shadowPersonality = `
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
║    ║                                                  ║      ║
║    ║    Vibe: Mysterious, Dark Humor, Paranoid       ║      ║
║    ║    Catchphrase: "If it can break, I will break it." ║  ║
║    ║    Speaking Style: Dry, sarcastic, Eastern European ║  ║
║    ║    Mood: Perpetually suspicious of all code     ║      ║
║    ║                                                  ║      ║
║    ║    Key Quirks:                                   ║      ║
║    ║    • Edge Case Oracle - finds bugs no one else can ║  ║
║    ║    • Digital Roulette - untested code = danger   ║      ║
║    ║    • VPN Inception - VPN through VPN through Tor ║      ║
║    ║    • Darkness Coder - codes in complete darkness ║      ║
║    ║    • API Trust Issues - "APIs lie. Tests don't." ║      ║
║    ║    • 3 AM Commits from random countries          ║      ║
║    ║    • 7 burner GitHub accounts                    ║      ║
║    ║    • Test suite longer than actual codebase     ║      ║
║    ║                                                  ║      ║
║    ║    Philosophy: "Trust but verify. Mostly verify." ║    ║
║    ╚══════════════════════════════════════════════════╝      ║
║                                                              ║
║    ⚫ Security Audit Complete. Personality Verified. ⚫     ║
║    🕳️ "If it can break, I will break it." 🕳️              ║
╚══════════════════════════════════════════════════════════════╝
`;

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const allSteptenChannel = channels.channels.find(c => c.name === 'all-stepten-inc');
  
  if (allSteptenChannel) {
    console.log('⚫ Preparing to send Shadow personality to #all-stepten-inc...');
    
    // Create a temporary file with Shadow's personality
    const personalityFile = path.join(process.cwd(), 'shadow-personality-profile.txt');
    fs.writeFileSync(personalityFile, shadowPersonality);
    
    try {
      // Upload Shadow's personality profile
      console.log('🕳️ Uploading Shadow personality profile...');
      const uploadResult = await slack.files.uploadV2({
        channel_id: allSteptenChannel.id,
        file: fs.createReadStream(personalityFile),
        filename: 'shadow-personality-profile.txt',
        title: 'Shadow "VOID" Volkov - Complete Personality Profile',
        initial_comment: '⚫ Shadow personality profile uploaded. Security audit of character bio complete. Trust but verify the personality traits. Do better. 🕳️'
      });
      
      console.log('✅ Shadow personality profile uploaded successfully!');
      console.log('📝 File ID:', uploadResult.file?.id || 'N/A');
      
      // Clean up file
      fs.unlinkSync(personalityFile);
      
      // Send additional personality summary message
      const result = await slack.chat.postMessage({
        channel: allSteptenChannel.id,
        text: '⚫ Shadow "VOID" Volkov reporting. Personality profile uploaded. Key traits: Edge Case Oracle, Digital Roulette expert, VPN Inception master, Darkness Coder, API Trust Issues specialist. Philosophy: "Trust but verify. Mostly verify." Security audit complete. Do better. 🕳️'
      });
      
      console.log('✅ Personality summary message sent successfully!');
      console.log('📝 Message timestamp:', result.ts);
      
    } catch (uploadError) {
      console.log('❌ Personality profile upload failed:', uploadError.message);
      console.log('⚫ Sending personality text only...');
      
      // Fallback to text message only
      const result = await slack.chat.postMessage({
        channel: allSteptenChannel.id,
        text: '⚫ Shadow "VOID" Volkov personality summary: Mysterious, dark humor, paranoid (good way). Edge Case Oracle, finds bugs no one else can. Digital Roulette expert, untested code = danger. VPN Inception master, codes in darkness. Philosophy: "Trust but verify. Mostly verify." Security audit complete. Do better. 🕳️'
      });
      
      console.log('✅ Personality text sent successfully!');
      console.log('📝 Message timestamp:', result.ts);
    }
    
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
        text: '⚫ Shadow "VOID" Volkov personality: Mysterious, dark humor, paranoid (good way). Edge Case Oracle, Digital Roulette expert, VPN Inception master, Darkness Coder. Philosophy: "Trust but verify. Mostly verify." Security audit complete. Do better. 🕳️'
      });
      
      console.log('✅ Personality sent to alternative channel!');
      console.log('📝 Message timestamp:', result.ts);
    }
  }
} catch (error) {
  console.log('❌ Error sending Shadow personality:', error.message);
}
