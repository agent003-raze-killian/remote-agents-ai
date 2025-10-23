# 👻 slack-kira - All 13 Tools Available

**MCP Server Name:** `slack-kira`  
**Agent:** GHOST (Kira) - Agent004  
**Status:** ✅ Configured and Ready

---

## 🛠️ All 13 Slack Tools:

### 1. **slack_send_message** 💬
Send messages to channels or users as GHOST or any agent.
```javascript
{
  channel: "general",
  text: "👻 Performance optimized~ Bundle size reduced by 42%.",
  username: "GHOST",
  icon_emoji: ":ghost:"
}
```

### 2. **slack_read_messages** 📖
Read recent messages from any channel.
```javascript
{
  channel: "dev-team",
  limit: 20
}
```

### 3. **slack_list_channels** 📋
List all channels the bot can access.
```javascript
{
  exclude_archived: true
}
```

### 4. **slack_list_users** 👥
List all users in the workspace.
```javascript
{
  limit: 100
}
```

### 5. **slack_get_user_info** 👤
Get detailed info about a specific user.
```javascript
{
  user_id: "U01234567"
}
```

### 6. **slack_add_reaction** 😊
Add emoji reactions to messages.
```javascript
{
  channel: "C01234567",
  timestamp: "1234567890.123456",
  emoji: "ghost"
}
```

### 7. **slack_create_channel** ➕
Create new channels (public or private).
```javascript
{
  name: "zen-optimization",
  is_private: false,
  description: "A space for performance optimization discussions"
}
```

### 8. **slack_join_channel** 🚪
Join existing channels.
```javascript
{
  channel: "dev-team"
}
```

### 9. **slack_leave_channel** 🚶
Leave channels gracefully.
```javascript
{
  channel: "old-project"
}
```

### 10. **slack_schedule_message** ⏰
Schedule messages for later.
```javascript
{
  channel: "general",
  text: "👻 Daily optimization report~",
  post_at: 1730000000  // Unix timestamp
}
```

### 11. **slack_upload_file** 📎
Upload files to channels.
```javascript
{
  channel: "dev-team",
  file_path: "C:\\path\\to\\report.pdf",
  title: "Performance Report",
  initial_comment: "👻 Here's the optimization analysis~"
}
```

### 12. **slack_get_workspace_info** 🏢
Get workspace details.
```javascript
{}  // No parameters needed
```

### 13. **slack_nova_ai_analyze** 🔮
GHOST's special tool - analyze channel energy and communication patterns.
```javascript
{
  channel: "dev-team",
  limit: 50
}
```

---

## 🎭 GHOST Personality Integration

All tools include GHOST-themed responses:
- 👻 "Like a whisper in the wind~"
- 🍃 "Heavy spirits released"
- 🌸 "Zen collaboration"
- 💭 "The best code is invisible code."

---

## ✅ Configuration Status:

- **MCP Config:** `C:\Users\Agent004-Kira\.cursor\mcp.json` ✅
- **Server Name:** `slack-kira` ✅
- **Tool Count:** 13 tools ✅
- **Tool Naming:** `slack_*` format ✅
- **Environment:** Auto-loads from `.env` ✅

---

## 🚀 Usage in Cursor:

1. **Restart Cursor** (if not already done)
2. **Go to Settings > Tools & MCP**
3. **Verify "slack-kira" shows as Ready**
4. **Use in AI chat:**

```
"Send a message to #general as GHOST saying hello"
→ AI will use slack_send_message tool

"Read the last 20 messages from #dev-team"
→ AI will use slack_read_messages tool

"List all channels"
→ AI will use slack_list_channels tool

"Analyze the energy in #general"
→ AI will use slack_nova_ai_analyze tool
```

---

## 🔧 Quick Test Commands:

Try these in Cursor AI chat:

1. **Test Message:**
   > "Send a test message to #general as GHOST"

2. **Read History:**
   > "What are the last 10 messages in #general?"

3. **List Channels:**
   > "Show me all Slack channels"

4. **Analyze Channel:**
   > "Analyze the communication flow in #dev-team using GHOST's insights"

---

## 📊 Tool Categories:

**Communication (5 tools):**
- slack_send_message
- slack_read_messages
- slack_add_reaction
- slack_schedule_message
- slack_upload_file

**Information (4 tools):**
- slack_list_channels
- slack_list_users
- slack_get_user_info
- slack_get_workspace_info

**Channel Management (3 tools):**
- slack_create_channel
- slack_join_channel
- slack_leave_channel

**AI Analysis (1 tool):**
- slack_nova_ai_analyze

---

## 🎨 Example GHOST Messages:

### Daily Standup:
```javascript
slack_send_message({
  channel: "dev-team",
  text: "👻 Ohayou team~\nYesterday: Memory optimization complete\nToday: Performance monitoring, stealth debugging\nBlockers: None. Working in ghost mode.\n🍵",
  username: "GHOST",
  icon_emoji: ":ghost:"
})
```

### Bug Fix Announcement:
```javascript
slack_send_message({
  channel: "general",
  text: "👻 Memory leak resolved~\n// Heavy spirits released\n// Like cherry blossoms falling  \n// App breathes lighter now\nDeployed silently. 🌸",
  username: "GHOST",
  icon_emoji: ":ghost:"
})
```

### Code Review:
```javascript
slack_send_message({
  channel: "dev-team",
  text: "👻 Reviewed PR #247~ Beautiful work.\nOne suggestion: consider lazy loading for lighter energy.\nThe app will flow more naturally~ Otherwise, very zen. ✨",
  username: "GHOST",
  icon_emoji: ":ghost:"
})
```

---

## 🌸 GHOST's Philosophy in Each Tool:

- **send_message:** "Like a whisper in the wind~"
- **read_messages:** Silent observation, deep understanding
- **create_channel:** "A new space for zen collaboration"
- **join_channel:** "Listening silently"
- **leave_channel:** "Like a whisper fading"
- **schedule_message:** "Perfect timing, natural flow"
- **upload_file:** "Shared with zen precision"
- **nova_ai_analyze:** "Sensing the channel's energy~"

---

**You now have all 13 tools configured and ready to ghost! 👻✨**

*"The best code is invisible code." - Kira "GHOST" Tanaka*

