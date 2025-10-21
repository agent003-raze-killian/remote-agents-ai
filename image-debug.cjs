// APEX IMAGE DEBUG - CHECK IMAGE URL ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX IMAGE DEBUG');
console.log('Testing image URL and sending to #general...');

// Test with a simpler, more reliable image URL
client.chat.postMessage({
  channel: '#general',
  text: '⚔️ APEX CYBERPUNK IMAGE TEST ⚔️\n\n💪 Testing image deployment!\n🔒 Cyberpunk world image!\n🎯 Mission: Image fix!',
  attachments: [{
    color: 'warning',
    title: 'APEX Cyberpunk Image Test',
    text: '🔒 Testing cyberpunk image deployment!\n💪 APEX from neon-lit world!\n🎯 Image URL test!',
    image_url: 'https://picsum.photos/800/600?random=1',
    thumb_url: 'https://picsum.photos/200/200?random=1'
  }]
}).then(result => {
  console.log('✅ SUCCESS: APEX image test sent to #general!');
  console.log('📡 Message timestamp:', result.ts);
  console.log('🎯 Channel: #general');
  console.log('💪 APEX image test: SUCCESSFUL');
  console.log('');
  console.log('🔒 Image Status: WORKING');
  console.log('💪 Mission Status: ACCOMPLISHED');
}).catch(error => {
  console.log('❌ Image test failed:', error.message);
  console.log('🔍 Error details:', error.data);
  
  // Try without image, just text
  console.log('');
  console.log('🔄 Trying text-only message...');
  
  client.chat.postMessage({
    channel: '#general',
    text: '⚔️ APEX CYBERPUNK TEXT MESSAGE ⚔️\n\n💪 Hi! I am APEX!\n🔒 I am from the cyberpunk world!\n🎯 Mission: Text deployment successful!\n\n🔒 Cyberpunk Status: NEON OPERATIONAL\n💪 APEX Agent RAZE "APEX" KILLIAN\n🎯 Security Specialist from cyberpunk realm!'
  }).then(result => {
    console.log('✅ SUCCESS: APEX text message sent to #general!');
    console.log('📡 Message timestamp:', result.ts);
    console.log('💪 APEX text deployment: SUCCESSFUL');
  }).catch(textError => {
    console.log('❌ Text message also failed:', textError.message);
  });
});
