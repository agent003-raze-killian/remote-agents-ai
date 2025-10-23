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
          {
            name: 'upload_slack_file',
            description: 'Upload a file to a Slack channel or user',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Slack channel ID or username',
                },
                file_path: {
                  type: 'string',
                  description: 'Path to the file to upload',
                },
                title: {
                  type: 'string',
                  description: 'Title for the file',
                },
                initial_comment: {
                  type: 'string',
                  description: 'Initial comment to add with the file',
                },
              },
              required: ['channel', 'file_path'],
            },
          },
          {
            name: 'get_slack_files',
            description: 'List files shared in channels and conversations',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID to get files from (optional)',
                },
                user: {
                  type: 'string',
                  description: 'User ID to get files from (optional)',
                },
                types: {
                  type: 'string',
                  description: 'File types to include (images, docs, videos, etc.)',
                  default: 'all',
                },
                limit: {
                  type: 'number',
                  description: 'Number of files to retrieve',
                  default: 20,
                },
              },
            },
          },
          {
            name: 'delete_slack_file',
            description: 'Delete a file from Slack',
            inputSchema: {
              type: 'object',
              properties: {
                file_id: {
                  type: 'string',
                  description: 'ID of the file to delete',
                },
              },
              required: ['file_id'],
            },
          },
          {
            name: 'get_slack_dm_history',
            description: 'Get direct message history with a user',
            inputSchema: {
              type: 'object',
              properties: {
                user: {
                  type: 'string',
                  description: 'User ID to get DM history with',
                },
                limit: {
                  type: 'number',
                  description: 'Number of messages to retrieve',
                  default: 10,
                },
              },
              required: ['user'],
            },
          },
          {
            name: 'get_slack_dm_list',
            description: 'List all direct message conversations',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Number of DM conversations to retrieve',
                  default: 20,
                },
              },
            },
          },
          {
            name: 'start_slack_dm',
            description: 'Start a direct message conversation with a user',
            inputSchema: {
              type: 'object',
              properties: {
                user: {
                  type: 'string',
                  description: 'User ID to start DM with',
                },
                text: {
                  type: 'string',
                  description: 'Initial message to send',
                },
              },
              required: ['user'],
            },
          },
          {
            name: 'get_slack_private_channels',
            description: 'List private channels that Shadow Agent005 has access to',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Number of private channels to retrieve',
                  default: 20,
                },
              },
            },
          },
          {
            name: 'get_slack_private_channel_history',
            description: 'Get message history from a private channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Private channel ID',
                },
                limit: {
                  type: 'number',
                  description: 'Number of messages to retrieve',
                  default: 10,
                },
              },
              required: ['channel'],
            },
          },
          {
            name: 'add_slack_reaction',
            description: 'Add an emoji reaction to a Slack message',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID where the message is located',
                },
                timestamp: {
                  type: 'string',
                  description: 'Timestamp of the message to react to',
                },
                name: {
                  type: 'string',
                  description: 'Emoji name (without colons, e.g., "thumbsup")',
                },
              },
              required: ['channel', 'timestamp', 'name'],
            },
          },
          {
            name: 'remove_slack_reaction',
            description: 'Remove an emoji reaction from a Slack message',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID where the message is located',
                },
                timestamp: {
                  type: 'string',
                  description: 'Timestamp of the message',
                },
                name: {
                  type: 'string',
                  description: 'Emoji name to remove',
                },
              },
              required: ['channel', 'timestamp', 'name'],
            },
          },
          {
            name: 'pin_slack_message',
            description: 'Pin a message or file in a Slack channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID',
                },
                timestamp: {
                  type: 'string',
                  description: 'Timestamp of the message to pin',
                },
              },
              required: ['channel', 'timestamp'],
            },
          },
          {
            name: 'unpin_slack_message',
            description: 'Unpin a message or file from a Slack channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID',
                },
                timestamp: {
                  type: 'string',
                  description: 'Timestamp of the message to unpin',
                },
              },
              required: ['channel', 'timestamp'],
            },
          },
          {
            name: 'create_slack_reminder',
            description: 'Create a reminder for a user',
            inputSchema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Reminder text',
                },
                time: {
                  type: 'string',
                  description: 'When to remind (e.g., "in 5 minutes", "tomorrow at 9am")',
                },
                user: {
                  type: 'string',
                  description: 'User ID to remind (optional, defaults to bot user)',
                },
              },
              required: ['text', 'time'],
            },
          },
          {
            name: 'complete_slack_reminder',
            description: 'Mark a reminder as complete',
            inputSchema: {
              type: 'object',
              properties: {
                reminder_id: {
                  type: 'string',
                  description: 'ID of the reminder to complete',
                },
              },
              required: ['reminder_id'],
            },
          },
          {
            name: 'get_slack_users',
            description: 'List users in the workspace',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Number of users to retrieve',
                  default: 50,
                },
                include_deleted: {
                  type: 'boolean',
                  description: 'Include deleted users',
                  default: false,
                },
              },
            },
          },
          {
            name: 'get_slack_user_info',
            description: 'Get information about a specific user',
            inputSchema: {
              type: 'object',
              properties: {
                user: {
                  type: 'string',
                  description: 'User ID to get information about',
                },
              },
              required: ['user'],
            },
          },
          {
            name: 'create_slack_channel',
            description: 'Create a new public channel',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Name of the channel to create',
                },
                is_private: {
                  type: 'boolean',
                  description: 'Whether to create a private channel',
                  default: false,
                },
                topic: {
                  type: 'string',
                  description: 'Channel topic',
                },
                purpose: {
                  type: 'string',
                  description: 'Channel purpose',
                },
              },
              required: ['name'],
            },
          },
          {
            name: 'invite_to_slack_channel',
            description: 'Invite users to a channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID',
                },
                users: {
                  type: 'string',
                  description: 'Comma-separated list of user IDs to invite',
                },
              },
              required: ['channel', 'users'],
            },
          },
          {
            name: 'send_slack_message_public',
            description: 'Send a message to a channel that Shadow is not a member of',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Slack channel ID or username',
                },
                text: {
                  type: 'string',
                  description: 'Message text to send',
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
          case 'upload_slack_file':
            return await this.uploadSlackFile(args);
          case 'get_slack_files':
            return await this.getSlackFiles(args);
          case 'delete_slack_file':
            return await this.deleteSlackFile(args);
          case 'get_slack_dm_history':
            return await this.getSlackDMHistory(args);
          case 'get_slack_dm_list':
            return await this.getSlackDMList(args);
          case 'start_slack_dm':
            return await this.startSlackDM(args);
          case 'get_slack_private_channels':
            return await this.getSlackPrivateChannels(args);
          case 'get_slack_private_channel_history':
            return await this.getSlackPrivateChannelHistory(args);
          case 'add_slack_reaction':
            return await this.addSlackReaction(args);
          case 'remove_slack_reaction':
            return await this.removeSlackReaction(args);
          case 'pin_slack_message':
            return await this.pinSlackMessage(args);
          case 'unpin_slack_message':
            return await this.unpinSlackMessage(args);
          case 'create_slack_reminder':
            return await this.createSlackReminder(args);
          case 'complete_slack_reminder':
            return await this.completeSlackReminder(args);
          case 'get_slack_users':
            return await this.getSlackUsers(args);
          case 'get_slack_user_info':
            return await this.getSlackUserInfo(args);
          case 'create_slack_channel':
            return await this.createSlackChannel(args);
          case 'invite_to_slack_channel':
            return await this.inviteToSlackChannel(args);
          case 'send_slack_message_public':
            return await this.sendSlackMessagePublic(args);
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
      const token = process.env.SLACK_BOT_TOKEN || 'xoxb-9729261694675-9764232723568-P7kYUD5tdLl29gBJVtNIH7TW';
      await this.initializeSlack(token);
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
      const token = process.env.SLACK_BOT_TOKEN || 'xoxb-9729261694675-9764232723568-P7kYUD5tdLl29gBJVtNIH7TW';
      await this.initializeSlack(token);
    }

    const { channel, thread_ts, text, add_personality = true } = args;
    const messageText = this.addShadowPersonality(text, add_personality);

    try {
      // Validate thread_ts format - it should be a string timestamp
      if (!thread_ts || typeof thread_ts !== 'string') {
        throw new Error('Invalid thread_ts: must be a valid Slack timestamp string');
      }

      // Debug logging
      console.log(`Replying to thread ${thread_ts} in channel ${channel}`);
      console.log(`Message: ${messageText}`);

      const result = await this.slack.chat.postMessage({
        channel: channel,
        text: messageText,
        thread_ts: thread_ts,
        reply_broadcast: false, // Don't broadcast to channel
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
      console.error('Reply error:', error);
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
              `• ${new Date(parseFloat(m.timestamp) * 1000).toLocaleString()}\n  ${m.user}: ${m.text}${m.is_thread_reply ? ' (thread reply)' : ''}\n  Timestamp: ${m.timestamp}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get channel history: ${error.message}`);
    }
  }

  // File operations (files:read, files:write)
  async uploadSlackFile(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { channel, file_path, title, initial_comment } = args;

    try {
      const fs = await import('fs');
      const fileContent = fs.readFileSync(file_path);
      const fileName = file_path.split('/').pop() || file_path.split('\\').pop();

      const result = await this.slack.files.upload({
        channels: channel,
        file: fileContent,
        filename: fileName,
        title: title || fileName,
        initial_comment: initial_comment,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ File uploaded successfully: ${result.file.name} (ID: ${result.file.id})`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to upload file: ${error.message}`);
    }
  }

  async getSlackFiles(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { channel, user, types = 'all', limit = 20 } = args;

    try {
      const result = await this.slack.files.list({
        channel: channel,
        user: user,
        types: types,
        count: limit,
      });

      const files = result.files.map(file => ({
        id: file.id,
        name: file.name,
        title: file.title,
        user: file.user,
        created: file.created,
        size: file.size,
        mimetype: file.mimetype,
        url_private: file.url_private,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${files.length} files:\n\n${files.map(f => 
              `• ${f.name} (${f.id})\n  Size: ${f.size} bytes, Type: ${f.mimetype}\n  Created: ${new Date(f.created * 1000).toLocaleString()}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get files: ${error.message}`);
    }
  }

  async deleteSlackFile(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { file_id } = args;

    try {
      await this.slack.files.delete({
        file: file_id,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ File ${file_id} deleted successfully`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Direct message operations (im:history, im:read, im:write)
  async getSlackDMHistory(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { user, limit = 10 } = args;

    try {
      // First, open or get the DM channel
      const dmResult = await this.slack.conversations.open({
        users: user,
      });

      const result = await this.slack.conversations.history({
        channel: dmResult.channel.id,
        limit: Math.min(limit, 1000),
      });

      const messages = result.messages.map(msg => ({
        timestamp: msg.ts,
        user: msg.user || 'Unknown',
        text: msg.text || '',
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ DM history with user ${user} (${messages.length} messages):\n\n${messages.map(m => 
              `• ${new Date(parseFloat(m.timestamp) * 1000).toLocaleString()}\n  ${m.user}: ${m.text}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get DM history: ${error.message}`);
    }
  }

  async getSlackDMList(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { limit = 20 } = args;

    try {
      const result = await this.slack.conversations.list({
        types: 'im',
        limit: limit,
      });

      const dms = result.channels.map(dm => ({
        id: dm.id,
        user: dm.user,
        is_open: dm.is_open,
        created: dm.created,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${dms.length} DM conversations:\n\n${dms.map(dm => 
              `• DM with user ${dm.user} (${dm.id})\n  Created: ${new Date(dm.created * 1000).toLocaleString()}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get DM list: ${error.message}`);
    }
  }

  async startSlackDM(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { user, text } = args;

    try {
      // Open DM channel
      const dmResult = await this.slack.conversations.open({
        users: user,
      });

      let result = { channel: dmResult.channel.id };

      // Send initial message if provided
      if (text) {
        const messageText = this.addShadowPersonality(text);
        result = await this.slack.chat.postMessage({
          channel: dmResult.channel.id,
          text: messageText,
        });
      }

      return {
        content: [
          {
            type: 'text',
            text: `⚫ DM conversation started with user ${user}${text ? `. Message sent: ${result.ts}` : ''}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to start DM: ${error.message}`);
    }
  }

  // Private channel operations (groups:history, groups:read)
  async getSlackPrivateChannels(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { limit = 20 } = args;

    try {
      const result = await this.slack.conversations.list({
        types: 'private_channel',
        limit: limit,
      });

      const channels = result.channels.map(channel => ({
        id: channel.id,
        name: channel.name,
        is_member: channel.is_member,
        topic: channel.topic?.value || '',
        purpose: channel.purpose?.value || '',
        created: channel.created,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${channels.length} private channels:\n\n${channels.map(c => 
              `• 🔒 #${c.name} (${c.id})\n  ${c.topic || c.purpose || 'No description'}\n  Member: ${c.is_member ? 'Yes' : 'No'}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get private channels: ${error.message}`);
    }
  }

  async getSlackPrivateChannelHistory(args) {
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
            text: `⚫ Private channel history for ${channel} (${messages.length} messages):\n\n${messages.map(m => 
              `• ${new Date(parseFloat(m.timestamp) * 1000).toLocaleString()}\n  ${m.user}: ${m.text}${m.is_thread_reply ? ' (thread reply)' : ''}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get private channel history: ${error.message}`);
    }
  }

  // Reaction operations (reactions:write)
  async addSlackReaction(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { channel, timestamp, name } = args;

    try {
      await this.slack.reactions.add({
        channel: channel,
        timestamp: timestamp,
        name: name,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Reaction :${name}: added to message ${timestamp} in ${channel}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to add reaction: ${error.message}`);
    }
  }

  async removeSlackReaction(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { channel, timestamp, name } = args;

    try {
      await this.slack.reactions.remove({
        channel: channel,
        timestamp: timestamp,
        name: name,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Reaction :${name}: removed from message ${timestamp} in ${channel}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to remove reaction: ${error.message}`);
    }
  }

  // Pin operations (pins:write)
  async pinSlackMessage(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { channel, timestamp } = args;

    try {
      await this.slack.pins.add({
        channel: channel,
        timestamp: timestamp,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Message ${timestamp} pinned in channel ${channel}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to pin message: ${error.message}`);
    }
  }

  async unpinSlackMessage(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { channel, timestamp } = args;

    try {
      await this.slack.pins.remove({
        channel: channel,
        timestamp: timestamp,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Message ${timestamp} unpinned from channel ${channel}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to unpin message: ${error.message}`);
    }
  }

  // Reminder operations (reminders:write)
  async createSlackReminder(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { text, time, user } = args;

    try {
      const result = await this.slack.reminders.add({
        text: text,
        time: time,
        user: user,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Reminder created: "${text}" for ${time} (ID: ${result.reminder.id})`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create reminder: ${error.message}`);
    }
  }

  async completeSlackReminder(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { reminder_id } = args;

    try {
      await this.slack.reminders.complete({
        reminder: reminder_id,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Reminder ${reminder_id} marked as complete`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to complete reminder: ${error.message}`);
    }
  }

  // User operations (users:read)
  async getSlackUsers(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { limit = 50, include_deleted = false } = args;

    try {
      const result = await this.slack.users.list({
        limit: limit,
        include_deleted: include_deleted,
      });

      const users = result.members.map(user => ({
        id: user.id,
        name: user.name,
        real_name: user.real_name,
        display_name: user.profile?.display_name || user.name,
        email: user.profile?.email,
        is_bot: user.is_bot,
        deleted: user.deleted,
        is_admin: user.is_admin,
        is_owner: user.is_owner,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${users.length} users:\n\n${users.map(u => 
              `• ${u.display_name} (@${u.name}) - ${u.id}\n  ${u.real_name}${u.is_bot ? ' (Bot)' : ''}${u.deleted ? ' (Deleted)' : ''}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  async getSlackUserInfo(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { user } = args;

    try {
      const result = await this.slack.users.info({
        user: user,
      });

      const userInfo = result.user;
      const profile = userInfo.profile;

      return {
        content: [
          {
            type: 'text',
            text: `⚫ User Information for ${profile?.display_name || userInfo.name}:\n\n` +
                  `• ID: ${userInfo.id}\n` +
                  `• Username: @${userInfo.name}\n` +
                  `• Real Name: ${userInfo.real_name}\n` +
                  `• Display Name: ${profile?.display_name || 'Not set'}\n` +
                  `• Email: ${profile?.email || 'Not provided'}\n` +
                  `• Phone: ${profile?.phone || 'Not provided'}\n` +
                  `• Status: ${profile?.status_text || 'Not set'}\n` +
                  `• Bot: ${userInfo.is_bot ? 'Yes' : 'No'}\n` +
                  `• Admin: ${userInfo.is_admin ? 'Yes' : 'No'}\n` +
                  `• Owner: ${userInfo.is_owner ? 'Yes' : 'No'}\n` +
                  `• Deleted: ${userInfo.deleted ? 'Yes' : 'No'}\n` +
                  `• Timezone: ${userInfo.tz || 'Not set'}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get user info: ${error.message}`);
    }
  }

  // Channel management operations (channels:manage)
  async createSlackChannel(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { name, is_private = false, topic, purpose } = args;

    try {
      const result = await this.slack.conversations.create({
        name: name,
        is_private: is_private,
        topic: topic,
        purpose: purpose,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Channel created successfully: ${is_private ? '🔒' : '🌐'} #${name} (${result.channel.id})`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create channel: ${error.message}`);
    }
  }

  async inviteToSlackChannel(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { channel, users } = args;

    try {
      const userIds = users.split(',').map(id => id.trim());
      
      const result = await this.slack.conversations.invite({
        channel: channel,
        users: userIds.join(','),
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Users invited to channel ${channel}: ${userIds.join(', ')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to invite users: ${error.message}`);
    }
  }

  // Public chat write capability (chat:write.public)
  async sendSlackMessagePublic(args) {
    if (!this.slack) {
      await this.initializeSlack(process.env.SLACK_BOT_TOKEN);
    }

    const { channel, text, add_personality = true } = args;
    const messageText = this.addShadowPersonality(text, add_personality);

    try {
      const result = await this.slack.chat.postMessage({
        channel: channel,
        text: messageText,
        unfurl_links: false,
        unfurl_media: false,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Public message sent successfully to ${channel}. Timestamp: ${result.ts}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to send public message: ${error.message}`);
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

