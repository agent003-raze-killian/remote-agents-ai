#!/usr/bin/env node

/**
 * Git Push with Auto-Announcement
 * Pushes to Git and announces to Slack
 * Usage: npm run git-push-announce <branch> [message]
 */

import 'dotenv/config';
import { execSync } from 'child_process';
import { GitHubAnnouncer } from './lib/github-announcer.js';

const args = process.argv.slice(2);
const branch = args[0] || 'Agent006-Echo';
const additionalMessage = args.slice(1).join(' ');

console.log(`⚡ Echo Git Push & Announce\n`);
console.log(`📤 Pushing to branch: ${branch}\n`);

try {
  // Push to Git
  console.log('🚀 Pushing to GitHub...');
  const output = execSync(`git push origin ${branch}`, { encoding: 'utf8' });
  console.log(output);
  console.log('✅ Push successful!\n');

  // Announce to Slack
  console.log('📢 Announcing to Slack...');
  const announcer = new GitHubAnnouncer(
    process.env.SLACK_BOT_TOKEN,
    process.env.ECHO_CHANNEL_ID || 'C09MFH9JTK5'
  );

  await announcer.announcePush(branch, additionalMessage);
  
  console.log('\n🎉 Done! Push complete and announced!');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}

