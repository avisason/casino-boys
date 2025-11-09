import { createClient } from '@/lib/supabase/server'
import { DashboardStats } from '@/components/dashboard-stats'
import { GameBreakdown } from '@/components/game-breakdown'
import { RecentActivity } from '@/components/recent-activity'
import { TrendChart } from '@/components/trend-chart'
import { BudgetStatus } from '@/components/budget-status'

export default async function DashboardPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user profile for display
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, email')
    .eq('id', user.id)
    .single()

  // Get all transactions for the logged-in user only
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })

  // Get logged-in user's daily balances only
  const { data: dailyBalances } = await supabase
    .from('daily_balances')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })
    .limit(30)

  // Get active budgets
  const { data: budgets } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)

  // Calculate spending for budget periods
  const now = new Date()
  const startOfWeek = new Date(now)
  startOfWeek.setDate(now.getDate() - now.getDay())
  startOfWeek.setHours(0, 0, 0, 0)

  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

  const weeklySpending = transactions
    ?.filter(t => new Date(t.transaction_date) >= startOfWeek && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0

  const monthlySpending = transactions
    ?.filter(t => new Date(t.transaction_date) >= startOfMonth && t.amount < 0)
    .reduce((sum, t) => sum + Math.abs(t.amount), 0) || 0

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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white halloween:text-orange-400">
            {profile?.full_name ? `${profile.full_name}'s Dashboard` : 'Dashboard'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 halloween:text-orange-300">Your personal casino performance</p>
        </div>

        {/* Stats Cards */}
        <DashboardStats
          netTotal={netTotal}
          totalWinnings={totalWinnings}
          totalLosses={totalLosses}
          totalGames={totalGames}
        />

        {/* Budget Status */}
        <BudgetStatus 
          budgets={budgets || []} 
          periodSpending={{ weekly: weeklySpending, monthly: monthlySpending }}
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

