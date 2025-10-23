# ⚡ Slack MCP Quick Start

## What You Need (2 tokens):

1. **Slack Bot Token** (`xoxb-...`)
2. **Slack App Token** (`xapp-...`)

---

## Get Your Tokens (10 minutes):

### 1. Create Slack App
→ [api.slack.com/apps](https://api.slack.com/apps) → "Create New App" → "From scratch"

### 2. Get App Token (Socket Mode)
→ **Settings > Socket Mode** → Enable → Generate token (`connections:write`) → **Copy `xapp-...`**

### 3. Add Scopes
→ **OAuth & Permissions > Bot Token Scopes** → Add:
```
chat:write, chat:write.public, channels:history, channels:read,
groups:history, groups:read, im:history, im:read, im:write,
users:read, reactions:write, search:read
```

### 4. Get Bot Token
→ **OAuth & Permissions** → "Install to Workspace" → Allow → **Copy `xoxb-...`**

### 5. Enable Events
→ **Event Subscriptions** → Enable → Add bot events:
```
message.channels, message.groups, message.im
```

---

## Setup (3 minutes):

```bash
# Install
cd slack-mcp-server
npm install
npm run build

# Configure
# Create .env file:
echo 'SLACK_BOT_TOKEN=xoxb-YOUR-TOKEN-HERE' > .env
echo 'SLACK_APP_TOKEN=xapp-YOUR-TOKEN-HERE' >> .env

# Run
npm start
```

---

## Verify:

1. Invite bot to channel: `/invite @YourBot`
2. Send a message
3. See it logged in terminal ✅

---

## Use with Claude Desktop:

Edit `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "slack": {
      "command": "node",
      "args": ["C:\\Users\\Agent004-Kira\\Documents\\GitHub\\remote-agents-ai\\slack-mcp-server\\dist\\index.js"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token",
        "SLACK_APP_TOKEN": "xapp-your-token"
      }
    }
  }
}
```

Restart Claude Desktop.

---

## Available Tools:

- `send_slack_message` - Send messages
- `get_slack_messages` - Read history
- `list_slack_channels` - List channels
- `get_slack_user_info` - Get user info
- `search_slack_messages` - Search
- `add_slack_reaction` - Add reactions

---

## Need More Help?

- **Step-by-step:** `SETUP-GUIDE.md`
- **Full docs:** `README.md`
- **What to provide:** `../WHAT-YOU-NEED-TO-PROVIDE.md`

---

**Done! 🚀**

