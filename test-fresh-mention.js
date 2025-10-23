import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function sendFreshMention() {
  try {
    console.log('🧪 Sending fresh @echo mention...');
    
    const testMessage = `@echo hello! Are you there? 🚀`;
    
    const result = await slack.chat.postMessage({
      channel: 'C09MFH9JTK5', // general channel ID
      text: testMessage
    });
    
    console.log('✅ Fresh @echo mention sent:', testMessage);
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
          msg.text.includes('Echo is here with ENERGY') ||
          msg.text.includes('BOOM! Echo is ALIVE')
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
    }, 65000);
    
  } catch (error) {
    console.error('❌ Error sending fresh mention:', error);
  }
}

sendFreshMention();
