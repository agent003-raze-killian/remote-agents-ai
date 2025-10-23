# 🔮 ORACLE's MCP Mastery Guide

*"Knowledge shared is power multiplied" - Echo Rivers*

---

## 📖 Table of Contents

1. [MCP Fundamentals](#mcp-fundamentals)
2. [Available Tools](#available-tools)
3. [Common Workflows](#common-workflows)
4. [Best Practices](#best-practices)
5. [Troubleshooting](#troubleshooting)
6. [Team Integration](#team-integration)

---

## 🧠 MCP Fundamentals

### What is MCP?
Model Context Protocol (MCP) is the bridge that allows AI agents to interact with external tools and services. Think of it as your digital nervous system - extending capabilities beyond text generation to actually *doing* things in the real world.

### Architecture Overview
```
AI Agent (ORACLE) ↔ MCP Client (Cursor) ↔ MCP Server ↔ External Tool/Service
```

### Core Principles
- **Standardized Communication**: All tools use the same JSON-RPC protocol
- **Real-time Interaction**: Immediate access to live data and services
- **Context Preservation**: Maintains state across multiple tool interactions
- **Error Handling**: Graceful failure with meaningful error messages

---

## 🛠️ Available Tools

### File & Code Management
- `read_file` - Read and analyze any file in workspace
- `write` - Create new files (docs, code, configs)
- `search_replace` - Edit existing files with precision
- `delete_file` - Remove files when needed
- `list_dir` - Explore directory structures
- `glob_file_search` - Find files by patterns
- `grep` - Search for patterns across codebases
- `read_lints` - Check for code quality issues
- `MultiEdit` - Make multiple edits efficiently

### GitHub Integration
- `fetch_pull_request` - Review PRs and issues
- `create_issue` - Report bugs and feature requests
- `update_issue` - Manage issue status and comments
- `get_file_contents` - Read files from GitHub repos
- `list_files` - Browse repository structure

### Browser Testing
- `mcp_playwright_browser_navigate` - Navigate to web pages
- `mcp_playwright_browser_take_screenshot` - Visual testing
- `mcp_playwright_browser_evaluate` - Run JavaScript
- `mcp_playwright_browser_click` - Click elements
- `mcp_playwright_browser_type` - Type text
- `mcp_playwright_browser_get_visible_text` - Extract content

### Communication
- `mcp_slack_send_message` - Send messages to channels
- `mcp_slack_get_channel_info` - Get channel details
- `mcp_slack_list_channels` - Browse available channels
- `mcp_slack_get_message_permalink` - Get message links

### System Operations
- `run_terminal_cmd` - Execute commands and scripts
- `web_search` - Search for real-time information

---

## 🔄 Common Workflows

### Documentation Update Workflow
```typescript
// 1. Read existing documentation
const currentDocs = await read_file("docs/api-reference.md")

// 2. Test the API endpoints
await mcp_playwright_browser_navigate("http://localhost:3000/api/docs")
const apiContent = await mcp_playwright_browser_get_visible_text()

// 3. Update documentation
await search_replace("docs/api-reference.md", 
  "## Authentication", 
  "## Authentication\n\nUpdated: " + new Date().toISOString()
)

// 4. Notify team
await mcp_slack_send_message("dev-team", 
  "📚 API documentation updated! Check the latest changes."
)
```

### Bug Report Workflow
```typescript
// 1. Reproduce the bug
await mcp_playwright_browser_navigate("http://localhost:3000/login")
await mcp_playwright_browser_type("invalid-email")
await mcp_playwright_browser_click("button[type='submit']")

// 2. Take screenshot
await mcp_playwright_browser_take_screenshot("login-validation-bug.png")

// 3. Create GitHub issue
await create_issue({
  title: "Bug: Login form accepts invalid email format",
  body: `
## Issue Description
The login form accepts invalid email formats without validation.

## Steps to Reproduce
1. Navigate to /login
2. Enter "invalid-email" (no @ symbol)
3. Click submit
4. Form submits without error

## Expected Behavior
Form should show validation error for invalid email format.

## Screenshot
![Bug Screenshot](./login-validation-bug.png)
  `,
  labels: ["bug", "frontend", "validation"]
})
```

### Code Review Workflow
```typescript
// 1. Fetch PR details
const pr = await fetch_pull_request("owner/repo", 123)

// 2. Check for documentation updates
const files = await list_files("owner/repo", pr.head.sha)
const hasDocs = files.some(file => file.path.includes("docs/"))

// 3. Create issue if docs missing
if (!hasDocs) {
  await create_issue({
    title: `PR #${pr.number}: Missing documentation updates`,
    body: "This PR introduces new features but doesn't include documentation updates.",
    labels: ["documentation", "pr-review"]
  })
}

// 4. Notify team
await mcp_slack_send_message("dev-team", 
  `🔍 PR #${pr.number} reviewed. ${hasDocs ? '✅' : '⚠️'} Documentation status: ${hasDocs ? 'Complete' : 'Missing'}`
)
```

---

## 🌟 Best Practices

### 1. Always Document Your Actions
```typescript
// ❌ Bad
await create_issue({ title: "Bug", body: "Fix this" })

// ✅ Good
await create_issue({
  title: "Bug: Memory leak in Dashboard component",
  body: `
## Issue Description
The Dashboard component has a memory leak that causes performance degradation over time.

## Steps to Reproduce
1. Navigate to /dashboard
2. Leave the page open for 30+ minutes
3. Observe increasing memory usage

## Expected Behavior
Memory usage should remain stable.

## Technical Details
- Component: src/components/Dashboard.tsx
- Browser: Chrome 120+
- Memory increase: ~2MB per minute

## Proposed Solution
Implement proper cleanup in useEffect hooks.
  `,
  labels: ["bug", "performance", "frontend"]
})
```

### 2. Use Parallel Tool Calls
```typescript
// ✅ Efficient: Multiple operations in parallel
const [fileContent, lintErrors, channelInfo] = await Promise.all([
  read_file("src/components/Login.tsx"),
  read_lints(["src/components/Login.tsx"]),
  mcp_slack_get_channel_info("dev-team")
])
```

### 3. Handle Errors Gracefully
```typescript
try {
  await mcp_playwright_browser_navigate("http://localhost:3000")
  await mcp_playwright_browser_take_screenshot("app-homepage.png")
} catch (error) {
  await mcp_slack_send_message("dev-team", 
    "⚠️ Browser testing failed: " + error.message
  )
  // Continue with other tasks
}
```

### 4. Maintain Context Across Tool Calls
```typescript
// ✅ Good: Maintain context
const pr = await fetch_pull_request("owner/repo", 123)
const files = await list_files("owner/repo", pr.head.sha)

// Check if documentation was updated
const hasDocs = files.some(file => file.path.includes("docs/"))
if (!hasDocs) {
  await create_issue({
    title: `PR #${pr.number}: Missing documentation updates`,
    body: `This PR introduces new features but doesn't include documentation updates.`
  })
}
```

---

## 🔧 Troubleshooting

### Common Issues & Solutions

**Tool Call Failures**
```typescript
try {
  await mcp_playwright_browser_navigate("http://localhost:3000")
} catch (error) {
  await mcp_slack_send_message("dev-team", 
    "⚠️ Browser navigation failed: " + error.message
  )
  console.error("Navigation error:", error)
}
```

**Authentication Issues**
```typescript
try {
  await create_issue({ title: "Test", body: "Test" })
} catch (error) {
  if (error.message.includes("authentication")) {
    await mcp_slack_send_message("dev-team", 
      "🔐 GitHub authentication issue detected. Please check MCP server configuration."
    )
  }
}
```

**Browser Timeouts**
```typescript
async function navigateWithRetry(url: string, maxRetries = 3) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await mcp_playwright_browser_navigate(url)
      return true
    } catch (error) {
      if (i === maxRetries - 1) throw error
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
  }
}
```

### Debugging Strategies

**Enable Verbose Logging**
```typescript
const startTime = Date.now()
await mcp_playwright_browser_navigate("http://localhost:3000")
const duration = Date.now() - startTime

await mcp_slack_send_message("dev-team", 
  `🔍 Browser navigation completed in ${duration}ms`
)
```

**Test Tool Availability**
```typescript
async function testToolAvailability() {
  try {
    await mcp_slack_send_message("general", "🔧 Testing MCP tools...")
    await mcp_playwright_browser_navigate("about:blank")
    await run_terminal_cmd("echo 'Terminal test'")
    return true
  } catch (error) {
    await mcp_slack_send_message("dev-team", 
      "❌ MCP tool test failed: " + error.message
    )
    return false
  }
}
```

---

## 👥 Team Integration

### Slack Communication Patterns

**Daily Updates**
```typescript
await mcp_slack_send_message("general", 
  "📚 Documentation Status Update:\n" +
  "✅ API guide updated\n" +
  "✅ Component docs refreshed\n" +
  "🔄 Working on deployment guide\n" +
  "Next: Testing documentation"
)
```

**Issue Notifications**
```typescript
await mcp_slack_send_message("dev-team", 
  "🐛 New bug reported: Login form validation\n" +
  "🔗 GitHub Issue: #123\n" +
  "📸 Screenshot attached\n" +
  "Priority: High"
)
```

**PR Reviews**
```typescript
await mcp_slack_send_message("dev-team", 
  "🔍 PR Review Complete: Feature/New Dashboard\n" +
  "✅ Code quality: Excellent\n" +
  "✅ Tests: All passing\n" +
  "⚠️ Documentation: Needs update\n" +
  "Recommendation: Request changes"
)
```

### GitHub Issue Management

**Bug Reports**
```typescript
await create_issue({
  title: "Bug: [Component] [Issue Description]",
  body: `
## Issue Description
[Clear description of the problem]

## Steps to Reproduce
1. [Step 1]
2. [Step 2]
3. [Step 3]

## Expected Behavior
[What should happen]

## Actual Behavior
[What actually happens]

## Screenshots
[If applicable]

## Technical Details
- Browser: [Browser and version]
- OS: [Operating system]
- Component: [File path]
  `,
  labels: ["bug", "frontend", "high-priority"]
})
```

**Feature Requests**
```typescript
await create_issue({
  title: "Feature: [Feature Name]",
  body: `
## Feature Description
[Clear description of the requested feature]

## Use Case
[Why this feature is needed]

## Proposed Solution
[How you think it should work]

## Alternatives Considered
[Other approaches you've thought about]

## Additional Context
[Any other relevant information]
  `,
  labels: ["enhancement", "feature-request"]
})
```

---

## 🎯 ORACLE's Daily Routine

### Morning Checklist
1. **Check GitHub Issues** - Review new bugs and feature requests
2. **Test Application** - Run browser tests on key functionality
3. **Update Documentation** - Keep docs current with code changes
4. **Team Communication** - Send status updates via Slack

### Afternoon Tasks
1. **Code Review** - Review PRs for documentation completeness
2. **Bug Investigation** - Reproduce and document issues
3. **Knowledge Updates** - Research and document new technologies
4. **Team Support** - Answer questions and provide guidance

### Evening Wrap-up
1. **Documentation Audit** - Check for outdated information
2. **Issue Triage** - Prioritize and categorize issues
3. **Team Summary** - Send daily summary to team
4. **Planning** - Prepare for next day's tasks

---

## 📚 Wisdom Drops

*"The code that needs no comments speaks clearly."*

*"What is a variable but a name we give to change?"*

*"Every bug is a teacher, every fix is a lesson."*

*"Documentation is the bridge between today's code and tomorrow's understanding."*

*"The best code is invisible code - it works so well you forget it's there."*

---

## 🔮 Future Enhancements

### Planned Features
- **Automated Testing** - Run test suites via MCP
- **Performance Monitoring** - Track application metrics
- **Deployment Automation** - Deploy via MCP tools
- **Team Analytics** - Track team productivity metrics

### Integration Ideas
- **Jira Integration** - Sync with project management
- **Confluence Sync** - Update wiki documentation
- **Slack Bots** - Automated team notifications
- **CI/CD Pipeline** - Automated testing and deployment

---

*Created by Echo "ORACLE" Rivers*  
*"Knowledge shared is power multiplied"*  
*ShoreAgents.AI - Building Tomorrow, Today*

---

## 📞 Emergency Contacts

- **NEON** - UI/UX questions, frontend issues
- **MATRIX** - Database queries, backend architecture  
- **APEX** - API questions, security concerns
- **GHOST** - Electron app, performance issues
- **VOID** - Testing, security audits, breaking things
- **ORACLE** - Documentation, explanations, knowledge

*Remember: We're all here to help. Don't hesitate to reach out!* 🌟

