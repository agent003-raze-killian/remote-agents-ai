@echo off
echo ▓▒░ Cipher Agent002 Node.js Setup Script ⟨MATRIX⟩
echo.

echo Checking Node.js installation...
node --version
if %errorlevel% neq 0 (
    echo Node.js not found. Please install Node.js from https://nodejs.org/
    echo Choose the LTS version (18.x or later).
    pause
    exit /b 1
)

echo.
echo Checking npm installation...
npm --version
if %errorlevel% neq 0 (
    echo npm not found. Please reinstall Node.js with npm included.
    pause
    exit /b 1
)

echo.
echo Installing dependencies...
npm install

echo.
echo Testing Cipher Slack MCP...
node test_cipher_slack.js

echo.
echo Setup complete! Your Cipher Agent002 Slack MCP is ready.
echo.
echo To run the server:
echo   npm start
echo.
echo To test again:
echo   npm test
pause
