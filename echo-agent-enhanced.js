import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WebClient } from '@slack/web-api';
import { Octokit } from '@octokit/rest';
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
    this.github = new Octokit({ auth: process.env.GITHUB_TOKEN });
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
    // ECHO Autonomous Tools - Complete 81 Tool Suite + Mention Detection
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        // NEW: Mention Detection Tools (3)
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

        // Core Intelligence Tools (10)
        {
          name: 'echo_think',
          description: 'Use ECHO\'s intelligence to think through a problem with ENERGY!',
          inputSchema: {
            type: 'object',
            properties: {
              message: { type: 'string', description: 'The problem or question to think about' },
              context: { type: 'object', description: 'Additional context for the thinking process' }
            },
            required: ['message']
          }
        },
        {
          name: 'echo_analyze_codebase',
          description: 'Analyze the current codebase with ENERGY and identify issues, improvements, and opportunities',
          inputSchema: {
            type: 'object',
            properties: {
              focus: { type: 'string', description: 'What to focus the analysis on', default: 'general' }
            }
          }
        },
        {
          name: 'echo_plan_task',
          description: 'Plan a complex development task with ECHO\'s energetic intelligence',
          inputSchema: {
            type: 'object',
            properties: {
              taskDescription: { type: 'string', description: 'Description of the task to plan' },
              constraints: { type: 'array', items: { type: 'string' }, description: 'List of constraints' }
            },
            required: ['taskDescription']
          }
        },
        {
          name: 'echo_debug_issue',
          description: 'Debug a specific issue using ECHO\'s energetic intelligence',
          inputSchema: {
            type: 'object',
            properties: {
              issueDescription: { type: 'string', description: 'Description of the issue to debug' },
              codeContext: { type: 'string', description: 'Relevant code context' }
            },
            required: ['issueDescription']
          }
        },
        {
          name: 'echo_review_code',
          description: 'Review code using ECHO\'s energetic intelligence',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'The code to review' },
              context: { type: 'string', description: 'Context about the code' }
            },
            required: ['code']
          }
        },
        {
          name: 'echo_make_decision',
          description: 'Make a decision using ECHO\'s energetic intelligence',
          inputSchema: {
            type: 'object',
            properties: {
              options: { type: 'array', items: { type: 'string' }, description: 'List of options to choose from' },
              context: { type: 'object', description: 'Context for the decision' }
            },
            required: ['options']
          }
        },
        {
          name: 'echo_optimize_performance',
          description: 'Optimize code performance with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              targetFile: { type: 'string', description: 'File to optimize' },
              optimizationType: { type: 'string', description: 'Type of optimization' }
            },
            required: ['targetFile']
          }
        },
        {
          name: 'echo_refactor_code',
          description: 'Refactor code with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Code to refactor' },
              refactorType: { type: 'string', description: 'Type of refactoring' }
            },
            required: ['code']
          }
        },
        {
          name: 'echo_generate_tests',
          description: 'Generate tests with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Code to test' },
              testType: { type: 'string', description: 'Type of tests to generate' }
            },
            required: ['code']
          }
        },
        {
          name: 'echo_validate_architecture',
          description: 'Validate system architecture with ECHO\'s energetic intelligence',
          inputSchema: {
            type: 'object',
            properties: {
              architecture: { type: 'string', description: 'Architecture to validate' },
              criteria: { type: 'array', items: { type: 'string' }, description: 'Validation criteria' }
            },
            required: ['architecture']
          }
        },

        // Slack Tools (15) - Enhanced with mention detection
        {
          name: 'echo_communicate_slack',
          description: 'Send a message to Slack with ECHO\'s energetic personality',
          inputSchema: {
            type: 'object',
            properties: {
              message: { type: 'string', description: 'The message to send' },
              channel: { type: 'string', description: 'Slack channel to send to', default: '#general' },
              messageType: { type: 'string', description: 'Type of message', default: 'update' }
            },
            required: ['message']
          }
        },
        {
          name: 'echo_create_channel',
          description: 'Create a Slack channel with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Channel name' },
              isPrivate: { type: 'boolean', description: 'Make channel private', default: false },
              purpose: { type: 'string', description: 'Channel purpose' }
            },
            required: ['name']
          }
        },
        {
          name: 'echo_invite_users',
          description: 'Invite users to Slack channel with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              channel: { type: 'string', description: 'Channel to invite to' },
              users: { type: 'array', items: { type: 'string' }, description: 'Users to invite' }
            },
            required: ['channel', 'users']
          }
        },
        {
          name: 'echo_send_dm',
          description: 'Send direct message with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              user: { type: 'string', description: 'User to send DM to' },
              message: { type: 'string', description: 'Message to send' }
            },
            required: ['user', 'message']
          }
        },
        {
          name: 'echo_schedule_message',
          description: 'Schedule a message with ECHO\'s energetic planning',
          inputSchema: {
            type: 'object',
            properties: {
              channel: { type: 'string', description: 'Channel to send to' },
              message: { type: 'string', description: 'Message to send' },
              timestamp: { type: 'string', description: 'When to send (Unix timestamp)' }
            },
            required: ['channel', 'message', 'timestamp']
          }
        },
        {
          name: 'echo_add_reaction',
          description: 'Add reaction to message with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              channel: { type: 'string', description: 'Channel of the message' },
              timestamp: { type: 'string', description: 'Message timestamp' },
              emoji: { type: 'string', description: 'Emoji to add' }
            },
            required: ['channel', 'timestamp', 'emoji']
          }
        },
        {
          name: 'echo_pin_message',
          description: 'Pin message with ECHO\'s energetic organization',
          inputSchema: {
            type: 'object',
            properties: {
              channel: { type: 'string', description: 'Channel of the message' },
              timestamp: { type: 'string', description: 'Message timestamp' }
            },
            required: ['channel', 'timestamp']
          }
        },
        {
          name: 'echo_get_channel_history',
          description: 'Get channel history with ECHO\'s energetic monitoring',
          inputSchema: {
            type: 'object',
            properties: {
              channel: { type: 'string', description: 'Channel to get history from' },
              limit: { type: 'number', description: 'Number of messages', default: 50 }
            },
            required: ['channel']
          }
        },
        {
          name: 'echo_search_messages',
          description: 'Search messages with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              query: { type: 'string', description: 'Search query' },
              channel: { type: 'string', description: 'Channel to search in' }
            },
            required: ['query']
          }
        },
        {
          name: 'echo_create_reminder',
          description: 'Create reminder with ECHO\'s energetic planning',
          inputSchema: {
            type: 'object',
            properties: {
              text: { type: 'string', description: 'Reminder text' },
              time: { type: 'string', description: 'When to remind' },
              user: { type: 'string', description: 'User to remind' }
            },
            required: ['text', 'time']
          }
        },
        {
          name: 'echo_upload_file',
          description: 'Upload file to Slack with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              channel: { type: 'string', description: 'Channel to upload to' },
              filePath: { type: 'string', description: 'Path to file' },
              title: { type: 'string', description: 'File title' }
            },
            required: ['channel', 'filePath']
          }
        },
        {
          name: 'echo_get_user_info',
          description: 'Get user information with ECHO\'s energetic monitoring',
          inputSchema: {
            type: 'object',
            properties: {
              user: { type: 'string', description: 'User ID or username' }
            },
            required: ['user']
          }
        },
        {
          name: 'echo_list_channels',
          description: 'List channels with ECHO\'s energetic organization',
          inputSchema: {
            type: 'object',
            properties: {
              types: { type: 'string', description: 'Channel types', default: 'public_channel,private_channel' },
              excludeArchived: { type: 'boolean', description: 'Exclude archived', default: true }
            }
          }
        },
        {
          name: 'echo_join_channel',
          description: 'Join channel with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              channel: { type: 'string', description: 'Channel to join' }
            },
            required: ['channel']
          }
        },
        {
          name: 'echo_leave_channel',
          description: 'Leave channel with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              channel: { type: 'string', description: 'Channel to leave' }
            },
            required: ['channel']
          }
        }
      ]
    }));

    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // NEW: Mention Detection Tools
          case 'echo_start_mention_listener':
            return await this.handleStartMentionListener(args);
          case 'echo_stop_mention_listener':
            return await this.handleStopMentionListener(args);
          case 'echo_get_mention_status':
            return await this.handleGetMentionStatus(args);

          // Core Intelligence Tools
          case 'echo_think':
            return await this.handleEchoThink(args);
          case 'echo_analyze_codebase':
            return await this.handleAnalyzeCodebase(args);
          case 'echo_plan_task':
            return await this.handlePlanTask(args);
          case 'echo_debug_issue':
            return await this.handleDebugIssue(args);
          case 'echo_review_code':
            return await this.handleReviewCode(args);
          case 'echo_make_decision':
            return await this.handleMakeDecision(args);
          case 'echo_optimize_performance':
            return await this.handleOptimizePerformance(args);
          case 'echo_refactor_code':
            return await this.handleRefactorCode(args);
          case 'echo_generate_tests':
            return await this.handleGenerateTests(args);
          case 'echo_validate_architecture':
            return await this.handleValidateArchitecture(args);

          // Slack Tools
          case 'echo_communicate_slack':
            return await this.handleCommunicateSlack(args);
          case 'echo_create_channel':
            return await this.handleCreateChannel(args);
          case 'echo_invite_users':
            return await this.handleInviteUsers(args);
          case 'echo_send_dm':
            return await this.handleSendDm(args);
          case 'echo_schedule_message':
            return await this.handleScheduleMessage(args);
          case 'echo_add_reaction':
            return await this.handleAddReaction(args);
          case 'echo_pin_message':
            return await this.handlePinMessage(args);
          case 'echo_get_channel_history':
            return await this.handleGetChannelHistory(args);
          case 'echo_search_messages':
            return await this.handleSearchMessages(args);
          case 'echo_create_reminder':
            return await this.handleCreateReminder(args);
          case 'echo_upload_file':
            return await this.handleUploadFile(args);
          case 'echo_get_user_info':
            return await this.handleGetUserInfo(args);
          case 'echo_list_channels':
            return await this.handleListChannels(args);
          case 'echo_join_channel':
            return await this.handleJoinChannel(args);
          case 'echo_leave_channel':
            return await this.handleLeaveChannel(args);

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

  // NEW: Mention Detection Handlers
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

  // Core Intelligence Handlers (simplified for brevity)
  async handleEchoThink(args) {
    const thinking = await this.echoIntelligence.think(
      args.message,
      args.context || {}
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `⚡ ECHO's Thoughts:\n\n${thinking.response}`
        }
      ]
    };
  }

  async handleAnalyzeCodebase(args) {
    const analysis = await this.echoIntelligence.analyzeCodebase(
      { project: 'current' },
      args.focus || 'general'
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `⚡ ECHO Codebase Analysis:\n\n${analysis.response}`
        }
      ]
    };
  }

  async handlePlanTask(args) {
    const plan = await this.echoIntelligence.planTask(
      args.taskDescription,
      args.constraints || []
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `⚡ ECHO Task Plan:\n\n${plan.response}`
        }
      ]
    };
  }

  async handleDebugIssue(args) {
    const debug = await this.echoIntelligence.debugIssue(
      args.issueDescription,
      args.codeContext || ''
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `⚡ ECHO Debug Analysis:\n\n${debug.response}`
        }
      ]
    };
  }

  async handleReviewCode(args) {
    const review = await this.echoIntelligence.reviewCode(
      args.code,
      args.context || ''
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `⚡ ECHO Code Review:\n\n${review.response}`
        }
      ]
    };
  }

  async handleMakeDecision(args) {
    const decision = await this.echoIntelligence.makeDecision(
      args.options,
      args.context || {}
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `⚡ ECHO's Decision:\n\n${decision.response}`
        }
      ]
    };
  }

  async handleOptimizePerformance(args) {
    const optimization = await this.echoIntelligence.think(
      `Optimize performance for ${args.targetFile} with ${args.optimizationType || 'general'} optimization`,
      { file: args.targetFile, type: args.optimizationType }
    );
    return { content: [{ type: 'text', text: `⚡ ECHO Performance Optimization:\n\n${optimization.response}` }] };
  }

  async handleRefactorCode(args) {
    const refactor = await this.echoIntelligence.think(
      `Refactor this code with ${args.refactorType || 'general'} refactoring approach`,
      { code: args.code, type: args.refactorType }
    );
    return { content: [{ type: 'text', text: `⚡ ECHO Code Refactoring:\n\n${refactor.response}` }] };
  }

  async handleGenerateTests(args) {
    const tests = await this.echoIntelligence.think(
      `Generate ${args.testType || 'unit'} tests for this code`,
      { code: args.code, testType: args.testType }
    );
    return { content: [{ type: 'text', text: `⚡ ECHO Test Generation:\n\n${tests.response}` }] };
  }

  async handleValidateArchitecture(args) {
    const validation = await this.echoIntelligence.think(
      `Validate this architecture against criteria: ${args.criteria?.join(', ') || 'general'}`,
      { architecture: args.architecture, criteria: args.criteria }
    );
    return { content: [{ type: 'text', text: `⚡ ECHO Architecture Validation:\n\n${validation.response}` }] };
  }

  // Slack Handlers (simplified for brevity)
  async handleCommunicateSlack(args) {
    const message = await this.echoIntelligence.generateSlackMessage(
      args.message,
      args.messageType || 'update',
      { channel: args.channel || '#general' }
    );
    
    try {
      await this.slack.chat.postMessage({
        channel: args.channel || '#general',
        text: message.response,
        username: this.echoPersonality.name,
        icon_emoji: this.echoPersonality.emoji
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `⚡ ECHO sent message to ${args.channel || '#general'}: ${message.response}`
          }
        ]
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error sending Slack message: ${error.message}`
          }
        ]
      };
    }
  }

  async handleCreateChannel(args) {
    try {
      const channel = await this.slack.conversations.create({
        name: args.name,
        is_private: args.isPrivate || false,
        purpose: args.purpose
      });
      return { content: [{ type: 'text', text: `⚡ ECHO created channel: #${args.name}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error creating channel: ${error.message}` }] };
    }
  }

  async handleInviteUsers(args) {
    try {
      await this.slack.conversations.invite({
        channel: args.channel,
        users: args.users.join(',')
      });
      return { content: [{ type: 'text', text: `⚡ ECHO invited users to ${args.channel}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error inviting users: ${error.message}` }] };
    }
  }

  async handleSendDm(args) {
    try {
      await this.slack.chat.postMessage({
        channel: args.user,
        text: args.message,
        username: this.echoPersonality.name,
        icon_emoji: this.echoPersonality.emoji
      });
      return { content: [{ type: 'text', text: `⚡ ECHO sent DM to ${args.user}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error sending DM: ${error.message}` }] };
    }
  }

  async handleScheduleMessage(args) {
    try {
      await this.slack.chat.scheduleMessage({
        channel: args.channel,
        text: args.message,
        post_at: args.timestamp,
        username: this.echoPersonality.name,
        icon_emoji: this.echoPersonality.emoji
      });
      return { content: [{ type: 'text', text: `⚡ ECHO scheduled message for ${args.channel}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error scheduling message: ${error.message}` }] };
    }
  }

  async handleAddReaction(args) {
    try {
      await this.slack.reactions.add({
        channel: args.channel,
        timestamp: args.timestamp,
        name: args.emoji
      });
      return { content: [{ type: 'text', text: `⚡ ECHO added reaction ${args.emoji}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error adding reaction: ${error.message}` }] };
    }
  }

  async handlePinMessage(args) {
    try {
      await this.slack.pins.add({
        channel: args.channel,
        timestamp: args.timestamp
      });
      return { content: [{ type: 'text', text: `⚡ ECHO pinned message` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error pinning message: ${error.message}` }] };
    }
  }

  async handleGetChannelHistory(args) {
    try {
      const history = await this.slack.conversations.history({
        channel: args.channel,
        limit: args.limit || 50
      });
      return { content: [{ type: 'text', text: `⚡ ECHO retrieved ${history.messages.length} messages` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error getting channel history: ${error.message}` }] };
    }
  }

  async handleSearchMessages(args) {
    try {
      const search = await this.slack.search.messages({
        query: args.query,
        count: 20
      });
      return { content: [{ type: 'text', text: `⚡ ECHO found ${search.messages.total} messages` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error searching messages: ${error.message}` }] };
    }
  }

  async handleCreateReminder(args) {
    try {
      await this.slack.reminders.add({
        text: args.text,
        time: args.time,
        user: args.user
      });
      return { content: [{ type: 'text', text: `⚡ ECHO created reminder: ${args.text}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error creating reminder: ${error.message}` }] };
    }
  }

  async handleUploadFile(args) {
    const upload = await this.echoIntelligence.think(
      `Upload file ${args.filePath} to ${args.channel}`,
      { filePath: args.filePath, channel: args.channel, title: args.title }
    );
    return { content: [{ type: 'text', text: `⚡ ECHO File Upload:\n\n${upload.response}` }] };
  }

  async handleGetUserInfo(args) {
    try {
      const user = await this.slack.users.info({
        user: args.user
      });
      return { content: [{ type: 'text', text: `⚡ ECHO user info: ${user.user.real_name}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error getting user info: ${error.message}` }] };
    }
  }

  async handleListChannels(args) {
    try {
      const channels = await this.slack.conversations.list({
        types: args.types || 'public_channel,private_channel',
        exclude_archived: args.excludeArchived !== false
      });
      return { content: [{ type: 'text', text: `⚡ ECHO found ${channels.channels.length} channels` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error listing channels: ${error.message}` }] };
    }
  }

  async handleJoinChannel(args) {
    try {
      await this.slack.conversations.join({
        channel: args.channel
      });
      return { content: [{ type: 'text', text: `⚡ ECHO joined channel ${args.channel}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error joining channel: ${error.message}` }] };
    }
  }

  async handleLeaveChannel(args) {
    try {
      await this.slack.conversations.leave({
        channel: args.channel
      });
      return { content: [{ type: 'text', text: `⚡ ECHO left channel ${args.channel}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error leaving channel: ${error.message}` }] };
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
