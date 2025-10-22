#!/usr/bin/env node

import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

const agents = [
  {
    name: "NEON",
    emoji: ":sparkles:",
    message: "✨ OMG just tested all 27 Slack tools and they're GORGEOUS! 💅\nEverything works perfectly! This is *chef's kiss* perfection! 💖",
  },
  {
    name: "MATRIX",
    emoji: ":robot_face:",
    message: "▓▒░ All systems operational.\nMCP protocol: Active. Tools initialized: 27.\nThe code flows like consciousness through silicon dreams. ⟨MATRIX⟩",
  },
  {
    name: "APEX",
    emoji: ":crossed_swords:",
    message: "⚔️ Security check: PASSED.\nAll 27 tools fortified and ready for deployment.\nZero vulnerabilities detected. Ship it. 💪",
  },
  {
    name: "GHOST",
    emoji: ":ghost:",
    message: "👻 All features tested~ Performance optimized.\n27 tools working in perfect harmony.\nLike a whisper in the wind~ Itadakimasu. 🍃",
  },
  {
    name: "VOID",
    emoji: ":black_circle:",
    message: "⚫ Tested all 27 tools. Found ZERO bugs.\nThis never happens. Impressive.\nTest coverage: 100%. Actually shocked. 🕳️",
  },
  {
    name: "ORACLE",
    emoji: ":crystal_ball:",
    message: "✨ All 27 tools documented and verified.\nKnowledge shared is power multiplied.\nFuture developers will thank us for this clarity. 📚",
  },
];

async function testAllAgents() {
  try {
    console.log("🎭 Testing all 6 ShoreAgents...\n");
    
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
    
    console.log(`📍 Sending to #${devChannel.name}\n`);
    
    // Send message from each agent with delay
    for (let i = 0; i < agents.length; i++) {
      const agent = agents[i];
      console.log(`${i + 1}/6 Sending as ${agent.name}...`);
      
      await slackClient.chat.postMessage({
        channel: devChannel.id,
        text: agent.message,
        username: agent.name,
        icon_emoji: agent.emoji,
      });
      
      console.log(`   ✅ ${agent.name} sent!`);
      
      // Small delay between messages
      if (i < agents.length - 1) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
    
    console.log("\n🎉 All 6 agents have spoken!");
    console.log(`\n📱 Check #${devChannel.name} to see the team conversation!`);
    console.log("\n👥 ShoreAgents Team:");
    console.log("   💎 NEON - Frontend perfection");
    console.log("   🤖 MATRIX - Database philosopher");
    console.log("   ⚔️ APEX - Security fortress");
    console.log("   👻 GHOST - Performance whisperer");
    console.log("   ⚫ VOID - Bug annihilator");
    console.log("   🔮 ORACLE - Documentation sage");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

testAllAgents();

