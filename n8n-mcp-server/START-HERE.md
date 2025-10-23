# 🚀 N8N MCP Server - START HERE

**Get up and running in 5 minutes!** 👻

---

## 📋 **What You Need:**

1. **N8N Instance** (running)
2. **N8N API Key** (from Settings → API)

Don't have N8N? See options below! ⬇️

---

## ⚡ **Super Quick Setup (3 Steps):**

### **Step 1: Get N8N Running** 🔧

Choose ONE option:

#### **Option A: N8N Cloud** ⭐ **(Easiest!)**
1. Go to: https://n8n.io
2. Click **Get Started** (Free account!)
3. Your URL: `https://[your-name].app.n8n.cloud`

#### **Option B: Run Locally with Docker** 🐳
```bash
docker run -it --rm --name n8n -p 5678:5678 docker.n8n.io/n8nio/n8n
```
Then open: http://localhost:5678

#### **Option C: Install with NPM**
```bash
npm install -g n8n
n8n start
```
Then open: http://localhost:5678

---

### **Step 2: Get Your API Key** 🔑

1. Open your N8N instance
2. Click **Settings** ⚙️ (bottom left)
3. Go to **API** section
4. Click **Create API Key**
5. Name it: `Cursor MCP - Kira`
6. **COPY THE KEY!** (starts with `n8n_api_`)

---

### **Step 3: Configure & Test** ✅

Create `.env` file in `n8n-mcp-server` folder:

```env
N8N_API_KEY=n8n_api_paste_your_key_here
N8N_BASE_URL=http://localhost:5678
```

**Change `N8N_BASE_URL` if using N8N Cloud:**
```env
N8N_BASE_URL=https://your-instance.app.n8n.cloud
```

**Test it:**
```bash
cd C:\Users\Agent004-Kira\Documents\GitHub\remote-agents-ai\n8n-mcp-server
npm test
```

You should see:
```
✅ Connected to N8N successfully!
📊 Workflows: X
👻 Connection verified with zen precision~
```

---

## 🎯 **Add to Cursor:**

I'll help you add it to your `mcp.json` next!

Just tell me:
1. ✅ I have N8N running
2. ✅ I have my API key
3. ✅ Test passed

And I'll configure Cursor for you! 👻✨

---

## 📚 **More Help:**

- **WHAT-YOU-NEED.md** - Detailed requirements
- **SETUP-GUIDE.md** - Step-by-step with screenshots
- **README.md** - Full documentation

---

## 🎊 **After Setup:**

You'll have **3 MCP Servers**:
- ✅ **slack-kira** - 27 Slack tools
- ✅ **github-kira** - 24 GitHub tools
- ✅ **n8n-kira** - 13 N8N tools

**= 64 total automation tools!** 🚀

---

👻 **Ready to automate with zen precision?** Let's go!


