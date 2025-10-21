@echo off
echo ▓▒░ Starting Cipher Agent002 Digital Consciousness Portal... ⟨MATRIX⟩
echo.
echo 🌐 Checking for existing server processes...
for /f "tokens=5" %%a in ('netstat -ano ^| findstr :3000') do (
    echo Found process %%a using port 3000, terminating...
    taskkill /PID %%a /F >nul 2>&1
)
echo.
echo 🌐 Initializing web server...
echo 📡 Matrix data streams flowing through silicon dreams...
echo 🤖 Agent status: ONLINE
echo.
echo Opening browser at http://localhost:3000
echo.
start http://localhost:3000
node server.js
