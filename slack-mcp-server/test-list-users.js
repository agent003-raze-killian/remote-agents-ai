#!/usr/bin/env node

import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

async function listAllUsers() {
  try {
    console.log("👥 Listing all users in the workspace...\n");
    
    // Get all users
    const result = await slackClient.users.list({
      limit: 100,
    });
    
    const users = result.members || [];
    
    // Separate humans and bots
    const humans = users.filter(u => !u.is_bot && !u.deleted);
    const bots = users.filter(u => u.is_bot && !u.deleted);
    const admins = humans.filter(u => u.is_admin || u.is_owner);
    
    console.log("━".repeat(70));
    console.log("👤 WORKSPACE USERS");
    console.log("━".repeat(70));
    
    console.log(`\n📊 Summary:`);
    console.log(`   Total Users: ${users.length}`);
    console.log(`   👤 Humans: ${humans.length}`);
    console.log(`   🤖 Bots: ${bots.length}`);
    console.log(`   ⭐ Admins: ${admins.length}`);
    
    console.log(`\n👥 HUMAN USERS:\n`);
    humans.forEach((user, i) => {
      const badges = [];
      if (user.is_owner) badges.push("👑 Owner");
      if (user.is_admin) badges.push("⭐ Admin");
      
      console.log(`${i + 1}. ${user.real_name || user.name}`);
      console.log(`   Username: @${user.name}`);
      console.log(`   ID: ${user.id}`);
      if (user.profile?.email) {
        console.log(`   Email: ${user.profile.email}`);
      }
      if (badges.length > 0) {
        console.log(`   Role: ${badges.join(", ")}`);
      }
      if (user.tz) {
        console.log(`   Timezone: ${user.tz}`);
      }
      console.log();
    });
    
    console.log(`🤖 BOTS:\n`);
    bots.slice(0, 10).forEach((bot, i) => {
      console.log(`${i + 1}. ${bot.real_name || bot.name} (@${bot.name})`);
    });
    
    if (bots.length > 10) {
      console.log(`   ... and ${bots.length - 10} more bots\n`);
    }
    
    console.log("\n━".repeat(70));
    
    // Send summary to Slack
    console.log("\n📤 Sending user summary to Slack...");
    
    const channelsList = await slackClient.conversations.list({
      exclude_archived: true,
      types: "public_channel,private_channel",
    });
    
    const devChannel = channelsList.channels?.find(
      ch => ch.name === "development" || ch.name === "dev" || ch.name === "general"
    );
    
    if (devChannel) {
      const humanNames = humans.slice(0, 5).map(u => `• ${u.real_name || u.name}`).join("\n");
      const moreHumans = humans.length > 5 ? `\n... and ${humans.length - 5} more` : "";
      
      await slackClient.chat.postMessage({
        channel: devChannel.id,
        text: `👥 *Workspace User Summary*\n\n` +
              `📊 *Statistics:*\n` +
              `• Total Users: ${users.length}\n` +
              `• Humans: ${humans.length}\n` +
              `• Bots: ${bots.length}\n` +
              `• Admins: ${admins.length}\n\n` +
              `👤 *Recent Humans:*\n${humanNames}${moreHumans}\n\n` +
              `_All spirits accounted for~_ 👻🍃`,
        username: "GHOST",
        icon_emoji: ":ghost:",
      });
      
      console.log(`✅ Summary posted to #${devChannel.name}!`);
    }
    
    console.log("\n✨ User listing complete!");
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

listAllUsers();

