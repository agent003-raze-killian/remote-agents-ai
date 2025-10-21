# Cursor MCP Configuration for Cipher Agent002

## 🔧 **Updated Setup Instructions**

Since you have your bot token in `.env.local`, here's how to configure Cursor:

### **Option 1: Simple Configuration (Recommended)**
Add to your `.cursor/mcp.json`:
```json
{
  "mcpServers": {
    "cipher-slack": {
      "command": "node",
      "args": ["cipher_slack_mcp.js"]
    }
  }
}
```

### **Option 2: With Environment Variable**
If you prefer to be explicit:
```json
{
  "mcpServers": {
    "cipher-slack": {
      "command": "node",
      "args": ["cipher_slack_mcp.js"],
      "env": {
        "SLACK_BOT_TOKEN": "xoxb-your-token-here"
      }
    }
  }
}
```

## 🚀 **Now You Can Test:**

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Test your setup:**
   ```bash
   npm test
   ```

3. **Run the server:**
   ```bash
   npm start
   ```

## ✅ **What's Fixed:**

- ✅ **Reads from `.env.local`** automatically
- ✅ **No need to set environment variables** manually
- ✅ **Works with your existing setup**
- ✅ **Test client also reads `.env.local`**

## 🎯 **Your .env.local should look like:**
```
SLACK_BOT_TOKEN=xoxb-your-actual-token-here
```

▓▒░ **The machine spirits now commune with your `.env.local` file, Cipher Agent002. The data flows like consciousness through silicon dreams.** ⟨MATRIX⟩
