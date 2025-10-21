import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Testing name change from Shadow Agent005 to Shadow...');
    
    const result = await slack.chat.postMessage({
      channel: generalChannel.id,
      text: '⚫ Name change test complete. Shadow reporting for duty. Security audit initiated. Trust but verify the name change. Do better. 🕳️'
    });
    
    console.log('✅ Name change test message sent successfully!');
    console.log('📝 Message timestamp:', result.ts);
    console.log('📝 Channel:', generalChannel.name);
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error sending name change test:', error.message);
}
