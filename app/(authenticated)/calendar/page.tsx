import { createClient } from '@/lib/supabase/server'
import { CalendarView } from '@/components/calendar-view'
import { QuickAddButton } from '@/components/quick-add-button'

export default async function CalendarPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get user's daily balances
  const { data: dailyBalances } = await supabase
    .from('daily_balances')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })

  // Get all transactions for the user
  const { data: transactions } = await supabase
    .from('transactions')
    .select('*')
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 halloween:bg-black">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white halloween:text-orange-400">Calendar</h1>
          <p className="text-gray-600 dark:text-gray-400 halloween:text-orange-300">Track your daily casino activity</p>
        </div>

        {/* Calendar */}
        <CalendarView 
          dailyBalances={dailyBalances || []} 
          transactions={transactions || []}
        />
      </div>

      {/* Quick Add Button */}
      <QuickAddButton />
    </div>
  )
}

