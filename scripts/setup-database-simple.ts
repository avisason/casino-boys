/**
 * Simple Database Setup Script
 * 
 * This script displays the SQL you need to run in Supabase SQL Editor.
 * Run with: npx tsx scripts/setup-database-simple.ts
 */

import * as fs from 'fs'
import * as path from 'path'

console.log('🎰 Casino Boys - Database Setup\n')
console.log('━'.repeat(60))
console.log('STEP-BY-STEP INSTRUCTIONS')
console.log('━'.repeat(60))
console.log('')

console.log('1️⃣  Open Supabase SQL Editor:')
console.log('    👉 https://app.supabase.com')
console.log('    → Select your project')
console.log('    → Click "SQL Editor" in left sidebar')
console.log('')

console.log('2️⃣  Copy the SQL schema:')
const schemaPath = path.join(__dirname, '..', 'supabase', 'schema.sql')

if (fs.existsSync(schemaPath)) {
  const schema = fs.readFileSync(schemaPath, 'utf-8')
  const lines = schema.split('\n').length
  console.log(`    ✅ Found schema.sql (${lines} lines)`)
  console.log(`    📁 Location: ${schemaPath}`)
  console.log('')
  
  console.log('3️⃣  Run the SQL:')
  console.log('    → Copy ALL contents of supabase/schema.sql')
  console.log('    → Paste into Supabase SQL Editor')
  console.log('    → Click "Run" button')
  console.log('    → Wait for "Success. No rows returned" message')
  console.log('')
  
  console.log('━'.repeat(60))
  console.log('SQL PREVIEW')
  console.log('━'.repeat(60))
  console.log('')
  
  // Show first few lines
  const previewLines = schema.split('\n').slice(0, 20)
  previewLines.forEach(line => console.log('  ' + line))
  console.log('  ...')
  console.log(`  (${lines - 20} more lines)`)
  console.log('')
  
  console.log('━'.repeat(60))
  console.log('WHAT GETS CREATED')
  console.log('━'.repeat(60))
  console.log('')
  console.log('  📊 Tables:')
  console.log('     • profiles - User accounts')
  console.log('     • sessions - Casino sessions')
  console.log('     • transactions - Game transactions')
  console.log('')
  console.log('  👁️  Views:')
  console.log('     • daily_balances - Daily aggregates')
  console.log('     • session_summaries - Session stats')
  console.log('')
  console.log('  🔒 Security:')
  console.log('     • Row Level Security (RLS) policies')
  console.log('     • Automatic timestamps')
  console.log('     • Foreign key constraints')
  console.log('')
  
  console.log('━'.repeat(60))
  console.log('VERIFICATION')
  console.log('━'.repeat(60))
  console.log('')
  console.log('After running the SQL, verify with:')
  console.log('  $ npm run db:check')
  console.log('')
  
} else {
  console.error('❌ Error: schema.sql not found!')
  console.error(`    Expected at: ${schemaPath}`)
  process.exit(1)
}

console.log('🎲 Ready to set up your database!')
console.log('')

