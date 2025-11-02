#!/bin/bash

# Casino Boys - Simple Database Setup Script
# This script provides instructions for setting up the database

echo "🎰 Casino Boys - Database Setup Guide"
echo "======================================"
echo ""
echo "This script will guide you through setting up your database."
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "⚠️  Warning: .env.local not found!"
    echo ""
    echo "Please create .env.local with your Supabase credentials:"
    echo ""
    echo "NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co"
    echo "NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key"
    echo ""
    echo "Get these values from:"
    echo "https://app.supabase.com/project/_/settings/api"
    echo ""
    exit 1
fi

echo "✅ Found .env.local"
echo ""
echo "📋 Setup Steps:"
echo ""
echo "1. Open your Supabase project:"
echo "   https://app.supabase.com"
echo ""
echo "2. Go to the SQL Editor (left sidebar)"
echo ""
echo "3. Copy the contents of this file:"
echo "   supabase/schema.sql"
echo ""
echo "4. Paste into the SQL Editor"
echo ""
echo "5. Click 'Run' to execute the SQL"
echo ""
echo "6. Wait for completion (should take a few seconds)"
echo ""
echo "✨ That's it! Your database will be ready."
echo ""
echo "Optional: Run these commands to verify:"
echo "  npm install -g tsx  # If not already installed"
echo "  npx tsx scripts/check-database.ts"
echo ""
echo "🎲 Happy gambling tracking!"

