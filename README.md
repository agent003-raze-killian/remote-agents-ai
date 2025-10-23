# Slack MCP Server

A Model Context Protocol (MCP) server that provides access to Slack conversations, channels, and messaging functionality.

## Features

- **Get Slack Channels**: List all accessible channels (public, private, DMs)
- **Read Messages**: Retrieve messages from any channel with filtering options
- **Send Messages**: Post messages to channels or reply in threads
- **User Information**: Get details about Slack users
- **Search Messages**: Search across all accessible channels

## Prerequisites

- Node.js 18.0.0 or higher
- A Slack workspace where you have permission to create apps
- Admin access to install Slack apps (or ability to request installation)

## Setup Instructions

### 1. Create a Slack App

1. Go to [https://api.slack.com/apps](https://api.slack.com/apps)
2. Click "Create New App" → "From scratch"
3. Enter app name (e.g., "Echo's MCP Server")
4. Select your workspace
5. Click "Create App"

### 2. Configure App Permissions

#### Bot Token Scopes (OAuth & Permissions)
Navigate to "OAuth & Permissions" and add these scopes:

**Required Scopes:**
- `channels:history` - Read messages from public channels
- `channels:read` - View basic information about public channels
- `chat:write` - Send messages as the bot
- `groups:history` - Read messages from private channels
- `groups:read` - View basic information about private channels
- `im:history` - Read messages from direct messages
- `im:read` - View basic information about direct messages
- `mpim:history` - Read messages from group direct messages
- `mpim:read` - View basic information about group direct messages
- `search:read` - Search messages and files
- `users:read` - View people in the workspace
- `users:read.email` - View email addresses of people

#### App-Level Token Scopes (Basic Information)
1. Go to "Basic Information" → "App-Level Tokens"
2. Click "Generate Token and Scopes"
3. Add scope: `connections:write`

### 3. Install the App

1. Go to "Install App" in the sidebar
2. Click "Install to Workspace"
3. Authorize the app
4. Copy the **Bot User OAuth Token** (starts with `xoxb-`)
5. Copy the **App-Level Token** (starts with `xapp-`)

### 4. Environment Configuration

1. Copy `env.example` to `.env`:
   ```bash
   cp env.example .env
   ```

2. Edit `.env` with your tokens:
   ```env
   SLACK_BOT_TOKEN=xoxb-your-actual-bot-token-here
   SLACK_APP_TOKEN=xapp-your-actual-app-token-here
   DEFAULT_CHANNEL=general
   DEFAULT_MESSAGE_LIMIT=50
   ```

### 5. Install Dependencies

```bash
npm install
```

### 6. Test the Server

```bash
npm start
```

## Usage

### Available Tools

#### 1. `get_slack_channels`
Get list of Slack channels
```json
{
  "types": "public_channel,private_channel",
  "exclude_archived": true
}
```

#### 2. `get_slack_messages`
Get messages from a channel
```json
{
  "channel": "#general",
  "limit": 50,
  "oldest": "1640995200",
  "latest": "1641081600"
}
```

#### 3. `send_slack_message`
Send a message to a channel
```json
{
  "channel": "#general",
  "text": "Hello from MCP!",
  "thread_ts": "1640995200.123456"
}
```

#### 4. `get_slack_user_info`
Get information about a user
```json
{
  "user": "@username"
}
```

#### 5. `search_slack_messages`
Search for messages
```json
{
  "query": "important meeting",
  "count": 20,
  "sort": "score"
}
```

## Channel References

You can reference channels in multiple ways:
- Channel name: `#general`
- Channel ID: `C1234567890`
- Direct message: `@username`
- User ID: `U1234567890`

## Troubleshooting

### Common Issues

1. **"Missing scope" errors**: Ensure all required scopes are added to your Slack app
2. **"Channel not found"**: The bot must be a member of private channels to access them
3. **"User not found"**: Check if the user exists and the bot has permission to view user information
4. **Rate limiting**: Slack has API rate limits; the server will handle retries automatically

### Debug Mode

Run with debug logging:
```bash
DEBUG=slack* npm start
```

## Security Notes

- Keep your tokens secure and never commit them to version control
- The `.env` file is already in `.gitignore`
- Consider using environment-specific tokens for different deployments
- Regularly rotate your tokens for security

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details












