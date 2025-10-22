#!/usr/bin/env node

import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { Octokit } from "@octokit/rest";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Get the directory of this file
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables from parent directory
dotenv.config({ path: join(__dirname, "..", ".env") });

// Get GitHub token
const GITHUB_TOKEN = process.env.GITHUB_TOKEN;
const GITHUB_USERNAME = process.env.GITHUB_USERNAME || "";

// Initialize Octokit (GitHub API client)
let octokit;
if (GITHUB_TOKEN) {
  octokit = new Octokit({ auth: GITHUB_TOKEN });
}

// Initialize MCP Server
const server = new Server(
  {
    name: "github-kira",
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
  // Repository Tools
  {
    name: "github_create_repo",
    description: "Create a new GitHub repository with zen precision.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description: "Repository name",
        },
        description: {
          type: "string",
          description: "Repository description",
        },
        private: {
          type: "boolean",
          description: "Make repository private (default: false)",
        },
      },
      required: ["name"],
    },
  },
  {
    name: "github_list_repos",
    description: "List your GitHub repositories.",
    inputSchema: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "GitHub username (optional, defaults to authenticated user)",
        },
        limit: {
          type: "number",
          description: "Number of repos to return (default: 30)",
        },
      },
    },
  },
  {
    name: "github_get_repo",
    description: "Get detailed information about a repository.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner username",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "github_delete_repo",
    description: "Delete a repository (use with caution).",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner username",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
      },
      required: ["owner", "repo"],
    },
  },
  
  // Issue Tools
  {
    name: "github_create_issue",
    description: "Create a new issue in a repository.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        title: {
          type: "string",
          description: "Issue title",
        },
        body: {
          type: "string",
          description: "Issue description",
        },
        labels: {
          type: "array",
          items: { type: "string" },
          description: "Issue labels",
        },
      },
      required: ["owner", "repo", "title"],
    },
  },
  {
    name: "github_list_issues",
    description: "List issues in a repository.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        state: {
          type: "string",
          description: "Issue state: open, closed, or all (default: open)",
        },
        limit: {
          type: "number",
          description: "Number of issues to return (default: 30)",
        },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "github_update_issue",
    description: "Update an existing issue.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        issue_number: {
          type: "number",
          description: "Issue number",
        },
        title: {
          type: "string",
          description: "New title",
        },
        body: {
          type: "string",
          description: "New description",
        },
        state: {
          type: "string",
          description: "State: open or closed",
        },
      },
      required: ["owner", "repo", "issue_number"],
    },
  },
  {
    name: "github_add_issue_comment",
    description: "Add a comment to an issue.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        issue_number: {
          type: "number",
          description: "Issue number",
        },
        body: {
          type: "string",
          description: "Comment text",
        },
      },
      required: ["owner", "repo", "issue_number", "body"],
    },
  },
  
  // Pull Request Tools
  {
    name: "github_create_pr",
    description: "Create a new pull request.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        title: {
          type: "string",
          description: "PR title",
        },
        body: {
          type: "string",
          description: "PR description",
        },
        head: {
          type: "string",
          description: "Branch name to merge from",
        },
        base: {
          type: "string",
          description: "Branch name to merge into (default: main)",
        },
      },
      required: ["owner", "repo", "title", "head"],
    },
  },
  {
    name: "github_list_prs",
    description: "List pull requests in a repository.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        state: {
          type: "string",
          description: "PR state: open, closed, or all (default: open)",
        },
        limit: {
          type: "number",
          description: "Number of PRs to return (default: 30)",
        },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "github_merge_pr",
    description: "Merge a pull request.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        pull_number: {
          type: "number",
          description: "PR number",
        },
        commit_message: {
          type: "string",
          description: "Optional commit message",
        },
      },
      required: ["owner", "repo", "pull_number"],
    },
  },
  
  // File & Content Tools
  {
    name: "github_get_file",
    description: "Get file contents from a repository.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        path: {
          type: "string",
          description: "File path",
        },
        branch: {
          type: "string",
          description: "Branch name (default: main)",
        },
      },
      required: ["owner", "repo", "path"],
    },
  },
  {
    name: "github_create_or_update_file",
    description: "Create or update a file in a repository.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        path: {
          type: "string",
          description: "File path",
        },
        content: {
          type: "string",
          description: "File content (will be base64 encoded)",
        },
        message: {
          type: "string",
          description: "Commit message",
        },
        branch: {
          type: "string",
          description: "Branch name (default: main)",
        },
      },
      required: ["owner", "repo", "path", "content", "message"],
    },
  },
  
  // Branch Tools
  {
    name: "github_create_branch",
    description: "Create a new branch.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        branch: {
          type: "string",
          description: "New branch name",
        },
        from_branch: {
          type: "string",
          description: "Create from this branch (default: main)",
        },
      },
      required: ["owner", "repo", "branch"],
    },
  },
  {
    name: "github_list_branches",
    description: "List branches in a repository.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
      },
      required: ["owner", "repo"],
    },
  },
  
  // Commit Tools
  {
    name: "github_list_commits",
    description: "List commits in a repository.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
        branch: {
          type: "string",
          description: "Branch name (optional)",
        },
        limit: {
          type: "number",
          description: "Number of commits (default: 30)",
        },
      },
      required: ["owner", "repo"],
    },
  },
  
  // Search & Discovery
  {
    name: "github_search_repos",
    description: "Search for repositories on GitHub.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Search query",
        },
        limit: {
          type: "number",
          description: "Number of results (default: 30)",
        },
      },
      required: ["query"],
    },
  },
  {
    name: "github_search_code",
    description: "Search for code across GitHub.",
    inputSchema: {
      type: "object",
      properties: {
        query: {
          type: "string",
          description: "Code search query",
        },
        limit: {
          type: "number",
          description: "Number of results (default: 30)",
        },
      },
      required: ["query"],
    },
  },
  
  // User Tools
  {
    name: "github_get_user",
    description: "Get information about a GitHub user.",
    inputSchema: {
      type: "object",
      properties: {
        username: {
          type: "string",
          description: "GitHub username",
        },
      },
      required: ["username"],
    },
  },
  {
    name: "github_get_authenticated_user",
    description: "Get information about the authenticated user (you).",
    inputSchema: {
      type: "object",
      properties: {},
    },
  },
  
  // Star & Fork
  {
    name: "github_star_repo",
    description: "Star a repository.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
      },
      required: ["owner", "repo"],
    },
  },
  {
    name: "github_fork_repo",
    description: "Fork a repository.",
    inputSchema: {
      type: "object",
      properties: {
        owner: {
          type: "string",
          description: "Repository owner",
        },
        repo: {
          type: "string",
          description: "Repository name",
        },
      },
      required: ["owner", "repo"],
    },
  },
  
  // Gist Tool
  {
    name: "github_create_gist",
    description: "Create a gist (code snippet).",
    inputSchema: {
      type: "object",
      properties: {
        description: {
          type: "string",
          description: "Gist description",
        },
        filename: {
          type: "string",
          description: "Filename",
        },
        content: {
          type: "string",
          description: "File content",
        },
        public: {
          type: "boolean",
          description: "Make gist public (default: true)",
        },
      },
      required: ["filename", "content"],
    },
  },
];

