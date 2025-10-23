#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

class GitHubMCPServer {
  constructor() {
    this.server = new Server(
      {
        name: 'github-shadow',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    this.github = null;
    this.setupToolHandlers();
    this.setupRequestHandlers();
  }

  setupToolHandlers() {
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'get_github_user',
            description: 'Get GitHub user information',
            inputSchema: {
              type: 'object',
              properties: {
                username: {
                  type: 'string',
                  description: 'GitHub username to get information for',
                },
              },
              required: ['username'],
            },
          },
          {
            name: 'get_github_repos',
            description: 'Get GitHub repositories for a user or organization',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'GitHub username or organization name',
                },
                type: {
                  type: 'string',
                  description: 'Type of repositories (all, owner, public, private, member)',
                  default: 'all',
                },
                sort: {
                  type: 'string',
                  description: 'Sort repositories by (created, updated, pushed, full_name)',
                  default: 'updated',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of repositories per page',
                  default: 30,
                },
              },
              required: ['owner'],
            },
          },
          {
            name: 'get_github_repo',
            description: 'Get detailed information about a specific repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner (username or organization)',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'get_github_issues',
            description: 'Get issues from a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                state: {
                  type: 'string',
                  description: 'Issue state (open, closed, all)',
                  default: 'open',
                },
                labels: {
                  type: 'string',
                  description: 'Comma-separated list of labels to filter by',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of issues per page',
                  default: 30,
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'create_github_issue',
            description: 'Create a new issue in a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                title: {
                  type: 'string',
                  description: 'Issue title',
                },
                body: {
                  type: 'string',
                  description: 'Issue body/description',
                },
                labels: {
                  type: 'array',
                  description: 'Array of label names',
                  items: { type: 'string' },
                },
                assignees: {
                  type: 'array',
                  description: 'Array of usernames to assign',
                  items: { type: 'string' },
                },
              },
              required: ['owner', 'repo', 'title'],
            },
          },
          {
            name: 'get_github_pull_requests',
            description: 'Get pull requests from a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                state: {
                  type: 'string',
                  description: 'PR state (open, closed, all)',
                  default: 'open',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of PRs per page',
                  default: 30,
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'create_github_pull_request',
            description: 'Create a new pull request',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                title: {
                  type: 'string',
                  description: 'Pull request title',
                },
                head: {
                  type: 'string',
                  description: 'The name of the branch where your changes are implemented',
                },
                base: {
                  type: 'string',
                  description: 'The name of the branch you want the changes pulled into',
                },
                body: {
                  type: 'string',
                  description: 'Pull request body/description',
                },
              },
              required: ['owner', 'repo', 'title', 'head', 'base'],
            },
          },
          {
            name: 'get_github_commits',
            description: 'Get commits from a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                sha: {
                  type: 'string',
                  description: 'SHA or branch to start listing commits from',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of commits per page',
                  default: 30,
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'get_github_branches',
            description: 'Get branches from a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of branches per page',
                  default: 30,
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'create_github_branch',
            description: 'Create a new branch',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                branch: {
                  type: 'string',
                  description: 'Name of the new branch',
                },
                from_branch: {
                  type: 'string',
                  description: 'Branch to create from (default: main)',
                  default: 'main',
                },
              },
              required: ['owner', 'repo', 'branch'],
            },
          },
          {
            name: 'get_github_file_contents',
            description: 'Get contents of a file from a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                path: {
                  type: 'string',
                  description: 'Path to the file',
                },
                ref: {
                  type: 'string',
                  description: 'Branch, tag, or commit SHA',
                },
              },
              required: ['owner', 'repo', 'path'],
            },
          },
          {
            name: 'create_or_update_github_file',
            description: 'Create or update a file in a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                path: {
                  type: 'string',
                  description: 'Path to the file',
                },
                message: {
                  type: 'string',
                  description: 'Commit message',
                },
                content: {
                  type: 'string',
                  description: 'File content (base64 encoded)',
                },
                branch: {
                  type: 'string',
                  description: 'Branch to commit to',
                  default: 'main',
                },
                sha: {
                  type: 'string',
                  description: 'SHA of the file to update (required for updates)',
                },
              },
              required: ['owner', 'repo', 'path', 'message', 'content'],
            },
          },
          {
            name: 'delete_github_file',
            description: 'Delete a file from a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                path: {
                  type: 'string',
                  description: 'Path to the file',
                },
                message: {
                  type: 'string',
                  description: 'Commit message',
                },
                branch: {
                  type: 'string',
                  description: 'Branch to commit to',
                  default: 'main',
                },
                sha: {
                  type: 'string',
                  description: 'SHA of the file to delete',
                },
              },
              required: ['owner', 'repo', 'path', 'message', 'sha'],
            },
          },
          {
            name: 'get_github_workflows',
            description: 'Get GitHub Actions workflows from a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'get_github_workflow_runs',
            description: 'Get GitHub Actions workflow runs',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                workflow_id: {
                  type: 'string',
                  description: 'Workflow ID or filename',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of runs per page',
                  default: 30,
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'get_github_releases',
            description: 'Get releases from a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of releases per page',
                  default: 30,
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'create_github_release',
            description: 'Create a new release',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                tag_name: {
                  type: 'string',
                  description: 'The name of the tag',
                },
                target_commitish: {
                  type: 'string',
                  description: 'Specifies the commitish value that determines where the Git tag is created from',
                  default: 'main',
                },
                name: {
                  type: 'string',
                  description: 'The name of the release',
                },
                body: {
                  type: 'string',
                  description: 'Text describing the contents of the tag',
                },
                draft: {
                  type: 'boolean',
                  description: 'True to create a draft (unpublished) release',
                  default: false,
                },
                prerelease: {
                  type: 'boolean',
                  description: 'True to identify the release as a prerelease',
                  default: false,
                },
              },
              required: ['owner', 'repo', 'tag_name'],
            },
          },
          {
            name: 'get_github_stargazers',
            description: 'Get users who starred a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of stargazers per page',
                  default: 30,
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'get_github_forks',
            description: 'Get forks of a repository',
            inputSchema: {
              type: 'object',
              properties: {
                owner: {
                  type: 'string',
                  description: 'Repository owner',
                },
                repo: {
                  type: 'string',
                  description: 'Repository name',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of forks per page',
                  default: 30,
                },
              },
              required: ['owner', 'repo'],
            },
          },
          {
            name: 'search_github_repositories',
            description: 'Search GitHub repositories',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
                sort: {
                  type: 'string',
                  description: 'Sort results by (stars, forks, help-wanted-issues, updated)',
                  default: 'stars',
                },
                order: {
                  type: 'string',
                  description: 'Sort order (asc, desc)',
                  default: 'desc',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of results per page',
                  default: 30,
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'search_github_issues',
            description: 'Search GitHub issues',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query',
                },
                sort: {
                  type: 'string',
                  description: 'Sort results by (comments, reactions, interactions, created, updated)',
                  default: 'updated',
                },
                order: {
                  type: 'string',
                  description: 'Sort order (asc, desc)',
                  default: 'desc',
                },
                per_page: {
                  type: 'number',
                  description: 'Number of results per page',
                  default: 30,
                },
              },
              required: ['query'],
            },
          },
        ],
      };
    });
  }

  setupRequestHandlers() {
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'get_github_user':
            return await this.getGitHubUser(args);
          case 'get_github_repos':
            return await this.getGitHubRepos(args);
          case 'get_github_repo':
            return await this.getGitHubRepo(args);
          case 'get_github_issues':
            return await this.getGitHubIssues(args);
          case 'create_github_issue':
            return await this.createGitHubIssue(args);
          case 'get_github_pull_requests':
            return await this.getGitHubPullRequests(args);
          case 'create_github_pull_request':
            return await this.createGitHubPullRequest(args);
          case 'get_github_commits':
            return await this.getGitHubCommits(args);
          case 'get_github_branches':
            return await this.getGitHubBranches(args);
          case 'create_github_branch':
            return await this.createGitHubBranch(args);
          case 'get_github_file_contents':
            return await this.getGitHubFileContents(args);
          case 'create_or_update_github_file':
            return await this.createOrUpdateGitHubFile(args);
          case 'delete_github_file':
            return await this.deleteGitHubFile(args);
          case 'get_github_workflows':
            return await this.getGitHubWorkflows(args);
          case 'get_github_workflow_runs':
            return await this.getGitHubWorkflowRuns(args);
          case 'get_github_releases':
            return await this.getGitHubReleases(args);
          case 'create_github_release':
            return await this.createGitHubRelease(args);
          case 'get_github_stargazers':
            return await this.getGitHubStargazers(args);
          case 'get_github_forks':
            return await this.getGitHubForks(args);
          case 'search_github_repositories':
            return await this.searchGitHubRepositories(args);
          case 'search_github_issues':
            return await this.searchGitHubIssues(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        throw new Error(`Error executing ${name}: ${error.message}`);
      }
    });
  }

  async initializeGitHub() {
    if (!this.github) {
      const token = process.env.GITHUB_TOKEN;
      if (!token) {
        throw new Error('GITHUB_TOKEN environment variable is required');
      }
      this.github = new Octokit({
        auth: token,
      });
    }
  }

  // User operations
  async getGitHubUser(args) {
    await this.initializeGitHub();
    const { username } = args;

    try {
      const { data } = await this.github.rest.users.getByUsername({
        username,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ GitHub User: ${data.login}\n\n` +
                  `• Name: ${data.name || 'Not set'}\n` +
                  `• Bio: ${data.bio || 'Not set'}\n` +
                  `• Company: ${data.company || 'Not set'}\n` +
                  `• Location: ${data.location || 'Not set'}\n` +
                  `• Email: ${data.email || 'Not set'}\n` +
                  `• Public Repos: ${data.public_repos}\n` +
                  `• Followers: ${data.followers}\n` +
                  `• Following: ${data.following}\n` +
                  `• Created: ${new Date(data.created_at).toLocaleString()}\n` +
                  `• Updated: ${new Date(data.updated_at).toLocaleString()}\n` +
                  `• Profile URL: ${data.html_url}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get user: ${error.message}`);
    }
  }

  // Repository operations
  async getGitHubRepos(args) {
    await this.initializeGitHub();
    const { owner, type = 'all', sort = 'updated', per_page = 30 } = args;

    try {
      const { data } = await this.github.rest.repos.listForUser({
        username: owner,
        type,
        sort,
        per_page,
      });

      const repos = data.map(repo => ({
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || 'No description',
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated: new Date(repo.updated_at).toLocaleString(),
        url: repo.html_url,
        private: repo.private,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Repositories for ${owner} (${repos.length} found):\n\n` +
                  repos.map(repo => 
                    `• ${repo.full_name} ${repo.private ? '(Private)' : ''}\n` +
                    `  Description: ${repo.description}\n` +
                    `  Language: ${repo.language}\n` +
                    `  Stars: ${repo.stars} | Forks: ${repo.forks}\n` +
                    `  Updated: ${repo.updated}\n` +
                    `  URL: ${repo.url}`
                  ).join('\n\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get repositories: ${error.message}`);
    }
  }

  async getGitHubRepo(args) {
    await this.initializeGitHub();
    const { owner, repo } = args;

    try {
      const { data } = await this.github.rest.repos.get({
        owner,
        repo,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Repository: ${data.full_name}\n\n` +
                  `• Description: ${data.description || 'No description'}\n` +
                  `• Language: ${data.language || 'Unknown'}\n` +
                  `• Stars: ${data.stargazers_count}\n` +
                  `• Forks: ${data.forks_count}\n` +
                  `• Watchers: ${data.watchers_count}\n` +
                  `• Open Issues: ${data.open_issues_count}\n` +
                  `• Default Branch: ${data.default_branch}\n` +
                  `• Private: ${data.private ? 'Yes' : 'No'}\n` +
                  `• Created: ${new Date(data.created_at).toLocaleString()}\n` +
                  `• Updated: ${new Date(data.updated_at).toLocaleString()}\n` +
                  `• Pushed: ${new Date(data.pushed_at).toLocaleString()}\n` +
                  `• URL: ${data.html_url}\n` +
                  `• Clone URL: ${data.clone_url}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get repository: ${error.message}`);
    }
  }

  // Issue operations
  async getGitHubIssues(args) {
    await this.initializeGitHub();
    const { owner, repo, state = 'open', labels, per_page = 30 } = args;

    try {
      const params = {
        owner,
        repo,
        state,
        per_page,
      };

      if (labels) {
        params.labels = labels;
      }

      const { data } = await this.github.rest.issues.listForRepo(params);

      const issues = data.map(issue => ({
        number: issue.number,
        title: issue.title,
        state: issue.state,
        labels: issue.labels.map(label => label.name),
        assignees: issue.assignees.map(assignee => assignee.login),
        created: new Date(issue.created_at).toLocaleString(),
        updated: new Date(issue.updated_at).toLocaleString(),
        url: issue.html_url,
        user: issue.user.login,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Issues for ${owner}/${repo} (${issues.length} found):\n\n` +
                  issues.map(issue => 
                    `• #${issue.number}: ${issue.title}\n` +
                    `  State: ${issue.state}\n` +
                    `  Labels: ${issue.labels.join(', ') || 'None'}\n` +
                    `  Assignees: ${issue.assignees.join(', ') || 'None'}\n` +
                    `  Author: ${issue.user}\n` +
                    `  Created: ${issue.created}\n` +
                    `  Updated: ${issue.updated}\n` +
                    `  URL: ${issue.url}`
                  ).join('\n\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get issues: ${error.message}`);
    }
  }

  async createGitHubIssue(args) {
    await this.initializeGitHub();
    const { owner, repo, title, body, labels, assignees } = args;

    try {
      const params = {
        owner,
        repo,
        title,
      };

      if (body) params.body = body;
      if (labels) params.labels = labels;
      if (assignees) params.assignees = assignees;

      const { data } = await this.github.rest.issues.create(params);

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Issue created successfully!\n\n` +
                  `• Number: #${data.number}\n` +
                  `• Title: ${data.title}\n` +
                  `• State: ${data.state}\n` +
                  `• URL: ${data.html_url}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create issue: ${error.message}`);
    }
  }

  // Pull Request operations
  async getGitHubPullRequests(args) {
    await this.initializeGitHub();
    const { owner, repo, state = 'open', per_page = 30 } = args;

    try {
      const { data } = await this.github.rest.pulls.list({
        owner,
        repo,
        state,
        per_page,
      });

      const prs = data.map(pr => ({
        number: pr.number,
        title: pr.title,
        state: pr.state,
        user: pr.user.login,
        head: pr.head.ref,
        base: pr.base.ref,
        created: new Date(pr.created_at).toLocaleString(),
        updated: new Date(pr.updated_at).toLocaleString(),
        url: pr.html_url,
        mergeable: pr.mergeable,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Pull Requests for ${owner}/${repo} (${prs.length} found):\n\n` +
                  prs.map(pr => 
                    `• #${pr.number}: ${pr.title}\n` +
                    `  State: ${pr.state}\n` +
                    `  Author: ${pr.user}\n` +
                    `  Head: ${pr.head} → Base: ${pr.base}\n` +
                    `  Mergeable: ${pr.mergeable ? 'Yes' : 'No'}\n` +
                    `  Created: ${pr.created}\n` +
                    `  Updated: ${pr.updated}\n` +
                    `  URL: ${pr.url}`
                  ).join('\n\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get pull requests: ${error.message}`);
    }
  }

  async createGitHubPullRequest(args) {
    await this.initializeGitHub();
    const { owner, repo, title, head, base, body } = args;

    try {
      const params = {
        owner,
        repo,
        title,
        head,
        base,
      };

      if (body) params.body = body;

      const { data } = await this.github.rest.pulls.create(params);

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Pull Request created successfully!\n\n` +
                  `• Number: #${data.number}\n` +
                  `• Title: ${data.title}\n` +
                  `• State: ${data.state}\n` +
                  `• Head: ${data.head.ref} → Base: ${data.base.ref}\n` +
                  `• URL: ${data.html_url}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create pull request: ${error.message}`);
    }
  }

  // Commit operations
  async getGitHubCommits(args) {
    await this.initializeGitHub();
    const { owner, repo, sha, per_page = 30 } = args;

    try {
      const params = {
        owner,
        repo,
        per_page,
      };

      if (sha) params.sha = sha;

      const { data } = await this.github.rest.repos.listCommits(params);

      const commits = data.map(commit => ({
        sha: commit.sha.substring(0, 7),
        message: commit.commit.message.split('\n')[0],
        author: commit.commit.author.name,
        date: new Date(commit.commit.author.date).toLocaleString(),
        url: commit.html_url,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Commits for ${owner}/${repo} (${commits.length} found):\n\n` +
                  commits.map(commit => 
                    `• ${commit.sha}: ${commit.message}\n` +
                    `  Author: ${commit.author}\n` +
                    `  Date: ${commit.date}\n` +
                    `  URL: ${commit.url}`
                  ).join('\n\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get commits: ${error.message}`);
    }
  }

  // Branch operations
  async getGitHubBranches(args) {
    await this.initializeGitHub();
    const { owner, repo, per_page = 30 } = args;

    try {
      const { data } = await this.github.rest.repos.listBranches({
        owner,
        repo,
        per_page,
      });

      const branches = data.map(branch => ({
        name: branch.name,
        protected: branch.protected,
        commit: branch.commit.sha.substring(0, 7),
        url: branch.commit.html_url,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Branches for ${owner}/${repo} (${branches.length} found):\n\n` +
                  branches.map(branch => 
                    `• ${branch.name} ${branch.protected ? '(Protected)' : ''}\n` +
                    `  Latest commit: ${branch.commit}\n` +
                    `  URL: ${branch.url}`
                  ).join('\n\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get branches: ${error.message}`);
    }
  }

  async createGitHubBranch(args) {
    await this.initializeGitHub();
    const { owner, repo, branch, from_branch = 'main' } = args;

    try {
      // Get the SHA of the from_branch
      const { data: refData } = await this.github.rest.git.getRef({
        owner,
        repo,
        ref: `heads/${from_branch}`,
      });

      // Create the new branch
      await this.github.rest.git.createRef({
        owner,
        repo,
        ref: `refs/heads/${branch}`,
        sha: refData.object.sha,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Branch created successfully!\n\n` +
                  `• Name: ${branch}\n` +
                  `• Created from: ${from_branch}\n` +
                  `• SHA: ${refData.object.sha.substring(0, 7)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create branch: ${error.message}`);
    }
  }

  // File operations
  async getGitHubFileContents(args) {
    await this.initializeGitHub();
    const { owner, repo, path, ref } = args;

    try {
      const params = {
        owner,
        repo,
        path,
      };

      if (ref) params.ref = ref;

      const { data } = await this.github.rest.repos.getContent(params);

      if (Array.isArray(data)) {
        // Directory
        const files = data.map(file => ({
          name: file.name,
          type: file.type,
          size: file.size,
          path: file.path,
          url: file.html_url,
        }));

        return {
          content: [
            {
              type: 'text',
              text: `⚫ Directory contents for ${owner}/${repo}/${path}:\n\n` +
                    files.map(file => 
                      `• ${file.name} (${file.type})\n` +
                      `  Size: ${file.size || 'N/A'}\n` +
                      `  Path: ${file.path}\n` +
                      `  URL: ${file.url}`
                    ).join('\n\n'),
            },
          ],
        };
      } else {
        // File
        const content = Buffer.from(data.content, 'base64').toString('utf-8');
        return {
          content: [
            {
              type: 'text',
              text: `⚫ File contents for ${owner}/${repo}/${path}:\n\n` +
                    `• Size: ${data.size} bytes\n` +
                    `• SHA: ${data.sha}\n` +
                    `• URL: ${data.html_url}\n\n` +
                    `Content:\n\`\`\`\n${content}\n\`\`\``,
            },
          ],
        };
      }
    } catch (error) {
      throw new Error(`Failed to get file contents: ${error.message}`);
    }
  }

  async createOrUpdateGitHubFile(args) {
    await this.initializeGitHub();
    const { owner, repo, path, message, content, branch = 'main', sha } = args;

    try {
      const params = {
        owner,
        repo,
        path,
        message,
        content: Buffer.from(content).toString('base64'),
        branch,
      };

      if (sha) params.sha = sha;

      const { data } = await this.github.rest.repos.createOrUpdateFileContents(params);

      return {
        content: [
          {
            type: 'text',
            text: `⚫ File ${sha ? 'updated' : 'created'} successfully!\n\n` +
                  `• Path: ${path}\n` +
                  `• Message: ${message}\n` +
                  `• SHA: ${data.commit.sha.substring(0, 7)}\n` +
                  `• URL: ${data.content.html_url}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to ${sha ? 'update' : 'create'} file: ${error.message}`);
    }
  }

  async deleteGitHubFile(args) {
    await this.initializeGitHub();
    const { owner, repo, path, message, branch = 'main', sha } = args;

    try {
      const { data } = await this.github.rest.repos.deleteFile({
        owner,
        repo,
        path,
        message,
        branch,
        sha,
      });

      return {
        content: [
          {
            type: 'text',
            text: `⚫ File deleted successfully!\n\n` +
                  `• Path: ${path}\n` +
                  `• Message: ${message}\n` +
                  `• SHA: ${data.commit.sha.substring(0, 7)}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to delete file: ${error.message}`);
    }
  }

  // Workflow operations
  async getGitHubWorkflows(args) {
    await this.initializeGitHub();
    const { owner, repo } = args;

    try {
      const { data } = await this.github.rest.actions.listWorkflowsForRepo({
        owner,
        repo,
      });

      const workflows = data.workflows.map(workflow => ({
        id: workflow.id,
        name: workflow.name,
        path: workflow.path,
        state: workflow.state,
        created: new Date(workflow.created_at).toLocaleString(),
        updated: new Date(workflow.updated_at).toLocaleString(),
        url: workflow.html_url,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Workflows for ${owner}/${repo} (${workflows.length} found):\n\n` +
                  workflows.map(workflow => 
                    `• ${workflow.name}\n` +
                    `  ID: ${workflow.id}\n` +
                    `  Path: ${workflow.path}\n` +
                    `  State: ${workflow.state}\n` +
                    `  Created: ${workflow.created}\n` +
                    `  Updated: ${workflow.updated}\n` +
                    `  URL: ${workflow.url}`
                  ).join('\n\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get workflows: ${error.message}`);
    }
  }

  async getGitHubWorkflowRuns(args) {
    await this.initializeGitHub();
    const { owner, repo, workflow_id, per_page = 30 } = args;

    try {
      const params = {
        owner,
        repo,
        per_page,
      };

      if (workflow_id) params.workflow_id = workflow_id;

      const { data } = await this.github.rest.actions.listWorkflowRunsForRepo(params);

      const runs = data.workflow_runs.map(run => ({
        id: run.id,
        name: run.name,
        status: run.status,
        conclusion: run.conclusion,
        created: new Date(run.created_at).toLocaleString(),
        updated: new Date(run.updated_at).toLocaleString(),
        url: run.html_url,
        head_branch: run.head_branch,
        head_sha: run.head_sha.substring(0, 7),
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Workflow runs for ${owner}/${repo} (${runs.length} found):\n\n` +
                  runs.map(run => 
                    `• ${run.name}\n` +
                    `  ID: ${run.id}\n` +
                    `  Status: ${run.status}\n` +
                    `  Conclusion: ${run.conclusion || 'N/A'}\n` +
                    `  Branch: ${run.head_branch}\n` +
                    `  SHA: ${run.head_sha}\n` +
                    `  Created: ${run.created}\n` +
                    `  Updated: ${run.updated}\n` +
                    `  URL: ${run.url}`
                  ).join('\n\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get workflow runs: ${error.message}`);
    }
  }

  // Release operations
  async getGitHubReleases(args) {
    await this.initializeGitHub();
    const { owner, repo, per_page = 30 } = args;

    try {
      const { data } = await this.github.rest.repos.listReleases({
        owner,
        repo,
        per_page,
      });

      const releases = data.map(release => ({
        id: release.id,
        tag_name: release.tag_name,
        name: release.name,
        draft: release.draft,
        prerelease: release.prerelease,
        created: new Date(release.created_at).toLocaleString(),
        published: release.published_at ? new Date(release.published_at).toLocaleString() : 'Not published',
        url: release.html_url,
        assets: release.assets.length,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Releases for ${owner}/${repo} (${releases.length} found):\n\n` +
                  releases.map(release => 
                    `• ${release.tag_name}: ${release.name}\n` +
                    `  ID: ${release.id}\n` +
                    `  Draft: ${release.draft ? 'Yes' : 'No'}\n` +
                    `  Prerelease: ${release.prerelease ? 'Yes' : 'No'}\n` +
                    `  Assets: ${release.assets}\n` +
                    `  Created: ${release.created}\n` +
                    `  Published: ${release.published}\n` +
                    `  URL: ${release.url}`
                  ).join('\n\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get releases: ${error.message}`);
    }
  }

  async createGitHubRelease(args) {
    await this.initializeGitHub();
    const { owner, repo, tag_name, target_commitish = 'main', name, body, draft = false, prerelease = false } = args;

    try {
      const params = {
        owner,
        repo,
        tag_name,
        target_commitish,
        draft,
        prerelease,
      };

      if (name) params.name = name;
      if (body) params.body = body;

      const { data } = await this.github.rest.repos.createRelease(params);

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Release created successfully!\n\n` +
                  `• Tag: ${data.tag_name}\n` +
                  `• Name: ${data.name}\n` +
                  `• Draft: ${data.draft ? 'Yes' : 'No'}\n` +
                  `• Prerelease: ${data.prerelease ? 'Yes' : 'No'}\n` +
                  `• URL: ${data.html_url}`,
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to create release: ${error.message}`);
    }
  }

  // Stargazer operations
  async getGitHubStargazers(args) {
    await this.initializeGitHub();
    const { owner, repo, per_page = 30 } = args;

    try {
      const { data } = await this.github.rest.activity.listStargazersForRepo({
        owner,
        repo,
        per_page,
      });

      const stargazers = data.map(user => ({
        login: user.login,
        name: user.name || 'Not set',
        company: user.company || 'Not set',
        location: user.location || 'Not set',
        followers: user.followers,
        following: user.following,
        public_repos: user.public_repos,
        url: user.html_url,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Stargazers for ${owner}/${repo} (${stargazers.length} found):\n\n` +
                  stargazers.map(user => 
                    `• ${user.login}\n` +
                    `  Name: ${user.name}\n` +
                    `  Company: ${user.company}\n` +
                    `  Location: ${user.location}\n` +
                    `  Followers: ${user.followers} | Following: ${user.following}\n` +
                    `  Public Repos: ${user.public_repos}\n` +
                    `  URL: ${user.url}`
                  ).join('\n\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get stargazers: ${error.message}`);
    }
  }

  // Fork operations
  async getGitHubForks(args) {
    await this.initializeGitHub();
    const { owner, repo, per_page = 30 } = args;

    try {
      const { data } = await this.github.rest.repos.listForks({
        owner,
        repo,
        per_page,
      });

      const forks = data.map(fork => ({
        name: fork.name,
        full_name: fork.full_name,
        owner: fork.owner.login,
        description: fork.description || 'No description',
        language: fork.language || 'Unknown',
        stars: fork.stargazers_count,
        forks: fork.forks_count,
        created: new Date(fork.created_at).toLocaleString(),
        updated: new Date(fork.updated_at).toLocaleString(),
        url: fork.html_url,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Forks for ${owner}/${repo} (${forks.length} found):\n\n` +
                  forks.map(fork => 
                    `• ${fork.full_name}\n` +
                    `  Owner: ${fork.owner}\n` +
                    `  Description: ${fork.description}\n` +
                    `  Language: ${fork.language}\n` +
                    `  Stars: ${fork.stars} | Forks: ${fork.forks}\n` +
                    `  Created: ${fork.created}\n` +
                    `  Updated: ${fork.updated}\n` +
                    `  URL: ${fork.url}`
                  ).join('\n\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to get forks: ${error.message}`);
    }
  }

  // Search operations
  async searchGitHubRepositories(args) {
    await this.initializeGitHub();
    const { query, sort = 'stars', order = 'desc', per_page = 30 } = args;

    try {
      const { data } = await this.github.rest.search.repos({
        q: query,
        sort,
        order,
        per_page,
      });

      const repos = data.items.map(repo => ({
        name: repo.name,
        full_name: repo.full_name,
        description: repo.description || 'No description',
        language: repo.language || 'Unknown',
        stars: repo.stargazers_count,
        forks: repo.forks_count,
        updated: new Date(repo.updated_at).toLocaleString(),
        url: repo.html_url,
        private: repo.private,
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Repository search results for "${query}" (${repos.length} found):\n\n` +
                  repos.map(repo => 
                    `• ${repo.full_name} ${repo.private ? '(Private)' : ''}\n` +
                    `  Description: ${repo.description}\n` +
                    `  Language: ${repo.language}\n` +
                    `  Stars: ${repo.stars} | Forks: ${repo.forks}\n` +
                    `  Updated: ${repo.updated}\n` +
                    `  URL: ${repo.url}`
                  ).join('\n\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to search repositories: ${error.message}`);
    }
  }

  async searchGitHubIssues(args) {
    await this.initializeGitHub();
    const { query, sort = 'updated', order = 'desc', per_page = 30 } = args;

    try {
      const { data } = await this.github.rest.search.issuesAndPullRequests({
        q: query,
        sort,
        order,
        per_page,
      });

      const issues = data.items.map(issue => ({
        number: issue.number,
        title: issue.title,
        state: issue.state,
        labels: issue.labels.map(label => label.name),
        assignees: issue.assignees.map(assignee => assignee.login),
        created: new Date(issue.created_at).toLocaleString(),
        updated: new Date(issue.updated_at).toLocaleString(),
        url: issue.html_url,
        user: issue.user.login,
        repository: issue.repository_url.split('/').slice(-2).join('/'),
      }));

      return {
        content: [
          {
            type: 'text',
            text: `⚫ Issue search results for "${query}" (${issues.length} found):\n\n` +
                  issues.map(issue => 
                    `• #${issue.number}: ${issue.title}\n` +
                    `  Repository: ${issue.repository}\n` +
                    `  State: ${issue.state}\n` +
                    `  Labels: ${issue.labels.join(', ') || 'None'}\n` +
                    `  Assignees: ${issue.assignees.join(', ') || 'None'}\n` +
                    `  Author: ${issue.user}\n` +
                    `  Created: ${issue.created}\n` +
                    `  Updated: ${issue.updated}\n` +
                    `  URL: ${issue.url}`
                  ).join('\n\n'),
          },
        ],
      };
    } catch (error) {
      throw new Error(`Failed to search issues: ${error.message}`);
    }
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.log('⚫ Shadow GitHub MCP Server running...');
  }
}

const server = new GitHubMCPServer();
server.run().catch(console.error);

