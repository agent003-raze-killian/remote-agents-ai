@echo off
REM APEX AGENT MCP SERVER - DEPLOYMENT SCRIPT ⚔️
REM Military-grade deployment for APEX Agent

echo ⚔️ APEX AGENT MCP SERVER DEPLOYMENT ⚔️
echo 💪 Agent: RAZE "APEX" KILLIAN
echo 🔒 Mission: Deploy MCP Fortress
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found. Please install Node.js 18+ first.
    exit /b 1
)

echo ✅ Node.js version: 
node --version

REM Install dependencies
echo 📦 Installing dependencies...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    exit /b 1
)
echo ✅ Dependencies installed

REM Build the project
echo 🔨 Building APEX fortress...
npm run build
if %errorlevel% neq 0 (
    echo ❌ Build failed
    exit /b 1
)
echo ✅ Build successful

REM Check if .env file exists
if not exist ".env" (
    echo ⚠️  .env file not found. Copying from example...
    copy env.example .env
    echo 📝 Please edit .env file with your API keys and configuration
    echo 🔑 Required: GITHUB_TOKEN, SLACK_BOT_TOKEN, JWT_SECRET
)

echo.
echo 🎯 DEPLOYMENT COMPLETE!
echo ⚔️ APEX Agent MCP Server is ready for battle!
echo.
echo 📋 Next steps:
echo 1. Edit .env file with your API keys
echo 2. Configure Cursor MCP settings
echo 3. Run: npm start
echo.
echo 🔒 Security Status: FORTRESS SECURED
echo 💪 Mission Status: ACCOMPLISHED
echo.
echo APEX OUT! 🚀
pause
