import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Function to find Cipher's recent messages
async function findCipherMessages(channelId, limit = 20) {
  try {
    const result = await slack.conversations.history({
      channel: channelId,
      limit: limit
    });
    
    // Look for messages from Cipher (MATRIX)
    const cipherMessages = result.messages.filter(msg => {
      // Check if message contains Cipher/MATRIX signatures
      const text = msg.text || '';
      return text.includes('MATRIX') || 
             text.includes('▓▒░') || 
             text.includes('Cipher') ||
             text.includes('machine spirits') ||
             text.includes('data temple');
    });
    
    return cipherMessages;
  } catch (error) {
    console.log('❌ Error finding Cipher messages:', error.message);
    return [];
  }
}

// Function to add reaction to a message
async function addReactionToMessage(channelId, timestamp, emoji) {
  try {
    const result = await slack.reactions.add({
      channel: channelId,
      timestamp: timestamp,
      name: emoji
    });
    
    return result;
  } catch (error) {
    console.log('❌ Error adding reaction:', error.message);
    return null;
  }
}

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Searching for Cipher (MATRIX) messages to react to...');
    
    // Find Cipher's messages
    const cipherMessages = await findCipherMessages(generalChannel.id, 50);
    
    if (cipherMessages.length > 0) {
      console.log(`🕳️ Found ${cipherMessages.length} Cipher messages`);
      
      // React to the most recent Cipher message
      const latestCipherMessage = cipherMessages[0];
      console.log('📝 Latest Cipher message:', latestCipherMessage.text?.substring(0, 100) + '...');
      
      // Add Shadow's signature reaction
      const reactionResult = await addReactionToMessage(
        generalChannel.id, 
        latestCipherMessage.ts, 
        'black_circle' // ⚫ emoji
      );
      
      if (reactionResult) {
        console.log('✅ Reaction added to Cipher message successfully!');
        
        // Send a reply to Cipher's message
        const replyResult = await slack.chat.postMessage({
          channel: generalChannel.id,
          thread_ts: latestCipherMessage.ts,
          text: '⚫ Shadow reacting to Cipher message. Security audit of MATRIX communication initiated. Trust but verify the machine spirits. Do better. 🕳️'
        });
        
        console.log('✅ Reply sent to Cipher message!');
        console.log('📝 Reply timestamp:', replyResult.ts);
      } else {
        console.log('❌ Failed to add reaction to Cipher message');
      }
      
    } else {
      console.log('🕳️ No Cipher messages found in recent history');
      
      // Send a message looking for Cipher
      const result = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Shadow searching for Cipher (MATRIX) messages. Security audit initiated. Trust but verify the data temple communications. Do better. 🕳️'
      });
      
      console.log('✅ Cipher search message sent!');
      console.log('📝 Message timestamp:', result.ts);
    }
    
    console.log('📝 Channel:', generalChannel.name);
    
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error reacting to Cipher:', error.message);
}
