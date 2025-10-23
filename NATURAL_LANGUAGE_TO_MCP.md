# 🕵️ How Natural Language Maps to MCP Tools in Cursor

## **The Magic: Natural Language → MCP Tools**

### **Core Concept**
```
Your Natural Language Request → Cursor AI → MCP Tool Call → Slack API → Shadow Response
```

### **Detailed Mapping Examples**

#### **1. Channel Operations**

**Natural Language:**
```
"List all my Slack channels"
"Show me the channels I have access to"
"What channels are available?"
"Display my workspace channels"
```

**MCP Tool Called:**
```javascript
mcp_slack-shadow_get_slack_channels({
  types: "public_channel,private_channel"
})
```

**Shadow Response:**
```
⚫ Found 5 channels:

• 🌐 #general (C1234567890)
  Company-wide announcements and discussions

• 🌐 #dev-team (C0987654321)  
  Development team coordination

• 🔒 #security-review (C1122334455)
  Private security discussions

• 🌐 #random (C5566778899)
  Non-work banter and water cooler chat

• 🔒 #executive (C9988776655)
  Executive team private channel
```

---

#### **2. Messaging Operations**

**Natural Language:**
```
"Send hello to #general"
"Post a message in the general channel"
"Say good morning to everyone in general"
"Send 'Security audit starting' to #general"
```

**MCP Tool Called:**
```javascript
mcp_slack-shadow_send_slack_message({
  channel: "#general",
  text: "Security audit starting",
  add_personality: true
})
```

**Shadow Response:**
```
⚫ Message sent successfully to #general. Timestamp: 1698123456.789
```

---

#### **3. File Operations**

**Natural Language:**
```
"Upload this file to #dev-team"
"Share the report with the development team"
"Post this document to dev-team channel"
"Upload security-report.pdf to #dev-team"
```

**MCP Tool Called:**
```javascript
mcp_slack-shadow_upload_slack_file({
  channel: "#dev-team",
  file_path: "./security-report.pdf",
  title: "Security Report",
  initial_comment: "Security audit: Found vulnerabilities. Do better."
})
```

**Shadow Response:**
```
⚫ File uploaded successfully: security-report.pdf (ID: F1234567890)
```

---

#### **4. Reminder Operations**

**Natural Language:**
```
"Create a reminder for tomorrow at 9am"
"Remind me to review code tomorrow morning"
"Set a reminder for standup tomorrow"
"Create a reminder for security review at 2pm"
```

**MCP Tool Called:**
```javascript
mcp_slack-shadow_create_slack_reminder({
  text: "Security review",
  time: "tomorrow at 2pm",
  user: "U1234567890"
})
```

**Shadow Response:**
```
⚫ Reminder created: "Security review" for tomorrow at 2pm (ID: R1234567890)
```

---

#### **5. Reaction Operations**

**Natural Language:**
```
"Add a thumbs up to the latest message"
"React with 👍 to that message"
"Give a thumbs up reaction"
"Add approval reaction to the message"
```

**MCP Tool Called:**
```javascript
mcp_slack-shadow_add_slack_reaction({
  channel: "C1234567890",
  timestamp: "1698123456.789",
  name: "thumbsup"
})
```

**Shadow Response:**
```
⚫ Reaction :thumbsup: added to message 1698123456.789 in C1234567890
```

---

#### **6. User Operations**

**Natural Language:**
```
"Show me all users in the workspace"
"List team members"
"Who are the users in this workspace?"
"Display workspace members"
```

**MCP Tool Called:**
```javascript
mcp_slack-shadow_get_slack_users({
  limit: 50,
  include_deleted: false
})
```

**Shadow Response:**
```
⚫ Found 25 users:

• John Doe (@john.doe) - U1234567890
  John Doe (Admin)

• Jane Smith (@jane.smith) - U0987654321
  Jane Smith

• Mike Johnson (@mike.johnson) - U1122334455
  Mike Johnson (Bot)
```

---

#### **7. Direct Message Operations**

**Natural Language:**
```
"Start a DM with John"
"Send a private message to @john.doe"
"Message John privately"
"DM John about the security issue"
```

**MCP Tool Called:**
```javascript
mcp_slack-shadow_start_slack_dm({
  user: "U1234567890",
  text: "Security issue detected. Immediate attention required."
})
```

**Shadow Response:**
```
⚫ DM conversation started with user U1234567890. Message sent: 1698123456.789
```

---

#### **8. Channel Management**

**Natural Language:**
```
"Create a new channel called security-incidents"
"Make a private channel for security discussions"
"Set up a new channel for incident response"
"Create security-incidents channel and make it private"
```

