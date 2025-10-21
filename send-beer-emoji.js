import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Sending beer emoji message to #general...');
    
    const result = await slack.chat.postMessage({
      channel: generalChannel.id,
      text: '⚫ Security audit: Visual confirmation required. Beer status: 🍺🍺🍺🍺🍺 Multiple units detected. Trust but verify the alcohol content. Do better. 🕳️'
    });
    
    console.log('✅ Beer emoji message sent successfully!');
    console.log('📝 Message timestamp:', result.ts);
    console.log('📝 Channel:', generalChannel.name);
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error sending message:', error.message);
}
