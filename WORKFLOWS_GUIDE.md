# 🔍 GitHub Workflows Monitoring Guide

## 📊 Your Active Workflows

You have **3 automated workflows** that run on your repository:

### 1. **CI/CD Pipeline** (`ci.yml`)
**Purpose**: Validates code quality, builds, and tests

**Jobs**:
- ✅ **Lint & Type Check** - Validates TypeScript code syntax and types
- ✅ **Build & Test** - Builds the app and tests database connection
- ✅ **Docker Build Test** - Validates Docker configuration
- ✅ **Security Audit** - Runs npm audit for vulnerabilities

**Triggers**:
- Every push to `main` or `develop` branch
- Every pull request to `main` or `develop`

**Typical Duration**: 3-5 minutes

---

### 2. **Security Scan** (`security.yml`)
**Purpose**: Comprehensive security analysis

**Jobs**:
- ✅ **CodeQL Analysis** - Detects security vulnerabilities in code
- ✅ **Dependency Review** - Checks dependencies (PR only)
- ✅ **Trivy Container Scan** - Scans Docker images for vulnerabilities
- ✅ **NPM Audit** - Checks npm packages for known issues
- ✅ **Gitleaks** - Prevents secrets from being committed
- ✅ **OWASP Dependency Check** - Industry-standard security checks

**Triggers**:
- Every push to `main` or `develop` branch
- Every pull request to `main` or `develop`
- **Daily at 2:00 AM UTC** (scheduled scan)

**Typical Duration**: 5-10 minutes

---

### 3. **Docker Image CI** (`docker.yml`)
**Purpose**: Builds and publishes Docker images

**Jobs**:
- ✅ **Build and Push Docker Image** - Multi-platform build (amd64, arm64)
- ✅ **Security Scan** - Scans published images with Trivy

**Triggers**:
- Every push to `main` branch
- Version tags (e.g., `v1.0.0`, `v2.1.3`)
- Pull requests to `main` (build only, no push)

**Typical Duration**: 5-8 minutes

**Published To**: `ghcr.io/itemuln/vegeta_gym`

---

## 🎯 How to Check Workflow Status

### Method 1: GitHub Actions Tab (Web)

1. **Open your repository**
   ```bash
   open https://github.com/itemuln/vegeta_gym
   ```

2. **Click on "Actions" tab**
   ```bash
   open https://github.com/itemuln/vegeta_gym/actions
   ```

3. **You'll see**:
   - ✅ Green checkmark = All tests passed
   - ❌ Red X = Tests failed
   - 🟡 Yellow circle = Currently running
   - ⚪ Gray circle = Queued/waiting

### Method 2: Commit Status (Web)

1. **Go to your commits**
   ```bash
   open https://github.com/itemuln/vegeta_gym/commits/main
   ```

2. **Look at each commit**:
   - ✅ Green checkmark next to commit = All workflows passed
   - ❌ Red X = Some workflow failed
   - 🟡 Yellow dot = Running

3. **Click the icon** to see detailed workflow results

### Method 3: Command Line (GitHub CLI)

Install GitHub CLI first:
```bash
brew install gh
gh auth login
```

Then check workflow status:
```bash
# List recent workflow runs
gh run list

# View specific workflow run
gh run view

# Watch a running workflow
gh run watch
```

### Method 4: Email Notifications

GitHub automatically sends emails when:
- ❌ Workflow fails on your push
- ✅ Workflow succeeds after previous failure
- You're mentioned in workflow comments

---

## ✅ What "Passing" Means

### CI/CD Pipeline Passes When:
1. ✅ TypeScript code has no type errors
2. ✅ Application builds successfully
3. ✅ Database connection works
4. ✅ Docker configuration is valid
5. ✅ No critical npm vulnerabilities

### Security Scan Passes When:
1. ✅ No security vulnerabilities found in code
2. ✅ No high/critical vulnerabilities in dependencies
3. ✅ No secrets detected in commits
4. ✅ Container images have no critical CVEs
5. ✅ All dependencies are reviewed (on PRs)

### Docker Build Passes When:
1. ✅ Docker image builds successfully
2. ✅ Multi-platform build works (amd64 & arm64)
3. ✅ Image security scan passes
4. ✅ Image pushed to registry (on main branch)

---

## ❌ What If a Workflow Fails?

### Step 1: Identify the Failed Job

1. Go to Actions tab: https://github.com/itemuln/vegeta_gym/actions
2. Click on the failed workflow (red X)
3. Click on the failed job name
4. Review the error logs

### Step 2: Common Failures and Solutions

#### **TypeScript Type Errors**
```
Error: Type 'string' is not assignable to type 'number'
```

**Solution**:
```bash
# Run locally first
npm run check

# Fix the type errors
# Then commit and push
```

#### **Build Failures**
```
Error: Module not found
```

**Solution**:
```bash
# Install dependencies
npm install

# Try building locally
npm run build

# Fix any errors, then push
```

#### **Security Vulnerabilities**
```
found 3 high severity vulnerabilities
```

**Solution**:
```bash
# Check vulnerabilities
npm audit

# Fix automatically (if possible)
npm audit fix

# Or update specific package
npm update <package-name>

# Commit and push
```

#### **Docker Build Errors**
```
Error: failed to solve with frontend dockerfile.v0
```

**Solution**:
```bash
# Test Docker build locally
docker build -t test .

# Fix Dockerfile
# Then commit and push
```

#### **Database Connection Issues**
```
Error: relation "users" does not exist
```

**Solution**: Usually fixed automatically by workflow, but check:
- Database schema is correct in `shared/schema.ts`
- Migrations are up to date

