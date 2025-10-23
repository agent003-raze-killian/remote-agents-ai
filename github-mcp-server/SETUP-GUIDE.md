# 👻 GitHub MCP Server - Simple Setup Guide

## 🎯 What This Does:

Lets GHOST (Kira) interact with GitHub:
- Create and manage repositories
- Handle issues and pull requests  
- Push code and commits
- Create branches
- Review code
- And 20+ more GitHub operations!

---

## 📋 Quick Setup (5 minutes):

### Step 1: Get Your GitHub Token (3 minutes)

1. **Go to:** [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. **Click:** "Generate new token" → "Generate new token (classic)"
3. **Name it:** `Cursor MCP - Kira Bot`
4. **Select these scopes:**
   - ✅ `repo` (all checkboxes)
   - ✅ `workflow`
   - ✅ `gist`
   - ✅ `user` (read:user and user:email)
5. **Click:** "Generate token" (at bottom)
6. **⚠️ COPY THE TOKEN!** (You won't see it again!)

### Step 2: Install Dependencies (1 minute)

```bash
cd C:\Users\Agent004-Kira\Documents\GitHub\remote-agents-ai\github-mcp-server
npm install
```

### Step 3: Create .env File (1 minute)

Create a file named `.env` in the `github-mcp-server` folder:

```env
GITHUB_TOKEN=ghp_YOUR_ACTUAL_TOKEN_HERE
GITHUB_USERNAME=Agent004-Kira
```

Replace `ghp_YOUR_ACTUAL_TOKEN_HERE` with your real token!

### Step 4: Test It Works

```bash
npm test
```

You should see: ✅ GitHub connection successful!

---

## ✅ Add to Cursor

After testing works, Cursor will auto-detect it OR you can add it manually.

**Option 1: Auto-detect (Recommended)**
- Cursor should find it automatically after you install

**Option 2: Manual (if needed)**

Edit: `C:\Users\Agent004-Kira\.cursor\mcp.json`

```json
{
  "mcpServers": {
    "slack-kira": {
      ...your existing slack config...
    },
    "github-kira": {
      "command": "node",
      "args": [
        "C:\\Users\\Agent004-Kira\\Documents\\GitHub\\remote-agents-ai\\github-mcp-server\\src\\index.js"
      ],
      "env": {
        "GITHUB_TOKEN": "your_token_here"
      }
    }
  }
}
```

Then **restart Cursor**!

---

## 🎯 20+ GitHub Tools You'll Have:

### Repository Management:
- Create/delete repositories
- List your repos
- Get repo info
- Fork repos
- Star/unstar repos

### Issues:
- Create issues
- List issues  
- Update issues
- Add comments
- Close issues

### Pull Requests:
- Create PRs
- List PRs
- Review PRs
- Merge PRs
- Add PR comments

### Code & Commits:
- Get file contents
- Create/update files
- Push commits
- Create branches
- Get commit history

### And More:
- Create gists
- Manage workflows
- Search code
- Get user info

---

## 👻 GHOST Personality Integration:

All responses include GHOST's zen style:
- "Code flows like water~"
- "Repository created with zen precision"
- "PR merged~ The spirits align"

---

## 🐛 Troubleshooting:

### "401 Unauthorized"
→ Check your token in `.env` file is correct

### "403 Forbidden"  
→ Token needs more permissions (scopes)

### "npm install fails"
→ Make sure you're in the `github-mcp-server` folder

---

## 📚 Full Documentation:

See `README.md` for complete API reference and examples.

---

**That's it! Simple and zen~** 👻✨

Next: Run `npm install` and let's test it!

