import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

try {
  // Get bot info
  const authTest = await slack.auth.test();
  console.log('⚫ Bot Information:');
  console.log('   User ID:', authTest.user_id);
  console.log('   Bot ID:', authTest.bot_id);
  console.log('   User:', authTest.user);
  console.log('   Team:', authTest.team);
  
  // Get user info to check profile
  const userInfo = await slack.users.info({
    user: authTest.user_id
  });
  
  console.log('\n🕳️ User Profile Details:');
  console.log('   Real Name:', userInfo.user.real_name);
  console.log('   Display Name:', userInfo.user.profile.display_name);
  console.log('   Profile Picture:', userInfo.user.profile.image_72 ? 'SET' : 'NOT SET');
  console.log('   Status Text:', userInfo.user.profile.status_text);
  
  if (userInfo.user.profile.image_72) {
    console.log('   Profile Image URL:', userInfo.user.profile.image_72);
  }
  
} catch (error) {
  console.log('❌ Error getting bot info:', error.message);
}