---

## 🔧 Debugging Failed Workflows

### View Detailed Logs

1. **Click on failed workflow run**
2. **Click on failed job**
3. **Expand the failed step** (red X)
4. **Read the error message and stack trace**

### Re-run Failed Workflows

1. **Go to failed workflow run**
2. **Click "Re-run jobs" button** (top right)
3. **Select "Re-run failed jobs"**

### Run Workflows Manually

Some workflows can be triggered manually:

1. Go to Actions tab
2. Select workflow
3. Click "Run workflow" button
4. Choose branch
5. Click green "Run workflow" button

---

## 📧 Setting Up Notifications

### Email Notifications (Default)

Already enabled! You'll get emails for:
- ❌ Workflow failures on your commits
- ✅ Fixed workflows after previous failures

### Slack Notifications (Optional)

Add to your workflow:
```yaml
- name: Slack Notification
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Discord Notifications (Optional)

Add to your workflow:
```yaml
- name: Discord Notification
  if: failure()
  uses: sarisia/actions-status-discord@v1
  with:
    webhook: ${{ secrets.DISCORD_WEBHOOK }}
```

---

## 📊 Workflow Status Badges

### Add Badges to README

Add these to the top of your `README.md`:

```markdown
[![CI/CD Pipeline](https://github.com/itemuln/vegeta_gym/actions/workflows/ci.yml/badge.svg)](https://github.com/itemuln/vegeta_gym/actions/workflows/ci.yml)
[![Security Scan](https://github.com/itemuln/vegeta_gym/actions/workflows/security.yml/badge.svg)](https://github.com/itemuln/vegeta_gym/actions/workflows/security.yml)
[![Docker Build](https://github.com/itemuln/vegeta_gym/actions/workflows/docker.yml/badge.svg)](https://github.com/itemuln/vegeta_gym/actions/workflows/docker.yml)
```

**Result**:
- ✅ Passing = Green badge
- ❌ Failing = Red badge
- 🟡 Running = Yellow badge

---

## 🚨 Handling Critical Failures

### Security Vulnerabilities Found

**High Priority Issues**:
1. Review the security report
2. Update vulnerable dependencies: `npm audit fix`
3. If auto-fix doesn't work, manually update in `package.json`
4. Test locally
5. Commit and push

**Can't Fix Immediately?**:
- Check if vulnerability affects your usage
- Create an issue to track it
- Consider using `npm audit --audit-level=critical` to only fail on critical issues

### Docker Build Fails

**Common causes**:
1. Missing dependencies in `package.json`
2. Build errors not caught locally
3. Platform-specific issues

**Solution**:
```bash
# Test Docker build locally
docker build -t vegeta-gym:test .

# Test with compose
docker compose build

# If it works locally but fails in CI, check:
# - .dockerignore file
# - Environment variables
# - Platform differences
```

---

## 📈 Workflow Performance Tips

### Speed Up Workflows

1. **Cache Dependencies**
   - Already enabled with `cache: 'npm'`

2. **Skip Workflows on Docs Changes**
   ```yaml
   on:
     push:
       paths-ignore:
         - '**.md'
         - 'docs/**'
   ```

3. **Parallel Jobs**
   - Already configured - jobs run in parallel

4. **Skip CI** (when needed)
   ```bash
   git commit -m "docs: Update README [skip ci]"
   ```

---

## 🎯 Quick Reference Commands

```bash
# Check workflow status
open https://github.com/itemuln/vegeta_gym/actions

# View specific commit's checks
open https://github.com/itemuln/vegeta_gym/commits/main

# Test locally before pushing
npm run check          # TypeScript check
npm run build          # Build test
npm audit              # Security check
docker build -t test . # Docker test

# Push and watch
git push
open https://github.com/itemuln/vegeta_gym/actions
```

---

## 🔍 Understanding Workflow Results

### ✅ All Green - Perfect!
- All checks passed
- Safe to merge PR
- Code is production-ready
- No security issues

### 🟡 Yellow - In Progress
- Workflow currently running
- Wait for completion
- Usually takes 3-10 minutes

### ❌ Red - Action Required
- Something failed
- Review error logs
- Fix the issue
- Push changes again

### ⚪ Gray - Queued or Skipped
- Waiting to run
- Or intentionally skipped
- Check if workflows are enabled

---

## 📞 Getting Help

### Workflow Fails and Can't Fix?

1. **Check Logs**
   - Actions tab → Failed run → Expand steps
   
2. **Search Error Message**
   - Google the exact error
   - Check GitHub Actions documentation

3. **Ask for Help**
   - Create issue with error logs
   - Include workflow run link

4. **Temporary Fix**
   - Can disable workflow by renaming file
   - Example: `ci.yml` → `ci.yml.disabled`

---

## 🎓 Pro Tips

1. **Always test locally first**
   ```bash
   npm run check && npm run build && npm audit
   ```

2. **Use branch protection**
   - Require workflow to pass before merging
   - Settings → Branches → Add rule

3. **Monitor security alerts**
   - Security tab shows all vulnerabilities
   - Dependabot creates PRs to fix them

4. **Review workflow runs weekly**
   - Check for patterns in failures
   - Optimize slow workflows

---

## 📊 Current Workflow Status

**Check Now**:
```bash
open https://github.com/itemuln/vegeta_gym/actions
```

**Your workflows should show**:
- CI/CD Pipeline: Last run status
- Security Scan: Last run status + next scheduled run
- Docker Image CI: Last run status

---

**🎉 You're all set! Your workflows are actively protecting your code quality and security.**

For real-time status, bookmark: https://github.com/itemuln/vegeta_gym/actions
