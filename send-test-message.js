import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Sending test message to #general...');
    
    const result = await slack.chat.postMessage({
      channel: generalChannel.id,
      text: '⚫ Shadow Agent005 test message #2. MCP functionality verified. If it can break, I will break it. Do better. 🕳️'
    });
    
    console.log('✅ Test message sent successfully!');
    console.log('📝 Message timestamp:', result.ts);
    console.log('📝 Channel:', generalChannel.name);
    console.log('📝 Message ID:', result.message.ts);
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error sending message:', error.message);
}
