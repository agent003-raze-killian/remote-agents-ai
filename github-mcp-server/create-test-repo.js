#!/usr/bin/env node

import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: GITHUB_TOKEN });

console.log("👻 Creating GitHub repository 'test-kira-repo'...\n");

try {
  const result = await octokit.repos.createForAuthenticatedUser({
    name: "test-kira-repo",
    description: "👻 Test repository created by GHOST (Kira) - Zen optimization in progress~",
    private: false,
    auto_init: true, // Initialize with README
  });
  
  console.log("✅ Repository created successfully!\n");
  console.log("━".repeat(60));
  console.log(`\n📦 Repository: ${result.data.full_name}`);
  console.log(`📝 Description: ${result.data.description}`);
  console.log(`🔗 URL: ${result.data.html_url}`);
  console.log(`🌐 Clone URL: ${result.data.clone_url}`);
  console.log(`🔒 Private: ${result.data.private ? "Yes" : "No (Public)"}`);
  console.log(`📅 Created: ${new Date(result.data.created_at).toLocaleString()}`);
  
  console.log("\n━".repeat(60));
  console.log("\n👻 Repository created with zen precision~");
  console.log("🍃 Ready for optimization and flow.\n");
  console.log(`💡 Visit: ${result.data.html_url}\n`);
  
} catch (error) {
  if (error.status === 422 && error.message.includes("already exists")) {
    console.log("⚠️  Repository 'test-kira-repo' already exists!");
    console.log("\n💡 Visit: https://github.com/agent004-kira-tanaka/test-kira-repo\n");
  } else {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

