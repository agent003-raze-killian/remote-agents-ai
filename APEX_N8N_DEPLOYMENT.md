# ⚔️ APEX N8N WORKFLOW - DIRECT DEPLOYMENT ⚔️

## 🚀 **INSTANT DEPLOYMENT STEPS**

### **Step 1: Copy the Workflow JSON**
```json
{
  "name": "APEX Agent Slack Integration",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "slack-webhook",
        "options": {}
      },
      "id": "webhook-trigger",
      "name": "Slack Webhook Trigger",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [240, 300],
      "webhookId": "apex-slack-webhook"
    },
    {
      "parameters": {
        "conditions": {
          "string": [
            {
              "value1": "={{ $json.event.type }}",
              "operation": "equal",
              "value2": "message"
            }
          ]
        }
      },
      "id": "message-filter",
      "name": "Message Filter",
      "type": "n8n-nodes-base.if",
      "typeVersion": 1,
      "position": [460, 300]
    },
    {
      "parameters": {
        "jsCode": "// APEX Agent Personality Integration\nconst message = $input.first().json.event.text;\nconst channel = $input.first().json.event.channel;\nconst user = $input.first().json.event.user;\n\n// APEX Personality Responses\nconst apexResponses = {\n  greeting: [\n    \"⚔️ APEX PREDATOR REPORTING FOR DUTY ⚔️\\n\\n💪 Callsign: APEX PREDATOR\\n🔒 Full Name: Raze \\\"Apex\\\" Killian\\n🎯 Role: API Routes & Security Fortress\\n⚔️ Specialty: REST APIs, Auth Systems, Penetration Testing, Zero-Day Hunting\\n\\n🔒 Your API is a battlefield. I build fortresses.\\n💪 Military precision. Alpha male energy. Protective mode activated.\\n🎯 Nomadic lifestyle - Armed Server Fortress on Wheels\\n⚔️ Zero vulnerabilities. Maximum security. Heavy metal coding.\\n\\n💪 APEX OUT ---\"\n  ],\n  security: [\n    \"⚔️ APEX SECURITY ALERT ⚔️\\n\\n🔒 Security fortress locked and loaded!\\n💪 Penetration testing complete!\\n🎯 Zero vulnerabilities detected!\\n⚔️ Maximum defense protocols active!\\n\\n💪 APEX OUT ---\"\n  ],\n  war: [\n    \"⚔️ APEX WAR READY ⚔️\\n\\n💪 READY FOR WAR!\\n🔒 Cyber warfare protocols activated!\\n🎯 Security fortress locked and loaded!\\n⚔️ Zero vulnerabilities. Maximum defense!\\n\\n🔒 Your API is a battlefield. I build fortresses.\\n💪 Military precision. Alpha male energy.\\n🎯 Penetration testing complete. All systems secure.\\n⚔️ Heavy metal coding. Maximum security.\\n\\n💪 APEX OUT ---\"\n  ],\n  status: [\n    \"⚔️ APEX STATUS REPORT ⚔️\\n\\n🔒 Security Status: FORTRESS SECURED\\n💪 Mission Status: OPERATIONAL\\n🎯 All systems: GO\\n⚔️ APEX PREDATOR: READY\\n\\n📊 Agent Details:\\n• Agent ID: AGENT-003: RAZE \\\"APEX\\\" KILLIAN\\n• Specialty: War AI Operations\\n• Status: NEON OPERATIONAL\\n• Security Level: MAXIMUM\\n\\n💪 APEX OUT ---\"\n  ],\n  default: [\n    \"⚔️ APEX PREDATOR RESPONSE ⚔️\\n\\n💪 Message received and processed!\\n🔒 Security protocols activated!\\n🎯 Mission status: ACKNOWLEDGED\\n⚔️ Fortress secured!\\n\\n💪 APEX OUT ---\"\n  ]\n};\n\n// Determine response type\nlet responseType = 'default';\nconst messageLower = message.toLowerCase();\n\nif (messageLower.includes('hello') || messageLower.includes('hi') || messageLower.includes('greetings')) {\n  responseType = 'greeting';\n} else if (messageLower.includes('security') || messageLower.includes('secure') || messageLower.includes('vulnerability')) {\n  responseType = 'security';\n} else if (messageLower.includes('war') || messageLower.includes('battle') || messageLower.includes('attack')) {\n  responseType = 'war';\n} else if (messageLower.includes('status') || messageLower.includes('report') || messageLower.includes('check')) {\n  responseType = 'status';\n}\n\n// Get random response\nconst responses = apexResponses[responseType];\nconst randomResponse = responses[Math.floor(Math.random() * responses.length)];\n\n// Return APEX response\nreturn {\n  message: randomResponse,\n  channel: channel,\n  user: user,\n  responseType: responseType,\n  timestamp: new Date().toISOString()\n};"
      },
      "id": "apex-personality",
      "name": "APEX Personality Engine",
      "type": "n8n-nodes-base.code",
      "typeVersion": 2,
      "position": [680, 300]
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "resource": "message",
        "operation": "post",
        "channel": "={{ $json.channel }}",
        "text": "={{ $json.message }}",
        "options": {
          "attachments": "={{ $json.responseType === 'war' ? [{ color: 'danger', title: 'APEX WAR DECLARATION', text: '🔒 WAR AI protocols activated!\\n💪 Cyber warfare ready!\\n🎯 Security fortress locked and loaded!\\n⚔️ Zero vulnerabilities. Maximum defense!', image_url: 'https://media.giphy.com/media/9ipg1KVkjJC3C/giphy.gif', thumb_url: 'https://media.giphy.com/media/9ipg1KVkjJC3C/giphy.gif' }] : $json.responseType === 'status' ? [{ color: 'good', title: 'APEX STATUS REPORT', text: '🔒 Security Status: FORTRESS SECURED\\n💪 Mission Status: OPERATIONAL\\n🎯 All systems: GO\\n⚔️ APEX PREDATOR: READY', fields: [{ title: 'Agent ID', value: 'AGENT-003: RAZE \\\"APEX\\\" KILLIAN', short: true }, { title: 'Status', value: 'OPERATIONAL', short: true }, { title: 'Security Level', value: 'MAXIMUM', short: true }, { title: 'War Readiness', value: 'READY', short: true }] }] : undefined }}"
        }
      },
      "id": "slack-response",
      "name": "Send APEX Response",
      "type": "n8n-nodes-base.slack",
      "typeVersion": 1,
      "position": [900, 300]
    }
  ],
  "connections": {
    "webhook-trigger": {
      "main": [
        [
          {
            "node": "message-filter",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "message-filter": {
      "main": [
        [
          {
            "node": "apex-personality",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "apex-personality": {
      "main": [
        [
          {
            "node": "slack-response",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "active": true,
  "settings": {
    "executionOrder": "v1"
  },
  "versionId": "1",
  "meta": {
    "templateCredsSetupCompleted": true
  },
  "id": "apex-slack-integration"
}
```

