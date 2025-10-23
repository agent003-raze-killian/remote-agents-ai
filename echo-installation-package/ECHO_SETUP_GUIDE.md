# 🚀 Echo Agent Setup Guide

Complete guide to install and run Echo Agent on a new computer.

## 📋 Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **Git** - [Download here](https://git-scm.com/)
- **Slack Bot Token** and **Claude API Key**

## 📦 Required Files

You need these files from the repository:

### Core Files:
```
echo-claude-bot.js          # Main bot script
lib/
  └── echo-intelligence.js  # Echo's AI brain
package.json                # Dependencies
package-lock.json           # Dependency lock file
.env.example               # Environment template
```

### Optional (for other bot variants):
```
echo-webhook-server.js      # Webhook-based bot
lib/
  ├── nova-intelligence.js
  ├── agent-manager.js
  └── slack-handler.js
```

## 🛠️ Setup Steps

### 1. Clone or Copy Files

**Option A: Clone from Git**
```bash
git clone <repository-url>
cd remote-agents-ai
```

**Option B: Copy Files Manually**
Copy the required files listed above to a new folder.

### 2. Install Dependencies

```bash
npm install
```

This installs:
- `@slack/web-api` - Slack API client
- `@anthropic-ai/sdk` - Claude AI integration
- `dotenv` - Environment variable management
- `express` - Web server (for webhook variant)

### 3. Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Copy from example
copy .env.example .env

# OR create new file
type nul > .env
```

Edit `.env` with your credentials:

```env
# ================================
# SLACK CONFIGURATION
# ================================
SLACK_BOT_TOKEN=xoxb-YOUR-BOT-TOKEN-HERE
SLACK_USER_TOKEN=xoxp-YOUR-USER-TOKEN-HERE
SLACK_BOT_USERNAME=Echo Agent006
SLACK_BOT_ICON=:zap:

# ================================
# CLAUDE AI CONFIGURATION
# ================================
CLAUDE_API_KEY=sk-ant-api03-YOUR-CLAUDE-KEY-HERE
CLAUDE_MODEL=claude-sonnet-4-20250514

# ================================
# ECHO CONFIGURATION
# ================================
ECHO_BOT_USER_ID=U09NN89D6KA
ECHO_CHANNEL_ID=C09MFH9JTK5
POLL_INTERVAL=3000
```

### 4. Get Required API Keys

#### **Slack Bot Token:**
1. Go to https://api.slack.com/apps
2. Select your app or create new one
3. Go to **OAuth & Permissions**
4. Copy the **Bot User OAuth Token** (starts with `xoxb-`)

**Required Bot Scopes:**
- `channels:history` - Read channel messages
- `channels:read` - View channel info
- `chat:write` - Send messages
- `users:read` - Read user info

#### **Claude API Key:**
1. Go to https://console.anthropic.com/
2. Navigate to **API Keys**
3. Create new key or copy existing
4. Paste into `.env` (starts with `sk-ant-api03-`)

#### **Bot User ID (Optional):**
The bot will auto-detect this on startup, but you can set it manually:
```bash
# Run this to find Echo's user ID
node -e "require('@slack/web-api').WebClient(process.env.SLACK_BOT_TOKEN).auth.test().then(r => console.log(r.user_id))"
```

### 5. Run Echo

**Start Echo:**
```bash
npm run echo-claude
```

**Or run directly:**
```bash
node echo-claude-bot.js
```

**Expected Output:**
```
⚡ Echo Agent with Claude AI starting...
🤖 Bot User ID: U09NN89D6KA
📢 Monitoring channel: C09MFH9JTK5
🧠 Using Claude AI: claude-sonnet-4-20250514
🔄 Polling every 3000ms
🚀 Starting to monitor for mentions...
📋 Checked 10 messages (0 new) - Found 0 mentions
```

## 🧪 Test Echo

Send a message in your Slack channel:
```
@Echo hello!
```

Echo should respond with:
```
🚀 Yo! What's up? ⚡
```

## 🔧 Troubleshooting

### Issue: "Could not resolve authentication method"
- **Solution:** Check that `CLAUDE_API_KEY` is set correctly in `.env`
- Ensure no extra spaces or line breaks in the API key

### Issue: "not_authed" or Slack authentication error
- **Solution:** Verify `SLACK_BOT_TOKEN` is correct
- Ensure bot has required scopes (see step 4)
- Re-invite bot to channel: `/invite @Echo`

### Issue: Echo not detecting mentions
- **Solution:** Check `ECHO_BOT_USER_ID` matches your bot
- Run the ID detection command from step 4
- Verify bot is in the channel

### Issue: "Module not found"
- **Solution:** Run `npm install` again
- Delete `node_modules` folder and reinstall

## 📝 Configuration Options

### Change Channel
Edit `echo-claude-bot.js`:
```javascript
const CHANNEL_ID = 'YOUR_CHANNEL_ID'; // Line ~13
```

Find channel ID: Right-click channel → View channel details → Copy ID

### Adjust Polling Speed
Edit `.env`:
```env
POLL_INTERVAL=3000  # Check every 3 seconds (default)
```

### Change Response Style
Edit `lib/echo-intelligence.js`:
```javascript
max_tokens: 400,  // Line ~75 - Increase for longer responses
```

## 🚀 Running in Background

### Windows:
```bash
# Using npm script
npm run echo-claude &

# Or with pm2 (recommended)
npm install -g pm2
pm2 start echo-claude-bot.js --name echo
pm2 save
```

### Linux/Mac:
```bash
# Using nohup
nohup npm run echo-claude > echo.log 2>&1 &

# Or with pm2 (recommended)
npm install -g pm2
pm2 start echo-claude-bot.js --name echo
pm2 startup
pm2 save
```

## 📊 PM2 Commands (Production)

```bash
pm2 start echo-claude-bot.js --name echo  # Start
pm2 stop echo                              # Stop
pm2 restart echo                           # Restart
pm2 logs echo                              # View logs
pm2 status                                 # Check status
pm2 delete echo                            # Remove
```

## 🔄 Updating Echo

```bash
git pull origin Agent006-Echo    # Get latest changes
npm install                       # Update dependencies
pm2 restart echo                 # Restart bot (if using pm2)
```

## 📧 Support

If you encounter issues:
1. Check the logs in terminal
2. Verify all API keys are valid
3. Ensure bot has correct Slack permissions
4. Test Claude API separately with the test script

## 🎉 Success!

Echo is now running! She will:
- ✅ Monitor the configured channel
- ✅ Detect mentions (@Echo or "echo agent")
- ✅ Respond with Claude AI
- ✅ Reply in threads
- ✅ Skip her own messages
- ✅ Use brief, energetic responses

**Happy coding! Let's gooo! 🚀**

