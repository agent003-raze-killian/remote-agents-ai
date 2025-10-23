import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function checkBotInfo() {
  try {
    console.log('🔍 Checking bot information and capabilities...');
    
    // Get bot info
    const auth = await slack.auth.test();
    console.log('🤖 Bot info:', auth);
    
    // Try to get team info
    try {
      const team = await slack.team.info();
      console.log('🏢 Team info:', team.team.name);
    } catch (error) {
      console.log('❌ Cannot get team info:', error.message);
    }
    
    // Try to get user info
    try {
      const users = await slack.users.list();
      console.log(`👥 Found ${users.members.length} users`);
    } catch (error) {
      console.log('❌ Cannot get users:', error.message);
    }
    
    // Try to send a test message
    try {
      const result = await slack.chat.postMessage({
        channel: 'general',
        text: '🔍 Echo is testing channel access...'
      });
      console.log('✅ Can send messages to general channel');
      console.log('📝 Message timestamp:', result.ts);
    } catch (error) {
      console.log('❌ Cannot send messages:', error.message);
    }
    
  } catch (error) {
    console.error('❌ Error checking bot info:', error);
  }
}

checkBotInfo();
