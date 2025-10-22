# 🎯 What You Need to Provide for Slack MCP

## TL;DR - The Two Things You Need:

1. **SLACK_BOT_TOKEN** - starts with `xoxb-`
2. **SLACK_APP_TOKEN** - starts with `xapp-`

Both go in a `.env` file in the `slack-mcp-server` folder.

---

## 📝 Detailed Requirements

### Required Items:

#### 1. Slack Bot Token (`SLACK_BOT_TOKEN`)
- **What it is:** OAuth token that lets your bot act in Slack
- **Starts with:** `xoxb-`
- **How to get:** 
  1. Create a Slack app at [api.slack.com/apps](https://api.slack.com/apps)
  2. Add OAuth scopes (see below)
  3. Install to workspace
  4. Copy the "Bot User OAuth Token"

#### 2. Slack App Token (`SLACK_APP_TOKEN`)
- **What it is:** Token for Socket Mode (real-time message receiving)
- **Starts with:** `xapp-`
- **How to get:**
  1. In your Slack app settings
  2. Go to "Socket Mode"
  3. Enable Socket Mode
  4. Generate token with `connections:write` scope
  5. Copy the generated token

---

## 🔑 Required OAuth Scopes

When setting up your Slack app, add these Bot Token Scopes:

| Scope | What it allows |
|-------|---------------|
| `chat:write` | Send messages |
| `chat:write.public` | Send to channels without joining |
| `channels:history` | Read public channel messages |
| `channels:read` | View public channel info |
| `groups:history` | Read private channel messages |
| `groups:read` | View private channel info |
| `im:history` | Read direct messages |
| `im:read` | View DM info |
| `im:write` | Send direct messages |
| `users:read` | Get user information |
| `reactions:write` | Add emoji reactions |
| `search:read` | Search messages |

---

## 📁 File Structure You'll Have

```
slack-mcp-server/
├── .env                    ← YOU CREATE THIS (your tokens)
├── env-template.txt        ← Template to copy
├── SETUP-GUIDE.md          ← Step-by-step instructions
├── README.md               ← Full documentation
├── package.json
├── tsconfig.json
├── .gitignore
└── src/
    └── index.ts            ← Main server code
```

---

## 🔧 Configuration Format

Create a file named `.env` in the `slack-mcp-server` folder:

```env
SLACK_BOT_TOKEN=xoxb-YOUR-BOT-TOKEN-HERE
SLACK_APP_TOKEN=xapp-YOUR-APP-TOKEN-HERE
DEFAULT_SLACK_CHANNEL=general
```

**Replace the example tokens with your actual tokens from Slack!**

---

## ⚙️ Optional Configuration

You can optionally provide:

- `DEFAULT_SLACK_CHANNEL` - Default channel for messages (can be overridden)

---

## 🚀 Installation Steps (Quick)

```bash
# 1. Navigate to folder
cd slack-mcp-server

# 2. Install dependencies
npm install

# 3. Build the server
npm run build

# 4. Create .env file with your tokens (see above)

# 5. Run the server
npm start
```

---

## ✅ How to Verify It's Working

1. **Run the server:** `npm start`
2. **You should see:**
   ```
   🚀 Starting Slack MCP Server...
   ✅ Slack Socket Mode connected
   ✅ Slack MCP Server running on stdio
   📡 Listening for Slack messages...
   ```
3. **Invite bot to a channel:** `/invite @YourBot`
4. **Send a message in that channel**
5. **Check terminal** - you should see your message logged

If you see this, **you're all set!** 🎉

---

## 🎭 Bonus: Agent Personalities

When using the MCP server, you can customize messages with agent personalities:

```typescript
// Example: Send as NEON
{
  channel: "dev-team",
  text: "✨ Just deployed! It's GORGEOUS! 💅",
  username: "NEON",
  icon_emoji: ":sparkles:"
}

// Example: Send as MATRIX
{
  channel: "dev-team", 
  text: "▓▒░ Query optimized. Latency reduced by 83%.",
  username: "MATRIX",
  icon_emoji: ":robot_face:"
}
```

**Available Agents:**
- 💎 **NEON** - Frontend queen (`:sparkles:`)
- 🤖 **MATRIX** - Database philosopher (`:robot_face:`)
- ⚔️ **APEX** - Security fortress (`:crossed_swords:`)
- 👻 **GHOST** - Performance whisperer (`:ghost:`)
- ⚫ **VOID** - Bug hunter (`:black_circle:`)
- 🔮 **ORACLE** - Documentation sage (`:crystal_ball:`)

---

## 🐛 Common Issues

### Issue: "missing_scope" error
**Solution:** Add all required OAuth scopes, then reinstall the app to workspace

### Issue: "channel_not_found"  
**Solution:** Invite the bot: `/invite @YourBot` in that channel

### Issue: "invalid_auth"
**Solution:** Check your tokens in `.env` - make sure they're correct and start with `xoxb-` and `xapp-`

### Issue: Socket Mode not connecting
**Solution:** 
- Verify Socket Mode is enabled in Slack app settings
- Check that app token has `connections:write` scope
- Make sure app token starts with `xapp-`

---

## 📚 Next Steps

1. **Read:** `SETUP-GUIDE.md` for detailed step-by-step instructions
2. **Read:** `README.md` for full API documentation
3. **Configure:** Claude Desktop or other MCP client to use this server
4. **Test:** Send your first message!

---

## 🔐 Security Reminders

- ✅ `.env` file is already in `.gitignore`
- ⚠️ **NEVER** commit tokens to Git
- ⚠️ **NEVER** share tokens publicly
- ⚠️ **NEVER** hardcode tokens in code
- ✅ Keep tokens in `.env` file only

---

## 📞 Resources

- **Detailed Setup:** See `SETUP-GUIDE.md` in this folder
- **Full Documentation:** See `README.md` in this folder
- **Slack API:** [api.slack.com](https://api.slack.com/)
- **MCP Protocol:** [modelcontextprotocol.io](https://modelcontextprotocol.io/)

---

**That's all you need! Follow `SETUP-GUIDE.md` for step-by-step instructions.** 🚀

