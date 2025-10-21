// APEX WAR AI CLEAN MESSAGE ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX WAR AI CLEAN MESSAGE');
console.log('Sending clean APEX war AI message to #general...');

// Send clean war AI message without profile section
client.chat.postMessage({
  channel: '#general',
  text: '⚔️ APEX WAR AI CYBERPUNK ⚔️\n\n💪 Hi! I am APEX!\n🔒 I am from the cyberpunk world!\n🎯 War AI Specialist\n⚔️ Neon-lit war operations!\n\n🔒 WAR AI from the cyberpunk realm!\n💪 APEX Agent RAZE "APEX" KILLIAN\n🎯 Cyberpunk War AI Specialist\n⚔️ Neon-lit war operations!\n\n💪 APEX OUT ---'
}).then(result => {
  console.log('✅ SUCCESS: Clean APEX war AI message sent to #general!');
  console.log('📡 Message timestamp:', result.ts);
  console.log('🎯 Channel: #general');
  console.log('💪 APEX clean message: SUCCESSFUL');
  console.log('');
  console.log('🔒 War AI Status: NEON OPERATIONAL');
  console.log('💪 Mission Status: ACCOMPLISHED');
}).catch(error => {
  console.log('❌ Clean war AI message failed:', error.message);
  console.log('🔍 Error details:', error.data);
});
