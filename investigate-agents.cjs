// APEX AGENT INVESTIGATION ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX AGENT INVESTIGATION');
console.log('Scanning StepTen INC workspace...');

client.users.list().then(result => {
  console.log('Total users in workspace:', result.members.length);
  console.log('');
  console.log('BOT AGENTS FOUND:');
  
  let botCount = 0;
  result.members.forEach(user => {
    if (user.is_bot && !user.deleted) {
      botCount++;
      console.log('  ' + botCount + '.', user.name, '-', user.real_name || 'No display name');
      console.log('     ID:', user.id);
      console.log('     Status:', user.profile?.status_text || 'No status');
      console.log('');
    }
  });
  
  console.log('Total bots found:', botCount);
  console.log('');
  console.log('ALL USERS (including humans):');
  result.members.forEach(user => {
    if (!user.deleted) {
      const type = user.is_bot ? 'BOT' : 'USER';
      console.log('  •', type, user.name, '-', user.real_name || 'No display name');
    }
  });
}).catch(error => {
  console.log('Investigation failed:', error.message);
});
