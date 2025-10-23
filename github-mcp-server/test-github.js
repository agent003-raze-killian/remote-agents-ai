#!/usr/bin/env node

import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;

console.log("👻 Testing GitHub MCP Connection...\n");

if (!GITHUB_TOKEN) {
  console.error("❌ GITHUB_TOKEN not found in .env file!");
  console.error("\n📝 To fix:");
  console.error("1. Create a .env file in this folder");
  console.error("2. Add: GITHUB_TOKEN=your_token_here");
  console.error("3. Get token from: https://github.com/settings/tokens\n");
  process.exit(1);
}

console.log("✅ Token found in .env file");
console.log(`🔑 Token: ${GITHUB_TOKEN.substring(0, 10)}...${GITHUB_TOKEN.substring(GITHUB_TOKEN.length - 4)}\n`);

const octokit = new Octokit({ auth: GITHUB_TOKEN });

try {
  console.log("📡 Connecting to GitHub API...");
  const { data } = await octokit.users.getAuthenticated();
  
  console.log("\n✅ Successfully connected to GitHub!");
  console.log("━".repeat(50));
  console.log(`\n👤 Authenticated as: ${data.login}`);
  console.log(`📛 Name: ${data.name || "Not set"}`);
  console.log(`📧 Email: ${data.email || "Not public"}`);
  console.log(`📦 Public Repos: ${data.public_repos}`);
  console.log(`⭐ Followers: ${data.followers}`);
  console.log(`🔗 Profile: ${data.html_url}`);
  
  console.log("\n━".repeat(50));
  console.log("\n🎉 GitHub MCP Server is ready to use!");
  console.log("\n📚 You have access to 24 GitHub tools:");
  console.log("   • Repository management");
  console.log("   • Issues & Pull Requests");
  console.log("   • File operations");
  console.log("   • Branches & Commits");
  console.log("   • Search & Discovery");
  console.log("   • Stars, Forks, Gists");
  console.log("\n👻 GHOST (Kira) is ready to optimize your GitHub workflow~");
  console.log("\n💡 Next steps:");
  console.log("   1. Restart Cursor to load the MCP server");
  console.log("   2. Check Settings > Tools & MCP");
  console.log("   3. You should see 'github-kira' with 24 tools!\n");
  
} catch (error) {
  console.error("\n❌ Connection failed!");
  console.error(`Error: ${error.message}\n`);
  
  if (error.status === 401) {
    console.error("🔒 Authentication failed - your token might be:");
    console.error("   • Invalid or expired");
    console.error("   • Missing required permissions");
    console.error("\n💡 Fix:");
    console.error("   1. Go to https://github.com/settings/tokens");
    console.error("   2. Create a new token with 'repo' scope");
    console.error("   3. Update your .env file\n");
  }
  
  process.exit(1);
}

