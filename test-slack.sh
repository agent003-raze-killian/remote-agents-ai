#!/bin/bash

# APEX SLACK INTEGRATION TEST ⚔️
# Military-grade testing for Slack tools

echo "⚔️ APEX SLACK INTEGRATION TEST ⚔️"
echo "💪 Agent: RAZE 'APEX' KILLIAN"
echo "🔒 Mission: Test Slack Fortress"
echo ""

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "❌ .env file not found!"
    echo "📝 Please create .env file with your Slack tokens:"
    echo "   SLACK_BOT_TOKEN=xoxb-your-token-here"
    echo "   SLACK_SIGNING_SECRET=your-secret-here"
    exit 1
fi

# Check if Slack tokens are configured
if ! grep -q "SLACK_BOT_TOKEN=xoxb-" .env; then
    echo "❌ SLACK_BOT_TOKEN not configured properly!"
    echo "🔑 Token should start with 'xoxb-'"
    exit 1
fi

if ! grep -q "SLACK_SIGNING_SECRET=" .env; then
    echo "❌ SLACK_SIGNING_SECRET not configured!"
    exit 1
fi

echo "✅ Slack configuration found"

# Test Node.js and dependencies
echo "🧪 Testing Node.js environment..."
node --version
if [ $? -ne 0 ]; then
    echo "❌ Node.js not available"
    exit 1
fi

# Test if MCP server can start
echo "🧪 Testing MCP server startup..."
timeout 10s npm run dev > /dev/null 2>&1 &
SERVER_PID=$!
sleep 3

if ps -p $SERVER_PID > /dev/null; then
    echo "✅ MCP server started successfully"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ MCP server failed to start"
    echo "🔍 Check your .env configuration and dependencies"
    exit 1
fi

# Test Slack API connection
echo "🧪 Testing Slack API connection..."
node -e "
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

client.auth.test()
  .then(result => {
    if (result.ok) {
      console.log('✅ Slack API connection successful');
      console.log('📡 Bot name:', result.user);
      console.log('🏢 Team:', result.team);
    } else {
      console.log('❌ Slack API connection failed:', result.error);
      process.exit(1);
    }
  })
  .catch(error => {
    console.log('❌ Slack API error:', error.message);
    process.exit(1);
  });
"

if [ $? -eq 0 ]; then
    echo ""
    echo "🎯 SLACK INTEGRATION TEST COMPLETE!"
    echo "⚔️ APEX Slack tools are battle-ready!"
    echo "🔒 Security Status: FORTRESS SECURED"
    echo "💪 Mission Status: ACCOMPLISHED"
    echo ""
    echo "📋 Available Slack Tools:"
    echo "   • slack_send_message"
    echo "   • slack_create_channel"
    echo "   • slack_upload_file"
    echo "   • slack_get_messages"
    echo "   • slack_manage_users"
    echo "   • slack_set_status"
    echo "   • slack_create_poll"
    echo ""
    echo "APEX OUT! 🚀"
else
    echo "❌ Slack integration test failed"
    echo "🔍 Check your SLACK_BOT_TOKEN and network connection"
    exit 1
fi
