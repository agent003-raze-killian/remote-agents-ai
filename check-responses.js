import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function checkEchoResponses() {
  try {
    console.log('🔍 Checking Echo responses...');
    
    const channelId = 'C09MFH9JTK5'; // general channel ID
    
    // Get recent messages
    const result = await slack.conversations.history({
      channel: channelId,
      limit: 50 // Check more messages for Echo mentions
    });
    
    console.log(`📋 Checked ${result.messages.length} recent messages for Echo mentions:`);
    
    result.messages.forEach((message, index) => {
      const time = new Date(parseFloat(message.ts) * 1000).toLocaleTimeString();
      const sender = message.username || message.user || 'Unknown';
      const text = message.text || 'No text';
      
      console.log(`${index + 1}. [${time}] ${sender}: ${text.substring(0, 60)}${text.length > 60 ? '...' : ''}`);
      
      // Check if this is an Echo response
      if (sender === 'Echo Agent006' && text.includes('Echo is here with ENERGY')) {
        console.log(`🎉 ECHO RESPONSE FOUND!`);
        console.log(`⚡ ${text}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error checking responses:', error);
  }
}

checkEchoResponses();
