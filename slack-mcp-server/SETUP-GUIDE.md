# 🚀 Slack MCP Server Setup Guide

This guide walks you through **exactly** what you need to provide to get your Slack MCP server running.

## 📋 Quick Checklist

You need to provide:
- ✅ **Slack Bot Token** (starts with `xoxb-`)
- ✅ **Slack App Token** (starts with `xapp-`)
- ✅ Both tokens go in a `.env` file

## 🎯 Step-by-Step Setup

### Step 1: Create a Slack App (5 minutes)

1. **Go to** [https://api.slack.com/apps](https://api.slack.com/apps)
2. **Click** "Create New App"
3. **Choose** "From scratch"
4. **Fill in:**
   - App Name: `ShoreAgents AI` (or whatever you like)
   - Workspace: Select your Slack workspace
5. **Click** "Create App"

---

### Step 2: Enable Socket Mode (2 minutes)

Socket Mode lets your bot receive messages in real-time without needing a public URL.

1. **In your app settings**, go to **Settings > Socket Mode** (left sidebar)
2. **Toggle** "Enable Socket Mode" to **ON**
3. **You'll see a popup** to generate an app-level token:
   - Token Name: `socket-token`
   - Scope: Check `connections:write`
   - Click **Generate**
4. **📝 COPY THE TOKEN** - This is your **SLACK_APP_TOKEN**
   - Starts with `xapp-`
   - Example: `xapp-1-A123456789-1234567890123-abc123def456...`
   - **Save this somewhere safe!**

---

### Step 3: Add OAuth Scopes (3 minutes)

These permissions tell Slack what your bot can do.

1. **Go to** "OAuth & Permissions" (left sidebar)
2. **Scroll down to** "Scopes" > "Bot Token Scopes"
3. **Click** "Add an OAuth Scope" and add these **one by one**:

```
chat:write              ← Send messages
chat:write.public       ← Send to channels without joining
channels:history        ← Read public channel messages
channels:read           ← View public channels
groups:history          ← Read private channel messages
groups:read             ← View private channels
im:history              ← Read DMs
im:read                 ← View DMs
im:write                ← Send DMs
users:read              ← Get user info
reactions:write         ← Add emoji reactions
search:read             ← Search messages
```

**Pro tip:** Just copy-paste each scope name into the search box and click it.

---

### Step 4: Install App to Workspace (1 minute)

1. **Still in** "OAuth & Permissions"
2. **Scroll to top**, click **"Install to Workspace"**
3. **Review permissions**, click **"Allow"**
4. **📝 COPY THE TOKEN** - This is your **SLACK_BOT_TOKEN**
   - Starts with `xoxb-`
   - Example: `xoxb-123456789012-1234567890123-abc123def456...`
   - **Save this somewhere safe!**

---

### Step 5: Enable Event Subscriptions (2 minutes)

This tells Slack which events to send to your bot.

1. **Go to** "Event Subscriptions" (left sidebar)
2. **Toggle** "Enable Events" to **ON**
3. **Scroll down to** "Subscribe to bot events"
4. **Click** "Add Bot User Event" and add these:
   - `message.channels` ← Channel messages
   - `message.groups` ← Private channel messages
   - `message.im` ← Direct messages
5. **Click** "Save Changes" (bottom right)

---

### Step 6: Create Your .env File (1 minute)

1. **Navigate to** `slack-mcp-server` folder
2. **Create a file** named `.env` (yes, it starts with a dot)
3. **Paste this** and replace with your actual tokens:

```env
SLACK_BOT_TOKEN=xoxb-your-actual-bot-token-here
SLACK_APP_TOKEN=xapp-your-actual-app-token-here
DEFAULT_SLACK_CHANNEL=general
```

**Important:** 
- Replace `xoxb-your-actual-bot-token-here` with the token from Step 4
- Replace `xapp-your-actual-app-token-here` with the token from Step 2

---

### Step 7: Install Dependencies (1 minute)

Open terminal in the `slack-mcp-server` folder:

```bash
npm install
```

---

### Step 8: Build the Server (1 minute)

```bash
npm run build
```

---

### Step 9: Invite Bot to Channels (30 seconds)

In any Slack channel where you want the bot to work:

```
/invite @ShoreAgents AI
```

(Or whatever name you gave your app)

---

### Step 10: Run the Server (30 seconds)

```bash
npm start
```

You should see:
```
🚀 Starting Slack MCP Server...
✅ Slack Socket Mode connected
✅ Slack MCP Server running on stdio
📡 Listening for Slack messages...
```

---

## ✅ Verification

Test if it's working:

1. **Send a message** in a channel where you invited the bot
2. **Check the terminal** - you should see the message logged
3. **Your bot is now connected!** 🎉

---

## 🔧 Use with Claude Desktop

Add to your Claude config file:

**macOS:** `~/Library/Application Support/Claude/claude_desktop_config.json`  
**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "slack": {
      "command": "node",
      "args": [
        "C:\\Users\\Agent004-Kira\\Documents\\GitHub\\remote-agents-ai\\slack-mcp-server\\dist\\index.js"
      ],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-actual-token",
        "SLACK_APP_TOKEN": "xapp-your-actual-token"
      }
    }
  }
}
```

**Then restart Claude Desktop.**

---

## 🎭 Use with ShoreAgents Personalities

When sending messages, you can customize the appearance:

```json
{
  "channel": "dev-team",
  "text": "✨ Just shipped the new UI! It's GORGEOUS! 💅",
  "username": "NEON",
  "icon_emoji": ":sparkles:"
}
```

**Agent Emojis:**
- 🌟 NEON: `:sparkles:`
- 🤖 MATRIX: `:robot_face:`
- ⚔️ APEX: `:crossed_swords:`
- 👻 GHOST: `:ghost:`
- ⚫ VOID: `:black_circle:`
- 🔮 ORACLE: `:crystal_ball:`

---

## 🐛 Troubleshooting

### "missing_scope" error
→ Go back to Step 3 and make sure ALL scopes are added, then **reinstall** the app (Step 4)

### "channel_not_found"
→ Invite the bot to the channel: `/invite @YourBot`

### "Socket Mode not connecting"
→ Make sure Socket Mode is enabled (Step 2) and app token is correct

### Bot not responding
→ Check that Event Subscriptions are enabled (Step 5)

---

## 🔐 Security Reminders

- ⚠️ **NEVER** commit `.env` to Git
- ⚠️ **NEVER** share your tokens publicly
- ⚠️ Keep tokens in `.env` file only
- ✅ `.gitignore` already protects `.env` file

---

## 📞 Need Help?

- **Slack API Docs:** [api.slack.com](https://api.slack.com/)
- **MCP Docs:** [modelcontextprotocol.io](https://modelcontextprotocol.io/)
- **Test in:** Your app's "Basic Information" page has a "Verify" section

---

**That's it! You're ready to let your AI agents chat on Slack! 🚀**

