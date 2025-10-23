#!/usr/bin/env node
/**
 * 🚀 Echo Agent Webhook Server
 * Handles Slack events and interactivity for Echo Agent
 */

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
    return res.send(challenge);
  }

  // Handle events
  if (type === 'event_callback') {
    try {
      await handleSlackEvent(event);
      res.status(200).send('OK');
    } catch (error) {
      console.error('Error handling Slack event:', error);
      res.status(500).send('Error');
    }
  } else {
    res.status(200).send('OK');
  }
});

// Interactivity endpoint
app.post('/slack/interactive', verifySlackRequest, async (req, res) => {
  const payload = JSON.parse(req.body.payload);
  
  try {
    await handleSlackInteraction(payload);
    res.status(200).send('OK');
  } catch (error) {
    console.error('Error handling Slack interaction:', error);
    res.status(500).send('Error');
  }
});

// Handle Slack events
async function handleSlackEvent(event) {
  const { type, text, user, channel, bot_id } = event;

  // Ignore bot messages
  if (bot_id) return;

  // Handle app mentions
  if (type === 'app_mention') {
    const message = text.replace(/<@[^>]+>/g, '').trim();
    
    if (message) {
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
    }
  }

  // Handle direct messages
  if (type === 'message' && event.channel_type === 'im') {
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
  }
}

// Handle Slack interactions (buttons, modals, etc.)
async function handleSlackInteraction(payload) {
  const { type, user, channel, actions } = payload;

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
    }
  }
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    agent: 'Echo',
    personality: 'energetic',
    message: 'Let\'s gooo! 🚀'
  });
});

// Start server
app.listen(port, () => {
  console.error(`⚡ Echo Agent webhook server running on port ${port}`);
  console.error('🚀 Ready to bring the ENERGY!');
});

export default app;