**MCP Tool Called:**
```javascript
mcp_slack-shadow_create_slack_channel({
  name: "security-incidents",
  is_private: true,
  topic: "Security incident response and coordination",
  purpose: "Private channel for handling security incidents"
})
```

**Shadow Response:**
```
⚫ Channel created successfully: 🔒 #security-incidents (C9988776655)
```

---

#### **9. Channel History**

**Natural Language:**
```
"Show me recent messages from #general"
"What's been said in the general channel lately?"
"Display the last 10 messages from #general"
"Get channel history for general"
```

**MCP Tool Called:**
```javascript
mcp_slack-shadow_get_slack_channel_history({
  channel: "C1234567890",
  limit: 10
})
```

**Shadow Response:**
```
⚫ Channel history for C1234567890 (10 messages):

• 10/22/2025 8:45:23 AM
  U1234567890: Good morning team! Security audit starting today.

• 10/22/2025 8:46:15 AM
  U0987654321: Thanks for the heads up. Ready to assist.

• 10/22/2025 8:47:02 AM
  U1122334455: I'll review the infrastructure components.
```

---

#### **10. Complex Workflows**

**Natural Language:**
```
"Create a security channel, invite the team, and send a welcome message"
"Set up incident response: create channel, invite security team, post guidelines"
"Make a new private channel for security, add the team, and pin the rules"
```

**Multiple MCP Tools Called:**
```javascript
// Step 1: Create channel
mcp_slack-shadow_create_slack_channel({
  name: "incident-response",
  is_private: true,
  purpose: "Security incident response"
})

// Step 2: Invite users
mcp_slack-shadow_invite_to_slack_channel({
  channel: "C9988776655",
  users: "U1234567890,U0987654321,U1122334455"
})

// Step 3: Send welcome message
mcp_slack-shadow_send_slack_message({
  channel: "C9988776655",
  text: "Security incident response guidelines posted. Trust but verify."
})

// Step 4: Pin the message
mcp_slack-shadow_pin_slack_message({
  channel: "C9988776655",
  timestamp: "1698123456.789"
})
```

**Shadow Response:**
```
⚫ Channel created successfully: 🔒 #incident-response (C9988776655)
⚫ Users invited to channel C9988776655: U1234567890, U0987654321, U1122334455
⚫ Message sent successfully to C9988776655. Timestamp: 1698123456.789
⚫ Message 1698123456.789 pinned in channel C9988776655
```

## **How Cursor Processes Natural Language**

### **1. Intent Recognition**
Cursor analyzes your request and identifies:
- **Action**: What you want to do (send, create, list, etc.)
- **Target**: What you're targeting (channel, user, file, etc.)
- **Parameters**: Additional details (time, content, etc.)

### **2. Tool Selection**
Cursor maps your intent to the appropriate MCP tool:
```
"List channels" → get_slack_channels
"Send message" → send_slack_message
"Upload file" → upload_slack_file
"Create reminder" → create_slack_reminder
```

### **3. Parameter Extraction**
Cursor extracts parameters from your natural language:
```
"Send hello to #general" → {channel: "#general", text: "hello"}
"Upload report.pdf to #dev-team" → {file_path: "report.pdf", channel: "#dev-team"}
```

### **4. Tool Execution**
Cursor calls the MCP tool with extracted parameters:
```javascript
mcp_slack-shadow_send_slack_message({
  channel: "#general",
  text: "hello",
  add_personality: true
})
```

### **5. Response Processing**
Shadow Agent005 processes the result and adds personality:
```
⚫ Message sent successfully to #general. Timestamp: 1698123456.789
```

## **Advanced Natural Language Patterns**

### **Implicit Parameters**
```
"Send hello" → Assumes #general channel
"Upload this file" → Uses current file context
"Create reminder" → Uses current user context
```

### **Context Awareness**
```
"Reply to that message" → Uses last message context
"React to the latest post" → Uses recent message timestamp
"Invite the team" → Uses workspace team context
```

### **Multi-Step Commands**
```
"Create a channel and invite everyone" → Multiple tool calls
"Upload file and pin the message" → Sequential operations
"Send message and add reaction" → Chained operations
```

## **⚫ Shadow Agent005's Intelligence**

Shadow Agent005 understands:
- **Security context**: Prioritizes security-related operations
- **Eastern European directness**: Straightforward, no-nonsense responses
- **Paranoia**: "If it can break, I will break it" mindset
- **Efficiency**: Minimal words, maximum impact

**Trust but verify.**
