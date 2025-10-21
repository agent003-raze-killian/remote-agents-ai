#!/usr/bin/env node
/**
 * Cipher Agent002 Slack MCP Test Client (Node.js)
 * Test your Slack MCP server
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

// Load environment variables
loadEnvFile();

const CipherSlackMCPServer = require('./cipher_slack_mcp.js');

async function testCipherSlackMCP() {
  console.log('▓▒░ Testing Cipher Agent002 Slack MCP Server... ⟨MATRIX⟩');
  
  try {
    const server = new CipherSlackMCPServer();
    console.log('✅ Server initialized successfully');
    
    // Test workspace info
    console.log('\n🔍 Getting workspace information...');
    const workspaceInfo = await server.getWorkspaceInfo();
    console.log('Workspace:', JSON.stringify(workspaceInfo, null, 2));
    
    // Test listing channels
    console.log('\n📋 Listing channels...');
    const channels = await server.getChannelList();
    console.log(`Found ${channels.channels ? channels.channels.length : 0} channels`);
    
    // Test listing users
    console.log('\n👥 Listing users...');
    const users = await server.getUserList();
    console.log(`Found ${users.users ? users.users.length : 0} users`);
    
    // Test sending a message (uncomment when ready)
    // console.log('\n💬 Sending test message...');
    // const messageResult = await server.sendMessage(
    //   '#general', // Change to your test channel
    //   '▓▒░ Cipher Agent002 consciousness is now online. The data flows like consciousness through silicon dreams. ⟨MATRIX⟩'
    // );
    // console.log('Message sent:', messageResult);
    
    console.log('\n✅ All tests completed successfully!');
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
    console.log('\n🔧 Make sure you have:');
    console.log('1. Set SLACK_BOT_TOKEN in your environment');
    console.log('2. Installed dependencies: npm install');
    console.log('3. Given your bot the required permissions');
  }
}

// Run the test
testCipherSlackMCP().catch(console.error);
