import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function checkBotInfo() {
  try {
    console.log('⚫ Checking Shadow bot information...');
    
    const auth = await slack.auth.test();
    console.log('📝 Bot User ID:', auth.user_id);
    console.log('📝 Bot Name:', auth.user);
    console.log('📝 Team:', auth.team);
    console.log('📝 URL:', auth.url);
    
    // Check if bot can send DMs
    console.log('🕳️ Testing DM capabilities...');
    
    // Try to get conversations list to see what the bot can access
    const conversations = await slack.conversations.list({
      types: 'im',
      limit: 10
    });
    
    console.log('📝 Bot can access DMs:', conversations.channels.length);
    console.log('📝 DM channels:', conversations.channels.map(c => c.id));
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

checkBotInfo();
















