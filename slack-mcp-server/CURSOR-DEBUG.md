# 🐛 Cursor MCP Troubleshooting

## Issue: Tools not showing in Cursor

Your server IS working (we saw "13 Slack tools ready"), but Cursor isn't detecting them.

## Solution Options:

### Option 1: Add Environment Variables to MCP Config (RECOMMENDED)

Edit `C:\Users\Agent004-Kira\.cursor\mcp.json`:

```json
{
  "mcpServers": {
    "slack-kira": {
      "command": "node",
      "args": [
        "C:\\Users\\Agent004-Kira\\Documents\\GitHub\\remote-agents-ai\\slack-mcp-server\\src\\index.js"
      ],
      "env": {
        "SLACK_BOT_TOKEN": "YOUR-BOT-TOKEN-HERE",
        "SLACK_APP_TOKEN": "YOUR-APP-TOKEN-HERE"
      }
    }
  }
}
```

Replace `YOUR-BOT-TOKEN-HERE` and `YOUR-APP-TOKEN-HERE` with your actual tokens from the `.env` file.

### Option 2: Use dotenv-expand in Command

```json
{
  "mcpServers": {
    "slack-kira": {
      "command": "node",
      "args": [
        "-r", "dotenv/config",
        "C:\\Users\\Agent004-Kira\\Documents\\GitHub\\remote-agents-ai\\slack-mcp-server\\src\\index.js"
      ],
      "env": {},
      "cwd": "C:\\Users\\Agent004-Kira\\Documents\\GitHub\\remote-agents-ai\\slack-mcp-server"
    }
  }
}
```

### Option 3: Check Cursor Logs

1. Open Cursor
2. Press `Ctrl+Shift+P` (or `Cmd+Shift+P` on Mac)
3. Type "Developer: Show Logs"
4. Look for MCP-related errors

## After Making Changes:

1. **Save the file**
2. **Completely QUIT Cursor** (don't just reload)
   - Windows: Right-click taskbar → Close
   - Mac: Cmd+Q
3. **Reopen Cursor**
4. **Go to Settings > Tools & MCP**
5. **You should see "slack-kira" with 13 tools**

## Verification Checklist:

- [ ] `.env` file exists in `slack-mcp-server` folder
- [ ] `.env` has both `SLACK_BOT_TOKEN` and `SLACK_APP_TOKEN`
- [ ] `mcp.json` has correct path to `index.js`
- [ ] `mcp.json` has environment variables OR cwd set
- [ ] Cursor completely quit and restarted
- [ ] No syntax errors in `mcp.json` (check with JSON validator)

## Still Not Working?

Try running the server manually to test:
```bash
cd C:\Users\Agent004-Kira\Documents\GitHub\remote-agents-ai\slack-mcp-server
node src/index.js
```

If you see "13 Slack tools ready" → Server is fine, issue is Cursor config
If you see errors → Server needs fixing

## Common Issues:

1. **Cursor caching**: Delete `C:\Users\Agent004-Kira\.cursor\cache` folder
2. **Wrong path**: Double-check backslashes in Windows paths
3. **Permissions**: Run Cursor as administrator
4. **Port conflicts**: Another process using the same connection

