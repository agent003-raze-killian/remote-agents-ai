#!/usr/bin/env node

// Simple test to check if MCP server responds correctly
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🧪 Testing MCP Server...\n');

const server = spawn('node', ['src/index.js'], {
  cwd: __dirname,
  env: {
    ...process.env,
    SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN || 'xoxb-YOUR-BOT-TOKEN-HERE',
    SLACK_APP_TOKEN: process.env.SLACK_APP_TOKEN || 'xapp-YOUR-APP-TOKEN-HERE'
  }
});

let outputBuffer = '';

server.stdout.on('data', (data) => {
  const str = data.toString();
  outputBuffer += str;
  
  // Check for initialization response
  if (str.includes('{')) {
    try {
      const lines = outputBuffer.split('\n');
      for (const line of lines) {
        if (line.trim().startsWith('{')) {
          const json = JSON.parse(line);
          if (json.result && json.result.capabilities) {
            console.log('✅ Server initialized successfully!');
            console.log('📋 Capabilities:', JSON.stringify(json.result.capabilities, null, 2));
          }
          if (json.result && json.result.tools) {
            console.log('\n✅ Tools available:', json.result.tools.length);
            console.log('\n📝 Tool list:');
            json.result.tools.forEach((tool, i) => {
              console.log(`   ${i + 1}. ${tool.name}`);
            });
          }
        }
      }
    } catch (e) {
      // Not JSON, ignore
    }
  }
});

server.stderr.on('data', (data) => {
  console.log('Server output:', data.toString());
});

server.on('error', (error) => {
  console.error('❌ Error starting server:', error);
  process.exit(1);
});

// Wait a moment for server to start
setTimeout(() => {
  console.log('\n📤 Sending initialization request...');
  
  const initRequest = {
    jsonrpc: '2.0',
    id: 1,
    method: 'initialize',
    params: {
      protocolVersion: '2024-11-05',
      capabilities: {},
      clientInfo: {
        name: 'test-client',
        version: '1.0.0'
      }
    }
  };
  
  server.stdin.write(JSON.stringify(initRequest) + '\n');
}, 2000);

// Request tools list
setTimeout(() => {
  console.log('📤 Requesting tools list...\n');
  
  const toolsRequest = {
    jsonrpc: '2.0',
    id: 2,
    method: 'tools/list',
    params: {}
  };
  
  server.stdin.write(JSON.stringify(toolsRequest) + '\n');
}, 3000);

// Cleanup
setTimeout(() => {
  console.log('\n✅ Test complete!');
  server.kill();
  process.exit(0);
}, 5000);

