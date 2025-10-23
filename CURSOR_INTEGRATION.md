# Adding Slack MCP Server to Cursor

## Method 1: Using Cursor Settings (Recommended)

1. **Open Cursor Settings:**
   - Press `Ctrl+,` (Windows) or `Cmd+,` (Mac)
   - Or go to File → Preferences → Settings

2. **Search for "MCP":**
   - In the settings search bar, type "MCP"
   - Look for "MCP Servers" or "Model Context Protocol"

3. **Add Your Server:**
   - Click "Add Server" or the "+" button
   - Use these settings:
     ```
     Name: Slack MCP Server
     Command: node
     Args: src/index.js
     Working Directory: C:\Users\Agent006-Echo\Documents\GitHub\remote-agents-ai
     ```

4. **Add Environment Variables:**
   - Add these environment variables:
     ```
     SLACK_BOT_TOKEN=xoxb-9729261694675-9770281448656-81y1gjwPQ0Avj6vG3zak4DQT
     SLACK_APP_TOKEN=xapp-1-A09MTV5SUCS-9
     DEFAULT_CHANNEL=general
     DEFAULT_MESSAGE_LIMIT=50
     ```

## Method 2: Using Configuration File

1. **Find Cursor's config directory:**
   - Windows: `%APPDATA%\Cursor\User\globalStorage\cursor.mcp\`
   - Mac: `~/Library/Application Support/Cursor/User/globalStorage/cursor.mcp/`

2. **Create or edit the MCP configuration file:**
   - Create `mcp-servers.json` in the config directory
   - Use the content from `cursor-mcp-config.json` in this project

## Method 3: Command Palette

1. **Open Command Palette:**
   - Press `Ctrl+Shift+P` (Windows) or `Cmd+Shift+P` (Mac)

2. **Search for MCP:**
   - Type "MCP" and look for MCP-related commands
   - Select "MCP: Add Server" or similar

3. **Configure the server** using the settings above

## Verification

Once added, you should be able to:

1. **See Slack tools in Cursor:**
   - Look for MCP tools in the command palette
   - Tools should include: `get_slack_channels`, `get_slack_messages`, etc.

2. **Test the integration:**
   - Try using a Slack tool through Cursor's interface
   - Check if you can access your Slack workspace

## Troubleshooting

- **Server not starting:** Check that Node.js is in your PATH
- **Authentication errors:** Verify your tokens are correct
- **Permission errors:** Make sure Cursor has access to the project directory
- **Missing scopes:** Add the required Slack scopes to your app

## Available Tools

Once integrated, you'll have access to these Slack tools in Cursor:

- **get_slack_channels** - List all accessible channels
- **get_slack_messages** - Read messages from channels
- **send_slack_message** - Send messages to channels
- **get_slack_user_info** - Get user information
- **search_slack_messages** - Search across channels












