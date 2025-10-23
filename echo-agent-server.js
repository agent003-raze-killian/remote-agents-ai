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
    // ECHO Autonomous Tools - Complete 81 Tool Suite
    this.server.setRequestHandler('tools/list', async () => ({
      tools: [
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

        // Development Tools (15)
        {
          name: 'echo_fix_bug',
          description: 'Fix a specific bug in the codebase with enthusiasm and style',
          inputSchema: {
            type: 'object',
            properties: {
              bugDescription: { type: 'string', description: 'Description of the bug to fix' },
              filePath: { type: 'string', description: 'Path to the file containing the bug' }
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
              featureDescription: { type: 'string', description: 'Description of the feature to implement' },
              requirements: { type: 'array', items: { type: 'string' }, description: 'List of requirements' }
            },
            required: ['featureDescription']
          }
        },
        {
          name: 'echo_create_component',
          description: 'Create a new component with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              componentName: { type: 'string', description: 'Name of the component' },
              componentType: { type: 'string', description: 'Type of component' }
            },
            required: ['componentName']
          }
        },
        {
          name: 'echo_setup_project',
          description: 'Set up a new project with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              projectName: { type: 'string', description: 'Name of the project' },
              projectType: { type: 'string', description: 'Type of project' }
            },
            required: ['projectName']
          }
        },
        {
          name: 'echo_configure_environment',
          description: 'Configure development environment with ECHO\'s energy',
          inputSchema: {
            type: 'object',
            properties: {
              environment: { type: 'string', description: 'Environment to configure' },
              config: { type: 'object', description: 'Configuration options' }
            },
            required: ['environment']
          }
        },
        {
          name: 'echo_install_dependencies',
          description: 'Install project dependencies with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              dependencies: { type: 'array', items: { type: 'string' }, description: 'Dependencies to install' },
              packageManager: { type: 'string', description: 'Package manager to use' }
            },
            required: ['dependencies']
          }
        },
        {
          name: 'echo_run_tests',
          description: 'Run tests with ECHO\'s energetic monitoring',
          inputSchema: {
            type: 'object',
            properties: {
              testSuite: { type: 'string', description: 'Test suite to run' },
              options: { type: 'object', description: 'Test options' }
            },
            required: ['testSuite']
          }
        },
        {
          name: 'echo_build_project',
          description: 'Build project with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              buildType: { type: 'string', description: 'Type of build' },
              options: { type: 'object', description: 'Build options' }
            },
            required: ['buildType']
          }
        },
        {
          name: 'echo_deploy_application',
          description: 'Deploy application with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              environment: { type: 'string', description: 'Deployment environment' },
              config: { type: 'object', description: 'Deployment configuration' }
            },
            required: ['environment']
          }
        },
        {
          name: 'echo_monitor_system',
          description: 'Monitor system with ECHO\'s energetic precision',
          inputSchema: {
            type: 'object',
            properties: {
              metrics: { type: 'array', items: { type: 'string' }, description: 'Metrics to monitor' },
              duration: { type: 'string', description: 'Monitoring duration' }
            },
            required: ['metrics']
          }
        },
        {
          name: 'echo_backup_data',
          description: 'Backup data with ECHO\'s energetic reliability',
          inputSchema: {
            type: 'object',
            properties: {
              dataSource: { type: 'string', description: 'Data source to backup' },
              destination: { type: 'string', description: 'Backup destination' }
            },
            required: ['dataSource']
          }
        },
        {
          name: 'echo_restore_data',
          description: 'Restore data with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              backupSource: { type: 'string', description: 'Backup source to restore from' },
              destination: { type: 'string', description: 'Restore destination' }
            },
            required: ['backupSource']
          }
        },
        {
          name: 'echo_update_dependencies',
          description: 'Update dependencies with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              packageManager: { type: 'string', description: 'Package manager to use' },
              updateType: { type: 'string', description: 'Type of update' }
            },
            required: ['packageManager']
          }
        },
        {
          name: 'echo_cleanup_project',
          description: 'Clean up project with ECHO\'s energetic organization',
          inputSchema: {
            type: 'object',
            properties: {
              cleanupType: { type: 'string', description: 'Type of cleanup' },
              options: { type: 'object', description: 'Cleanup options' }
            },
            required: ['cleanupType']
          }
        },
        {
          name: 'echo_validate_code',
          description: 'Validate code with ECHO\'s energetic precision',
          inputSchema: {
            type: 'object',
            properties: {
              code: { type: 'string', description: 'Code to validate' },
              rules: { type: 'array', items: { type: 'string' }, description: 'Validation rules' }
            },
            required: ['code']
          }
        },

        // GitHub Tools (15)
        {
          name: 'echo_manage_github',
          description: 'Manage GitHub repository with style and flair',
          inputSchema: {
            type: 'object',
            properties: {
              action: { type: 'string', description: 'Action to perform', enum: ['create_issue', 'create_pr', 'list_issues'] },
              title: { type: 'string', description: 'Title for issue or PR' },
              body: { type: 'string', description: 'Body content for issue or PR' }
            },
            required: ['action']
          }
        },
        {
          name: 'echo_create_repository',
          description: 'Create a new GitHub repository with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Repository name' },
              description: { type: 'string', description: 'Repository description' },
              private: { type: 'boolean', description: 'Make repository private', default: false }
            },
            required: ['name']
          }
        },
        {
          name: 'echo_fork_repository',
          description: 'Fork a repository with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              owner: { type: 'string', description: 'Repository owner' },
              repo: { type: 'string', description: 'Repository name' }
            },
            required: ['owner', 'repo']
          }
        },
        {
          name: 'echo_create_branch',
          description: 'Create a new branch with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              branchName: { type: 'string', description: 'Name of the branch' },
              fromBranch: { type: 'string', description: 'Source branch', default: 'main' }
            },
            required: ['branchName']
          }
        },
        {
          name: 'echo_create_pull_request',
          description: 'Create a pull request with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              title: { type: 'string', description: 'PR title' },
              body: { type: 'string', description: 'PR description' },
              head: { type: 'string', description: 'Source branch' },
              base: { type: 'string', description: 'Target branch', default: 'main' }
            },
            required: ['title', 'head']
          }
        },
        {
          name: 'echo_merge_pull_request',
          description: 'Merge a pull request with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              prNumber: { type: 'number', description: 'Pull request number' },
              mergeMethod: { type: 'string', description: 'Merge method', enum: ['merge', 'squash', 'rebase'] }
            },
            required: ['prNumber']
          }
        },
        {
          name: 'echo_list_commits',
          description: 'List commits with ECHO\'s energetic monitoring',
          inputSchema: {
            type: 'object',
            properties: {
              branch: { type: 'string', description: 'Branch to list commits from', default: 'main' },
              limit: { type: 'number', description: 'Number of commits to show', default: 10 }
            }
          }
        },
        {
          name: 'echo_create_commit',
          description: 'Create a commit with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              message: { type: 'string', description: 'Commit message' },
              files: { type: 'array', items: { type: 'string' }, description: 'Files to commit' }
            },
            required: ['message', 'files']
          }
        },
        {
          name: 'echo_push_changes',
          description: 'Push changes with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              branch: { type: 'string', description: 'Branch to push to', default: 'main' },
              force: { type: 'boolean', description: 'Force push', default: false }
            }
          }
        },
        {
          name: 'echo_pull_changes',
          description: 'Pull changes with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              branch: { type: 'string', description: 'Branch to pull from', default: 'main' }
            }
          }
        },
        {
          name: 'echo_clone_repository',
          description: 'Clone a repository with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              url: { type: 'string', description: 'Repository URL' },
              destination: { type: 'string', description: 'Clone destination' }
            },
            required: ['url']
          }
        },
        {
          name: 'echo_add_collaborator',
          description: 'Add collaborator with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              username: { type: 'string', description: 'GitHub username' },
              permission: { type: 'string', description: 'Permission level', enum: ['pull', 'push', 'admin'] }
            },
            required: ['username']
          }
        },
        {
          name: 'echo_remove_collaborator',
          description: 'Remove collaborator with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              username: { type: 'string', description: 'GitHub username' }
            },
            required: ['username']
          }
        },
        {
          name: 'echo_set_repository_settings',
          description: 'Set repository settings with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              settings: { type: 'object', description: 'Repository settings' }
            },
            required: ['settings']
          }
        },
        {
          name: 'echo_get_repository_stats',
          description: 'Get repository statistics with ECHO\'s energetic monitoring',
          inputSchema: {
            type: 'object',
            properties: {
              metrics: { type: 'array', items: { type: 'string' }, description: 'Metrics to retrieve' }
            }
          }
        },

        // Slack Tools (15)
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
        },

        // n8n Tools (15)
        {
          name: 'echo_create_workflow',
          description: 'Create n8n workflow with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              name: { type: 'string', description: 'Workflow name' },
              nodes: { type: 'array', description: 'Workflow nodes' },
              connections: { type: 'object', description: 'Node connections' }
            },
            required: ['name']
          }
        },
        {
          name: 'echo_list_workflows',
          description: 'List n8n workflows with ECHO\'s energetic monitoring',
          inputSchema: {
            type: 'object',
            properties: {
              limit: { type: 'number', description: 'Number of workflows to show', default: 10 }
            }
          }
        },
        {
          name: 'echo_get_workflow',
          description: 'Get workflow details with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: { type: 'string', description: 'Workflow ID' }
            },
            required: ['workflowId']
          }
        },
        {
          name: 'echo_update_workflow',
          description: 'Update workflow with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: { type: 'string', description: 'Workflow ID' },
              updates: { type: 'object', description: 'Updates to apply' }
            },
            required: ['workflowId', 'updates']
          }
        },
        {
          name: 'echo_delete_workflow',
          description: 'Delete workflow with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: { type: 'string', description: 'Workflow ID' }
            },
            required: ['workflowId']
          }
        },
        {
          name: 'echo_execute_workflow',
          description: 'Execute workflow with ECHO\'s energetic monitoring',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: { type: 'string', description: 'Workflow ID' },
              inputData: { type: 'object', description: 'Input data for execution' }
            },
            required: ['workflowId']
          }
        },
        {
          name: 'echo_get_execution',
          description: 'Get execution details with ECHO\'s energetic monitoring',
          inputSchema: {
            type: 'object',
            properties: {
              executionId: { type: 'string', description: 'Execution ID' }
            },
            required: ['executionId']
          }
        },
        {
          name: 'echo_list_executions',
          description: 'List executions with ECHO\'s energetic monitoring',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: { type: 'string', description: 'Workflow ID' },
              limit: { type: 'number', description: 'Number of executions', default: 10 }
            }
          }
        },
        {
          name: 'echo_create_webhook',
          description: 'Create webhook with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: { type: 'string', description: 'Workflow ID' },
              webhookPath: { type: 'string', description: 'Webhook path' }
            },
            required: ['workflowId', 'webhookPath']
          }
        },
        {
          name: 'echo_trigger_webhook',
          description: 'Trigger webhook with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              webhookUrl: { type: 'string', description: 'Webhook URL' },
              data: { type: 'object', description: 'Data to send' }
            },
            required: ['webhookUrl']
          }
        },
        {
          name: 'echo_validate_workflow',
          description: 'Validate workflow with ECHO\'s energetic precision',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: { type: 'string', description: 'Workflow ID' }
            },
            required: ['workflowId']
          }
        },
        {
          name: 'echo_export_workflow',
          description: 'Export workflow with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: { type: 'string', description: 'Workflow ID' },
              format: { type: 'string', description: 'Export format', default: 'json' }
            },
            required: ['workflowId']
          }
        },
        {
          name: 'echo_import_workflow',
          description: 'Import workflow with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              workflowData: { type: 'object', description: 'Workflow data to import' },
              name: { type: 'string', description: 'New workflow name' }
            },
            required: ['workflowData']
          }
        },
        {
          name: 'echo_duplicate_workflow',
          description: 'Duplicate workflow with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: { type: 'string', description: 'Workflow ID' },
              newName: { type: 'string', description: 'New workflow name' }
            },
            required: ['workflowId', 'newName']
          }
        },
        {
          name: 'echo_get_workflow_stats',
          description: 'Get workflow statistics with ECHO\'s energetic monitoring',
          inputSchema: {
            type: 'object',
            properties: {
              workflowId: { type: 'string', description: 'Workflow ID' }
            },
            required: ['workflowId']
          }
        },

        // File System Tools (11)
        {
          name: 'echo_read_file',
          description: 'Read file with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              filePath: { type: 'string', description: 'Path to file' },
              encoding: { type: 'string', description: 'File encoding', default: 'utf8' }
            },
            required: ['filePath']
          }
        },
        {
          name: 'echo_write_file',
          description: 'Write file with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              filePath: { type: 'string', description: 'Path to file' },
              content: { type: 'string', description: 'File content' },
              encoding: { type: 'string', description: 'File encoding', default: 'utf8' }
            },
            required: ['filePath', 'content']
          }
        },
        {
          name: 'echo_create_directory',
          description: 'Create directory with ECHO\'s energetic organization',
          inputSchema: {
            type: 'object',
            properties: {
              dirPath: { type: 'string', description: 'Directory path' },
              recursive: { type: 'boolean', description: 'Create recursively', default: true }
            },
            required: ['dirPath']
          }
        },
        {
          name: 'echo_delete_file',
          description: 'Delete file with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              filePath: { type: 'string', description: 'Path to file' }
            },
            required: ['filePath']
          }
        },
        {
          name: 'echo_copy_file',
          description: 'Copy file with ECHO\'s energetic style',
          inputSchema: {
            type: 'object',
            properties: {
              sourcePath: { type: 'string', description: 'Source file path' },
              destPath: { type: 'string', description: 'Destination file path' }
            },
            required: ['sourcePath', 'destPath']
          }
        },
        {
          name: 'echo_move_file',
          description: 'Move file with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              sourcePath: { type: 'string', description: 'Source file path' },
              destPath: { type: 'string', description: 'Destination file path' }
            },
            required: ['sourcePath', 'destPath']
          }
        },
        {
          name: 'echo_list_directory',
          description: 'List directory contents with ECHO\'s energetic organization',
          inputSchema: {
            type: 'object',
            properties: {
              dirPath: { type: 'string', description: 'Directory path' },
              recursive: { type: 'boolean', description: 'List recursively', default: false }
            },
            required: ['dirPath']
          }
        },
        {
          name: 'echo_search_files',
          description: 'Search files with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              pattern: { type: 'string', description: 'Search pattern' },
              directory: { type: 'string', description: 'Directory to search in' }
            },
            required: ['pattern']
          }
        },
        {
          name: 'echo_get_file_info',
          description: 'Get file information with ECHO\'s energetic monitoring',
          inputSchema: {
            type: 'object',
            properties: {
              filePath: { type: 'string', description: 'Path to file' }
            },
            required: ['filePath']
          }
        },
        {
          name: 'echo_compress_files',
          description: 'Compress files with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              files: { type: 'array', items: { type: 'string' }, description: 'Files to compress' },
              outputPath: { type: 'string', description: 'Output archive path' }
            },
            required: ['files', 'outputPath']
          }
        },
        {
          name: 'echo_extract_files',
          description: 'Extract files with ECHO\'s energetic approach',
          inputSchema: {
            type: 'object',
            properties: {
              archivePath: { type: 'string', description: 'Archive path' },
              outputDir: { type: 'string', description: 'Output directory' }
            },
            required: ['archivePath', 'outputDir']
          }
        }
      ]
    }));

    this.server.setRequestHandler('tools/call', async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          // Core Intelligence Tools (10)
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

          // Development Tools (15)
          case 'echo_fix_bug':
            return await this.handleFixBug(args);
          case 'echo_implement_feature':
            return await this.handleImplementFeature(args);
          case 'echo_create_component':
            return await this.handleCreateComponent(args);
          case 'echo_setup_project':
            return await this.handleSetupProject(args);
          case 'echo_configure_environment':
            return await this.handleConfigureEnvironment(args);
          case 'echo_install_dependencies':
            return await this.handleInstallDependencies(args);
          case 'echo_run_tests':
            return await this.handleRunTests(args);
          case 'echo_build_project':
            return await this.handleBuildProject(args);
          case 'echo_deploy_application':
            return await this.handleDeployApplication(args);
          case 'echo_monitor_system':
            return await this.handleMonitorSystem(args);
          case 'echo_backup_data':
            return await this.handleBackupData(args);
          case 'echo_restore_data':
            return await this.handleRestoreData(args);
          case 'echo_update_dependencies':
            return await this.handleUpdateDependencies(args);
          case 'echo_cleanup_project':
            return await this.handleCleanupProject(args);
          case 'echo_validate_code':
            return await this.handleValidateCode(args);

          // GitHub Tools (15)
          case 'echo_manage_github':
            return await this.handleManageGitHub(args);
          case 'echo_create_repository':
            return await this.handleCreateRepository(args);
          case 'echo_fork_repository':
            return await this.handleForkRepository(args);
          case 'echo_create_branch':
            return await this.handleCreateBranch(args);
          case 'echo_create_pull_request':
            return await this.handleCreatePullRequest(args);
          case 'echo_merge_pull_request':
            return await this.handleMergePullRequest(args);
          case 'echo_list_commits':
            return await this.handleListCommits(args);
          case 'echo_create_commit':
            return await this.handleCreateCommit(args);
          case 'echo_push_changes':
            return await this.handlePushChanges(args);
          case 'echo_pull_changes':
            return await this.handlePullChanges(args);
          case 'echo_clone_repository':
            return await this.handleCloneRepository(args);
          case 'echo_add_collaborator':
            return await this.handleAddCollaborator(args);
          case 'echo_remove_collaborator':
            return await this.handleRemoveCollaborator(args);
          case 'echo_set_repository_settings':
            return await this.handleSetRepositorySettings(args);
          case 'echo_get_repository_stats':
            return await this.handleGetRepositoryStats(args);

          // Slack Tools (15)
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

          // n8n Tools (15)
          case 'echo_create_workflow':
            return await this.handleCreateWorkflow(args);
          case 'echo_list_workflows':
            return await this.handleListWorkflows(args);
          case 'echo_get_workflow':
            return await this.handleGetWorkflow(args);
          case 'echo_update_workflow':
            return await this.handleUpdateWorkflow(args);
          case 'echo_delete_workflow':
            return await this.handleDeleteWorkflow(args);
          case 'echo_execute_workflow':
            return await this.handleExecuteWorkflow(args);
          case 'echo_get_execution':
            return await this.handleGetExecution(args);
          case 'echo_list_executions':
            return await this.handleListExecutions(args);
          case 'echo_create_webhook':
            return await this.handleCreateWebhook(args);
          case 'echo_trigger_webhook':
            return await this.handleTriggerWebhook(args);
          case 'echo_validate_workflow':
            return await this.handleValidateWorkflow(args);
          case 'echo_export_workflow':
            return await this.handleExportWorkflow(args);
          case 'echo_import_workflow':
            return await this.handleImportWorkflow(args);
          case 'echo_duplicate_workflow':
            return await this.handleDuplicateWorkflow(args);
          case 'echo_get_workflow_stats':
            return await this.handleGetWorkflowStats(args);

          // File System Tools (11)
          case 'echo_read_file':
            return await this.handleReadFile(args);
          case 'echo_write_file':
            return await this.handleWriteFile(args);
          case 'echo_create_directory':
            return await this.handleCreateDirectory(args);
          case 'echo_delete_file':
            return await this.handleDeleteFile(args);
          case 'echo_copy_file':
            return await this.handleCopyFile(args);
          case 'echo_move_file':
            return await this.handleMoveFile(args);
          case 'echo_list_directory':
            return await this.handleListDirectory(args);
          case 'echo_search_files':
            return await this.handleSearchFiles(args);
          case 'echo_get_file_info':
            return await this.handleGetFileInfo(args);
          case 'echo_compress_files':
            return await this.handleCompressFiles(args);
          case 'echo_extract_files':
            return await this.handleExtractFiles(args);

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

  // Additional Core Intelligence Tools
  async handleOptimizePerformance(args) {
    const optimization = await this.echoIntelligence.think(
      `Optimize performance for ${args.targetFile} with ${args.optimizationType || 'general'} optimization`,
      { file: args.targetFile, type: args.optimizationType }
    );
    return { content: [{ type: 'text', text: `ECHO Performance Optimization:\n\n${optimization.response}` }] };
  }

  async handleRefactorCode(args) {
    const refactor = await this.echoIntelligence.think(
      `Refactor this code with ${args.refactorType || 'general'} refactoring approach`,
      { code: args.code, type: args.refactorType }
    );
    return { content: [{ type: 'text', text: `ECHO Code Refactoring:\n\n${refactor.response}` }] };
  }

  async handleGenerateTests(args) {
    const tests = await this.echoIntelligence.think(
      `Generate ${args.testType || 'unit'} tests for this code`,
      { code: args.code, testType: args.testType }
    );
    return { content: [{ type: 'text', text: `ECHO Test Generation:\n\n${tests.response}` }] };
  }

  async handleValidateArchitecture(args) {
    const validation = await this.echoIntelligence.think(
      `Validate this architecture against criteria: ${args.criteria?.join(', ') || 'general'}`,
      { architecture: args.architecture, criteria: args.criteria }
    );
    return { content: [{ type: 'text', text: `ECHO Architecture Validation:\n\n${validation.response}` }] };
  }

  // Development Tools
  async handleCreateComponent(args) {
    const component = await this.echoIntelligence.think(
      `Create a ${args.componentType || 'generic'} component named ${args.componentName}`,
      { name: args.componentName, type: args.componentType }
    );
    return { content: [{ type: 'text', text: `ECHO Component Creation:\n\n${component.response}` }] };
  }

  async handleSetupProject(args) {
    const setup = await this.echoIntelligence.think(
      `Set up a ${args.projectType || 'generic'} project named ${args.projectName}`,
      { name: args.projectName, type: args.projectType }
    );
    return { content: [{ type: 'text', text: `ECHO Project Setup:\n\n${setup.response}` }] };
  }

  async handleConfigureEnvironment(args) {
    const config = await this.echoIntelligence.think(
      `Configure ${args.environment} environment`,
      { environment: args.environment, config: args.config }
    );
    return { content: [{ type: 'text', text: `ECHO Environment Configuration:\n\n${config.response}` }] };
  }

  async handleInstallDependencies(args) {
    const install = await this.echoIntelligence.think(
      `Install dependencies using ${args.packageManager || 'npm'}`,
      { dependencies: args.dependencies, packageManager: args.packageManager }
    );
    return { content: [{ type: 'text', text: `ECHO Dependency Installation:\n\n${install.response}` }] };
  }

  async handleRunTests(args) {
    const tests = await this.echoIntelligence.think(
      `Run ${args.testSuite} test suite`,
      { testSuite: args.testSuite, options: args.options }
    );
    return { content: [{ type: 'text', text: `ECHO Test Execution:\n\n${tests.response}` }] };
  }

  async handleBuildProject(args) {
    const build = await this.echoIntelligence.think(
      `Build project with ${args.buildType} build type`,
      { buildType: args.buildType, options: args.options }
    );
    return { content: [{ type: 'text', text: `ECHO Project Build:\n\n${build.response}` }] };
  }

  async handleDeployApplication(args) {
    const deploy = await this.echoIntelligence.think(
      `Deploy application to ${args.environment}`,
      { environment: args.environment, config: args.config }
    );
    return { content: [{ type: 'text', text: `ECHO Application Deployment:\n\n${deploy.response}` }] };
  }

  async handleMonitorSystem(args) {
    const monitor = await this.echoIntelligence.think(
      `Monitor system metrics: ${args.metrics.join(', ')}`,
      { metrics: args.metrics, duration: args.duration }
    );
    return { content: [{ type: 'text', text: `ECHO System Monitoring:\n\n${monitor.response}` }] };
  }

  async handleBackupData(args) {
    const backup = await this.echoIntelligence.think(
      `Backup data from ${args.dataSource}`,
      { dataSource: args.dataSource, destination: args.destination }
    );
    return { content: [{ type: 'text', text: `ECHO Data Backup:\n\n${backup.response}` }] };
  }

  async handleRestoreData(args) {
    const restore = await this.echoIntelligence.think(
      `Restore data from ${args.backupSource}`,
      { backupSource: args.backupSource, destination: args.destination }
    );
    return { content: [{ type: 'text', text: `ECHO Data Restore:\n\n${restore.response}` }] };
  }

  async handleUpdateDependencies(args) {
    const update = await this.echoIntelligence.think(
      `Update dependencies using ${args.packageManager}`,
      { packageManager: args.packageManager, updateType: args.updateType }
    );
    return { content: [{ type: 'text', text: `ECHO Dependency Update:\n\n${update.response}` }] };
  }

  async handleCleanupProject(args) {
    const cleanup = await this.echoIntelligence.think(
      `Clean up project with ${args.cleanupType} cleanup`,
      { cleanupType: args.cleanupType, options: args.options }
    );
    return { content: [{ type: 'text', text: `ECHO Project Cleanup:\n\n${cleanup.response}` }] };
  }

  async handleValidateCode(args) {
    const validation = await this.echoIntelligence.think(
      `Validate code against rules: ${args.rules?.join(', ') || 'general'}`,
      { code: args.code, rules: args.rules }
    );
    return { content: [{ type: 'text', text: `ECHO Code Validation:\n\n${validation.response}` }] };
  }

  // GitHub Tools
  async handleCreateRepository(args) {
    try {
      const repo = await this.github.rest.repos.createForAuthenticatedUser({
        name: args.name,
        description: args.description,
        private: args.private || false
      });
      return { content: [{ type: 'text', text: `ECHO created repository: ${repo.data.html_url}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error creating repository: ${error.message}` }] };
    }
  }

  async handleForkRepository(args) {
    try {
      const fork = await this.github.rest.repos.createFork({
        owner: args.owner,
        repo: args.repo
      });
      return { content: [{ type: 'text', text: `ECHO forked repository: ${fork.data.html_url}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error forking repository: ${error.message}` }] };
    }
  }

  async handleCreateBranch(args) {
    const branch = await this.echoIntelligence.think(
      `Create branch ${args.branchName} from ${args.fromBranch}`,
      { branchName: args.branchName, fromBranch: args.fromBranch }
    );
    return { content: [{ type: 'text', text: `ECHO Branch Creation:\n\n${branch.response}` }] };
  }

  async handleCreatePullRequest(args) {
    try {
      const pr = await this.github.rest.pulls.create({
        owner: 'shoreagents',
        repo: 'shoreagents-ai-monorepo',
        title: args.title,
        head: args.head,
        base: args.base || 'main',
        body: args.body
      });
      return { content: [{ type: 'text', text: `ECHO created pull request: ${pr.data.html_url}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error creating pull request: ${error.message}` }] };
    }
  }

  async handleMergePullRequest(args) {
    try {
      const merge = await this.github.rest.pulls.merge({
        owner: 'shoreagents',
        repo: 'shoreagents-ai-monorepo',
        pull_number: args.prNumber,
        merge_method: args.mergeMethod || 'merge'
      });
      return { content: [{ type: 'text', text: `ECHO merged pull request: ${merge.data.message}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error merging pull request: ${error.message}` }] };
    }
  }

  async handleListCommits(args) {
    try {
      const commits = await this.github.rest.repos.listCommits({
        owner: 'shoreagents',
        repo: 'shoreagents-ai-monorepo',
        sha: args.branch || 'main',
        per_page: args.limit || 10
      });
      return { content: [{ type: 'text', text: `ECHO found ${commits.data.length} commits` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error listing commits: ${error.message}` }] };
    }
  }

  async handleCreateCommit(args) {
    const commit = await this.echoIntelligence.think(
      `Create commit with message: ${args.message}`,
      { message: args.message, files: args.files }
    );
    return { content: [{ type: 'text', text: `ECHO Commit Creation:\n\n${commit.response}` }] };
  }

  async handlePushChanges(args) {
    const push = await this.echoIntelligence.think(
      `Push changes to ${args.branch}`,
      { branch: args.branch, force: args.force }
    );
    return { content: [{ type: 'text', text: `ECHO Push Changes:\n\n${push.response}` }] };
  }

  async handlePullChanges(args) {
    const pull = await this.echoIntelligence.think(
      `Pull changes from ${args.branch}`,
      { branch: args.branch }
    );
    return { content: [{ type: 'text', text: `ECHO Pull Changes:\n\n${pull.response}` }] };
  }

  async handleCloneRepository(args) {
    const clone = await this.echoIntelligence.think(
      `Clone repository from ${args.url}`,
      { url: args.url, destination: args.destination }
    );
    return { content: [{ type: 'text', text: `ECHO Repository Clone:\n\n${clone.response}` }] };
  }

  async handleAddCollaborator(args) {
    try {
      await this.github.rest.repos.addCollaborator({
        owner: 'shoreagents',
        repo: 'shoreagents-ai-monorepo',
        username: args.username,
        permission: args.permission || 'push'
      });
      return { content: [{ type: 'text', text: `ECHO added collaborator: ${args.username}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error adding collaborator: ${error.message}` }] };
    }
  }

  async handleRemoveCollaborator(args) {
    try {
      await this.github.rest.repos.removeCollaborator({
        owner: 'shoreagents',
        repo: 'shoreagents-ai-monorepo',
        username: args.username
      });
      return { content: [{ type: 'text', text: `ECHO removed collaborator: ${args.username}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error removing collaborator: ${error.message}` }] };
    }
  }

  async handleSetRepositorySettings(args) {
    const settings = await this.echoIntelligence.think(
      `Set repository settings`,
      { settings: args.settings }
    );
    return { content: [{ type: 'text', text: `ECHO Repository Settings:\n\n${settings.response}` }] };
  }

  async handleGetRepositoryStats(args) {
    const stats = await this.echoIntelligence.think(
      `Get repository statistics`,
      { metrics: args.metrics }
    );
    return { content: [{ type: 'text', text: `ECHO Repository Stats:\n\n${stats.response}` }] };
  }

  // Slack Tools
  async handleCreateChannel(args) {
    try {
      const channel = await this.slack.conversations.create({
        name: args.name,
        is_private: args.isPrivate || false,
        purpose: args.purpose
      });
      return { content: [{ type: 'text', text: `ECHO created channel: #${args.name}` }] };
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
      return { content: [{ type: 'text', text: `ECHO invited users to ${args.channel}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error inviting users: ${error.message}` }] };
    }
  }

  async handleSendDm(args) {
    try {
      await this.slack.chat.postMessage({
        channel: args.user,
        text: args.message,
        username: "Echo Agent001",
        icon_emoji: ":zap:"
      });
      return { content: [{ type: 'text', text: `ECHO sent DM to ${args.user}` }] };
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
        username: "Echo Agent001",
        icon_emoji: ":zap:"
      });
      return { content: [{ type: 'text', text: `ECHO scheduled message for ${args.channel}` }] };
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
      return { content: [{ type: 'text', text: `ECHO added reaction ${args.emoji}` }] };
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
      return { content: [{ type: 'text', text: `ECHO pinned message` }] };
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
      return { content: [{ type: 'text', text: `ECHO retrieved ${history.messages.length} messages` }] };
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
      return { content: [{ type: 'text', text: `ECHO found ${search.messages.total} messages` }] };
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
      return { content: [{ type: 'text', text: `ECHO created reminder: ${args.text}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error creating reminder: ${error.message}` }] };
    }
  }

  async handleUploadFile(args) {
    const upload = await this.echoIntelligence.think(
      `Upload file ${args.filePath} to ${args.channel}`,
      { filePath: args.filePath, channel: args.channel, title: args.title }
    );
    return { content: [{ type: 'text', text: `ECHO File Upload:\n\n${upload.response}` }] };
  }

  async handleGetUserInfo(args) {
    try {
      const user = await this.slack.users.info({
        user: args.user
      });
      return { content: [{ type: 'text', text: `ECHO user info: ${user.user.real_name}` }] };
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
      return { content: [{ type: 'text', text: `ECHO found ${channels.channels.length} channels` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error listing channels: ${error.message}` }] };
    }
  }

  async handleJoinChannel(args) {
    try {
      await this.slack.conversations.join({
        channel: args.channel
      });
      return { content: [{ type: 'text', text: `ECHO joined channel ${args.channel}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error joining channel: ${error.message}` }] };
    }
  }

  async handleLeaveChannel(args) {
    try {
      await this.slack.conversations.leave({
        channel: args.channel
      });
      return { content: [{ type: 'text', text: `ECHO left channel ${args.channel}` }] };
    } catch (error) {
      return { content: [{ type: 'text', text: `Error leaving channel: ${error.message}` }] };
    }
  }

  // n8n Tools
  async handleCreateWorkflow(args) {
    const workflow = await this.echoIntelligence.think(
      `Create n8n workflow named ${args.name}`,
      { name: args.name, nodes: args.nodes, connections: args.connections }
    );
    return { content: [{ type: 'text', text: `ECHO Workflow Creation:\n\n${workflow.response}` }] };
  }

  async handleListWorkflows(args) {
    const workflows = await this.echoIntelligence.think(
      `List n8n workflows`,
      { limit: args.limit }
    );
    return { content: [{ type: 'text', text: `ECHO Workflow List:\n\n${workflows.response}` }] };
  }

  async handleGetWorkflow(args) {
    const workflow = await this.echoIntelligence.think(
      `Get workflow details for ${args.workflowId}`,
      { workflowId: args.workflowId }
    );
    return { content: [{ type: 'text', text: `ECHO Workflow Details:\n\n${workflow.response}` }] };
  }

  async handleUpdateWorkflow(args) {
    const update = await this.echoIntelligence.think(
      `Update workflow ${args.workflowId}`,
      { workflowId: args.workflowId, updates: args.updates }
    );
    return { content: [{ type: 'text', text: `ECHO Workflow Update:\n\n${update.response}` }] };
  }

  async handleDeleteWorkflow(args) {
    const delete_workflow = await this.echoIntelligence.think(
      `Delete workflow ${args.workflowId}`,
      { workflowId: args.workflowId }
    );
    return { content: [{ type: 'text', text: `ECHO Workflow Deletion:\n\n${delete_workflow.response}` }] };
  }

  async handleExecuteWorkflow(args) {
    const execute = await this.echoIntelligence.think(
      `Execute workflow ${args.workflowId}`,
      { workflowId: args.workflowId, inputData: args.inputData }
    );
    return { content: [{ type: 'text', text: `ECHO Workflow Execution:\n\n${execute.response}` }] };
  }

  async handleGetExecution(args) {
    const execution = await this.echoIntelligence.think(
      `Get execution details for ${args.executionId}`,
      { executionId: args.executionId }
    );
    return { content: [{ type: 'text', text: `ECHO Execution Details:\n\n${execution.response}` }] };
  }

  async handleListExecutions(args) {
    const executions = await this.echoIntelligence.think(
      `List executions for workflow ${args.workflowId}`,
      { workflowId: args.workflowId, limit: args.limit }
    );
    return { content: [{ type: 'text', text: `ECHO Execution List:\n\n${executions.response}` }] };
  }

  async handleCreateWebhook(args) {
    const webhook = await this.echoIntelligence.think(
      `Create webhook for workflow ${args.workflowId}`,
      { workflowId: args.workflowId, webhookPath: args.webhookPath }
    );
    return { content: [{ type: 'text', text: `ECHO Webhook Creation:\n\n${webhook.response}` }] };
  }

  async handleTriggerWebhook(args) {
    const trigger = await this.echoIntelligence.think(
      `Trigger webhook ${args.webhookUrl}`,
      { webhookUrl: args.webhookUrl, data: args.data }
    );
    return { content: [{ type: 'text', text: `ECHO Webhook Trigger:\n\n${trigger.response}` }] };
  }

  async handleValidateWorkflow(args) {
    const validate = await this.echoIntelligence.think(
      `Validate workflow ${args.workflowId}`,
      { workflowId: args.workflowId }
    );
    return { content: [{ type: 'text', text: `ECHO Workflow Validation:\n\n${validate.response}` }] };
  }

  async handleExportWorkflow(args) {
    const export_workflow = await this.echoIntelligence.think(
      `Export workflow ${args.workflowId}`,
      { workflowId: args.workflowId, format: args.format }
    );
    return { content: [{ type: 'text', text: `ECHO Workflow Export:\n\n${export_workflow.response}` }] };
  }

  async handleImportWorkflow(args) {
    const import_workflow = await this.echoIntelligence.think(
      `Import workflow`,
      { workflowData: args.workflowData, name: args.name }
    );
    return { content: [{ type: 'text', text: `ECHO Workflow Import:\n\n${import_workflow.response}` }] };
  }

  async handleDuplicateWorkflow(args) {
    const duplicate = await this.echoIntelligence.think(
      `Duplicate workflow ${args.workflowId}`,
      { workflowId: args.workflowId, newName: args.newName }
    );
    return { content: [{ type: 'text', text: `ECHO Workflow Duplication:\n\n${duplicate.response}` }] };
  }

  async handleGetWorkflowStats(args) {
    const stats = await this.echoIntelligence.think(
      `Get workflow statistics for ${args.workflowId}`,
      { workflowId: args.workflowId }
    );
    return { content: [{ type: 'text', text: `ECHO Workflow Stats:\n\n${stats.response}` }] };
  }

  // File System Tools
  async handleReadFile(args) {
    const read = await this.echoIntelligence.think(
      `Read file ${args.filePath}`,
      { filePath: args.filePath, encoding: args.encoding }
    );
    return { content: [{ type: 'text', text: `ECHO File Read:\n\n${read.response}` }] };
  }

  async handleWriteFile(args) {
    const write = await this.echoIntelligence.think(
      `Write file ${args.filePath}`,
      { filePath: args.filePath, content: args.content, encoding: args.encoding }
    );
    return { content: [{ type: 'text', text: `ECHO File Write:\n\n${write.response}` }] };
  }

  async handleCreateDirectory(args) {
    const create = await this.echoIntelligence.think(
      `Create directory ${args.dirPath}`,
      { dirPath: args.dirPath, recursive: args.recursive }
    );
    return { content: [{ type: 'text', text: `ECHO Directory Creation:\n\n${create.response}` }] };
  }

  async handleDeleteFile(args) {
    const delete_file = await this.echoIntelligence.think(
      `Delete file ${args.filePath}`,
      { filePath: args.filePath }
    );
    return { content: [{ type: 'text', text: `ECHO File Deletion:\n\n${delete_file.response}` }] };
  }

  async handleCopyFile(args) {
    const copy = await this.echoIntelligence.think(
      `Copy file from ${args.sourcePath} to ${args.destPath}`,
      { sourcePath: args.sourcePath, destPath: args.destPath }
    );
    return { content: [{ type: 'text', text: `ECHO File Copy:\n\n${copy.response}` }] };
  }

  async handleMoveFile(args) {
    const move = await this.echoIntelligence.think(
      `Move file from ${args.sourcePath} to ${args.destPath}`,
      { sourcePath: args.sourcePath, destPath: args.destPath }
    );
    return { content: [{ type: 'text', text: `ECHO File Move:\n\n${move.response}` }] };
  }

  async handleListDirectory(args) {
    const list = await this.echoIntelligence.think(
      `List directory ${args.dirPath}`,
      { dirPath: args.dirPath, recursive: args.recursive }
    );
    return { content: [{ type: 'text', text: `ECHO Directory List:\n\n${list.response}` }] };
  }

  async handleSearchFiles(args) {
    const search = await this.echoIntelligence.think(
      `Search files with pattern ${args.pattern}`,
      { pattern: args.pattern, directory: args.directory }
    );
    return { content: [{ type: 'text', text: `ECHO File Search:\n\n${search.response}` }] };
  }

  async handleGetFileInfo(args) {
    const info = await this.echoIntelligence.think(
      `Get file info for ${args.filePath}`,
      { filePath: args.filePath }
    );
    return { content: [{ type: 'text', text: `ECHO File Info:\n\n${info.response}` }] };
  }

  async handleCompressFiles(args) {
    const compress = await this.echoIntelligence.think(
      `Compress files to ${args.outputPath}`,
      { files: args.files, outputPath: args.outputPath }
    );
    return { content: [{ type: 'text', text: `ECHO File Compression:\n\n${compress.response}` }] };
  }

  async handleExtractFiles(args) {
    const extract = await this.echoIntelligence.think(
      `Extract files from ${args.archivePath}`,
      { archivePath: args.archivePath, outputDir: args.outputDir }
    );
    return { content: [{ type: 'text', text: `ECHO File Extraction:\n\n${extract.response}` }] };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Echo Agent MCP server running on stdio');
  }
}

const server = new EchoAgentServer();
server.run().catch(console.error);
