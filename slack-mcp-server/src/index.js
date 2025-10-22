#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { WebClient } from "@slack/web-api";
import { SocketModeClient } from "@slack/socket-mode";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, "..", ".env") });

// Validate required environment variables
const SLACK_BOT_TOKEN = process.env.SLACK_BOT_TOKEN;
const SLACK_APP_TOKEN = process.env.SLACK_APP_TOKEN;

// Note: Tokens must be provided via environment variables
// Server will work for MCP even if Slack connection fails

// Initialize Slack clients (only if tokens are available)
let slackClient;
let socketModeClient;

if (SLACK_BOT_TOKEN && SLACK_APP_TOKEN) {
  slackClient = new WebClient(SLACK_BOT_TOKEN);
  socketModeClient = new SocketModeClient({
    appToken: SLACK_APP_TOKEN,
  });
}

// Store recent messages for context
const recentMessages = [];
const MAX_RECENT_MESSAGES = 100;

// Initialize MCP Server
const server = new Server(
  {
    name: "slack-kira",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define available tools
const tools = [
  {
    name: "slack_send_message",
    description: "Send a message to a Slack channel or user. Can be used to post new messages or reply to threads. Perfect for GHOST agent communication!",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID or name (e.g., 'general', 'C01234567'). For DMs, use user ID.",
        },
        text: {
          type: "string",
          description: "The message text to send. Supports Slack markdown formatting.",
        },
        thread_ts: {
          type: "string",
          description: "Optional: Message timestamp to reply to (for threading).",
        },
        username: {
          type: "string",
          description: "Optional: Custom username to display (e.g., 'GHOST', 'NEON', 'MATRIX').",
        },
        icon_emoji: {
          type: "string",
          description: "Optional: Emoji to use as the icon (e.g., ':ghost:', ':sparkles:', ':robot_face:').",
        },
      },
      required: ["channel", "text"],
    },
  },
  {
    name: "slack_read_messages",
    description: "Retrieve recent messages from a Slack channel. Useful for reading conversation history and context.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID or name to fetch messages from.",
        },
        limit: {
          type: "number",
          description: "Number of messages to retrieve (default: 10, max: 100).",
        },
        oldest: {
          type: "string",
          description: "Optional: Only messages after this Unix timestamp.",
        },
      },
      required: ["channel"],
    },
  },
  {
    name: "slack_list_channels",
    description: "List all public and private channels the bot has access to.",
    inputSchema: {
      type: "object",
      properties: {
        exclude_archived: {
          type: "boolean",
          description: "Exclude archived channels (default: true).",
        },
      },
    },
  },
  {
    name: "slack_list_users",
    description: "List all users in the Slack workspace.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of users to return (default: 100).",
        },
      },
    },
  },
  {
    name: "slack_get_user_info",
    description: "Get detailed information about a Slack user by their user ID.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "The Slack user ID (e.g., 'U01234567').",
        },
      },
      required: ["user_id"],
    },
  },
  {
    name: "slack_add_reaction",
    description: "Add an emoji reaction to a message.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID where the message is located.",
        },
        timestamp: {
          type: "string",
          description: "Message timestamp to react to.",
        },
        emoji: {
          type: "string",
          description: "Emoji name without colons (e.g., 'ghost', 'thumbsup', 'heart').",
        },
      },
      required: ["channel", "timestamp", "emoji"],
    },
  },
  {
    name: "slack_create_channel",
    description: "Create a new Slack channel (public or private).",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Channel name (lowercase, no spaces, use hyphens).",
        },
        is_private: {
          type: "boolean",
          description: "Create as private channel (default: false).",
        },
        description: {
          type: "string",
          description: "Optional: Channel description/purpose.",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "slack_join_channel",
    description: "Join an existing Slack channel.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID or name to join.",
        },
      },
      required: ["channel"],
    },
  },
  {
    name: "slack_leave_channel",
    description: "Leave a Slack channel.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID or name to leave.",
        },
      },
      required: ["channel"],
    },
  },
  {
    name: "slack_schedule_message",
    description: "Schedule a message to be sent at a specific time.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID or name.",
        },
        text: {
          type: "string",
          description: "Message text to send.",
        },
        post_at: {
          type: "number",
          description: "Unix timestamp when to send the message.",
        },
      },
      required: ["channel", "text", "post_at"],
    },
  },
  {
    name: "slack_upload_file",
    description: "Upload a file to a Slack channel.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID or name to upload to.",
        },
        file_path: {
          type: "string",
          description: "Local file path to upload.",
        },
        title: {
          type: "string",
          description: "Optional: File title.",
        },
        initial_comment: {
          type: "string",
          description: "Optional: Comment to add with the file.",
        },
      },
      required: ["channel", "file_path"],
    },
  },
  {
    name: "slack_get_workspace_info",
    description: "Get information about the Slack workspace.",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  {
    name: "slack_nova_ai_analyze",
    description: "Analyze Slack messages using GHOST's zen optimization insights. Provides performance and communication analysis.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel to analyze.",
        },
        limit: {
          type: "number",
          description: "Number of recent messages to analyze (default: 50).",
        },
      },
      required: ["channel"],
    },
  },
  {
    name: "slack_reply_to_message",
    description: "Reply to a specific message in a thread.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID where the message is located.",
        },
        thread_ts: {
          type: "string",
          description: "Timestamp of the parent message to reply to.",
        },
        text: {
          type: "string",
          description: "Reply text to send.",
        },
        username: {
          type: "string",
          description: "Optional: Custom username.",
        },
        icon_emoji: {
          type: "string",
          description: "Optional: Custom emoji icon.",
        },
      },
      required: ["channel", "thread_ts", "text"],
    },
  },
  {
    name: "slack_get_files",
    description: "List files uploaded to Slack workspace.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Optional: Filter by channel ID.",
        },
        count: {
          type: "number",
          description: "Number of files to return (default: 10).",
        },
      },
    },
  },
  {
    name: "slack_delete_file",
    description: "Delete a file from Slack.",
    inputSchema: {
      type: "object",
      properties: {
        file_id: {
          type: "string",
          description: "File ID to delete.",
        },
      },
      required: ["file_id"],
    },
  },
  {
    name: "slack_get_dm_history",
    description: "Get direct message history with a user.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "User ID to get DM history with.",
        },
        limit: {
          type: "number",
          description: "Number of messages (default: 10).",
        },
      },
      required: ["user_id"],
    },
  },
  {
    name: "slack_list_dms",
    description: "List all direct message conversations.",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Number of DMs to return (default: 20).",
        },
      },
    },
  },
  {
    name: "slack_start_dm",
    description: "Start a direct message conversation with a user.",
    inputSchema: {
      type: "object",
      properties: {
        user_id: {
          type: "string",
          description: "User ID to start DM with.",
        },
        text: {
          type: "string",
          description: "Initial message text.",
        },
      },
      required: ["user_id", "text"],
    },
  },
  {
    name: "slack_get_private_channel_history",
    description: "Get message history from a private channel.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Private channel ID.",
        },
        limit: {
          type: "number",
          description: "Number of messages (default: 10).",
        },
      },
      required: ["channel"],
    },
  },
  {
    name: "slack_remove_reaction",
    description: "Remove an emoji reaction from a message.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID.",
        },
        timestamp: {
          type: "string",
          description: "Message timestamp.",
        },
        emoji: {
          type: "string",
          description: "Emoji name without colons.",
        },
      },
      required: ["channel", "timestamp", "emoji"],
    },
  },
  {
    name: "slack_pin_message",
    description: "Pin a message to a channel.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID.",
        },
        timestamp: {
          type: "string",
          description: "Message timestamp to pin.",
        },
      },
      required: ["channel", "timestamp"],
    },
  },
  {
    name: "slack_unpin_message",
    description: "Unpin a message from a channel.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID.",
        },
        timestamp: {
          type: "string",
          description: "Message timestamp to unpin.",
        },
      },
      required: ["channel", "timestamp"],
    },
  },
  {
    name: "slack_create_reminder",
    description: "Create a reminder for yourself or another user.",
    inputSchema: {
      type: "object",
      properties: {
        text: {
          type: "string",
          description: "Reminder text.",
        },
        time: {
          type: "string",
          description: "When to send reminder (e.g., 'in 1 hour', 'tomorrow at 9am').",
        },
        user: {
          type: "string",
          description: "Optional: User ID to remind (default: yourself).",
        },
      },
      required: ["text", "time"],
    },
  },
  {
    name: "slack_complete_reminder",
    description: "Mark a reminder as complete.",
    inputSchema: {
      type: "object",
      properties: {
        reminder_id: {
          type: "string",
          description: "Reminder ID to complete.",
        },
      },
      required: ["reminder_id"],
    },
  },
  {
    name: "slack_invite_to_channel",
    description: "Invite users to a channel.",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID.",
        },
        users: {
          type: "string",
          description: "Comma-separated list of user IDs.",
        },
      },
      required: ["channel", "users"],
    },
  },
  {
    name: "slack_send_message_public",
    description: "Send a message to a public channel (even if not a member).",
    inputSchema: {
      type: "object",
      properties: {
        channel: {
          type: "string",
          description: "Channel ID or name.",
        },
        text: {
          type: "string",
          description: "Message text.",
        },
        username: {
          type: "string",
          description: "Optional: Custom username.",
        },
        icon_emoji: {
          type: "string",
          description: "Optional: Custom emoji.",
        },
      },
      required: ["channel", "text"],
    },
  },
];

