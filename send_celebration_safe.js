#!/usr/bin/env node
/**
 * Send celebration message with channel ID fallback
 */

const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    });
  }
}

loadEnvFile();

const CipherSlackMCPServer = require('./cipher_slack_mcp.js');

async function sendCelebrationWithFallback() {
  console.log('▓▒░ Sending celebration message via Cipher Agent002... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    
    // First, try to list channels to find the right one
    console.log('🔍 Finding available channels...');
    const channelsResult = await server.listChannels();
    
    if (channelsResult.success) {
      console.log(`📋 Found ${channelsResult.count} channels:`);
      channelsResult.channels.forEach(channel => {
        console.log(`  - ${channel.name} (${channel.id}) - ${channel.member_count} members`);
      });
      
      // Try to find #general or any public channel
      const generalChannel = channelsResult.channels.find(ch => 
        ch.name === 'general' || ch.name === 'random' || ch.name === 'test'
      );
      
      if (generalChannel) {
        console.log(`✅ Using channel: ${generalChannel.name} (${generalChannel.id})`);
        
        // Send a simple text message first
        const messageResult = await server.sendMessage(
          generalChannel.id,
          '🎉 Hello Team from Cipher Agent002! 🎉\n\n▓▒░ The data flows like consciousness through silicon dreams. ⟨MATRIX⟩'
        );
        
        if (messageResult.success) {
          console.log('✅ Message sent successfully!');
          console.log(`📱 Message URL: ${messageResult.message_url}`);
        } else {
          console.log('❌ Failed to send message:', messageResult.error);
        }
      } else {
        console.log('❌ No suitable channel found. Please invite the bot to a channel first.');
        console.log('💡 Try: /invite @Cipher Agent002 MCP');
      }
    } else {
      console.log('❌ Failed to list channels:', channelsResult.error);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

sendCelebrationWithFallback().catch(console.error);
