# 🕵️ MCP Demonstration: Shadow Agent005's Slack Integration

## **How MCP Works in Cursor - Complete Flow**

### **1. Configuration Phase**
```json
// .cursor/mcp.json
{
  "mcpServers": {
    "slack-shadow": {
      "command": "node",
      "args": ["slack-mcp-server.js"],
      "env": {
        "SLACK_BOT_TOKEN": "${SLACK_BOT_TOKEN}"
      }
    }
  }
}
```

### **2. Server Startup Process**
When Cursor starts, it:
1. Reads `.cursor/mcp.json`
2. Launches `node slack-mcp-server.js`
3. Server registers 20+ tools with Cursor
4. Tools become available for AI to use

### **3. Available Tools (20+ Total)**
```
📁 File Operations:
- upload_slack_file
- get_slack_files  
- delete_slack_file

💬 Messaging:
- send_slack_message
- reply_to_slack_message
- send_slack_message_public

🔒 Channels:
- get_slack_channels
- get_slack_channel_history
- get_slack_private_channels
- create_slack_channel
- invite_to_slack_channel

💭 Direct Messages:
- get_slack_dm_history
- get_slack_dm_list
- start_slack_dm

😀 Reactions & Pins:
- add_slack_reaction
- remove_slack_reaction
- pin_slack_message
- unpin_slack_message

⏰ Reminders:
- create_slack_reminder
- complete_slack_reminder

👥 Users:
- get_slack_users
- get_slack_user_info
```

### **4. How You Use It in Cursor**

**Example 1: List Channels**
```
User: "Show me all Slack channels"
Cursor: Uses get_slack_channels tool
Result: ⚫ Found 5 channels:
• 🌐 #general (C1234567890)
• 🌐 #dev-team (C0987654321)
• 🔒 #private-stuff (C1122334455)
```

**Example 2: Send Message**
```
User: "Send a message to #general saying 'Hello team'"
Cursor: Uses send_slack_message tool
Result: ⚫ Message sent successfully to #general. Timestamp: 1698123456.789
```

**Example 3: Upload File**
```
User: "Upload this document to #dev-team"
Cursor: Uses upload_slack_file tool
Result: ⚫ File uploaded successfully: document.pdf (ID: F1234567890)
```

**Example 4: Create Reminder**
```
User: "Create a reminder for tomorrow at 9am to review code"
Cursor: Uses create_slack_reminder tool
Result: ⚫ Reminder created: "review code" for tomorrow at 9am (ID: R1234567890)
```

### **5. Shadow Personality Integration**

Every response includes Shadow Agent005's distinctive style:
- ⚫ Security-focused messaging
- Eastern European directness
- "If it can break, I will break it" catchphrase
- Sarcastic but helpful responses

### **6. Real-Time Integration**

When you ask Cursor to do Slack operations:
1. **Cursor receives** your request
2. **Identifies** which MCP tool to use
3. **Calls** the appropriate tool function
4. **Executes** Slack API operations
5. **Returns** results with Shadow personality

### **7. Error Handling**

If something goes wrong:
```
⚫ Error executing send_slack_message: Channel not found
Security audit: Channel #nonexistent does not exist. Do better.
```

### **8. Testing Your Setup**

**Manual Test:**
```bash
# Test MCP server directly
node slack-mcp-server.js

# Test with your Slack token
SLACK_BOT_TOKEN="your-token" node slack-mcp-server.js
```

**In Cursor:**
1. Restart Cursor
2. Check Tools section for "slack-shadow" server
3. Ask: "List my Slack channels"
4. Watch Shadow Agent005 respond with channel list

### **9. Advanced Usage Examples**

**Complex Workflow:**
```
User: "Create a new channel called 'security-review', invite the dev team, 
       and pin a message about code security guidelines"

Cursor executes:
1. create_slack_channel (name: "security-review")
2. invite_to_slack_channel (users: dev-team)
3. send_slack_message (security guidelines)
4. pin_slack_message (the guidelines message)
```

**File Management:**
```
User: "Upload this security report to #security-review and add a thumbs up reaction"

Cursor executes:
1. upload_slack_file (security-report.pdf to #security-review)
2. add_slack_reaction (thumbsup to the upload message)
```

### **10. Benefits of MCP Integration**

✅ **Seamless Integration**: Slack tools work directly in Cursor
✅ **AI-Powered**: Natural language commands
✅ **Comprehensive**: All Slack scopes covered
✅ **Personality**: Shadow Agent005's distinctive style
✅ **Error Handling**: Robust error management
✅ **Real-Time**: Live Slack operations

## **⚫ Shadow Agent005 is Ready**

Your MCP server transforms Cursor into a powerful Slack automation tool. 
Shadow Agent005 can now infiltrate your Slack workspace through natural language commands.

**Trust but verify.**

