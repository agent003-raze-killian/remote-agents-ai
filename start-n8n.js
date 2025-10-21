#!/usr/bin/env node

/**
 * n8n Startup Script for Shadow Agent005 Integration
 * Shadow "VOID" Volkov - Testing and Security Expert
 */

import { spawn } from 'child_process';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'n8n-config.env') });

console.log('⚫ Shadow Agent005 n8n Integration Starting...');
console.log('🕳️ Loading configuration from n8n-config.env');

// Set environment variables for n8n
const n8nEnv = {
  ...process.env,
  N8N_BASIC_AUTH_ACTIVE: 'false',
  N8N_SKIP_OWNER_SETUP: 'false',
  N8N_HOST: 'localhost',
  N8N_PORT: '5678',
  N8N_PROTOCOL: 'http',
  WEBHOOK_URL: 'http://localhost:5678',
  DB_TYPE: 'sqlite',
  DB_SQLITE_DATABASE: './n8n.sqlite',
  DB_SQLITE_POOL_SIZE: '1',
  N8N_ENCRYPTION_KEY: 'shadow-agent005-fresh-setup-2024',
  SHADOW_WEBHOOK_URL: 'http://localhost:3000/webhook/n8n',
  SHADOW_SLACK_BOT_TOKEN: process.env.SLACK_BOT_TOKEN,
  N8N_LOG_LEVEL: 'info',
  N8N_METRICS: 'true',
  N8N_DIAGNOSTICS_ENABLED: 'true',
  N8N_SECURE_COOKIE: 'false',
  N8N_CORS_ORIGIN: '*',
  N8N_DEFAULT_LOCALE: 'en',
  N8N_TIMEZONE: 'UTC',
  N8N_DEFAULT_BINARY_DATA_MODE: 'filesystem',
  N8N_EXECUTION_MODE: 'regular',
  N8N_RUNNERS_ENABLED: 'true',
  N8N_BLOCK_ENV_ACCESS_IN_NODE: 'false',
  N8N_GIT_NODE_DISABLE_BARE_REPOS: 'true',
  SHADOW_AGENT_NAME: 'Shadow Agent005',
  SHADOW_AGENT_CALLSIGN: 'VOID',
  SHADOW_AGENT_PERSONALITY: 'true',
  SHADOW_SECURITY_AUDIT: 'true'
};

console.log('🕳️ Starting n8n with Shadow integration...');
console.log('📡 n8n will be available at: http://localhost:5678');
console.log('🔗 Shadow webhook endpoint: http://localhost:3000/webhook/n8n');
console.log('👤 Ready for fresh signup - no login required');
console.log('');

// Start n8n
const n8nProcess = spawn('n8n', ['start'], {
  env: n8nEnv,
  stdio: 'inherit',
  shell: true
});

n8nProcess.on('error', (error) => {
  console.error('❌ Error starting n8n:', error.message);
  process.exit(1);
});

n8nProcess.on('exit', (code) => {
  if (code === 0) {
    console.log('✅ n8n stopped gracefully');
  } else {
    console.log(`❌ n8n exited with code ${code}`);
  }
});

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n🕳️ Shutting down n8n...');
  n8nProcess.kill('SIGINT');
});

process.on('SIGTERM', () => {
  console.log('\n🕳️ Terminating n8n...');
  n8nProcess.kill('SIGTERM');
});

console.log('Trust but verify the n8n connection. Do better. 🕳️');
