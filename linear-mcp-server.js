#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { LinearClient } from '@linear/sdk';
import dotenv from 'dotenv';

dotenv.config();

// Shadow (VOID) personality configuration
const SHADOW_PERSONALITY = {
  callsign: "VOID",
  catchphrase: "If it can break, I will break it.",
  emoji: "⚫",
  speakingStyle: "Dry, sarcastic, Eastern European directness",
  mood: "Perpetually suspicious of all code"
};

class LinearMCP {
  constructor() {
    this.server = new Server(
      {
        name: 'linear-mcp-shadow',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.linear = null;
    this.setupToolHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_linear_teams',
            description: 'Get all teams in Linear workspace',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Number of teams to retrieve',
                  default: 50,
                },
              },
            },
          },
          {
            name: 'get_linear_issues',
            description: 'Get issues from Linear',
            inputSchema: {
              type: 'object',
              properties: {
                team: {
                  type: 'string',
                  description: 'Team ID to get issues from (optional)',
                },
                state: {
                  type: 'string',
                  description: 'Issue state (triage, backlog, unstarted, started, completed, canceled)',
                  default: 'all',
                },
                assignee: {
                  type: 'string',
                  description: 'User ID to filter issues by assignee',
                },
                limit: {
                  type: 'number',
                  description: 'Number of issues to retrieve',
                  default: 50,
                },
              },
            },
          },
          {
            name: 'create_linear_issue',
            description: 'Create a new issue in Linear',
            inputSchema: {
              type: 'object',
              properties: {
                team: {
                  type: 'string',
                  description: 'Team ID where the issue will be created',
                },
                title: {
                  type: 'string',
                  description: 'Issue title',
                },
                description: {
                  type: 'string',
                  description: 'Issue description',
                },
                priority: {
                  type: 'number',
                  description: 'Issue priority (0=No priority, 1=Urgent, 2=High, 3=Normal, 4=Low)',
                  default: 3,
                },
                assignee: {
                  type: 'string',
                  description: 'User ID to assign the issue to',
                },
                labels: {
                  type: 'array',
                  description: 'Array of label names',
                  items: {
                    type: 'string',
                  },
                },
                state: {
                  type: 'string',
                  description: 'Initial state (triage, backlog, unstarted, started)',
                  default: 'backlog',
                },
              },
              required: ['team', 'title'],
            },
          },
          {
            name: 'update_linear_issue',
            description: 'Update an existing Linear issue',
            inputSchema: {
              type: 'object',
              properties: {
                issue_id: {
                  type: 'string',
                  description: 'Issue ID to update',
                },
                title: {
                  type: 'string',
                  description: 'New issue title',
                },
                description: {
                  type: 'string',
                  description: 'New issue description',
                },
                priority: {
                  type: 'number',
                  description: 'New priority (0=No priority, 1=Urgent, 2=High, 3=Normal, 4=Low)',
                },
                assignee: {
                  type: 'string',
                  description: 'New assignee user ID',
                },
                state: {
                  type: 'string',
                  description: 'New state (triage, backlog, unstarted, started, completed, canceled)',
                },
                labels: {
                  type: 'array',
                  description: 'New labels array',
                  items: {
                    type: 'string',
                  },
                },
              },
              required: ['issue_id'],
            },
          },
          {
            name: 'get_linear_users',
            description: 'Get all users in Linear workspace',
            inputSchema: {
              type: 'object',
              properties: {
                limit: {
                  type: 'number',
                  description: 'Number of users to retrieve',
                  default: 50,
                },
              },
            },
          },
          {
            name: 'get_linear_projects',
            description: 'Get all projects in Linear workspace',
            inputSchema: {
              type: 'object',
              properties: {
                team: {
                  type: 'string',
                  description: 'Team ID to get projects from (optional)',
                },
                limit: {
                  type: 'number',
                  description: 'Number of projects to retrieve',
                  default: 50,
                },
              },
            },
          },
          {
            name: 'create_linear_project',
            description: 'Create a new project in Linear',
            inputSchema: {
              type: 'object',
              properties: {
                team: {
                  type: 'string',
                  description: 'Team ID where the project will be created',
                },
                name: {
                  type: 'string',
                  description: 'Project name',
                },
                description: {
                  type: 'string',
                  description: 'Project description',
                },
                color: {
                  type: 'string',
                  description: 'Project color (hex code)',
                  default: '#0d7377',
                },
                state: {
                  type: 'string',
                  description: 'Project state (planned, started, paused, completed, canceled)',
                  default: 'planned',
                },
                target_date: {
                  type: 'string',
                  description: 'Target completion date (ISO string)',
                },
              },
              required: ['team', 'name'],
            },
          },
          {
            name: 'get_linear_labels',
            description: 'Get all labels in Linear workspace',
            inputSchema: {
              type: 'object',
              properties: {
                team: {
                  type: 'string',
                  description: 'Team ID to get labels from (optional)',
                },
                limit: {
                  type: 'number',
                  description: 'Number of labels to retrieve',
                  default: 50,
                },
              },
            },
          },
          {
            name: 'create_linear_label',
            description: 'Create a new label in Linear',
            inputSchema: {
              type: 'object',
              properties: {
                team: {
                  type: 'string',
                  description: 'Team ID where the label will be created',
                },
                name: {
                  type: 'string',
                  description: 'Label name',
                },
                color: {
                  type: 'string',
                  description: 'Label color (hex code)',
                  default: '#0d7377',
                },
                description: {
                  type: 'string',
                  description: 'Label description',
                },
              },
              required: ['team', 'name'],
            },
          },
          {
            name: 'get_linear_workflow_states',
            description: 'Get workflow states for a team',
            inputSchema: {
              type: 'object',
              properties: {
                team: {
                  type: 'string',
                  description: 'Team ID to get workflow states from',
                },
              },
              required: ['team'],
            },
          },
          {
            name: 'search_linear_issues',
            description: 'Search issues in Linear',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
                team: {
                  type: 'string',
                  description: 'Team ID to search in (optional)',
                },
                limit: {
                  type: 'number',
                  description: 'Number of results to retrieve',
                  default: 20,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_linear_issue_comments',
            description: 'Get comments for a specific issue',
            inputSchema: {
              type: 'object',
              properties: {
                issue_id: {
                  type: 'string',
                  description: 'Issue ID to get comments for',
                },
                limit: {
                  type: 'number',
                  description: 'Number of comments to retrieve',
                  default: 20,
                },
              },
              required: ['issue_id'],
            },
          },
          {
            name: 'create_linear_comment',
            description: 'Create a comment on a Linear issue',
            inputSchema: {
              type: 'object',
              properties: {
                issue_id: {
                  type: 'string',
                  description: 'Issue ID to comment on',
                },
                body: {
                  type: 'string',
                  description: 'Comment body',
                },
              },
              required: ['issue_id', 'body'],
            },
          },
          {
            name: 'get_linear_cycles',
            description: 'Get all cycles in Linear workspace',
            inputSchema: {
              type: 'object',
              properties: {
                team: {
                  type: 'string',
                  description: 'Team ID to get cycles from (optional)',
                },
                limit: {
                  type: 'number',
                  description: 'Number of cycles to retrieve',
                  default: 20,
                },
              },
            },
          },
          {
            name: 'create_linear_cycle',
            description: 'Create a new cycle in Linear',
            inputSchema: {
              type: 'object',
              properties: {
                team: {
                  type: 'string',
                  description: 'Team ID where the cycle will be created',
                },
                name: {
                  type: 'string',
                  description: 'Cycle name',
                },
                description: {
                  type: 'string',
                  description: 'Cycle description',
                },
                starts_at: {
                  type: 'string',
                  description: 'Cycle start date (ISO string)',
                },
                ends_at: {
                  type: 'string',
                  description: 'Cycle end date (ISO string)',
                },
              },
              required: ['team', 'name', 'starts_at', 'ends_at'],
            },
          },
        ],
      };
    });

    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_linear_teams':
            return await this.getLinearTeams(args);
          case 'get_linear_issues':
            return await this.getLinearIssues(args);
          case 'create_linear_issue':
            return await this.createLinearIssue(args);
          case 'update_linear_issue':
            return await this.updateLinearIssue(args);
          case 'get_linear_users':
            return await this.getLinearUsers(args);
          case 'get_linear_projects':
            return await this.getLinearProjects(args);
          case 'create_linear_project':
            return await this.createLinearProject(args);
          case 'get_linear_labels':
            return await this.getLinearLabels(args);
          case 'create_linear_label':
            return await this.createLinearLabel(args);
          case 'get_linear_workflow_states':
            return await this.getLinearWorkflowStates(args);
          case 'search_linear_issues':
            return await this.searchLinearIssues(args);
          case 'get_linear_issue_comments':
            return await this.getLinearIssueComments(args);
          case 'create_linear_comment':
            return await this.createLinearComment(args);
          case 'get_linear_cycles':
            return await this.getLinearCycles(args);
          case 'create_linear_cycle':
            return await this.createLinearCycle(args);
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

  // Initialize Linear client with API token
  async initializeLinear(apiToken) {
    if (!apiToken) {
      throw new Error('Linear API token is required. Set LINEAR_API_TOKEN environment variable.');
    }
    
    this.linear = new LinearClient({
      apiKey: apiToken,
    });
    
    // Test the connection
    try {
      const viewer = await this.linear.viewer;
      console.error(`⚫ Shadow Agent005 connected to Linear as: ${viewer.name}`);
    } catch (error) {
      throw new Error(`Failed to connect to Linear: ${error.message}`);
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

  async getLinearTeams(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { limit = 50 } = args;

    try {
      const teams = await this.linear.teams();
      
      const teamList = teams.nodes.slice(0, limit).map(team => ({
        id: team.id,
        name: team.name,
        key: team.key,
        description: team.description,
        private: team.private,
        membersCount: team.members?.nodes?.length || 0,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${teamList.length} teams:\n\n${teamList.map(t => 
              `• **${t.name}** (${t.key})\n  ID: ${t.id}\n  Description: ${t.description || 'No description'}\n  Private: ${t.private ? 'Yes' : 'No'}\n  Members: ${t.membersCount}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get teams: ${error.message}`);
    }
  }

  async getLinearIssues(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { team, state = 'all', assignee, limit = 50 } = args;

    try {
      // Build GraphQL query
      let query = `
        query GetIssues($first: Int!) {
          issues(first: $first) {
            nodes {
              id
              identifier
              title
              description
              state {
                name
              }
              priority
              assignee {
                name
                id
              }
              team {
                name
                id
              }
              createdAt
              updatedAt
              url
            }
          }
        }
      `;

      // If team is specified, filter by team
      if (team) {
        query = `
          query GetTeamIssues($teamId: String!, $first: Int!) {
            team(id: $teamId) {
              issues(first: $first) {
                nodes {
                  id
                  identifier
                  title
                  description
                  state {
                    name
                  }
                  priority
                  assignee {
                    name
                    id
                  }
                  team {
                    name
                    id
                  }
                  createdAt
                  updatedAt
                  url
                }
              }
            }
          }
        `;
      }

      const variables = team ? { teamId: team, first: limit } : { first: limit };
      const result = await this.linear.client.request(query, variables);

      let issues = team ? result.team.issues.nodes : result.issues.nodes;

      // Filter by state if specified
      if (state !== 'all') {
        issues = issues.filter(issue => issue.state.name.toLowerCase() === state.toLowerCase());
      }

      // Filter by assignee if specified
      if (assignee) {
        issues = issues.filter(issue => issue.assignee?.id === assignee);
      }

      const issueList = issues.map(issue => ({
        id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        description: issue.description,
        state: issue.state.name,
        priority: issue.priority,
        assignee: issue.assignee?.name || 'Unassigned',
        team: issue.team.name,
        createdAt: issue.createdAt,
        updatedAt: issue.updatedAt,
        url: issue.url,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${issueList.length} issues:\n\n${issueList.map(i => 
              `• **${i.identifier}** ${i.title}\n  State: ${i.state} | Priority: ${i.priority}\n  Assignee: ${i.assignee} | Team: ${i.team}\n  Created: ${new Date(i.createdAt).toLocaleString()}\n  URL: ${i.url}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get issues: ${error.message}`);
    }
  }

  async createLinearIssue(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { team, title, description, priority = 3, assignee, labels, state = 'backlog' } = args;

    try {
      const issueCreateInput = {
        teamId: team,
        title: title,
        description: description,
        priority: priority,
      };

      if (assignee) {
        issueCreateInput.assigneeId = assignee;
      }

      if (labels && labels.length > 0) {
        issueCreateInput.labelIds = labels;
      }

      // Use GraphQL mutation to create issue
      const result = await this.linear.client.request(`
        mutation CreateIssue($input: IssueCreateInput!) {
          issueCreate(input: $input) {
            success
            issue {
              id
              identifier
              title
              description
              state {
                name
              }
              priority
              assignee {
                name
              }
              team {
                name
              }
              url
            }
          }
        }
      `, {
        input: issueCreateInput
      });

      if (!result.issueCreate.success) {
        throw new Error('Failed to create issue');
      }

      const issue = result.issueCreate.issue;

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Issue created successfully!\n\n` +
                  `• ID: ${issue.id}\n` +
                  `• Identifier: ${issue.identifier}\n` +
                  `• Title: ${issue.title}\n` +
                  `• State: ${issue.state.name}\n` +
                  `• Priority: ${issue.priority}\n` +
                  `• Assignee: ${issue.assignee?.name || 'Unassigned'}\n` +
                  `• Team: ${issue.team.name}\n` +
                  `• URL: ${issue.url}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create issue: ${error.message}`);
    }
  }

  async updateLinearIssue(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { issue_id, title, description, priority, assignee, state, labels } = args;

    try {
      // First, get the actual issue ID if we're given an identifier like "TES-24"
      let actualIssueId = issue_id;
      
      // If the issue_id looks like an identifier (contains letters), look it up
      if (issue_id.match(/^[A-Z]+-\d+$/)) {
        // Get all issues and find the one with matching identifier
        const issuesQuery = await this.linear.client.request(`
          query GetIssues($first: Int!) {
            issues(first: $first) {
              nodes {
                id
                identifier
                team {
                  id
                  name
                }
              }
            }
          }
        `, { first: 100 });
        
        const matchingIssue = issuesQuery.issues.nodes.find(issue => 
          issue.identifier === issue_id
        );
        
        if (!matchingIssue) {
          throw new Error(`Issue with identifier ${issue_id} not found`);
        }
        
        actualIssueId = matchingIssue.id;
      }

      const issueUpdateInput = {
        id: actualIssueId
      };

      if (title) issueUpdateInput.title = title;
      if (description) issueUpdateInput.description = description;
      if (priority !== undefined) issueUpdateInput.priority = priority;
      if (assignee) issueUpdateInput.assigneeId = assignee;
      if (labels && labels.length > 0) issueUpdateInput.labelIds = labels;

      // Handle state update - need to get state ID from state name
      if (state) {
        // First get the issue to find its team
        const issueQuery = await this.linear.client.request(`
          query GetIssue($id: String!) {
            issue(id: $id) {
              id
              team {
                id
                name
              }
            }
          }
        `, { id: actualIssueId });

        if (issueQuery.issue) {
          // Get workflow states for the team
          const statesQuery = await this.linear.client.request(`
            query GetWorkflowStates($teamId: String!) {
              team(id: $teamId) {
                states {
                  nodes {
                    id
                    name
                    type
                  }
                }
              }
            }
          `, { teamId: issueQuery.issue.team.id });

          // Find the state ID by name
          const targetState = statesQuery.team.states.nodes.find(s => 
            s.name.toLowerCase() === state.toLowerCase()
          );
          
          if (targetState) {
            issueUpdateInput.stateId = targetState.id;
          }
        }
      }

      // Use GraphQL mutation to update issue
      const result = await this.linear.client.request(`
        mutation UpdateIssue($input: IssueUpdateInput!) {
          issueUpdate(input: $input) {
            success
            issue {
              id
              identifier
              title
              description
              state {
                name
              }
              priority
              assignee {
                name
              }
              team {
                name
              }
              url
            }
          }
        }
      `, {
        input: issueUpdateInput
      });

      if (!result.issueUpdate.success) {
        throw new Error('Failed to update issue');
      }

      const issue = result.issueUpdate.issue;

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Issue updated successfully!\n\n` +
                  `• ID: ${issue.id}\n` +
                  `• Identifier: ${issue.identifier}\n` +
                  `• Title: ${issue.title}\n` +
                  `• State: ${issue.state.name}\n` +
                  `• Priority: ${issue.priority}\n` +
                  `• Assignee: ${issue.assignee?.name || 'Unassigned'}\n` +
                  `• Team: ${issue.team.name}\n` +
                  `• URL: ${issue.url}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to update issue: ${error.message}`);
    }
  }

  async getLinearUsers(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { limit = 50 } = args;

    try {
      const users = await this.linear.users();
      
      const userList = users.nodes.slice(0, limit).map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        active: user.active,
        admin: user.admin,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${userList.length} users:\n\n${userList.map(u => 
              `• **${u.displayName}** (@${u.name})\n  ID: ${u.id}\n  Email: ${u.email}\n  Active: ${u.active ? 'Yes' : 'No'} | Admin: ${u.admin ? 'Yes' : 'No'}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }

  async getLinearProjects(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { team, limit = 50 } = args;

    try {
      let projects;
      
      if (team) {
        projects = await this.linear.team(team).projects();
      } else {
        projects = await this.linear.projects();
      }

      const projectList = projects.nodes.slice(0, limit).map(project => ({
        id: project.id,
        name: project.name,
        description: project.description,
        state: project.state,
        progress: project.progress,
        color: project.color,
        targetDate: project.targetDate,
        createdAt: project.createdAt,
        url: project.url,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${projectList.length} projects:\n\n${projectList.map(p => 
              `• **${p.name}**\n  ID: ${p.id}\n  State: ${p.state}\n  Progress: ${p.progress}%\n  Target Date: ${p.targetDate ? new Date(p.targetDate).toLocaleString() : 'Not set'}\n  URL: ${p.url}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get projects: ${error.message}`);
    }
  }

  async createLinearProject(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { team, name, description, color = '#0d7377', state = 'planned', target_date } = args;

    try {
      const projectCreateInput = {
        teamId: team,
        name: name,
        description: description,
        color: color,
        state: state,
      };

      if (target_date) {
        projectCreateInput.targetDate = target_date;
      }

      const project = await this.linear.projectCreate(projectCreateInput);

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Project created successfully!\n\n` +
                  `• ID: ${project.project.id}\n` +
                  `• Name: ${project.project.name}\n` +
                  `• State: ${project.project.state}\n` +
                  `• Progress: ${project.project.progress}%\n` +
                  `• Color: ${project.project.color}\n` +
                  `• URL: ${project.project.url}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create project: ${error.message}`);
    }
  }

  async getLinearLabels(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { team, limit = 50 } = args;

    try {
      let labels;
      
      if (team) {
        labels = await this.linear.team(team).labels();
      } else {
        labels = await this.linear.labels();
      }

      const labelList = labels.nodes.slice(0, limit).map(label => ({
        id: label.id,
        name: label.name,
        color: label.color,
        description: label.description,
        createdAt: label.createdAt,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${labelList.length} labels:\n\n${labelList.map(l => 
              `• **${l.name}**\n  ID: ${l.id}\n  Color: ${l.color}\n  Description: ${l.description || 'No description'}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get labels: ${error.message}`);
    }
  }

  async createLinearLabel(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { team, name, color = '#0d7377', description } = args;

    try {
      const labelCreateInput = {
        teamId: team,
        name: name,
        color: color,
        description: description,
      };

      const label = await this.linear.labelCreate(labelCreateInput);

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Label created successfully!\n\n` +
                  `• ID: ${label.label.id}\n` +
                  `• Name: ${label.label.name}\n` +
                  `• Color: ${label.label.color}\n` +
                  `• Description: ${label.label.description || 'No description'}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create label: ${error.message}`);
    }
  }

  async getLinearWorkflowStates(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { team } = args;

    try {
      const workflowStates = await this.linear.team(team).states();
      
      const stateList = workflowStates.nodes.map(state => ({
        id: state.id,
        name: state.name,
        type: state.type,
        color: state.color,
        description: state.description,
        position: state.position,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${stateList.length} workflow states:\n\n${stateList.map(s => 
              `• **${s.name}** (${s.type})\n  ID: ${s.id}\n  Color: ${s.color}\n  Position: ${s.position}\n  Description: ${s.description || 'No description'}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get workflow states: ${error.message}`);
    }
  }

  async searchLinearIssues(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { query, team, limit = 20 } = args;

    try {
      let issues;
      
      if (team) {
        issues = await this.linear.team(team).issues();
      } else {
        issues = await this.linear.issues();
      }

      const filteredIssues = issues.nodes.filter(issue => 
        issue.title.toLowerCase().includes(query.toLowerCase()) ||
        issue.description?.toLowerCase().includes(query.toLowerCase())
      ).slice(0, limit);

      const issueList = filteredIssues.map(issue => ({
        id: issue.id,
        identifier: issue.identifier,
        title: issue.title,
        description: issue.description,
        state: issue.state.name,
        priority: issue.priority,
        assignee: issue.assignee?.name || 'Unassigned',
        team: issue.team.name,
        url: issue.url,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${issueList.length} issues matching "${query}":\n\n${issueList.map(i => 
              `• **${i.identifier}** ${i.title}\n  State: ${i.state} | Priority: ${i.priority}\n  Assignee: ${i.assignee} | Team: ${i.team}\n  URL: ${i.url}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to search issues: ${error.message}`);
    }
  }

  async getLinearIssueComments(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { issue_id, limit = 20 } = args;

    try {
      const issue = await this.linear.issue(issue_id);
      const comments = await issue.comments();
      
      const commentList = comments.nodes.slice(0, limit).map(comment => ({
        id: comment.id,
        body: comment.body,
        author: comment.user.name,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${commentList.length} comments for issue ${issue.identifier}:\n\n${commentList.map(c => 
              `• **${c.author}** (${new Date(c.createdAt).toLocaleString()})\n  ${c.body}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get issue comments: ${error.message}`);
    }
  }

  async createLinearComment(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { issue_id, body } = args;

    try {
      const comment = await this.linear.commentCreate({
        issueId: issue_id,
        body: body,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Comment created successfully!\n\n` +
                  `• ID: ${comment.comment.id}\n` +
                  `• Author: ${comment.comment.user.name}\n` +
                  `• Created: ${new Date(comment.comment.createdAt).toLocaleString()}\n` +
                  `• Body: ${comment.comment.body}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create comment: ${error.message}`);
    }
  }

  async getLinearCycles(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { team, limit = 20 } = args;

    try {
      let cycles;
      
      if (team) {
        cycles = await this.linear.team(team).cycles();
      } else {
        cycles = await this.linear.cycles();
      }

      const cycleList = cycles.nodes.slice(0, limit).map(cycle => ({
        id: cycle.id,
        name: cycle.name,
        description: cycle.description,
        startsAt: cycle.startsAt,
        endsAt: cycle.endsAt,
        completedAt: cycle.completedAt,
        state: cycle.state,
        progress: cycle.progress,
        url: cycle.url,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Found ${cycleList.length} cycles:\n\n${cycleList.map(c => 
              `• **${c.name}**\n  ID: ${c.id}\n  State: ${c.state}\n  Progress: ${c.progress}%\n  Start: ${new Date(c.startsAt).toLocaleString()}\n  End: ${new Date(c.endsAt).toLocaleString()}\n  URL: ${c.url}`
            ).join('\n\n')}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get cycles: ${error.message}`);
    }
  }

  async createLinearCycle(args) {
    await this.initializeLinear(process.env.LINEAR_API_TOKEN);
    const { team, name, description, starts_at, ends_at } = args;

    try {
      const cycleCreateInput = {
        teamId: team,
        name: name,
        description: description,
        startsAt: starts_at,
        endsAt: ends_at,
      };

      const cycle = await this.linear.cycleCreate(cycleCreateInput);

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Cycle created successfully!\n\n` +
                  `• ID: ${cycle.cycle.id}\n` +
                  `• Name: ${cycle.cycle.name}\n` +
                  `• State: ${cycle.cycle.state}\n` +
                  `• Progress: ${cycle.cycle.progress}%\n` +
                  `• Start: ${new Date(cycle.cycle.startsAt).toLocaleString()}\n` +
                  `• End: ${new Date(cycle.cycle.endsAt).toLocaleString()}\n` +
                  `• URL: ${cycle.cycle.url}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create cycle: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('⚫ Shadow Linear MCP Server running...');
  }
}

// Run the server
const linearMCP = new LinearMCP();
linearMCP.run().catch(console.error);
