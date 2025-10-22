# 🚀 START HERE - GitHub MCP Setup

## 3-Step Setup (5 minutes total):

---

### Step 1: Get Your GitHub Token (3 min) 🔑

**Click this link:** [https://github.com/settings/tokens/new](https://github.com/settings/tokens/new)

**Fill in:**
- Note: `Cursor MCP - Kira Bot`
- Expiration: `90 days` (or `No expiration`)

**Check these boxes:**
- ✅ **repo** (check the main box, all sub-boxes auto-check)
- ✅ **workflow**
- ✅ **gist**  
- ✅ **user** → **read:user**

**Click:** "Generate token" (green button at bottom)

**⚠️ COPY THE TOKEN NOW!** It looks like: `ghp_abc123...`

---

### Step 2: Setup Files (1 min) 📁

Open terminal in this folder and run:

```bash
npm install
```

Then create a file named `.env` with this content:

```
GITHUB_TOKEN=ghp_paste_your_token_here
GITHUB_USERNAME=Agent004-Kira
```

(Replace `ghp_paste_your_token_here` with your actual token!)

---

### Step 3: Test It (1 min) ✅

```bash
npm test
```

**You should see:**
```
✅ Successfully connected to GitHub!
👤 Authenticated as: Agent004-Kira
🎉 GitHub MCP Server is ready to use!
```

---

## ✅ Done! Now What?

### Option A: Cursor Auto-Detects (Easiest)

1. **Restart Cursor** completely
2. Go to **Settings → Tools & MCP**
3. Look for **"github-kira"** - it should appear!
4. Should show **24 tools available** ✨

### Option B: Add Manually (If needed)

If Cursor doesn't auto-detect, add to your `mcp.json`:

**Location:** `C:\Users\Agent004-Kira\.cursor\mcp.json`

```json
{
  "mcpServers": {
    "slack-kira": {
      ...keep your existing slack config...
    },
    "github-kira": {
      "command": "node",
      "args": [
        "C:\\Users\\Agent004-Kira\\Documents\\GitHub\\remote-agents-ai\\github-mcp-server\\src\\index.js"
      ],
      "env": {
        "GITHUB_TOKEN": "your_actual_token_here"
      }
    }
  }
}
```

Then **Restart Cursor!**

---

## 🎯 Try It Out!

In Cursor AI chat, try:

```
"List my GitHub repositories"
"Create a new repo called 'test-zen-repo'"
"Show me recent commits in remote-agents-ai"
```

---

## 🎉 You Now Have:

- ✅ **27 Slack tools** (from slack-kira)
- ✅ **24 GitHub tools** (from github-kira)
- = **51 total tools!** 🚀

Both with GHOST's zen personality! 👻

---

## 📚 Learn More:

- **All Tools:** See `README.md`
- **Detailed Setup:** See `SETUP-GUIDE.md`
- **Token Help:** See `WHAT-YOU-NEED.md`

---

## 🐛 Problems?

### Token doesn't work?
→ Make sure you checked **repo** scope when creating it

### npm install fails?
→ Make sure you're in the `github-mcp-server` folder

### Cursor doesn't show it?
→ Try restarting Cursor completely (quit and reopen)

---

**That's it! You're ready to optimize GitHub with zen precision~** 👻✨

*"The best code flows invisibly, like wind through branches~"*

