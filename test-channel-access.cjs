// APEX CHANNEL ACCESS TEST ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX CHANNEL ACCESS TEST');
console.log('Testing channel access without invite...');

// Test sending to #general channel (most common channel)
client.chat.postMessage({
  channel: '#general',
  text: '⚔️ APEX CHANNEL ACCESS TEST ⚔️\n\n💪 Agent: RAZE "APEX" KILLIAN\n🔒 Testing channel access without invite\n🎯 Mission: Direct channel messaging\n\nAPEX testing channel permissions! 💪\n\n--- APEX OUT ---'
}).then(result => {
  console.log('✅ SUCCESS: Message sent to #general without invite!');
  console.log('📡 Message timestamp:', result.ts);
  console.log('🎯 Channel:', result.channel);
  console.log('💪 APEX can write to channels without invite!');
}).catch(error => {
  console.log('❌ FAILED: Cannot write to #general without invite');
  console.log('🔍 Error:', error.message);
  console.log('📋 Error data:', error.data);
  
  // Try a different channel
  console.log('');
  console.log('Testing #random channel...');
  
  client.chat.postMessage({
    channel: '#random',
    text: '⚔️ APEX CHANNEL ACCESS TEST ⚔️\n\n💪 Testing #random channel access\n🎯 Mission: Alternative channel test\n\n--- APEX OUT ---'
  }).then(result => {
    console.log('✅ SUCCESS: Message sent to #random!');
    console.log('📡 Message timestamp:', result.ts);
  }).catch(error2 => {
    console.log('❌ FAILED: Cannot write to #random either');
    console.log('🔍 Error:', error2.message);
    console.log('');
    console.log('CONCLUSION: APEX needs to be invited to channels');
    console.log('💡 Solution: Invite @raze_agent003 to channels');
  });
});
