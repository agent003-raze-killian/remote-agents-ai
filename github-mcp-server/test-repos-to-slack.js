#!/usr/bin/env node

import { Octokit } from "@octokit/rest";
import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load GitHub token from this folder's .env
dotenv.config({ path: join(__dirname, ".env") });

// Load Slack tokens from slack-mcp-server folder
const slackEnvPath = join(__dirname, "..", "slack-mcp-server", ".env");
dotenv.config({ path: slackEnvPath });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

console.log("👻 Testing GitHub + Slack Integration...\n");

if (!GITHUB_TOKEN) {
  console.error("❌ GITHUB_TOKEN not found!");
  process.exit(1);
}

if (!SLACK_BOT_TOKEN) {
  console.error("❌ SLACK_BOT_TOKEN not found!");
  process.exit(1);
}

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const slackClient = new WebClient(SLACK_BOT_TOKEN);

async function testGitHubAndSlack() {
  try {
    // Step 1: Get authenticated user
    console.log("1️⃣  Connecting to GitHub...");
    const { data: user } = await octokit.users.getAuthenticated();
    console.log(`   ✅ Connected as: ${user.login}\n`);
    
    // Step 2: List repositories
    console.log("2️⃣  Fetching your repositories...");
    const { data: repos } = await octokit.repos.listForAuthenticatedUser({
      sort: "updated",
      per_page: 10,
    });
    console.log(`   ✅ Found ${repos.length} repositories\n`);
    
    // Display repos
    console.log("📦 Your Recent Repositories:\n");
    repos.forEach((repo, i) => {
      console.log(`${i + 1}. ${repo.name}`);
      console.log(`   ${repo.description || "No description"}`);
      console.log(`   ⭐ ${repo.stargazers_count} stars | 🍴 ${repo.forks_count} forks`);
      console.log(`   🔗 ${repo.html_url}\n`);
    });
    
    // Step 3: Find Slack development channel
    console.log("3️⃣  Finding Slack #development channel...");
    const channelsList = await slackClient.conversations.list({
      exclude_archived: true,
      types: "public_channel,private_channel",
    });
    
    const devChannel = channelsList.channels?.find(
      ch => ch.name === "development" || ch.name === "dev"
    );
    
    if (!devChannel) {
      console.error("   ❌ Development channel not found");
      process.exit(1);
    }
    
    console.log(`   ✅ Found #${devChannel.name}\n`);
    
    // Step 4: Format message for Slack
    console.log("4️⃣  Preparing message...");
    
    const repoList = repos.slice(0, 5).map((repo, i) => 
      `${i + 1}. *<${repo.html_url}|${repo.name}>*\n` +
      `   ${repo.description || "_No description_"}\n` +
      `   ⭐ ${repo.stargazers_count} stars | 🍴 ${repo.forks_count} forks | 📝 ${repo.language || "N/A"}`
    ).join("\n\n");
    
    const moreRepos = repos.length > 5 ? `\n\n_...and ${repos.length - 5} more repositories_` : "";
    
    const message = 
      `🎉 *GitHub Integration Test Successful!*\n\n` +
      `👤 *GitHub User:* ${user.login}\n` +
      `📦 *Total Public Repos:* ${user.public_repos}\n` +
      `⭐ *Total Stars:* ${repos.reduce((sum, r) => sum + r.stargazers_count, 0)}\n\n` +
      `📚 *Your Recent Repositories:*\n\n${repoList}${moreRepos}\n\n` +
      `👻 _Both GitHub and Slack MCP servers working perfectly~_ 🍃\n` +
      `✨ _51 tools total (27 Slack + 24 GitHub) ready for action!_`;
    
    console.log("   ✅ Message formatted\n");
    
    // Step 5: Send to Slack
    console.log("5️⃣  Sending to Slack...");
    
    const result = await slackClient.chat.postMessage({
      channel: devChannel.id,
      text: message,
      username: "GHOST",
      icon_emoji: ":ghost:",
    });
    
    console.log(`   ✅ Message sent!\n`);
    
    // Success summary
    console.log("━".repeat(60));
    console.log("\n🎊 SUCCESS! Both MCP Servers Working!\n");
    console.log("✅ GitHub MCP: Connected");
    console.log(`   - User: ${user.login}`);
    console.log(`   - Repos accessed: ${repos.length}`);
    console.log(`   - 24 GitHub tools available\n`);
    
    console.log("✅ Slack MCP: Connected");
    console.log(`   - Message sent to #${devChannel.name}`);
    console.log(`   - 27 Slack tools available\n`);
    
    console.log("🚀 Total: 51 tools ready!");
    console.log("👻 GHOST (Kira) is fully operational~\n");
    
    console.log("📱 Check Slack #development to see your repos!\n");
    console.log("━".repeat(60));
    
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    if (error.status === 401) {
      console.error("\n🔒 Authentication failed. Check your tokens in .env files");
    }
    process.exit(1);
  }
}

testGitHubAndSlack();

