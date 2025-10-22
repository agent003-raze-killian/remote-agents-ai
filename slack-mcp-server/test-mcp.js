// Quick test to verify MCP server is working
import { spawn } from 'child_process';

const server = spawn('node', ['src/index.js'], {
  cwd: process.cwd(),
  stdio: ['pipe', 'pipe', 'inherit']
});

// Send MCP initialization
const init = {
  jsonrpc: "2.0",
  id: 1,
  method: "initialize",
  params: {
    protocolVersion: "2024-11-05",
    capabilities: {},
    clientInfo: {
      name: "test-client",
      version: "1.0.0"
    }
  }
};

// Send list tools request
const listTools = {
  jsonrpc: "2.0",
  id: 2,
  method: "tools/list",
  params: {}
};

server.stdin.write(JSON.stringify(init) + '\n');

setTimeout(() => {
  server.stdin.write(JSON.stringify(listTools) + '\n');
}, 1000);

server.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
});

setTimeout(() => {
  server.kill();
  process.exit(0);
}, 3000);

