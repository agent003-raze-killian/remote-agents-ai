import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function checkDMHistory() {
  try {
    console.log('⚫ Checking DM channel history...');
    
    // Check the DM channels we created
    const dmChannels = ['D09M70566A3', 'D09MLAW7WBY']; // Kyle and Aaron's DM channels
    
    for (const channelId of dmChannels) {
      try {
        console.log(`🕳️ Checking channel: ${channelId}`);
        
        const history = await slack.conversations.history({
          channel: channelId,
          limit: 5
        });
        
        console.log(`📝 Messages in ${channelId}:`, history.messages.length);
        
        if (history.messages.length > 0) {
          history.messages.forEach(msg => {
            console.log(`📝 Message: ${msg.text} (${msg.ts})`);
          });
        }
        
        // Get channel info
        const channelInfo = await slack.conversations.info({
          channel: channelId
        });
        
        console.log(`📝 Channel info:`, {
          id: channelInfo.channel.id,
          is_im: channelInfo.channel.is_im,
          is_open: channelInfo.channel.is_open,
          user: channelInfo.channel.user
        });
        
      } catch (channelError) {
        console.log(`❌ Error checking ${channelId}:`, channelError.message);
      }
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

checkDMHistory();