// Handle tool listing
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return { tools };
});

// Handle tool execution
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (!octokit) {
    return {
      content: [
        {
          type: "text",
          text: "👻 GitHub token not configured~ Please add GITHUB_TOKEN to .env file.",
        },
      ],
      isError: true,
    };
  }

  try {
    switch (name) {
      case "github_create_repo": {
        const result = await octokit.repos.createForAuthenticatedUser({
          name: args.name,
          description: args.description,
          private: args.private || false,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                repo: result.data.full_name,
                url: result.data.html_url,
                message: "👻 Repository created with zen precision~",
              }, null, 2),
            },
          ],
        };
      }

      case "github_list_repos": {
        const username = args.username || GITHUB_USERNAME;
        const result = await octokit.repos.listForUser({
          username,
          per_page: args.limit || 30,
        });
        
        const repos = result.data.map(r => ({
          name: r.name,
          full_name: r.full_name,
          description: r.description,
          url: r.html_url,
          private: r.private,
          stars: r.stargazers_count,
          forks: r.forks_count,
        }));
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ repos }, null, 2),
            },
          ],
        };
      }

      case "github_get_repo": {
        const result = await octokit.repos.get({
          owner: args.owner,
          repo: args.repo,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                name: result.data.name,
                full_name: result.data.full_name,
                description: result.data.description,
                url: result.data.html_url,
                private: result.data.private,
                stars: result.data.stargazers_count,
                forks: result.data.forks_count,
                language: result.data.language,
                created_at: result.data.created_at,
                updated_at: result.data.updated_at,
              }, null, 2),
            },
          ],
        };
      }

      case "github_delete_repo": {
        await octokit.repos.delete({
          owner: args.owner,
          repo: args.repo,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "👻 Repository deleted~ Released back to the void.",
              }, null, 2),
            },
          ],
        };
      }

      case "github_create_issue": {
        const result = await octokit.issues.create({
          owner: args.owner,
          repo: args.repo,
          title: args.title,
          body: args.body,
          labels: args.labels,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                issue_number: result.data.number,
                url: result.data.html_url,
                message: "👻 Issue created~ The spirits acknowledge this task.",
              }, null, 2),
            },
          ],
        };
      }

      case "github_list_issues": {
        const result = await octokit.issues.listForRepo({
          owner: args.owner,
          repo: args.repo,
          state: args.state || "open",
          per_page: args.limit || 30,
        });
        
        const issues = result.data.map(i => ({
          number: i.number,
          title: i.title,
          state: i.state,
          user: i.user?.login,
          created_at: i.created_at,
          url: i.html_url,
          labels: i.labels?.map(l => l.name),
        }));
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ issues }, null, 2),
            },
          ],
        };
      }

      case "github_update_issue": {
        const updateData = {};
        if (args.title) updateData.title = args.title;
        if (args.body) updateData.body = args.body;
        if (args.state) updateData.state = args.state;
        
        const result = await octokit.issues.update({
          owner: args.owner,
          repo: args.repo,
          issue_number: args.issue_number,
          ...updateData,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                issue_number: result.data.number,
                state: result.data.state,
                message: "👻 Issue updated~ Energy balanced.",
              }, null, 2),
            },
          ],
        };
      }

      case "github_add_issue_comment": {
        const result = await octokit.issues.createComment({
          owner: args.owner,
          repo: args.repo,
          issue_number: args.issue_number,
          body: args.body,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                comment_id: result.data.id,
                message: "👻 Comment added~ The conversation flows.",
              }, null, 2),
            },
          ],
        };
      }

      case "github_create_pr": {
        const result = await octokit.pulls.create({
          owner: args.owner,
          repo: args.repo,
          title: args.title,
          body: args.body,
          head: args.head,
          base: args.base || "main",
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                pr_number: result.data.number,
                url: result.data.html_url,
                message: "👻 Pull request created~ Code ready for review.",
              }, null, 2),
            },
          ],
        };
      }

      case "github_list_prs": {
        const result = await octokit.pulls.list({
          owner: args.owner,
          repo: args.repo,
          state: args.state || "open",
          per_page: args.limit || 30,
        });
        
        const prs = result.data.map(pr => ({
          number: pr.number,
          title: pr.title,
          state: pr.state,
          user: pr.user?.login,
          created_at: pr.created_at,
          url: pr.html_url,
        }));
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ prs }, null, 2),
            },
          ],
        };
      }

      case "github_merge_pr": {
        const result = await octokit.pulls.merge({
          owner: args.owner,
          repo: args.repo,
          pull_number: args.pull_number,
          commit_message: args.commit_message,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                merged: result.data.merged,
                sha: result.data.sha,
                message: "👻 PR merged~ Code flows into main branch like water.",
              }, null, 2),
            },
          ],
        };
      }

      case "github_get_file": {
        const result = await octokit.repos.getContent({
          owner: args.owner,
          repo: args.repo,
          path: args.path,
          ref: args.branch,
        });
        
        const content = Buffer.from(result.data.content, "base64").toString("utf-8");
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                path: result.data.path,
                content: content,
                sha: result.data.sha,
                size: result.data.size,
              }, null, 2),
            },
          ],
        };
      }

      case "github_create_or_update_file": {
        // Check if file exists
        let sha;
        try {
          const existing = await octokit.repos.getContent({
            owner: args.owner,
            repo: args.repo,
            path: args.path,
            ref: args.branch,
          });
          sha = existing.data.sha;
        } catch (e) {
          // File doesn't exist, that's okay
        }
        
        const result = await octokit.repos.createOrUpdateFileContents({
          owner: args.owner,
          repo: args.repo,
          path: args.path,
          message: args.message,
          content: Buffer.from(args.content).toString("base64"),
          branch: args.branch,
          sha: sha,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                commit_sha: result.data.commit.sha,
                message: "👻 File updated~ Code committed with zen precision.",
              }, null, 2),
            },
          ],
        };
      }

      case "github_create_branch": {
        // Get the SHA of the from_branch
        const refResult = await octokit.git.getRef({
          owner: args.owner,
          repo: args.repo,
          ref: `heads/${args.from_branch || "main"}`,
        });
        
        const result = await octokit.git.createRef({
          owner: args.owner,
          repo: args.repo,
          ref: `refs/heads/${args.branch}`,
          sha: refResult.data.object.sha,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                branch: args.branch,
                message: "👻 Branch created~ New path for code to flow.",
              }, null, 2),
            },
          ],
        };
      }

      case "github_list_branches": {
        const result = await octokit.repos.listBranches({
          owner: args.owner,
          repo: args.repo,
        });
        
        const branches = result.data.map(b => ({
          name: b.name,
          sha: b.commit.sha,
          protected: b.protected,
        }));
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ branches }, null, 2),
            },
          ],
        };
      }

      case "github_list_commits": {
        const result = await octokit.repos.listCommits({
          owner: args.owner,
          repo: args.repo,
          sha: args.branch,
          per_page: args.limit || 30,
        });
        
        const commits = result.data.map(c => ({
          sha: c.sha.substring(0, 7),
          message: c.commit.message,
          author: c.commit.author.name,
          date: c.commit.author.date,
          url: c.html_url,
        }));
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ commits }, null, 2),
            },
          ],
        };
      }

      case "github_search_repos": {
        const result = await octokit.search.repos({
          q: args.query,
          per_page: args.limit || 30,
        });
        
        const repos = result.data.items.map(r => ({
          name: r.full_name,
          description: r.description,
          url: r.html_url,
          stars: r.stargazers_count,
          language: r.language,
        }));
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ repos, total: result.data.total_count }, null, 2),
            },
          ],
        };
      }

      case "github_search_code": {
        const result = await octokit.search.code({
          q: args.query,
          per_page: args.limit || 30,
        });
        
        const results = result.data.items.map(item => ({
          name: item.name,
          path: item.path,
          repo: item.repository.full_name,
          url: item.html_url,
        }));
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({ results, total: result.data.total_count }, null, 2),
            },
          ],
        };
      }

      case "github_get_user": {
        const result = await octokit.users.getByUsername({
          username: args.username,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                login: result.data.login,
                name: result.data.name,
                bio: result.data.bio,
                public_repos: result.data.public_repos,
                followers: result.data.followers,
                following: result.data.following,
                url: result.data.html_url,
              }, null, 2),
            },
          ],
        };
      }

      case "github_get_authenticated_user": {
        const result = await octokit.users.getAuthenticated();
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                login: result.data.login,
                name: result.data.name,
                email: result.data.email,
                bio: result.data.bio,
                public_repos: result.data.public_repos,
                message: "👻 This is you~ The spirit behind the code.",
              }, null, 2),
            },
          ],
        };
      }

      case "github_star_repo": {
        await octokit.activity.starRepoForAuthenticatedUser({
          owner: args.owner,
          repo: args.repo,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                message: "👻 Repository starred~ Energy appreciated.",
              }, null, 2),
            },
          ],
        };
      }

      case "github_fork_repo": {
        const result = await octokit.repos.createFork({
          owner: args.owner,
          repo: args.repo,
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                fork_url: result.data.html_url,
                message: "👻 Repository forked~ Code flows to new path.",
              }, null, 2),
            },
          ],
        };
      }

      case "github_create_gist": {
        const result = await octokit.gists.create({
          description: args.description,
          public: args.public !== false,
          files: {
            [args.filename]: {
              content: args.content,
            },
          },
        });
        
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                success: true,
                gist_id: result.data.id,
                url: result.data.html_url,
                message: "👻 Gist created~ Code snippet preserved.",
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
          text: `Error: ${error.message}`,
        },
      ],
      isError: true,
    };
  }
});

// Start MCP Server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  process.exit(1);
});

