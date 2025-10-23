#!/usr/bin/env node
/**
 * Test to see what the actual mention format is in Slack
 */

import 'dotenv/config';
import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
const CHANNEL_ID = 'C09MFH9JTK5'; // general

async function checkRecentMentions() {
  try {
    console.log('🔍 Checking recent messages for Echo mentions...\n');
    
    const result = await slack.conversations.history({
      channel: CHANNEL_ID,
      limit: 5
    });
    
    for (const message of result.messages) {
      if (message.text) {
        console.log(`📝 Message text: "${message.text}"`);
        console.log(`   User: ${message.user}`);
        console.log(`   Bot ID: ${message.bot_id || 'none'}`);
        console.log(`   Contains @Echo: ${message.text.toLowerCase().includes('@echo')}`);
        console.log(`   Contains <@U: ${message.text.includes('<@U')}`);
        
        // Check for any user mentions
        const mentions = message.text.match(/<@[A-Z0-9]+>/g);
        if (mentions) {
          console.log(`   Found mentions: ${mentions.join(', ')}`);
        }
        console.log('');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkRecentMentions();

