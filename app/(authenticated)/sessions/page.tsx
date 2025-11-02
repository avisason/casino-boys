import { createClient } from '@/lib/supabase/server'
import { SessionsList } from '@/components/sessions-list'
import { CreateSessionButton } from '@/components/create-session-button'

export default async function SessionsPage() {
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get all sessions with summaries
  const { data: sessions } = await supabase
    .from('session_summaries')
    .select('*')
    .order('date', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 halloween:bg-black">
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white halloween:text-orange-400">Sessions</h1>
            <p className="text-gray-600 dark:text-gray-400 halloween:text-orange-300">Manage your casino trips</p>
          </div>
          <CreateSessionButton />
        </div>

        {/* Sessions List */}
        <SessionsList sessions={sessions || []} userId={user.id} />
      </div>
    </div>
  )
}

