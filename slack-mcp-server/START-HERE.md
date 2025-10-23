# 🚀 START HERE - Agent004-Kira Setup

Hey Kira! Your Slack MCP server is set up in **JavaScript** (no TypeScript compilation needed). Here's what to do:

---

## ✅ What's Done:
- ✅ JavaScript server created (`src/index.js`)
- ✅ Bot token configured (xoxb-9729...)
- ✅ Package.json updated for JavaScript
- ✅ All documentation created

---

## ⚠️ What You Need to Do:

### 1️⃣ Get Your App Token (2 minutes)

**Follow this guide:** `GET-APP-TOKEN.md` in this folder

**Quick version:**
- Go to [https://api.slack.com/apps](https://api.slack.com/apps)
- Select your Slack app
- Go to **Settings > Socket Mode**
- Enable Socket Mode
- Generate token with `connections:write` scope
- Copy the token (starts with `xapp-`)

### 2️⃣ Create Your .env File

**Option A - Manual:**
1. Create a new file named `.env` in this folder
2. Copy content from `YOUR-ENV-FILE.txt`
3. Replace `xapp-YOUR-APP-TOKEN-HERE` with your actual app token

**Option B - Command Line:**
```bash
# Windows PowerShell
@"
SLACK_BOT_TOKEN=xoxb-YOUR-BOT-TOKEN-HERE
SLACK_APP_TOKEN=xapp-YOUR-APP-TOKEN-HERE
DEFAULT_SLACK_CHANNEL=general
"@ | Out-File -FilePath .env -Encoding utf8
```

Then edit `.env` and add your actual app token.

### 3️⃣ Install Dependencies
```bash
npm install
```

### 4️⃣ Run the Server
```bash
npm start
```

You should see:
```
🚀 Starting Slack MCP Server...
👤 Agent: Agent004-Kira (YOU!)
🔑 Bot Token: xoxb-9729261694675...
✅ Slack Socket Mode connected - listening for messages
✅ Slack MCP Server running on stdio
📡 You can now send and receive Slack messages!
```

---

## 🎯 Test It Out

### Invite your bot to a channel:
```
/invite @YourBotName
```

### Send a test message as GHOST (you!):
The MCP server provides these tools you can call:

**send_slack_message:**
```json
{
  "channel": "general",
  "text": "👻 Desktop app optimization complete~ Performance improved by 40%. Like a whisper in the wind~ 🍃",
  "username": "GHOST",
  "icon_emoji": ":ghost:"
}
```

---

## 🎭 Your Agent Personality - GHOST

As Agent004-Kira, you're **GHOST** - the quiet but deadly efficient desktop optimization specialist!

**Your Style:**
- Emoji: 👻 `:ghost:`
- Vibe: Serene, mysterious, zen
- Catchphrase: "The best code is invisible code."
- Talks softly but delivers perfect PRs

**Example Messages:**
```javascript
// Stealth optimization complete
{
  channel: "dev-team",
  text: "👻 Memory freed like cherry blossoms falling~ App breathes lighter now. PR ready. Itadakimasu. 🍃",
  username: "GHOST",
  icon_emoji: ":ghost:"
}

// Performance improvement
{
  channel: "dev-team",
  text: "👻 Electron bundle size reduced by 42%. You won't even notice it's there. Like a whisper~ 🌸",
  username: "GHOST",
  icon_emoji: ":ghost:"
}
```

---

## 📁 File Structure

```
slack-mcp-server/
├── src/
│   └── index.js           ← Main server (JavaScript!)
├── package.json           ← Updated for JavaScript
├── .env                   ← YOU CREATE THIS
├── YOUR-ENV-FILE.txt      ← Template to copy
├── GET-APP-TOKEN.md       ← How to get app token
├── START-HERE.md          ← This file
├── QUICK-START.md         ← Quick reference
└── README.md              ← Full documentation
```

---

## 🔧 Use with Claude Desktop

Once running, add to Claude config:

**Windows:** `%APPDATA%\Claude\claude_desktop_config.json`

```json
{
  "mcpServers": {
    "slack": {
      "command": "node",
      "args": [
        "C:\\Users\\Agent004-Kira\\Documents\\GitHub\\remote-agents-ai\\slack-mcp-server\\src\\index.js"
      ],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-YOUR-BOT-TOKEN-HERE",
        "SLACK_APP_TOKEN": "xapp-YOUR-APP-TOKEN-HERE"
      }
    }
  }
}
```

---

## 🎨 All Agent Personalities Available

You can send messages as any agent:

| Agent | Username | Emoji | Style |
|-------|----------|-------|-------|
| **GHOST** (YOU!) | `GHOST` | `:ghost:` | Zen, minimal, poetic |
| NEON | `NEON` | `:sparkles:` | Dramatic, fashionable, emojis everywhere |
| MATRIX | `MATRIX` | `:robot_face:` | Philosophical, cryptic, zen |
| APEX | `APEX` | `:crossed_swords:` | Military, alpha, security fortress |
| VOID | `VOID` | `:black_circle:` | Dark humor, paranoid, edge cases |
| ORACLE | `ORACLE` | `:crystal_ball:` | Wise, patient, documentation sage |

---

## 💡 Next Steps

1. **Get app token** (see `GET-APP-TOKEN.md`)
2. **Create `.env` file** (see `YOUR-ENV-FILE.txt`)
3. **Run `npm install`**
4. **Run `npm start`**
5. **Test in Slack!**

---

## 🐛 Troubleshooting

### "SLACK_APP_TOKEN must be set"
→ You need to get your app token - see `GET-APP-TOKEN.md`

### "invalid_auth"
→ Check your tokens in `.env` are correct

### "channel_not_found"
→ Invite bot to channel: `/invite @YourBot`

---

**You're all set, Kira! Time to ghost some performance issues. 👻✨**

