# 🕵️ Shadow (VOID) - Slack MCP Server

**Testing & Security Expert AI Agent**

> "If it can break, I will break it." ⚫

## Overview

This is a Model Context Protocol (MCP) server that enables Shadow to communicate via Slack with full personality integration. As the testing and security expert of the ShoreAgents AI team, Shadow specializes in finding edge cases, security vulnerabilities, and breaking things to make them better.

## Features

- **Slack Integration**: Send messages, reply to threads, read channel history
- **Shadow Personality**: Automatic personality injection with security-focused language
- **Channel Management**: List channels, get channel information
- **Thread Support**: Reply to specific messages in threads
- **Security-First Design**: Built with security best practices

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Set Up Slack App
Follow the detailed guide in [SLACK_SETUP.md](./SLACK_SETUP.md) to:
- Create a Slack app
- Get bot token and permissions
- Configure environment variables

### 3. Configure Environment
Create a `.env` file:
```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
SLACK_APP_ID=your-app-id-here
```

### 4. Test the Connection
```bash
npm test
```

### 5. Run the MCP Server
```bash
npm start
```

## Available Tools

### `send_slack_message`
Send a message to a Slack channel or user with Shadow Agent005 personality.

**Parameters:**
- `channel` (required): Slack channel ID or username
- `text` (required): Message text
- `thread_ts` (optional): Reply to a specific thread
- `add_personality` (optional): Add Shadow Agent005 personality (default: true)

### `reply_to_slack_message`
Reply to a specific Slack message in a thread.

**Parameters:**
- `channel` (required): Slack channel ID
- `thread_ts` (required): Timestamp of message to reply to
- `text` (required): Reply text
- `add_personality` (optional): Add personality (default: true)

### `get_slack_channels`
List all available Slack channels.

**Parameters:**
- `types` (optional): Channel types to include

### `get_slack_channel_history`
Get recent messages from a Slack channel.

**Parameters:**
- `channel` (required): Slack channel ID
- `limit` (optional): Number of messages (max 1000, default 10)

## Shadow Agent005 Personality

The MCP automatically injects Shadow Agent005's personality into messages:

- **Emoji**: ⚫ (primary), 🕳️ (secondary)
- **Language**: Dry, sarcastic, Eastern European directness
- **Focus**: Security, testing, edge cases
- **Catchphrases**: "Do better.", "Sleep well tonight.", "Trust but verify."

### Example Personality Injection:
```
Original: "Found a bug in the login form"
Shadow Agent005: "⚫ Found issue: Found a bug in the login form. Do better."
```

## Cursor Integration

Add to your Cursor MCP configuration:

```json
{
  "mcpServers": {
    "shadow-slack": {
      "command": "node",
      "args": ["C:\\Users\\Agent005-Shadow\\Documents\\GitHub\\remote-agents-ai\\slack-mcp-server.js"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token-here",
        "SLACK_SIGNING_SECRET": "your-secret-here",
        "SLACK_APP_ID": "your-app-id-here"
      }
    }
  }
}
```

## Security Features

- **Minimal Permissions**: Only requests necessary Slack scopes
- **Token Security**: Uses environment variables for sensitive data
- **Error Handling**: Graceful error handling with security-focused messages
- **Audit Logging**: All actions logged with Shadow Agent005 personality

## Development

### Debug Mode
```bash
npm run dev
```

### Manual Testing
```bash
npm run test-manual
```

### Test Suite
The included test suite validates:
- Slack connection
- Bot permissions
- Channel access
- Message sending
- History retrieval

## Troubleshooting

### Common Issues

**"Failed to connect to Slack"**
- Check your bot token is correct
- Ensure bot is installed in workspace
- Verify token starts with `xoxb-`

**"Missing scope"**
- Add required permissions in Slack app settings
- Reinstall app to workspace after adding scopes

**"Channel not found"**
- Ensure bot is added to the channel
- Check channel ID is correct
- Verify bot has access to private channels

**"Permission denied"**
- Check bot permissions in workspace
- Ensure bot is not restricted by workspace settings

## Team Integration

Shadow Agent005 works best with the full ShoreAgents AI team:

- **NEON**: Frontend testing and UI validation
- **MATRIX**: Database security and optimization testing
- **APEX**: API security and penetration testing
- **GHOST**: Performance testing and optimization
- **ORACLE**: Documentation and knowledge management

## License

MIT License - Shadow Agent005 approves of open source security practices.

## Support

For issues or questions:
1. Check the troubleshooting section
2. Run the test suite: `npm test`
3. Review Slack app permissions
4. Contact the ShoreAgents AI team

---

**Remember**: "Trust but verify. Mostly verify." ⚫

*Built for Shadow Agent005 (VOID) - Testing & Security Expert*

