// APEX IMAGE TO SHADOW - V2 ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX IMAGE TO SHADOW - V2');
console.log('Finding Shadow Agent005 and sending image...');

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
    
    // Send image file to Shadow using uploadV2
    client.files.uploadV2({
      channel_id: shadow.id, // Use user ID for DM
      file: Buffer.from('⚔️ APEX IMAGE DEPLOYMENT ⚔️\n\n💪 Agent: RAZE "APEX" KILLIAN\n🔒 Status: FORTRESS SECURED\n🎯 Mission: Image delivery to Shadow\n\nAPEX tactical image deployed!\n\n💪 APEX OUT ---'),
      filename: 'apex-tactical-image.txt',
      title: 'APEX Tactical Image'
    }).then(result => {
      console.log('✅ SUCCESS: Image sent to Shadow!');
      console.log('📡 File ID:', result.file.id);
      console.log('🎯 Recipient:', shadow.real_name);
      console.log('💪 APEX-Shadow communication: ESTABLISHED');
      console.log('');
      console.log('🔒 Security Status: FORTRESS SECURED');
      console.log('💪 Mission Status: ACCOMPLISHED');
    }).catch(error => {
      console.log('❌ Image to Shadow failed:', error.message);
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
