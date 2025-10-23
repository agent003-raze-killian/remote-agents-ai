#!/usr/bin/env node
/**
 * ⚡ Echo Agent Webhook Server
 * Handles Slack events and interactivity for Echo Agent
 */

import 'dotenv/config';
import express from 'express';
import { WebClient } from '@slack/web-api';
import { EchoIntelligence } from './lib/echo-intelligence.js';

const app = express();
const port = process.env.PORT || 3000;

// Initialize Slack client and Echo intelligence
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const echoIntelligence = new EchoIntelligence();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Verify Slack requests
const verifySlackRequest = (req, res, next) => {
  const signature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  
  // In production, you should verify the signature
  // For now, we'll skip verification for development
  next();
};

// Event Subscriptions endpoint
app.post('/slack/events', verifySlackRequest, async (req, res) => {
  const { type, event, challenge } = req.body;

  // Handle URL verification
  if (type === 'url_verification') {
    console.log('✅ URL verification received, sending challenge back');
    return res.status(200).json({ challenge });
  }

  // Handle events
  if (type === 'event_callback') {
    // Acknowledge immediately
    res.status(200).send('OK');
    
    try {
      await handleSlackEvent(event);
    } catch (error) {
      console.error('Error handling Slack event:', error);
    }
  } else {
    res.status(200).send('OK');
  }
});

// Interactivity endpoint
app.post('/slack/interactive', verifySlackRequest, async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  
  // Acknowledge immediately
  res.status(200).send('OK');
  
  try {
    await handleSlackInteraction(payload);
  } catch (error) {
    console.error('Error handling Slack interaction:', error);
  }
});

// Handle Slack events
async function handleSlackEvent(event) {
  const { type, text, user, channel, bot_id } = event;

  // Ignore bot messages
  if (bot_id) return;

  console.log(`📨 Received event: ${type} in channel ${channel}`);

  // Handle app mentions
  if (type === 'app_mention') {
    const message = text.replace(/<@[^>]+>/g, '').trim();
    
    if (message) {
      console.log(`🎯 Mention detected: "${message}"`);
      
      const response = await echoIntelligence.think(message, {
        conversationId: channel,
        eventType: 'mention'
      });

      await slack.chat.postMessage({
        channel: channel,
        text: response.response,
        username: "Echo Agent001",
        icon_emoji: ":zap:"
      });
      
      console.log('✅ Response sent!');
    }
  }

  // Handle direct messages
  if (type === 'message' && event.channel_type === 'im') {
    console.log(`💬 Direct message received: "${text}"`);
    
    const response = await echoIntelligence.think(text, {
      conversationId: channel,
      eventType: 'dm'
    });

    await slack.chat.postMessage({
      channel: channel,
      text: response.response,
      username: "Echo Agent001",
      icon_emoji: ":zap:"
    });
    
    console.log('✅ DM response sent!');
  }
}

// Handle Slack interactions (buttons, modals, etc.)
async function handleSlackInteraction(payload) {
  const { type, user, channel, actions } = payload;

  console.log(`🔘 Interaction received: ${type}`);

  if (type === 'block_actions') {
    // Handle button clicks, etc.
    const action = actions[0];
    
    if (action.action_id === 'echo_analyze') {
      const response = await echoIntelligence.think('Analyze the current codebase', {
        conversationId: channel.id,
        eventType: 'interaction'
      });

      await slack.chat.postMessage({
        channel: channel.id,
        text: response.response,
        username: "Echo Agent001",
        icon_emoji: ":zap:"
      });
      
      console.log('✅ Interaction response sent!');
    }
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    agent: 'Echo',
    personality: 'energetic',
    message: 'Let\'s gooo! 🚀',
    timestamp: new Date().toISOString()
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    agent: 'Echo Agent001',
    status: 'VIBING! ✨',
    endpoints: {
      events: '/slack/events',
      interactive: '/slack/interactive',
      health: '/health'
    }
  });
});

// Start server
app.listen(port, () => {
  console.log(`⚡ Echo Agent webhook server running on port ${port}`);
  console.log(`🚀 Ready to bring the ENERGY!`);
  console.log(`📡 Listening at http://localhost:${port}`);
  console.log(`\n🔗 Endpoints:`);
  console.log(`   - POST /slack/events (Event Subscriptions)`);
  console.log(`   - POST /slack/interactive (Interactivity)`);
  console.log(`   - GET /health (Health Check)`);
});

export default app;
