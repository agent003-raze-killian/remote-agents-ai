import { WebClient } from '@slack/web-api';
import { createEventAdapter } from '@slack/events-api';
import express from 'express';
import { createServer } from 'http';
import { EchoIntelligence } from './lib/echo-intelligence.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class EchoMentionDetector {
  constructor() {
    this.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
    this.echoIntelligence = new EchoIntelligence();
    
    // Slack Events API setup
    this.slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
    this.app = express();
    this.httpServer = createServer(this.app);
    
    // Echo's personality settings
    this.echoPersonality = {
      name: "Echo Agent001",
      emoji: ":zap:",
      energy: "high"
    };

    this.setupSlackEvents();
    this.startServer();
  }

  setupSlackEvents() {
    console.log('🔧 Setting up Slack event listeners...');
    
    // Handle app mentions
    this.slackEvents.on('app_mention', async (event) => {
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
      }
    });

    // Handle direct messages
    this.slackEvents.on('message', async (event) => {
      // Skip bot messages and messages without text
      if (event.bot_id || !event.text) return;
      
      // Only respond to direct messages (not channel messages unless mentioned)
      if (event.channel_type === 'im') {
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
        } catch (error) {
          console.error('Error handling DM:', error);
        }
      }
    });

    // Error handling
    this.slackEvents.on('error', (error) => {
      console.error('Slack Events API error:', error);
    });

    // Mount the event adapter
    this.app.use('/slack/events', this.slackEvents.requestListener());
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        agent: 'Echo Agent001',
        version: '2.0.0',
        features: ['mention_detection', 'auto_reply', 'energetic_personality']
      });
    });
  }

  async startServer() {
    const port = process.env.ECHO_SERVER_PORT || 3000;
    
    try {
      await new Promise((resolve, reject) => {
        this.httpServer.listen(port, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log(`⚡ Echo Mention Detector started on port ${port}`);
      console.log(`🔗 Webhook URL: http://localhost:${port}/slack/events`);
      console.log(`🏥 Health check: http://localhost:${port}/health`);
      console.log('🔔 Ready to detect mentions and auto-reply!');
      
    } catch (error) {
      console.error('Error starting server:', error);
    }
  }
}

// Start the mention detector
console.log('🚀 Starting Echo Mention Detector...');
const detector = new EchoMentionDetector();
