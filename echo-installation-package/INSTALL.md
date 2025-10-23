# 🚀 Echo Agent - Installation Package

## 📦 What's Included

This package contains everything you need to run Echo Agent:

```
remote-agents-ai/
├── 📄 QUICK_SETUP.md              # 5-minute setup guide
├── 📄 ECHO_SETUP_GUIDE.md         # Detailed instructions
├── 📄 INSTALL.md                  # This file
│
├── 🤖 echo-claude-bot.js          # Main Echo bot
├── 🧠 lib/
│   └── echo-intelligence.js       # Echo's AI brain
│
├── ⚙️  setup-echo.js               # Automated setup wizard
├── 📋 package.json                # Dependencies
├── 🔐 env.template                # Environment template
└── 📚 README.md                   # Project overview
```

## ⚡ Quick Start (3 Steps)

### 1. Install Node.js
- **Download:** https://nodejs.org/ (v18 or higher)
- **Check:** `node --version` (should show v18+)

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Setup Wizard
```bash
npm run setup
```

The wizard will:
- ✅ Guide you through configuration
- ✅ Create your `.env` file
- ✅ Test your API keys
- ✅ Get Echo ready to run

## 🔑 What You Need

Before running setup, have these ready:

1. **Slack Bot Token** (xoxb-...)
   - From: https://api.slack.com/apps
   - Required scopes: `channels:history`, `channels:read`, `chat:write`, `users:read`

2. **Claude API Key** (sk-ant-api03-...)
   - From: https://console.anthropic.com/

## 🎯 Start Echo

After setup:
```bash
npm run echo-claude
```

Test in Slack:
```
@Echo hello!
```

## 📚 Need Help?

- **Quick Setup:** See `QUICK_SETUP.md`
- **Detailed Guide:** See `ECHO_SETUP_GUIDE.md`
- **Troubleshooting:** Check the guides above

## 🎉 That's It!

Echo is ready to rock! Let's gooo! 🚀

