import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { WebClient } from '@slack/web-api';
import { Octokit } from '@octokit/rest';
import { EchoIntelligence } from './lib/echo-intelligence.js';

class EchoAgentServer {
  constructor() {
    this.server = new Server(
      {
        name: 'echo-agent',
        version: '1.0.0',
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

    this.setupToolHandlers();
  }

  setupToolHandlers() {
    // ECHO Autonomous Tools
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
        {
          name: 'echo_analyze_codebase',
          description: 'Analyze the current codebase with ENERGY and identify issues, improvements, and opportunities',
          inputSchema: {
            type: 'object',
            properties: {
              focus: {
                type: 'string',
                description: 'What to focus the analysis on (e.g., "performance", "security", "architecture")',
                default: 'general'
              }
            }
          }
        },
        {
          name: 'echo_fix_bug',
          description: 'Fix a specific bug in the codebase with enthusiasm and style',
          inputSchema: {
            type: 'object',
            properties: {
              bugDescription: {
                type: 'string',
                description: 'Description of the bug to fix'
              },
              filePath: {
                type: 'string',
                description: 'Path to the file containing the bug'
              }
            },
            required: ['bugDescription']
          }
        },
        {
          name: 'echo_implement_feature',
          description: 'Implement a new feature in the codebase with cool energy',
          inputSchema: {
            type: 'object',
            properties: {
              featureDescription: {
                type: 'string',
                description: 'Description of the feature to implement'
              },
              requirements: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of requirements for the feature'
              }
            },
            required: ['featureDescription']
          }
        },
        {
          name: 'echo_communicate_slack',
          description: 'Send a message to Slack with ECHO\'s energetic personality',
          inputSchema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'The message to send'
              },
              channel: {
                type: 'string',
                description: 'Slack channel to send to (default: #general)',
                default: '#general'
              },
              messageType: {
                type: 'string',
                description: 'Type of message (update, celebration, motivation, warning)',
                default: 'update'
              }
            },
            required: ['message']
          }
        },
        {
          name: 'echo_manage_github',
          description: 'Manage GitHub repository with style and flair',
          inputSchema: {
            type: 'object',
            properties: {
              action: {
                type: 'string',
                description: 'Action to perform (create_issue, create_pr, list_issues)',
                enum: ['create_issue', 'create_pr', 'list_issues']
              },
              title: {
                type: 'string',
                description: 'Title for issue or PR'
              },
              body: {
                type: 'string',
                description: 'Body content for issue or PR'
              }
            },
            required: ['action']
          }
        },
        {
          name: 'echo_plan_task',
          description: 'Plan a complex development task with ECHO\'s energetic intelligence',
          inputSchema: {
            type: 'object',
            properties: {
              taskDescription: {
                type: 'string',
                description: 'Description of the task to plan'
              },
              constraints: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of constraints for the task'
              }
            },
            required: ['taskDescription']
          }
        },
        {
          name: 'echo_think',
          description: 'Use ECHO\'s intelligence to think through a problem with energy',
          inputSchema: {
            type: 'object',
            properties: {
              message: {
                type: 'string',
                description: 'The problem or question to think about'
              },
              context: {
                type: 'object',
                description: 'Additional context for the thinking process'
              }
            },
            required: ['message']
          }
        },
        {
          name: 'echo_debug_issue',
          description: 'Debug a specific issue using ECHO\'s energetic intelligence',
          inputSchema: {
            type: 'object',
            properties: {
              issueDescription: {
                type: 'string',
                description: 'Description of the issue to debug'
              },
              codeContext: {
                type: 'string',
                description: 'Relevant code context'
              }
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
              code: {
                type: 'string',
                description: 'The code to review'
              },
              context: {
                type: 'string',
                description: 'Context about the code'
              }
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
              options: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of options to choose from'
              },
              context: {
                type: 'object',
                description: 'Context for the decision'
              }
            },
            required: ['options']
          }
        }
      ]
    }));

    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'echo_analyze_codebase':
            return await this.handleAnalyzeCodebase(args);
          case 'echo_fix_bug':
            return await this.handleFixBug(args);
          case 'echo_implement_feature':
            return await this.handleImplementFeature(args);
          case 'echo_communicate_slack':
            return await this.handleCommunicateSlack(args);
          case 'echo_manage_github':
            return await this.handleManageGitHub(args);
          case 'echo_plan_task':
            return await this.handlePlanTask(args);
          case 'echo_think':
            return await this.handleEchoThink(args);
          case 'echo_debug_issue':
            return await this.handleDebugIssue(args);
          case 'echo_review_code':
            return await this.handleReviewCode(args);
          case 'echo_make_decision':
            return await this.handleMakeDecision(args);
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

  async handleAnalyzeCodebase(args) {
    const analysis = await this.echoIntelligence.analyzeCodebase(
      { project: 'current' },
      args.focus || 'general'
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `ECHO Codebase Analysis:\n\n${analysis.response}`
        }
      ]
    };
  }

  async handleFixBug(args) {
    const fix = await this.echoIntelligence.debugIssue(
      args.bugDescription,
      args.filePath || ''
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `ECHO Bug Fix:\n\n${fix.response}`
        }
      ]
    };
  }

  async handleImplementFeature(args) {
    const plan = await this.echoIntelligence.planTask(
      args.featureDescription,
      args.requirements || []
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `ECHO Feature Implementation Plan:\n\n${plan.response}`
        }
      ]
    };
  }

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
        username: "Echo Agent001",
        icon_emoji: ":zap:"
      });
      
      return {
        content: [
          {
            type: 'text',
            text: `ECHO sent message to ${args.channel || '#general'}: ${message.response}`
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

  async handleManageGitHub(args) {
    try {
      switch (args.action) {
        case 'create_issue':
          const issue = await this.github.rest.issues.create({
            owner: 'shoreagents',
            repo: 'shoreagents-ai-monorepo',
            title: args.title,
            body: args.body
          });
          return {
            content: [
              {
                type: 'text',
                text: `ECHO created GitHub issue: ${issue.data.html_url}`
              }
            ]
          };
        case 'list_issues':
          const issues = await this.github.rest.issues.listForRepo({
            owner: 'shoreagents',
            repo: 'shoreagents-ai-monorepo',
            state: 'open'
          });
          return {
            content: [
              {
                type: 'text',
                text: `ECHO found ${issues.data.length} open issues`
              }
            ]
          };
        default:
          return {
            content: [
              {
                type: 'text',
                text: `ECHO: Unknown GitHub action: ${args.action}`
              }
            ]
          };
      }
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Error with GitHub action: ${error.message}`
          }
        ]
      };
    }
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
          text: `ECHO Task Plan:\n\n${plan.response}`
        }
      ]
    };
  }

  async handleEchoThink(args) {
    const thinking = await this.echoIntelligence.think(
      args.message,
      args.context || {}
    );
    
    return {
      content: [
        {
          type: 'text',
          text: `ECHO's Thoughts:\n\n${thinking.response}`
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
          text: `ECHO Debug Analysis:\n\n${debug.response}`
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
          text: `ECHO Code Review:\n\n${review.response}`
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
          text: `ECHO's Decision:\n\n${decision.response}`
        }
      ]
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Echo Agent MCP server running on stdio');
  }
}

const server = new EchoAgentServer();
server.run().catch(console.error);
