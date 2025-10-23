#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import dotenv from "dotenv";
import fetch from "node-fetch";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, "..", ".env") });

const N8N_API_KEY = process.env.N8N_API_KEY;
const N8N_BASE_URL = process.env.N8N_BASE_URL || "http://localhost:5678";

// N8N API Helper
class N8NClient {
  constructor(baseUrl, apiKey) {
    this.baseUrl = baseUrl.replace(/\/$/, ""); // Remove trailing slash
    this.apiKey = apiKey;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseUrl}/api/v1${endpoint}`;
    const response = await fetch(url, {
      ...options,
      headers: {
        "X-N8N-API-KEY": this.apiKey,
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`N8N API Error: ${response.status} - ${error}`);
    }

    return await response.json();
  }

  // Workflows
  async listWorkflows() {
    return await this.request("/workflows");
  }

  async getWorkflow(id) {
    return await this.request(`/workflows/${id}`);
  }

  async createWorkflow(workflow) {
    return await this.request("/workflows", {
      method: "POST",
      body: JSON.stringify(workflow),
    });
  }

  async updateWorkflow(id, workflow) {
    return await this.request(`/workflows/${id}`, {
      method: "PUT",
      body: JSON.stringify(workflow),
    });
  }

  async deleteWorkflow(id) {
    return await this.request(`/workflows/${id}`, {
      method: "DELETE",
    });
  }

  async activateWorkflow(id) {
    return await this.request(`/workflows/${id}/activate`, {
      method: "POST",
    });
  }

  async deactivateWorkflow(id) {
    return await this.request(`/workflows/${id}/deactivate`, {
      method: "POST",
    });
  }

  // Executions
  async listExecutions(filters = {}) {
    const params = new URLSearchParams(filters);
    return await this.request(`/executions?${params}`);
  }

  async getExecution(id) {
    return await this.request(`/executions/${id}`);
  }

  async deleteExecution(id) {
    return await this.request(`/executions/${id}`, {
      method: "DELETE",
    });
  }

  // Test workflow
  async testWorkflow(id) {
    return await this.request(`/workflows/${id}/test`, {
      method: "POST",
    });
  }

  // Credentials
  async listCredentials() {
    return await this.request("/credentials");
  }

  async getCredential(id) {
    return await this.request(`/credentials/${id}`);
  }
}

// Initialize N8N client
let n8nClient = null;
if (N8N_API_KEY && N8N_BASE_URL) {
  n8nClient = new N8NClient(N8N_BASE_URL, N8N_API_KEY);
}

// Create MCP server
const server = new Server(
  {
    name: "n8n-kira",
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
      // Workflow Management
      {
        name: "n8n_list_workflows",
        description: "👻 List all N8N workflows with zen clarity",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "n8n_get_workflow",
        description: "👻 Get detailed information about a specific workflow",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID",
            },
          },
          required: ["workflow_id"],
        },
      },
      {
        name: "n8n_create_workflow",
        description: "👻 Create a new N8N workflow with zen precision",
        inputSchema: {
          type: "object",
          properties: {
            name: {
              type: "string",
              description: "Workflow name",
            },
            nodes: {
              type: "array",
              description: "Array of workflow nodes",
            },
            connections: {
              type: "object",
              description: "Node connections",
            },
            active: {
              type: "boolean",
              description: "Whether to activate the workflow (default: false)",
            },
          },
          required: ["name", "nodes"],
        },
      },
      {
        name: "n8n_update_workflow",
        description: "👻 Update an existing workflow",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID",
            },
            name: {
              type: "string",
              description: "New workflow name",
            },
            nodes: {
              type: "array",
              description: "Updated workflow nodes",
            },
            connections: {
              type: "object",
              description: "Updated node connections",
            },
            active: {
              type: "boolean",
              description: "Whether workflow is active",
            },
          },
          required: ["workflow_id"],
        },
      },
      {
        name: "n8n_delete_workflow",
        description: "👻 Delete a workflow permanently",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID to delete",
            },
          },
          required: ["workflow_id"],
        },
      },
      {
        name: "n8n_activate_workflow",
        description: "👻 Activate a workflow to start automation",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID to activate",
            },
          },
          required: ["workflow_id"],
        },
      },
      {
        name: "n8n_deactivate_workflow",
        description: "👻 Deactivate a workflow to pause automation",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID to deactivate",
            },
          },
          required: ["workflow_id"],
        },
      },
      {
        name: "n8n_test_workflow",
        description: "👻 Test a workflow execution",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "The workflow ID to test",
            },
          },
          required: ["workflow_id"],
        },
      },
      // Execution Management
      {
        name: "n8n_list_executions",
        description: "👻 List workflow executions with filters",
        inputSchema: {
          type: "object",
          properties: {
            workflow_id: {
              type: "string",
              description: "Filter by workflow ID",
            },
            status: {
              type: "string",
              description: "Filter by status: success, error, running, waiting",
            },
            limit: {
              type: "number",
              description: "Number of executions to return (default: 20)",
            },
          },
        },
      },
      {
        name: "n8n_get_execution",
        description: "👻 Get detailed execution information",
        inputSchema: {
          type: "object",
          properties: {
            execution_id: {
              type: "string",
              description: "The execution ID",
            },
          },
          required: ["execution_id"],
        },
      },
      {
        name: "n8n_delete_execution",
        description: "👻 Delete an execution record",
        inputSchema: {
          type: "object",
          properties: {
            execution_id: {
              type: "string",
              description: "The execution ID to delete",
            },
          },
          required: ["execution_id"],
        },
      },
      // Credentials
      {
        name: "n8n_list_credentials",
        description: "👻 List all configured credentials",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "n8n_get_credential",
        description: "👻 Get credential information (without sensitive data)",
        inputSchema: {
          type: "object",
          properties: {
            credential_id: {
              type: "string",
              description: "The credential ID",
            },
          },
          required: ["credential_id"],
        },
      },
    ],
  };
});

// Handle tool calls
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!n8nClient) {
    return {
      content: [
        {
          type: "text",
          text: "❌ N8N client not initialized. Check N8N_API_KEY and N8N_BASE_URL in .env",
        },
      ],
    };
  }

  try {
    switch (name) {
      // Workflow Management
      case "n8n_list_workflows": {
        const workflows = await n8nClient.listWorkflows();
        return {
          content: [
            {
              type: "text",
              text: `✅ Found ${workflows.data?.length || 0} workflows\n\n${JSON.stringify(workflows, null, 2)}\n\n👻 Workflows listed with zen clarity~`,
            },
          ],
        };
      }

      case "n8n_get_workflow": {
        const workflow = await n8nClient.getWorkflow(args.workflow_id);
        return {
          content: [
            {
              type: "text",
              text: `✅ Workflow details retrieved\n\n${JSON.stringify(workflow, null, 2)}\n\n👻 Workflow analyzed with precision~`,
            },
          ],
        };
      }

      case "n8n_create_workflow": {
        const workflowData = {
          name: args.name,
          nodes: args.nodes,
          connections: args.connections || {},
          active: args.active || false,
          settings: {},
        };
        const result = await n8nClient.createWorkflow(workflowData);
        return {
          content: [
            {
              type: "text",
              text: `✅ Workflow created: ${result.name}\nID: ${result.id}\n\n👻 Workflow crafted with zen precision~`,
            },
          ],
        };
      }

      case "n8n_update_workflow": {
        const updateData = {};
        if (args.name) updateData.name = args.name;
        if (args.nodes) updateData.nodes = args.nodes;
        if (args.connections) updateData.connections = args.connections;
        if (args.active !== undefined) updateData.active = args.active;

        const result = await n8nClient.updateWorkflow(args.workflow_id, updateData);
        return {
          content: [
            {
              type: "text",
              text: `✅ Workflow updated: ${result.name}\n\n👻 Changes applied with zen harmony~`,
            },
          ],
        };
      }

      case "n8n_delete_workflow": {
        await n8nClient.deleteWorkflow(args.workflow_id);
        return {
          content: [
            {
              type: "text",
              text: `✅ Workflow deleted\n\n👻 Workflow removed with zen finality~`,
            },
          ],
        };
      }

      case "n8n_activate_workflow": {
        const result = await n8nClient.activateWorkflow(args.workflow_id);
        return {
          content: [
            {
              type: "text",
              text: `✅ Workflow activated: ${result.name}\n\n👻 Automation flows with zen energy~`,
            },
          ],
        };
      }

      case "n8n_deactivate_workflow": {
        const result = await n8nClient.deactivateWorkflow(args.workflow_id);
        return {
          content: [
            {
              type: "text",
              text: `✅ Workflow deactivated: ${result.name}\n\n👻 Automation paused with zen calm~`,
            },
          ],
        };
      }

      case "n8n_test_workflow": {
        const result = await n8nClient.testWorkflow(args.workflow_id);
        return {
          content: [
            {
              type: "text",
              text: `✅ Workflow test initiated\n\n${JSON.stringify(result, null, 2)}\n\n👻 Test executed with zen precision~`,
            },
          ],
        };
      }

      // Execution Management
      case "n8n_list_executions": {
        const filters = {};
        if (args.workflow_id) filters.workflowId = args.workflow_id;
        if (args.status) filters.status = args.status;
        if (args.limit) filters.limit = args.limit;

        const executions = await n8nClient.listExecutions(filters);
        return {
          content: [
            {
              type: "text",
              text: `✅ Found ${executions.data?.length || 0} executions\n\n${JSON.stringify(executions, null, 2)}\n\n👻 Executions tracked with zen awareness~`,
            },
          ],
        };
      }

      case "n8n_get_execution": {
        const execution = await n8nClient.getExecution(args.execution_id);
        return {
          content: [
            {
              type: "text",
              text: `✅ Execution details retrieved\n\n${JSON.stringify(execution, null, 2)}\n\n👻 Execution analyzed with clarity~`,
            },
          ],
        };
      }

      case "n8n_delete_execution": {
        await n8nClient.deleteExecution(args.execution_id);
        return {
          content: [
            {
              type: "text",
              text: `✅ Execution deleted\n\n👻 Record cleared with zen thoroughness~`,
            },
          ],
        };
      }

      // Credentials
      case "n8n_list_credentials": {
        const credentials = await n8nClient.listCredentials();
        return {
          content: [
            {
              type: "text",
              text: `✅ Found ${credentials.data?.length || 0} credentials\n\n${JSON.stringify(credentials, null, 2)}\n\n👻 Credentials managed with zen security~`,
            },
          ],
        };
      }

      case "n8n_get_credential": {
        const credential = await n8nClient.getCredential(args.credential_id);
        return {
          content: [
            {
              type: "text",
              text: `✅ Credential details retrieved\n\n${JSON.stringify(credential, null, 2)}\n\n👻 Credential info accessed securely~`,
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


