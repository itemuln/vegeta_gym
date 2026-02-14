#!/bin/bash

echo "🔍 GitHub Workflows Health Check"
echo "=================================="
echo ""

echo "📦 Checking npm dependencies..."
if [ ! -d "node_modules" ]; then
    echo "⚠️  node_modules not found - installing..."
    npm ci
else
    echo "✅ node_modules exists"
fi
echo ""

echo "🔍 Checking TypeScript..."
if npm run check 2>&1 | grep -q "error"; then
    echo "❌ TypeScript errors found!"
    npm run check
else
    echo "✅ TypeScript check passed"
fi
echo ""

echo "🏗️  Checking build..."
if npm run build > /dev/null 2>&1; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    npm run build
fi
echo ""

echo "🔐 Checking security..."
npm audit --audit-level=high 2>&1 | head -20
echo ""

echo "🐳 Checking Docker..."
if docker build -t test-workflow . > /dev/null 2>&1; then
    echo "✅ Docker build successful"
else
    echo "❌ Docker build failed"
fi
echo ""

echo "📋 Checking Docker Compose..."
if docker compose config > /dev/null 2>&1; then
    echo "✅ Docker Compose config valid"
else
    echo "❌ Docker Compose config invalid"
fi
echo ""

echo "=================================="
echo "✅ Health check complete!"
echo ""
echo "To view GitHub Actions:"
echo "open https://github.com/itemuln/vegeta_gym/actions"
