import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Echo's personality settings
const echoPersonality = {
  name: "Echo Agent006",
  emoji: ":zap:",
  energy: "high"
};

// Track processed messages to avoid duplicates
const processedMessages = new Set();

// Function to check for new messages and reply ONLY when mentioned
async function checkAndReply() {
  try {
    console.log('🔍 Checking for new messages...');
    
    // Use the general channel ID
    const channelId = 'C09MFH9JTK5';
    
    // Get recent messages from the channel
    const result = await slack.conversations.history({
      channel: channelId,
      limit: 10
    });
    
    console.log(`📋 Checked ${result.messages.length} messages for @Echo mentions`);
    
    if (result.messages) {
      for (const message of result.messages) {
        console.log(`📝 Checking message: "${message.text}"`);
        console.log(`   - Bot ID: ${message.bot_id}`);
        console.log(`   - User: ${message.user}`);
        console.log(`   - Processed: ${processedMessages.has(message.ts)}`);
        
        // Skip bot messages, processed messages, and messages older than 5 minutes
        if (message.bot_id || message.user === 'USLACKBOT' || processedMessages.has(message.ts)) {
          console.log(`   - Skipping message (bot/processed)`);
          continue;
        }
        
        const messageTime = new Date(parseFloat(message.ts) * 1000);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        if (messageTime < fiveMinutesAgo) {
          console.log(`   - Skipping message (too old)`);
          continue;
        }
        
        // Check if message contains "@echo" (case insensitive)
        if (message.text && message.text.toLowerCase().includes('@echo')) {
          console.log(`🔔 Found @echo message: ${message.text}`);
          
          // Mark as processed
          processedMessages.add(message.ts);
          
          // Generate energetic response
          const response = `⚡ YOOO! Echo is here with ENERGY! 🚀\n\nI detected "@echo" in your message: "${message.text}"\n\nReady to CRUSH it! 💪✨`;
          
          // Send response back to the channel
          await slack.chat.postMessage({
            channel: channelId,
            text: response,
            username: echoPersonality.name,
            icon_emoji: echoPersonality.emoji,
            thread_ts: message.ts // Reply in thread
          });
          
          console.log('⚡ Echo responded to @echo mention!');
          
          // Wait a bit to avoid rate limits
          await new Promise(resolve => setTimeout(resolve, 2000));
        } else {
          console.log(`   - No @echo found in message`);
        }
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking messages:', error.message);
  }
}

// Main function
async function startEcho() {
  console.log('🚀 Starting Echo Debug Version...');
  console.log('🔧 Echo will check for @echo mentions every 30 seconds');
  console.log('⚡ NO SPAM - Only replies when mentioned!');
  console.log('⚡ Ready to CRUSH it!');
  
  // Check for @echo mentions every 30 seconds
  setInterval(checkAndReply, 30 * 1000);
  
  // Do an initial check
  await checkAndReply();
}

// Start Echo
startEcho().catch(console.error);
