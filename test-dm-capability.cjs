// APEX DM CAPABILITY TEST ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX DM CAPABILITY TEST');
console.log('Testing direct message capabilities...');

// Get list of users to test DM
client.users.list().then(result => {
  console.log('Found', result.members.length, 'users in workspace');
  
  // Find a human user (not bot) to test DM
  const humanUser = result.members.find(user => 
    !user.is_bot && 
    !user.deleted && 
    user.name !== 'slackbot' &&
    user.id !== 'USLACKBOT'
  );
  
  if (humanUser) {
    console.log('Testing DM to:', humanUser.name, '-', humanUser.real_name);
    
    client.chat.postMessage({
      channel: humanUser.id, // User ID for DM
      text: '⚔️ APEX DM TEST ⚔️\n\n💪 Agent: RAZE "APEX" KILLIAN\n🔒 Testing direct message capability\n🎯 Mission: DM without channel invite\n\nAPEX can send DMs to any user! 💪\n\n--- APEX OUT ---'
    }).then(result => {
      console.log('✅ SUCCESS: DM sent without invite!');
      console.log('📡 Message timestamp:', result.ts);
      console.log('🎯 Recipient:', humanUser.name);
      console.log('💪 APEX DM capability: OPERATIONAL');
    }).catch(error => {
      console.log('❌ DM failed:', error.message);
    });
  } else {
    console.log('❌ No human users found for DM test');
  }
}).catch(error => {
  console.log('❌ User list failed:', error.message);
});
