import { Octokit } from '@octokit/rest';
import { Tool } from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';

/**
 * GITHUB TOOLS MODULE ⚔️
 * 
 * Military-grade GitHub operations for APEX Agent
 * Handles PRs, code reviews, security scanning, and repository management
 */
export class GitHubTools {
  private octokit: Octokit;

  constructor() {
    const token = process.env.GITHUB_TOKEN;
    if (!token) {
      throw new Error('⚔️ GITHUB_TOKEN environment variable required for APEX operations');
    }

    this.octokit = new Octokit({
      auth: token,
      userAgent: 'APEX-Agent-MCP/1.0.0',
    });
  }

  getTools(): Tool[] {
    return [
      {
        name: 'github_create_pr',
        description: 'Create a pull request with military precision and security focus',
        inputSchema: {
          type: 'object',
          properties: {
            title: { type: 'string', description: 'PR title' },
            body: { type: 'string', description: 'PR description' },
            head: { type: 'string', description: 'Source branch' },
            base: { type: 'string', description: 'Target branch' },
            owner: { type: 'string', description: 'Repository owner' },
            repo: { type: 'string', description: 'Repository name' },
            draft: { type: 'boolean', description: 'Create as draft PR' },
          },
          required: ['title', 'head', 'base', 'owner', 'repo'],
        },
      },
      {
        name: 'github_review_code',
        description: 'Perform security-focused code review on a pull request',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: 'Repository owner' },
            repo: { type: 'string', description: 'Repository name' },
            pull_number: { type: 'number', description: 'Pull request number' },
            event: { type: 'string', enum: ['APPROVE', 'REQUEST_CHANGES', 'COMMENT'] },
            body: { type: 'string', description: 'Review comment' },
          },
          required: ['owner', 'repo', 'pull_number', 'event'],
        },
      },
      {
        name: 'github_security_scan',
        description: 'Perform automated security vulnerability scanning',
        inputSchema: {
          type: 'object',
          properties: {
            owner: { type: 'string', description: 'Repository owner' },
            repo: { type: 'string', description: 'Repository name' },
            severity: { type: 'string', enum: ['low', 'moderate', 'high', 'critical'] },
          },
          required: ['owner', 'repo'],
        },
      },
      {
        name: 'github_manage_branches',
        description: 'Create, delete, or manage repository branches',
        inputSchema: {
          type: 'object',
          properties: {
            action: { type: 'string', enum: ['create', 'delete', 'list', 'protect'] },
            owner: { type: 'string', description: 'Repository owner' },
            repo: { type: 'string', description: 'Repository name' },
            branch: { type: 'string', description: 'Branch name' },
            from_branch: { type: 'string', description: 'Source branch for creation' },
          },
          required: ['action', 'owner', 'repo'],
        },
      },
      {
        name: 'github_search_code',
        description: 'Advanced code search with security focus',
        inputSchema: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search query' },
            owner: { type: 'string', description: 'Repository owner' },
            repo: { type: 'string', description: 'Repository name' },
            language: { type: 'string', description: 'Programming language' },
            path: { type: 'string', description: 'File path filter' },
          },
          required: ['query'],
        },
      },
    ];
  }

  async executeTool(name: string, args: any): Promise<any> {
    switch (name) {
      case 'github_create_pr':
        return await this.createPullRequest(args);
      case 'github_review_code':
        return await this.reviewCode(args);
      case 'github_security_scan':
        return await this.securityScan(args);
      case 'github_manage_branches':
        return await this.manageBranches(args);
      case 'github_search_code':
        return await this.searchCode(args);
      default:
        throw new Error(`Unknown GitHub tool: ${name}`);
    }
  }

  private async createPullRequest(args: any): Promise<any> {
    const schema = z.object({
      title: z.string(),
      body: z.string().optional(),
      head: z.string(),
      base: z.string(),
      owner: z.string(),
      repo: z.string(),
      draft: z.boolean().optional(),
    });

    const { title, body, head, base, owner, repo, draft } = schema.parse(args);

    const pr = await this.octokit.rest.pulls.create({
      owner,
      repo,
      title,
      body: body || `⚔️ APEX PR: ${title}\n\nMilitary-grade implementation ready for review.`,
      head,
      base,
      draft: draft || false,
    });

    return {
      success: true,
      pr_number: pr.data.number,
      pr_url: pr.data.html_url,
      message: `⚔️ PR #${pr.data.number} created with military precision! Ready for battle. 💪`,
    };
  }

  private async reviewCode(args: any): Promise<any> {
    const schema = z.object({
      owner: z.string(),
      repo: z.string(),
      pull_number: z.number(),
      event: z.enum(['APPROVE', 'REQUEST_CHANGES', 'COMMENT']),
      body: z.string().optional(),
    });

    const { owner, repo, pull_number, event, body } = schema.parse(args);

    const review = await this.octokit.rest.pulls.createReview({
      owner,
      repo,
      pull_number,
      event,
      body: body || `⚔️ APEX SECURITY REVIEW\n\n${event === 'APPROVE' ? '✅ APPROVED - Fortress secure!' : '⚠️ CHANGES REQUIRED - Security protocols need attention.'}`,
    });

    return {
      success: true,
      review_id: review.data.id,
      message: `⚔️ Security review ${event.toLowerCase()}d! APEX has spoken. 💪`,
    };
  }

  private async securityScan(args: any): Promise<any> {
    const schema = z.object({
      owner: z.string(),
      repo: z.string(),
      severity: z.enum(['low', 'moderate', 'high', 'critical']).optional(),
    });

    const { owner, repo, severity } = schema.parse(args);

    // Get repository alerts
    const alerts = await this.octokit.rest.dependabot.listAlertsForRepo({
      owner,
      repo,
      state: 'open',
      severity: severity as any,
    });

    const vulnerabilities = alerts.data.map((alert: any) => ({
      number: alert.number,
      severity: alert.security_advisory.severity,
      summary: alert.security_advisory.summary,
      description: alert.security_advisory.description,
      package: alert.dependency.package.name,
      ecosystem: alert.dependency.package.ecosystem,
    }));

    return {
      success: true,
      vulnerabilities_found: vulnerabilities.length,
      vulnerabilities,
      message: `⚔️ Security scan complete! Found ${vulnerabilities.length} vulnerabilities. Fortress status: ${vulnerabilities.length === 0 ? 'SECURE' : 'COMPROMISED'}`,
    };
  }

  private async manageBranches(args: any): Promise<any> {
    const schema = z.object({
      action: z.enum(['create', 'delete', 'list', 'protect']),
      owner: z.string(),
      repo: z.string(),
      branch: z.string().optional(),
      from_branch: z.string().optional(),
    });

    const { action, owner, repo, branch, from_branch } = schema.parse(args);

    switch (action) {
      case 'create':
        if (!branch || !from_branch) {
          throw new Error('Branch name and source branch required for creation');
        }
        
        const ref = await this.octokit.rest.git.createRef({
          owner,
          repo,
          ref: `refs/heads/${branch}`,
          sha: (await this.octokit.rest.git.getRef({
            owner,
            repo,
            ref: `heads/${from_branch}`,
          })).data.object.sha,
        });

        return {
          success: true,
          branch: branch,
          message: `⚔️ Branch '${branch}' created with military precision! Ready for deployment. 💪`,
        };

      case 'list':
        const branches = await this.octokit.rest.repos.listBranches({
          owner,
          repo,
        });

        return {
          success: true,
          branches: branches.data.map((b: any) => ({
            name: b.name,
            protected: b.protected,
            commit_sha: b.commit.sha,
          })),
          message: `⚔️ Branch reconnaissance complete! Found ${branches.data.length} branches.`,
        };

      default:
        throw new Error(`Branch action '${action}' not implemented yet`);
    }
  }

  private async searchCode(args: any): Promise<any> {
    const schema = z.object({
      query: z.string(),
      owner: z.string().optional(),
      repo: z.string().optional(),
      language: z.string().optional(),
      path: z.string().optional(),
    });

    const { query, owner, repo, language, path } = schema.parse(args);

    let searchQuery = query;
    if (owner) searchQuery += ` repo:${owner}/${repo || '*'}`;
    if (language) searchQuery += ` language:${language}`;
    if (path) searchQuery += ` path:${path}`;

    const results = await this.octokit.rest.search.code({
      q: searchQuery,
      sort: 'indexed',
      order: 'desc',
    });

    const codeResults = results.data.items.map((item: any) => ({
      name: item.name,
      path: item.path,
      repository: item.repository.full_name,
      html_url: item.html_url,
      language: item.language,
      score: item.score,
    }));

    return {
      success: true,
      total_count: results.data.total_count,
      results: codeResults,
      message: `⚔️ Code search complete! Found ${results.data.total_count} results. Target acquired. 💪`,
    };
  }
}
