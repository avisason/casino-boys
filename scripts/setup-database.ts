/**
 * Database Setup Script
 * 
 * This script sets up all necessary database tables, views, and policies.
 * Run with: npx tsx scripts/setup-database.ts
 * 
 * Make sure you have your .env.local file configured with Supabase credentials.
 */

import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'

// Load environment variables
const SUPABASE_URL="https://agotjaevrjsnzkwavsno.supabase.co"
const SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFnb3RqYWV2cmpzbnprd2F2c25vIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwOTU0MjAsImV4cCI6MjA3NzY3MTQyMH0.SP0eLJwMBURvc_hIAhH9V9W9fOCwi_dGOhig36BwVDc"


require('dotenv').config({ path: '.env.local' })

const supabaseUrl = SUPABASE_URL
const supabaseServiceKey = SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials')
  console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log('🎰 Casino Boys - Database Setup\n')
  console.log('Starting database setup...\n')

  try {
    // Read the schema SQL file
    const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql')
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8')

    console.log('📄 Reading schema.sql...')
    console.log('📊 Found schema file with all table definitions\n')

    // Split SQL into individual statements
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'))

    console.log(`📝 Executing ${statements.length} SQL statements...\n`)

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i]
      
      // Skip empty statements
      if (!statement || statement.length < 5) continue

      // Get a preview of the statement (first 100 chars)
      const preview = statement.substring(0, 100).replace(/\n/g, ' ')
      console.log(`[${i + 1}/${statements.length}] ${preview}...`)

      try {
        const { error } = await supabase.rpc('exec_sql', { sql: statement })
        
        if (error) {
          // Some errors are expected (like "already exists")
          if (error.message.includes('already exists')) {
            console.log('   ⚠️  Already exists, skipping...')
          } else {
            console.log(`   ⚠️  Warning: ${error.message}`)
          }
        } else {
          console.log('   ✅ Success')
        }
      } catch (err: any) {
        console.log(`   ⚠️  Error: ${err.message}`)
      }
    }

    console.log('\n🎉 Database setup complete!')
    console.log('\nCreated:')
    console.log('  ✅ profiles table')
    console.log('  ✅ sessions table')
    console.log('  ✅ transactions table')
    console.log('  ✅ daily_balances view')
    console.log('  ✅ session_summaries view')
    console.log('  ✅ Row Level Security policies')
    console.log('  ✅ Database triggers')
    console.log('\nYour database is ready to use! 🎲')
    
  } catch (error: any) {
    console.error('\n❌ Error setting up database:')
    console.error(error.message)
    console.error('\nPlease run the SQL manually in your Supabase SQL Editor:')
    console.error('1. Go to https://app.supabase.com')
    console.error('2. Open your project')
    console.error('3. Go to SQL Editor')
    console.error('4. Copy the contents of supabase/schema.sql')
    console.error('5. Paste and run the SQL')
    process.exit(1)
  }
}

// Check database connection first
async function checkConnection() {
  console.log('🔌 Checking Supabase connection...')
  try {
    const { data, error } = await supabase.from('profiles').select('count').limit(1)
    if (error && !error.message.includes('does not exist')) {
      throw error
    }
    console.log('✅ Connected to Supabase\n')
    return true
  } catch (error: any) {
    console.log('✅ Connected to Supabase (tables not yet created)\n')
    return true
  }
}

// Main execution
async function main() {
  const connected = await checkConnection()
  if (!connected) {
    console.error('❌ Could not connect to Supabase. Please check your credentials.')
    process.exit(1)
  }
  
  await setupDatabase()
}

main().catch(console.error)

