# 🔧 Workflow Failure Diagnosis & Fixes

## 🚨 Based on your workflow configuration, here are the most likely failures and fixes:

---

## 1️⃣ **CI/CD Pipeline Failures**

### ❌ **Lint & Type Check Job**

**Most Common Issue**: TypeScript compilation errors

**How to diagnose**:
```bash
# Run locally to see the exact errors
npm ci
npm run check
```

**Common Fixes**:

**Problem A: Dependencies not installed**
```bash
# Solution: Install all dependencies
npm ci
```

**Problem B: TypeScript errors in code**
```bash
# Check for errors
npm run check

# Fix the errors shown, common issues:
# - Missing type definitions
# - Incorrect type usage
# - Missing imports
```

**Problem C: Node version mismatch**
- Workflow uses Node 20
- Make sure your code works with Node 20

---

### ❌ **Build & Test Job**

**Most Common Issue**: Build fails or database connection issues

**How to diagnose**:
```bash
# Test build locally
npm run build

# Check if drizzle-kit is available
npm run db:push
```

**Common Fixes**:

**Problem A: Build fails**
```bash
# Install dependencies first
npm ci

# Then try building
npm run build

# If still fails, check error messages for:
# - Missing dependencies
# - Import errors
# - Environment variable issues
```

**Problem B: Database schema push fails**
```bash
# This might fail in CI if drizzle-kit is not available
# Check that drizzle-kit is in dependencies, not just devDependencies
```

**Fix for drizzle-kit**:
The workflow installs ALL dependencies with `npm ci` (including dev deps), so this should work.
If it fails, check the error message in the workflow logs.

---

### ❌ **Docker Build Test Job**

**Most Common Issue**: Docker build fails

**How to diagnose**:
```bash
# Test Docker build locally
docker build -t test .

# Test Docker Compose config
docker compose config
```

**Common Fixes**:

**Problem A: Dockerfile syntax error**
- Check Dockerfile for any recent changes
- Make sure all COPY commands reference existing files

**Problem B: Build context issues**
```bash
# Make sure .dockerignore is correct
cat .dockerignore

# Test build with verbose output
docker build -t test . --progress=plain
```

**Problem C: Missing db/password.txt**
```bash
# The workflow might fail if it tries to COPY this file
# Solution: Make sure .dockerignore includes it OR
# Dockerfile doesn't require it
```

**Current Dockerfile Issue**:
Your Dockerfile copies everything with `COPY . .` - this is fine.
The db/password.txt should be in .dockerignore (it is).

---

### ❌ **Security Audit Job**

**Most Common Issue**: High/critical vulnerabilities found

**How to diagnose**:
```bash
# Check for vulnerabilities
npm audit

# See detailed report
npm audit --json
```

**Common Fixes**:

**Problem A: Vulnerabilities found**
```bash
# Try auto-fix
npm audit fix

# If that doesn't work, check which packages
npm audit --audit-level=moderate

# Update specific packages
npm update <package-name>

# Commit and push
git add package*.json
git commit -m "fix: Update dependencies to fix vulnerabilities"
git push
```

**Problem B: Can't fix immediately**
The workflow has `continue-on-error: true`, so this shouldn't fail the workflow.
But you should still fix vulnerabilities!

---

## 2️⃣ **Security Scan Failures**

### ❌ **CodeQL Analysis**

**Most Common Issue**: Security vulnerabilities in code

**How to diagnose**:
- Check the Security tab on GitHub
- Look for "Code scanning alerts"

**Common Fixes**:
- Review the security alerts
- Fix the vulnerable code patterns
- Common issues: SQL injection, XSS, insecure randomness

---

### ❌ **Trivy Container Scan**

**Most Common Issue**: Vulnerabilities in base image or dependencies

**How to diagnose**:
```bash
# Install Trivy locally
brew install trivy

# Scan your image
docker build -t test .
trivy image test
```

**Common Fixes**:
- Update base image in Dockerfile (currently node:25.2.1-alpine)
- Update npm dependencies
- Sometimes you need to wait for upstream fixes

---

### ❌ **Gitleaks (Secret Detection)**

**Most Common Issue**: Secrets accidentally committed

**How to diagnose**:
```bash
# Check recent commits for secrets
git log --oneline -10
```

**Common Fixes**:

**Problem A: Secret in current commit**
```bash
# Remove secret from file
# Add file to .gitignore if needed
git add .
git commit --amend -m "fix: Remove secret"
git push --force
```

**Problem B: Secret in history**
```bash
# You'll need to remove it from git history
# Use git filter-branch or BFG Repo-Cleaner
# Then force push (be careful!)
```

**Prevention**:
- Never commit passwords, API keys, tokens
- Use environment variables
- Keep secrets in .env (which is in .gitignore)

---

## 3️⃣ **Docker Image CI Failures**

### ❌ **Build and Push Docker Image**

**Most Common Issue**: Build fails or push fails

