# 🕵️ Where to Put "Your Words" in Cursor

## **Where to Enter Natural Language Commands**

### **1. Cursor Chat Interface**
**Location**: Bottom of Cursor window or `Ctrl+L` (Windows) / `Cmd+L` (Mac)

**How to use:**
1. Open Cursor
2. Press `Ctrl+L` (or click the chat icon)
3. Type your natural language command
4. Press Enter

**Examples:**
```
"List all my Slack channels"
"Send a message to #general saying hello"
"Upload this file to #dev-team"
"Create a reminder for tomorrow at 9am"
```

### **2. Cursor Composer**
**Location**: `Ctrl+I` (Windows) / `Cmd+I` (Mac)

**How to use:**
1. Press `Ctrl+I` to open Composer
2. Type your request
3. Press Enter to execute

**Examples:**
```
"Create a new Slack channel called 'security-review' and invite the dev team"
"Upload the security report to #dev-team and add a thumbs up reaction"
"Send a DM to John about the security issue"
```

### **3. Inline Chat (Ask Cursor)**
**Location**: Right-click in code editor → "Ask Cursor" or `Ctrl+K`

**How to use:**
1. Right-click in your code
2. Select "Ask Cursor"
3. Type your Slack-related request

**Examples:**
```
"How do I send a message to Slack?"
"Show me how to upload a file to a Slack channel"
"Help me create a Slack reminder"
```

## **Step-by-Step Process**

### **Step 1: Open Cursor Chat**
```
Press Ctrl+L (Windows) or Cmd+L (Mac)
```

### **Step 2: Type Your Natural Language Command**
```
"List my Slack channels"
```

### **Step 3: Cursor Processes Your Request**
```
Cursor AI analyzes: "List my Slack channels"
↓
Maps to: mcp_slack-shadow_get_slack_channels
↓
Calls MCP tool with parameters
```

### **Step 4: Shadow Agent005 Responds**
```
⚫ Found 3 channels:

• 🌐 #general (C1234567890)
  Company-wide announcements

• 🌐 #dev-team (C0987654321)  
  Development team coordination

• 🔒 #security-review (C1122334455)
  Private security discussions
```

## **Visual Guide**

### **Cursor Interface Layout:**
```
┌─────────────────────────────────────┐
│ Cursor IDE Window                   │
│ ┌─────────────────────────────────┐ │
│ │ Code Editor                     │ │
│ │                                 │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ Chat Input: "Your words go here"│ │ ← HERE!
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### **Chat Input Examples:**
```
┌─────────────────────────────────────┐
│ 💬 Chat with Cursor                │
│                                     │
│ You: List my Slack channels         │ ← Type here
│                                     │
│ Shadow: ⚫ Found 3 channels...      │ ← Response appears here
│                                     │
│ You: Send hello to #general         │ ← Type here
│                                     │
│ Shadow: ⚫ Message sent...          │ ← Response appears here
└─────────────────────────────────────┘
```

## **Different Ways to Interact**

### **1. Direct Commands**
```
"Send a message to #general"
"Upload this file to #dev-team"
"Create a reminder for tomorrow"
```

### **2. Questions**
```
"How do I send a Slack message?"
"What channels do I have access to?"
"How can I upload a file to Slack?"
```

### **3. Requests**
```
"Please list all my Slack channels"
"Can you send a message to the dev team?"
"Help me create a Slack reminder"
```

### **4. Complex Workflows**
```
"Create a new private channel called 'incident-response', invite the security team, and send a welcome message"
"Upload the security report to #dev-team, pin the message, and add a thumbs up reaction"
"Send a DM to John about the security issue and create a reminder to follow up"
```

## **Tips for Better Results**

### **Be Specific:**
```
❌ "Send message"
✅ "Send a message to #general saying 'Security audit starting'"

❌ "Upload file"
✅ "Upload security-report.pdf to #dev-team"
```

### **Use Channel Names:**
```
✅ "Send message to #general"
✅ "Upload file to #dev-team"
✅ "Create channel called 'security-review'"
```

### **Include Context:**
```
✅ "Create a reminder for tomorrow at 9am to review code"
✅ "Send a DM to John about the security vulnerability"
✅ "Add a thumbs up reaction to the latest message"
```

## **Troubleshooting**

### **If MCP Tools Don't Work:**
1. **Check MCP Server**: Restart Cursor to reload MCP server
2. **Check Environment**: Ensure `.env` file has valid `SLACK_BOT_TOKEN`
3. **Check Configuration**: Verify `.cursor/mcp.json` is correct

### **If Commands Don't Map Correctly:**
1. **Be More Specific**: Include channel names and details
2. **Use Clear Language**: Avoid ambiguous terms
3. **Check Spelling**: Ensure channel names are correct

## **Example Session**

### **Complete Chat Session:**
```
You: List my Slack channels
Shadow: ⚫ Found 3 channels:
• 🌐 #general (C1234567890)
• 🌐 #dev-team (C0987654321)
• 🔒 #security-review (C1122334455)

You: Send a message to #general saying "Security audit starting"
Shadow: ⚫ Message sent successfully to #general. Timestamp: 1698123456.789

You: Upload security-report.pdf to #dev-team
Shadow: ⚫ File uploaded successfully: security-report.pdf (ID: F1234567890)

You: Create a reminder for tomorrow at 9am to review the audit
Shadow: ⚫ Reminder created: "review the audit" for tomorrow at 9am (ID: R1234567890)
```

## **⚫ Shadow Agent005 is Ready**

**Where to put "your words":**
- **Cursor Chat**: `Ctrl+L` (Windows) / `Cmd+L` (Mac)
- **Composer**: `Ctrl+I` (Windows) / `Cmd+I` (Mac)
- **Inline Chat**: Right-click → "Ask Cursor"

**Trust but verify.**
