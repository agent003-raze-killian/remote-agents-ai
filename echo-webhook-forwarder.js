import { WebClient } from '@slack/web-api';
import express from 'express';
import { createServer } from 'http';
import { EchoIntelligence } from './lib/echo-intelligence.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class EchoWebhookForwarder {
  constructor() {
    this.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
    this.echoIntelligence = new EchoIntelligence();
    this.app = express();
    this.httpServer = createServer(this.app);
    
    // Echo's personality settings
    this.echoPersonality = {
      name: "Echo Agent001",
      emoji: ":zap:",
      energy: "high"
    };

    this.setupWebhook();
    this.startServer();
  }

  setupWebhook() {
    console.log('🔧 Setting up webhook forwarder...');
    
    // Parse JSON bodies
    this.app.use(express.json());
    
    // Handle Slack events
    this.app.post('/slack/events', async (req, res) => {
      console.log('📨 Received webhook event:', JSON.stringify(req.body, null, 2));
      
      try {
        const event = req.body;
        
        // Handle URL verification challenge
        if (event.challenge) {
          console.log('✅ Responding to Slack challenge');
          return res.send(event.challenge);
        }
        
        // Handle app mentions
        if (event.event && event.event.type === 'app_mention') {
          console.log('🔔 Echo received mention:', event.event.text);
          
          try {
            // Generate energetic response using Echo's intelligence
            const response = await this.echoIntelligence.generateSlackMessage(
              event.event.text,
              'mention_response',
              { 
                channel: event.event.channel,
                user: event.event.user,
                thread_ts: event.event.ts
              }
            );

            // Send response back to the channel
            await this.slack.chat.postMessage({
              channel: event.event.channel,
              text: response.response,
              username: this.echoPersonality.name,
              icon_emoji: this.echoPersonality.emoji,
              thread_ts: event.event.ts // Reply in thread
            });

            console.log('⚡ Echo responded with energy!');
          } catch (error) {
            console.error('Error handling mention:', error);
            
            // Fallback response
            await this.slack.chat.postMessage({
              channel: event.event.channel,
              text: `⚡ Hey there! Echo is here with ENERGY! Sorry, I had a little hiccup processing that. What can I help you with?`,
              username: this.echoPersonality.name,
              icon_emoji: this.echoPersonality.emoji,
              thread_ts: event.event.ts
            });
          }
        }
        
        // Handle direct messages
        if (event.event && event.event.type === 'message' && event.event.channel_type === 'im') {
          console.log('💬 Echo received DM:', event.event.text);
          
          try {
            const response = await this.echoIntelligence.generateSlackMessage(
              event.event.text,
              'dm_response',
              { 
                channel: event.event.channel,
                user: event.event.user
              }
            );

            await this.slack.chat.postMessage({
              channel: event.event.channel,
              text: response.response,
              username: this.echoPersonality.name,
              icon_emoji: this.echoPersonality.emoji
            });

            console.log('⚡ Echo responded to DM!');
          } catch (error) {
            console.error('Error handling DM:', error);
          }
        }
        
        res.status(200).send('OK');
        
      } catch (error) {
        console.error('Webhook error:', error);
        res.status(500).send('Error');
      }
    });
    
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

      console.log(`⚡ Echo Webhook Forwarder started on port ${port}`);
      console.log(`🔗 Webhook URL: http://localhost:${port}/slack/events`);
      console.log(`🏥 Health check: http://localhost:${port}/health`);
      console.log('🔔 Ready to receive Slack events and auto-reply!');
      
    } catch (error) {
      console.error('Error starting server:', error);
    }
  }
}

// Start the webhook forwarder
console.log('🚀 Starting Echo Webhook Forwarder...');
const forwarder = new EchoWebhookForwarder();
