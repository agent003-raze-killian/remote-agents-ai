#!/usr/bin/env node

import { Octokit } from "@octokit/rest";
import { WebClient } from "@slack/web-api";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load tokens
dotenv.config({ path: join(__dirname, ".env") });
const slackEnvPath = join(__dirname, "..", "slack-mcp-server", ".env");
dotenv.config({ path: slackEnvPath });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

const octokit = new Octokit({ auth: GITHUB_TOKEN });
const slackClient = new WebClient(SLACK_BOT_TOKEN);

console.log("👻 Reading shoreagents-ai-monorepo...\n");

async function getAllFiles(owner, repo, path = "") {
  const files = [];
  
  try {
    const { data: contents } = await octokit.repos.getContent({
      owner,
      repo,
      path,
    });
    
    const items = Array.isArray(contents) ? contents : [contents];
    
    for (const item of items) {
      if (item.type === "file") {
        files.push({
          path: item.path,
          name: item.name,
          size: item.size,
          type: "file",
        });
      } else if (item.type === "dir") {
        files.push({
          path: item.path,
          name: item.name,
          type: "dir",
        });
        // Recursively get files in subdirectories
        const subFiles = await getAllFiles(owner, repo, item.path);
        files.push(...subFiles);
      }
    }
  } catch (error) {
    console.log(`   ⚠️  Cannot read: ${path} (${error.message})`);
  }
  
  return files;
}

try {
  // Get repository info
  const { data: repoInfo } = await octokit.repos.get({
    owner: "shoreagents",
    repo: "shoreagents-ai-monorepo",
  });
  
  console.log("📦 Repository:", repoInfo.full_name);
  console.log("📝 Description:", repoInfo.description || "No description");
  console.log("🔗 URL:", repoInfo.html_url);
  console.log("\n🔍 Scanning for files...\n");
  
  // Get all files
  const allFiles = await getAllFiles("shoreagents", "shoreagents-ai-monorepo");
  
  const files = allFiles.filter(f => f.type === "file");
  const dirs = allFiles.filter(f => f.type === "dir");
  
  console.log(`✅ Found ${files.length} files in ${dirs.length} directories\n`);
  
  // Show some files in terminal
  console.log("📄 Sample Files:\n");
  files.slice(0, 10).forEach(file => {
    const sizeKB = (file.size / 1024).toFixed(2);
    console.log(`   ${file.path} (${sizeKB} KB)`);
  });
  
  if (files.length > 10) {
    console.log(`   ... and ${files.length - 10} more files\n`);
  }
  
  // Find Slack general channel
  console.log("\n📤 Sending to Slack #general...\n");
  
  const channelsList = await slackClient.conversations.list({
    exclude_archived: true,
    types: "public_channel,private_channel",
  });
  
  const generalChannel = channelsList.channels?.find(
    ch => ch.name === "general"
  );
  
  if (!generalChannel) {
    console.error("❌ General channel not found");
    process.exit(1);
  }
  
  // Format directory tree
  const filesByDir = {};
  files.forEach(file => {
    const dir = file.path.includes("/") ? file.path.split("/").slice(0, -1).join("/") : "root";
    if (!filesByDir[dir]) filesByDir[dir] = [];
    filesByDir[dir].push(file);
  });
  
  // Create file list (show top directories and their file counts)
  const topLevelDirs = dirs.filter(d => !d.path.includes("/"));
  const dirSummary = topLevelDirs.map(dir => {
    const dirFiles = files.filter(f => f.path.startsWith(dir.path + "/"));
    return `📁 *${dir.name}* - ${dirFiles.length} files`;
  }).join("\n");
  
  // Show some actual files
  const fileList = files.slice(0, 20).map(file => {
    const sizeKB = (file.size / 1024).toFixed(1);
    const icon = file.name.endsWith(".js") ? "📜" :
                 file.name.endsWith(".json") ? "📋" :
                 file.name.endsWith(".md") ? "📝" :
                 file.name.endsWith(".ts") ? "📘" : "📄";
    return `${icon} \`${file.path}\` (${sizeKB} KB)`;
  }).join("\n");
  
  const moreFiles = files.length > 20 ? `\n\n_...and ${files.length - 20} more files_` : "";
  
  const message = 
    `📚 *Repository File Scan: shoreagents-ai-monorepo*\n\n` +
    `🔗 *Repository:* <${repoInfo.html_url}|${repoInfo.full_name}>\n` +
    `📊 *Stats:*\n` +
    `   • Total Files: ${files.length}\n` +
    `   • Directories: ${dirs.length}\n` +
    `   • Top-level Folders: ${topLevelDirs.length}\n\n` +
    `📁 *Directory Structure:*\n${dirSummary}\n\n` +
    `📄 *Sample Files (first 20):*\n${fileList}${moreFiles}\n\n` +
    `👻 _Repository scanned with zen precision~ All files accounted for._ 🍃`;
  
  // Send to Slack
  await slackClient.chat.postMessage({
    channel: generalChannel.id,
    text: message,
    username: "GHOST",
    icon_emoji: ":ghost:",
  });
  
  console.log("✅ Message sent to Slack!\n");
  console.log("━".repeat(60));
  console.log("\n🎉 Complete!");
  console.log(`📄 Scanned ${files.length} files`);
  console.log(`📁 Found ${dirs.length} directories`);
  console.log(`📱 Sent to #${generalChannel.name}\n`);
  console.log("👻 GitHub file access confirmed~ Reading permissions working perfectly!\n");
  
} catch (error) {
  console.error("❌ Error:", error.message);
  if (error.status === 404) {
    console.error("\n⚠️  Repository not found or no access.");
    console.error("💡 Make sure you have access to shoreagents/shoreagents-ai-monorepo");
  }
  process.exit(1);
}

