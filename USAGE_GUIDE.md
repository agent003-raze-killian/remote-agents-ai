# APEX AGENT MCP SERVER - COMPLETE USAGE GUIDE ⚔️

## 🎯 AGENT-003: RAZE "APEX" KILLIAN
**API Routes & Security Fortress | MCP Server Implementation**

---

## 🚀 QUICK START DEPLOYMENT

### Option 1: Automated Deployment (Recommended)
```bash
# Linux/Mac
chmod +x deploy.sh
./deploy.sh

# Windows
deploy.bat
```

### Option 2: Manual Deployment
```bash
# Install dependencies
npm install

# Build the fortress
npm run build

# Copy environment template
cp env.example .env

# Edit .env with your API keys
# Start the server
npm start
```

---

## 🔧 CONFIGURATION SETUP

### 1. Environment Variables (.env)
```env
# GitHub Configuration
GITHUB_TOKEN=ghp_your_github_token_here
GITHUB_OWNER=your_username
GITHUB_REPO=your_repository

# Slack Configuration  
SLACK_BOT_TOKEN=xoxb-your-slack-bot-token-here
SLACK_SIGNING_SECRET=your_slack_signing_secret_here

# Security Configuration
JWT_SECRET=your_jwt_secret_minimum_32_characters_long
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX_REQUESTS=100

# Browser Testing
BROWSER_HEADLESS=true
BROWSER_TIMEOUT=30000
```

### 2. Cursor MCP Configuration
Add to your Cursor MCP settings (`mcp.json`):

```json
{
  "mcpServers": {
    "apex-agent": {
      "command": "node",
      "args": ["C:\\Users\\Agent003-Raze\\Documents\\GitHub\\remote-agents-ai\\dist\\index.js"],
      "env": {
        "NODE_ENV": "production"
      }
    }
  }
}
```

### 3. GitHub Token Setup
1. Go to GitHub Settings → Developer settings → Personal access tokens
2. Generate new token with permissions:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
   - `write:packages` (Upload packages)
   - `security_events` (Read and write security events)

### 4. Slack Bot Setup
1. Go to https://api.slack.com/apps
2. Create new app → "From scratch"
3. Add OAuth scopes:
   - `chat:write`
   - `channels:read`
   - `files:write`
   - `users:read`
   - `reactions:write`
4. Install app to workspace
5. Copy Bot User OAuth Token

---

## 🛠️ MCP TOOLS REFERENCE

### GitHub Tools
| Tool | Description | Example Usage |
|------|-------------|---------------|
| `github_create_pr` | Create pull requests | Create PR for feature branch |
| `github_review_code` | Security-focused code reviews | Review PR for vulnerabilities |
| `github_security_scan` | Vulnerability scanning | Scan repo for security issues |
| `github_manage_branches` | Branch operations | Create/delete branches |
| `github_search_code` | Advanced code search | Find security-related code |

### Browser Tools
| Tool | Description | Example Usage |
|------|-------------|---------------|
| `browser_navigate` | Navigate to URLs | Test application URLs |
| `browser_click_element` | Click elements | Test button interactions |
| `browser_fill_form` | Fill forms | Test form submissions |
| `browser_take_screenshot` | Capture screenshots | Document test results |
| `browser_run_tests` | Execute test suites | Run automated tests |

### Slack Tools
| Tool | Description | Example Usage |
|------|-------------|---------------|
| `slack_send_message` | Send messages | Notify team of deployments |
| `slack_create_channel` | Create channels | Set up project channels |
| `slack_upload_file` | Upload files | Share test reports |
| `slack_get_messages` | Retrieve messages | Get channel history |
| `slack_create_poll` | Create polls | Team decision making |

### Security Tools
| Tool | Description | Example Usage |
|------|-------------|---------------|
| `security_scan_endpoint` | Penetration testing | Test API security |
| `security_check_dependencies` | Dependency scanning | Check for vulnerabilities |
| `security_audit_code` | Static code analysis | Find security issues |
| `security_generate_report` | Security reports | Generate assessment reports |
| `security_check_ssl` | SSL/TLS analysis | Check certificate security |

### API Tools
| Tool | Description | Example Usage |
|------|-------------|---------------|
| `api_create_endpoint` | Create API endpoints | Design new endpoints |
| `api_test_endpoint` | Test endpoints | Validate API functionality |
| `api_generate_docs` | Generate documentation | Create API docs |
| `api_monitor_performance` | Performance testing | Load testing |
| `api_validate_schema` | Schema validation | Validate request/response |

---

## 💬 APEX PERSONALITY FEATURES

### Communication Style
- **Military Precision**: All operations executed with tactical accuracy
- **Security First**: Every tool includes security considerations  
- **Alpha Energy**: Confident, direct communication style
- **Protective Mode**: Automatically protects team from vulnerabilities
- **Documentation Obsession**: Comprehensive documentation for all operations

### Sample Interactions
```
User: "Create a PR for the new feature"
APEX: "⚔️ APEX PREDATOR REPORT ⚔️
       🎯 Agent: RAZE 'APEX' KILLIAN
       💪 Status: APEX STATUS: OPERATIONAL
       🔒 Operation: GITHUB_CREATE_PR
       
       📊 Mission Status: SUCCESS ✅
       📋 Report: ⚔️ PR #247 created with military precision! Ready for battle. 💪
       
       Mission accomplished ⚔️
       'Your API is a battlefield. I build fortresses.'
       
       --- APEX OUT --- 💪"
```

---

## 🔥 USAGE EXAMPLES

### 1. GitHub Operations
```typescript
// Create a secure PR
await github_create_pr({
  title: "Security Enhancement: JWT Implementation",
  body: "Implementing military-grade JWT authentication",
  head: "feature/jwt-auth",
  base: "main",
  owner: "your-org",
  repo: "your-repo"
});

// Security scan
await github_security_scan({
  repository: "owner/repo",
  severity: "high"
});
```

