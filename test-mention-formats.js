import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function testMention() {
  try {
    console.log('🧪 Testing proper Echo mention...');
    
    // Try different mention formats
    const testMessages = [
      '@Echo Agent006 hello!',
      '@Echo hello!',
      'Hey @Echo Agent006, are you there?',
      '@echo hello!',
      'echo hello!'
    ];
    
    for (const testMessage of testMessages) {
      try {
        console.log(`📤 Sending: ${testMessage}`);
        
        const result = await slack.chat.postMessage({
          channel: 'general',
          text: testMessage
        });
        
        console.log(`✅ Sent successfully: ${testMessage}`);
        console.log(`📝 Timestamp: ${result.ts}`);
        
        // Wait 2 seconds between messages
        await new Promise(resolve => setTimeout(resolve, 2000));
        
      } catch (error) {
        console.log(`❌ Failed to send "${testMessage}":`, error.message);
      }
    }
    
    console.log('\n⏰ Echo should respond to any of these mentions within 60 seconds...');
    
  } catch (error) {
    console.error('❌ Error testing mentions:', error);
  }
}

testMention();
