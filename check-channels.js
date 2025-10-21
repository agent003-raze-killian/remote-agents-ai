import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

try {
  const result = await slack.conversations.list({ 
    types: 'public_channel', 
    limit: 5 
  });
  
  console.log('⚫ Available channels:');
  result.channels.forEach(c => {
    console.log(`- ${c.name} (ID: ${c.id})`);
  });
  
  if (result.channels.length > 0) {
    const firstChannel = result.channels[0];
    console.log(`\n🕳️ Testing history access for: ${firstChannel.name}`);
    
    try {
      const history = await slack.conversations.history({
        channel: firstChannel.id,
        limit: 1
      });
      console.log('✅ History access: WORKING');
    } catch (error) {
      console.log(`❌ History access: ${error.message}`);
    }
  }
} catch (error) {
  console.log(`⚫ Error: ${error.message}`);
}
