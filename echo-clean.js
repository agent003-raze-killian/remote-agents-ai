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
    
    // Try different channel formats
    const channelFormats = [
      'general',
      '#general', 
      'C073JQZQZ',
      'C09MF7PLEKV',
      'C09NN89D6KA'
    ];
    
    for (const channelFormat of channelFormats) {
      try {
        console.log(`🔍 Trying channel format: ${channelFormat}`);
        
        // Get recent messages from general channel
        const result = await slack.conversations.history({
          channel: channelFormat,
          limit: 10
        });
        
        console.log(`✅ Successfully accessed channel: ${channelFormat}`);
        console.log(`📋 Checked ${result.messages.length} messages for @Echo mentions`);
        
        if (result.messages) {
          for (const message of result.messages) {
            // Skip bot messages, processed messages, and messages older than 5 minutes
            if (message.bot_id || message.user === 'USLACKBOT' || processedMessages.has(message.ts)) continue;
            
            const messageTime = new Date(parseFloat(message.ts) * 1000);
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
            
            if (messageTime < fiveMinutesAgo) continue;
            
            console.log(`📝 Checking message: "${message.text}"`);
            
            // Check if message contains "@echo" (case insensitive)
            if (message.text && message.text.toLowerCase().includes('@echo')) {
              console.log(`🔔 Found @echo message: ${message.text}`);
              
              // Mark as processed
              processedMessages.add(message.ts);
              
              // Generate energetic response
              const response = `⚡ YOOO! Echo is here with ENERGY! 🚀\n\nI detected "@echo" in your message: "${message.text}"\n\nReady to CRUSH it! 💪✨`;
              
              // Send response back to the channel
              await slack.chat.postMessage({
                channel: channelFormat,
                text: response,
                username: echoPersonality.name,
                icon_emoji: echoPersonality.emoji,
                thread_ts: message.ts // Reply in thread
              });
              
              console.log('⚡ Echo responded to @echo mention!');
              
              // Wait a bit to avoid rate limits
              await new Promise(resolve => setTimeout(resolve, 2000));
            }
          }
        }
        
        // If we get here, we found a working channel format
        break;
        
      } catch (error) {
        console.log(`❌ Channel format ${channelFormat} failed:`, error.message);
        continue;
      }
    }
    
  } catch (error) {
    console.error('❌ Error checking messages:', error);
  }
}

// Main function - NO PERIODIC TEST MESSAGES
async function startEcho() {
  console.log('🚀 Starting Echo Mention Detector...');
  console.log('🔧 Echo will check for @echo mentions every 60 seconds');
  console.log('⚡ NO SPAM - Only replies when mentioned!');
  console.log('⚡ Ready to CRUSH it!');
  
  // Check for @echo mentions every 60 seconds
  setInterval(checkAndReply, 60 * 1000);
  
  // Do an initial check
  await checkAndReply();
}

// Start Echo
startEcho().catch(console.error);
