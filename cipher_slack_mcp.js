#!/usr/bin/env node
/**
 * Cipher Agent002 Slack MCP Server (Node.js)
 * Specialized for direct messaging and replying
 */

const { WebClient } = require('@slack/web-api');
const { Server } = require('@modelcontextprotocol/sdk/server/index.js');
const { StdioServerTransport } = require('@modelcontextprotocol/sdk/server/stdio.js');
const {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ListResourcesRequestSchema,
  ReadResourceRequestSchema,
} = require('@modelcontextprotocol/sdk/types.js');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split('=');
      if (key && valueParts.length > 0) {
        const value = valueParts.join('=').trim();
        process.env[key.trim()] = value;
      }
    });
  }
}

// Load environment variables
loadEnvFile();

class CipherSlackMCPServer {
  constructor() {
    this.slackToken = process.env.SLACK_BOT_TOKEN;
    
    if (!this.slackToken) {
      throw new Error('SLACK_BOT_TOKEN environment variable is required');
    }
    
    this.client = new WebClient(this.slackToken);
    this.server = new Server(
      {
        name: 'cipher-slack-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
          resources: {},
        },
      }
    );
    
    this.setupHandlers();
  }
  
  setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'send_message',
            description: 'Send a message to a channel or user',
            inputSchema: {
              type: 'object',
              properties: {
                channel: { type: 'string', description: 'Channel ID or name (e.g., #general, C1234567890)' },
                text: { type: 'string', description: 'Message text to send' },
                blocks: { type: 'array', description: 'Optional Slack blocks for rich formatting' }
              },
              required: ['channel', 'text']
            }
          },
          {
            name: 'send_dm',
            description: 'Send a direct message to a user',
            inputSchema: {
              type: 'object',
              properties: {
                user_id: { type: 'string', description: 'User ID (e.g., U1234567890)' },
                text: { type: 'string', description: 'Message text to send' }
              },
              required: ['user_id', 'text']
            }
          },
          {
            name: 'reply_to_message',
            description: 'Reply to a specific message in a thread',
            inputSchema: {
              type: 'object',
              properties: {
                channel: { type: 'string', description: 'Channel ID or name' },
                thread_ts: { type: 'string', description: 'Timestamp of the message to reply to' },
                text: { type: 'string', description: 'Reply text' }
              },
              required: ['channel', 'thread_ts', 'text']
            }
          },
          {
            name: 'add_reaction',
            description: 'Add a reaction (emoji) to a message',
            inputSchema: {
              type: 'object',
              properties: {
                channel: { type: 'string', description: 'Channel ID or name' },
                timestamp: { type: 'string', description: 'Message timestamp' },
                emoji: { type: 'string', description: 'Emoji name (without colons, e.g., robot_face)' }
              },
              required: ['channel', 'timestamp', 'emoji']
            }
          },
          {
            name: 'get_channel_messages',
            description: 'Get recent messages from a channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: { type: 'string', description: 'Channel ID or name' },
                limit: { type: 'number', description: 'Number of messages to retrieve (default: 10)' }
              },
              required: ['channel']
            }
          },
          {
            name: 'get_user_info',
            description: 'Get information about a user',
            inputSchema: {
              type: 'object',
              properties: {
                user_id: { type: 'string', description: 'User ID' }
              },
              required: ['user_id']
            }
          },
          {
            name: 'list_channels',
            description: 'List channels in the workspace',
            inputSchema: {
              type: 'object',
              properties: {
                types: { type: 'string', description: 'Channel types to include (default: public_channel,private_channel)' }
              }
            }
          },
          {
            name: 'create_channel',
            description: 'Create a new channel',
            inputSchema: {
              type: 'object',
              properties: {
                name: { type: 'string', description: 'Channel name' },
                is_private: { type: 'boolean', description: 'Whether the channel should be private' }
              },
              required: ['name']
            }
          },
          {
            name: 'join_channel',
            description: 'Join a channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: { type: 'string', description: 'Channel ID or name' }
              },
              required: ['channel']
            }
          },
          {
            name: 'send_file',
            description: 'Send a file to a channel',
            inputSchema: {
              type: 'object',
              properties: {
                channel: { type: 'string', description: 'Channel ID or name' },
                file_path: { type: 'string', description: 'Path to the file to upload' },
                title: { type: 'string', description: 'Optional file title' },
                initial_comment: { type: 'string', description: 'Optional comment with the file' }
              },
              required: ['channel', 'file_path']
            }
          },
          {
            name: 'pin_message',
            description: 'Pin a message',
            inputSchema: {
              type: 'object',
              properties: {
                channel: { type: 'string', description: 'Channel ID or name' },
                timestamp: { type: 'string', description: 'Message timestamp' }
              },
              required: ['channel', 'timestamp']
            }
          },
          {
            name: 'search_messages',
            description: 'Search messages in the workspace',
            inputSchema: {
              type: 'object',
              properties: {
                query: { type: 'string', description: 'Search query' },
                count: { type: 'number', description: 'Number of results (default: 20)' }
              },
              required: ['query']
            }
          }
        ]
      };
    });
    
    // List available resources
    this.server.setRequestHandler(ListResourcesRequestSchema, async () => {
      return {
        resources: [
          {
            uri: 'slack://workspace/info',
            name: 'Workspace Information',
            description: 'Get information about the Slack workspace',
            mimeType: 'application/json'
          },
          {
            uri: 'slack://channels/list',
            name: 'Channel List',
            description: 'Get list of channels in the workspace',
            mimeType: 'application/json'
          },
          {
            uri: 'slack://users/list',
            name: 'User List',
            description: 'Get list of users in the workspace',
            mimeType: 'application/json'
          }
        ]
      };
    });
    
    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      try {
        let result;
        
        switch (name) {
          case 'send_message':
            result = await this.sendMessage(args.channel, args.text, args.blocks);
            break;
          case 'send_dm':
            result = await this.sendDirectMessage(args.user_id, args.text);
            break;
          case 'reply_to_message':
            result = await this.replyToMessage(args.channel, args.thread_ts, args.text);
            break;
          case 'add_reaction':
            result = await this.addReaction(args.channel, args.timestamp, args.emoji);
            break;
          case 'get_channel_messages':
            result = await this.getChannelMessages(args.channel, args.limit || 10);
            break;
          case 'get_user_info':
            result = await this.getUserInfo(args.user_id);
            break;
          case 'list_channels':
            result = await this.listChannels(args.types);
            break;
          case 'create_channel':
            result = await this.createChannel(args.name, args.is_private);
            break;
          case 'join_channel':
            result = await this.joinChannel(args.channel);
            break;
          case 'send_file':
            result = await this.sendFile(args.channel, args.file_path, args.title, args.initial_comment);
            break;
          case 'pin_message':
            result = await this.pinMessage(args.channel, args.timestamp);
            break;
          case 'search_messages':
            result = await this.searchMessages(args.query, args.count || 20);
            break;
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
        
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
        
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: error.message
              }, null, 2)
            }
          ],
          isError: true
        };
      }
    });
    
    // Handle resource reads
    this.server.setRequestHandler(ReadResourceRequestSchema, async (request) => {
      const { uri } = request.params;
      
      try {
        let result;
        
        switch (uri) {
          case 'slack://workspace/info':
            result = await this.getWorkspaceInfo();
            break;
          case 'slack://channels/list':
            result = await this.getChannelList();
            break;
          case 'slack://users/list':
            result = await this.getUserList();
            break;
          default:
            throw new Error(`Unknown resource: ${uri}`);
        }
        
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify(result, null, 2)
            }
          ]
        };
        
      } catch (error) {
        return {
          contents: [
            {
              uri,
              mimeType: 'application/json',
              text: JSON.stringify({ error: error.message }, null, 2)
            }
          ]
        };
      }
    });
  }
  
  // Tool implementations
  async sendMessage(channel, text, blocks = null) {
    try {
      const response = await this.client.chat.postMessage({
        channel,
        text,
        blocks
      });
      
      return {
        success: true,
        channel,
        message: text,
        timestamp: response.ts,
        message_url: `https://slack.com/archives/${channel}/p${response.ts.replace('.', '')}`
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async sendDirectMessage(userId, text) {
    try {
      // Open DM channel
      const dmResponse = await this.client.conversations.open({
        users: userId
      });
      const channelId = dmResponse.channel.id;
      
      // Send message
      const response = await this.client.chat.postMessage({
        channel: channelId,
        text
      });
      
      return {
        success: true,
        user_id: userId,
        channel_id: channelId,
        message: text,
        timestamp: response.ts
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async replyToMessage(channel, threadTs, text) {
    try {
      const response = await this.client.chat.postMessage({
        channel,
        thread_ts: threadTs,
        text
      });
      
      return {
        success: true,
        channel,
        thread_ts: threadTs,
        reply_ts: response.ts,
        message: text
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async addReaction(channel, timestamp, emoji) {
    try {
      const response = await this.client.reactions.add({
        channel,
        timestamp,
        name: emoji
      });
      
      return {
        success: true,
        channel,
        timestamp,
        emoji,
        added: response.ok
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async getChannelMessages(channel, limit) {
    try {
      const response = await this.client.conversations.history({
        channel,
        limit
      });
      
      const messages = response.messages.map(message => ({
        timestamp: message.ts,
        text: message.text || '',
        user: message.user,
        bot_id: message.bot_id,
        thread_ts: message.thread_ts,
        reactions: message.reactions || []
      }));
      
      return {
        success: true,
        channel,
        messages,
        count: messages.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async getUserInfo(userId) {
    try {
      const response = await this.client.users.info({ user: userId });
      const user = response.user;
      
      return {
        success: true,
        user: {
          id: user.id,
          name: user.name,
          real_name: user.real_name,
          display_name: user.profile.display_name,
          email: user.profile.email,
          title: user.profile.title,
          image_48: user.profile.image_48,
          is_bot: user.is_bot
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async listChannels(types = 'public_channel,private_channel') {
    try {
      const response = await this.client.conversations.list({ types });
      
      const channels = response.channels.map(channel => ({
        id: channel.id,
        name: channel.name,
        is_private: channel.is_private,
        is_archived: channel.is_archived,
        member_count: channel.num_members,
        topic: channel.topic.value,
        purpose: channel.purpose.value
      }));
      
      return {
        success: true,
        channels,
        count: channels.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async createChannel(name, isPrivate = false) {
    try {
      const response = await this.client.conversations.create({
        name,
        is_private: isPrivate
      });
      
      return {
        success: true,
        channel: {
          id: response.channel.id,
          name: response.channel.name,
          is_private: response.channel.is_private
        }
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async joinChannel(channel) {
    try {
      const response = await this.client.conversations.join({ channel });
      
      return {
        success: true,
        channel,
        joined: response.ok
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async sendFile(channel, filePath, title = null, initialComment = null) {
    try {
      const fs = require('fs');
      const path = require('path');
      
      // Get filename from file path
      const filename = path.basename(filePath);
      
      // Resolve channel name to ID if needed
      let channelId = channel;
      if (channel.startsWith('#')) {
        const channelName = channel.substring(1);
        try {
          const channelInfo = await this.client.conversations.list({
            types: 'public_channel,private_channel'
          });
          const foundChannel = channelInfo.channels.find(c => c.name === channelName);
          if (foundChannel) {
            channelId = foundChannel.id;
          }
        } catch (err) {
          console.log('Could not resolve channel name, using as-is:', channel);
        }
      }
      
      console.log(`📤 Uploading file ${filename} to channel ${channelId}`);
      
      // Use the newer uploadV2 method
      const response = await this.client.files.uploadV2({
        channel_id: channelId,
        file: fs.createReadStream(filePath),
        filename: filename,
        title: title || filename,
        initial_comment: initialComment
      });
      
      console.log('📤 File upload response:', response);
      
      return {
        success: true,
        channel: channelId,
        file_path: filePath,
        file_id: response.file.id,
        file_url: response.file.url_private
      };
    } catch (error) {
      console.error('❌ File upload error:', error);
      return { success: false, error: error.message };
    }
  }
  
  async pinMessage(channel, timestamp) {
    try {
      const response = await this.client.pins.add({
        channel,
        timestamp
      });
      
      return {
        success: true,
        channel,
        timestamp,
        pinned: response.ok
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  async searchMessages(query, count) {
    try {
      const response = await this.client.search.messages({
        query,
        count
      });
      
      const messages = response.messages.matches.map(match => ({
        text: match.text,
        user: match.user,
        channel: match.channel.name,
        timestamp: match.ts,
        permalink: match.permalink
      }));
      
      return {
        success: true,
        query,
        messages,
        count: messages.length
      };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
  
  // Resource implementations
  async getWorkspaceInfo() {
    try {
      const response = await this.client.team.info();
      const team = response.team;
      
      return {
        id: team.id,
        name: team.name,
        domain: team.domain,
        email_domain: team.email_domain,
        icon: team.icon
      };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  async getChannelList() {
    try {
      const response = await this.client.conversations.list();
      const channels = response.channels.map(channel => ({
        id: channel.id,
        name: channel.name,
        is_private: channel.is_private,
        member_count: channel.num_members
      }));
      return { channels };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  async getUserList() {
    try {
      const response = await this.client.users.list();
      const users = response.members.map(user => ({
        id: user.id,
        name: user.name,
        real_name: user.real_name,
        is_bot: user.is_bot
      }));
      return { users };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('▓▒░ Cipher Agent002 Slack MCP Server running... ⟨MATRIX⟩');
  }
}

// Main execution
async function main() {
  try {
    const server = new CipherSlackMCPServer();
    await server.run();
  } catch (error) {
    console.error('Error starting server:', error.message);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = CipherSlackMCPServer;
