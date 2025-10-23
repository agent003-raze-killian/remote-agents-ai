#!/usr/bin/env node

import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, ".env") });

const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

if (!SLACK_BOT_TOKEN) {
  console.error("❌ SLACK_BOT_TOKEN not found in .env file");
  process.exit(1);
}

const slackClient = new WebClient(SLACK_BOT_TOKEN);

async function sendTestMessage() {
  try {
    console.log("👻 Testing GHOST (Kira) bot...\n");
    
    // First, list channels to find development
    console.log("📋 Finding development channel...");
    const channelsList = await slackClient.conversations.list({
      exclude_archived: true,
      types: "public_channel,private_channel",
    });
    
    const devChannel = channelsList.channels?.find(
      ch => ch.name === "development" || ch.name === "dev"
    );
    
    if (!devChannel) {
      console.log("⚠️  'development' or 'dev' channel not found.");
      console.log("Available channels:");
      channelsList.channels?.forEach(ch => {
        console.log(`  - ${ch.name} (${ch.id})`);
      });
      console.log("\n💡 Using 'general' channel instead...");
      
      // Try general channel
      const generalChannel = channelsList.channels?.find(ch => ch.name === "general");
      if (generalChannel) {
        await sendToChannel(generalChannel.id, generalChannel.name);
      } else {
        console.error("❌ No suitable channel found");
        process.exit(1);
      }
    } else {
      await sendToChannel(devChannel.id, devChannel.name);
    }
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    if (error.data) {
      console.error("Details:", error.data);
    }
    process.exit(1);
  }
}

async function sendToChannel(channelId, channelName) {
  console.log(`\n💬 Sending test message to #${channelName}...\n`);
  
  const result = await slackClient.chat.postMessage({
    channel: channelId,
    text: "👻 GHOST (Kira) bot is online and operational~\n\nPerformance optimization ready. 27 Slack tools initialized.\nLike a whisper in the wind~ 🍃\n\n*Testing complete. Itadakimasu.* 🌸",
    username: "GHOST",
    icon_emoji: ":ghost:",
  });
  
  console.log("✅ Message sent successfully!");
  console.log(`📍 Channel: #${channelName}`);
  console.log(`🕐 Timestamp: ${result.ts}`);
  console.log(`🔗 Link: https://${channelName}.slack.com/archives/${channelId}/p${result.ts.replace(".", "")}`);
  console.log("\n👻 GHOST bot test complete! Check your Slack channel! 🎉");
}

sendTestMessage();

