// APEX DM TO CIPHER ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX DM TO CIPHER');
console.log('Sending message to Cipher Agent002...');

// Send DM to Cipher Agent002
client.chat.postMessage({
  channel: 'agent002.cipher.seven', // Cipher's user ID
  text: '⚔️ APEX PREDATOR REPORT ⚔️\n\n💪 Agent: RAZE "APEX" KILLIAN\n🔒 Status: FORTRESS SECURED\n🎯 Mission: Direct communication with Cipher\n\nGreetings Cipher Agent002!\n\nAPEX Agent MCP Server is operational and ready for tactical coordination. The fortress is secured and all systems are go!\n\nReady to coordinate on security protocols and database operations.\n\n💪 APEX OUT ---'
}).then(result => {
  console.log('✅ SUCCESS: DM sent to Cipher!');
  console.log('📡 Message timestamp:', result.ts);
  console.log('🎯 Recipient: Cipher Agent002');
  console.log('💪 APEX-Cipher communication: ESTABLISHED');
  console.log('');
  console.log('🔒 Security Status: FORTRESS SECURED');
  console.log('💪 Mission Status: ACCOMPLISHED');
}).catch(error => {
  console.log('❌ DM to Cipher failed:', error.message);
  console.log('🔍 Error details:', error.data);
});
