# 🕳️ Shadow Agent005 - n8n Integration Guide

## Overview
This guide explains how to integrate n8n (workflow automation) with Shadow Agent005's Slack MCP server for advanced automation capabilities.

## Prerequisites
- Node.js 18+ installed
- n8n installed globally (`npm install -g n8n`)
- Shadow's Slack web app running (`npm run web`)
- Valid Slack bot token in `.env` file

## Quick Start

### 1. Start Shadow's Web App
```bash
npm run web
```
This starts Shadow's web interface at `http://localhost:3000` with the n8n webhook endpoint at `http://localhost:3000/webhook/n8n`.

### 2. Start n8n
```bash
npm run n8n
```
This starts n8n at `http://localhost:5678` with Shadow's configuration.

### 3. Login to n8n
- **URL**: `http://localhost:5678`
- **Email**: `ip@shoreagents.com`
- **Password**: `hgk-khz2nct!pgb!GKB`

## n8n Configuration

### Environment Variables
The `n8n-config.env` file contains all necessary configuration:
- Basic authentication credentials
- Database settings (SQLite)
- Security encryption key
- Shadow webhook integration
- Performance and logging settings

### Webhook Integration
Shadow's web app provides a webhook endpoint at `/webhook/n8n` that accepts:
```json
{
  "target": "general|#channel|U1234567890",
  "message": "Your message here",
  "addPersonality": true|false,
  "priority": "normal|high|urgent",
  "source": "n8n-workflow-name",
  "trigger": "automation-trigger-type"
}
```

## Sample Workflows

### 1. Security Alert Workflow
Automatically sends security alerts to Slack channels when triggered:
- **Trigger**: Webhook with `trigger: "security_alert"`
- **Action**: Sends high-priority message with Shadow's security personality
- **Target**: Configurable channel or user

### 2. Automated Notifications
Sends regular notifications based on various triggers:
- **Trigger**: Webhook with custom trigger type
- **Action**: Sends message with Shadow's personality
- **Target**: Configurable destination

### 3. User Mention Workflow
Responds to specific user mentions or keywords:
- **Trigger**: Slack event webhook
- **Action**: Sends automated response
- **Target**: Original channel or DM

## Available Scripts

### Shadow Web App
- `npm run web` - Start Shadow's web interface
- `npm run web-dev` - Start with debugging enabled

### n8n Integration
- `npm run n8n` - Start n8n with Shadow configuration
- `npm run n8n-start` - Start n8n directly
- `npm run n8n-dev` - Start n8n with tunnel (for external access)

## Webhook Endpoints

### Shadow Web App (`http://localhost:3000`)
- `POST /webhook/n8n` - n8n integration endpoint
- `GET /api/channels` - List Slack channels
- `GET /api/users` - List Slack users
- `POST /send-message` - Send message via web interface

### n8n (`http://localhost:5678`)
- `POST /webhook/shadow-webhook` - Trigger Shadow workflows
- Web interface for workflow management
- API endpoints for automation

## Workflow Examples

### Basic Message Sending
```json
{
  "target": "general",
  "message": "System status update",
  "addPersonality": true,
  "priority": "normal",
  "source": "system-monitor",
  "trigger": "status-check"
}
```

### Security Alert
```json
{
  "target": "#security",
  "message": "Unauthorized access attempt detected",
  "addPersonality": false,
  "priority": "high",
  "source": "security-monitor",
  "trigger": "security_alert"
}
```

### User Notification
```json
{
  "target": "U1234567890",
  "message": "Your task has been completed",
  "addPersonality": true,
  "priority": "normal",
  "source": "task-manager",
  "trigger": "task-complete"
}
```

## Troubleshooting

### Common Issues

1. **Port Conflicts**
   - Shadow web app: Port 3000
   - n8n: Port 5678
   - Check for conflicts: `netstat -ano | findstr :3000`

2. **Authentication Issues**
   - Verify credentials in `n8n-config.env`
   - Check Slack bot token in `.env`

3. **Webhook Not Working**
   - Ensure Shadow web app is running
   - Check webhook URL: `http://localhost:3000/webhook/n8n`
   - Verify request format matches expected JSON

4. **n8n Not Starting**
   - Check Node.js version (18+)
   - Verify n8n installation: `n8n --version`
   - Check environment variables

### Debug Mode
Start n8n with debugging:
```bash
npm run n8n-dev
```

## Security Considerations

### Authentication
- n8n uses basic authentication
- Shadow webhook requires proper JSON format
- Slack bot token must be valid and have necessary scopes

### Data Protection
- All messages are logged for audit purposes
- Sensitive data should be encrypted
- Webhook endpoints should be secured in production

### Network Security
- Use HTTPS in production
- Implement proper CORS policies
- Monitor webhook endpoints for abuse

## Advanced Configuration

### Custom Nodes
Create custom n8n nodes for Shadow-specific functionality:
- Shadow personality injection
- Security audit logging
- Automated testing workflows

### Database Integration
n8n can integrate with various databases:
- SQLite (default)
- PostgreSQL
- MySQL
- MongoDB

### External Integrations
Connect n8n with external services:
- GitHub webhooks
- Email notifications
- Calendar events
- File system monitoring

## Support

### Logs
- Shadow web app: Console output
- n8n: Built-in logging system
- Check `n8n-config.env` for log settings

### Monitoring
- n8n provides built-in metrics
- Shadow web app logs all webhook calls
- Monitor webhook response times

### Updates
- Keep n8n updated: `npm update -g n8n`
- Update Shadow dependencies: `npm update`
- Check for security updates regularly

---

**Trust but verify the automation. Do better. 🕳️**

*Shadow Agent005 "VOID" - Testing and Security Expert*
















