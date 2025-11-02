# 🎰 Casino Boys - Quick Command Reference

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Set up database (interactive guide)
npm run setup

# Check database status
npm run db:check

# Start development server
npm run dev
```

---

## 📦 NPM Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server at http://localhost:3000 |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint |
| `npm run setup` | Interactive database setup guide |
| `npm run db:check` | Check database tables and status |
| `npm run db:setup` | Automated database setup (needs service key) |
| `npm run db:seed` | Show sample data instructions |

---

## 🗄️ Database Commands

```bash
# Check what's set up
npm run db:check

# Get setup instructions
npm run setup

# Automated setup (requires SUPABASE_SERVICE_ROLE_KEY)
npm run db:setup

# See sample data guide
npm run db:seed
```

---

## 📁 Important Files

```
casino-boys/
├── .env.local              ← Your Supabase credentials (create this!)
├── .env.local.example      ← Template for environment variables
├── supabase/
│   └── schema.sql          ← Database schema (run this in Supabase)
├── scripts/
│   ├── check-database.ts   ← Check database status
│   ├── setup-database.ts   ← Automated setup script
│   ├── seed-sample-data.ts ← Sample data guide
│   └── simple-setup.sh     ← Interactive setup script
├── DATABASE_SETUP.md       ← Complete database setup guide
├── QUICKSTART.md           ← 5-minute quick start guide
└── README.md               ← Full project documentation
```

---

## ⚙️ Environment Variables

Create `.env.local` in the project root:

```bash
# Required
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...

# Optional (for automated database setup)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
```

Get these from: [Supabase Dashboard](https://app.supabase.com) → Project Settings → API

---

## 🔍 Troubleshooting Commands

```bash
# Check Node version (need 18+)
node --version

# Clear install and reinstall
rm -rf node_modules package-lock.json
npm install

# Check if Supabase credentials are loaded
node -e "require('dotenv').config({path:'.env.local'}); console.log(process.env.NEXT_PUBLIC_SUPABASE_URL)"

# Verify database connection
npm run db:check

# Clean build
rm -rf .next
npm run build
```

---

## 🎯 Common Workflows

### First Time Setup
```bash
npm install
npm run setup              # Follow instructions
npm run db:check           # Verify
npm run dev                # Start app
```

### After Git Pull
```bash
npm install                # Get new dependencies
npm run db:check           # Check if schema updated
npm run dev                # Start app
```

### Reset Database
```bash
# Go to Supabase Dashboard → SQL Editor
# Drop all tables:
DROP TABLE IF EXISTS transactions CASCADE;
DROP TABLE IF EXISTS sessions CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP VIEW IF EXISTS daily_balances;
DROP VIEW IF EXISTS session_summaries;

# Then re-run setup
npm run setup
```

### Production Build
```bash
npm run build
npm run start
```

---

## 📱 App Features

| Page | URL | Description |
|------|-----|-------------|
| **Dashboard** | `/dashboard` | Stats and performance charts |
| **Calendar** | `/calendar` | Daily transaction calendar |
| **Sessions** | `/sessions` | Manage casino sessions |
| **Session Detail** | `/sessions/:id` | View session leaderboard |
| **Settings** | `/settings` | User profile settings |
| **Login** | `/login` | Authentication page |

---

## 🎲 Game Types

- 🃏 **Blackjack**
- ♠️ **Poker**
- ♦️ **Ultimate Poker**
- 🎰 **Roulette**

---

## 📊 Quick Reference

**Default Port:** 3000  
**Framework:** Next.js 16 (App Router)  
**Database:** Supabase (PostgreSQL)  
**Styling:** Tailwind CSS 4  
**Charts:** Recharts  

---

## 🆘 Getting Help

1. **Database Issues:** See `DATABASE_SETUP.md`
2. **Quick Start:** See `QUICKSTART.md`
3. **Full Docs:** See `README.md`
4. **Scripts:** See `scripts/README.md`

---

## ✨ Quick Tips

- Use `npm run db:check` frequently to verify database status
- The app requires authentication - create an account first
- Create a session before adding transactions
- Use the floating + button to quickly add transactions
- Green = wins, Red = losses throughout the app

---

**Ready to track your casino adventures? 🎰**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and start playing!

