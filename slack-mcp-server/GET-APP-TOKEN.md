# 🔑 How to Get Your Slack App Token

You have your **Bot Token** ✅, but you still need your **App Token** for Socket Mode.

## 🎯 Quick Steps (2 minutes):

### 1. Go to Your Slack App
👉 [https://api.slack.com/apps](https://api.slack.com/apps)

### 2. Select Your App
Click on the app you created (where you got your bot token)

### 3. Enable Socket Mode
- In the left sidebar, go to **Settings > Socket Mode**
- Toggle **"Enable Socket Mode"** to **ON**

### 4. Generate App-Level Token
A popup will appear:
- **Token Name:** `socket-token` (or whatever you want)
- **Scope:** Check the box for `connections:write`
- Click **"Generate"**

### 5. Copy the Token
- You'll see a token that starts with `xapp-`
- **COPY IT!** Example: `xapp-1-A123456789-1234567890123-abc123def456...`

### 6. Add to .env File
Open your `.env` file and replace this line:
```env
SLACK_APP_TOKEN=xapp-YOUR-APP-TOKEN-HERE
```

With your actual token:
```env
SLACK_APP_TOKEN=xapp-1-A123456789-1234567890123-abc123def456...
```

---

## ✅ Your .env Should Look Like:

```env
SLACK_BOT_TOKEN=xoxb-YOUR-BOT-TOKEN-HERE
SLACK_APP_TOKEN=xapp-YOUR-APP-TOKEN-HERE
DEFAULT_SLACK_CHANNEL=general
```

---

## 🚀 Then Run:

```bash
npm install
npm start
```

---

## ❓ Why Do You Need This?

- **Bot Token** (`xoxb-`) = Lets your bot send/receive messages
- **App Token** (`xapp-`) = Enables Socket Mode for real-time events

Socket Mode means your bot can listen for messages without needing a public webhook URL. Much easier!

---

## 🐛 Troubleshooting

### Can't find Socket Mode?
- Make sure you're in the correct app
- Look in left sidebar: **Settings > Socket Mode**

### Token doesn't start with xapp-?
- That's not the right token
- Make sure you're generating an **App-Level Token**, not a Bot Token

### Still stuck?
The token generation popup looks like this:
```
┌─────────────────────────────────────┐
│ Generate an app-level token        │
├─────────────────────────────────────┤
│ Token Name: socket-token            │
│ Scopes:                             │
│ ☑ connections:write                 │
│                                     │
│ [Generate]                          │
└─────────────────────────────────────┘
```

---

**Once you add the App Token to .env, you're all set!** 🎉

