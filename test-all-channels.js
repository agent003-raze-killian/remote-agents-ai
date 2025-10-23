import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function testAllChannels() {
  try {
    console.log('🧪 Testing all possible channel access...');
    
    // Test channels you mentioned
    const channels = [
      'general',
      '#general',
      'all-stepten-inc',
      '#all-stepten-inc',
      'development',
      '#development'
    ];
    
    console.log('📤 Testing message sending to each channel...');
    for (const channel of channels) {
      try {
        const result = await slack.chat.postMessage({
          channel: channel,
          text: `🔍 Echo testing access to ${channel}`
        });
        console.log(`✅ Can send to ${channel} - Message ID: ${result.ts}`);
      } catch (error) {
        console.log(`❌ Cannot send to ${channel}: ${error.message}`);
      }
    }
    
    console.log('\n📖 Testing message reading from each channel...');
    for (const channel of channels) {
      try {
        const result = await slack.conversations.history({
          channel: channel,
          limit: 1
        });
        console.log(`✅ Can read from ${channel} - Found ${result.messages.length} messages`);
      } catch (error) {
        console.log(`❌ Cannot read from ${channel}: ${error.message}`);
      }
    }
    
    // Try to list all channels Echo has access to
    console.log('\n🔍 Trying to list all accessible channels...');
    try {
      const channelsList = await slack.conversations.list({
        types: 'public_channel,private_channel'
      });
      console.log(`✅ Found ${channelsList.channels.length} accessible channels:`);
      channelsList.channels.forEach(channel => {
        console.log(`  - ${channel.name} (ID: ${channel.id})`);
      });
    } catch (error) {
      console.log(`❌ Cannot list channels: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error testing channels:', error);
  }
}

testAllChannels();
