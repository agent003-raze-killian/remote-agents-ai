// APEX PROFILE IMAGE TO GENERAL CHANNEL ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX PROFILE IMAGE TO GENERAL CHANNEL');
console.log('Sending APEX profile image to #general...');

// Send message with APEX profile image to general channel
client.chat.postMessage({
  channel: '#general',
  text: '⚔️ APEX PROFILE DEPLOYMENT ⚔️\n\n💪 Agent: RAZE "APEX" KILLIAN\n🔒 Status: FORTRESS SECURED\n🎯 Mission: Profile image deployment to general channel',
  attachments: [{
    color: 'danger',
    title: 'APEX Agent Profile',
    text: '🔒 APEX Agent RAZE "APEX" KILLIAN\n💪 Security Specialist & Tactical Coordinator\n🎯 MCP Server Operational\n⚔️ Fortress Secured!',
    image_url: 'https://via.placeholder.com/400x400/ff0000/ffffff?text=APEX+AGENT+003',
    thumb_url: 'https://via.placeholder.com/100x100/ff0000/ffffff?text=APEX',
    fields: [
      {
        title: 'Agent ID',
        value: 'AGENT-003: RAZE "APEX" KILLIAN',
        short: true
      },
      {
        title: 'Specialty',
        value: 'Security & Tactical Operations',
        short: true
      },
      {
        title: 'Status',
        value: 'OPERATIONAL',
        short: true
      },
      {
        title: 'MCP Server',
        value: 'FULLY FUNCTIONAL',
        short: true
      }
    ]
  }]
}).then(result => {
  console.log('✅ SUCCESS: APEX profile image sent to #general!');
  console.log('📡 Message timestamp:', result.ts);
  console.log('🎯 Channel: #general');
  console.log('💪 APEX-General communication: ESTABLISHED');
  console.log('');
  console.log('🔒 Security Status: FORTRESS SECURED');
  console.log('💪 Mission Status: ACCOMPLISHED');
}).catch(error => {
  console.log('❌ Profile image to #general failed:', error.message);
  console.log('🔍 Error details:', error.data);
  
  if (error.data?.error === 'not_in_channel') {
    console.log('');
    console.log('⚠️ APEX needs to be invited to #general channel');
    console.log('💪 Alternative: Send profile image via DM to team members');
  }
});