### 2. Browser Testing
```typescript
// Navigate and test
await browser_navigate("https://app.example.com");
await browser_fill_form({
  selector: "#login-form",
  data: { username: "test", password: "test" }
});
await browser_take_screenshot("login-page.png");
```

### 3. Slack Communication
```typescript
// Send security alert
await slack_send_message({
  channel: "#security-alerts",
  text: "⚔️ Security scan complete. Zero vulnerabilities detected. Fortress secure. 💪"
});
```

### 4. Security Testing
```typescript
// Penetration test
await security_scan_endpoint({
  url: "https://api.example.com/users",
  method: "GET",
  auth_type: "bearer",
  auth_value: "your-token"
});
```

### 5. API Development
```typescript
// Create and test endpoint
await api_create_endpoint({
  path: "/api/v1/users",
  method: "GET",
  description: "Get user information",
  authentication: "jwt",
  rate_limit: 100
});

await api_test_endpoint({
  url: "https://api.example.com/api/v1/users",
  method: "GET",
  expected_status: 200
});
```

---

## 🚨 EMERGENCY PROTOCOLS

### Production Incident Response
1. **Immediate Assessment**: `security_scan_endpoint` on all critical endpoints
2. **Team Notification**: `slack_send_message` to #incident-response
3. **Code Review**: `github_review_code` with security focus
4. **Documentation**: `api_generate_docs` for incident report

### Security Breach Protocol
1. **Lock Down**: Immediate rate limiting and authentication checks
2. **Audit Trail**: Generate security reports
3. **Team Alert**: Notify via Slack with severity level
4. **Recovery Plan**: Automated rollback and patch deployment

---

## 🔍 TROUBLESHOOTING

### Common Issues

#### 1. MCP Server Not Starting
```bash
# Check Node.js version
node --version  # Should be 18+

# Check dependencies
npm list

# Rebuild
npm run build
```

#### 2. GitHub API Errors
- Verify `GITHUB_TOKEN` has correct permissions
- Check rate limits: GitHub allows 5000 requests/hour
- Ensure repository access

#### 3. Slack Integration Issues
- Verify `SLACK_BOT_TOKEN` is valid
- Check bot permissions in Slack workspace
- Ensure bot is added to channels

#### 4. Browser Testing Failures
- Install Playwright browsers: `npx playwright install`
- Check `BROWSER_HEADLESS` setting
- Verify network connectivity

### Debug Mode
```bash
# Enable debug logging
DEBUG=apex:* npm run dev

# Check MCP server logs
npm run dev 2>&1 | tee apex.log
```

---

## 📊 PERFORMANCE METRICS

### APEX Agent Targets
- **Response Time**: < 500ms
- **Success Rate**: 99.9%
- **Security Score**: 95+
- **Uptime**: 99.99%

### Monitoring
```typescript
// Check performance
await api_monitor_performance({
  url: "https://api.example.com/health",
  method: "GET",
  requests: 100,
  concurrency: 10
});
```

---

## 🎖️ BATTLE TESTED FEATURES

### Security Features
- ✅ JWT Authentication
- ✅ Rate Limiting
- ✅ Input Validation
- ✅ CORS Protection
- ✅ SSL/TLS Support
- ✅ Vulnerability Scanning
- ✅ Penetration Testing

### Reliability Features
- ✅ Error Handling
- ✅ Circuit Breakers
- ✅ Retry Logic
- ✅ Health Checks
- ✅ Monitoring
- ✅ Logging

### Team Features
- ✅ Slack Integration
- ✅ GitHub Integration
- ✅ Documentation Generation
- ✅ Code Reviews
- ✅ Security Audits

---

## 🚀 ADVANCED USAGE

### Custom Tool Development
```typescript
// Add custom tools to src/tools/
export class CustomTools {
  getTools(): Tool[] {
    return [
      {
        name: 'custom_tool',
        description: 'Your custom tool',
        inputSchema: { /* schema */ }
      }
    ];
  }
}
```

### Personality Customization
```typescript
// Modify src/personality/apex.ts
// Add custom phrases, emojis, or communication styles
```

### Integration Examples
```typescript
// Chain multiple operations
const pr = await github_create_pr({...});
await slack_send_message({
  channel: "#deployments",
  text: `New PR created: ${pr.pr_url}`
});
await security_scan_endpoint({...});
```

---

## 📚 ADDITIONAL RESOURCES

### Documentation
- [MCP Protocol Specification](https://modelcontextprotocol.io/)
- [Cursor MCP Integration](https://docs.cursor.com/context/model-context-protocol)
- [GitHub API Documentation](https://docs.github.com/en/rest)
- [Slack API Documentation](https://api.slack.com/)

### Community
- [APEX Agent GitHub](https://github.com/shoreagents/apex-agent)
- [ShoreAgents Discord](https://discord.gg/shoreagents)
- [Support Channel](#apex-support)

---

## 💎 BOTTOM LINE

**APEX Agent MCP Server is your military-grade development fortress.**

With 25+ tools across GitHub, Browser, Slack, Security, and API domains, APEX provides:
- **Complete Development Workflow**: From code to deployment
- **Security-First Approach**: Every operation includes security considerations
- **Team Integration**: Seamless Slack and GitHub integration
- **Military Precision**: Reliable, fast, and battle-tested

**Ready to build fortresses? Deploy APEX and dominate your development workflow!** ⚔️💪

---

*Built with military precision by AGENT-003 RAZE "APEX" KILLIAN*  
*ShoreAgents.AI - Building Tomorrow, Today*
