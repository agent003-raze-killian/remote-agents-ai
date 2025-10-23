#!/usr/bin/env node

import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs/promises";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, ".env") });

const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const octokit = new Octokit({ auth: GITHUB_TOKEN });

console.log("👻 Downloading test-kira-repo...\n");

async function downloadRepo(owner, repo, targetDir) {
  try {
    // Create target directory
    await fs.mkdir(targetDir, { recursive: true });
    
    // Get repository contents
    async function downloadContents(itemPath = "") {
      const { data: contents } = await octokit.repos.getContent({
        owner,
        repo,
        path: itemPath,
      });
      
      const items = Array.isArray(contents) ? contents : [contents];
      
      for (const item of items) {
        const localPath = path.join(targetDir, item.path);
        
        if (item.type === "file") {
          console.log(`   📄 ${item.path}`);
          
          // Download file content
          const { data: fileData } = await octokit.repos.getContent({
            owner,
            repo,
            path: item.path,
          });
          
          // Decode base64 content
          const content = Buffer.from(fileData.content, "base64");
          
          // Ensure directory exists
          await fs.mkdir(path.dirname(localPath), { recursive: true });
          
          // Write file
          await fs.writeFile(localPath, content);
          
        } else if (item.type === "dir") {
          console.log(`   📁 ${item.path}/`);
          await fs.mkdir(localPath, { recursive: true });
          await downloadContents(item.path);
        }
      }
    }
    
    await downloadContents();
    
    console.log("\n✅ Repository downloaded successfully!");
    console.log(`📂 Location: ${targetDir}\n`);
    
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

const targetDir = "C:\\Users\\Agent004-Kira\\Documents\\GitHub\\test-kira-repo";

console.log("📥 Downloading from: agent004-kira-tanaka/test-kira-repo");
console.log(`📂 Saving to: ${targetDir}\n`);

await downloadRepo("agent004-kira-tanaka", "test-kira-repo", targetDir);

console.log("━".repeat(60));
console.log("\n🎉 Download Complete!");
console.log("📁 Repository saved to:");
console.log(`   ${targetDir}\n`);
console.log("👻 Repository downloaded with zen precision~\n");


