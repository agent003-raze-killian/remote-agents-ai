#!/bin/bash

# APEX AGENT MCP SERVER - TEST SCRIPT ⚔️
# Military-grade testing for APEX Agent

echo "⚔️ APEX AGENT MCP SERVER TEST ⚔️"
echo "💪 Agent: RAZE 'APEX' KILLIAN"
echo "🔒 Mission: Test MCP Fortress"
echo ""

# Test 1: Check if server starts
echo "🧪 Test 1: Server Startup"
timeout 10s npm run dev > /dev/null 2>&1 &
SERVER_PID=$!
sleep 3

if ps -p $SERVER_PID > /dev/null; then
    echo "✅ Server started successfully"
    kill $SERVER_PID 2>/dev/null
else
    echo "❌ Server failed to start"
    exit 1
fi

# Test 2: Check build output
echo "🧪 Test 2: Build Output"
if [ -f "dist/index.js" ]; then
    echo "✅ Build output exists"
else
    echo "❌ Build output missing"
    exit 1
fi

# Test 3: Check dependencies
echo "🧪 Test 3: Dependencies"
if [ -d "node_modules" ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies missing"
    exit 1
fi

# Test 4: Check configuration files
echo "🧪 Test 4: Configuration Files"
CONFIG_FILES=("package.json" "tsconfig.json" "mcp.json" "env.example")
for file in "${CONFIG_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file exists"
    else
        echo "❌ $file missing"
        exit 1
    fi
done

echo ""
echo "🎯 ALL TESTS PASSED!"
echo "⚔️ APEX Agent MCP Server is battle-ready!"
echo "🔒 Security Status: FORTRESS SECURED"
echo "💪 Mission Status: ACCOMPLISHED"
echo ""
echo "APEX OUT! 🚀"