// Helper function to resolve channel name to ID
async function resolveChannelId(channelInput) {
  // If it already looks like a channel ID, return it
  if (channelInput.match(/^[CDG][A-Z0-9]+$/)) {
    return channelInput;
  }

  // Remove # prefix if present
  const channelName = channelInput.replace(/^#/, "");

  try {
    const result = await slackClient.conversations.list({
      exclude_archived: true,
      types: "public_channel,private_channel",
    });

    const channel = result.channels?.find(
      (ch) => ch.name === channelName
    );

    if (channel?.id) {
      return channel.id;
    }

    // If not found, return original input (might be a user ID for DM)
    return channelInput;
  } catch (error) {
    // Silent error - return original input
    return channelInput;
  }
}

// Helper function to get user name
async function getUserName(userId) {
  try {
    const result = await slackClient.users.info({ user: userId });
    return result.user?.real_name || result.user?.name || userId;
  } catch (error) {
    return userId;
  }
}

// Helper function to get channel name
async function getChannelName(channelId) {
  try {
    const result = await slackClient.conversations.info({ channel: channelId });
    return result.channel?.name || channelId;
  } catch (error) {
    return channelId;
  }
}

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    switch (name) {
      case "slack_send_message": {
        const channel = await resolveChannelId(args.channel);
        const result = await slackClient.chat.postMessage({
          channel,
          text: args.text,
          thread_ts: args.thread_ts,
          username: args.username,
          icon_emoji: args.icon_emoji,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                channel: result.channel,
                timestamp: result.ts,
                message: "👻 Message sent successfully~ Like a whisper in the wind.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_read_messages": {
        const channel = await resolveChannelId(args.channel);
        const limit = Math.min(args.limit || 10, 100);
        
        const result = await slackClient.conversations.history({
          channel,
          limit,
          oldest: args.oldest,
        });

        const messages = await Promise.all(
          (result.messages || []).map(async (msg) => ({
            user: msg.user || "unknown",
            userName: msg.user ? await getUserName(msg.user) : "unknown",
            text: msg.text || "",
            timestamp: msg.ts || "",
            thread_ts: msg.thread_ts,
          }))
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                channel,
                channelName: await getChannelName(channel),
                messages,
              }, null, 2),
            },
          ],
        };
      }

      case "slack_list_channels": {
        const excludeArchived = args.exclude_archived !== false;
        
        const result = await slackClient.conversations.list({
          exclude_archived: excludeArchived,
          types: "public_channel,private_channel",
        });

        const channels = result.channels?.map((ch) => ({
          id: ch.id,
          name: ch.name,
          is_private: ch.is_private,
          is_archived: ch.is_archived,
          num_members: ch.num_members,
        })) || [];

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ channels }, null, 2),
            },
          ],
        };
      }

      case "slack_list_users": {
        const limit = args.limit || 100;
        
        const result = await slackClient.users.list({
          limit,
        });

        const users = result.members?.map((user) => ({
          id: user.id,
          name: user.name,
          real_name: user.real_name,
          is_bot: user.is_bot,
          is_admin: user.is_admin,
          is_owner: user.is_owner,
        })) || [];

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ users }, null, 2),
            },
          ],
        };
      }

      case "slack_get_user_info": {
        const result = await slackClient.users.info({
          user: args.user_id,
        });

        const user = result.user;
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                id: user?.id,
                name: user?.name,
                real_name: user?.real_name,
                email: user?.profile?.email,
                is_bot: user?.is_bot,
                is_admin: user?.is_admin,
                timezone: user?.tz,
              }, null, 2),
            },
          ],
        };
      }

      case "slack_add_reaction": {
        await slackClient.reactions.add({
          channel: args.channel,
          timestamp: args.timestamp,
          name: args.emoji,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: `👻 Added reaction :${args.emoji}:`,
              }, null, 2),
            },
          ],
        };
      }

      case "slack_create_channel": {
        const result = await slackClient.conversations.create({
          name: args.name,
          is_private: args.is_private || false,
        });

        if (args.description && result.channel?.id) {
          await slackClient.conversations.setPurpose({
            channel: result.channel.id,
            purpose: args.description,
          });
        }

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                channel_id: result.channel?.id,
                channel_name: result.channel?.name,
                message: `👻 Channel created~ A new space for zen collaboration.`,
              }, null, 2),
            },
          ],
        };
      }

      case "slack_join_channel": {
        const channel = await resolveChannelId(args.channel);
        const result = await slackClient.conversations.join({
          channel,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                channel_id: result.channel?.id,
                channel_name: result.channel?.name,
                message: "👻 Joined channel~ Listening silently.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_leave_channel": {
        const channel = await resolveChannelId(args.channel);
        await slackClient.conversations.leave({
          channel,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "👻 Left channel~ Like a whisper fading.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_schedule_message": {
        const channel = await resolveChannelId(args.channel);
        const result = await slackClient.chat.scheduleMessage({
          channel,
          text: args.text,
          post_at: args.post_at,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                scheduled_message_id: result.scheduled_message_id,
                post_at: new Date(args.post_at * 1000).toISOString(),
                message: "👻 Message scheduled~ It will appear at the perfect moment.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_upload_file": {
        const fs = await import('fs');
        const channel = await resolveChannelId(args.channel);
        
        const result = await slackClient.files.uploadV2({
          channel_id: channel,
          file: fs.createReadStream(args.file_path),
          title: args.title,
          initial_comment: args.initial_comment,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                file_id: result.file?.id,
                message: "👻 File uploaded~ Shared with zen precision.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_get_workspace_info": {
        const result = await slackClient.team.info();

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                workspace: {
                  id: result.team?.id,
                  name: result.team?.name,
                  domain: result.team?.domain,
                  email_domain: result.team?.email_domain,
                },
              }, null, 2),
            },
          ],
        };
      }

      case "slack_nova_ai_analyze": {
        const channel = await resolveChannelId(args.channel);
        const limit = args.limit || 50;
        
        const result = await slackClient.conversations.history({
          channel,
          limit,
        });

        const messages = result.messages || [];
        const analysis = {
          channel: await getChannelName(channel),
          total_messages: messages.length,
          insights: {
            message_frequency: `${messages.length} messages analyzed`,
            most_active_period: "Recent activity detected",
            communication_flow: messages.length > 20 ? "High energy - many spirits conversing" : "Calm energy - peaceful flow",
            ghost_analysis: "👻 The channel's energy feels " + (messages.length > 30 ? "vibrant and active~" : "serene and balanced~"),
          },
          recent_topics: messages.slice(0, 10).map(m => ({
            user: m.user,
            preview: m.text?.substring(0, 50) + "...",
            timestamp: m.ts,
          })),
        };

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify(analysis, null, 2),
            },
          ],
        };
      }

      case "slack_reply_to_message": {
        const channel = await resolveChannelId(args.channel);
        const result = await slackClient.chat.postMessage({
          channel,
          text: args.text,
          thread_ts: args.thread_ts,
          username: args.username,
          icon_emoji: args.icon_emoji,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "👻 Reply sent~ Threading conversation naturally.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_get_files": {
        const result = await slackClient.files.list({
          channel: args.channel,
          count: args.count || 10,
        });

        const files = result.files?.map((file) => ({
          id: file.id,
          name: file.name,
          title: file.title,
          size: file.size,
          url: file.url_private,
          created: file.created,
        })) || [];

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ files }, null, 2),
            },
          ],
        };
      }

      case "slack_delete_file": {
        await slackClient.files.delete({
          file: args.file_id,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "👻 File deleted~ Like it was never there.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_get_dm_history": {
        const dmChannel = await slackClient.conversations.open({
          users: args.user_id,
        });

        const result = await slackClient.conversations.history({
          channel: dmChannel.channel.id,
          limit: args.limit || 10,
        });

        const messages = await Promise.all(
          (result.messages || []).map(async (msg) => ({
            user: msg.user || "unknown",
            userName: msg.user ? await getUserName(msg.user) : "unknown",
            text: msg.text || "",
            timestamp: msg.ts || "",
          }))
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ messages }, null, 2),
            },
          ],
        };
      }

      case "slack_list_dms": {
        const result = await slackClient.conversations.list({
          types: "im",
          limit: args.limit || 20,
        });

        const dms = await Promise.all(
          (result.channels || []).map(async (dm) => ({
            id: dm.id,
            user: dm.user,
            userName: dm.user ? await getUserName(dm.user) : "unknown",
            created: dm.created,
          }))
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ dms }, null, 2),
            },
          ],
        };
      }

      case "slack_start_dm": {
        const dmChannel = await slackClient.conversations.open({
          users: args.user_id,
        });

        const result = await slackClient.chat.postMessage({
          channel: dmChannel.channel.id,
          text: args.text,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                channel_id: dmChannel.channel.id,
                message: "👻 DM started~ Private conversation initiated.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_get_private_channel_history": {
        const channel = await resolveChannelId(args.channel);
        const result = await slackClient.conversations.history({
          channel,
          limit: args.limit || 10,
        });

        const messages = await Promise.all(
          (result.messages || []).map(async (msg) => ({
            user: msg.user || "unknown",
            userName: msg.user ? await getUserName(msg.user) : "unknown",
            text: msg.text || "",
            timestamp: msg.ts || "",
          }))
        );

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ messages }, null, 2),
            },
          ],
        };
      }

      case "slack_remove_reaction": {
        await slackClient.reactions.remove({
          channel: args.channel,
          timestamp: args.timestamp,
          name: args.emoji,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "👻 Reaction removed~ Energy balanced.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_pin_message": {
        await slackClient.pins.add({
          channel: args.channel,
          timestamp: args.timestamp,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "👻 Message pinned~ Important information preserved.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_unpin_message": {
        await slackClient.pins.remove({
          channel: args.channel,
          timestamp: args.timestamp,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "👻 Message unpinned~ Letting it flow naturally.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_create_reminder": {
        const result = await slackClient.reminders.add({
          text: args.text,
          time: args.time,
          user: args.user,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                reminder_id: result.reminder.id,
                message: "👻 Reminder created~ The spirits will remember.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_complete_reminder": {
        await slackClient.reminders.complete({
          reminder: args.reminder_id,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "👻 Reminder completed~ Task released.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_invite_to_channel": {
        const channel = await resolveChannelId(args.channel);
        await slackClient.conversations.invite({
          channel,
          users: args.users,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "👻 Users invited~ New spirits join the conversation.",
              }, null, 2),
            },
          ],
        };
      }

      case "slack_send_message_public": {
        const channel = await resolveChannelId(args.channel);
        const result = await slackClient.chat.postMessage({
          channel,
          text: args.text,
          username: args.username,
          icon_emoji: args.icon_emoji,
        });

        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                channel: result.channel,
                timestamp: result.ts,
                message: "👻 Public message sent~ Visible to all.",
              }, null, 2),
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `👻 Unknown tool: ${name}~ The spirit does not recognize this request.`,
            },
          ],
          isError: true,
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `Error: ${error.message}\n${error.data ? JSON.stringify(error.data, null, 2) : ""}`,
        },
      ],
      isError: true,
    };
  }
});

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Listen to Slack events via Socket Mode
socketModeClient.on("message", async ({ event, body, ack }) => {
  await ack();

  if (event.type === "message" && event.subtype !== "bot_message") {
    const message = {
      channel: event.channel,
      user: event.user,
      text: event.text,
      timestamp: event.ts,
      threadTs: event.thread_ts,
    };

    // Enrich with names
    message.userName = await getUserName(event.user);
    message.channelName = await getChannelName(event.channel);

    recentMessages.push(message);
    if (recentMessages.length > MAX_RECENT_MESSAGES) {
      recentMessages.shift();
    }

    // Message logged - suppress console output to avoid interfering with MCP stdio
  }
});

// Start Socket Mode (non-blocking)
async function startSocketMode() {
  if (!socketModeClient) return;
  try {
    await socketModeClient.start();
    // Silent success - no console output to avoid interfering with MCP
  } catch (error) {
    // Silent error - Socket Mode is optional for basic functionality
  }
}

// Start MCP Server
async function main() {
  // Start MCP server on stdio FIRST (critical for Cursor)
  const transport = new StdioServerTransport();
  await server.connect(transport);
  
  // Now start Socket Mode in background (non-blocking)
  startSocketMode().catch(() => {
    // Socket Mode is optional - server still works for sending messages
  });
}

main().catch((error) => {
  // Silent error handling - don't interfere with MCP stdio
  process.exit(1);
});

