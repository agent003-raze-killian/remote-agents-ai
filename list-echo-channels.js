#!/usr/bin/env node
/**
 * List all channels Echo has access to
 */

import 'dotenv/config';
import { WebClient } from '@slack/web-api';

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function listEchoChannels() {
  try {
    console.log('🔍 Finding all channels Echo can access...\n');
    
    // Get all conversations (channels) the bot is a member of
    const result = await slack.users.conversations({
      types: 'public_channel,private_channel',
      limit: 100
    });
    
    if (result.channels && result.channels.length > 0) {
      console.log(`✅ Echo has access to ${result.channels.length} channel(s):\n`);
      
      for (const channel of result.channels) {
        const isPrivate = channel.is_private ? '🔒' : '📢';
        const memberCount = channel.num_members || '?';
        
        console.log(`${isPrivate} #${channel.name}`);
        console.log(`   ID: ${channel.id}`);
        console.log(`   Members: ${memberCount}`);
        console.log(`   Private: ${channel.is_private ? 'Yes' : 'No'}`);
        
        // Try to get recent message count
        try {
          const history = await slack.conversations.history({
            channel: channel.id,
            limit: 1
          });
          console.log(`   Can read messages: ✅`);
        } catch (error) {
          console.log(`   Can read messages: ❌ (${error.message})`);
        }
        
        console.log('');
      }
    } else {
      console.log('❌ Echo is not a member of any channels yet!');
      console.log('\n💡 To add Echo to channels:');
      console.log('   1. Go to Slack');
      console.log('   2. Navigate to a channel');
      console.log('   3. Type: /invite @Echo');
    }
    
    // Also list all available public channels
    console.log('\n📋 All available public channels:');
    const allChannels = await slack.conversations.list({
      types: 'public_channel',
      exclude_archived: true,
      limit: 100
    });
    
    if (allChannels.channels) {
      for (const channel of allChannels.channels) {
        const isMember = result.channels?.some(c => c.id === channel.id);
        const status = isMember ? '✅ Member' : '➕ Not a member';
        console.log(`   ${status} - #${channel.name} (${channel.id})`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error listing channels:', error.message);
    if (error.data) {
      console.error('Error details:', error.data);
    }
  }
}

listEchoChannels();

