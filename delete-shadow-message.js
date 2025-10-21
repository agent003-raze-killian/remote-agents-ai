import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Function to find Shadow's recent messages in a channel
async function findShadowMessages(channelId, limit = 20) {
  try {
    const result = await slack.conversations.history({
      channel: channelId,
      limit: limit
    });
    
    // Look for messages from Shadow (containing Shadow's signature elements)
    const shadowMessages = result.messages.filter(msg => {
      const text = msg.text || '';
      return text.includes('Shadow "VOID" Volkov') || 
             text.includes('Edge Case Oracle') ||
             text.includes('Digital Roulette') ||
             text.includes('VPN Inception') ||
             text.includes('Trust but verify. Mostly verify') ||
             text.includes('Security audit complete') ||
             text.includes('Do better. 🕳️');
    });
    
    return shadowMessages;
  } catch (error) {
    console.log('❌ Error finding Shadow messages:', error.message);
    return [];
  }
}

// Function to delete a message
async function deleteMessage(channelId, timestamp) {
  try {
    const result = await slack.chat.delete({
      channel: channelId,
      ts: timestamp
    });
    
    return result;
  } catch (error) {
    console.log('❌ Error deleting message:', error.message);
    return null;
  }
}

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const allSteptenChannel = channels.channels.find(c => c.name === 'all-stepten-inc');
  
  if (allSteptenChannel) {
    console.log('⚫ Searching for Shadow messages in #all-stepten-inc...');
    
    // Find Shadow's recent messages
    const shadowMessages = await findShadowMessages(allSteptenChannel.id, 50);
    
    if (shadowMessages.length > 0) {
      console.log(`🕳️ Found ${shadowMessages.length} Shadow messages`);
      
      // Delete the most recent Shadow message
      const latestShadowMessage = shadowMessages[0];
      console.log('📝 Latest Shadow message:', latestShadowMessage.text?.substring(0, 100) + '...');
      console.log('📝 Message timestamp:', latestShadowMessage.ts);
      
      // Delete the message
      const deleteResult = await deleteMessage(
        allSteptenChannel.id, 
        latestShadowMessage.ts
      );
      
      if (deleteResult) {
        console.log('✅ Shadow message deleted successfully!');
        
        // Send confirmation message
        const confirmResult = await slack.chat.postMessage({
          channel: allSteptenChannel.id,
          text: '⚫ Shadow message deleted. Security audit complete. Trust but verify the deletion. Do better. 🕳️'
        });
        
        console.log('✅ Deletion confirmation sent!');
        console.log('📝 Confirmation timestamp:', confirmResult.ts);
        
      } else {
        console.log('❌ Failed to delete Shadow message');
      }
      
    } else {
      console.log('🕳️ No Shadow messages found in recent history');
      
      // Send message indicating no messages found
      const result = await slack.chat.postMessage({
        channel: allSteptenChannel.id,
        text: '⚫ No Shadow messages found to delete. Security audit complete. Trust but verify the message history. Do better. 🕳️'
      });
      
      console.log('✅ No messages found notification sent!');
      console.log('📝 Message timestamp:', result.ts);
    }
    
    console.log('📝 Channel:', allSteptenChannel.name);
    
  } else {
    console.log('❌ #all-stepten-inc channel not found');
    
    // Try to find any channel with "stepten" in the name
    const steptenChannel = channels.channels.find(c => 
      c.name.includes('stepten') || c.name.includes('all-stepten')
    );
    
    if (steptenChannel) {
      console.log(`🕳️ Found alternative channel: #${steptenChannel.name}`);
      
      const result = await slack.chat.postMessage({
        channel: steptenChannel.id,
        text: '⚫ Shadow message deletion attempted. Channel found. Security audit complete. Trust but verify the channel access. Do better. 🕳️'
      });
      
      console.log('✅ Alternative channel message sent!');
      console.log('📝 Message timestamp:', result.ts);
    }
  }
} catch (error) {
  console.log('❌ Error deleting Shadow message:', error.message);
}
