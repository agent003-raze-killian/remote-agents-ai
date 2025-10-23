import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function sendTestMention() {
  try {
    console.log('🧪 Sending test mention to Echo...');
    
    const testMessage = `@echo hello! Testing if Echo responds! 🚀`;
    
    const result = await slack.chat.postMessage({
      channel: 'C09MFH9JTK5', // general channel ID
      text: testMessage
    });
    
    console.log('✅ Test mention sent:', testMessage);
    console.log('📝 Message timestamp:', result.ts);
    console.log('⏰ Echo should respond within 60 seconds...');
    
    // Wait 65 seconds and check for response
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
          console.log('❌ Echo did not respond yet. Check if echo-ids is running.');
        }
        
      } catch (error) {
        console.error('❌ Error checking replies:', error);
      }
    }, 65000);
    
  } catch (error) {
    console.error('❌ Error sending test mention:', error);
  }
}

sendTestMention();
