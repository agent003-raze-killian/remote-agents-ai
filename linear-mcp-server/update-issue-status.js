#!/usr/bin/env node

import { LinearClient } from "@linear/sdk";
import dotenv from "dotenv";

dotenv.config();

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;
const TESTING_TEAM_ID = "d2ce5563-8474-48b9-9bfe-c50cc5eb4fb2";

console.log("👻 Updating TES-20 Status to In Progress...\n");

async function updateIssueStatus() {
  try {
    const linearClient = new LinearClient({ apiKey: LINEAR_API_KEY });
    
    // First, get the issue
    console.log("📋 Finding issue TES-20...\n");
    const issue = await linearClient.issue("TES-20");
    
    if (!issue) {
      console.error("❌ Issue TES-20 not found");
      return;
    }
    
    console.log(`✅ Found: ${issue.identifier} - ${issue.title}\n`);
    
    // Get workflow states for the team
    console.log("🔍 Finding 'In Progress' state...\n");
    const team = await linearClient.team(TESTING_TEAM_ID);
    const states = await team.states();
    
    // Find the "In Progress" state
    let inProgressState = null;
    for (const state of states.nodes) {
      console.log(`   • ${state.name} (${state.type})`);
      if (state.name.toLowerCase().includes("progress") || state.name.toLowerCase() === "in progress") {
        inProgressState = state;
      }
    }
    
    console.log("");
    
    if (!inProgressState) {
      console.error("❌ 'In Progress' state not found");
      console.log("\n💡 Available states listed above. Try one of those!");
      return;
    }
    
    console.log(`✅ Found state: "${inProgressState.name}" (ID: ${inProgressState.id})\n`);
    
    // Update the issue
    console.log("⚡ Updating issue status...\n");
    
    const result = await linearClient.updateIssue(issue.id, {
      stateId: inProgressState.id,
    });
    
    const updatedIssue = await result.issue;
    
    if (!updatedIssue) {
      console.error("❌ Failed to update issue");
      return;
    }
    
    const newState = await updatedIssue.state;
    
    console.log("━".repeat(60));
    console.log("\n✅ Issue Updated Successfully!\n");
    console.log(`📌 Issue: ${updatedIssue.identifier}`);
    console.log(`📝 Title: ${updatedIssue.title}`);
    console.log(`📊 Old Status: Backlog`);
    console.log(`📊 New Status: ${newState?.name} ✨`);
    console.log(`🔗 URL: ${updatedIssue.url}`);
    console.log(`⏰ Updated: ${new Date().toLocaleString()}`);
    console.log("\n━".repeat(60));
    console.log("\n🎉 Status Changed!");
    console.log("👻 Issue moved with zen precision~\n");
    console.log("💡 Check Linear to see the updated status!\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

updateIssueStatus();