**How to diagnose**:
```bash
# Test build locally
docker build -t test .

# Test multi-platform build
docker buildx build --platform linux/amd64,linux/arm64 -t test .
```

**Common Fixes**:

**Problem A: Build fails**
- Same fixes as "Docker Build Test" above
- Check Dockerfile is correct
- Make sure all dependencies are available

**Problem B: Push fails (authentication)**
- This uses GITHUB_TOKEN automatically
- Should work if repository permissions are correct
- Check Settings → Actions → General → Workflow permissions

---

## 🎯 Quick Diagnostic Script

Run this to check for common issues locally:

```bash
#!/bin/bash
echo "🔍 Running diagnostics..."
echo ""

echo "✅ Checking Node version..."
node --version

echo ""
echo "✅ Checking npm version..."
npm --version

echo ""
echo "✅ Installing dependencies..."
npm ci

echo ""
echo "✅ Running TypeScript check..."
npm run check

echo ""
echo "✅ Running build..."
npm run build

echo ""
echo "✅ Running security audit..."
npm audit --audit-level=moderate

echo ""
echo "✅ Testing Docker build..."
docker build -t test .

echo ""
echo "✅ Testing Docker Compose config..."
docker compose config

echo ""
echo "🎉 All checks passed!"
```

Save this as `check-ci.sh` and run:
```bash
chmod +x check-ci.sh
./check-ci.sh
```

---

## 🔍 How to Read Workflow Failure Logs

### Step 1: Go to Actions Tab
```
https://github.com/itemuln/vegeta_gym/actions
```

### Step 2: Click on Failed Workflow
- Look for red X
- Click on the workflow run

### Step 3: Click on Failed Job
- You'll see which job failed
- Click on the job name

### Step 4: Expand Failed Step
- Click on the red step
- Read the error message
- Look for key phrases like:
  - "Error:"
  - "Failed"
  - "ENOENT" (file not found)
  - "EACCES" (permission denied)
  - "Cannot find module"

### Step 5: Copy Error and Search
- Copy the exact error message
- Google it or ask for help
- Usually someone has had the same issue

---

## 🚀 Most Likely Issues for Your Repository

Based on your setup, here are the most probable failures:

### 1. **npm audit finds vulnerabilities** ⚠️
**Severity**: Medium (won't fail build, but should fix)
**Fix**: Run `npm audit fix`

### 2. **Docker build context issues** ⚠️
**Severity**: Low (your Dockerfile looks good)
**Fix**: Already handled with .dockerignore

### 3. **Database schema issues in CI** ⚠️
**Severity**: Medium
**Fix**: Make sure drizzle-kit runs correctly with test database

### 4. **TypeScript compilation errors** 🔴
**Severity**: High (will fail build)
**Fix**: Run `npm run check` locally and fix all errors

---

## 📊 Expected Workflow Times

If everything is working:
- **Lint & Type Check**: 1-2 minutes
- **Build & Test**: 2-3 minutes  
- **Docker Build Test**: 2-4 minutes
- **Security Audit**: 1 minute
- **CodeQL Analysis**: 3-5 minutes
- **Trivy Scan**: 2-3 minutes

**Total time**: Approximately 5-10 minutes for all workflows

If it takes much longer or times out, there might be an issue.

---

## 🆘 Still Failing?

### Collect This Information:

1. **Which workflow failed?**
   - CI/CD Pipeline
   - Security Scan
   - Docker Image CI

2. **Which job failed?**
   - Copy the job name

3. **What's the error message?**
   - Copy the exact error from the logs

4. **Does it work locally?**
   ```bash
   npm ci
   npm run check
   npm run build
   docker build -t test .
   ```

### Then:
1. Check the error logs in GitHub Actions
2. Try running the same command locally
3. Fix the issue locally first
4. Commit and push
5. Workflows will run again automatically

---

## 💡 Pro Tips

### Tip 1: Always Test Locally First
```bash
# This catches 90% of CI failures
npm ci
npm run check
npm run build
npm audit
docker build -t test .
```

### Tip 2: Use Continue-on-Error Wisely
Some jobs have `continue-on-error: true` - they won't fail the workflow but you should still check them.

### Tip 3: Check Workflow Syntax
```bash
# GitHub has a workflow validator
# Or use: actionlint (install with brew)
brew install actionlint
actionlint .github/workflows/*.yml
```

### Tip 4: Use Act to Test Workflows Locally
```bash
# Install act
brew install act

# Run workflows locally
act -l  # List workflows
act push  # Run push event workflows
```

---

## 📞 Need More Help?

1. **Share the workflow logs**: Copy the full error from GitHub Actions
2. **Share what you tried**: What commands did you run?
3. **Share local results**: Does it work on your machine?

**Quick Link to Actions**: https://github.com/itemuln/vegeta_gym/actions

---

**Most Common Fix**: Just run `npm ci && npm run check && npm run build` locally, fix any errors, then push again! 🚀
