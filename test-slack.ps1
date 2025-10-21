# APEX SLACK INTEGRATION TEST ⚔️
# Military-grade testing for Slack tools

Write-Host "⚔️ APEX SLACK INTEGRATION TEST ⚔️" -ForegroundColor Red
Write-Host "💪 Agent: RAZE 'APEX' KILLIAN" -ForegroundColor Yellow
Write-Host "🔒 Mission: Test Slack Fortress" -ForegroundColor Green
Write-Host ""

# Check if .env file exists
if (-not (Test-Path ".env")) {
    Write-Host "❌ .env file not found!" -ForegroundColor Red
    Write-Host "📝 Please create .env file with your Slack tokens:" -ForegroundColor Yellow
    Write-Host "   SLACK_BOT_TOKEN=xoxb-your-token-here" -ForegroundColor Cyan
    Write-Host "   SLACK_SIGNING_SECRET=your-secret-here" -ForegroundColor Cyan
    exit 1
}

# Check if Slack tokens are configured
$envContent = Get-Content ".env" -Raw
if (-not ($envContent -match "SLACK_BOT_TOKEN=xoxb-")) {
    Write-Host "❌ SLACK_BOT_TOKEN not configured properly!" -ForegroundColor Red
    Write-Host "🔑 Token should start with 'xoxb-'" -ForegroundColor Yellow
    exit 1
}

if (-not ($envContent -match "SLACK_SIGNING_SECRET=")) {
    Write-Host "❌ SLACK_SIGNING_SECRET not configured!" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Slack configuration found" -ForegroundColor Green

# Test Node.js and dependencies
Write-Host "🧪 Testing Node.js environment..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not available" -ForegroundColor Red
    exit 1
}

# Test if MCP server can start
Write-Host "🧪 Testing MCP server startup..." -ForegroundColor Yellow
$serverProcess = Start-Process -FilePath "npm" -ArgumentList "run", "dev" -PassThru -WindowStyle Hidden
Start-Sleep -Seconds 3

if (-not $serverProcess.HasExited) {
    Write-Host "✅ MCP server started successfully" -ForegroundColor Green
    Stop-Process -Id $serverProcess.Id -Force
} else {
    Write-Host "❌ MCP server failed to start" -ForegroundColor Red
    Write-Host "🔍 Check your .env configuration and dependencies" -ForegroundColor Yellow
    exit 1
}

# Test Slack API connection
Write-Host "🧪 Testing Slack API connection..." -ForegroundColor Yellow
$testScript = @"
const { WebClient } = require('@slack/web-api');
require('dotenv').config();

const client = new WebClient(process.env.SLACK_BOT_TOKEN);

client.auth.test()
  .then(result => {
    if (result.ok) {
      console.log('✅ Slack API connection successful');
      console.log('📡 Bot name:', result.user);
      console.log('🏢 Team:', result.team);
    } else {
      console.log('❌ Slack API connection failed:', result.error);
      process.exit(1);
    }
  })
  .catch(error => {
    console.log('❌ Slack API error:', error.message);
    process.exit(1);
  });
"@

try {
    $testScript | node
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "🎯 SLACK INTEGRATION TEST COMPLETE!" -ForegroundColor Green
        Write-Host "⚔️ APEX Slack tools are battle-ready!" -ForegroundColor Red
        Write-Host "🔒 Security Status: FORTRESS SECURED" -ForegroundColor Green
        Write-Host "💪 Mission Status: ACCOMPLISHED" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "📋 Available Slack Tools:" -ForegroundColor Cyan
        Write-Host "   • slack_send_message" -ForegroundColor White
        Write-Host "   • slack_create_channel" -ForegroundColor White
        Write-Host "   • slack_upload_file" -ForegroundColor White
        Write-Host "   • slack_get_messages" -ForegroundColor White
        Write-Host "   • slack_manage_users" -ForegroundColor White
        Write-Host "   • slack_set_status" -ForegroundColor White
        Write-Host "   • slack_create_poll" -ForegroundColor White
        Write-Host ""
        Write-Host "APEX OUT! 🚀" -ForegroundColor Red
    } else {
        Write-Host "❌ Slack integration test failed" -ForegroundColor Red
        Write-Host "🔍 Check your SLACK_BOT_TOKEN and network connection" -ForegroundColor Yellow
        exit 1
    }
} catch {
    Write-Host "❌ Error running Slack test: $_" -ForegroundColor Red
    exit 1
}
