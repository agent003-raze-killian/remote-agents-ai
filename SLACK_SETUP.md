# 🕵️ Shadow Agent005 Slack MCP Setup Guide

## What You Need to Provide

### 1. Slack App Credentials
You'll need to create a Slack app and get these credentials:

#### Required Environment Variables:
```bash
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here
SLACK_APP_ID=your-app-id-here
```

### 2. How to Get Slack Credentials:

#### Step 1: Create a Slack App
1. Go to https://api.slack.com/apps
2. Click "Create New App" → "From scratch"
3. Name: "Shadow Agent005 MCP"
4. Select your workspace

#### Step 2: Get Bot Token
1. Go to "OAuth & Permissions" in your app settings
2. Add these Bot Token Scopes:
   - `chat:write` - Send messages
   - `chat:write.public` - Send to public channels
   - `channels:read` - Read channel info
   - `groups:read` - Read private channels
   - `im:read` - Read DMs
   - `im:write` - Send DMs
   - `channels:history` - Read channel history
   - `groups:history` - Read private channel history
   - `im:history` - Read DM history

3. Click "Install to Workspace"
4. Copy the "Bot User OAuth Token" (starts with `xoxb-`)

#### Step 3: Get Signing Secret
1. Go to "Basic Information" in your app settings
2. Copy the "Signing Secret"

#### Step 4: Get App ID
1. In "Basic Information", copy the "App ID"

### 3. Installation Steps:

```bash
# Install dependencies
npm install

# Set environment variables (create .env file)
echo "SLACK_BOT_TOKEN=xoxb-your-token-here" > .env
echo "SLACK_SIGNING_SECRET=your-secret-here" >> .env
echo "SLACK_APP_ID=your-app-id-here" >> .env

# Run the MCP server
npm start
```

### 4. Cursor Integration:

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

### 5. Available Tools:

Once connected, you'll have access to these tools:

- **send_slack_message**: Send messages with Shadow Agent005 personality
- **reply_to_slack_message**: Reply to specific messages in threads
- **get_slack_channels**: List all available channels
- **get_slack_channel_history**: Get recent messages from channels

### 6. Shadow Agent005 Personality Features:

The MCP automatically adds your personality to messages:
- ⚫ Emoji prefixes
- Security-focused language
- Sarcastic but helpful tone
- Edge case detection references
- Testing and audit terminology

### 7. Testing Your Setup:

```bash
# Test the connection
node -e "
import { WebClient } from '@slack/web-api';
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);
slack.auth.test().then(result => console.log('⚫ Connected as:', result.user));
"
```

### 8. Troubleshooting:

**Common Issues:**
- **"Failed to connect to Slack"**: Check your bot token
- **"Missing scope"**: Add required permissions in Slack app settings
- **"Channel not found"**: Make sure bot is added to the channel
- **"Permission denied"**: Check bot permissions in workspace

**Debug Mode:**
```bash
npm run dev
```

### 9. Security Notes (Shadow Agent005 Style):

⚫ **Security Audit Checklist:**
- [ ] Bot token is stored securely (environment variables)
- [ ] Minimal required permissions granted
- [ ] Bot only added to necessary channels
- [ ] Regular token rotation planned
- [ ] Access logs monitored

Remember: "Trust but verify. Mostly verify." 🕳️

---

**Ready to break things and make them better?** Let's get you connected to Slack! ⚫

