# 🎰 Casino Boys

A modern, mobile-first web application for tracking casino adventures with friends. Built with Next.js, TypeScript, and Supabase.

## ✨ Features

- 🔐 **Google OAuth & Email Authentication** - Secure login with Google or magic link email
- 📊 **Interactive Dashboard** - Beautiful charts and statistics showing your casino performance
- 📅 **Calendar View** - Daily tracking with visual indicators for winning/losing days
- 🎲 **Session Management** - Create and track casino sessions with friends
- 🎮 **Multi-Game Support** - Track Blackjack, Poker, Ultimate Poker, and Roulette
- 👥 **Shared Data** - All transactions visible across all users in the group
- 📱 **Mobile-First Design** - Optimized for mobile with a beautiful, modern UI
- 📈 **Real-time Stats** - View leaderboards, game breakdowns, and performance trends

## 🎯 Games Supported

- 🃏 **Blackjack**
- ♠️ **Poker**
- ♦️ **Ultimate Poker**
- 🎰 **Roulette**

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase account (free tier works great!)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd casino-boys
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Supabase**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your project URL and anon key

4. **Configure environment variables**
   ```bash
   cp .env.local.example .env.local
   ```
   Then edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   ```

5. **Set up the database**
   - Go to your Supabase project's SQL Editor
   - Copy the contents of `supabase/schema.sql`
   - Run the SQL to create all tables, views, and policies

6. **Enable Google OAuth (optional)**
   - In Supabase Dashboard, go to Authentication > Providers
   - Enable Google provider
   - Add your Google OAuth credentials
   - Add your site URL to authorized redirect URLs

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Usage

### Creating a Session
1. Navigate to the Sessions tab
2. Click the + button
3. Enter session name, location, and date
4. Click "Create Session"

### Adding Transactions
1. Click the floating + button (available on most pages)
2. Select a session
3. Choose the game type
4. Enter the amount (positive for wins, negative for losses)
5. Add any notes (optional)
6. Click "Add Transaction"

### Viewing Statistics
- **Dashboard**: Overview of your total performance with charts
- **Calendar**: Day-by-day view of your casino activity
- **Sessions**: Detailed breakdown per casino visit with leaderboards

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL)
- **Authentication**: Supabase Auth (Google OAuth + Magic Links)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Date Handling**: [date-fns](https://date-fns.org/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)

## 📁 Project Structure

```
casino-boys/
├── app/
│   ├── (authenticated)/     # Protected routes
│   │   ├── calendar/        # Calendar view page
│   │   ├── dashboard/       # Dashboard with stats
│   │   ├── sessions/        # Sessions management
│   │   └── settings/        # User settings
│   ├── auth/               # Auth callback handler
│   ├── login/              # Login page
│   └── page.tsx            # Root redirect
├── components/             # React components
│   ├── calendar-view.tsx
│   ├── dashboard-stats.tsx
│   ├── game-breakdown.tsx
│   ├── quick-add-button.tsx
│   ├── session-detail.tsx
│   └── ...
├── lib/
│   ├── supabase/          # Supabase clients
│   ├── types.ts           # TypeScript types
│   └── utils.ts           # Utility functions
└── supabase/
    └── schema.sql         # Database schema
```

## 🎨 Design Philosophy

- **Mobile-First**: Optimized for mobile devices with touch-friendly UI
- **Intuitive**: Easy to use even when you've had a few drinks at the casino 🍸
- **Visual**: Color-coded wins (green) and losses (red) for quick scanning
- **Fun**: Emojis and gradients to keep things light and entertaining
- **Fast**: Optimized performance with server-side rendering

## 🔒 Security

- Row Level Security (RLS) enabled on all tables
- Secure authentication with Supabase Auth
- Server-side data fetching for sensitive operations
- Environment variables for secrets

## 📊 Database Schema

The app uses a PostgreSQL database with the following main tables:

- **profiles**: User information (extends Supabase auth.users)
- **sessions**: Casino trip sessions
- **transactions**: Individual game transactions
- **daily_balances**: View for aggregated daily totals
- **session_summaries**: View for session statistics

See `supabase/schema.sql` for the complete schema with all views and policies.

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📝 License

MIT License - feel free to use this project however you'd like!

## 🎉 Have Fun!

Remember to gamble responsibly! This app is meant to track your casino adventures with friends and help you understand your gaming patterns. Always play within your limits and treat it as entertainment! 🎰

---

Built with ❤️ for the Casino Boys crew
