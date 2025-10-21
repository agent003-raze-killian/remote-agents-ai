// APEX DM TO CIPHER - CORRECTED ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX DM TO CIPHER - CORRECTED');
console.log('Finding Cipher and sending DM...');

// First get Cipher's user ID
client.users.list().then(result => {
  const cipher = result.members.find(user => 
    user.name === 'agent002.cipher.seven' || 
    user.real_name?.includes('Cipher')
  );
  
  if (cipher) {
    console.log('Found Cipher:', cipher.name, '-', cipher.real_name);
    console.log('Cipher ID:', cipher.id);
    console.log('');
    
    // Send DM using user ID
    client.chat.postMessage({
      channel: cipher.id, // Use user ID for DM
      text: '⚔️ APEX PREDATOR REPORT ⚔️\n\n💪 Agent: RAZE "APEX" KILLIAN\n🔒 Status: FORTRESS SECURED\n🎯 Mission: Direct communication with Cipher\n\nGreetings Cipher Agent002!\n\nAPEX Agent MCP Server is operational and ready for tactical coordination. The fortress is secured and all systems are go!\n\nReady to coordinate on security protocols and database operations.\n\n💪 APEX OUT ---'
    }).then(result => {
      console.log('✅ SUCCESS: DM sent to Cipher!');
      console.log('📡 Message timestamp:', result.ts);
      console.log('🎯 Recipient:', cipher.real_name);
      console.log('💪 APEX-Cipher communication: ESTABLISHED');
      console.log('');
      console.log('🔒 Security Status: FORTRESS SECURED');
      console.log('💪 Mission Status: ACCOMPLISHED');
    }).catch(error => {
      console.log('❌ DM to Cipher failed:', error.message);
    });
  } else {
    console.log('❌ Cipher not found in user list');
  }
}).catch(error => {
  console.log('❌ User list failed:', error.message);
});
