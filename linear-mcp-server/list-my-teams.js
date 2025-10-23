#!/usr/bin/env node

import { LinearClient } from "@linear/sdk";
import dotenv from "dotenv";

dotenv.config();

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

console.log("👻 Listing Your Linear Teams...\n");

async function listTeams() {
  try {
    const linearClient = new LinearClient({ apiKey: LINEAR_API_KEY });
    
    // Get your info
    const viewer = await linearClient.viewer;
    console.log(`👤 User: ${viewer.name} (${viewer.email})`);
    
    const organization = await viewer.organization;
    console.log(`🏢 Organization: ${organization.name}\n`);
    
    console.log("━".repeat(60));
    
    // Get all teams
    const teams = await linearClient.teams();
    
    console.log(`\n📊 You are in ${teams.nodes.length} team(s):\n`);
    
    for (const team of teams.nodes) {
      console.log(`🔷 ${team.name}`);
      console.log(`   Key: ${team.key}`);
      console.log(`   ID: ${team.id}`);
      console.log(`   Description: ${team.description || "No description"}`);
      
      // Get team members count
      const members = await team.members();
      console.log(`   Members: ${members.nodes.length}`);
      
      // Get team issues count
      const issues = await team.issues({ first: 1 });
      console.log(`   Total Issues: ${issues.nodes.length > 0 ? "Has issues" : "No issues yet"}`);
      
      console.log("");
    }
    
    console.log("━".repeat(60));
    console.log("\n👻 Teams listed with zen clarity~\n");

  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

listTeams();

