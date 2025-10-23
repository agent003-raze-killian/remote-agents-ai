# 👻 GitHub MCP Server - GHOST (Kira) Edition

A Model Context Protocol server for GitHub integration, optimized with zen precision.

## ✨ Features

**24 GitHub Tools** for complete repository management:

- 📦 **Repository Management** - Create, list, get, delete repos
- 🐛 **Issues** - Create, list, update, comment
- 🔀 **Pull Requests** - Create, list, merge PRs
- 📝 **Files & Content** - Read, create, update files
- 🌿 **Branches** - Create, list branches
- 💾 **Commits** - List commit history
- 🔍 **Search** - Search repos and code
- 👤 **Users** - Get user information
- ⭐ **Stars & Forks** - Star and fork repos
- 📋 **Gists** - Create code snippets

All with GHOST's zen personality! 👻

---

## 🎯 Quick Start (5 minutes)

### 1. Get GitHub Token

Go to: [https://github.com/settings/tokens](https://github.com/settings/tokens)

1. Click "Generate new token (classic)"
2. Name: `Cursor MCP - Kira Bot`
3. Select scopes: `repo`, `workflow`, `gist`, `user`
4. Generate and **copy the token**!

### 2. Install

```bash
cd github-mcp-server
npm install
```

### 3. Configure

Create `.env` file:

```env
GITHUB_TOKEN=ghp_your_token_here
GITHUB_USERNAME=Agent004-Kira
```

### 4. Test

```bash
npm test
```

You should see: ✅ Successfully connected to GitHub!

### 5. Add to Cursor

The server will auto-load OR add manually to `mcp.json`:

```json
{
  "mcpServers": {
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

**Restart Cursor!**

---

## 🛠️ All 24 Tools

### Repository Management (4 tools)
- `github_create_repo` - Create new repository
- `github_list_repos` - List your repositories
- `github_get_repo` - Get repository details
- `github_delete_repo` - Delete a repository

### Issues (4 tools)
- `github_create_issue` - Create new issue
- `github_list_issues` - List issues
- `github_update_issue` - Update issue
- `github_add_issue_comment` - Comment on issue

### Pull Requests (3 tools)
- `github_create_pr` - Create pull request
- `github_list_prs` - List pull requests
- `github_merge_pr` - Merge pull request

### Files & Content (2 tools)
- `github_get_file` - Get file contents
- `github_create_or_update_file` - Create/update file

### Branches (2 tools)
- `github_create_branch` - Create new branch
- `github_list_branches` - List branches

### Commits (1 tool)
- `github_list_commits` - List commit history

### Search (2 tools)
- `github_search_repos` - Search repositories
- `github_search_code` - Search code

### Users (2 tools)
- `github_get_user` - Get user info
- `github_get_authenticated_user` - Get your info

### Social (2 tools)
- `github_star_repo` - Star a repository
- `github_fork_repo` - Fork a repository

### Gists (1 tool)
- `github_create_gist` - Create code snippet

### Workflows (1 tool)
- `github_list_workflows` - List GitHub Actions

---

## 💬 Example Usage in Cursor

Once configured, you can ask Cursor AI:

```
"Create a new GitHub repo called 'zen-optimization'"
→ Uses github_create_repo

"List all my repositories"
→ Uses github_list_repos

"Create an issue in remote-agents-ai about performance"
→ Uses github_create_issue

"Show me recent commits in this repo"
→ Uses github_list_commits

"Create a new branch called 'feature/ghost-mode'"
→ Uses github_create_branch
```

---

## 👻 GHOST Personality

All responses include zen-style messages:

- "Repository created with zen precision~"
- "Code flows into main branch like water~"
- "Issue created~ The spirits acknowledge this task."
- "Branch created~ New path for code to flow."

---

## 🔒 Security

- ✅ Token stored in `.env` (not committed)
- ✅ `.gitignore` protects your token
- ✅ Can revoke token anytime from GitHub
- ✅ Token only used locally

---

## 🐛 Troubleshooting

### "401 Unauthorized"
→ Token invalid or expired. Create new token.

### "403 Forbidden"
→ Token needs more permissions. Add `repo` scope.

### "npm install fails"
→ Make sure you're in `github-mcp-server` folder.

### "Token not found"
→ Create `.env` file with `GITHUB_TOKEN=...`

---

## 📚 Documentation

- **Setup Guide:** `SETUP-GUIDE.md` - Step-by-step instructions
- **Requirements:** `WHAT-YOU-NEED.md` - What to provide
- **This File:** Complete API reference

---

## 🎨 Integration with Slack MCP

Works perfectly alongside `slack-kira` server:
- **27 Slack tools** + **24 GitHub tools** = **51 total tools!**
- Both use GHOST personality
- Seamless workflow between Slack notifications and GitHub actions

---

## 📊 Stats

- **Tools:** 24
- **Token Required:** 1 (GitHub PAT)
- **Setup Time:** ~5 minutes
- **Zen Level:** Maximum 🍃

---

**Built with 👻 by GHOST (Kira) - Agent004**

*"Code flows like water~ Commits float like cherry blossoms~"*

