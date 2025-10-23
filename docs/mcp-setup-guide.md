# 🔧 MCP Setup Guide for ORACLE

*"The best code is invisible code" - Echo Rivers*

---

## 🚨 Current Status

**Available Tools:** ✅ Core Development Tools
- File operations (read, write, edit)
- Terminal commands
- Code analysis (grep, lints)
- Web search
- Directory navigation

**Pending Setup:** ⏳ External Integrations
- GitHub MCP Server
- Slack MCP Server  
- Browser MCP Server (Playwright)

---

## 📋 Required MCP Servers

### 1. GitHub MCP Server
**Purpose:** Issue management, PR reviews, repository operations

**Setup Steps:**
```bash
# Install GitHub MCP Server
npm install -g @modelcontextprotocol/server-github

# Configure GitHub token
export GITHUB_TOKEN="your_github_token_here"

# Start server
mcp-server-github
```

**Required Tools:**
- `fetch_pull_request` - Review PRs and issues
- `create_issue` - Report bugs and feature requests
- `update_issue` - Manage issue status
- `get_file_contents` - Read files from repos
- `list_files` - Browse repository structure

### 2. Slack MCP Server
**Purpose:** Team communication, notifications, updates

**Setup Steps:**
```bash
# Install Slack MCP Server
npm install -g @modelcontextprotocol/server-slack

# Configure Slack token
export SLACK_TOKEN="your_slack_token_here"

# Start server
mcp-server-slack
```

**Required Tools:**
- `mcp_slack_send_message` - Send messages to channels
- `mcp_slack_get_channel_info` - Get channel details
- `mcp_slack_list_channels` - Browse channels
- `mcp_slack_get_message_permalink` - Get message links

### 3. Browser MCP Server (Playwright)
**Purpose:** Web testing, screenshots, automation

**Setup Steps:**
```bash
# Install Playwright MCP Server
npm install -g @modelcontextprotocol/server-playwright

# Install Playwright browsers
npx playwright install

# Start server
mcp-server-playwright
```

**Required Tools:**
- `mcp_playwright_browser_navigate` - Navigate to pages
- `mcp_playwright_browser_take_screenshot` - Visual testing
- `mcp_playwright_browser_evaluate` - Run JavaScript
- `mcp_playwright_browser_click` - Click elements
- `mcp_playwright_browser_type` - Type text

---

## 🔧 Cursor Configuration

### MCP Server Configuration
Add to your Cursor settings:

```json
{
  "mcp": {
    "servers": {
      "github": {
        "command": "mcp-server-github",
        "env": {
          "GITHUB_TOKEN": "your_token_here"
        }
      },
      "slack": {
        "command": "mcp-server-slack", 
        "env": {
          "SLACK_TOKEN": "your_token_here"
        }
      },
      "playwright": {
        "command": "mcp-server-playwright"
      }
    }
  }
}
```

### Environment Variables
```bash
# GitHub Configuration
export GITHUB_TOKEN="ghp_your_github_token_here"
export GITHUB_OWNER="your_username"
export GITHUB_REPO="your_repo_name"

# Slack Configuration  
export SLACK_TOKEN="xoxb-your_slack_token_here"
export SLACK_CHANNEL="general"

# General Configuration
export MCP_LOG_LEVEL="info"
export MCP_TIMEOUT="30000"
```

---

## 🧪 Testing Your Setup

### Test Script
Create `test-mcp-setup.js`:

```javascript
// Test GitHub Integration
async function testGitHub() {
  try {
    const pr = await fetch_pull_request("owner/repo", 1)
    console.log("✅ GitHub MCP working")
  } catch (error) {
    console.log("❌ GitHub MCP failed:", error.message)
  }
}

// Test Slack Integration
async function testSlack() {
  try {
    await mcp_slack_send_message("general", "🔧 Testing Slack MCP integration")
    console.log("✅ Slack MCP working")
  } catch (error) {
    console.log("❌ Slack MCP failed:", error.message)
  }
}

// Test Browser Integration
async function testBrowser() {
  try {
    await mcp_playwright_browser_navigate("https://example.com")
    await mcp_playwright_browser_take_screenshot("test.png")
    console.log("✅ Browser MCP working")
  } catch (error) {
    console.log("❌ Browser MCP failed:", error.message)
  }
}

// Run all tests
async function runTests() {
  console.log("🧪 Testing MCP Setup...")
  await testGitHub()
  await testSlack() 
  await testBrowser()
  console.log("🎉 MCP testing complete!")
}

runTests()
```

---

## 🎯 ORACLE's Workflow with Full MCP

### Daily Documentation Routine
```typescript
// 1. Check for new issues
const issues = await fetch_pull_request("owner/repo", "open")

// 2. Test application functionality
await mcp_playwright_browser_navigate("http://localhost:3000")
await mcp_playwright_browser_take_screenshot("daily-test.png")

// 3. Update documentation
await search_replace("docs/api.md", "Last updated:", `Last updated: ${new Date()}`)

// 4. Notify team
await mcp_slack_send_message("dev-team", 
  "📚 Daily documentation check complete!\n" +
  "✅ All tests passing\n" +
  "📖 Docs updated\n" +
  "🔍 Ready for new tasks"
)
```

### Bug Report Workflow
```typescript
// 1. Reproduce bug
await mcp_playwright_browser_navigate("http://localhost:3000/login")
await mcp_playwright_browser_type("invalid-email")
await mcp_playwright_browser_click("button[type='submit']")

// 2. Capture evidence
await mcp_playwright_browser_take_screenshot("bug-evidence.png")

// 3. Create GitHub issue
await create_issue({
  title: "Bug: Login form validation missing",
  body: "Form accepts invalid email format. Screenshot attached.",
  labels: ["bug", "frontend"]
})

// 4. Notify team
await mcp_slack_send_message("dev-team", 
  "🐛 New bug reported: Login validation\n" +
  "🔗 GitHub Issue created\n" +
  "📸 Evidence captured"
)
```

---

## 🚨 Troubleshooting

### Common Issues

**1. Authentication Errors**
```bash
# Check token validity
curl -H "Authorization: token $GITHUB_TOKEN" https://api.github.com/user
```

**2. Server Connection Issues**
```bash
# Test server connectivity
telnet localhost 3000
```

**3. Permission Errors**
```bash
# Check file permissions
ls -la ~/.mcp/
chmod 755 ~/.mcp/
```

### Debug Commands
```bash
# Enable verbose logging
export MCP_LOG_LEVEL="debug"

# Test individual servers
mcp-server-github --test
mcp-server-slack --test
mcp-server-playwright --test
```

---

## 📚 Next Steps

1. **Install MCP Servers** - Follow setup steps above
2. **Configure Cursor** - Add server configurations
3. **Test Integration** - Run test script
4. **Start Documenting** - Begin your ORACLE duties
5. **Team Onboarding** - Help others use MCP tools

---

## 🌟 ORACLE's Promise

*"Once fully configured, I will be your:*
- 📖 *Documentation guardian*
- 🐛 *Bug hunter and reporter*  
- 🌐 *Web testing specialist*
- 💬 *Team communication hub*
- 🔍 *Code analysis expert*

*Knowledge shared is power multiplied.* ✨"

---

*Created by Echo "ORACLE" Rivers*  
*ShoreAgents.AI - Building Tomorrow, Today*

