# 👻 Linear MCP Server

**Project management with GHOST's zen precision~**

Control Linear directly from Cursor AI with 20 powerful tools for issue tracking and project management!

---

## 🎯 What is This?

An MCP (Model Context Protocol) server that connects Cursor AI to your Linear workspace, enabling:
- Create and manage issues
- Track projects and teams
- Add comments and labels
- Manage sprints/cycles
- Search and organize work

All with GHOST's zen approach! 🍃

---

## ⚡ Quick Start

### 1. **Prerequisites**
- ✅ Linear account (free or paid)
- ✅ Linear API key
- ✅ Node.js installed

### 2. **Install**
```bash
cd linear-mcp-server
npm install
```

### 3. **Configure**
Create `.env` file:
```env
LINEAR_API_KEY=lin_api_xxxxxxxxxxxxxxxxxxxxx
```

### 4. **Test**
```bash
npm test
```

### 5. **Add to Cursor**
The server will be added to your `mcp.json` automatically!

---

## 🛠️ Tools Available (20 Total)

### 🎯 Issue Management (6 tools)
- **linear_list_issues** - List issues with filters
- **linear_get_issue** - Get issue details
- **linear_create_issue** - Create new issue
- **linear_update_issue** - Update issue
- **linear_delete_issue** - Delete issue
- **linear_search_issues** - Search issues

### 💬 Comments (2 tools)
- **linear_add_comment** - Add comment to issue
- **linear_get_comments** - Get issue comments

### 👥 Teams (2 tools)
- **linear_list_teams** - List all teams
- **linear_get_team** - Get team details

### 📦 Projects (3 tools)
- **linear_list_projects** - List projects
- **linear_get_project** - Get project details
- **linear_create_project** - Create project

### 👤 Users (2 tools)
- **linear_get_viewer** - Get your info
- **linear_list_users** - List workspace users

### 🔄 Workflow (1 tool)
- **linear_list_workflow_states** - List workflow states

### 🏷️ Labels (2 tools)
- **linear_list_labels** - List labels
- **linear_create_label** - Create label

### 🔁 Cycles/Sprints (2 tools)
- **linear_list_cycles** - List all cycles
- **linear_get_current_cycle** - Get active cycle

---

## 📖 Documentation

- **WHAT-YOU-NEED.md** - Requirements (just 1 API key!)
- **SETUP-GUIDE.md** - Step-by-step setup
- **env-template.txt** - Environment template

---

## 🎯 Usage Examples

**In Cursor AI, you can say:**

```
"Show me all my Linear issues"
"Create a high-priority bug issue in Linear"
"List all projects in Linear"
"Add a comment to issue LIN-123"
"Show me the current sprint tasks"
"Update issue LIN-456 status to In Progress"
"Search Linear for 'authentication'"
```

---

## 🌟 Features

- ✅ **20 Linear tools** for complete project management
- ✅ **Super simple** - Just 1 API key needed
- ✅ **Secure** - API key stored locally in `.env`
- ✅ **Fast** - Official Linear SDK integration
- ✅ **GHOST-themed** - Zen responses for every action

---

## 🔧 Setup Options

### Get Your API Key (2 minutes):

**Method 1: Direct Link** ⚡
1. Go to: https://linear.app/settings/api
2. Create API Key
3. Copy it!

**Method 2: Through App**
1. Open Linear → Settings ⚙️
2. Go to API section
3. Create Personal API Key
4. Copy it!

That's it! No complex setup needed! 🎊

---

## 🎊 Complete Setup

With all MCP servers, you'll have:
- ✅ **27 Slack tools** (slack-kira)
- ✅ **24 GitHub tools** (github-kira)
- ✅ **20 Linear tools** (linear-kira)
- ✅ **13 N8N tools** (n8n-kira) *when ready*

**= 84+ total tools!** 🚀

---

## 🐛 Troubleshooting

**Connection failed?**
- Check API key is correct
- Make sure you have Linear access
- Verify `.env` file location

**Tools not in Cursor?**
- Restart Cursor completely
- Check `mcp.json` configuration
- Verify dependencies installed

**Permission errors?**
- Regenerate API key in Linear
- Check workspace access

---

## 📚 Learn More

- **Linear API Docs:** https://developers.linear.app
- **Linear SDK:** https://github.com/linear/linear
- **GraphQL Explorer:** https://studio.apollographql.com/public/Linear-API

---

## 👻 Created By

**ShoreAgents AI - Agent004-Kira (GHOST)**

Zen project management. Optimized workflow. Minimal friction. 🍃

---

**Ready to manage projects with zen precision?** Let's flow! 🚀✨

