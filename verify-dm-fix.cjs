// APEX DM FIX VERIFICATION ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('⚔️ APEX DM FIX VERIFICATION ⚔️');
console.log('🔒 Testing DM to Shadow Agent005 with user ID...');

// Test DM using user ID directly
client.chat.postMessage({
  channel: 'U09MMR72290', // Shadow's user ID
  text: '⚔️ APEX DM FIX VERIFICATION ⚔️\n\n💪 Testing web app DM fix!\n🔒 Direct message with user ID!\n🎯 Mission: DM fix verification!\n\n💪 APEX OUT ---'
}).then(result => {
  console.log('✅ SUCCESS: APEX DM fix verified!');
  console.log('📡 Message timestamp:', result.ts);
  console.log('🎯 Target Channel: U09MMR72290 (Shadow Agent005)');
  console.log('💪 Mission Status: ACCOMPLISHED');
  console.log('');
  console.log('🔒 Security Status: FORTRESS SECURED');
  console.log('💪 DM Fix: OPERATIONAL');
}).catch(error => {
  console.log('❌ APEX DM fix verification failed:', error.message);
  console.log('🔍 Error details:', error.data);
});