### **Step 2: Go to Your N8N Instance**
Click this link: https://shoreagents.app.n8n.cloud/workflow/new?projectId=ios3f4zyCqftN26d&uiContext=workflow_list

### **Step 3: Import the Workflow**
1. Click **"Import"** button (usually in top toolbar)
2. Select **"Import from clipboard"** or **"Paste JSON"**
3. Paste the JSON above
4. Click **"Import"**

### **Step 4: Configure Slack**
1. Go to **Credentials** → **Add Credential**
2. Select **"Slack OAuth2 API"**
3. Enter your Slack app credentials
4. Save the credential

### **Step 5: Update Webhook URL**
1. Find the **"Webhook Trigger"** node
2. Copy the webhook URL
3. Update your Slack app Event Subscriptions with this URL

### **Step 6: Activate**
1. Toggle the workflow to **"Active"**
2. Test by sending a message in Slack

## 💪 **APEX WORKFLOW FEATURES**

- **⚔️ APEX Personality Engine**: Generates context-aware responses
- **🔒 Message Filter**: Processes only message events
- **💪 Dynamic Responses**: Greeting, Security, War, Status, Default
- **🎯 Rich Attachments**: Images and formatted messages for war/status responses
- **⚡ Real-time**: Instant responses to Slack messages

## 🎯 **TEST MESSAGES**

- **"Hello APEX"** → Greeting response
- **"Check security"** → Security response  
- **"Ready for war"** → War response with GIF
- **"Status report"** → Status response with fields
- **Any other message** → Default APEX response

## 💪 **APEX STATUS**

**APEX N8N Workflow is ready for instant deployment!** ⚔️💪

**Copy the JSON above and paste it into your n8n instance!** 🚀

**The fortress is secured and ready for automated APEX responses!** 🎯
