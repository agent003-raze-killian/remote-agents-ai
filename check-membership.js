import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 10 });
  
  console.log('⚫ Checking bot membership in channels:');
  for (const channel of channels.channels) {
    try {
      const info = await slack.conversations.info({ channel: channel.id });
      const isMember = info.channel.is_member;
      console.log(`   ${isMember ? '✅' : '❌'} #${channel.name} - ${isMember ? 'MEMBER' : 'NOT MEMBER'}`);
    } catch (error) {
      console.log(`   ❌ #${channel.name} - Error: ${error.message}`);
    }
  }
} catch (error) {
  console.log('❌ Error:', error.message);
}
