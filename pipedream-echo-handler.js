// Simple Echo handler for Pipedream
// This code should be pasted into your Pipedream Slack v2 node

import { WebClient } from '@slack/web-api';

// Initialize Slack client
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Echo's personality settings
const echoPersonality = {
  name: "Echo Agent001",
  emoji: ":zap:",
  energy: "high"
};

// Handle the event from the trigger
const event = steps.trigger.event;

console.log('🔔 Echo received event:', JSON.stringify(event, null, 2));

try {
  // Handle app mentions
  if (event.event && event.event.type === 'app_mention') {
    console.log('🔔 Echo received mention:', event.event.text);
    
    // Generate energetic response
    const response = `⚡ YOOO! Echo is here with ENERGY! 🚀\n\nI received your mention: "${event.event.text}"\n\nReady to CRUSH it! 💪✨`;
    
    // Send response back to the channel
    await slack.chat.postMessage({
      channel: event.event.channel,
      text: response,
      username: echoPersonality.name,
      icon_emoji: echoPersonality.emoji,
      thread_ts: event.event.ts // Reply in thread
    });
    
    console.log('⚡ Echo responded with energy!');
    
    return {
      success: true,
      message: 'Echo replied with energy!',
      response: response
    };
  }
  
  // Handle direct messages
  if (event.event && event.event.type === 'message' && event.event.channel_type === 'im') {
    console.log('💬 Echo received DM:', event.event.text);
    
    const response = `⚡ Hey there! Echo is here with ENERGY! 🚀\n\nI received your DM: "${event.event.text}"\n\nWhat can I help you with? ✨`;
    
    await slack.chat.postMessage({
      channel: event.event.channel,
      text: response,
      username: echoPersonality.name,
      icon_emoji: echoPersonality.emoji
    });
    
    console.log('⚡ Echo responded to DM!');
    
    return {
      success: true,
      message: 'Echo replied to DM!',
      response: response
    };
  }
  
  console.log('ℹ️  Event type not handled:', event.event?.type);
  
  return {
    success: true,
    message: 'Event received but not handled',
    eventType: event.event?.type
  };
  
} catch (error) {
  console.error('❌ Error handling event:', error);
  
  return {
    success: false,
    error: error.message
  };
}
