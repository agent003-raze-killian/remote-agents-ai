#!/usr/bin/env node

/**
 * Git Pull with Auto-Announcement
 * Pulls from Git and announces to Slack
 * Usage: npm run git-pull-announce [branch]
 */

import 'dotenv/config';
import { execSync } from 'child_process';
import { GitHubAnnouncer } from './lib/github-announcer.js';

const args = process.argv.slice(2);
const branch = args[0] || 'Agent006-Echo';

console.log(`⚡ Echo Git Pull & Announce\n`);
console.log(`⬇️ Pulling from branch: ${branch}\n`);

try {
  // Get current commit before pull
  const beforeCommit = execSync('git rev-parse HEAD').toString().trim();

  // Pull from Git
  console.log('⬇️ Pulling from GitHub...');
  const output = execSync(`git pull origin ${branch}`, { encoding: 'utf8' });
  console.log(output);

  // Get commit after pull
  const afterCommit = execSync('git rev-parse HEAD').toString().trim();

  // Count changes
  let changesCount = 0;
  if (beforeCommit !== afterCommit) {
    try {
      const commits = execSync(`git rev-list --count ${beforeCommit}..${afterCommit}`).toString().trim();
      changesCount = parseInt(commits);
    } catch (e) {
      changesCount = 0;
    }
  }

  console.log('✅ Pull successful!\n');

  // Announce to Slack if there were changes
  if (changesCount > 0) {
    console.log(`📢 Announcing ${changesCount} new commit(s) to Slack...`);
    const announcer = new GitHubAnnouncer(
      process.env.SLACK_BOT_TOKEN,
      process.env.ECHO_CHANNEL_ID || 'C09MFH9JTK5'
    );

    await announcer.announcePull(branch, changesCount);
    console.log('\n🎉 Done! Pull complete and announced!');
  } else {
    console.log('ℹ️ Already up to date - no announcement needed.');
  }
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

