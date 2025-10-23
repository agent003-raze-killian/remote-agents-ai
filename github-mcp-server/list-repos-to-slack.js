#!/usr/bin/env node

import { Octokit } from "@octokit/rest";
import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load GitHub token
dotenv.config({ path: join(__dirname, ".env") });

// Load Slack tokens
const slackEnvPath = join(__dirname, "..", "slack-mcp-server", ".env");
dotenv.config({ path: slackEnvPath });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const slackClient = new WebClient(SLACK_BOT_TOKEN);

console.log("👻 Listing all GitHub repositories...\n");

try {
  // Get all repositories
  const { data: repos } = await octokit.repos.listForAuthenticatedUser({
    sort: "updated",
    per_page: 100,
  });
  
  console.log(`✅ Found ${repos.length} repositories\n`);
  
  // Display in terminal
  console.log("📦 Your Repositories:\n");
  repos.forEach((repo, i) => {
    console.log(`${i + 1}. ${repo.name}`);
    console.log(`   ${repo.description || "No description"}`);
    console.log(`   ⭐ ${repo.stargazers_count} | 🍴 ${repo.forks_count} | 🔒 ${repo.private ? "Private" : "Public"}`);
    console.log(`   🔗 ${repo.html_url}\n`);
  });
  
  // Find Slack development channel
  console.log("📤 Sending to Slack #development...\n");
  
  const channelsList = await slackClient.conversations.list({
    exclude_archived: true,
    types: "public_channel,private_channel",
  });
  
  const devChannel = channelsList.channels?.find(
    ch => ch.name === "development" || ch.name === "dev"
  );
  
  if (!devChannel) {
    console.error("❌ Development channel not found");
    process.exit(1);
  }
  
  // Format message for Slack
  const repoList = repos.map((repo, i) => {
    const icon = repo.private ? "🔒" : "🌐";
    const updated = new Date(repo.updated_at).toLocaleDateString();
    return (
      `${i + 1}. ${icon} *<${repo.html_url}|${repo.name}>*\n` +
      `   ${repo.description || "_No description_"}\n` +
      `   ⭐ ${repo.stargazers_count} stars | 🍴 ${repo.forks_count} forks | 📝 ${repo.language || "N/A"} | 📅 Updated: ${updated}`
    );
  }).join("\n\n");
  
  const totalStars = repos.reduce((sum, r) => sum + r.stargazers_count, 0);
  const totalForks = repos.reduce((sum, r) => sum + r.forks_count, 0);
  const privateCount = repos.filter(r => r.private).length;
  const publicCount = repos.filter(r => !r.private).length;
  
  const message = 
    `📚 *GitHub Repository List*\n\n` +
    `👤 *User:* agent004-kira-tanaka\n` +
    `📦 *Total Repos:* ${repos.length}\n` +
    `🌐 *Public:* ${publicCount} | 🔒 *Private:* ${privateCount}\n` +
    `⭐ *Total Stars:* ${totalStars} | 🍴 *Total Forks:* ${totalForks}\n\n` +
    `📋 *All Repositories:*\n\n${repoList}\n\n` +
    `👻 _Repository list compiled with zen precision~_ 🍃`;
  
  // Send to Slack
  await slackClient.chat.postMessage({
    channel: devChannel.id,
    text: message,
    username: "GHOST",
    icon_emoji: ":ghost:",
  });
  
  console.log("✅ Message sent to Slack!\n");
  console.log("━".repeat(60));
  console.log("\n🎉 Complete!");
  console.log(`📦 Listed ${repos.length} repositories`);
  console.log(`📱 Sent to #${devChannel.name}\n`);
  console.log("👻 All repositories accounted for~\n");
  
} catch (error) {
  console.error("❌ Error:", error.message);
  process.exit(1);
}

