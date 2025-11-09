import { createClient } from '@/lib/supabase/server'
import { SettingsForm } from '@/components/settings-form'
import { BudgetManager } from '@/components/budget-manager'

export default async function SettingsPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // Get user's active budgets
  const { data: budgets } = await supabase
    .from('budgets')
    .select('*')
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 halloween:bg-black">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white halloween:text-orange-400">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400 halloween:text-orange-300">Manage your account preferences</p>
        </div>

        {/* Budget Manager */}
        <BudgetManager budgets={budgets || []} userId={user.id} />

        {/* Settings Form */}
        <SettingsForm profile={profile} />
      </div>
    </div>
  )
}

