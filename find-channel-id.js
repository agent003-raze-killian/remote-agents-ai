import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function findChannel() {
  try {
    console.log('🔍 Finding the correct channel ID...');
    
    // List all channels
    const channels = await slack.conversations.list({
      types: 'public_channel,private_channel'
    });
    
    console.log('📋 Available channels:');
    channels.channels.forEach(channel => {
      console.log(`- ${channel.name} (ID: ${channel.id})`);
      if (channel.name === 'general') {
        console.log(`✅ Found general channel: ${channel.id}`);
      }
    });
    
    // Try to find general channel specifically
    const generalChannel = channels.channels.find(ch => ch.name === 'general');
    if (generalChannel) {
      console.log(`\n🎯 General channel ID: ${generalChannel.id}`);
      console.log(`📝 Use this ID in the scripts: ${generalChannel.id}`);
    } else {
      console.log('\n❌ General channel not found');
    }
    
  } catch (error) {
    console.error('❌ Error finding channels:', error);
  }
}

findChannel();
