import 'dotenv/config';
import { GitHubAnnouncer } from './lib/github-announcer.js';

const announcer = new GitHubAnnouncer(
  process.env.SLACK_BOT_TOKEN,
  process.env.ECHO_CHANNEL_ID || 'C09MFH9JTK5'
);

console.log('⚡ Announcing task completion...\n');

// Announce the installation package push
await announcer.announcePush('Agent006-Echo', 'Created complete installation package for easy deployment to other computers!');

// Announce task completion
await announcer.announceTaskComplete(
  'Echo Installation Package Creation',
  {
    description: 'Complete installation package with automated setup wizard and comprehensive documentation',
    filesChanged: 23,
    linesAdded: 5285,
    linesRemoved: 32,
    highlights: [
      'Created echo-installation-package/ folder (135 KB)',
      'Automated setup wizard (setup-echo.js)',
      '5 comprehensive documentation files',
      'Brief response mode (2-3 sentences max)',
      'Fixed duplicate response bug',
      'Auto-detecting bot ID on startup',
      'Ready to transfer to any computer!'
    ]
  }
);

console.log('\n✅ All announcements sent!');

