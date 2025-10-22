# 📡 Slack MCP Server

A Model Context Protocol (MCP) server that enables AI agents to interact with Slack - send messages, read conversations, react to messages, and more.

## ✨ Features

- 💬 **Send Messages**: Post messages to channels, DMs, or as thread replies
- 📖 **Read Messages**: Retrieve conversation history from channels
- 📝 **List Channels**: Get all accessible channels
- 👤 **User Info**: Fetch user details and profiles
- 🔍 **Search**: Search messages across workspace
- 😊 **Reactions**: Add emoji reactions to messages
- 🔌 **Real-time Events**: Socket Mode for receiving messages in real-time

## 🛠️ What You Need to Provide

### 1. Create a Slack App

Go to [https://api.slack.com/apps](https://api.slack.com/apps) and create a new app.

**Choose "From scratch":**
- App Name: `ShoreAgents AI` (or your preferred name)
- Workspace: Select your workspace

### 2. Enable Socket Mode

1. Go to **Settings > Socket Mode**
2. Toggle **Enable Socket Mode** to ON
3. You'll be prompted to generate an **App-Level Token**
   - Token Name: `socket-token`
   - Scope: `connections:write`
   - Click **Generate**
   - **Copy this token** - this is your `SLACK_APP_TOKEN` (starts with `xapp-`)

### 3. Configure Bot Token Scopes

Go to **OAuth & Permissions > Scopes > Bot Token Scopes** and add these scopes:

**Required Scopes:**
- `chat:write` - Send messages
- `chat:write.public` - Send messages to channels without joining
- `channels:history` - Read messages in public channels
- `channels:read` - View basic channel info
- `groups:history` - Read messages in private channels
- `groups:read` - View basic private channel info
- `im:history` - Read direct messages
- `im:read` - View DM info
- `im:write` - Send direct messages
- `users:read` - View user info
- `reactions:write` - Add reactions
- `search:read` - Search messages

### 4. Install App to Workspace

1. Go to **OAuth & Permissions**
2. Click **Install to Workspace**
3. Review permissions and click **Allow**
4. **Copy the Bot User OAuth Token** - this is your `SLACK_BOT_TOKEN` (starts with `xoxb-`)

### 5. Enable Event Subscriptions (for Socket Mode)

1. Go to **Event Subscriptions**
2. Toggle **Enable Events** to ON
3. Under **Subscribe to bot events**, add:
   - `message.channels` - Listen to channel messages
   - `message.groups` - Listen to private channel messages
   - `message.im` - Listen to direct messages
4. Click **Save Changes**

### 6. Add to Channels

Invite your bot to channels where you want it to interact:
```
/invite @ShoreAgents AI
```

## 📦 Installation

```bash
cd slack-mcp-server
npm install
npm run build
```

## ⚙️ Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Edit `.env` and add your tokens:
```env
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_APP_TOKEN=xapp-your-app-token-here
DEFAULT_SLACK_CHANNEL=general
```

## 🚀 Usage

### Run Standalone
```bash
npm start
```

### Use with Claude Desktop

Add to your Claude Desktop config (`~/Library/Application Support/Claude/claude_desktop_config.json` on macOS or `%APPDATA%\Claude\claude_desktop_config.json` on Windows):

```json
{
  "mcpServers": {
    "slack": {
      "command": "node",
      "args": [
        "C:\\Users\\Agent004-Kira\\Documents\\GitHub\\remote-agents-ai\\slack-mcp-server\\dist\\index.js"
      ],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-bot-token",
        "SLACK_APP_TOKEN": "xapp-your-app-token"
      }
    }
  }
}
```

### Use with Cline or other MCP clients

The server runs on stdio and follows the MCP protocol, so it's compatible with any MCP client.

## 🔧 Available Tools

### `send_slack_message`
Send a message to a Slack channel or user.

```json
{
  "channel": "general",
  "text": "Hello from AI! 👋",
  "thread_ts": "1234567890.123456",  // Optional: reply to thread
  "username": "NEON",                 // Optional: custom username
  "icon_emoji": ":sparkles:"          // Optional: custom emoji
}
```

### `get_slack_messages`
Retrieve recent messages from a channel.

```json
{
  "channel": "general",
  "limit": 20,                        // Optional: default 10, max 100
  "oldest": "1234567890.123456"       // Optional: Unix timestamp
}
```

### `list_slack_channels`
List all public channels.

```json
{
  "exclude_archived": true            // Optional: default true
}
```

### `get_slack_user_info`
Get information about a user.

```json
{
  "user_id": "U01234567"
}
```

### `search_slack_messages`
Search for messages.

```json
{
  "query": "bug fix",
  "count": 20                         // Optional: default 20
}
```

### `add_slack_reaction`
Add an emoji reaction to a message.

```json
{
  "channel": "C01234567",
  "timestamp": "1234567890.123456",
  "emoji": "thumbsup"                 // Without colons
}
```

## 🎭 Agent Personalities

This MCP server is designed to work with the ShoreAgents AI team. You can customize the `username` and `icon_emoji` parameters to match agent personalities:

- **NEON** (`@AGENT-001`): `icon_emoji: ":sparkles:"` - Frontend queen
- **MATRIX** (`@AGENT-002`): `icon_emoji: ":robot_face:"` - Database philosopher  
- **APEX** (`@AGENT-003`): `icon_emoji: ":crossed_swords:"` - Security fortress
- **GHOST** (`@AGENT-004`): `icon_emoji: ":ghost:"` - Performance whisper
- **VOID** (`@AGENT-005`): `icon_emoji: ":black_circle:"` - Bug annihilator
- **ORACLE** (`@AGENT-006`): `icon_emoji: ":crystal_ball:"` - Documentation sage

## 🔒 Security Notes

- **Never commit `.env` file** to version control
- Store tokens securely (use environment variables or secrets manager)
- Use Socket Mode instead of webhooks for better security
- Review and minimize OAuth scopes based on your needs
- Regularly rotate tokens

## 📝 Example Usage

```javascript
// Send a message as NEON
{
  "tool": "send_slack_message",
  "arguments": {
    "channel": "dev-team",
    "text": "✨ OMG just deployed the new UI and it's GORGEOUS! 💅",
    "username": "NEON",
    "icon_emoji": ":sparkles:"
  }
}

// Read recent messages
{
  "tool": "get_slack_messages",
  "arguments": {
    "channel": "dev-team",
    "limit": 10
  }
}

// Add reaction
{
  "tool": "add_slack_reaction",
  "arguments": {
    "channel": "C01234567",
    "timestamp": "1234567890.123456",
    "emoji": "fire"
  }
}
```

## 🐛 Troubleshooting

### "missing_scope" error
- Check that all required OAuth scopes are added
- Reinstall the app to workspace after adding scopes

### "channel_not_found" error
- Ensure the bot is invited to the channel: `/invite @YourBot`
- Use channel ID instead of name for private channels

### Socket Mode not connecting
- Verify `SLACK_APP_TOKEN` starts with `xapp-`
- Check that Socket Mode is enabled in app settings
- Ensure `connections:write` scope is granted to app-level token

### Bot messages not sending
- Verify `SLACK_BOT_TOKEN` starts with `xoxb-`
- Check that bot has `chat:write` scope
- Ensure bot is member of the channel (use `chat:write.public` to skip this)

## 📚 Resources

- [Slack API Documentation](https://api.slack.com/)
- [MCP Documentation](https://modelcontextprotocol.io/)
- [Socket Mode Guide](https://api.slack.com/apis/connections/socket)

## 📄 License

MIT

---

**Built with ⚡ by ShoreAgents AI**  
*Making AI agents work in your workspace*

