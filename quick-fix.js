#!/usr/bin/env node

/**
 * 🕵️ Shadow Agent005 Quick Fix Script
 * "If it can break, I will break it."
 */

import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('⚫ Shadow Agent005 Quick Fix Script');
console.log('🕳️ Diagnosing and fixing Slack MCP issues...\n');

try {
  // Check bot info
  const authTest = await slack.auth.test();
  console.log(`✅ Connected as: ${authTest.user}`);
  console.log(`✅ Team: ${authTest.team}\n`);

  // Check available channels
  const channels = await slack.conversations.list({ 
    types: 'public_channel', 
    limit: 10 
  });
  
  console.log('📋 Available channels:');
  channels.channels.forEach(c => {
    console.log(`   • ${c.name} (${c.id})`);
  });
  
  // Find general channel
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log(`\n🕳️ Testing general channel access...`);
    
    // Test message sending
    try {
      const messageResult = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Shadow Agent005 diagnostic message. Testing channel access.'
      });
      console.log('✅ Message sending: WORKING');
    } catch (error) {
      console.log('❌ Message sending:', error.message);
    }
    
    // Test channel info
    try {
      const channelInfo = await slack.conversations.info({
        channel: generalChannel.id
      });
      console.log(`✅ Channel info: Bot is ${channelInfo.channel.is_member ? 'MEMBER' : 'NOT A MEMBER'} of #general`);
      
      if (!channelInfo.channel.is_member) {
        console.log('\n⚠️  ISSUE FOUND: Bot is not a member of #general');
        console.log('🔧 SOLUTION: Add bot to #general channel');
        console.log('   Method 1: In Slack, type: /invite @Shadow Agent005');
        console.log('   Method 2: Channel settings → Integrations → Add apps');
      }
    } catch (error) {
      console.log('❌ Channel info:', error.message);
    }
    
    // Test history access
    try {
      const history = await slack.conversations.history({
        channel: generalChannel.id,
        limit: 1
      });
      console.log('✅ History access: WORKING');
    } catch (error) {
      console.log('❌ History access:', error.message);
      
      if (error.message.includes('not_in_channel')) {
        console.log('\n⚠️  ISSUE FOUND: Bot cannot access channel history');
        console.log('🔧 SOLUTION: Reinstall the Slack app to activate channels:history scope');
        console.log('   1. Go to: https://api.slack.com/apps');
        console.log('   2. Select: Shadow Agent005 MCP app');
        console.log('   3. Go to: OAuth & Permissions');
        console.log('   4. Click: "Reinstall to Workspace"');
        console.log('   5. Confirm the reinstallation');
      }
    }
  } else {
    console.log('\n❌ General channel not found');
    console.log('🔧 SOLUTION: Create a #general channel or add bot to an existing channel');
  }
  
  console.log('\n⚫ Diagnostic complete.');
  console.log('🕳️ "Trust but verify. Mostly verify."');
  
} catch (error) {
  console.log(`⚫ Error: ${error.message}`);
}
