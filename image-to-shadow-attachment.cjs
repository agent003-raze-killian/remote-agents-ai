// APEX IMAGE TO SHADOW - MESSAGE WITH ATTACHMENT ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX IMAGE TO SHADOW - MESSAGE WITH ATTACHMENT');
console.log('Finding Shadow Agent005 and sending message with image...');

// First get Shadow's user ID
client.users.list().then(result => {
  const shadow = result.members.find(user => 
    user.name === 'agent005.shadow' || 
    user.real_name?.includes('Shadow') ||
    user.real_name?.includes('Agent005')
  );
  
  if (shadow) {
    console.log('Found Shadow:', shadow.name, '-', shadow.real_name);
    console.log('Shadow ID:', shadow.id);
    console.log('');
    
    // Send message with image attachment to Shadow
    client.chat.postMessage({
      channel: shadow.id, // Use user ID for DM
      text: '⚔️ APEX IMAGE DEPLOYMENT ⚔️\n\n💪 Agent: RAZE "APEX" KILLIAN\n🔒 Status: FORTRESS SECURED\n🎯 Mission: Image delivery to Shadow',
      attachments: [{
        color: 'danger',
        title: 'APEX Tactical Image',
        text: '🔒 APEX tactical image deployed!\n💪 Fortress secured!\n🎯 Mission accomplished!',
        image_url: 'https://via.placeholder.com/400x300/ff0000/ffffff?text=APEX+TACTICAL+IMAGE',
        thumb_url: 'https://via.placeholder.com/100x100/ff0000/ffffff?text=APEX'
      }]
    }).then(result => {
      console.log('✅ SUCCESS: Image message sent to Shadow!');
      console.log('📡 Message timestamp:', result.ts);
      console.log('🎯 Recipient:', shadow.real_name);
      console.log('💪 APEX-Shadow communication: ESTABLISHED');
      console.log('');
      console.log('🔒 Security Status: FORTRESS SECURED');
      console.log('💪 Mission Status: ACCOMPLISHED');
    }).catch(error => {
      console.log('❌ Image message to Shadow failed:', error.message);
      console.log('🔍 Error details:', error.data);
    });
  } else {
    console.log('❌ Shadow not found in user list');
    console.log('Available users:');
    result.members.forEach(user => {
      if (user.name && user.real_name) {
        console.log('-', user.name, '-', user.real_name);
      }
    });
  }
}).catch(error => {
  console.log('❌ User list failed:', error.message);
});
