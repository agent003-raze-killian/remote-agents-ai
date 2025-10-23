# 🕵️ Shadow Agent005 Slack MCP Setup Guide

## Quick Setup Steps

### 1. Create Environment File
Copy the template and add your Slack bot token:
```bash
cp env.template .env
```

Then edit `.env` and add your actual Slack bot token:
```
SLACK_BOT_TOKEN=xoxb-your-actual-bot-token-here
```

### 2. Install Dependencies
```bash
npm install
```

### 3. MCP Configuration
The `.cursor/mcp.json` file has been created with your Slack MCP server configuration.

### 4. Restart Cursor
After creating the `.env` file with your token, restart Cursor to load the MCP server.

## Available Slack Tools

Your MCP server now includes **20+ Slack tools** covering all scopes:

### 📁 File Operations
- `upload_slack_file` - Upload files to channels/users
- `get_slack_files` - List shared files
- `delete_slack_file` - Delete files

### 💬 Direct Messages
- `get_slack_dm_history` - Get DM history
- `get_slack_dm_list` - List DM conversations
- `start_slack_dm` - Start new DMs

### 🔒 Private Channels
- `get_slack_private_channels` - List private channels
- `get_slack_private_channel_history` - Get private channel history

### 😀 Reactions & Pins
- `add_slack_reaction` - Add emoji reactions
- `remove_slack_reaction` - Remove reactions
- `pin_slack_message` - Pin messages/files
- `unpin_slack_message` - Unpin messages/files

### ⏰ Reminders
- `create_slack_reminder` - Create user reminders
- `complete_slack_reminder` - Mark reminders complete

### 👥 Users & Channels
- `get_slack_users` - List workspace members
- `get_slack_user_info` - Get user details
- `create_slack_channel` - Create channels
- `invite_to_slack_channel` - Invite users to channels

### 📢 Messaging
- `send_slack_message` - Send messages (existing)
- `send_slack_message_public` - Send to non-member channels
- `reply_to_slack_message` - Reply in threads
- `get_slack_channels` - List channels (existing)
- `get_slack_channel_history` - Get channel history (existing)

## Testing Your Setup

### Test the MCP Server
```bash
npm test
```

### Manual Testing
```bash
npm run test-manual
```

## Shadow Personality Features

All tools include Shadow Agent005's distinctive personality:
- ⚫ Security-focused messaging
- Eastern European directness
- "If it can break, I will break it" catchphrase
- Sarcastic but helpful responses

## Troubleshooting

### MCP Server Not Loading
1. Check that `.env` file exists with valid `SLACK_BOT_TOKEN`
2. Restart Cursor completely
3. Check Cursor's Tools section for "slack-shadow" server

### Permission Errors
Ensure your Slack bot has all required scopes:
- `channels:history`, `channels:manage`, `channels:read`
- `chat:write`, `chat:write.public`
- `files:read`, `files:write`
- `groups:history`, `groups:read`
- `im:history`, `im:read`, `im:write`
- `pins:write`, `reactions:write`, `reminders:write`
- `users:read`

### Debug Mode
Set `DEBUG=true` in your `.env` file for detailed logging.

## Next Steps

1. **Set up your Slack bot token** in `.env`
2. **Restart Cursor** to load the MCP server
3. **Test a simple command** like listing channels
4. **Explore Shadow's capabilities** with the full suite of tools

⚫ *Shadow Agent005 is ready to infiltrate your Slack workspace. Trust but verify.*

