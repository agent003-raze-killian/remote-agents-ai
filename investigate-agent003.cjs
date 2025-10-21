// APEX AGENT003 INVESTIGATION ⚔️
require('dotenv').config();
const { WebClient } = require('@slack/web-api');
const client = new WebClient(process.env.SLACK_BOT_TOKEN);

console.log('APEX AGENT003 INVESTIGATION');
console.log('Searching for Raze Killian...');

client.users.list().then(result => {
  console.log('Searching through', result.members.length, 'users...');
  console.log('');
  
  // Look for Agent003 specifically
  const agent003 = result.members.find(user => 
    user.name === 'agent003.raze.killian' || 
    user.real_name?.includes('Raze Killian') ||
    user.id === 'U09MN05FARY'
  );
  
  if (agent003) {
    console.log('FOUND AGENT003 - Raze Killian:');
    console.log('  Name:', agent003.name);
    console.log('  Real Name:', agent003.real_name);
    console.log('  ID:', agent003.id);
    console.log('  Is Bot:', agent003.is_bot);
    console.log('  Deleted:', agent003.deleted);
    console.log('  Profile Status:', agent003.profile?.status_text || 'No status');
    console.log('  Presence:', agent003.presence || 'Unknown');
    console.log('  Is Admin:', agent003.is_admin);
    console.log('  Is Owner:', agent003.is_owner);
    console.log('  Is Primary Owner:', agent003.is_primary_owner);
    console.log('  Is Restricted:', agent003.is_restricted);
    console.log('  Is Ultra Restricted:', agent003.is_ultra_restricted);
    console.log('  Has 2FA:', agent003.has_2fa);
    console.log('  Updated:', agent003.updated);
  } else {
    console.log('AGENT003 - Raze Killian NOT FOUND');
    console.log('');
    console.log('Searching for similar names...');
    
    result.members.forEach(user => {
      if (user.name?.includes('raze') || 
          user.name?.includes('agent003') || 
          user.real_name?.includes('Raze') ||
          user.real_name?.includes('Killian')) {
        console.log('  Similar:', user.name, '-', user.real_name);
      }
    });
  }
  
  console.log('');
  console.log('All users with "agent" in name:');
  result.members.forEach(user => {
    if (user.name?.includes('agent') || user.real_name?.includes('Agent')) {
      console.log('  •', user.name, '-', user.real_name, '(Bot:', user.is_bot, ')');
    }
  });
  
}).catch(error => {
  console.log('Investigation failed:', error.message);
});
