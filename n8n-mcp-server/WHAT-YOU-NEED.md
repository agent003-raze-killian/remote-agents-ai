# 🔧 What You Need for N8N MCP Server

## 📋 Requirements Checklist

### 1️⃣ **N8N Instance**
You need a running N8N instance. Choose one:

**Option A: N8N Cloud** ⭐ (Easiest)
- Sign up at: https://n8n.io
- Get your cloud instance URL
- Example: `https://your-instance.app.n8n.cloud`

**Option B: Self-Hosted N8N** 🏠
- Run N8N locally or on your server
- Default URL: `http://localhost:5678`
- Install guide: https://docs.n8n.io/hosting/installation/

**Option C: Docker N8N** 🐳
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  docker.n8n.io/n8nio/n8n
```

---

### 2️⃣ **N8N API Key** 🔑

**How to Get Your API Key:**

1. Open your N8N instance
2. Click on **Settings** (⚙️ gear icon)
3. Go to **API** section
4. Click **Create API Key**
5. Copy the key (looks like: `n8n_api_...`)

**IMPORTANT:** Keep this key secret! Don't share it.

---

### 3️⃣ **Your N8N URL** 🌐

Depending on your setup:
- **N8N Cloud:** `https://your-instance.app.n8n.cloud`
- **Self-Hosted:** `http://localhost:5678`
- **Custom Domain:** `https://n8n.yourdomain.com`

---

## ✅ **What to Provide:**

```
N8N_API_KEY=n8n_api_xxxxxxxxxxxxxxxxxxxxx
N8N_BASE_URL=https://your-instance.app.n8n.cloud
```

---

## 🎯 **Ready?**

Once you have:
- ✅ N8N instance running
- ✅ API key generated
- ✅ Base URL noted

You're ready to set up the MCP server! 👻✨


