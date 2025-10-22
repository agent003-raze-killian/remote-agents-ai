#!/usr/bin/env node

import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

async function testReactions() {
  try {
    console.log("👻 Testing GHOST's reaction features...\n");
    
    // Find development channel
    const channelsList = await slackClient.conversations.list({
      exclude_archived: true,
      types: "public_channel,private_channel",
    });
    
    const devChannel = channelsList.channels?.find(
      ch => ch.name === "development" || ch.name === "dev" || ch.name === "general"
    );
    
    if (!devChannel) {
      console.error("❌ No suitable channel found");
      process.exit(1);
    }
    
    console.log(`📍 Using #${devChannel.name}\n`);
    
    // Send a test message
    console.log("1️⃣  Sending test message...");
    const msgResult = await slackClient.chat.postMessage({
      channel: devChannel.id,
      text: "👻 Testing reaction features~ React to this message! 🌸",
      username: "GHOST",
      icon_emoji: ":ghost:",
    });
    
    console.log("   ✅ Message sent!");
    const messageTs = msgResult.ts;
    
    // Add reactions
    const reactions = ["ghost", "sparkles", "cherry_blossom", "leaves", "tea"];
    
    console.log("\n2️⃣  Adding zen reactions...");
    for (const reaction of reactions) {
      await slackClient.reactions.add({
        channel: devChannel.id,
        timestamp: messageTs,
        name: reaction,
      });
      console.log(`   ✅ Added :${reaction}:`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    console.log("\n3️⃣  Waiting 2 seconds...");
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Remove one reaction
    console.log("\n4️⃣  Removing :sparkles: (energy balanced)...");
    await slackClient.reactions.remove({
      channel: devChannel.id,
      timestamp: messageTs,
      name: "sparkles",
    });
    console.log("   ✅ Reaction removed!");
    
    console.log("\n✨ Reaction test complete!");
    console.log("\n📱 Check your Slack to see:");
    console.log("   👻 Message with GHOST reactions");
    console.log("   🌸 Cherry blossoms and tea");
    console.log("   ✨ Sparkles removed (balanced energy)");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testReactions();

