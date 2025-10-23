#!/usr/bin/env node

/**
 * Test Shadow n8n Workflow
 * Shadow "VOID" Volkov - Testing and Security Expert
 */

import axios from 'axios';

const N8N_WEBHOOK_URL = 'http://localhost:5678/webhook/shadow-test';

console.log('⚫ Shadow Agent005 Workflow Test');
console.log('🕳️ Testing n8n workflow execution...');

async function testWorkflow() {
  try {
    console.log('📡 Triggering Shadow test workflow...');
    
    const testPayload = {
      target: 'general',
      message: 'Hello from n8n workflow! This is a test of Shadow\'s automation capabilities.',
      timestamp: new Date().toISOString(),
      testId: Math.random().toString(36).substr(2, 9)
    };
    
    console.log('📝 Payload:', JSON.stringify(testPayload, null, 2));
    
    const response = await axios.post(N8N_WEBHOOK_URL, testPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shadow-Agent': 'Agent005-VOID'
      },
      timeout: 15000
    });
    
    console.log('✅ Workflow executed successfully!');
    console.log('📝 Response:', JSON.stringify(response.data, null, 2));
    
    return true;
    
  } catch (error) {
    console.error('❌ Workflow test failed:', error.message);
    if (error.response) {
      console.error('📝 Response data:', error.response.data);
      console.error('📝 Status:', error.response.status);
    }
    return false;
  }
}

async function testWithCustomMessage() {
  try {
    console.log('\n📡 Testing with custom message...');
    
    const customPayload = {
      target: 'general',
      message: 'Custom automation test - Shadow Agent005 is operational!',
      priority: 'high',
      source: 'custom-test'
    };
    
    const response = await axios.post(N8N_WEBHOOK_URL, customPayload, {
      headers: {
        'Content-Type': 'application/json',
        'X-Shadow-Agent': 'Agent005-VOID'
      },
      timeout: 15000
    });
    
    console.log('✅ Custom message test successful!');
    console.log('📝 Response:', JSON.stringify(response.data, null, 2));
    
    return true;
    
  } catch (error) {
    console.error('❌ Custom message test failed:', error.message);
    return false;
  }
}

async function runTests() {
  console.log('🕳️ Starting workflow tests...');
  console.log('');
  
  const results = {
    basicTest: false,
    customTest: false
  };
  
  // Test 1: Basic workflow
  results.basicTest = await testWorkflow();
  
  // Test 2: Custom message
  results.customTest = await testWithCustomMessage();
  
  // Summary
  console.log('\n📊 Test Results Summary:');
  console.log(`🕳️ Basic Workflow Test: ${results.basicTest ? '✅ PASS' : '❌ FAIL'}`);
  console.log(`🕳️ Custom Message Test: ${results.customTest ? '✅ PASS' : '❌ FAIL'}`);
  
  const allPassed = Object.values(results).every(result => result);
  
  if (allPassed) {
    console.log('\n🎉 All workflow tests passed!');
    console.log('🔗 Check Slack #general channel for Shadow\'s messages');
    console.log('🔗 n8n Dashboard: http://localhost:5678');
    console.log('🔗 Shadow Web App: http://localhost:3000');
  } else {
    console.log('\n⚠️ Some tests failed. Make sure:');
    console.log('   1. n8n is running: npm run n8n');
    console.log('   2. Shadow web app is running: npm run web');
    console.log('   3. Workflow is imported and activated in n8n');
  }
  
  console.log('\nTrust but verify the workflow. Do better. 🕳️');
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test execution failed:', error.message);
  process.exit(1);
});
















