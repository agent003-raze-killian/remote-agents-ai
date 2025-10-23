# ⚡ Echo Agent - Quick Setup Checklist

## 📦 Files to Copy

Copy these files to the new computer:

```
📁 Required Files:
├── echo-claude-bot.js          ✅ Main bot
├── lib/
│   └── echo-intelligence.js    ✅ AI brain
├── package.json                ✅ Dependencies
├── package-lock.json           ✅ Dependency versions
├── .env.example                ✅ Environment template
├── setup-echo.js               ✅ Setup wizard
└── ECHO_SETUP_GUIDE.md         ✅ Full guide
```

## 🚀 Setup Commands (5 Minutes)

### Option 1: Automated Setup (Recommended)
```bash
# 1. Navigate to folder
cd remote-agents-ai

# 2. Install dependencies
npm install

# 3. Run setup wizard
npm run setup

# 4. Start Echo
npm run echo-claude
```

### Option 2: Manual Setup
```bash
# 1. Install dependencies
npm install

# 2. Create .env file
copy .env.example .env

# 3. Edit .env with your credentials
notepad .env

# 4. Start Echo
npm run echo-claude
```

## 🔑 Required Credentials

You need these 2 things:

1. **Slack Bot Token** (starts with `xoxb-`)
   - Get from: https://api.slack.com/apps
   - Scopes needed: `channels:history`, `channels:read`, `chat:write`, `users:read`

2. **Claude API Key** (starts with `sk-ant-api03-`)
   - Get from: https://console.anthropic.com/
   - Any active key will work

## ✅ Test Echo

1. Start Echo:
```bash
npm run echo-claude
```

2. You should see:
```
⚡ Echo Agent with Claude AI starting...
🤖 Bot User ID: U09NN89D6KA
📢 Monitoring channel: C09MFH9JTK5
🚀 Starting to monitor for mentions...
```

3. Test in Slack:
```
@Echo hello!
```

Echo should reply with: `🚀 Yo! What's up? ⚡`

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Module not found | Run `npm install` |
| Authentication error | Check API keys in `.env` |
| Echo not responding | Verify bot is in channel: `/invite @Echo` |
| Wrong bot ID | Let bot auto-detect on first run |

## 📊 Production Setup (Optional)

For running Echo 24/7:

```bash
# Install PM2
npm install -g pm2

# Start Echo
pm2 start echo-claude-bot.js --name echo

# Save configuration
pm2 save

# Auto-start on reboot (Windows)
pm2 startup
```

## 📱 Quick Commands

```bash
npm run echo-claude      # Start Echo
npm run setup           # Setup wizard
pm2 logs echo          # View logs (if using PM2)
pm2 restart echo       # Restart Echo (if using PM2)
```

## 🎉 Done!

Echo is ready to rock! 🚀

For detailed information, see `ECHO_SETUP_GUIDE.md`

