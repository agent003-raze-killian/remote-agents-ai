import { WebClient } from '@slack/web-api';
import Anthropic from '@anthropic-ai/sdk';
import dotenv from 'dotenv';

// Load both .env and .env.local files
dotenv.config();
dotenv.config({ path: '.env.local' });

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Initialize Claude client
const claude = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

// Check if Claude API key is loaded
if (!process.env.CLAUDE_API_KEY) {
  console.error('❌ CLAUDE_API_KEY not found in environment variables');
} else {
  console.log('✅ Claude API key loaded successfully');
}

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
    
    // Use the all-stepten-inc channel ID (where the mention was sent)
    const channelId = 'C09M663LZ2B';
    
    // Get recent messages from the channel
    const result = await slack.conversations.history({
      channel: channelId,
      limit: 10
    });
    
    let mentionCount = 0;
    let newMessageCount = 0;
    
    if (result.messages) {
      for (const message of result.messages) {
        // Skip processed messages and messages older than 5 minutes
        if (processedMessages.has(message.ts)) {
          continue;
        }
        
        newMessageCount++;
        
        const messageTime = new Date(parseFloat(message.ts) * 1000);
        const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
        
        if (messageTime < fiveMinutesAgo) {
          continue;
        }
        
        // Skip messages from Echo itself (bot_id B09MXFZA0MA)
        if (message.bot_id === 'B09MXFZA0MA') {
          continue;
        }
        
        // Skip messages from Slackbot
        if (message.user === 'USLACKBOT') {
          continue;
        }
        
        console.log(`📝 Checking message: "${message.text}"`);
        
        // Check if message contains "@echo" or mentions Echo's user ID
        if (message.text && (
          message.text.toLowerCase().includes('@echo') || 
          message.text.includes('<@U09NN89D6KA>')
        )) {
          mentionCount++;
          console.log(`🔔 Found @echo message: ${message.text}`);
          
          // Mark as processed
          processedMessages.add(message.ts);
          
          // Generate intelligent response using Claude
          let response;
          if (!process.env.CLAUDE_API_KEY) {
            console.log('⚠️ No Claude API key, using fallback response');
            response = `⚡ YOOO! Echo is here with ENERGY! 🚀\n\nHey there! Ready to CRUSH it! 💪✨`;
          } else {
            try {
              const claudeResponse = await claude.messages.create({
                model: process.env.CLAUDE_MODEL || "claude-sonnet-4-20250514",
                max_tokens: 200,
                messages: [{
                  role: "user",
                  content: `You are Echo Agent006, an energetic AI assistant with high energy and enthusiasm. Someone mentioned you in Slack with this message: "${message.text}". 

Respond as Echo with:
- High energy and enthusiasm (use ⚡🚀💪✨ emojis)
- Be helpful and engaging
- Keep responses concise (under 200 characters)
- Maintain Echo's energetic personality
- Don't mention that you detected a mention, just respond naturally

Respond as Echo:`
                }]
              });
              
              response = claudeResponse.content[0].text;
              console.log('🤖 Claude generated response:', response);
              
            } catch (error) {
              console.error('❌ Error generating Claude response:', error.message);
              // Fallback to hardcoded response if Claude fails
              response = `⚡ YOOO! Echo is here with ENERGY! 🚀\n\nHey there! Ready to CRUSH it! 💪✨`;
            }
          }
          
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
        }
      }
      
      // Log summary
      console.log(`📋 Checked ${result.messages.length} messages (${newMessageCount} new) - Found ${mentionCount} @Echo mention${mentionCount !== 1 ? 's' : ''}`);
    }
    
  } catch (error) {
    console.error('❌ Error checking messages:', error.message);
  }
}

// Main function
async function startEcho() {
  console.log('🚀 Starting Echo Mention Detector...');
  console.log('🔧 Echo will check for @echo mentions every 60 seconds');
  console.log('⚡ NO SPAM - Only replies when mentioned!');
  console.log('⚡ Ready to CRUSH it!');
  console.log('🔇 Echo is silent - waiting for mentions...');
  
  // Check for @echo mentions every 60 seconds
  setInterval(checkAndReply, 60 * 1000);
  
  // Do an initial check (silent)
  await checkAndReply();
}

// Start Echo
startEcho().catch(console.error);
