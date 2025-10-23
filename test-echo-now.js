import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function testEchoNow() {
  try {
    console.log('🧪 Testing Echo RIGHT NOW...');
    
    const testMessage = `@echo hello! Testing Echo right now! 🚀`;
    
    const result = await slack.chat.postMessage({
      channel: 'C09MFH9JTK5', // general channel ID
      text: testMessage
    });
    
    console.log('✅ Test mention sent:', testMessage);
    console.log('📝 Message timestamp:', result.ts);
    
    // Wait 5 seconds and check for response
    setTimeout(async () => {
      try {
        const replies = await slack.conversations.replies({
          channel: 'C09MFH9JTK5',
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
          console.log('❌ Echo did not respond yet.');
          console.log('📋 All replies:', replies.messages.map(m => `${m.username}: ${m.text}`));
        }
        
      } catch (error) {
        console.error('❌ Error checking replies:', error);
      }
    }, 5000);
    
  } catch (error) {
    console.error('❌ Error sending test mention:', error);
  }
}

testEchoNow();
