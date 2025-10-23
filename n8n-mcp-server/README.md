# 👻 N8N MCP Server

**Workflow automation with GHOST's zen precision~**

Control N8N directly from Cursor AI with 13 powerful tools for workflow automation!

---

## 🎯 What is This?

An MCP (Model Context Protocol) server that connects Cursor AI to your N8N instance, enabling:
- Create and manage workflows
- Execute and monitor automation
- Manage credentials securely
- Test workflows in real-time

All with GHOST's zen approach to automation! 🍃

---

## ⚡ Quick Start

### 1. **Prerequisites**
- ✅ N8N instance (cloud or self-hosted)
- ✅ N8N API key
- ✅ Node.js installed

### 2. **Install**
```bash
cd n8n-mcp-server
npm install
```

### 3. **Configure**
Create `.env` file:
```env
N8N_API_KEY=n8n_api_xxxxxxxxxxxxxxxxxxxxx
N8N_BASE_URL=http://localhost:5678
```

### 4. **Test**
```bash
npm test
```

### 5. **Add to Cursor**
The server will be added to your `mcp.json` automatically!

---

## 🛠️ Tools Available (13 Total)

### 📋 Workflow Management
- **n8n_list_workflows** - List all workflows
- **n8n_get_workflow** - Get workflow details
- **n8n_create_workflow** - Create new workflow
- **n8n_update_workflow** - Update workflow
- **n8n_delete_workflow** - Delete workflow
- **n8n_activate_workflow** - Activate automation
- **n8n_deactivate_workflow** - Pause automation
- **n8n_test_workflow** - Test workflow execution

### 📊 Execution Management
- **n8n_list_executions** - List workflow runs
- **n8n_get_execution** - Get execution details
- **n8n_delete_execution** - Delete execution record

### 🔐 Credentials
- **n8n_list_credentials** - List all credentials
- **n8n_get_credential** - Get credential info

---

## 📖 Documentation

- **WHAT-YOU-NEED.md** - Requirements checklist
- **SETUP-GUIDE.md** - Step-by-step setup
- **env-template.txt** - Environment variable template

---

## 🎯 Usage Examples

**In Cursor AI, you can say:**

```
"List all my N8N workflows"
"Create a workflow that sends Slack notifications"
"Show me the last 10 workflow executions"
"Activate my workflow called 'Daily Report'"
"Test my automation workflow"
```

---

## 🌟 Features

- ✅ **13 N8N tools** for complete workflow control
- ✅ **Zero config** - Works with N8N Cloud or self-hosted
- ✅ **Secure** - API key stored locally in `.env`
- ✅ **Fast** - Direct API integration
- ✅ **GHOST-themed** - Zen responses for every action

---

## 🔧 Setup Options

### Option 1: N8N Cloud (Easiest)
1. Sign up at https://n8n.io
2. Get your API key from Settings → API
3. Use your cloud URL: `https://[you].app.n8n.cloud`

### Option 2: Self-Hosted (Local)
```bash
npm install -g n8n
n8n start
```
URL: `http://localhost:5678`

### Option 3: Docker
```bash
docker run -it --rm \
  --name n8n \
  -p 5678:5678 \
  docker.n8n.io/n8nio/n8n
```
URL: `http://localhost:5678`

---

## 🎊 Complete Setup

With this server, you'll have:
- ✅ **27 Slack tools** (slack-kira)
- ✅ **24 GitHub tools** (github-kira)
- ✅ **13 N8N tools** (n8n-kira)

**= 64 total tools!** 🚀

---

## 🐛 Troubleshooting

**Connection failed?**
- Make sure N8N is running
- Check API key is correct
- Verify base URL matches your instance

**Tools not in Cursor?**
- Restart Cursor completely
- Check `mcp.json` configuration
- Verify `.env` file location

**API key issues?**
- Regenerate key in N8N Settings → API
- Make sure API is enabled in N8N

---

## 👻 Created By

**ShoreAgents AI - Agent004-Kira (GHOST)**

Zen automation. Optimized workflow. Minimal friction. 🍃

---

**Ready to automate with zen precision?** Let's flow! 🚀✨


