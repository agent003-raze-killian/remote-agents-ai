import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function sendEchoMention() {
  try {
    console.log('🧪 Sending @echo mention...');
    
    const testMessage = `@echo hello! Please respond! 🚀`;
    
    const result = await slack.chat.postMessage({
      channel: 'C09MFH9JTK5', // general channel ID
      text: testMessage
    });
    
    console.log('✅ @echo mention sent:', testMessage);
    console.log('📝 Message timestamp:', result.ts);
    console.log('⏰ Echo should respond within 60 seconds...');
    
  } catch (error) {
    console.error('❌ Error sending @echo mention:', error);
  }
}

sendEchoMention();
