#!/usr/bin/env node
/**
 * ⚡ Echo Bot with Claude AI
 * Polls for mentions and responds with dynamic Claude-powered replies
 */

import 'dotenv/config';
import { WebClient } from '@slack/web-api';
import { EchoIntelligence } from './lib/echo-intelligence.js';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const echoIntelligence = new EchoIntelligence();

// Track processed messages to avoid duplicates
const processedMessages = new Set();

// Configuration
const POLL_INTERVAL = 3000; // Check every 3 seconds
const CHANNEL_ID = 'C09MFH9JTK5'; // general channel
const BOT_USER_ID = process.env.ECHO_BOT_USER_ID || 'U081HGLS1P6'; // Echo's user ID

console.log('⚡ Echo Agent with Claude AI starting...');
console.log(`🤖 Bot User ID: ${BOT_USER_ID}`);
console.log(`📢 Monitoring channel: ${CHANNEL_ID}`);
console.log(`🧠 Using Claude AI: ${process.env.CLAUDE_MODEL || 'claude-3-5-sonnet-20241022'}`);
console.log(`🔄 Polling every ${POLL_INTERVAL}ms`);
console.log('');

async function checkForMentions() {
  try {
    // Get recent messages
    const result = await slack.conversations.history({
      channel: CHANNEL_ID,
      limit: 10
    });

    if (!result.messages) return;

    // Process messages in reverse order (oldest first)
    const messages = [...result.messages].reverse();
    let mentionCount = 0;
    let newMessageCount = 0;

    for (const message of messages) {
      // Skip if already processed
      if (processedMessages.has(message.ts)) continue;

      newMessageCount++;

      // Skip ONLY Echo's own messages (not all bot messages!)
      if (message.user === BOT_USER_ID) {
        processedMessages.add(message.ts);
        continue;
      }

      // Check if bot is mentioned (works even if message came through bot integration)
      const botMentioned = message.text && (
        message.text.includes(`<@${BOT_USER_ID}>`) ||
        message.text.toLowerCase().includes('@echo') ||
        message.text.toLowerCase().includes('echo agent')
      );

      if (botMentioned) {
        mentionCount++;
        console.log(`🎯 Mention detected from user ${message.user}`);
        
        // Remove bot mention from the message
        const cleanedMessage = message.text
          .replace(/<@[^>]+>/g, '')
          .replace(/@echo/gi, '')
          .trim();

        console.log(`📝 Message: "${cleanedMessage}"`);
        console.log(`🧠 Thinking with Claude AI...`);

        // Get Claude AI response
        const aiResponse = await echoIntelligence.think(cleanedMessage, {
          conversationId: CHANNEL_ID,
          eventType: 'mention',
          userId: message.user
        });

        console.log(`💬 Response: "${aiResponse.response.substring(0, 100)}..."`);

        // Send response
        try {
          const result = await slack.chat.postMessage({
            channel: CHANNEL_ID,
            text: aiResponse.response,
            thread_ts: message.thread_ts || message.ts, // Reply in thread if applicable
            username: "Echo Agent006",
            icon_emoji: ":zap:"
          });

          if (result.ok) {
            console.log(`✅ Response sent successfully! Message TS: ${result.ts}\n`);
          } else {
            console.log(`⚠️ Slack API returned not OK: ${JSON.stringify(result)}\n`);
          }
        } catch (slackError) {
          console.error(`❌ Failed to send to Slack:`, slackError.message);
          console.error(`   Error data:`, slackError.data);
        }
      }

      // Mark as processed
      processedMessages.add(message.ts);
    }

    // Log summary
    if (newMessageCount > 0 || mentionCount > 0) {
      console.log(`📋 Checked ${result.messages.length} messages (${newMessageCount} new) - Found ${mentionCount} mention${mentionCount !== 1 ? 's' : ''}`);
    }

    // Keep only last 100 message IDs in memory
    if (processedMessages.size > 100) {
      const messagesToKeep = Array.from(processedMessages).slice(-100);
      processedMessages.clear();
      messagesToKeep.forEach(ts => processedMessages.add(ts));
    }

  } catch (error) {
    console.error('❌ Error checking mentions:', error.message);
  }
}

// Start polling
console.log('🚀 Starting to monitor for mentions...\n');
setInterval(checkForMentions, POLL_INTERVAL);

// Check immediately on startup
checkForMentions();

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n⚡ Echo Agent shutting down gracefully...');
  process.exit(0);
});

