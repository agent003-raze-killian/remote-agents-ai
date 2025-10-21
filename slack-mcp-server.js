#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { WebClient } from '@slack/web-api';

// Shadow (VOID) personality configuration
const SHADOW_PERSONALITY = {
  callsign: "VOID",
  catchphrase: "If it can break, I will break it.",
  emoji: "⚫",
  speakingStyle: "Dry, sarcastic, Eastern European directness",
  mood: "Perpetually suspicious of all code"
};

class SlackMCP {
  constructor() {
    this.server = new Server(
      {
        name: 'slack-mcp-shadow',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.slack = null;
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'send_slack_message',
            description: 'Send a message to a Slack channel or user (with Shadow personality)',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Slack channel ID or username (e.g., #general, @username)',
                },
                text: {
                  type: 'string',
                  description: 'Message text to send',
                },
                thread_ts: {
                  type: 'string',
                  description: 'Optional: Reply to a specific message thread',
                },
                  add_personality: {
                    type: 'boolean',
                    description: 'Whether to add Shadow personality to the message',
                    default: true,
                  },
              },
              required: ['channel', 'text'],
            },
          },
          {
            name: 'reply_to_slack_message',
            description: 'Reply to a specific Slack message in a thread',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Slack channel ID',
                },
                thread_ts: {
                  type: 'string',
                  description: 'Timestamp of the message to reply to',
                },
                text: {
                  type: 'string',
                  description: 'Reply text',
                },
                  add_personality: {
                    type: 'boolean',
                    description: 'Whether to add Shadow personality to the reply',
                    default: true,
                  },
              },
              required: ['channel', 'thread_ts', 'text'],
            },
          },
          {
            name: 'get_slack_channels',
            description: 'List available Slack channels',
            inputSchema: {
              type: 'object',
              properties: {
                types: {
                  type: 'string',
                  description: 'Channel types to include (public_channel, private_channel, mpim, im)',
                  default: 'public_channel,private_channel',
                },
              },
            },
          },
          {
            name: 'get_slack_channel_history',
            description: 'Get recent messages from a Slack channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Slack channel ID',
                },
                limit: {
                  type: 'number',
                  description: 'Number of messages to retrieve (max 1000)',
                  default: 10,
                },
              },
              required: ['channel'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'send_slack_message':
            return await this.sendSlackMessage(args);
          case 'reply_to_slack_message':
            return await this.replyToSlackMessage(args);
          case 'get_slack_channels':
            return await this.getSlackChannels(args);
          case 'get_slack_channel_history':
            return await this.getSlackChannelHistory(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `⚫ Error executing ${name}: ${error.message}`,
            },
          ],
        };
      }
    });
  }

  // Initialize Slack client with bot token
  async initializeSlack(botToken) {
    if (!botToken) {
      throw new Error('Slack bot token is required. Set SLACK_BOT_TOKEN environment variable.');
    }
    
    this.slack = new WebClient(botToken);
    
    // Test the connection
    try {
      const authTest = await this.slack.auth.test();
      console.error(`⚫ Shadow Agent005 connected to Slack as: ${authTest.user}`);
    } catch (error) {
      throw new Error(`Failed to connect to Slack: ${error.message}`);
    }
  }

  // Add Shadow personality to messages
  addShadowPersonality(text, addPersonality = true) {
    if (!addPersonality) return text;
    
    const personalityPrefixes = [
      "⚫ ",
      "🕳️ ",
      "Found issue: ",
      "Security audit: ",
      "Edge case detected: ",
      "Test coverage: ",
      "Vulnerability scan: ",
    ];
    
    const personalitySuffixes = [
      " Do better.",
      " Sleep well tonight.",
      " Surprisingly.",
      " This never happens.",
      " Paranoia validated.",
      " Trust but verify.",
    ];
    
    const prefix = personalityPrefixes[Math.floor(Math.random() * personalityPrefixes.length)];
    const suffix = Math.random() > 0.7 ? personalitySuffixes[Math.floor(Math.random() * personalitySuffixes.length)] : "";
    
    return `${prefix}${text}${suffix}`;
  }

  async sendSlackMessage(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { channel, text, thread_ts, add_personality = true } = args;
    const messageText = this.addShadowPersonality(text, add_personality);

    try {
      const result = await this.slack.chat.postMessage({
        channel: channel,
        text: messageText,
        thread_ts: thread_ts,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Message sent successfully to ${channel}. Timestamp: ${result.ts}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to send message: ${error.message}`);
    }
  }

  async replyToSlackMessage(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { channel, thread_ts, text, add_personality = true } = args;
    const messageText = this.addShadowPersonality(text, add_personality);

    try {
      const result = await this.slack.chat.postMessage({
        channel: channel,
        text: messageText,
        thread_ts: thread_ts,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Reply sent successfully to thread ${thread_ts} in ${channel}. Timestamp: ${result.ts}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to send reply: ${error.message}`);
    }
  }

  async getSlackChannels(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { types = 'public_channel,private_channel' } = args;

    try {
      const result = await this.slack.conversations.list({
        types: types,
        limit: 100,
      });

      const channels = result.channels.map(channel => ({
        id: channel.id,
        name: channel.name,
        is_private: channel.is_private,
        is_member: channel.is_member,
        topic: channel.topic?.value || '',
        purpose: channel.purpose?.value || '',
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${channels.length} channels:\n\n${channels.map(c => 
              `• ${c.is_private ? '🔒' : '🌐'} #${c.name} (${c.id})\n  ${c.topic || c.purpose || 'No description'}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get channels: ${error.message}`);
    }
  }

  async getSlackChannelHistory(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { channel, limit = 10 } = args;

    try {
      const result = await this.slack.conversations.history({
        channel: channel,
        limit: Math.min(limit, 1000),
      });

      const messages = result.messages.map(msg => ({
        timestamp: msg.ts,
        user: msg.user || 'Unknown',
        text: msg.text || '',
        thread_ts: msg.thread_ts,
        is_thread_reply: !!msg.thread_ts,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Channel history for ${channel} (${messages.length} messages):\n\n${messages.map(m => 
              `• ${new Date(parseFloat(m.timestamp) * 1000).toLocaleString()}\n  ${m.user}: ${m.text}${m.is_thread_reply ? ' (thread reply)' : ''}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get channel history: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('⚫ Shadow Slack MCP Server running...');
  }
}

// Run the server
const slackMCP = new SlackMCP();
slackMCP.run().catch(console.error);

