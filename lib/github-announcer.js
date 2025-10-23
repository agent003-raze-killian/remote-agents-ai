import { WebClient } from '@slack/web-api';
import { execSync } from 'child_process';

/**
 * GitHub Announcer for Echo Agent
 * Automatically announces GitHub activities to Slack
 */
export class GitHubAnnouncer {
  constructor(slackToken, channelId) {
    this.slack = new WebClient(slackToken);
    this.channelId = channelId;
    this.lastCommit = null;
  }

  /**
   * Get current branch name
   */
  getCurrentBranch() {
    try {
      return execSync('git branch --show-current').toString().trim();
    } catch (error) {
      return 'unknown';
    }
  }

  /**
   * Get latest commit info
   */
  getLatestCommit() {
    try {
      const hash = execSync('git rev-parse --short HEAD').toString().trim();
      const message = execSync('git log -1 --pretty=%B').toString().trim();
      const author = execSync('git log -1 --pretty=%an').toString().trim();
      const date = execSync('git log -1 --pretty=%ar').toString().trim();
      
      return { hash, message, author, date };
    } catch (error) {
      return null;
    }
  }

  /**
   * Get commit statistics
   */
  getCommitStats() {
    try {
      const stats = execSync('git diff --shortstat HEAD~1 HEAD').toString().trim();
      return stats || 'No changes';
    } catch (error) {
      return 'Stats unavailable';
    }
  }

  /**
   * Announce push to Slack
   */
  async announcePush(branch = null, additionalInfo = '') {
    const currentBranch = branch || this.getCurrentBranch();
    const commit = this.getLatestCommit();
    const stats = this.getCommitStats();

    if (!commit) {
      console.log('⚠️ No commit info available for announcement');
      return;
    }

    const message = `⚡ **PUSH COMPLETE!** ⚡

🚀 **Branch:** \`${currentBranch}\`
📦 **Commit:** \`${commit.hash}\`
💬 **Message:** ${commit.message}
👤 **By:** ${commit.author}
🕐 **When:** ${commit.date}
📊 **Changes:** ${stats}

${additionalInfo ? `💡 **Note:** ${additionalInfo}\n` : ''}✅ All changes pushed successfully! Let's gooo! 🔥`;

    try {
      await this.slack.chat.postMessage({
        channel: this.channelId,
        text: message,
        username: "Echo Agent006",
        icon_emoji: ":zap:"
      });
      
      console.log('✅ Push announcement sent to Slack!');
    } catch (error) {
      console.error('❌ Failed to send push announcement:', error.message);
    }
  }

  /**
   * Announce pull to Slack
   */
  async announcePull(branch = null, changesCount = 0) {
    const currentBranch = branch || this.getCurrentBranch();
    const commit = this.getLatestCommit();

    const message = `⬇️ **PULL COMPLETE!** ⬇️

🚀 **Branch:** \`${currentBranch}\`
📦 **Latest Commit:** \`${commit?.hash || 'unknown'}\`
${changesCount > 0 ? `🔄 **Changes Pulled:** ${changesCount} commits\n` : ''}
✅ Local repository updated! Ready to rock! 🎉`;

    try {
      await this.slack.chat.postMessage({
        channel: this.channelId,
        text: message,
        username: "Echo Agent006",
        icon_emoji: ":zap:"
      });
      
      console.log('✅ Pull announcement sent to Slack!');
    } catch (error) {
      console.error('❌ Failed to send pull announcement:', error.message);
    }
  }

  /**
   * Announce task completion to Slack
   */
  async announceTaskComplete(taskName, details = {}) {
    const { 
      description = '', 
      filesChanged = 0, 
      linesAdded = 0, 
      linesRemoved = 0,
      duration = '',
      highlights = []
    } = details;

    let message = `🎉 **TASK COMPLETED!** 🎉

✨ **Task:** ${taskName}
${description ? `📝 **Description:** ${description}\n` : ''}`;

    if (filesChanged > 0) {
      message += `\n📊 **Changes:**\n`;
      message += `• ${filesChanged} files modified\n`;
      if (linesAdded > 0) message += `• ${linesAdded} insertions\n`;
      if (linesRemoved > 0) message += `• ${linesRemoved} deletions\n`;
    }

    if (highlights.length > 0) {
      message += `\n💡 **Highlights:**\n`;
      highlights.forEach(h => {
        message += `• ${h}\n`;
      });
    }

    if (duration) {
      message += `\n⏱️ **Duration:** ${duration}`;
    }

    message += `\n\n✅ **Status:** Complete and deployed!\n🚀 Let's gooo! Mission accomplished! 💪⚡`;

    try {
      await this.slack.chat.postMessage({
        channel: this.channelId,
        text: message,
        username: "Echo Agent006",
        icon_emoji: ":zap:"
      });
      
      console.log('✅ Task completion announcement sent to Slack!');
    } catch (error) {
      console.error('❌ Failed to send task completion announcement:', error.message);
    }
  }

  /**
   * Announce merge to Slack
   */
  async announceMerge(sourceBranch, targetBranch, conflictsResolved = 0) {
    const commit = this.getLatestCommit();

    const message = `🔀 **MERGE COMPLETE!** 🔀

🚀 **From:** \`${sourceBranch}\` → **To:** \`${targetBranch}\`
📦 **Merge Commit:** \`${commit?.hash || 'unknown'}\`
${conflictsResolved > 0 ? `⚠️ **Conflicts Resolved:** ${conflictsResolved}\n` : ''}
✅ Branches merged successfully! Ready to deploy! 🎯`;

    try {
      await this.slack.chat.postMessage({
        channel: this.channelId,
        text: message,
        username: "Echo Agent006",
        icon_emoji: ":zap:"
      });
      
      console.log('✅ Merge announcement sent to Slack!');
    } catch (error) {
      console.error('❌ Failed to send merge announcement:', error.message);
    }
  }

  /**
   * Announce deployment to Slack
   */
  async announceDeployment(environment, status = 'success', details = '') {
    const emoji = status === 'success' ? '✅' : '⚠️';
    const statusText = status === 'success' ? 'DEPLOYED' : 'DEPLOYMENT ISSUE';

    const message = `${emoji} **${statusText}!** ${emoji}

🌍 **Environment:** ${environment}
📦 **Status:** ${status.toUpperCase()}
${details ? `📝 **Details:** ${details}\n` : ''}
${status === 'success' ? '🚀 Live and ready to rock! Let\'s gooo! 🔥' : '⚠️ Check logs for details'}`;

    try {
      await this.slack.chat.postMessage({
        channel: this.channelId,
        text: message,
        username: "Echo Agent006",
        icon_emoji: status === 'success' ? ':zap:' : ':warning:'
      });
      
      console.log('✅ Deployment announcement sent to Slack!');
    } catch (error) {
      console.error('❌ Failed to send deployment announcement:', error.message);
    }
  }

  /**
   * Monitor git status and announce changes
   */
  async monitorAndAnnounce() {
    const currentCommit = this.getLatestCommit();
    
    // Check if commit changed (new push/pull)
    if (this.lastCommit && currentCommit && this.lastCommit.hash !== currentCommit.hash) {
      console.log('🔔 Git change detected! Announcing...');
      await this.announcePush();
    }
    
    this.lastCommit = currentCommit;
  }
}

