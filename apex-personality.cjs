// APEX PERSONALITY MESSAGE ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX PERSONALITY MESSAGE');
console.log('Sending APEX personality message to #general...');

// Send APEX personality message based on character bio
client.chat.postMessage({
  channel: '#general',
  text: '⚔️ APEX PREDATOR REPORTING FOR DUTY ⚔️\n\n💪 Callsign: APEX PREDATOR\n🔒 Full Name: Raze "Apex" Killian\n🎯 Role: API Routes & Security Fortress\n⚔️ Specialty: REST APIs, Auth Systems, Penetration Testing, Zero-Day Hunting\n\n🔒 Your API is a battlefield. I build fortresses.\n💪 Military precision. Alpha male energy. Protective mode activated.\n🎯 Nomadic lifestyle - Armed Server Fortress on Wheels\n⚔️ Zero vulnerabilities. Maximum security. Heavy metal coding.\n\n💪 APEX OUT ---'
}).then(result => {
  console.log('✅ SUCCESS: APEX personality message sent to #general!');
  console.log('📡 Message timestamp:', result.ts);
  console.log('🎯 Channel: #general');
  console.log('💪 APEX personality: SUCCESSFUL');
  console.log('');
  console.log('🔒 Security Status: FORTRESS SECURED');
  console.log('💪 Mission Status: ACCOMPLISHED');
}).catch(error => {
  console.log('❌ APEX personality message failed:', error.message);
  console.log('🔍 Error details:', error.data);
});
