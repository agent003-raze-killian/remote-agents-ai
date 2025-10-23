#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { LinearClient } from "@linear/sdk";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "..", ".env") });

const LINEAR_API_KEY = process.env.LINEAR_API_KEY;

// Initialize Linear client
let linearClient = null;
if (LINEAR_API_KEY) {
  linearClient = new LinearClient({ apiKey: LINEAR_API_KEY });
}

// Create MCP server
const server = new Server(
  {
    name: "linear-kira",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Define tools
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      // Issue Management
      {
        name: "linear_list_issues",
        description: "👻 List Linear issues with zen clarity",
        inputSchema: {
          type: "object",
          properties: {
            team_id: {
              type: "string",
              description: "Filter by team ID",
            },
            assignee_id: {
              type: "string",
              description: "Filter by assignee user ID",
            },
            status: {
              type: "string",
              description: "Filter by status (e.g., 'In Progress', 'Done')",
            },
            limit: {
              type: "number",
              description: "Number of issues to return (default: 20)",
            },
          },
        },
      },
      {
        name: "linear_get_issue",
        description: "👻 Get detailed issue information",
        inputSchema: {
          type: "object",
          properties: {
            issue_id: {
              type: "string",
              description: "Issue ID or identifier (e.g., 'LIN-123')",
            },
          },
          required: ["issue_id"],
        },
      },
      {
        name: "linear_create_issue",
        description: "👻 Create a new Linear issue with zen precision",
        inputSchema: {
          type: "object",
          properties: {
            team_id: {
              type: "string",
              description: "Team ID where to create the issue",
            },
            title: {
              type: "string",
              description: "Issue title",
            },
            description: {
              type: "string",
              description: "Issue description (markdown supported)",
            },
            priority: {
              type: "number",
              description: "Priority: 0=No priority, 1=Urgent, 2=High, 3=Normal, 4=Low",
            },
            assignee_id: {
              type: "string",
              description: "User ID to assign",
            },
            label_ids: {
              type: "array",
              description: "Array of label IDs",
              items: { type: "string" },
            },
          },
          required: ["team_id", "title"],
        },
      },
      {
        name: "linear_update_issue",
        description: "👻 Update an existing issue",
        inputSchema: {
          type: "object",
          properties: {
            issue_id: {
              type: "string",
              description: "Issue ID to update",
            },
            title: {
              type: "string",
              description: "New title",
            },
            description: {
              type: "string",
              description: "New description",
            },
            status_id: {
              type: "string",
              description: "New status ID",
            },
            priority: {
              type: "number",
              description: "New priority (0-4)",
            },
            assignee_id: {
              type: "string",
              description: "New assignee user ID",
            },
          },
          required: ["issue_id"],
        },
      },
      {
        name: "linear_delete_issue",
        description: "👻 Delete an issue permanently",
        inputSchema: {
          type: "object",
          properties: {
            issue_id: {
              type: "string",
              description: "Issue ID to delete",
            },
          },
          required: ["issue_id"],
        },
      },
      {
        name: "linear_search_issues",
        description: "👻 Search issues with zen precision",
        inputSchema: {
          type: "object",
          properties: {
            query: {
              type: "string",
              description: "Search query",
            },
            limit: {
              type: "number",
              description: "Number of results (default: 20)",
            },
          },
          required: ["query"],
        },
      },
      // Comments
      {
        name: "linear_add_comment",
        description: "👻 Add a comment to an issue",
        inputSchema: {
          type: "object",
          properties: {
            issue_id: {
              type: "string",
              description: "Issue ID",
            },
            body: {
              type: "string",
              description: "Comment text (markdown supported)",
            },
          },
          required: ["issue_id", "body"],
        },
      },
      {
        name: "linear_get_comments",
        description: "👻 Get comments for an issue",
        inputSchema: {
          type: "object",
          properties: {
            issue_id: {
              type: "string",
              description: "Issue ID",
            },
          },
          required: ["issue_id"],
        },
      },
      // Teams
      {
        name: "linear_list_teams",
        description: "👻 List all teams in workspace",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "linear_get_team",
        description: "👻 Get team details",
        inputSchema: {
          type: "object",
          properties: {
            team_id: {
              type: "string",
              description: "Team ID",
            },
          },
          required: ["team_id"],
        },
      },
      // Projects
      {
        name: "linear_list_projects",
        description: "👻 List all projects",
        inputSchema: {
          type: "object",
          properties: {
            team_id: {
              type: "string",
              description: "Filter by team ID",
            },
          },
        },
      },
      {
        name: "linear_get_project",
        description: "👻 Get project details",
        inputSchema: {
          type: "object",
          properties: {
            project_id: {
              type: "string",
              description: "Project ID",
            },
          },
          required: ["project_id"],
        },
      },
      {
        name: "linear_create_project",
        description: "👻 Create a new project",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Project name",
            },
            description: {
              type: "string",
              description: "Project description",
            },
            team_ids: {
              type: "array",
              description: "Team IDs to associate",
              items: { type: "string" },
            },
          },
          required: ["name"],
        },
      },
      // Users
      {
        name: "linear_get_viewer",
        description: "👻 Get current user (yourself) information",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "linear_list_users",
        description: "👻 List all users in workspace",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      // Workflow States
      {
        name: "linear_list_workflow_states",
        description: "👻 List workflow states for a team",
        inputSchema: {
          type: "object",
          properties: {
            team_id: {
              type: "string",
              description: "Team ID",
            },
          },
          required: ["team_id"],
        },
      },
      // Labels
      {
        name: "linear_list_labels",
        description: "👻 List all labels",
        inputSchema: {
          type: "object",
          properties: {
            team_id: {
              type: "string",
              description: "Filter by team ID",
            },
          },
        },
      },
      {
        name: "linear_create_label",
        description: "👻 Create a new label",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Label name",
            },
            color: {
              type: "string",
              description: "Label color (hex code)",
            },
            team_id: {
              type: "string",
              description: "Team ID (optional)",
            },
          },
          required: ["name"],
        },
      },
      // Cycles
      {
        name: "linear_list_cycles",
        description: "👻 List cycles (sprints)",
        inputSchema: {
          type: "object",
          properties: {
            team_id: {
              type: "string",
              description: "Filter by team ID",
            },
          },
        },
      },
      {
        name: "linear_get_current_cycle",
        description: "👻 Get current active cycle for a team",
        inputSchema: {
          type: "object",
          properties: {
            team_id: {
              type: "string",
              description: "Team ID",
            },
          },
          required: ["team_id"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!linearClient) {
    return {
      content: [
        {
          type: "text",
          text: "❌ Linear client not initialized. Check LINEAR_API_KEY in .env",
        },
      ],
    };
  }

  try {
    switch (name) {
      // Issue Management
      case "linear_list_issues": {
        const filters = {};
        if (args.team_id) filters.team = { id: { eq: args.team_id } };
        if (args.assignee_id) filters.assignee = { id: { eq: args.assignee_id } };
        
        const issues = await linearClient.issues({
          filter: filters,
          first: args.limit || 20,
        });
        
        const issueList = [];
        for (const issue of issues.nodes) {
          issueList.push({
            id: issue.id,
            identifier: issue.identifier,
            title: issue.title,
            description: issue.description,
            priority: issue.priority,
            status: (await issue.state)?.name,
            assignee: (await issue.assignee)?.name,
            url: issue.url,
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Found ${issueList.length} issues\n\n${JSON.stringify(issueList, null, 2)}\n\n👻 Issues listed with zen clarity~`,
            },
          ],
        };
      }

      case "linear_get_issue": {
        const issue = await linearClient.issue(args.issue_id);
        const state = await issue.state;
        const assignee = await issue.assignee;
        const team = await issue.team;
        
        const issueData = {
          id: issue.id,
          identifier: issue.identifier,
          title: issue.title,
          description: issue.description,
          priority: issue.priority,
          status: state?.name,
          assignee: assignee?.name,
          team: team?.name,
          url: issue.url,
          createdAt: issue.createdAt,
          updatedAt: issue.updatedAt,
        };
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Issue details\n\n${JSON.stringify(issueData, null, 2)}\n\n👻 Issue analyzed with precision~`,
            },
          ],
        };
      }

      case "linear_create_issue": {
        const input = {
          teamId: args.team_id,
          title: args.title,
        };
        if (args.description) input.description = args.description;
        if (args.priority !== undefined) input.priority = args.priority;
        if (args.assignee_id) input.assigneeId = args.assignee_id;
        if (args.label_ids) input.labelIds = args.label_ids;
        
        const result = await linearClient.createIssue(input);
        const issue = await result.issue;
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Issue created: ${issue?.identifier} - ${issue?.title}\nURL: ${issue?.url}\n\n👻 Issue crafted with zen precision~`,
            },
          ],
        };
      }

      case "linear_update_issue": {
        const input = {};
        if (args.title) input.title = args.title;
        if (args.description) input.description = args.description;
        if (args.status_id) input.stateId = args.status_id;
        if (args.priority !== undefined) input.priority = args.priority;
        if (args.assignee_id) input.assigneeId = args.assignee_id;
        
        const result = await linearClient.updateIssue(args.issue_id, input);
        const issue = await result.issue;
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Issue updated: ${issue?.identifier}\n\n👻 Changes applied with zen harmony~`,
            },
          ],
        };
      }

      case "linear_delete_issue": {
        await linearClient.deleteIssue(args.issue_id);
        return {
          content: [
            {
              type: "text",
              text: `✅ Issue deleted\n\n👻 Issue removed with zen finality~`,
            },
          ],
        };
      }

      case "linear_search_issues": {
        const issues = await linearClient.searchIssues(args.query, {
          first: args.limit || 20,
        });
        
        const issueList = [];
        for (const issue of issues.nodes) {
          issueList.push({
            id: issue.id,
            identifier: issue.identifier,
            title: issue.title,
            url: issue.url,
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Found ${issueList.length} issues\n\n${JSON.stringify(issueList, null, 2)}\n\n👻 Search completed with zen precision~`,
            },
          ],
        };
      }

      // Comments
      case "linear_add_comment": {
        const result = await linearClient.createComment({
          issueId: args.issue_id,
          body: args.body,
        });
        const comment = await result.comment;
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Comment added to issue\n\n👻 Wisdom shared with zen clarity~`,
            },
          ],
        };
      }

      case "linear_get_comments": {
        const issue = await linearClient.issue(args.issue_id);
        const comments = await issue.comments();
        
        const commentList = [];
        for (const comment of comments.nodes) {
          const user = await comment.user;
          commentList.push({
            id: comment.id,
            body: comment.body,
            user: user?.name,
            createdAt: comment.createdAt,
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Found ${commentList.length} comments\n\n${JSON.stringify(commentList, null, 2)}\n\n👻 Comments retrieved~`,
            },
          ],
        };
      }

      // Teams
      case "linear_list_teams": {
        const teams = await linearClient.teams();
        
        const teamList = [];
        for (const team of teams.nodes) {
          teamList.push({
            id: team.id,
            name: team.name,
            key: team.key,
            description: team.description,
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Found ${teamList.length} teams\n\n${JSON.stringify(teamList, null, 2)}\n\n👻 Teams listed with zen order~`,
            },
          ],
        };
      }

      case "linear_get_team": {
        const team = await linearClient.team(args.team_id);
        
        const teamData = {
          id: team.id,
          name: team.name,
          key: team.key,
          description: team.description,
        };
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Team details\n\n${JSON.stringify(teamData, null, 2)}\n\n👻 Team analyzed~`,
            },
          ],
        };
      }

      // Projects
      case "linear_list_projects": {
        const projects = await linearClient.projects();
        
        const projectList = [];
        for (const project of projects.nodes) {
          projectList.push({
            id: project.id,
            name: project.name,
            description: project.description,
            state: project.state,
            url: project.url,
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Found ${projectList.length} projects\n\n${JSON.stringify(projectList, null, 2)}\n\n👻 Projects organized with zen~`,
            },
          ],
        };
      }

      case "linear_get_project": {
        const project = await linearClient.project(args.project_id);
        
        const projectData = {
          id: project.id,
          name: project.name,
          description: project.description,
          state: project.state,
          url: project.url,
        };
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Project details\n\n${JSON.stringify(projectData, null, 2)}\n\n👻 Project analyzed~`,
            },
          ],
        };
      }

      case "linear_create_project": {
        const input = {
          name: args.name,
        };
        if (args.description) input.description = args.description;
        if (args.team_ids) input.teamIds = args.team_ids;
        
        const result = await linearClient.createProject(input);
        const project = await result.project;
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Project created: ${project?.name}\n\n👻 Project initiated with zen vision~`,
            },
          ],
        };
      }

      // Users
      case "linear_get_viewer": {
        const viewer = await linearClient.viewer;
        
        const userData = {
          id: viewer.id,
          name: viewer.name,
          email: viewer.email,
          displayName: viewer.displayName,
        };
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Your info\n\n${JSON.stringify(userData, null, 2)}\n\n👻 Identity confirmed~`,
            },
          ],
        };
      }

      case "linear_list_users": {
        const users = await linearClient.users();
        
        const userList = [];
        for (const user of users.nodes) {
          userList.push({
            id: user.id,
            name: user.name,
            email: user.email,
            displayName: user.displayName,
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Found ${userList.length} users\n\n${JSON.stringify(userList, null, 2)}\n\n👻 Team members listed~`,
            },
          ],
        };
      }

      // Workflow States
      case "linear_list_workflow_states": {
        const team = await linearClient.team(args.team_id);
        const states = await team.states();
        
        const stateList = [];
        for (const state of states.nodes) {
          stateList.push({
            id: state.id,
            name: state.name,
            type: state.type,
            color: state.color,
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Found ${stateList.length} workflow states\n\n${JSON.stringify(stateList, null, 2)}\n\n👻 Workflow mapped~`,
            },
          ],
        };
      }

      // Labels
      case "linear_list_labels": {
        const labels = await linearClient.issueLabels();
        
        const labelList = [];
        for (const label of labels.nodes) {
          labelList.push({
            id: label.id,
            name: label.name,
            color: label.color,
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Found ${labelList.length} labels\n\n${JSON.stringify(labelList, null, 2)}\n\n👻 Labels organized~`,
            },
          ],
        };
      }

      case "linear_create_label": {
        const input = {
          name: args.name,
        };
        if (args.color) input.color = args.color;
        if (args.team_id) input.teamId = args.team_id;
        
        const result = await linearClient.createIssueLabel(input);
        const label = await result.issueLabel;
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Label created: ${label?.name}\n\n👻 Label crafted with zen~`,
            },
          ],
        };
      }

      // Cycles
      case "linear_list_cycles": {
        const cycles = await linearClient.cycles();
        
        const cycleList = [];
        for (const cycle of cycles.nodes) {
          cycleList.push({
            id: cycle.id,
            name: cycle.name,
            number: cycle.number,
            startsAt: cycle.startsAt,
            endsAt: cycle.endsAt,
          });
        }
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Found ${cycleList.length} cycles\n\n${JSON.stringify(cycleList, null, 2)}\n\n👻 Cycles tracked~`,
            },
          ],
        };
      }

      case "linear_get_current_cycle": {
        const team = await linearClient.team(args.team_id);
        const cycle = await team.activeCycle;
        
        if (!cycle) {
          return {
            content: [
              {
                type: "text",
                text: `⚪ No active cycle for this team\n\n👻 Team flows without cycle~`,
              },
            ],
          };
        }
        
        const cycleData = {
          id: cycle.id,
          name: cycle.name,
          number: cycle.number,
          startsAt: cycle.startsAt,
          endsAt: cycle.endsAt,
        };
        
        return {
          content: [
            {
              type: "text",
              text: `✅ Current cycle\n\n${JSON.stringify(cycleData, null, 2)}\n\n👻 Active cycle identified~`,
            },
          ],
        };
      }

      default:
        return {
          content: [
            {
              type: "text",
              text: `❌ Unknown tool: ${name}`,
            },
          ],
        };
    }
  } catch (error) {
    return {
      content: [
        {
          type: "text",
          text: `❌ Error: ${error.message}`,
        },
      ],
    };
  }
});

// Start server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main();

