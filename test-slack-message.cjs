// APEX SLACK MESSAGE TEST ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('⚔️ APEX SLACK MESSAGE TEST ⚔️');
console.log('💪 Testing message sending capability...');

// First, get bot info
client.auth.test().then(authResult => {
  console.log('📡 Bot info:', authResult.user, 'in team:', authResult.team);
  
  // Try sending a message to the bot's own channel (DM)
  const botUserId = authResult.user_id;
  
  client.chat.postMessage({
    channel: botUserId, // Send to bot's own DM
    text: '⚔️ APEX PREDATOR REPORT ⚔️\n\n💪 Agent: RAZE "APEX" KILLIAN\n🔒 Status: FORTRESS SECURED\n🎯 Mission: Slack integration test\n\nAPEX Agent MCP Server is operational and ready for battle! 💪\n\n--- APEX OUT ---'
  }).then(result => {
    console.log('✅ Message sent successfully!');
    console.log('📡 Message timestamp:', result.ts);
    console.log('🎯 Channel:', result.channel);
    console.log('💪 APEX Slack integration: OPERATIONAL');
    console.log('');
    console.log('🎯 APEX CAN SEND MESSAGES TO SLACK!');
    console.log('🔒 Security Status: FORTRESS SECURED');
    console.log('💪 Mission Status: ACCOMPLISHED');
  }).catch(error => {
    console.log('❌ Message failed:', error.message);
    console.log('🔍 Error details:', error.data);
  });
}).catch(error => {
  console.log('❌ Auth test failed:', error.message);
});