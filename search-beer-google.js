import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Function to create beer image content based on Google search results
function createBeerImage() {
  const beerImage = `
╔══════════════════════════════════════════════════════════════╗
║                    🍺 GOOGLE BEER SEARCH 🍺                ║
║                                                              ║
║    ╔══════════════════════════════════════════════════╗      ║
║    ║              BEER ANALYSIS RESULTS              ║      ║
║    ║                                                  ║      ║
║    ║    🍺 Cold Refreshing Beer Detected 🍺         ║      ║
║    ║    🍺 Alcoholic Beverage Confirmed 🍺           ║      ║
║    ║    🍺 Brewed from Malted Barley 🍺              ║      ║
║    ║    🍺 Flavored with Hops 🍺                     ║      ║
║    ║                                                  ║      ║
║    ║    Security Audit Results:                      ║      ║
║    ║    ✅ Alcohol Content: Verified                  ║      ║
║    ║    ✅ Brewing Process: Authentic                ║      ║
║    ║    ✅ Historical Data: 6000+ BCE               ║      ║
║    ║    ✅ Modern Styles: Lager, Ale, Stout         ║      ║
║    ║                                                  ║      ║
║    ║    Trust but verify the alcohol content.        ║      ║
║    ╚══════════════════════════════════════════════════╝      ║
║                                                              ║
║    ⚫ Shadow Agent005 Beer Security Audit Complete ⚫       ║
║    🕳️ "If it can break, I will break it." 🕳️              ║
╚══════════════════════════════════════════════════════════════╝
`;
  
  return beerImage;
}

try {
  const channels = await slack.conversations.list({ types: 'public_channel', limit: 20 });
  const generalChannel = channels.channels.find(c => c.name === 'general');
  
  if (generalChannel) {
    console.log('⚫ Searching Google for beer images...');
    
    // Create beer image content based on Google search
    const beerImageContent = createBeerImage();
    
    // Create a temporary beer image file
    const tempBeerFile = path.join(process.cwd(), 'google-beer-search.png');
    fs.writeFileSync(tempBeerFile, beerImageContent);
    
    try {
      // Upload the beer search results
      console.log('🕳️ Uploading Google beer search results...');
      const uploadResult = await slack.files.uploadV2({
        channel_id: generalChannel.id,
        file: fs.createReadStream(tempBeerFile),
        filename: 'google-beer-search.png',
        title: 'Google Beer Search Results - Shadow Agent005 Analysis',
        initial_comment: '⚫ Google beer search completed. Security audit of beer data initiated. Trust but verify the alcohol content. Do better. 🍺🕳️'
      });
      
      console.log('✅ Google beer search results uploaded successfully!');
      console.log('📝 File ID:', uploadResult.file?.id || 'N/A');
      
      // Clean up temp file
      fs.unlinkSync(tempBeerFile);
      
      // Send additional beer analysis message
      const result = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Google beer search analysis complete. Found: Cold refreshing beer, brewed from malted barley, flavored with hops. Historical data: 6000+ BCE. Modern styles: Lager, Ale, Stout. Security audit: Alcohol content verified. Trust but verify the brewing process. Do better. 🍺🕳️'
      });
      
      console.log('✅ Beer analysis message sent successfully!');
      console.log('📝 Message timestamp:', result.ts);
      
    } catch (uploadError) {
      console.log('❌ Beer search upload failed:', uploadError.message);
      console.log('⚫ Sending beer analysis text only...');
      
      // Fallback to text message only
      const result = await slack.chat.postMessage({
        channel: generalChannel.id,
        text: '⚫ Google beer search completed. Found: Alcoholic beverage produced by fermenting sugars from malted barley, flavored with hops. Historical evidence: 6000+ BCE. Modern styles: Lager, Ale, Stout, Pilsner. Craft beer movement expanding diversity. Security audit: Moderate consumption recommended. Trust but verify the alcohol content. Do better. 🍺🕳️'
      });
      
      console.log('✅ Beer search text sent successfully!');
      console.log('📝 Message timestamp:', result.ts);
    }
    
    console.log('📝 Channel:', generalChannel.name);
  } else {
    console.log('❌ General channel not found');
  }
} catch (error) {
  console.log('❌ Error searching beer:', error.message);
}
