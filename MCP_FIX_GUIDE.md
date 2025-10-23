# 🕵️ FIX: How to Use MCP Commands Correctly

## **The Problem You Encountered**

### **❌ What You Did Wrong:**
```bash
PS C:\Users\Agent005-Shadow\Documents\GitHub\remote-agents-ai> send hello to #general
send : The term 'send' is not recognized as the name of a cmdlet, function, script file, or operable program.
```

### **Why This Happened:**
- You tried to run Slack commands directly in the **terminal/PowerShell**
- MCP commands don't work in the terminal
- They only work through **Cursor's AI chat interface**

## **✅ The Correct Way**

### **Step 1: Open Cursor IDE**
1. Launch Cursor IDE
2. Open your project folder

### **Step 2: Open Cursor Chat**
- **Windows**: Press `Ctrl+L`
- **Mac**: Press `Cmd+L`
- **Alternative**: Click the chat icon at the bottom

### **Step 3: Type Your Command**
```
Send hello to #general
```

### **Step 4: Press Enter**
Cursor will process your request and call the MCP tool

### **Step 5: Get Shadow's Response**
```
⚫ Message sent successfully to #general. Timestamp: 1698123456.789
```

## **Visual Guide**

### **❌ Wrong Way (Terminal):**
```
PS C:\Users\Agent005-Shadow\Documents\GitHub\remote-agents-ai> send hello to #general
ERROR: Command not found
```

### **✅ Correct Way (Cursor Chat):**
```
┌─────────────────────────────────────┐
│ Cursor IDE                          │
│ ┌─────────────────────────────────┐ │
│ │ Code Editor                     │ │
│ │                                 │ │
│ └─────────────────────────────────┘ │
│ ┌─────────────────────────────────┐ │
│ │ 💬 Chat: "Send hello to #general"│ │ ← Type here
│ │                                 │ │
│ │ Shadow: ⚫ Message sent...      │ │ ← Response here
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

## **Complete Fix Process**

### **1. Close Terminal Commands**
Don't try to run Slack commands in PowerShell/terminal

### **2. Use Cursor Chat Instead**
- Press `Ctrl+L` (Windows) or `Cmd+L` (Mac)
- Type your natural language command
- Press Enter

### **3. Examples of Correct Usage**

**In Cursor Chat:**
```
"Send hello to #general"
"List my Slack channels"
"Upload this file to #dev-team"
"Create a reminder for tomorrow"
```

**NOT in Terminal:**
```
❌ send hello to #general
❌ list channels
❌ upload file
❌ create reminder
```

## **Why MCP Works This Way**

### **MCP (Model Context Protocol) Flow:**
```
Your Words (in Cursor Chat) → Cursor AI → MCP Server → Slack API → Shadow Response
```

### **Terminal Flow (Doesn't Work):**
```
Your Words (in Terminal) → PowerShell → ERROR: Command not found
```

## **Troubleshooting**

### **If MCP Commands Still Don't Work:**

**1. Check MCP Server Status:**
- Restart Cursor completely
- Check if `.cursor/mcp.json` exists
- Verify `.env` file has valid `SLACK_BOT_TOKEN`

**2. Check Cursor Tools Section:**
- Go to Cursor's Tools section
- Look for "slack-shadow" server
- Should show as "Ready" or "Connected"

**3. Test Basic MCP Functionality:**
```
In Cursor Chat: "List my Slack channels"
Expected: ⚫ Found X channels...
If Error: Check Slack bot token and permissions
```

## **Quick Reference**

### **✅ DO:**
- Use Cursor Chat (`Ctrl+L`)
- Type natural language commands
- Use channel names like `#general`
- Be specific about what you want

### **❌ DON'T:**
- Run commands in terminal/PowerShell
- Use technical MCP tool names
- Forget to include channel names
- Use ambiguous language

## **Example Session**

### **Correct Cursor Chat Session:**
```
You: Send hello to #general
Shadow: ⚫ Message sent successfully to #general. Timestamp: 1698123456.789

You: List my Slack channels
Shadow: ⚫ Found 3 channels:
• 🌐 #general (C1234567890)
• 🌐 #dev-team (C0987654321)
• 🔒 #security-review (C1122334455)

You: Upload security-report.pdf to #dev-team
Shadow: ⚫ File uploaded successfully: security-report.pdf (ID: F1234567890)
```

## **⚫ Shadow Agent005's Fix**

**The issue**: You tried to infiltrate Slack through the wrong interface.
**The solution**: Use Cursor's chat interface (`Ctrl+L`) for proper MCP tool execution.

**Trust but verify.**

