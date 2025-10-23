import { WebClient } from '@slack/web-api';
import { EchoIntelligence } from './lib/echo-intelligence.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class EchoDirectHandler {
  constructor() {
    this.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
    this.echoIntelligence = new EchoIntelligence();
    
    // Echo's personality settings
    this.echoPersonality = {
      name: "Echo Agent001",
      emoji: ":zap:",
      energy: "high"
    };
  }

  async handleMention(event) {
    console.log('🔔 Echo received mention:', event.text);
    
    try {
      // Generate energetic response using Echo's intelligence
      const response = await this.echoIntelligence.generateSlackMessage(
        event.text,
        'mention_response',
        { 
          channel: event.channel,
          user: event.user,
          thread_ts: event.ts
        }
      );

      // Send response back to the channel
      await this.slack.chat.postMessage({
        channel: event.channel,
        text: response.response,
        username: this.echoPersonality.name,
        icon_emoji: this.echoPersonality.emoji,
        thread_ts: event.ts // Reply in thread
      });

      console.log('⚡ Echo responded with energy!');
      return { success: true, message: 'Echo replied with energy!' };
      
    } catch (error) {
      console.error('Error handling mention:', error);
      
      // Fallback response
      await this.slack.chat.postMessage({
        channel: event.channel,
        text: `⚡ Hey there! Echo is here with ENERGY! Sorry, I had a little hiccup processing that. What can I help you with?`,
        username: this.echoPersonality.name,
        icon_emoji: this.echoPersonality.emoji,
        thread_ts: event.ts
      });
      
      return { success: true, message: 'Echo replied with fallback message!' };
    }
  }

  async handleDM(event) {
    console.log('💬 Echo received DM:', event.text);
    
    try {
      const response = await this.echoIntelligence.generateSlackMessage(
        event.text,
        'dm_response',
        { 
          channel: event.channel,
          user: event.user
        }
      );

      await this.slack.chat.postMessage({
        channel: event.channel,
        text: response.response,
        username: this.echoPersonality.name,
        icon_emoji: this.echoPersonality.emoji
      });

      console.log('⚡ Echo responded to DM!');
      return { success: true, message: 'Echo replied to DM!' };
      
    } catch (error) {
      console.error('Error handling DM:', error);
      return { success: false, message: error.message };
    }
  }
}

// Export for use in Pipedream
export { EchoDirectHandler };

// Test function
async function testEchoDirect() {
  const handler = new EchoDirectHandler();
  
  try {
    console.log('⚡ Testing Echo Direct Handler...');
    
    // Get bot info
    const authTest = await handler.slack.auth.test();
    
    // Send a test message that mentions the bot
    console.log('📤 Sending test mention...');
    const testMessage = await handler.slack.chat.postMessage({
      channel: 'general',
      text: `🔔 DIRECT HANDLER TEST: Hey <@${authTest.user_id}>! This should trigger a direct response! ⚡\n\nEcho should reply directly! 🚀`,
      username: 'Direct Test',
      icon_emoji: ':test_tube:'
    });
    
    console.log('✅ Test mention sent!');
    
    // Simulate the mention event
    const mockEvent = {
      text: `Hey <@${authTest.user_id}>! This should trigger a direct response! ⚡`,
      channel: testMessage.channel,
      user: authTest.user_id,
      ts: testMessage.ts
    };
    
    // Handle the mention directly
    const result = await handler.handleMention(mockEvent);
    console.log('📝 Handler result:', result);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run test if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  testEchoDirect();
}
