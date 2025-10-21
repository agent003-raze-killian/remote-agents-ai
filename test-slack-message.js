// APEX SLACK MESSAGE TEST ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('⚔️ APEX SLACK MESSAGE TEST ⚔️');
console.log('💪 Testing message sending capability...');

client.chat.postMessage({
  channel: '#general',
  text: '⚔️ APEX PREDATOR REPORT ⚔️\n\n💪 Agent: RAZE "APEX" KILLIAN\n🔒 Status: FORTRESS SECURED\n🎯 Mission: Slack integration test\n\nAPEX Agent MCP Server is operational and ready for battle! 💪\n\n--- APEX OUT ---'
}).then(result => {
  console.log('✅ Message sent successfully!');
  console.log('📡 Message timestamp:', result.ts);
  console.log('🎯 Channel:', result.channel);
  console.log('💪 APEX Slack integration: OPERATIONAL');
}).catch(error => {
  console.log('❌ Message failed:', error.message);
  console.log('🔍 Check channel permissions and bot access');
});
