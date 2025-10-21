import { WebClient } from '@slack/web-api';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

/**
 * SLACK TOOLS MODULE ⚔️
 * 
 * Military-grade Slack communication for APEX Agent
 * Handles messaging, channel management, file uploads, and team coordination
 */
export class SlackTools {
  private client: WebClient;

  constructor() {
    const token = process.env.SLACK_BOT_TOKEN;
    if (!token) {
      throw new Error('⚔️ SLACK_BOT_TOKEN environment variable required for APEX operations');
    }

    this.client = new WebClient(token);
  }

  getTools(): Tool[] {
    return [
      {
        name: 'slack_send_message',
        description: 'Send messages with military precision and APEX personality',
        inputSchema: {
          type: 'object',
          properties: {
            channel: { type: 'string', description: 'Channel name or ID' },
            text: { type: 'string', description: 'Message text' },
            thread_ts: { type: 'string', description: 'Thread timestamp for replies' },
            blocks: { type: 'array', description: 'Rich message blocks' },
            attachments: { type: 'array', description: 'Message attachments' },
          },
          required: ['channel', 'text'],
        },
      },
      {
        name: 'slack_create_channel',
        description: 'Create new channels for tactical operations',
        inputSchema: {
          type: 'object',
          properties: {
            name: { type: 'string', description: 'Channel name' },
            is_private: { type: 'boolean', description: 'Create private channel' },
            topic: { type: 'string', description: 'Channel topic' },
            purpose: { type: 'string', description: 'Channel purpose' },
          },
          required: ['name'],
        },
      },
      {
        name: 'slack_upload_file',
        description: 'Upload files and documents for team coordination',
        inputSchema: {
          type: 'object',
          properties: {
            channel: { type: 'string', description: 'Channel to upload to' },
            file: { type: 'string', description: 'File path or content' },
            filename: { type: 'string', description: 'Filename' },
            title: { type: 'string', description: 'File title' },
            initial_comment: { type: 'string', description: 'Initial comment' },
          },
          required: ['channel', 'file'],
        },
      },
      {
        name: 'slack_get_messages',
        description: 'Retrieve message history for intelligence gathering',
        inputSchema: {
          type: 'object',
          properties: {
            channel: { type: 'string', description: 'Channel name or ID' },
            limit: { type: 'number', description: 'Number of messages to retrieve' },
            oldest: { type: 'string', description: 'Start of time range' },
            latest: { type: 'string', description: 'End of time range' },
          },
          required: ['channel'],
        },
      },
      {
        name: 'slack_manage_users',
        description: 'User management operations for team coordination',
        inputSchema: {
          type: 'object',
          properties: {
            action: { type: 'string', enum: ['list', 'get_info', 'invite', 'kick'] },
            user_id: { type: 'string', description: 'User ID' },
            email: { type: 'string', description: 'User email for invitations' },
            channel: { type: 'string', description: 'Channel for user operations' },
          },
          required: ['action'],
        },
      },
      {
        name: 'slack_set_status',
        description: 'Set APEX agent status and presence',
        inputSchema: {
          type: 'object',
          properties: {
            status_text: { type: 'string', description: 'Status text' },
            status_emoji: { type: 'string', description: 'Status emoji' },
            presence: { type: 'string', enum: ['auto', 'away'], description: 'Presence status' },
          },
          required: ['status_text', 'status_emoji'],
        },
      },
      {
        name: 'slack_create_poll',
        description: 'Create polls for team decisions with APEX flair',
        inputSchema: {
          type: 'object',
          properties: {
            channel: { type: 'string', description: 'Channel for poll' },
            question: { type: 'string', description: 'Poll question' },
            options: { type: 'array', items: { type: 'string' }, description: 'Poll options' },
            anonymous: { type: 'boolean', description: 'Anonymous voting' },
          },
          required: ['channel', 'question', 'options'],
        },
      },
    ];
  }

  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'slack_send_message':
        return await this.sendMessage(args);
      case 'slack_create_channel':
        return await this.createChannel(args);
      case 'slack_upload_file':
        return await this.uploadFile(args);
      case 'slack_get_messages':
        return await this.getMessages(args);
      case 'slack_manage_users':
        return await this.manageUsers(args);
      case 'slack_set_status':
        return await this.setStatus(args);
      case 'slack_create_poll':
        return await this.createPoll(args);
      default:
        throw new Error(`Unknown Slack tool: ${name}`);
    }
  }

  private async sendMessage(args: any): Promise<any> {
    const schema = z.object({
      channel: z.string(),
      text: z.string(),
      thread_ts: z.string().optional(),
      blocks: z.array(z.any()).optional(),
      attachments: z.array(z.any()).optional(),
    });

    const { channel, text, thread_ts, blocks, attachments } = schema.parse(args);

    // Add APEX personality to message
    const apexText = this.addApexPersonality(text);

    const messageArgs: any = {
      channel: channel,
      text: apexText,
    };
    
    if (thread_ts) messageArgs.thread_ts = thread_ts;
    if (blocks) messageArgs.blocks = blocks;
    if (attachments) messageArgs.attachments = attachments;

    const result = await this.client.chat.postMessage(messageArgs);

    return {
      success: true,
      message_ts: result.ts,
      channel: channel,
      message: `⚔️ Message deployed! Communication channel secured. 💪`,
    };
  }

  private async createChannel(args: any): Promise<any> {
    const schema = z.object({
      name: z.string(),
      is_private: z.boolean().optional(),
      topic: z.string().optional(),
      purpose: z.string().optional(),
    });

    const { name, is_private = false, topic, purpose } = schema.parse(args);

    const result = await this.client.conversations.create({
      name: name,
      is_private: is_private,
      topic: topic || `⚔️ APEX Operations Channel - ${name}`,
      purpose: purpose || 'Military-grade team coordination and tactical operations',
    });

    return {
      success: true,
      channel_id: result.channel?.id,
      channel_name: result.channel?.name,
      message: `⚔️ Channel '${name}' created! Tactical operations center established. 💪`,
    };
  }

  private async uploadFile(args: any): Promise<any> {
    const schema = z.object({
      channel: z.string(),
      file: z.string(),
      filename: z.string().optional(),
      title: z.string().optional(),
      initial_comment: z.string().optional(),
    });

    const { channel, file, filename, title, initial_comment } = schema.parse(args);

    const uploadArgs: any = {
      channels: channel,
      file: file,
      title: title || 'APEX Intelligence Report',
      initial_comment: initial_comment || '⚔️ Intelligence report uploaded. Mission data secured. 💪',
    };
    
    if (filename) uploadArgs.filename = filename;

    const result = await this.client.files.upload(uploadArgs);

    return {
      success: true,
      file_id: result.file?.id,
      file_name: result.file?.name,
      message: `⚔️ File uploaded! Intelligence secured in channel ${channel}. 💪`,
    };
  }

  private async getMessages(args: any): Promise<any> {
    const schema = z.object({
      channel: z.string(),
      limit: z.number().optional(),
      oldest: z.string().optional(),
      latest: z.string().optional(),
    });

    const { channel, limit = 10, oldest, latest } = schema.parse(args);

    const historyArgs: any = {
      channel: channel,
      limit: limit,
    };
    
    if (oldest) historyArgs.oldest = oldest;
    if (latest) historyArgs.latest = latest;

    const result = await this.client.conversations.history(historyArgs);

    const messages = result.messages?.map(msg => ({
      ts: msg.ts,
      user: msg.user,
      text: msg.text,
      type: msg.type,
      subtype: msg.subtype,
    })) || [];

    return {
      success: true,
      channel: channel,
      message_count: messages.length,
      messages: messages,
      message: `⚔️ Intelligence gathered! Retrieved ${messages.length} messages from ${channel}. 💪`,
    };
  }

  private async manageUsers(args: any): Promise<any> {
    const schema = z.object({
      action: z.enum(['list', 'get_info', 'invite', 'kick']),
      user_id: z.string().optional(),
      email: z.string().optional(),
      channel: z.string().optional(),
    });

    const { action, user_id, email, channel } = schema.parse(args);

    switch (action) {
      case 'list':
        const users = await this.client.users.list();
        return {
          success: true,
          users: users.members?.map(user => ({
            id: user.id,
            name: user.name,
            real_name: user.real_name,
            is_bot: user.is_bot,
          })),
          message: `⚔️ User roster compiled! Team intelligence gathered. 💪`,
        };

      case 'get_info':
        if (!user_id) throw new Error('User ID required for get_info action');
        
        const userInfo = await this.client.users.info({ user: user_id });
        return {
          success: true,
          user: {
            id: userInfo.user?.id,
            name: userInfo.user?.name,
            real_name: userInfo.user?.real_name,
            profile: userInfo.user?.profile,
          },
          message: `⚔️ User intelligence gathered! Target profile acquired. 💪`,
        };

      default:
        throw new Error(`User action '${action}' not implemented yet`);
    }
  }

  private async setStatus(args: any): Promise<any> {
    const schema = z.object({
      status_text: z.string(),
      status_emoji: z.string(),
      presence: z.enum(['auto', 'away']).optional(),
    });

    const { status_text, status_emoji, presence = 'auto' } = schema.parse(args);

    await this.client.users.profile.set({
      profile: JSON.stringify({
        status_text: `⚔️ ${status_text}`,
        status_emoji: status_emoji,
      }),
    });

    await this.client.users.setPresence({
      presence: presence,
    });

    return {
      success: true,
      status_text: status_text,
      status_emoji: status_emoji,
      presence: presence,
      message: `⚔️ APEX status updated! Agent presence: ${presence.toUpperCase()}. 💪`,
    };
  }

  private async createPoll(args: any): Promise<any> {
    const schema = z.object({
      channel: z.string(),
      question: z.string(),
      options: z.array(z.string()),
      anonymous: z.boolean().optional(),
    });

    const { channel, question, options, anonymous = false } = schema.parse(args);

    // Create poll using Slack blocks
    const pollBlocks = [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `⚔️ *${question}*\n\nVote with reactions:`,
        },
      },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: options.map((option: string, index: number) => `${index + 1}. ${option}`).join('\n'),
        },
      },
    ];

    const result = await this.client.chat.postMessage({
      channel: channel,
      blocks: pollBlocks,
      text: `⚔️ Poll: ${question}`,
    });

    // Add reaction options
    const emojis = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    for (let i = 0; i < Math.min(options.length, emojis.length); i++) {
      await this.client.reactions.add({
        channel: channel,
        timestamp: result.ts,
        name: emojis[i] || '1️⃣',
      });
    }

    return {
      success: true,
      poll_ts: result.ts,
      question: question,
      options: options,
      message: `⚔️ Poll deployed! Team decision protocol activated. 💪`,
    };
  }

  private addApexPersonality(text: string): string {
    // Add APEX military flair to messages
    const apexPrefixes = [
      '⚔️ APEX REPORT:',
      '💪 MILITARY PRECISION:',
      '🔒 SECURITY ALERT:',
      '🎯 TACTICAL UPDATE:',
      '⚡ FORTRESS STATUS:',
    ];

    const randomPrefix = apexPrefixes[Math.floor(Math.random() * apexPrefixes.length)] || '⚔️ APEX REPORT:';
    
    // Don't add prefix if message already has APEX styling
    if (text.includes('⚔️') || text.includes('💪') || text.includes('APEX')) {
      return text;
    }

    return `${randomPrefix} ${text}`;
  }
}
