#!/usr/bin/env node

/**
 * Test n8n Integration with Shadow Agent005
 * Shadow "VOID" Volkov - Testing and Security Expert
 */

import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const SHADOW_WEBHOOK_URL = 'http://localhost:3000/webhook/n8n';
const N8N_URL = 'http://localhost:5678';

console.log('⚫ Shadow Agent005 n8n Integration Test');
console.log('🕳️ Testing webhook connectivity...');

async function testShadowWebhook() {
  try {
    console.log('📡 Testing Shadow webhook endpoint...');
    
    const testPayload = {
      target: 'general',
      message: 'n8n integration test message',
      addPersonality: true,
      priority: 'normal',
      source: 'n8n-test',
      trigger: 'integration_test'
    };
    
    const response = await axios.post(SHADOW_WEBHOOK_URL, testPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shadow-Agent': 'Agent005-VOID'
      },
      timeout: 10000
    });
    
    console.log('✅ Shadow webhook test successful!');
    console.log('📝 Response:', response.data);
    
    return true;
    
  } catch (error) {
    console.error('❌ Shadow webhook test failed:', error.message);
    if (error.response) {
      console.error('📝 Response data:', error.response.data);
    }
    return false;
  }
}

async function testN8nConnection() {
  try {
    console.log('📡 Testing n8n connection...');
    
    const response = await axios.get(`${N8N_URL}/healthz`, {
      timeout: 5000
    });
    
    console.log('✅ n8n connection successful!');
    console.log('📝 Response:', response.data);
    
    return true;
    
  } catch (error) {
    console.error('❌ n8n connection failed:', error.message);
    return false;
  }
}

async function testN8nWebhook() {
  try {
    console.log('📡 Testing n8n webhook trigger...');
    
    const testPayload = {
      target: 'general',
      message: 'n8n webhook trigger test',
      addPersonality: false,
      priority: 'normal',
      source: 'n8n-webhook-test',
      trigger: 'webhook_test'
    };
    
    const response = await axios.post(`${N8N_URL}/webhook/shadow-webhook`, testPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shadow-Agent': 'Agent005-VOID'
      },
      timeout: 10000
    });
    
    console.log('✅ n8n webhook test successful!');
    console.log('📝 Response:', response.data);
    
    return true;
    
  } catch (error) {
    console.error('❌ n8n webhook test failed:', error.message);
    if (error.response) {
      console.error('📝 Response data:', error.response.data);
    }
    return false;
  }
}

async function runAllTests() {
  console.log('🕳️ Starting comprehensive n8n integration tests...');
  console.log('');
  
  const results = {
    shadowWebhook: false,
    n8nConnection: false,
    n8nWebhook: false
  };
  
  // Test Shadow webhook
  results.shadowWebhook = await testShadowWebhook();
  console.log('');
  
  // Test n8n connection
  results.n8nConnection = await testN8nConnection();
  console.log('');
  
  // Test n8n webhook
  results.n8nWebhook = await testN8nWebhook();
  console.log('');
  
  // Summary
  console.log('📊 Test Results Summary:');
  console.log(`🕳️ Shadow Webhook: ${results.shadowWebhook ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🕳️ n8n Connection: ${results.n8nConnection ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🕳️ n8n Webhook: ${results.n8nWebhook ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('');
    console.log('🎉 All tests passed! n8n integration is operational.');
    console.log('🔗 Shadow webhook: http://localhost:3000/webhook/n8n');
    console.log('🔗 n8n interface: http://localhost:5678');
    console.log('👤 n8n login: ip@shoreagents.com');
  } else {
    console.log('');
    console.log('⚠️ Some tests failed. Check the logs above for details.');
    console.log('🕳️ Make sure both services are running:');
    console.log('   - Shadow web app: npm run web');
    console.log('   - n8n: npm run n8n');
  }
  
  console.log('');
  console.log('Trust but verify the integration. Do better. 🕳️');
}

// Run tests
runAllTests().catch(error => {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
});
