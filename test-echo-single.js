import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function testEcho() {
  try {
    console.log('🧪 Testing Echo auto-reply (single test)...');
    
    // Send a test message with @echo
    const testMessage = `@echo hello! This is a single test message! 🚀`;
    
    const result = await slack.chat.postMessage({
      channel: '#general',
      text: testMessage
    });
    
    console.log('✅ Test message sent:', testMessage);
    console.log('📝 Message timestamp:', result.ts);
    console.log('⏰ Echo should respond within 60 seconds...');
    console.log('🛑 This is a single test - no more messages will be sent');
    
  } catch (error) {
    console.error('❌ Error sending test message:', error);
  }
}

testEcho();
