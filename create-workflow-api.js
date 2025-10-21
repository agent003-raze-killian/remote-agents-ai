#!/usr/bin/env node

/**
 * Create Simple n8n Workflow via API
 * Shadow "VOID" Volkov - Testing and Security Expert
 */

import axios from 'axios';

const N8N_API_URL = 'http://localhost:5678/api/v1';
const N8N_USER = 'ip@shoreagents.com';
const N8N_PASS = 'hgk-khz2nct!pgb!GKB';

console.log('⚫ Shadow Agent005 - Creating Simple Workflow');
console.log('🕳️ Setting up basic workflow via API...');

async function createSimpleWorkflow() {
  try {
    console.log('📡 Creating simple workflow...');
    
    const workflow = {
      name: 'Shadow Simple Test',
      nodes: [
        {
          parameters: {
            httpMethod: 'POST',
            path: 'shadow-simple',
            responseMode: 'responseNode',
            options: {}
          },
          id: 'webhook-trigger',
          name: 'Webhook Trigger',
          type: 'n8n-nodes-base.webhook',
          typeVersion: 1,
          position: [240, 300],
          webhookId: 'shadow-simple-webhook'
        },
        {
          parameters: {
            url: 'http://localhost:3000/webhook/n8n',
            sendHeaders: true,
            headerParameters: {
              parameters: [
                {
                  name: 'Content-Type',
                  value: 'application/json'
                }
              ]
            },
            sendBody: true,
            bodyParameters: {
              parameters: [
                {
                  name: 'target',
                  value: '={{ $json.target || "general" }}'
                },
                {
                  name: 'message',
                  value: '⚫ {{ $json.message || "Simple workflow test" }} Trust but verify. Do better. 🕳️'
                },
                {
                  name: 'addPersonality',
                  value: 'false'
                },
                {
                  name: 'priority',
                  value: 'normal'
                },
                {
                  name: 'source',
                  value: 'simple-workflow'
                },
                {
                  name: 'trigger',
                  value: 'simple-test'
                }
              ]
            },
            options: {}
          },
          id: 'send-to-shadow',
          name: 'Send to Shadow',
          type: 'n8n-nodes-base.httpRequest',
          typeVersion: 4.1,
          position: [460, 300]
        },
        {
          parameters: {
            respondWith: 'json',
            responseBody: '={{ { "success": true, "message": "Shadow processed request", "timestamp": $now } }}'
          },
          id: 'webhook-response',
          name: 'Webhook Response',
          type: 'n8n-nodes-base.respondToWebhook',
          typeVersion: 1,
          position: [680, 300]
        }
      ],
      connections: {
        'Webhook Trigger': {
          main: [
            [
              {
                node: 'Send to Shadow',
                type: 'main',
                index: 0
              }
            ]
          ]
        },
        'Send to Shadow': {
          main: [
            [
              {
                node: 'Webhook Response',
                type: 'main',
                index: 0
              }
            ]
          ]
        }
      },
      pinData: {},
      settings: {
        executionOrder: 'v1'
      },
      staticData: null,
      triggerCount: 1,
      updatedAt: new Date().toISOString(),
      versionId: '1'
    };
    
    // First, try to authenticate
    console.log('🔐 Authenticating with n8n...');
    const authResponse = await axios.post(`${N8N_API_URL}/login`, {
      email: N8N_USER,
      password: N8N_PASS
    });
    
    const token = authResponse.data.data.token;
    console.log('✅ Authentication successful');
    
    // Create the workflow
    console.log('📝 Creating workflow...');
    const createResponse = await axios.post(`${N8N_API_URL}/workflows`, workflow, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    const workflowId = createResponse.data.data.id;
    console.log('✅ Workflow created successfully!');
    console.log(`📝 Workflow ID: ${workflowId}`);
    
    // Activate the workflow
    console.log('🔄 Activating workflow...');
    await axios.patch(`${N8N_API_URL}/workflows/${workflowId}/activate`, {}, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Workflow activated successfully!');
    console.log('🔗 Webhook URL: http://localhost:5678/webhook/shadow-simple');
    
    return workflowId;
    
  } catch (error) {
    console.error('❌ Failed to create workflow:', error.message);
    if (error.response) {
      console.error('📝 Response data:', error.response.data);
    }
    return null;
  }
}

async function testNewWorkflow() {
  try {
    console.log('\n📡 Testing new workflow...');
    
    const testPayload = {
      target: 'general',
      message: 'Testing the new simple workflow!',
      timestamp: new Date().toISOString()
    };
    
    const response = await axios.post('http://localhost:5678/webhook/shadow-simple', testPayload, {
      headers: {
        'Content-Type': 'application/json'
      },
      timeout: 10000
    });
    
    console.log('✅ Workflow test successful!');
    console.log('📝 Response:', JSON.stringify(response.data, null, 2));
    console.log('🔗 Check Slack #general channel for Shadow\'s message!');
    
    return true;
    
  } catch (error) {
    console.error('❌ Workflow test failed:', error.message);
    return false;
  }
}

async function runWorkflowSetup() {
  console.log('🕳️ Starting workflow setup...');
  console.log('');
  
  const workflowId = await createSimpleWorkflow();
  
  if (workflowId) {
    console.log('');
    const testResult = await testNewWorkflow();
    
    console.log('\n📊 Setup Results:');
    console.log(`🕳️ Workflow Creation: ${workflowId ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`🕳️ Workflow Test: ${testResult ? '✅ PASS' : '❌ FAIL'}`);
    
    if (workflowId && testResult) {
      console.log('\n🎉 Shadow workflow is now operational!');
      console.log('🔗 Webhook URL: http://localhost:5678/webhook/shadow-simple');
      console.log('🔗 n8n Dashboard: http://localhost:5678');
      console.log('🔗 Shadow Web App: http://localhost:3000');
    }
  } else {
    console.log('\n⚠️ Workflow setup failed.');
    console.log('🕳️ Try manual setup:');
    console.log('   1. Go to http://localhost:5678');
    console.log('   2. Login with ip@shoreagents.com');
    console.log('   3. Create new workflow manually');
  }
  
  console.log('\nTrust but verify the workflow. Do better. 🕳️');
}

// Run setup
runWorkflowSetup().catch(error => {
  console.error('❌ Setup execution failed:', error.message);
  process.exit(1);
});
