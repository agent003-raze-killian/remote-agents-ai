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

// Function to check for new messages and reply
async function checkAndReply() {
  try {
    console.log('🔍 Checking for new messages...');
    
    // Get recent messages from general channel
    const result = await slack.conversations.history({
      channel: '#general',
      limit: 5 // Reduced to avoid rate limits
    });
    
    if (result.messages) {
      for (const message of result.messages) {
        // Skip bot messages, processed messages, and messages older than 2 minutes
        if (message.bot_id || message.user === 'USLACKBOT' || processedMessages.has(message.ts)) continue;
        
        const messageTime = new Date(parseFloat(message.ts) * 1000);
        const twoMinutesAgo = new Date(Date.now() - 2 * 60 * 1000);
        
        if (messageTime < twoMinutesAgo) continue;
        
        // Check if message contains "@echo" (case insensitive)
        if (message.text && message.text.toLowerCase().includes('@echo')) {
          console.log(`🔔 Found @echo message: ${message.text}`);
          
          // Mark as processed
          processedMessages.add(message.ts);
          
          // Generate energetic response
          const response = `⚡ YOOO! Echo is here with ENERGY! 🚀\n\nI detected "@echo" in your message: "${message.text}"\n\nReady to CRUSH it! 💪✨`;
          
          // Send response back to the channel
          await slack.chat.postMessage({
            channel: '#general',
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
    
  } catch (error) {
    console.error('❌ Error checking messages:', error);
  }
}

// Function to send periodic test messages (less frequent)
async function sendTestMessage() {
  try {
    const testMessage = `⚡ Echo is ALIVE and ENERGETIC! 🚀\n\nTesting every 5 minutes!\n\nReady to CRUSH it! 💪✨`;
    
    await slack.chat.postMessage({
      channel: '#general',
      text: testMessage,
      username: echoPersonality.name,
      icon_emoji: echoPersonality.emoji
    });
    
    console.log('⚡ Echo sent test message!');
    
  } catch (error) {
    console.error('❌ Error sending test message:', error);
  }
}

// Main function
async function startEcho() {
  console.log('🚀 Starting Echo Simple Auto-Reply...');
  console.log('🔧 Echo will check for @echo mentions every 60 seconds');
  console.log('⏰ Echo will send test messages every 5 minutes');
  console.log('⚡ Ready to CRUSH it!');
  
  // Check for @echo mentions every 60 seconds (less frequent)
  setInterval(checkAndReply, 60 * 1000);
  
  // Send test messages every 5 minutes (less frequent)
  setInterval(sendTestMessage, 5 * 60 * 1000);
  
  // Send initial test message
  await sendTestMessage();
  
  // Do an initial check
  await checkAndReply();
}

// Start Echo
startEcho().catch(console.error);
