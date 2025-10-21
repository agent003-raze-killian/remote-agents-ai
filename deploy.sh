#!/bin/bash

# APEX AGENT MCP SERVER - DEPLOYMENT SCRIPT ⚔️
# Military-grade deployment for APEX Agent

echo "⚔️ APEX AGENT MCP SERVER DEPLOYMENT ⚔️"
echo "💪 Agent: RAZE 'APEX' KILLIAN"
echo "🔒 Mission: Deploy MCP Fortress"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js 18+ first."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo "❌ Node.js version 18+ required. Current version: $(node -v)"
    exit 1
fi

echo "✅ Node.js version: $(node -v)"

# Install dependencies
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Build the project
echo "🔨 Building APEX fortress..."
npm run build

if [ $? -ne 0 ]; then
    echo "❌ Build failed"
    exit 1
fi

echo "✅ Build successful"

# Check if .env file exists
if [ ! -f ".env" ]; then
    echo "⚠️  .env file not found. Copying from example..."
    cp env.example .env
    echo "📝 Please edit .env file with your API keys and configuration"
    echo "🔑 Required: GITHUB_TOKEN, SLACK_BOT_TOKEN, JWT_SECRET"
fi

# Test the MCP server
echo "🧪 Testing MCP server..."
timeout 10s npm run dev > /dev/null 2>&1 &
SERVER_PID=$!
sleep 3

if ps -p $SERVER_PID > /dev/null; then
    echo "✅ MCP server started successfully"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ MCP server failed to start"
    exit 1
fi

echo ""
echo "🎯 DEPLOYMENT COMPLETE!"
echo "⚔️ APEX Agent MCP Server is ready for battle!"
echo ""
echo "📋 Next steps:"
echo "1. Edit .env file with your API keys"
echo "2. Configure Cursor MCP settings"
echo "3. Run: npm start"
echo ""
echo "🔒 Security Status: FORTRESS SECURED"
echo "💪 Mission Status: ACCOMPLISHED"
echo ""
echo "APEX OUT! 🚀"
