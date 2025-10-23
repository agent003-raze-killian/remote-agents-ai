import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function testEcho() {
  try {
    console.log('🧪 Testing Echo auto-reply...');
    
    // Send a test message with @echo
    const testMessage = `@echo hello! This is a test message to see if Echo responds! 🚀`;
    
    const result = await slack.chat.postMessage({
      channel: '#general',
      text: testMessage
    });
    
    console.log('✅ Test message sent:', testMessage);
    console.log('📝 Message timestamp:', result.ts);
    console.log('⏰ Echo should respond within 30 seconds...');
    
    // Wait 35 seconds and check for Echo's response
    setTimeout(async () => {
      try {
        const replies = await slack.conversations.replies({
          channel: '#general',
          ts: result.ts
        });
        
        const echoReplies = replies.messages.filter(msg => 
          msg.username === 'Echo Agent006' || 
          msg.text.includes('Echo is here with ENERGY')
        );
        
        if (echoReplies.length > 0) {
          console.log('🎉 SUCCESS! Echo responded:');
          echoReplies.forEach(reply => {
            console.log('⚡', reply.text);
          });
        } else {
          console.log('❌ Echo did not respond yet. Check if echo-simple-auto-reply.js is running.');
        }
        
      } catch (error) {
        console.error('❌ Error checking replies:', error);
      }
    }, 35000);
    
  } catch (error) {
    console.error('❌ Error sending test message:', error);
  }
}

testEcho();
