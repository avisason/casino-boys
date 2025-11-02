/**
 * Database Check Script
 * 
 * This script checks if all database tables and views exist.
 * Run with: npx tsx scripts/check-database.ts
 */

import { createClient } from '@supabase/supabase-js'

// Load environment variables
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase credentials')
  console.error('Please ensure your .env.local file is configured')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const requiredTables = ['profiles', 'sessions', 'transactions']
const requiredViews = ['daily_balances', 'session_summaries']

async function checkDatabase() {
  console.log('🎰 Casino Boys - Database Check\n')
  console.log('Checking database setup...\n')

  let allGood = true

  // Check connection
  console.log('🔌 Checking connection to Supabase...')
  try {
    const { error } = await supabase.from('profiles').select('count').limit(0)
    if (error && !error.message.includes('does not exist')) {
      throw error
    }
    console.log('✅ Connected successfully\n')
  } catch (error: any) {
    console.error('❌ Connection failed:', error.message)
    process.exit(1)
  }

  // Check tables
  console.log('📊 Checking tables:')
  for (const table of requiredTables) {
    try {
      const { error } = await supabase.from(table).select('count').limit(0)
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`   ❌ ${table} - NOT FOUND`)
          allGood = false
        } else {
          console.log(`   ✅ ${table} - exists`)
        }
      } else {
        console.log(`   ✅ ${table} - exists`)
      }
    } catch (error: any) {
      console.log(`   ❌ ${table} - ERROR: ${error.message}`)
      allGood = false
    }
  }

  // Check views
  console.log('\n📊 Checking views:')
  for (const view of requiredViews) {
    try {
      const { error } = await supabase.from(view).select('count').limit(0)
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`   ❌ ${view} - NOT FOUND`)
          allGood = false
        } else {
          console.log(`   ✅ ${view} - exists`)
        }
      } else {
        console.log(`   ✅ ${view} - exists`)
      }
    } catch (error: any) {
      console.log(`   ❌ ${view} - ERROR: ${error.message}`)
      allGood = false
    }
  }

  // Check row counts
  console.log('\n📈 Database statistics:')
  for (const table of requiredTables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true })
      
      if (!error) {
        console.log(`   ${table}: ${count || 0} rows`)
      }
    } catch (error) {
      // Ignore errors for statistics
    }
  }

  // Final report
  console.log('\n' + '='.repeat(50))
  if (allGood) {
    console.log('✅ All database tables and views are set up correctly!')
    console.log('\nYour database is ready to use! 🎲')
  } else {
    console.log('❌ Some database objects are missing!')
    console.log('\nTo fix this, run the setup script:')
    console.log('   npx tsx scripts/setup-database.ts')
    console.log('\nOr manually run the SQL in Supabase SQL Editor:')
    console.log('   1. Go to https://app.supabase.com')
    console.log('   2. Open SQL Editor')
    console.log('   3. Copy contents of supabase/schema.sql')
    console.log('   4. Run the SQL')
    process.exit(1)
  }
}

checkDatabase().catch(console.error)

