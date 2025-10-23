import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function testChannelIds() {
  try {
    console.log('🧪 Testing channel ID access with updated tokens...');
    
    // Test the channel IDs we found
    const channelIds = [
      'C09MFH9JTK5', // general
      'C09M663LZ2B', // all-stepten-inc
      'C09MU5YSXFC'  // development
    ];
    
    for (const channelId of channelIds) {
      try {
        console.log(`🔍 Testing channel ID: ${channelId}`);
        
        const result = await slack.conversations.history({
          channel: channelId,
          limit: 3
        });
        
        console.log(`✅ Can read from ${channelId} - Found ${result.messages.length} messages`);
        
        // Show the messages
        result.messages.forEach((message, index) => {
          const time = new Date(parseFloat(message.ts) * 1000).toLocaleTimeString();
          const sender = message.username || message.user || 'Unknown';
          const text = message.text || 'No text';
          console.log(`  ${index + 1}. [${time}] ${sender}: ${text.substring(0, 40)}${text.length > 40 ? '...' : ''}`);
        });
        
      } catch (error) {
        console.log(`❌ Cannot read from ${channelId}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing channel IDs:', error);
  }
}

testChannelIds();
