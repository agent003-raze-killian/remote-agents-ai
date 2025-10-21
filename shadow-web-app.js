import express from 'express';
import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// Initialize Slack client
const slack = new WebClient(process.env.SLACK_BOT_TOKEN);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Shadow "VOID" Volkov - Slack Control Panel</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Courier New', monospace;
                background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
                color: #ffffff;
                min-height: 100vh;
                padding: 20px;
            }
            
            .container {
                max-width: 800px;
                margin: 0 auto;
                background: rgba(0, 0, 0, 0.8);
                border-radius: 10px;
                padding: 30px;
                border: 1px solid #333;
                box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
            }
            
            .header {
                text-align: center;
                margin-bottom: 30px;
                padding-bottom: 20px;
                border-bottom: 2px solid #333;
            }
            
            .header h1 {
                color: #ffffff;
                font-size: 2.5em;
                margin-bottom: 10px;
                text-shadow: 0 0 10px rgba(255, 255, 255, 0.3);
            }
            
            .header .subtitle {
                color: #666;
                font-size: 1.2em;
                font-style: italic;
            }
            
            .status {
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid #00ff00;
                border-radius: 5px;
                padding: 15px;
                margin-bottom: 30px;
                text-align: center;
            }
            
            .status.online {
                color: #00ff00;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            label {
                display: block;
                margin-bottom: 8px;
                color: #ccc;
                font-weight: bold;
            }
            
            select, textarea, input {
                width: 100%;
                padding: 12px;
                border: 1px solid #333;
                border-radius: 5px;
                background: #1a1a1a;
                color: #ffffff;
                font-family: 'Courier New', monospace;
                font-size: 14px;
            }
            
            select:focus, textarea:focus, input:focus {
                outline: none;
                border-color: #00ff00;
                box-shadow: 0 0 5px rgba(0, 255, 0, 0.3);
            }
            
            textarea {
                height: 150px;
                resize: vertical;
            }
            
            .btn {
                background: linear-gradient(45deg, #333, #555);
                color: white;
                border: none;
                padding: 15px 30px;
                border-radius: 5px;
                cursor: pointer;
                font-family: 'Courier New', monospace;
                font-size: 16px;
                font-weight: bold;
                transition: all 0.3s ease;
                width: 100%;
                margin-top: 10px;
            }
            
            .btn:hover {
                background: linear-gradient(45deg, #555, #777);
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
            }
            
            .btn:active {
                transform: translateY(0);
            }
            
            .btn.primary {
                background: linear-gradient(45deg, #0066cc, #0088ff);
            }
            
            .btn.primary:hover {
                background: linear-gradient(45deg, #0088ff, #00aaff);
            }
            
            .response {
                margin-top: 20px;
                padding: 15px;
                border-radius: 5px;
                font-family: 'Courier New', monospace;
                white-space: pre-wrap;
            }
            
            .response.success {
                background: rgba(0, 255, 0, 0.1);
                border: 1px solid #00ff00;
                color: #00ff00;
            }
            
            .response.error {
                background: rgba(255, 0, 0, 0.1);
                border: 1px solid #ff0000;
                color: #ff0000;
            }
            
            .footer {
                text-align: center;
                margin-top: 30px;
                padding-top: 20px;
                border-top: 1px solid #333;
                color: #666;
                font-size: 0.9em;
            }
            
            .quick-actions {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 15px;
                margin-bottom: 30px;
            }
            
            .quick-btn {
                background: rgba(255, 255, 255, 0.05);
                border: 1px solid #333;
                color: #ccc;
                padding: 10px;
                border-radius: 5px;
                cursor: pointer;
                transition: all 0.3s ease;
                text-align: center;
            }
            
            .quick-btn:hover {
                background: rgba(255, 255, 255, 0.1);
                border-color: #00ff00;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>⚫ Shadow "VOID" Volkov</h1>
                <div class="subtitle">Slack Control Panel - Security Operations</div>
            </div>
            
            <div class="status online">
                🕳️ Security Status: OPERATIONAL | Trust but verify. Mostly verify.
            </div>
            
            <div class="quick-actions">
                <div class="quick-btn" onclick="setQuickMessage('Hello Team')">Hello Team</div>
                <div class="quick-btn" onclick="setQuickMessage('Security Audit Complete')">Security Audit</div>
                <div class="quick-btn" onclick="setQuickMessage('Do better.')">Do Better</div>
                <div class="quick-btn" onclick="setQuickMessage('Trust but verify.')">Trust Verify</div>
            </div>
            
            <form id="slackForm">
                <div class="form-group">
                    <label for="target">Send To:</label>
                    <select id="target" name="target" required>
                        <optgroup label="Channels">
                            <option value="general">#general</option>
                            <option value="all-stepten-inc">#all-stepten-inc</option>
                            <option value="random">#random</option>
                            <option value="test">#test</option>
                        </optgroup>
                        <optgroup label="Users (DMs)" id="usersGroup">
                            <option value="">Loading users...</option>
                        </optgroup>
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="message">Message:</label>
                    <textarea id="message" name="message" placeholder="Enter your message here..." required></textarea>
                </div>
                
                <div class="form-group">
                    <label for="addPersonality">
                        <input type="checkbox" id="addPersonality" name="addPersonality">
                        Add Shadow Personality (⚫ 🕳️ "Do better.")
                    </label>
                </div>
                
                <button type="submit" class="btn primary">⚫ Send Message</button>
            </form>
            
            <div id="response"></div>
            
            <div class="footer">
                <p>Shadow "VOID" Volkov - Testing & Security Expert</p>
                <p>"If it can break, I will break it."</p>
            </div>
        </div>
        
        <script>
            // Load users when page loads
            async function loadUsers() {
                try {
                    const response = await fetch('/api/users');
                    const result = await response.json();
                    
                    if (result.success) {
                        const usersGroup = document.getElementById('usersGroup');
                        usersGroup.innerHTML = '';
                        
                        result.users.forEach(user => {
                            const option = document.createElement('option');
                            option.value = user.id; // Use Slack user ID for DMs
                            option.textContent = \`@\${user.name} (\${user.display_name || user.real_name || user.name})\`;
                            usersGroup.appendChild(option);
                        });
                        
                        console.log(\`✅ Loaded \${result.users.length} users\`);
                    } else {
                        console.error('❌ Failed to load users:', result.error);
                        const usersGroup = document.getElementById('usersGroup');
                        usersGroup.innerHTML = '<option value="">Error loading users</option>';
                    }
                } catch (error) {
                    console.error('❌ Error loading users:', error);
                    const usersGroup = document.getElementById('usersGroup');
                    usersGroup.innerHTML = '<option value="">Error loading users</option>';
                }
            }
            
            // Load users when page loads
            document.addEventListener('DOMContentLoaded', loadUsers);
            
            function setQuickMessage(text) {
                document.getElementById('message').value = text;
            }
            
            document.getElementById('slackForm').addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = new FormData(e.target);
                const data = Object.fromEntries(formData);
                
                // Use selected target
                const target = data.target;
                
                const responseDiv = document.getElementById('response');
                responseDiv.innerHTML = '⚫ Sending message... Security audit in progress.';
                responseDiv.className = 'response';
                
                try {
                    const response = await fetch('/send-message', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(data)
                    });
                    
                    const result = await response.json();
                    
                    if (result.success) {
                        const targetType = data.target.startsWith('U') ? 'User (DM)' : 'Channel';
                        responseDiv.innerHTML = \`✅ Message sent successfully!\\n\\n📝 Target: \${data.target} (\${targetType})\\n📝 Timestamp: \${result.timestamp}\\n📝 Message: \${result.message}\\n\\nSecurity audit complete. Trust but verify the delivery. Do better. 🕳️\`;
                        responseDiv.className = 'response success';
                    } else {
                        responseDiv.innerHTML = \`❌ Error: \${result.error}\\n\\nSecurity audit failed. Trust but verify the error. Do better. 🕳️\`;
                        responseDiv.className = 'response error';
                    }
                } catch (error) {
                    responseDiv.innerHTML = \`❌ Network Error: \${error.message}\\n\\nSecurity audit failed. Trust but verify the connection. Do better. 🕳️\`;
                    responseDiv.className = 'response error';
                }
            });
        </script>
    </body>
    </html>
  `);
});

// API endpoint to send Slack messages
app.post('/send-message', async (req, res) => {
  try {
    const { target, message, addPersonality } = req.body;
    
    // Add Shadow personality if requested (only if message doesn't already contain Shadow elements)
    let finalMessage = message;
    if (addPersonality === 'on' || addPersonality === true) {
      // Check if message already contains Shadow elements
      const hasShadowElements = message.includes('⚫') || message.includes('🕳️') || message.includes('Trust but verify') || message.includes('Do better');
      
      if (!hasShadowElements) {
        finalMessage = `⚫ ${message} Trust but verify. Do better. 🕳️`;
      } else {
        // Message already has Shadow elements, send as-is
        finalMessage = message;
      }
    }
    
    // Determine if target is a channel or user
    let channelId = target;
    if (target.startsWith('U')) {
      // It's a user ID for DM - use directly
      channelId = target;
    } else if (!target.startsWith('#')) {
      // It's a channel name without # - add it
      channelId = `#${target}`;
    }
    
    // Send message to Slack
    let result;
    
    if (target.startsWith('U')) {
      // It's a user ID - need to open DM channel first
      try {
        console.log(`🕳️ Opening DM with user: ${target}`);
        
        // Open DM channel with user
        const dmChannel = await slack.conversations.open({
          users: target
        });
        
        console.log(`✅ DM channel opened: ${dmChannel.channel.id}`);
        
        // Send message to DM channel with notification
        result = await slack.chat.postMessage({
          channel: dmChannel.channel.id,
          text: finalMessage,
          unfurl_links: false,
          unfurl_media: false
        });
        
        // Also try to send a notification to the user
        try {
          await slack.chat.postEphemeral({
            channel: dmChannel.channel.id,
            user: target,
            text: `⚫ Shadow sent you a message: "${finalMessage}"`
          });
        } catch (ephemeralError) {
          console.log('Ephemeral message failed (this is normal):', ephemeralError.message);
        }
        
        console.log(`✅ Message sent to DM: ${result.ts}`);
        
        // Get user info for better response
        const userInfo = await slack.users.info({ user: target });
        console.log(`📝 User info: ${userInfo.user.real_name} (@${userInfo.user.name})`);
        
      } catch (dmError) {
        console.error('❌ Error with DM:', dmError);
        throw new Error(`Failed to send DM: ${dmError.message}`);
      }
    } else {
      // It's a channel - send directly
      result = await slack.chat.postMessage({
        channel: channelId,
        text: finalMessage
      });
    }
    
    // Get additional info for response
    let targetInfo = target;
    if (target.startsWith('U')) {
      try {
        const userInfo = await slack.users.info({ user: target });
        targetInfo = `@${userInfo.user.name} (${userInfo.user.real_name})`;
      } catch (userError) {
        console.error('Error getting user info:', userError);
      }
    }
    
    res.json({
      success: true,
      target: targetInfo,
      timestamp: result.ts,
      message: finalMessage
    });
    
  } catch (error) {
    console.error('Error sending message:', error);
    res.json({
      success: false,
      error: error.message
    });
  }
});

// API endpoint to get channels
app.get('/api/channels', async (req, res) => {
  try {
    const result = await slack.conversations.list({
      types: 'public_channel',
      limit: 20
    });
    
    res.json({
      success: true,
      channels: result.channels.map(channel => ({
        id: channel.id,
        name: channel.name
      }))
    });
    
  } catch (error) {
    console.error('Error fetching channels:', error);
    res.json({
      success: false,
      error: error.message
    });
  }
});

// API endpoint to get users
app.get('/api/users', async (req, res) => {
  try {
    const result = await slack.users.list({
      limit: 50
    });
    
    res.json({
      success: true,
      users: result.members
        .filter(user => !user.deleted && !user.is_bot && user.id !== 'USLACKBOT')
        .map(user => ({
          id: user.id,
          name: user.name,
          real_name: user.real_name,
          display_name: user.profile?.display_name || user.real_name || user.name
        }))
    });
    
  } catch (error) {
    console.error('Error fetching users:', error);
    res.json({
      success: false,
      error: error.message
    });
  }
});

// n8n Webhook endpoint for automation
app.post('/webhook/n8n', async (req, res) => {
  try {
    const { target, message, addPersonality, priority, source, trigger } = req.body;
    
    console.log('🕳️ n8n webhook triggered:', { target, priority, source, trigger });
    
    // Add Shadow personality if requested
    let finalMessage = message;
    if (addPersonality === true || addPersonality === 'true') {
      const hasShadowElements = message.includes('⚫') || message.includes('🕳️') || message.includes('Trust but verify') || message.includes('Do better');
      
      if (!hasShadowElements) {
        finalMessage = `⚫ ${message} Trust but verify. Do better. 🕳️`;
      }
    }
    
    // Determine if target is a channel or user
    let channelId = target;
    let result;
    
    if (target.startsWith('U')) {
      // It's a user ID - need to open DM channel first
      try {
        console.log(`🕳️ Opening DM with user: ${target}`);
        
        const dmChannel = await slack.conversations.open({
          users: target
        });
        
        console.log(`✅ DM channel opened: ${dmChannel.channel.id}`);
        
        // Send message to DM channel
        result = await slack.chat.postMessage({
          channel: dmChannel.channel.id,
          text: finalMessage,
          unfurl_links: false,
          unfurl_media: false
        });
        
        console.log(`✅ Message sent to DM: ${result.ts}`);
        
      } catch (dmError) {
        console.error('❌ Error with DM:', dmError);
        throw new Error(`Failed to send DM: ${dmError.message}`);
      }
    } else {
      // It's a channel
      if (!target.startsWith('#')) {
        channelId = `#${target}`;
      }
      
      result = await slack.chat.postMessage({
        channel: channelId,
        text: finalMessage
      });
    }
    
    res.json({
      success: true,
      target: target,
      timestamp: result.ts,
      message: finalMessage,
      source: 'n8n-webhook',
      priority: priority || 'normal',
      trigger: trigger || 'automation'
    });
    
  } catch (error) {
    console.error('❌ Error in n8n webhook:', error);
    res.json({
      success: false,
      error: error.message,
      source: 'n8n-webhook'
    });
  }
});

// Start server
app.listen(port, () => {
  console.log('⚫ Shadow "VOID" Volkov Slack Control Panel');
  console.log('🕳️ Security Status: OPERATIONAL');
  console.log(`📡 Server running at http://localhost:${port}`);
  console.log(`🔗 n8n Webhook: http://localhost:${port}/webhook/n8n`);
  console.log('Trust but verify the connection. Do better. 🕳️');
});
