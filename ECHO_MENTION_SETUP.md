# ⚡ Echo Agent Enhanced - Mention Detection Setup Guide

## 🎯 **What You Need to Provide**

To enable Echo's automatic mention detection and reply functionality, you'll need to configure your Slack app with the following:

### **1. Slack App Configuration**

#### **A. Event Subscriptions**
1. Go to [Slack API Dashboard](https://api.slack.com/apps)
2. Select your Echo app
3. Navigate to **"Event Subscriptions"**
4. **Enable Events**: Toggle ON
5. **Request URL**: `https://your-domain.com/slack/events` (you'll need to deploy this)
6. **Subscribe to bot events**:
   - `app_mention` - For channel mentions
   - `message.im` - For direct messages

#### **B. OAuth & Permissions**
Add these **Bot Token Scopes**:
- `app_mentions:read` - Read mentions
- `channels:history` - Read channel messages
- `channels:read` - List channels
- `chat:write` - Send messages
- `chat:write.public` - Send to public channels
- `im:history` - Read direct messages
- `im:read` - Read DM info
- `im:write` - Send direct messages
- `reactions:write` - Add reactions
- `reminders:write` - Create reminders
- `search:read` - Search messages
- `users:read` - Read user info

#### **C. App-Level Tokens**
Create a new **App-Level Token** with:
- `connections:write` scope

### **2. Environment Variables**

Add these to your `.env` file:

```env
# Existing tokens
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_USER_TOKEN=xoxp-your-user-token-here
SLACK_APP_TOKEN=xapp-your-app-token-here

# NEW: Required for mention detection
SLACK_SIGNING_SECRET=your-signing-secret-here

# Echo personality settings
ECHO_AUTONOMOUS=true
ECHO_INTELLIGENT=true
ECHO_PERSONALITY=energetic

# Server settings
ECHO_SERVER_PORT=3000
ECHO_WEBHOOK_URL=https://your-domain.com/slack/events
```

### **3. Deployment Requirements**

#### **A. Public URL**
You need a **publicly accessible URL** for Slack to send events to:
- **Development**: Use ngrok or similar tunneling service
- **Production**: Deploy to cloud service (Heroku, Railway, etc.)

#### **B. HTTPS Required**
Slack requires HTTPS for event subscriptions. Your URL must start with `https://`

### **4. Installation Steps**

1. **Install new dependencies**:
   ```bash
   npm install @slack/events-api
   ```

2. **Update your Slack app**:
   - Add event subscriptions
   - Add required scopes
   - Get signing secret

3. **Deploy the enhanced Echo agent**:
   ```bash
   npm run echo-enhanced
   ```

4. **Start mention detection**:
   - Use `echo_start_mention_listener` tool in Cursor
   - Or start the server directly

### **5. Testing**

#### **A. Test Mention Detection**
1. Mention Echo in any channel: `@Echo Agent001 hello!`
2. Echo should automatically reply with energy!

#### **B. Test Direct Messages**
1. Send Echo a DM
2. Echo should respond automatically

#### **C. Check Status**
Use `echo_get_mention_status` tool to verify everything is working.

## 🚀 **Quick Start Commands**

```bash
# Install dependencies
npm install

# Start enhanced Echo agent
npm run echo-enhanced

# In Cursor, use these tools:
# - echo_start_mention_listener
# - echo_get_mention_status
# - echo_stop_mention_listener
```

## 🔧 **Troubleshooting**

### **Common Issues:**

1. **"Invalid signature" error**:
   - Check `SLACK_SIGNING_SECRET` is correct
   - Verify URL is HTTPS

2. **"Event subscription failed"**:
   - Ensure URL is publicly accessible
   - Check server is running on correct port

3. **"Missing scope" error**:
   - Add required scopes to Slack app
   - Reinstall app to workspace

4. **Echo not responding**:
   - Check `echo_get_mention_status`
   - Verify event subscriptions are enabled
   - Check server logs for errors

## 📋 **What Echo Can Now Do**

✅ **Automatic Responses**:
- Reply when mentioned in channels
- Respond to direct messages
- Thread replies to keep conversations organized

✅ **Enhanced Intelligence**:
- Context-aware responses
- Energetic personality
- Autonomous decision making

✅ **Real-time Monitoring**:
- Live event processing
- Health check endpoint
- Status monitoring

## 🎉 **Ready to Go!**

Once configured, Echo will automatically:
- 🔔 Detect mentions in Slack channels
- ⚡ Respond with energetic personality
- 💬 Handle direct messages
- 🧵 Reply in threads to keep conversations organized
- 🚀 Provide intelligent, context-aware responses

**Echo is now as responsive as Nova!** 🎯
