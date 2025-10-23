import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

async function testEchoAccess() {
  try {
    console.log('🧪 Testing Echo access to channels...');
    
    // Test 1: Can Echo send messages?
    console.log('📤 Testing message sending...');
    try {
      const result = await slack.chat.postMessage({
        channel: 'general',
        text: '🔍 Echo is testing channel access...'
      });
      console.log('✅ Echo can send messages to general channel');
      console.log('📝 Message timestamp:', result.ts);
    } catch (error) {
      console.log('❌ Echo cannot send messages:', error.message);
    }
    
    // Test 2: Can Echo read messages?
    console.log('\n📖 Testing message reading...');
    try {
      const result = await slack.conversations.history({
        channel: 'general',
        limit: 5
      });
      console.log('✅ Echo can read messages from general channel');
      console.log(`📋 Found ${result.messages.length} messages`);
    } catch (error) {
      console.log('❌ Echo cannot read messages:', error.message);
    }
    
    // Test 3: Try different channel formats
    console.log('\n🔍 Testing different channel formats...');
    const formats = ['general', '#general', 'C073JQZQZ'];
    
    for (const format of formats) {
      try {
        const result = await slack.conversations.history({
          channel: format,
          limit: 1
        });
        console.log(`✅ Channel format "${format}" works!`);
        break;
      } catch (error) {
        console.log(`❌ Channel format "${format}" failed: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Error testing Echo access:', error);
  }
}

testEchoAccess();
