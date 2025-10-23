# 📢 GitHub Activity Announcements

Echo automatically announces GitHub activities to Slack to keep your team informed!

## 🚀 Features

Echo now announces:
- ✅ **Git Pushes** - When code is pushed to repository
- ✅ **Git Pulls** - When changes are pulled from repository
- ✅ **Task Completions** - When major tasks are finished
- ✅ **Merges** - When branches are merged
- ✅ **Deployments** - When code is deployed

## 📝 Usage

### Push with Auto-Announcement

Instead of regular `git push`, use:

```bash
npm run git-push <branch> [optional message]
```

**Examples:**
```bash
# Push to Agent006-Echo branch
npm run git-push Agent006-Echo

# Push with custom message
npm run git-push Agent006-Echo "Fixed critical bug in authentication"
```

### Pull with Auto-Announcement

Instead of regular `git pull`, use:

```bash
npm run git-pull [branch]
```

**Examples:**
```bash
# Pull from Agent006-Echo branch
npm run git-pull Agent006-Echo

# Pull from main branch
npm run git-pull main
```

### Announce Task Completion

When you finish a major task:

```bash
npm run announce-task
```

Or create a custom announcement:

```javascript
import { GitHubAnnouncer } from './lib/github-announcer.js';

const announcer = new GitHubAnnouncer(
  process.env.SLACK_BOT_TOKEN,
  process.env.ECHO_CHANNEL_ID
);

await announcer.announceTaskComplete(
  'Task Name',
  {
    description: 'What was accomplished',
    filesChanged: 10,
    linesAdded: 500,
    linesRemoved: 50,
    highlights: [
      'Feature 1 completed',
      'Bug 2 fixed',
      'Performance improved by 50%'
    ]
  }
);
```

## 🔧 Manual Usage

You can also use the `GitHubAnnouncer` class directly in your scripts:

```javascript
import 'dotenv/config';
import { GitHubAnnouncer } from './lib/github-announcer.js';

const announcer = new GitHubAnnouncer(
  process.env.SLACK_BOT_TOKEN,
  process.env.ECHO_CHANNEL_ID
);

// Announce a push
await announcer.announcePush('branch-name', 'Additional info');

// Announce a pull
await announcer.announcePull('branch-name', 5); // 5 = number of commits pulled

// Announce a merge
await announcer.announceMerge('feature-branch', 'main', 3); // 3 = conflicts resolved

// Announce deployment
await announcer.announceDeployment('production', 'success', 'v1.2.0');

// Announce task completion
await announcer.announceTaskComplete('Task Name', {
  description: 'Details...',
  filesChanged: 10,
  highlights: ['Feature 1', 'Feature 2']
});
```

## 📊 What Gets Announced

### Push Announcement Includes:
- 🚀 Branch name
- 📦 Commit hash
- 💬 Commit message
- 👤 Author name
- 🕐 Time ago
- 📊 Change statistics (files, insertions, deletions)

### Pull Announcement Includes:
- 🚀 Branch name
- 📦 Latest commit hash
- 🔄 Number of commits pulled

### Task Completion Includes:
- ✨ Task name
- 📝 Description
- 📊 Statistics (files changed, lines added/removed)
- 💡 Highlights/accomplishments
- ⏱️ Duration (optional)

## ⚙️ Configuration

Set these in your `.env` file:

```env
SLACK_BOT_TOKEN=xoxb-your-token-here
ECHO_CHANNEL_ID=C09MFH9JTK5
```

## 🎯 Best Practices

1. **Use `npm run git-push`** instead of regular `git push` to automatically notify your team
2. **Use `npm run git-pull`** to announce when you sync with remote changes
3. **Run `npm run announce-task`** after completing major features or milestones
4. Keep announcements informative but concise
5. Use highlights to emphasize key achievements

## 📱 Slack Notifications

All announcements appear in your configured Slack channel with:
- ⚡ Echo Agent006 as the sender
- 🎯 Clear formatting and emojis
- 📊 Relevant statistics and details
- 🚀 Energetic Echo personality!

## 🔄 Workflow Integration

### Regular Development:
```bash
# Make your changes
git add .
git commit -m "Your commit message"

# Push with announcement (instead of git push)
npm run git-push Agent006-Echo

# Pull updates with announcement (instead of git pull)
npm run git-pull Agent006-Echo
```

### After Major Tasks:
```bash
# Complete your work
git add .
git commit -m "Complete feature X"
npm run git-push Agent006-Echo "Feature X completed!"

# Announce the task completion
npm run announce-task
```

## 🎉 Benefits

- ✅ **Team Awareness** - Everyone knows what's happening
- ✅ **Automatic** - No manual Slack messages needed
- ✅ **Detailed** - Includes all relevant information
- ✅ **Consistent** - Standardized format for all announcements
- ✅ **Energetic** - Echo's signature style keeps team motivated!

## 🐛 Troubleshooting

**Issue:** Announcements not appearing in Slack
- Check `SLACK_BOT_TOKEN` in `.env`
- Verify `ECHO_CHANNEL_ID` is correct
- Ensure bot is invited to the channel

**Issue:** Git commands failing
- Make sure you're in a git repository
- Check you have git installed: `git --version`
- Verify you have push/pull permissions

**Issue:** Wrong channel
- Update `ECHO_CHANNEL_ID` in `.env`
- Restart the script

## 📚 Examples

### Complete Feature Workflow:

```bash
# 1. Create feature branch
git checkout -b feature/new-ui

# 2. Make changes
# ... code code code ...

# 3. Commit
git add .
git commit -m "Add new UI components"

# 4. Push with announcement
npm run git-push feature/new-ui "Added new UI components with dark mode!"

# 5. Announce completion
npm run announce-task
```

### Update from Remote:

```bash
# Pull latest changes with announcement
npm run git-pull Agent006-Echo

# If there were changes, team is notified automatically!
```

## 🚀 Let's Gooo!

Your team will love staying informed about all the action happening in the repo! Echo's got your back! ⚡

