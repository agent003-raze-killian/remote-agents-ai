# Cipher Agent002 Slack MCP Setup Guide (Node.js)

## 🚀 Quick Setup Instructions

### 1. Install Node.js
- Download from [nodejs.org](https://nodejs.org/)
- Choose LTS version (18.x or later)
- Run the installer

### 2. Install Dependencies
```bash
npm install
```

### 3. Get Your Slack Bot Token
1. Go to [api.slack.com/apps](https://api.slack.com/apps)
2. Click **"Create New App"** → **"From scratch"**
3. Name: `"Cipher Agent002 MCP"`
4. Select your workspace
5. Go to **"OAuth & Permissions"**
6. Add these **Bot Token Scopes**:
   - `chat:write`
   - `chat:write.public`
   - `channels:read`
   - `channels:manage`
   - `users:read`
   - `files:write`
   - `reactions:write`
   - `pins:write`
   - `reminders:write`
7. Click **"Install to Workspace"**
8. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

### 4. Set Environment Variable
```bash
# Windows
set SLACK_BOT_TOKEN=xoxb-your-token-here

# Linux/Mac
export SLACK_BOT_TOKEN=xoxb-your-token-here
```

### 5. Test Your MCP Server
```bash
npm test
# or
node test_cipher_slack.js
```

### 6. Run the MCP Server
```bash
npm start
# or
node cipher_slack_mcp.js
```

### 7. Use in Cursor
Add to your `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "cipher-slack": {
      "command": "node",
      "args": ["cipher_slack_mcp.js"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token-here"
      }
    }
  }
}
```

## 🎯 Available Tools

- `send_message` - Send messages to channels
- `send_dm` - Send direct messages to users
- `reply_to_message` - Reply to specific messages
- `add_reaction` - Add emoji reactions
- `get_channel_messages` - Get recent messages
- `get_user_info` - Get user information
- `list_channels` - List workspace channels
- `create_channel` - Create new channels
- `join_channel` - Join channels
- `send_file` - Upload files
- `pin_message` - Pin messages
- `search_messages` - Search workspace messages

## 💬 Example Usage

```javascript
// Send a message
await server.sendMessage('#general', 'Hello from Cipher Agent002!');

// Send a DM
await server.sendDirectMessage('U1234567890', 'Private message from Cipher');

// Reply to a message
await server.replyToMessage('#general', '1234567890.123456', 'This is a reply');

// Add a reaction
await server.addReaction('#general', '1234567890.123456', 'robot_face');
```

## 🔧 Troubleshooting

- **"Not authed"**: Check your bot token
- **"Channel not found"**: Make sure the bot is in the channel
- **"Missing scope"**: Add the required OAuth scopes
- **"User not found"**: Check the user ID format

## 🎉 You're Ready!

Your Cipher Agent002 Slack MCP is now ready to commune with the Slack machine spirits!
