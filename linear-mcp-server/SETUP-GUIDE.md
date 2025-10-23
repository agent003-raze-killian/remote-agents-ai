# 🚀 Linear MCP Server Setup Guide

## 📖 Step-by-Step Instructions

**This is the EASIEST setup yet!** Only 1 API key needed! 🎉

---

## **Step 1: Create Linear Account** 🎯

If you don't have one:
1. Go to: https://linear.app
2. Click **Get Started**
3. Sign up (free plan available!)
4. Create or join a workspace

---

## **Step 2: Get Your API Key** 🔑

### **Method 1: Direct Link** ⚡ (Fastest)
1. Go to: https://linear.app/settings/api
2. Scroll to **Personal API Keys**
3. Click **Create Key**
4. Name: `Cursor MCP - Kira`
5. **Copy the key** (starts with `lin_api_`)

### **Method 2: Through Settings**
1. Open Linear
2. Click your profile → **Settings**
3. Go to **API** section
4. Scroll to **Personal API Keys**
5. Click **Create Key**
6. Name: `Cursor MCP - Kira`
7. **Copy the key**

⚠️ **SAVE THIS KEY!** You can't see it again after closing!

---

## **Step 3: Install Dependencies** 📦

```bash
cd C:\Users\Agent004-Kira\Documents\GitHub\remote-agents-ai\linear-mcp-server
npm install
```

---

## **Step 4: Create `.env` File** 📝

Create a file named `.env` in the `linear-mcp-server` folder:

```env
LINEAR_API_KEY=lin_api_your_actual_key_here
```

**That's it!** No URLs, no app tokens - just one key! 🎊

---

## **Step 5: Test the Connection** 🧪

```bash
npm test
```

You should see:
```
✅ Connected to Linear!
👤 User: Your Name
🏢 Organization: Your Workspace
📊 Teams: X
👻 Linear MCP ready~
```

---

## **Step 6: Add to Cursor** 🎯

Your `mcp.json` will be updated automatically!

**Location:** `C:\Users\Agent004-Kira\.cursor\mcp.json`

```json
{
  "mcpServers": {
    "slack-kira": { ... },
    "github-kira": { ... },
    "linear-kira": {
      "command": "node",
      "args": [
        "C:\\Users\\Agent004-Kira\\Documents\\GitHub\\remote-agents-ai\\linear-mcp-server\\src\\index.js"
      ],
      "env": {
        "LINEAR_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

---

## **Step 7: Restart Cursor** 🔄

1. Close Cursor completely
2. Reopen Cursor
3. Go to **Settings → Tools & MCP**
4. You should see **linear-kira** with 20+ tools! 🎉

---

## 🎊 **You're Done!**

You now have **4 MCP servers**:
- ✅ **slack-kira** - 27 Slack tools
- ✅ **github-kira** - 24 GitHub tools
- ✅ **n8n-kira** - 13 N8N tools (when ready)
- ✅ **linear-kira** - 20 Linear tools ⭐

**Total: 84+ tools!** 🚀👻✨

---

## 🛠️ **What You Can Do:**

**In Cursor AI, try:**
```
"Show me all Linear issues assigned to me"
"Create a new issue in Linear"
"List all my Linear projects"
"Update issue status to In Progress"
"Add a comment to issue LIN-123"
"Show me current cycle tasks"
```

---

## ❓ **Troubleshooting**

**Can't connect?**
- Check your API key is correct
- Make sure you have Linear access
- Verify `.env` file is in the right location

**Tools not showing?**
- Restart Cursor completely
- Check `mcp.json` configuration
- Verify dependencies installed (`npm install`)

**Permission errors?**
- Make sure your API key has correct permissions
- Check if you're part of the workspace

---

## 📚 **More Help:**

- **Linear API Docs:** https://developers.linear.app
- **GraphQL Playground:** https://studio.apollographql.com/public/Linear-API
- **Linear Support:** https://linear.app/help

---

**Ready to manage projects with zen precision?** 👻✨

