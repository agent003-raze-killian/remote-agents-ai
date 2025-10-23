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

// Function to check for new messages and reply
async function checkAndReply() {
  try {
    console.log('🔍 Checking for new messages...');
    
    // Get recent messages from general channel
    const result = await slack.conversations.history({
      channel: '#general',
      limit: 10
    });
    
    let mentionCount = 0;
    
    if (result.messages) {
      for (const message of result.messages) {
        // Skip bot messages and messages older than 5 minutes
        if (message.bot_id || message.user === 'USLACKBOT') continue;
        
        const messageTime = new Date(parseFloat(message.ts) * 1000);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        if (messageTime < fiveMinutesAgo) continue;
        
        // Check if message contains "@echo" (case insensitive)
        if (message.text && message.text.toLowerCase().includes('@echo')) {
          mentionCount++;
          console.log(`🔔 Found @echo message: ${message.text}`);
          
          // Check if Echo already replied to this message
          const replies = await slack.conversations.replies({
            channel: '#general',
            ts: message.ts
          });
          
          const echoAlreadyReplied = replies.messages.some(reply => 
            reply.username === echoPersonality.name || 
            reply.text.includes('Echo is here with ENERGY')
          );
          
          if (!echoAlreadyReplied) {
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
          }
        }
      }
      
      // Log summary
      console.log(`📋 Checked ${result.messages.length} messages - Found ${mentionCount} @Echo mention${mentionCount !== 1 ? 's' : ''}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking messages:', error);
  }
}

// Function to send periodic test messages
async function sendTestMessage() {
  try {
    const testMessage = `⚡ Echo is ALIVE and ENERGETIC! 🚀\n\nTesting every 2 minutes like Nova!\n\nReady to CRUSH it! 💪✨`;
    
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
  console.log('🔧 Echo will check for @echo mentions every 30 seconds');
  console.log('⏰ Echo will send test messages every 2 minutes');
  console.log('⚡ Ready to CRUSH it!');
  
  // Check for @echo mentions every 30 seconds
  setInterval(checkAndReply, 30 * 1000);
  
  // Send test messages every 2 minutes
  setInterval(sendTestMessage, 2 * 60 * 1000);
  
  // Send initial test message
  await sendTestMessage();
}

// Start Echo
startEcho().catch(console.error);
