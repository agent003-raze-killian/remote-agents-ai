#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { WebClient } from '@slack/web-api';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class SlackMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'slack-mcp-server',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.slack = new WebClient(process.env.SLACK_BOT_TOKEN);
    this.userSlack = process.env.SLACK_USER_TOKEN ? new WebClient(process.env.SLACK_USER_TOKEN) : null;
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          // === CHANNEL MANAGEMENT ===
          {
            name: 'get_slack_channels',
            description: 'Get list of Slack channels',
            inputSchema: {
              type: 'object',
              properties: {
                types: {
                  type: 'string',
                  description: 'Comma-separated list of channel types (public_channel, private_channel, mpim, im)',
                  default: 'public_channel,private_channel'
                },
                exclude_archived: {
                  type: 'boolean',
                  description: 'Exclude archived channels',
                  default: true
                }
              }
            }
          },
          {
            name: 'create_slack_channel',
            description: 'Create a new Slack channel',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Channel name (without #)'
                },
                is_private: {
                  type: 'boolean',
                  description: 'Whether the channel should be private',
                  default: false
                },
                topic: {
                  type: 'string',
                  description: 'Channel topic'
                },
                purpose: {
                  type: 'string',
                  description: 'Channel purpose'
                }
              },
              required: ['name']
            }
          },
          {
            name: 'join_slack_channel',
            description: 'Join a Slack channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                }
              },
              required: ['channel']
            }
          },
          {
            name: 'leave_slack_channel',
            description: 'Leave a Slack channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                }
              },
              required: ['channel']
            }
          },
          {
            name: 'get_slack_channel_info',
            description: 'Get detailed information about a Slack channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                }
              },
              required: ['channel']
            }
          },
          {
            name: 'update_slack_channel',
            description: 'Update channel settings (topic, purpose)',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                },
                topic: {
                  type: 'string',
                  description: 'New channel topic'
                },
                purpose: {
                  type: 'string',
                  description: 'New channel purpose'
                }
              },
              required: ['channel']
            }
          },
          {
            name: 'invite_user_to_channel',
            description: 'Invite users to a Slack channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                },
                users: {
                  type: 'string',
                  description: 'Comma-separated list of user IDs or usernames'
                }
              },
              required: ['channel', 'users']
            }
          },
          {
            name: 'get_channel_members',
            description: 'Get list of members in a Slack channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                },
                limit: {
                  type: 'number',
                  description: 'Number of members to retrieve',
                  default: 100
                }
              },
              required: ['channel']
            }
          },

          // === MESSAGE MANAGEMENT ===
          {
            name: 'get_slack_messages',
            description: 'Get messages from a Slack channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                },
                limit: {
                  type: 'number',
                  description: 'Number of messages to retrieve (max 1000)',
                  default: 50
                },
                oldest: {
                  type: 'string',
                  description: 'Start of time range of messages to include (Unix timestamp)'
                },
                latest: {
                  type: 'string',
                  description: 'End of time range of messages to include (Unix timestamp)'
                }
              },
              required: ['channel']
            }
          },
          {
            name: 'send_slack_message',
            description: 'Send a message to a Slack channel (as bot)',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                },
                text: {
                  type: 'string',
                  description: 'Message text to send'
                },
                thread_ts: {
                  type: 'string',
                  description: 'Optional timestamp of parent message for threading'
                },
                blocks: {
                  type: 'string',
                  description: 'JSON string of Slack blocks for rich formatting'
                }
              },
              required: ['channel', 'text']
            }
          },
          {
            name: 'send_slack_message_as_user',
            description: 'Send a message to a Slack channel as yourself (user)',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                },
                text: {
                  type: 'string',
                  description: 'Message text to send'
                },
                thread_ts: {
                  type: 'string',
                  description: 'Optional timestamp of parent message for threading'
                },
                blocks: {
                  type: 'string',
                  description: 'JSON string of Slack blocks for rich formatting'
                }
              },
              required: ['channel', 'text']
            }
          },
          {
            name: 'react_to_message',
            description: 'Add a reaction to a Slack message',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                },
                timestamp: {
                  type: 'string',
                  description: 'Message timestamp'
                },
                name: {
                  type: 'string',
                  description: 'Reaction name (emoji without colons, e.g., "thumbsup")'
                }
              },
              required: ['channel', 'timestamp', 'name']
            }
          },
          {
            name: 'get_slack_thread_replies',
            description: 'Get replies in a Slack thread',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                },
                thread_ts: {
                  type: 'string',
                  description: 'Thread timestamp'
                },
                limit: {
                  type: 'number',
                  description: 'Number of replies to retrieve',
                  default: 20
                }
              },
              required: ['channel', 'thread_ts']
            }
          },
          {
            name: 'schedule_slack_message',
            description: 'Schedule a message to be sent later',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                },
                text: {
                  type: 'string',
                  description: 'Message text to send'
                },
                post_at: {
                  type: 'string',
                  description: 'Unix timestamp when to send the message'
                }
              },
              required: ['channel', 'text', 'post_at']
            }
          },
          {
            name: 'delete_slack_message',
            description: 'Delete a Slack message',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                },
                timestamp: {
                  type: 'string',
                  description: 'Message timestamp'
                }
              },
              required: ['channel', 'timestamp']
            }
          },

          // === USER MANAGEMENT ===
          {
            name: 'get_slack_user_info',
            description: 'Get information about a Slack user',
            inputSchema: {
              type: 'object',
              properties: {
                user: {
                  type: 'string',
                  description: 'User ID or username (e.g., U1234567890 or @username)'
                }
              },
              required: ['user']
            }
          },
          {
            name: 'get_slack_users',
            description: 'Get list of Slack users',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Number of users to retrieve',
                  default: 100
                },
                presence: {
                  type: 'boolean',
                  description: 'Include presence information',
                  default: false
                }
              }
            }
          },
          {
            name: 'get_slack_user_presence',
            description: 'Get user presence information',
            inputSchema: {
              type: 'object',
              properties: {
                user: {
                  type: 'string',
                  description: 'User ID or username (e.g., U1234567890 or @username)'
                }
              },
              required: ['user']
            }
          },

          // === FILE MANAGEMENT ===
          {
            name: 'get_slack_files',
            description: 'Get files shared in Slack',
            inputSchema: {
              type: 'object',
              properties: {
                user: {
                  type: 'string',
                  description: 'Filter by user ID'
                },
                channel: {
                  type: 'string',
                  description: 'Filter by channel ID'
                },
                types: {
                  type: 'string',
                  description: 'File types to filter by (images, docs, etc.)'
                },
                count: {
                  type: 'number',
                  description: 'Number of files to retrieve',
                  default: 20
                }
              }
            }
          },
          {
            name: 'get_slack_file_info',
            description: 'Get information about a specific Slack file',
            inputSchema: {
              type: 'object',
              properties: {
                file: {
                  type: 'string',
                  description: 'File ID'
                }
              },
              required: ['file']
            }
          },
          {
            name: 'delete_slack_file',
            description: 'Delete a Slack file',
            inputSchema: {
              type: 'object',
              properties: {
                file: {
                  type: 'string',
                  description: 'File ID'
                }
              },
              required: ['file']
            }
          },

          // === SEARCH AND FILTERING ===
          {
            name: 'search_slack_messages',
            description: 'Search for messages across Slack channels',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query'
                },
                count: {
                  type: 'number',
                  description: 'Number of results to return (max 100)',
                  default: 20
                },
                sort: {
                  type: 'string',
                  description: 'Sort order (score, timestamp)',
                  default: 'score'
                }
              },
              required: ['query']
            }
          },
          {
            name: 'search_slack_files',
            description: 'Search for files in Slack',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query'
                },
                count: {
                  type: 'number',
                  description: 'Number of results to return',
                  default: 20
                },
                sort: {
                  type: 'string',
                  description: 'Sort order (score, timestamp)',
                  default: 'score'
                }
              },
              required: ['query']
            }
          },
          {
            name: 'get_slack_conversation_history',
            description: 'Get conversation history with advanced filtering',
            inputSchema: {
              type: 'object',
              properties: {
                channel: {
                  type: 'string',
                  description: 'Channel ID or name (e.g., #general or C1234567890)'
                },
                limit: {
                  type: 'number',
                  description: 'Number of messages to retrieve',
                  default: 50
                },
                oldest: {
                  type: 'string',
                  description: 'Start of time range (Unix timestamp)'
                },
                latest: {
                  type: 'string',
                  description: 'End of time range (Unix timestamp)'
                },
                inclusive: {
                  type: 'boolean',
                  description: 'Include messages with oldest or latest timestamp',
                  default: true
                }
              },
              required: ['channel']
            }
          },

          // === WORKSPACE MANAGEMENT ===
          {
            name: 'get_slack_team_info',
            description: 'Get information about the Slack workspace',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'get_slack_reminders',
            description: 'Get Slack reminders',
            inputSchema: {
              type: 'object',
              properties: {}
            }
          },
          {
            name: 'create_slack_reminder',
            description: 'Create a Slack reminder',
            inputSchema: {
              type: 'object',
              properties: {
                text: {
                  type: 'string',
                  description: 'Reminder text'
                },
                time: {
                  type: 'string',
                  description: 'When to remind (e.g., "in 30 minutes", "tomorrow at 9am")'
                },
                user: {
                  type: 'string',
                  description: 'User ID to remind (defaults to current user)'
                }
              },
              required: ['text', 'time']
            }
          }
        ]
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Channel Management
          case 'get_slack_channels':
            return await this.getSlackChannels(args);
          case 'create_slack_channel':
            return await this.createSlackChannel(args);
          case 'join_slack_channel':
            return await this.joinSlackChannel(args);
          case 'leave_slack_channel':
            return await this.leaveSlackChannel(args);
          case 'get_slack_channel_info':
            return await this.getSlackChannelInfo(args);
          case 'update_slack_channel':
            return await this.updateSlackChannel(args);
          case 'invite_user_to_channel':
            return await this.inviteUserToChannel(args);
          case 'get_channel_members':
            return await this.getChannelMembers(args);
          
          // Message Management
          case 'get_slack_messages':
            return await this.getSlackMessages(args);
          case 'send_slack_message':
            return await this.sendSlackMessage(args);
          case 'send_slack_message_as_user':
            return await this.sendSlackMessageAsUser(args);
          case 'react_to_message':
            return await this.reactToMessage(args);
          case 'get_slack_thread_replies':
            return await this.getSlackThreadReplies(args);
          case 'schedule_slack_message':
            return await this.scheduleSlackMessage(args);
          case 'delete_slack_message':
            return await this.deleteSlackMessage(args);
          
          // User Management
          case 'get_slack_user_info':
            return await this.getSlackUserInfo(args);
          case 'get_slack_users':
            return await this.getSlackUsers(args);
          case 'get_slack_user_presence':
            return await this.getSlackUserPresence(args);
          
          // File Management
          case 'get_slack_files':
            return await this.getSlackFiles(args);
          case 'get_slack_file_info':
            return await this.getSlackFileInfo(args);
          case 'delete_slack_file':
            return await this.deleteSlackFile(args);
          
          // Search and Filtering
          case 'search_slack_messages':
            return await this.searchSlackMessages(args);
          case 'search_slack_files':
            return await this.searchSlackFiles(args);
          case 'get_slack_conversation_history':
            return await this.getSlackConversationHistory(args);
          
          // Workspace Management
          case 'get_slack_team_info':
            return await this.getSlackTeamInfo(args);
          case 'get_slack_reminders':
            return await this.getSlackReminders(args);
          case 'create_slack_reminder':
            return await this.createSlackReminder(args);
          
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error.message}`
            }
          ],
          isError: true
        };
      }
    });
  }

  async getSlackChannels(args) {
    const { types = 'public_channel,private_channel', exclude_archived = true } = args;
    
    const result = await this.slack.conversations.list({
      types: types,
      exclude_archived: exclude_archived,
      limit: 1000
    });

    if (!result.ok) {
      throw new Error(`Failed to get channels: ${result.error}`);
    }

    const channels = result.channels.map(channel => ({
      id: channel.id,
      name: channel.name,
      is_private: channel.is_private,
      is_member: channel.is_member,
      num_members: channel.num_members,
      topic: channel.topic?.value || '',
      purpose: channel.purpose?.value || ''
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${channels.length} channels:\n\n${channels.map(c => 
            `#${c.name} (${c.id})\n  Members: ${c.num_members || 'N/A'}\n  Private: ${c.is_private}\n  Topic: ${c.topic}\n  Purpose: ${c.purpose}\n`
          ).join('\n')}`
        }
      ]
    };
  }

  async getSlackMessages(args) {
    const { channel, limit = 50, oldest, latest } = args;
    
    // Resolve channel name to ID if needed
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const result = await this.slack.conversations.history({
      channel: channelId,
      limit: Math.min(limit, 1000),
      oldest: oldest,
      latest: latest
    });

    if (!result.ok) {
      throw new Error(`Failed to get messages: ${result.error}`);
    }

    const messages = result.messages.map(msg => ({
      timestamp: msg.ts,
      user: msg.user || 'Unknown',
      text: msg.text || '',
      thread_ts: msg.thread_ts,
      reply_count: msg.reply_count || 0,
      reactions: msg.reactions || []
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${messages.length} messages in ${channel}:\n\n${messages.map(msg => 
            `[${new Date(parseFloat(msg.timestamp) * 1000).toLocaleString()}] ${msg.user}: ${msg.text}${msg.thread_ts ? ' (thread reply)' : ''}`
          ).join('\n')}`
        }
      ]
    };
  }

  async sendSlackMessage(args) {
    const { channel, text, thread_ts } = args;
    
    // Resolve channel name to ID if needed
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const result = await this.slack.chat.postMessage({
      channel: channelId,
      text: text,
      thread_ts: thread_ts
    });

    if (!result.ok) {
      throw new Error(`Failed to send message: ${result.error}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Message sent successfully to ${channel} (as bot)!\nMessage timestamp: ${result.ts}`
        }
      ]
    };
  }

  async sendSlackMessageAsUser(args) {
    const { channel, text, thread_ts } = args;
    
    if (!this.userSlack) {
      throw new Error('User OAuth Token not configured. Please set SLACK_USER_TOKEN in your .env file.');
    }
    
    // Resolve channel name to ID if needed
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const result = await this.userSlack.chat.postMessage({
      channel: channelId,
      text: text,
      thread_ts: thread_ts
    });

    if (!result.ok) {
      throw new Error(`Failed to send message: ${result.error}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Message sent successfully to ${channel} (as user)!\nMessage timestamp: ${result.ts}`
        }
      ]
    };
  }

  async getSlackUserInfo(args) {
    const { user } = args;
    
    let userId = user;
    if (user.startsWith('@')) {
      const username = user.substring(1);
      const usersResult = await this.slack.users.list();
      const foundUser = usersResult.members.find(u => u.name === username);
      if (!foundUser) {
        throw new Error(`User ${user} not found`);
      }
      userId = foundUser.id;
    }

    const result = await this.slack.users.info({
      user: userId
    });

    if (!result.ok) {
      throw new Error(`Failed to get user info: ${result.error}`);
    }

    const userInfo = result.user;
    return {
      content: [
        {
          type: 'text',
          text: `User Information:\n\nName: ${userInfo.real_name || userInfo.name}\nUsername: @${userInfo.name}\nID: ${userInfo.id}\nEmail: ${userInfo.profile?.email || 'N/A'}\nStatus: ${userInfo.profile?.status_text || 'N/A'}\nTitle: ${userInfo.profile?.title || 'N/A'}\nTimezone: ${userInfo.tz || 'N/A'}`
        }
      ]
    };
  }

  async searchSlackMessages(args) {
    const { query, count = 20, sort = 'score' } = args;
    
    const result = await this.slack.search.messages({
      query: query,
      count: Math.min(count, 100),
      sort: sort
    });

    if (!result.ok) {
      throw new Error(`Failed to search messages: ${result.error}`);
    }

    const messages = result.messages.matches.map(msg => ({
      channel: msg.channel?.name || 'Unknown',
      user: msg.username || 'Unknown',
      text: msg.text || '',
      timestamp: msg.ts,
      permalink: msg.permalink
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${messages.length} messages matching "${query}":\n\n${messages.map(msg => 
            `[${msg.channel}] [${new Date(parseFloat(msg.timestamp) * 1000).toLocaleString()}] ${msg.user}: ${msg.text}\nPermalink: ${msg.permalink}`
          ).join('\n\n')}`
        }
      ]
    };
  }

  // === CHANNEL MANAGEMENT METHODS ===
  
  async createSlackChannel(args) {
    const { name, is_private = false, topic, purpose } = args;
    
    const result = await this.slack.conversations.create({
      name: name,
      is_private: is_private
    });

    if (!result.ok) {
      throw new Error(`Failed to create channel: ${result.error}`);
    }

    const channel = result.channel;
    
    // Set topic and purpose if provided
    if (topic || purpose) {
      try {
        if (topic) {
          await this.slack.conversations.setTopic({
            channel: channel.id,
            topic: topic
          });
        }
        if (purpose) {
          await this.slack.conversations.setPurpose({
            channel: channel.id,
            purpose: purpose
          });
        }
      } catch (error) {
        console.error('Warning: Failed to set topic/purpose:', error.message);
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `Channel #${channel.name} created successfully!\nChannel ID: ${channel.id}\nPrivate: ${is_private}`
        }
      ]
    };
  }

  async joinSlackChannel(args) {
    const { channel } = args;
    
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const result = await this.slack.conversations.join({
      channel: channelId
    });

    if (!result.ok) {
      throw new Error(`Failed to join channel: ${result.error}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Successfully joined channel ${channel}!`
        }
      ]
    };
  }

  async leaveSlackChannel(args) {
    const { channel } = args;
    
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const result = await this.slack.conversations.leave({
      channel: channelId
    });

    if (!result.ok) {
      throw new Error(`Failed to leave channel: ${result.error}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Successfully left channel ${channel}!`
        }
      ]
    };
  }

  async getSlackChannelInfo(args) {
    const { channel } = args;
    
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const result = await this.slack.conversations.info({
      channel: channelId
    });

    if (!result.ok) {
      throw new Error(`Failed to get channel info: ${result.error}`);
    }

    const channelInfo = result.channel;
    return {
      content: [
        {
          type: 'text',
          text: `Channel Information:\n\nName: #${channelInfo.name}\nID: ${channelInfo.id}\nPrivate: ${channelInfo.is_private}\nMembers: ${channelInfo.num_members}\nTopic: ${channelInfo.topic?.value || 'N/A'}\nPurpose: ${channelInfo.purpose?.value || 'N/A'}\nCreated: ${new Date(channelInfo.created * 1000).toLocaleString()}`
        }
      ]
    };
  }

  async updateSlackChannel(args) {
    const { channel, topic, purpose } = args;
    
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const updates = [];
    
    if (topic) {
      const topicResult = await this.slack.conversations.setTopic({
        channel: channelId,
        topic: topic
      });
      if (topicResult.ok) {
        updates.push('topic');
      }
    }

    if (purpose) {
      const purposeResult = await this.slack.conversations.setPurpose({
        channel: channelId,
        purpose: purpose
      });
      if (purposeResult.ok) {
        updates.push('purpose');
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `Channel ${channel} updated successfully!\nUpdated: ${updates.join(', ')}`
        }
      ]
    };
  }

  async inviteUserToChannel(args) {
    const { channel, users } = args;
    
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const userList = users.split(',').map(u => u.trim());
    const results = [];

    for (const user of userList) {
      try {
        const result = await this.slack.conversations.invite({
          channel: channelId,
          users: user
        });
        if (result.ok) {
          results.push(`${user}: Success`);
        } else {
          results.push(`${user}: Failed - ${result.error}`);
        }
      } catch (error) {
        results.push(`${user}: Error - ${error.message}`);
      }
    }

    return {
      content: [
        {
          type: 'text',
          text: `Invitation results for ${channel}:\n${results.join('\n')}`
        }
      ]
    };
  }

  async getChannelMembers(args) {
    const { channel, limit = 100 } = args;
    
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const result = await this.slack.conversations.members({
      channel: channelId,
      limit: limit
    });

    if (!result.ok) {
      throw new Error(`Failed to get channel members: ${result.error}`);
    }

    const members = result.members;
    return {
      content: [
        {
          type: 'text',
          text: `Channel ${channel} has ${members.length} members:\n${members.join('\n')}`
        }
      ]
    };
  }

  // === MESSAGE MANAGEMENT METHODS ===

  async reactToMessage(args) {
    const { channel, timestamp, name } = args;
    
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const result = await this.slack.reactions.add({
      channel: channelId,
      timestamp: timestamp,
      name: name
    });

    if (!result.ok) {
      throw new Error(`Failed to add reaction: ${result.error}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Added reaction :${name}: to message in ${channel}!`
        }
      ]
    };
  }

  async getSlackThreadReplies(args) {
    const { channel, thread_ts, limit = 20 } = args;
    
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const result = await this.slack.conversations.replies({
      channel: channelId,
      ts: thread_ts,
      limit: limit
    });

    if (!result.ok) {
      throw new Error(`Failed to get thread replies: ${result.error}`);
    }

    const messages = result.messages.map(msg => ({
      timestamp: msg.ts,
      user: msg.user || 'Unknown',
      text: msg.text || '',
      is_thread_reply: msg.ts !== thread_ts
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${messages.length} messages in thread:\n\n${messages.map(msg => 
            `[${new Date(parseFloat(msg.timestamp) * 1000).toLocaleString()}] ${msg.user}: ${msg.text}${msg.is_thread_reply ? ' (reply)' : ' (original)'}`
          ).join('\n')}`
        }
      ]
    };
  }

  async scheduleSlackMessage(args) {
    const { channel, text, post_at } = args;
    
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const result = await this.slack.chat.scheduleMessage({
      channel: channelId,
      text: text,
      post_at: post_at
    });

    if (!result.ok) {
      throw new Error(`Failed to schedule message: ${result.error}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Message scheduled successfully for ${channel}!\nScheduled time: ${new Date(parseFloat(post_at) * 1000).toLocaleString()}\nScheduled message ID: ${result.scheduled_message_id}`
        }
      ]
    };
  }

  async deleteSlackMessage(args) {
    const { channel, timestamp } = args;
    
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const result = await this.slack.chat.delete({
      channel: channelId,
      ts: timestamp
    });

    if (!result.ok) {
      throw new Error(`Failed to delete message: ${result.error}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Message deleted successfully from ${channel}!`
        }
      ]
    };
  }

  // === USER MANAGEMENT METHODS ===

  async getSlackUsers(args) {
    const { limit = 100, presence = false } = args;
    
    const result = await this.slack.users.list({
      limit: limit,
      presence: presence
    });

    if (!result.ok) {
      throw new Error(`Failed to get users: ${result.error}`);
    }

    const users = result.members.map(user => ({
      id: user.id,
      name: user.name,
      real_name: user.real_name,
      email: user.profile?.email,
      status: user.profile?.status_text,
      presence: user.presence
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${users.length} users:\n\n${users.map(u => 
            `@${u.name} (${u.real_name})\n  ID: ${u.id}\n  Email: ${u.email || 'N/A'}\n  Status: ${u.status || 'N/A'}${presence ? `\n  Presence: ${u.presence || 'N/A'}` : ''}`
          ).join('\n\n')}`
        }
      ]
    };
  }

  async getSlackUserPresence(args) {
    const { user } = args;
    
    let userId = user;
    if (user.startsWith('@')) {
      const username = user.substring(1);
      const usersResult = await this.slack.users.list();
      const foundUser = usersResult.members.find(u => u.name === username);
      if (!foundUser) {
        throw new Error(`User ${user} not found`);
      }
      userId = foundUser.id;
    }

    const result = await this.slack.users.getPresence({
      user: userId
    });

    if (!result.ok) {
      throw new Error(`Failed to get user presence: ${result.error}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `User ${user} presence:\nStatus: ${result.presence}\nLast Activity: ${result.last_activity ? new Date(result.last_activity * 1000).toLocaleString() : 'N/A'}`
        }
      ]
    };
  }

  // === FILE MANAGEMENT METHODS ===

  async getSlackFiles(args) {
    const { user, channel, types, count = 20 } = args;
    
    const params = { count: count };
    if (user) params.user = user;
    if (channel) params.channel = channel;
    if (types) params.types = types;

    const result = await this.slack.files.list(params);

    if (!result.ok) {
      throw new Error(`Failed to get files: ${result.error}`);
    }

    const files = result.files.map(file => ({
      id: file.id,
      name: file.name,
      title: file.title,
      user: file.user,
      size: file.size,
      filetype: file.filetype,
      url_private: file.url_private,
      created: file.created
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${files.length} files:\n\n${files.map(f => 
            `${f.name} (${f.filetype})\n  ID: ${f.id}\n  Size: ${f.size} bytes\n  Created: ${new Date(f.created * 1000).toLocaleString()}`
          ).join('\n\n')}`
        }
      ]
    };
  }

  async getSlackFileInfo(args) {
    const { file } = args;
    
    const result = await this.slack.files.info({
      file: file
    });

    if (!result.ok) {
      throw new Error(`Failed to get file info: ${result.error}`);
    }

    const fileInfo = result.file;
    return {
      content: [
        {
          type: 'text',
          text: `File Information:\n\nName: ${fileInfo.name}\nTitle: ${fileInfo.title}\nType: ${fileInfo.filetype}\nSize: ${fileInfo.size} bytes\nCreated: ${new Date(fileInfo.created * 1000).toLocaleString()}\nUser: ${fileInfo.user}\nURL: ${fileInfo.url_private}`
        }
      ]
    };
  }

  async deleteSlackFile(args) {
    const { file } = args;
    
    const result = await this.slack.files.delete({
      file: file
    });

    if (!result.ok) {
      throw new Error(`Failed to delete file: ${result.error}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `File ${file} deleted successfully!`
        }
      ]
    };
  }

  // === SEARCH AND FILTERING METHODS ===

  async searchSlackFiles(args) {
    const { query, count = 20, sort = 'score' } = args;
    
    const result = await this.slack.search.files({
      query: query,
      count: count,
      sort: sort
    });

    if (!result.ok) {
      throw new Error(`Failed to search files: ${result.error}`);
    }

    const files = result.files.matches.map(file => ({
      name: file.name,
      title: file.title,
      user: file.user,
      size: file.size,
      filetype: file.filetype,
      url: file.url_private,
      created: file.created
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${files.length} files matching "${query}":\n\n${files.map(f => 
            `${f.name} (${f.filetype})\n  Size: ${f.size} bytes\n  Created: ${new Date(f.created * 1000).toLocaleString()}`
          ).join('\n\n')}`
        }
      ]
    };
  }

  async getSlackConversationHistory(args) {
    const { channel, limit = 50, oldest, latest, inclusive = true } = args;
    
    let channelId = channel;
    if (channel.startsWith('#')) {
      const channelName = channel.substring(1);
      const channelsResult = await this.slack.conversations.list();
      const foundChannel = channelsResult.channels.find(c => c.name === channelName);
      if (!foundChannel) {
        throw new Error(`Channel ${channel} not found`);
      }
      channelId = foundChannel.id;
    }

    const params = {
      channel: channelId,
      limit: Math.min(limit, 1000),
      inclusive: inclusive
    };
    
    if (oldest) params.oldest = oldest;
    if (latest) params.latest = latest;

    const result = await this.slack.conversations.history(params);

    if (!result.ok) {
      throw new Error(`Failed to get conversation history: ${result.error}`);
    }

    const messages = result.messages.map(msg => ({
      timestamp: msg.ts,
      user: msg.user || 'Unknown',
      text: msg.text || '',
      thread_ts: msg.thread_ts,
      reply_count: msg.reply_count || 0
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${messages.length} messages in ${channel}:\n\n${messages.map(msg => 
            `[${new Date(parseFloat(msg.timestamp) * 1000).toLocaleString()}] ${msg.user}: ${msg.text}${msg.thread_ts ? ' (thread)' : ''}`
          ).join('\n')}`
        }
      ]
    };
  }

  // === WORKSPACE MANAGEMENT METHODS ===

  async getSlackTeamInfo(args) {
    const result = await this.slack.team.info();

    if (!result.ok) {
      throw new Error(`Failed to get team info: ${result.error}`);
    }

    const team = result.team;
    return {
      content: [
        {
          type: 'text',
          text: `Team Information:\n\nName: ${team.name}\nDomain: ${team.domain}\nID: ${team.id}\nCreated: ${new Date(team.created * 1000).toLocaleString()}\nMembers: ${team.num_members}`
        }
      ]
    };
  }

  async getSlackReminders(args) {
    const result = await this.slack.reminders.list();

    if (!result.ok) {
      throw new Error(`Failed to get reminders: ${result.error}`);
    }

    const reminders = result.reminders.map(reminder => ({
      id: reminder.id,
      text: reminder.text,
      user: reminder.user,
      time: reminder.time,
      recurring: reminder.recurring
    }));

    return {
      content: [
        {
          type: 'text',
          text: `Found ${reminders.length} reminders:\n\n${reminders.map(r => 
            `${r.text}\n  Time: ${new Date(r.time * 1000).toLocaleString()}\n  Recurring: ${r.recurring ? 'Yes' : 'No'}`
          ).join('\n\n')}`
        }
      ]
    };
  }

  async createSlackReminder(args) {
    const { text, time, user } = args;
    
    const params = {
      text: text,
      time: time
    };
    
    if (user) params.user = user;

    const result = await this.slack.reminders.add(params);

    if (!result.ok) {
      throw new Error(`Failed to create reminder: ${result.error}`);
    }

    return {
      content: [
        {
          type: 'text',
          text: `Reminder created successfully!\nReminder ID: ${result.reminder.id}\nText: ${text}\nTime: ${time}`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Slack MCP server running on stdio');
  }
}

// Validate environment variables
if (!process.env.SLACK_BOT_TOKEN) {
  console.error('Error: SLACK_BOT_TOKEN environment variable is required');
  process.exit(1);
}

if (!process.env.SLACK_APP_TOKEN) {
  console.error('Error: SLACK_APP_TOKEN environment variable is required');
  process.exit(1);
}

// Start the server
const server = new SlackMCPServer();
server.run().catch(console.error);

