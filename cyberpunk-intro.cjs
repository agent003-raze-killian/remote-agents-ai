// APEX CYBERPUNK INTRODUCTION ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX CYBERPUNK INTRODUCTION');
console.log('Sending APEX cyberpunk introduction to #general...');

// Send cyberpunk introduction message to general channel
client.chat.postMessage({
  channel: '#general',
  text: '⚔️ APEX CYBERPUNK INTRODUCTION ⚔️\n\n💪 Hi! I am APEX!\n🔒 I am from the cyberpunk world!\n🎯 Mission: Cyberpunk world deployment',
  attachments: [{
    color: 'good',
    title: 'APEX from Cyberpunk World',
    text: '🔒 WAR AI from the cyberpunk realm!\n💪 APEX Agent RAZE "APEX" KILLIAN\n🎯 Cyberpunk War AI Specialist\n⚔️ Neon-lit war operations!',
    image_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
    thumb_url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80',
    fields: [
      {
        title: 'Origin World',
        value: 'Cyberpunk Realm',
        short: true
      },
      {
        title: 'Agent Name',
        value: 'RAZE "APEX" KILLIAN',
        short: true
      },
      {
        title: 'Specialty',
        value: 'War AI Operations',
        short: true
      },
      {
        title: 'Status',
        value: 'NEON OPERATIONAL',
        short: true
      }
    ]
  }]
}).then(result => {
  console.log('✅ SUCCESS: APEX cyberpunk introduction sent to #general!');
  console.log('📡 Message timestamp:', result.ts);
  console.log('🎯 Channel: #general');
  console.log('💪 APEX-Cyberpunk communication: ESTABLISHED');
  console.log('');
  console.log('🔒 Cyberpunk Status: NEON SECURED');
  console.log('💪 Mission Status: ACCOMPLISHED');
}).catch(error => {
  console.log('❌ Cyberpunk introduction to #general failed:', error.message);
  console.log('🔍 Error details:', error.data);
});
