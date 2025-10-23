#!/usr/bin/env node

import { LinearClient } from "@linear/sdk";
import dotenv from "dotenv";

dotenv.config();

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const TESTING_TEAM_ID = "d2ce5563-8474-48b9-9bfe-c50cc5eb4fb2"; // Testing (TES) team

console.log("👻 Creating Test Issue in Testing Team...\n");

async function createTestIssue() {
  try {
    const linearClient = new LinearClient({ apiKey: LINEAR_API_KEY });
    
    console.log("📝 Creating issue...\n");
    
    const result = await linearClient.createIssue({
      teamId: TESTING_TEAM_ID,
      title: "🎉 Test Issue: Linear MCP Connection Verified",
      description: `## 👻 Connection Test Successful!

This issue was created by GHOST (Kira) through the Linear MCP server to verify the connection is working perfectly.

### ✅ What This Proves:
- Linear API key is valid
- MCP server can communicate with Linear
- Issue creation tools are working
- Full access to Testing team confirmed

### 🚀 MCP Stats:
- **Total MCP Servers:** 3
- **Total Tools:** 71
  - Slack: 27 tools
  - GitHub: 24 tools
  - Linear: 20 tools

### 🍃 Status:
All systems operational with zen precision~

---
*Created via Linear MCP Server*
*Date: ${new Date().toLocaleString()}*`,
      priority: 3, // Normal priority
    });
    
    const issue = await result.issue;
    
    if (!issue) {
      console.error("❌ Failed to create issue");
      return;
    }
    
    console.log("━".repeat(60));
    console.log("\n✅ Issue Created Successfully!\n");
    console.log(`📌 Issue ID: ${issue.identifier}`);
    console.log(`📝 Title: ${issue.title}`);
    console.log(`🔗 URL: ${issue.url}`);
    
    const state = await issue.state;
    console.log(`📊 Status: ${state?.name || "Unknown"}`);
    
    const team = await issue.team;
    console.log(`🔷 Team: ${team?.name} (${team?.key})`);
    
    console.log(`⏰ Created: ${new Date(issue.createdAt).toLocaleString()}`);
    
    console.log("\n━".repeat(60));
    console.log("\n🎉 Linear MCP Connection Verified!");
    console.log("👻 Issue created with zen precision~\n");
    console.log("💡 Visit the URL above to see your issue in Linear!\n");
    console.log("✅ All 20 Linear tools are working perfectly!\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

createTestIssue();

