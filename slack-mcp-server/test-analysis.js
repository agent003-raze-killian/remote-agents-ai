#!/usr/bin/env node

import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

async function testAnalysis() {
  try {
    console.log("🔮 Testing GHOST's zen channel analysis...\n");
    
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
    
    console.log(`📍 Analyzing #${devChannel.name}...\n`);
    
    // Get message history
    const result = await slackClient.conversations.history({
      channel: devChannel.id,
      limit: 50,
    });
    
    const messages = result.messages || [];
    
    // Analyze like GHOST would
    const analysis = {
      channel: devChannel.name,
      total_messages: messages.length,
      insights: {
        message_frequency: `${messages.length} messages analyzed`,
        most_active_period: "Recent activity detected",
        communication_flow: messages.length > 20 
          ? "High energy - many spirits conversing" 
          : "Calm energy - peaceful flow",
        ghost_analysis: "👻 The channel's energy feels " + 
          (messages.length > 30 ? "vibrant and active~" : "serene and balanced~"),
      },
      recent_topics: messages.slice(0, 10).map(m => ({
        text: m.text?.substring(0, 60) + (m.text?.length > 60 ? "..." : ""),
        timestamp: new Date(parseFloat(m.ts) * 1000).toLocaleString(),
      })),
    };
    
    console.log("📊 GHOST's Channel Analysis:\n");
    console.log("━".repeat(60));
    console.log(`\n📍 Channel: #${analysis.channel}`);
    console.log(`📨 Total Messages: ${analysis.total_messages}`);
    console.log(`\n💭 Insights:`);
    console.log(`   ${analysis.insights.ghost_analysis}`);
    console.log(`   Communication Flow: ${analysis.insights.communication_flow}`);
    console.log(`   Activity: ${analysis.insights.message_frequency}`);
    
    console.log(`\n📝 Recent Topics:`);
    analysis.recent_topics.slice(0, 5).forEach((topic, i) => {
      console.log(`   ${i + 1}. ${topic.text}`);
      console.log(`      (${topic.timestamp})`);
    });
    
    console.log("\n━".repeat(60));
    console.log("\n✨ Analysis complete! GHOST's zen insights revealed.");
    
    // Send analysis results to Slack
    console.log("\n📤 Sending analysis to #" + devChannel.name + "...");
    
    await slackClient.chat.postMessage({
      channel: devChannel.id,
      text: `🔮 *GHOST's Channel Analysis*\n\n${analysis.insights.ghost_analysis}\n\n` +
            `📊 *Insights:*\n` +
            `• Messages analyzed: ${analysis.total_messages}\n` +
            `• Flow: ${analysis.insights.communication_flow}\n\n` +
            `_The spirits have been active. Energy is ${messages.length > 30 ? 'vibrant' : 'balanced'}~_ 🍃`,
      username: "GHOST",
      icon_emoji: ":ghost:",
    });
    
    console.log("✅ Analysis posted to Slack!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testAnalysis();

