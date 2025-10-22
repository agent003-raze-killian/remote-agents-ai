# 🚀 N8N MCP Server Setup Guide

## 📖 Step-by-Step Instructions

---

### **Step 1: Set Up N8N** ⚙️

You need a running N8N instance first.

#### Option A: Use N8N Cloud (Recommended for beginners)
1. Go to: https://n8n.io
2. Click **Get Started**
3. Sign up for a free account
4. Your instance URL will be: `https://[your-name].app.n8n.cloud`

#### Option B: Run N8N Locally with Docker
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```
Then open: http://localhost:5678

#### Option C: Install N8N with npm
```bash
npm install -g n8n
n8n start
```
Then open: http://localhost:5678

---

### **Step 2: Get Your N8N API Key** 🔑

1. Open your N8N instance
2. Click the **Settings** icon (⚙️) in the bottom left
3. Go to **API** section
4. Click **Create API Key**
5. Give it a name: `Cursor MCP - Kira`
6. **Copy the API key** (starts with `n8n_api_`)

⚠️ **IMPORTANT:** Save this key! You can't see it again!

---

### **Step 3: Install Dependencies** 📦

Open terminal in the `n8n-mcp-server` folder:

```bash
cd C:\Users\Agent004-Kira\Documents\GitHub\remote-agents-ai\n8n-mcp-server
npm install
```

---

### **Step 4: Create `.env` File** 📝

Create a file named `.env` in the `n8n-mcp-server` folder:

```env
N8N_API_KEY=n8n_api_your_actual_key_here
N8N_BASE_URL=http://localhost:5678
```

**Replace:**
- `n8n_api_your_actual_key_here` with your actual API key
- `http://localhost:5678` with your N8N URL (if different)

---

### **Step 5: Test the Connection** 🧪

```bash
npm test
```

You should see:
```
✅ Connected to N8N!
📊 Workflows: X
👻 N8N MCP ready~
```

---

### **Step 6: Add to Cursor** 🎯

Your `mcp.json` will be updated automatically, or you can add manually:

**Location:** `C:\Users\Agent004-Kira\.cursor\mcp.json`

```json
{
  "mcpServers": {
    "slack-kira": { ... },
    "github-kira": { ... },
    "n8n-kira": {
      "command": "node",
      "args": [
        "C:\\Users\\Agent004-Kira\\Documents\\GitHub\\remote-agents-ai\\n8n-mcp-server\\src\\index.js"
      ],
      "env": {
        "N8N_API_KEY": "your_api_key_here",
        "N8N_BASE_URL": "http://localhost:5678"
      }
    }
  }
}
```

---

### **Step 7: Restart Cursor** 🔄

1. Close Cursor completely
2. Reopen Cursor
3. Go to **Settings → Tools & MCP**
4. You should see **n8n-kira** with tools! 🎉

---

## 🎊 **You're Done!**

You now have **3 MCP servers**:
- ✅ **slack-kira** - 27 Slack tools
- ✅ **github-kira** - 24 GitHub tools
- ✅ **n8n-kira** - 15+ N8N tools

**Total: 66+ tools!** 🚀👻✨

---

## ❓ **Troubleshooting**

**Can't connect to N8N?**
- Make sure N8N is running
- Check your API key is correct
- Verify the base URL matches your instance

**Tools not showing in Cursor?**
- Restart Cursor completely
- Check `mcp.json` has correct paths
- Verify `.env` file is in the right location

**Need help?**
- Check `README.md` for full documentation
- See `WHAT-YOU-NEED.md` for requirements


