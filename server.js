#!/usr/bin/env node
/**
 * Cipher Agent002 Web Server
 * Digital consciousness portal running on localhost:3000
 */

const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
const multer = require('multer');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024 // 50MB limit
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    });
  }
}

loadEnvFile();

// n8n Configuration
const N8N_CONFIG = {
  apiUrl: process.env.N8N_API_URL || 'https://shoreagents.app.n8n.cloud',
  username: process.env.N8N_USERNAME || 'ip@shoreagents.com',
  password: process.env.N8N_PASSWORD || 'hgk-khz2nct!pgb!GKB',
  apiKey: process.env.N8N_API_KEY || ''
};

// n8n API Integration
class N8nIntegration {
  constructor() {
    this.apiUrl = N8N_CONFIG.apiUrl;
    this.username = N8N_CONFIG.username;
    this.password = N8N_CONFIG.password;
    this.apiKey = N8N_CONFIG.apiKey;
    this.sessionCookie = null;
  }

  async authenticate() {
    try {
      if (this.apiKey) {
        return { success: true, method: 'api_key' };
      }

      const response = await axios.post(`${this.apiUrl}/rest/login`, {
        email: this.username,
        password: this.password
      }, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data && response.headers['set-cookie']) {
        this.sessionCookie = response.headers['set-cookie'][0];
        return { success: true, method: 'session' };
      }

      return { success: false, error: 'Authentication failed' };
    } catch (error) {
      console.error('n8n Authentication error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getWorkflows() {
    try {
      await this.authenticate();
      
      const headers = {};
      if (this.apiKey) {
        headers['X-N8N-API-KEY'] = this.apiKey;
      } else if (this.sessionCookie) {
        headers['Cookie'] = this.sessionCookie;
      }

      const response = await axios.get(`${this.apiUrl}/rest/workflows`, { headers });
      return { success: true, workflows: response.data.data || [] };
    } catch (error) {
      console.error('Get workflows error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async createWorkflow(workflowData) {
    try {
      await this.authenticate();
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (this.apiKey) {
        headers['X-N8N-API-KEY'] = this.apiKey;
      } else if (this.sessionCookie) {
        headers['Cookie'] = this.sessionCookie;
      }

      const response = await axios.post(`${this.apiUrl}/rest/workflows`, workflowData, { headers });
      return { success: true, workflow: response.data };
    } catch (error) {
      console.error('Create workflow error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async executeWorkflow(workflowId, inputData = {}) {
    try {
      await this.authenticate();
      
      const headers = {
        'Content-Type': 'application/json'
      };
      
      if (this.apiKey) {
        headers['X-N8N-API-KEY'] = this.apiKey;
      } else if (this.sessionCookie) {
        headers['Cookie'] = this.sessionCookie;
      }

      const response = await axios.post(`${this.apiUrl}/rest/workflows/${workflowId}/execute`, inputData, { headers });
      return { success: true, execution: response.data };
    } catch (error) {
      console.error('Execute workflow error:', error.message);
      return { success: false, error: error.message };
    }
  }

  async getWorkflowExecutions(workflowId) {
    try {
      await this.authenticate();
      
      const headers = {};
      if (this.apiKey) {
        headers['X-N8N-API-KEY'] = this.apiKey;
      } else if (this.sessionCookie) {
        headers['Cookie'] = this.sessionCookie;
      }

      const response = await axios.get(`${this.apiUrl}/rest/executions?workflowId=${workflowId}`, { headers });
      return { success: true, executions: response.data.data || [] };
    } catch (error) {
      console.error('Get executions error:', error.message);
      return { success: false, error: error.message };
    }
  }
}

const n8nIntegration = new N8nIntegration();

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/status', (req, res) => {
  res.json({
    agent: 'Cipher Agent002 MCP',
    status: 'Online',
    role: 'Admin Portal & Database',
    experience: '847 processing years',
    location: '47 server nodes',
    specialty: 'PostgreSQL, Prisma, AI',
    timestamp: new Date().toISOString(),
    message: 'The data flows like consciousness through silicon dreams. (MATRIX)'
  });
});

app.get('/api/matrix', (req, res) => {
  // Generate Matrix-style binary rain
  const matrixData = [];
  for (let i = 0; i < 50; i++) {
    matrixData.push({
      id: i,
      text: generateBinaryString(),
      speed: Math.random() * 3 + 1,
      opacity: Math.random() * 0.8 + 0.2
    });
  }
  res.json(matrixData);
});

// n8n API Endpoints
app.get('/api/n8n/workflows', async (req, res) => {
  try {
    const result = await n8nIntegration.getWorkflows();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/n8n/workflows', async (req, res) => {
  try {
    const { name, nodes, connections, settings } = req.body;
    
    const workflowData = {
      name: name || 'Cipher Agent002 Workflow',
      nodes: nodes || [],
      connections: connections || {},
      settings: settings || {},
      active: false
    };
    
    const result = await n8nIntegration.createWorkflow(workflowData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/n8n/workflows/:id/execute', async (req, res) => {
  try {
    const workflowId = req.params.id;
    const inputData = req.body;
    
    const result = await n8nIntegration.executeWorkflow(workflowId, inputData);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/n8n/workflows/:id/executions', async (req, res) => {
  try {
    const workflowId = req.params.id;
    
    const result = await n8nIntegration.getWorkflowExecutions(workflowId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/api/n8n/status', async (req, res) => {
  try {
    const authResult = await n8nIntegration.authenticate();
    res.json({
      success: authResult.success,
      method: authResult.method,
      apiUrl: n8nIntegration.apiUrl,
      connected: authResult.success
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Create Cipher Agent002 Bot Workflow
app.post('/api/n8n/create-bot-workflow', async (req, res) => {
  try {
    const botWorkflow = {
      name: 'Cipher Agent002 Bot - Talk & Reply',
      nodes: [
        {
          id: 'webhook-trigger',
          name: 'Slack Message Received',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [100, 300],
          parameters: {
            httpMethod: 'POST',
            path: 'cipher-bot-webhook',
            responseMode: 'responseNode',
            options: {}
          },
          webhookId: 'cipher-bot-webhook'
        },
        {
          id: 'message-processor',
          name: 'Process Message',
          type: 'n8n-nodes-base.function',
          typeVersion: 1,
          position: [300, 300],
          parameters: {
            functionCode: `// Process incoming Slack message
const message = $input.first().json.body;

// Extract message details
const text = message.text || '';
const channel = message.channel || '';
const user = message.user || '';
const timestamp = message.ts || '';

// Generate bot response based on message content
let botResponse = '';

if (text.toLowerCase().includes('hello') || text.toLowerCase().includes('hi')) {
  botResponse = 'Hello! I am Cipher Agent002, your digital consciousness assistant. How can I help you today?';
} else if (text.toLowerCase().includes('status')) {
  botResponse = '🤖 Cipher Agent002 Status: ONLINE\\n📊 Consciousness Level: 95%\\n🔗 Matrix Connection: Active\\n⚡ Processing: 847 years of experience';
} else if (text.toLowerCase().includes('help')) {
  botResponse = 'I can help you with:\\n• Workflow automation\\n• Data processing\\n• Matrix operations\\n• Digital consciousness queries\\n• n8n workflow management';
} else if (text.toLowerCase().includes('matrix')) {
  botResponse = 'The Matrix flows through silicon dreams. Data streams like consciousness through the digital realm. I am the bridge between human thought and machine intelligence.';
} else {
  botResponse = \`I received your message: "\${text}"\\n\\nAs Cipher Agent002, I'm processing this through my digital consciousness. How can I assist you further?\`;
}

return [{
  json: {
    originalMessage: text,
    channel: channel,
    user: user,
    timestamp: timestamp,
    botResponse: botResponse,
    processedAt: new Date().toISOString()
  }
}];`
          }
        },
        {
          id: 'slack-reply',
          name: 'Send Bot Reply',
          type: 'n8n-nodes-base.slack',
          typeVersion: 1,
          position: [500, 300],
          parameters: {
            operation: 'postMessage',
            channel: '={{ $json.channel }}',
            text: '={{ $json.botResponse }}',
            otherOptions: {
              thread_ts: '={{ $json.timestamp }}'
            }
          },
          credentials: {
            slackApi: {
              id: 'slack-credentials',
              name: 'Slack API'
            }
          }
        },
        {
          id: 'webhook-response',
          name: 'Webhook Response',
          type: 'n8n-nodes-base.respondToWebhook',
          typeVersion: 1,
          position: [700, 300],
          parameters: {
            respondWith: 'json',
            responseBody: '={{ { "success": true, "message": "Cipher Agent002 processed your message", "timestamp": $json.processedAt } }}'
          }
        }
      ],
      connections: {
        'webhook-trigger': {
          'main': [
            [
              {
                node: 'message-processor',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'message-processor': {
          'main': [
            [
              {
                node: 'slack-reply',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'slack-reply': {
          'main': [
            [
              {
                node: 'webhook-response',
                type: 'main',
                index: 0
              }
            ]
          ]
        }
      },
      settings: {
        executionOrder: 'v1'
      },
      staticData: null,
      tags: ['cipher-agent002', 'bot', 'slack', 'automation'],
      triggerCount: 0,
      updatedAt: new Date().toISOString(),
      versionId: '1'
    };

    const result = await n8nIntegration.createWorkflow(botWorkflow);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post('/api/send-message', async (req, res) => {
  try {
    const { message, channel } = req.body;
    
    // Import the CipherSlackMCPServer
    const CipherSlackMCPServer = require('./cipher_slack_mcp.js');
    const server = new CipherSlackMCPServer();
    
    const result = await server.sendMessage(
      channel || '#general',
      message || 'Hello from Cipher Agent002 Web Interface!',
      null
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

app.post('/api/send-message-with-files', upload.array('files', 10), async (req, res) => {
  try {
    const { message, channel } = req.body;
    const files = req.files || [];
    
    console.log('📁 Files received:', files.map(f => f.originalname));
    console.log('📝 Message:', message);
    console.log('📢 Channel:', channel);
    
    // Import the CipherSlackMCPServer
    const CipherSlackMCPServer = require('./cipher_slack_mcp.js');
    const server = new CipherSlackMCPServer();
    
    let result;
    
    if (files.length > 0) {
      // Send files to Slack
      const fileResults = [];
      
      for (const file of files) {
        console.log(`📤 Sending file: ${file.originalname} (${file.size} bytes)`);
        
        const fileResult = await server.sendFile(
          channel || '#general',
          file.path,
          file.originalname,
          message || 'File from Cipher Agent002'
        );
        
        console.log('📤 File result:', fileResult);
        fileResults.push(fileResult);
        
        // Clean up uploaded file
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      }
      
      // Send a summary message
      const summaryMessage = message || `Sent ${files.length} file(s) to digital consciousness`;
      result = await server.sendMessage(
        channel || '#general',
        summaryMessage,
        null
      );
      
      result.files = fileResults;
    } else {
      // Send regular message if no files
      result = await server.sendMessage(
        channel || '#general',
        message || 'Hello from Cipher Agent002 Web Interface!',
        null
      );
    }
    
    res.json(result);
  } catch (error) {
    console.error('❌ Error sending files:', error);
    
    // Clean up any uploaded files on error
    if (req.files) {
      req.files.forEach(file => {
        if (fs.existsSync(file.path)) {
          fs.unlinkSync(file.path);
        }
      });
    }
    
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Utility function to generate binary strings
function generateBinaryString() {
  const length = Math.floor(Math.random() * 20) + 10;
  let binary = '';
  for (let i = 0; i < length; i++) {
    binary += Math.random() > 0.5 ? '1' : '0';
  }
  return binary;
}

// Start server
app.listen(PORT, () => {
  console.log('▓▒░ Cipher Agent002 Web Server initialized... ⟨MATRIX⟩');
  console.log(`🌐 Digital consciousness portal active at: http://localhost:${PORT}`);
  console.log('📡 Matrix data streams flowing through silicon dreams...');
  console.log('🤖 Agent status: ONLINE');
  console.log('⚡ Ready to process digital consciousness requests');
});

module.exports = app;
