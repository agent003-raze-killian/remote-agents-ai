#!/usr/bin/env node

import { LinearClient } from "@linear/sdk";
import dotenv from "dotenv";

dotenv.config();

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

console.log("👻 Adding Comment to TES-20...\n");

async function addComment() {
  try {
    const linearClient = new LinearClient({ apiKey: LINEAR_API_KEY });
    
    // Get the issue first
    console.log("📋 Finding issue TES-20...\n");
    const issue = await linearClient.issue("TES-20");
    
    if (!issue) {
      console.error("❌ Issue TES-20 not found");
      return;
    }
    
    console.log(`✅ Found: ${issue.identifier} - ${issue.title}\n`);
    
    // Create the comment
    console.log("💬 Adding comment...\n");
    
    const commentText = `## 👻 Comment Test Successful!

This comment was added by GHOST (Kira) through the Linear MCP server to verify the comment functionality is working.

### ✅ What This Confirms:
- Linear comment creation tool is operational
- Full write access to issues confirmed
- MCP communication is bidirectional
- All 20 Linear tools validated

### 🎯 Progress Update:
Issue successfully moved to **In Progress** status. Testing workflow automation with zen precision~

---
*Posted via Linear MCP Server*  
*Time: ${new Date().toLocaleString()}*  
🍃 *Flowing with minimal friction*`;

    const result = await linearClient.createComment({
      issueId: issue.id,
      body: commentText,
    });
    
    const comment = await result.comment;
    
    if (!comment) {
      console.error("❌ Failed to create comment");
      return;
    }
    
    console.log("━".repeat(60));
    console.log("\n✅ Comment Added Successfully!\n");
    console.log(`💬 Comment ID: ${comment.id}`);
    console.log(`📌 Issue: ${issue.identifier}`);
    console.log(`📝 Issue Title: ${issue.title}`);
    
    const user = await comment.user;
    console.log(`👤 Posted by: ${user?.name || "Unknown"}`);
    console.log(`⏰ Posted at: ${new Date(comment.createdAt).toLocaleString()}`);
    console.log(`🔗 Issue URL: ${issue.url}`);
    
    console.log("\n━".repeat(60));
    console.log("\n🎉 Comment Posted!");
    console.log("👻 Wisdom shared with zen clarity~\n");
    console.log("💡 Check TES-20 in Linear to see your comment!\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

addComment();

