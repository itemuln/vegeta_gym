#!/bin/bash

# Supabase Setup Script for Vegete Gym
# This script helps you set up your environment variables

echo "🏋️ Vegete Gym - Supabase Setup"
echo "================================"
echo ""

# Check if .env already exists
if [ -f .env ]; then
    echo "⚠️  .env file already exists!"
    read -p "Do you want to overwrite it? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Setup cancelled."
        exit 0
    fi
fi

# Copy from example
if [ -f .env.example ]; then
    cp .env.example .env
    echo "✅ Created .env file from .env.example"
else
    echo "❌ .env.example not found!"
    exit 1
fi

echo ""
echo "📝 Please update your .env file with the following:"
echo ""
echo "1. DATABASE_URL"
echo "   → Go to: Supabase Project → Settings → Database"
echo "   → Copy: Connection String → URI (Transaction mode, port 6543)"
echo ""
echo "2. SESSION_SECRET"
echo "   → Generate a random string (e.g., run: openssl rand -base64 32)"
echo ""
echo "3. (Optional) SUPABASE_URL and SUPABASE_ANON_KEY"
echo "   → Go to: Supabase Project → Settings → API"
echo ""
echo "After updating .env, run:"
echo "  npm run db:push      # Push schema to Supabase"
echo "  npx tsx server/seed.ts   # Seed initial data"
echo "  npm run dev          # Start the app"
echo ""
echo "Default login: admin / admin123"
