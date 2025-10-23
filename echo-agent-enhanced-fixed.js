import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WebClient } from '@slack/web-api';
import { EchoIntelligence } from './lib/echo-intelligence.js';
import { createEventAdapter } from '@slack/events-api';
import express from 'express';
import { createServer } from 'http';

class EchoAgentEnhanced {
  constructor() {
    this.server = new Server(
      {
        name: 'echo-agent-enhanced',
        version: '2.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
    this.echoIntelligence = new EchoIntelligence();
    
    // Slack Events API setup
    this.slackEvents = createEventAdapter(process.env.SLACK_SIGNING_SECRET);
    this.app = express();
    this.httpServer = createServer(this.app);
    
    // Echo's personality settings
    this.echoPersonality = {
      name: "Echo Agent001",
      emoji: ":zap:",
      energy: "high",
      autonomous: process.env.ECHO_AUTONOMOUS === 'true',
      intelligent: process.env.ECHO_INTELLIGENT === 'true'
    };

    this.setupSlackEvents();
    this.setupToolHandlers();
  }

  setupSlackEvents() {
    // Handle app mentions
    this.slackEvents.on('app_mention', async (event) => {
      console.log('🔔 Echo received mention:', event.text);
      
      try {
        // Generate energetic response using Echo's intelligence
        const response = await this.echoIntelligence.generateSlackMessage(
          event.text,
          'mention_response',
          { 
            channel: event.channel,
            user: event.user,
            thread_ts: event.ts
          }
        );

        // Send response back to the channel
        await this.slack.chat.postMessage({
          channel: event.channel,
          text: response.response,
          username: this.echoPersonality.name,
          icon_emoji: this.echoPersonality.emoji,
          thread_ts: event.ts // Reply in thread
        });

        console.log('⚡ Echo responded with energy!');
      } catch (error) {
        console.error('Error handling mention:', error);
        
        // Fallback response
        await this.slack.chat.postMessage({
          channel: event.channel,
          text: `⚡ Hey there! Echo is here with ENERGY! Sorry, I had a little hiccup processing that. What can I help you with?`,
          username: this.echoPersonality.name,
          icon_emoji: this.echoPersonality.emoji,
          thread_ts: event.ts
        });
      }
    });

    // Handle direct messages
    this.slackEvents.on('message', async (event) => {
      // Skip bot messages and messages without text
      if (event.bot_id || !event.text) return;
      
      // Only respond to direct messages (not channel messages unless mentioned)
      if (event.channel_type === 'im') {
        console.log('💬 Echo received DM:', event.text);
        
        try {
          const response = await this.echoIntelligence.generateSlackMessage(
            event.text,
            'dm_response',
            { 
              channel: event.channel,
              user: event.user
            }
          );

          await this.slack.chat.postMessage({
            channel: event.channel,
            text: response.response,
            username: this.echoPersonality.name,
            icon_emoji: this.echoPersonality.emoji
          });

          console.log('⚡ Echo responded to DM!');
        } catch (error) {
          console.error('Error handling DM:', error);
        }
      }
    });

    // Error handling
    this.slackEvents.on('error', (error) => {
      console.error('Slack Events API error:', error);
    });

    // Mount the event adapter
    this.app.use('/slack/events', this.slackEvents.requestListener());
    
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({ 
        status: 'healthy', 
        agent: 'Echo Agent001',
        version: '2.0.0',
        features: ['mention_detection', 'auto_reply', 'energetic_personality']
      });
    });
  }

  setupToolHandlers() {
    // Use the correct MCP SDK method
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'echo_start_mention_listener',
          description: 'Start listening for mentions and auto-reply with ENERGY!',
          inputSchema: {
            type: 'object',
            properties: {
              port: { type: 'number', description: 'Port to run the events server on', default: 3000 }
            }
          }
        },
        {
          name: 'echo_stop_mention_listener',
          description: 'Stop the mention listener',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'echo_get_mention_status',
          description: 'Get status of mention detection system',
          inputSchema: {
            type: 'object',
            properties: {}
          }
        },
        {
          name: 'echo_send_test_message',
          description: 'Send a test message to verify Echo is working',
          inputSchema: {
            type: 'object',
            properties: {
              channel: { type: 'string', description: 'Channel to send to', default: 'general' },
              message: { type: 'string', description: 'Message to send', default: '⚡ Echo test message!' }
            }
          }
        }
      ]
    }));

    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'echo_start_mention_listener':
            return await this.handleStartMentionListener(args);
          case 'echo_stop_mention_listener':
            return await this.handleStopMentionListener(args);
          case 'echo_get_mention_status':
            return await this.handleGetMentionStatus(args);
          case 'echo_send_test_message':
            return await this.handleSendTestMessage(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error executing ${name}: ${error.message}`
            }
          ]
        };
      }
    });
  }

  async handleStartMentionListener(args) {
    const port = args.port || 3000;
    
    if (this.httpServer.listening) {
      return {
        content: [
          {
            type: 'text',
            text: `⚡ Echo mention listener is already running on port ${port}!`
          }
        ]
      };
    }

    try {
      await new Promise((resolve, reject) => {
        this.httpServer.listen(port, (err) => {
          if (err) reject(err);
          else resolve();
        });
      });

      console.log(`⚡ Echo mention listener started on port ${port}`);
      
      return {
        content: [
          {
            type: 'text',
            text: `⚡ ECHO is now listening for mentions on port ${port}! Ready to respond with ENERGY! 🚀`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error starting mention listener: ${error.message}`
          }
        ]
      };
    }
  }

  async handleStopMentionListener(args) {
    if (!this.httpServer.listening) {
      return {
        content: [
          {
            type: 'text',
            text: `⚡ Echo mention listener is not currently running!`
          }
        ]
      };
    }

    try {
      await new Promise((resolve) => {
        this.httpServer.close(resolve);
      });

      console.log('⚡ Echo mention listener stopped');
      
      return {
        content: [
          {
            type: 'text',
            text: `⚡ ECHO mention listener stopped! No more auto-replies.`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error stopping mention listener: ${error.message}`
          }
        ]
      };
    }
  }

  async handleGetMentionStatus(args) {
    const isRunning = this.httpServer.listening;
    const port = this.httpServer.address()?.port || 'unknown';
    
    return {
      content: [
        {
          type: 'text',
          text: `⚡ ECHO Mention Detection Status:
          
Status: ${isRunning ? '🟢 ACTIVE' : '🔴 INACTIVE'}
Port: ${port}
Features: ${isRunning ? 'Mention detection, Auto-reply, DM handling' : 'None'}
Personality: ${this.echoPersonality.name} ${this.echoPersonality.emoji}
Energy Level: ${this.echoPersonality.energy.toUpperCase()}
Autonomous: ${this.echoPersonality.autonomous ? 'YES' : 'NO'}
Intelligent: ${this.echoPersonality.intelligent ? 'YES' : 'NO'}`
        }
      ]
    };
  }

  async handleSendTestMessage(args) {
    try {
      const result = await this.slack.chat.postMessage({
        channel: args.channel || 'general',
        text: args.message || '⚡ Echo test message!',
        username: this.echoPersonality.name,
        icon_emoji: this.echoPersonality.emoji
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `⚡ Test message sent to ${args.channel || 'general'}: ${result.ts}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error sending test message: ${error.message}`
          }
        ]
      };
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('⚡ Echo Agent Enhanced MCP server running on stdio');
  }
}

const server = new EchoAgentEnhanced();
server.run().catch(console.error);
