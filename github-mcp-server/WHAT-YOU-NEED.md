# 🎯 What You Need for GitHub MCP

## TL;DR - One Thing You Need:

**GitHub Personal Access Token** (starts with `ghp_` or `github_pat_`)

That's it! Just one token. 🎉

---

## 📝 How to Get Your GitHub Token (5 minutes):

### Step 1: Go to GitHub Settings
1. Go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
2. Or: Click your profile picture → Settings → Developer settings → Personal access tokens → Tokens (classic)

### Step 2: Generate New Token
1. Click **"Generate new token"** → **"Generate new token (classic)"**
2. Give it a name: `Cursor MCP - Kira Bot`
3. Set expiration: Choose what you prefer (I recommend 90 days or No expiration)

### Step 3: Select Permissions (Scopes)

**Check these boxes:**

✅ **repo** (Full control of repositories)
- ✅ repo:status
- ✅ repo_deployment  
- ✅ public_repo
- ✅ repo:invite
- ✅ security_events

✅ **workflow** (Update GitHub Action workflows)

✅ **write:packages** (Upload packages)

✅ **delete:packages** (Delete packages)

✅ **admin:org** (if you work with organizations)
- ✅ read:org
- ✅ write:org

✅ **gist** (Create gists)

✅ **user** (Update user data)
- ✅ read:user
- ✅ user:email

### Step 4: Generate and Copy
1. Click **"Generate token"** at the bottom
2. **⚠️ COPY THE TOKEN NOW!** You won't see it again!
3. It looks like: `ghp_1234567890abcdefghijklmnopqrstuvwxyz`

---

## ✅ What This Token Lets You Do:

With this token, GHOST (Kira) can:
- ✅ Create/update repositories
- ✅ Manage issues and pull requests
- ✅ Push code and commits
- ✅ Create branches
- ✅ Review PRs
- ✅ Manage GitHub Actions
- ✅ Create gists
- ✅ And much more!

---

## 🔒 Security Notes:

- ✅ **Never commit this token to Git**
- ✅ Keep it in `.env` file (already in `.gitignore`)
- ✅ You can revoke it anytime from GitHub settings
- ✅ Treat it like a password

---

## 📋 Quick Checklist:

- [ ] Go to [https://github.com/settings/tokens](https://github.com/settings/tokens)
- [ ] Generate new token (classic)
- [ ] Select all the scopes above
- [ ] Copy the token
- [ ] Paste it in `.env` file

---

**That's all you need!** Much simpler than Slack (only 1 token instead of 2)! 🎉

Ready to set it up? Let's go! 👻✨

