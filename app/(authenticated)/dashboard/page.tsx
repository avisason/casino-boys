import { createClient } from '@/lib/supabase/server'
import { DashboardStats } from '@/components/dashboard-stats'
import { GameBreakdown } from '@/components/game-breakdown'
import { RecentActivity } from '@/components/recent-activity'
import { TrendChart } from '@/components/trend-chart'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get all transactions for the user
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })

  // Get user's daily balances
  const { data: dailyBalances } = await supabase
    .from('daily_balances')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })
    .limit(30)

  // Calculate total stats
  const totalWinnings = transactions?.reduce((sum, t) => sum + (t.amount > 0 ? t.amount : 0), 0) || 0
  const totalLosses = transactions?.reduce((sum, t) => sum + (t.amount < 0 ? Math.abs(t.amount) : 0), 0) || 0
  const netTotal = transactions?.reduce((sum, t) => sum + t.amount, 0) || 0
  const totalGames = transactions?.length || 0

  // Get recent transactions (last 5)
  const recentTransactions = transactions?.slice(0, 5) || []

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 halloween:bg-black">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white halloween:text-orange-400">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 halloween:text-orange-300">Your casino performance at a glance</p>
        </div>

        {/* Stats Cards */}
        <DashboardStats
          netTotal={netTotal}
          totalWinnings={totalWinnings}
          totalLosses={totalLosses}
          totalGames={totalGames}
        />

        {/* Trend Chart */}
        <TrendChart dailyBalances={dailyBalances || []} />

        {/* Game Breakdown */}
        <GameBreakdown transactions={transactions || []} />

        {/* Recent Activity */}
        <RecentActivity transactions={recentTransactions} />
      </div>
    </div>
  )
}

