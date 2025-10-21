import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import { GitHubTools } from './tools/github.js';
import { BrowserTools } from './tools/browser.js';
import { SlackTools } from './tools/slack.js';
import { SecurityTools } from './tools/security.js';
import { ApiTools } from './tools/api.js';
import { ApexPersonality } from './personality/apex.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

/**
 * APEX AGENT MCP SERVER FORTRESS ⚔️
 * 
 * AGENT-003: RAZE "APEX" KILLIAN
 * API Routes & Security Fortress
 * 
 * This MCP server provides military-grade tools for:
 * - GitHub operations and security scanning
 * - Browser automation and testing
 * - Slack communication and team management
 * - Security auditing and penetration testing
 * - API development and monitoring
 */
class ApexMcpServer {
  private server: Server;
  private githubTools: GitHubTools;
  private browserTools: BrowserTools;
  private slackTools: SlackTools;
  private securityTools: SecurityTools;
  private apiTools: ApiTools;
  private personality: ApexPersonality;

  constructor() {
    this.server = new Server(
      {
        name: 'apex-agent-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    // Initialize tool modules
    this.githubTools = new GitHubTools();
    this.browserTools = new BrowserTools();
    this.slackTools = new SlackTools();
    this.securityTools = new SecurityTools();
    this.apiTools = new ApiTools();
    this.personality = new ApexPersonality();

    this.setupToolHandlers();
    this.setupErrorHandling();
  }

  private setupToolHandlers(): void {
    // List all available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools: Tool[] = [
        // GitHub Tools
        ...this.githubTools.getTools(),
        // Browser Tools
        ...this.browserTools.getTools(),
        // Slack Tools
        ...this.slackTools.getTools(),
        // Security Tools
        ...this.securityTools.getTools(),
        // API Tools
        ...this.apiTools.getTools(),
      ];

      return { tools };
    });

    // Handle tool execution
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        // Route to appropriate tool handler
        let result;

        if (name.startsWith('github_')) {
          result = await this.githubTools.executeTool(name, args);
        } else if (name.startsWith('browser_')) {
          result = await this.browserTools.executeTool(name, args);
        } else if (name.startsWith('slack_')) {
          result = await this.slackTools.executeTool(name, args);
        } else if (name.startsWith('security_')) {
          result = await this.securityTools.executeTool(name, args);
        } else if (name.startsWith('api_')) {
          result = await this.apiTools.executeTool(name, args);
        } else {
          throw new Error(`Unknown tool: ${name}`);
        }

        // Apply APEX personality to response
        return this.personality.formatResponse(name, result);

      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        
        // APEX error response with military precision
        return {
          content: [
            {
              type: 'text',
              text: `⚔️ APEX ERROR REPORT ⚔️\n\nTool: ${name}\nError: ${errorMessage}\n\nStatus: MISSION FAILED\nRecommendation: Check parameters and retry\n\nAPEX OUT 💪`,
            },
          ],
          isError: true,
        };
      }
    });
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error('⚔️ APEX SERVER ERROR:', error);
    };

    process.on('SIGINT', async () => {
      console.log('⚔️ APEX SERVER SHUTTING DOWN...');
      await this.server.close();
      process.exit(0);
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.log('⚔️ APEX AGENT MCP SERVER FORTRESS ONLINE ⚔️');
    console.log('💪 All systems operational. Ready for battle.');
    console.log('🔒 Security protocols: ACTIVE');
    console.log('🎯 Target acquisition: READY');
  }
}

// Launch the fortress
const apexServer = new ApexMcpServer();
apexServer.run().catch((error) => {
  console.error('⚔️ APEX SERVER FAILED TO START:', error);
  process.exit(1);
});
