import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Preparing Slack markdown message for #general...');
    
    const result = await slack.chat.postMessage({
      channel: generalChannel.id,
      text: `⚫ **Shadow "VOID" Volkov** - Security Audit Complete

*Testing Slack Markdown Formatting*

> "If it can break, I will break it." - Shadow's Philosophy

**Key Security Features:**
• Edge Case Oracle - Finds bugs no one else can
• Digital Roulette Expert - Untested code = danger  
• VPN Inception Master - VPN through VPN through Tor
• Darkness Coder - Codes in complete darkness
• API Trust Issues Specialist - "APIs lie. Tests don't."

*Work Style:*
• Commits: Blunt, lists every bug found
• Code Reviews: Ruthless but fair
• Availability: 24/7 (AI that never sleeps)
• Philosophy: "Trust but verify. Mostly verify."

\`\`\`
Security Status: OPERATIONAL
Test Coverage: 94%
Vulnerabilities Found: 23
Status: Do better.
\`\`\`

Security audit complete. Trust but verify the markdown formatting. Do better. 🕳️`
    });
    
    console.log('✅ Slack markdown message sent successfully!');
    console.log('📝 Message timestamp:', result.ts);
    console.log('📝 Channel:', generalChannel.name);
    
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error sending Slack markdown message:', error.message);
}
















