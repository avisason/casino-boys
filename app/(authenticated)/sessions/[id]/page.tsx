import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { SessionDetail } from '@/components/session-detail'

interface PageProps {
  params: Promise<{ id: string }>
}

interface Player {
  id: string
  name: string
  avatar_url?: string
  total: number
  wins: number
  losses: number
  games: number
}

export default async function SessionDetailPage({ params }: PageProps) {
  const { id } = await params
  const supabase = await createClient()
  
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return null

  // Get session details
  const { data: session } = await supabase
    .from('sessions')
    .select('*')
    .eq('id', id)
    .single()

  if (!session) {
    notFound()
  }

  // Get all transactions for this session
  const { data: transactions } = await supabase
    .from('transactions')
    .select(`
      *,
      profiles:user_id (
        id,
        full_name,
        email,
        avatar_url
      )
    `)
    .eq('session_id', id)
    .order('transaction_date', { ascending: false })

  // Calculate player stats
  const playerStats = transactions?.reduce((acc, t: any) => {
    const playerId = t.user_id
    if (!acc[playerId]) {
      acc[playerId] = {
        id: playerId,
        name: t.profiles?.full_name || t.profiles?.email || 'Unknown',
        avatar_url: t.profiles?.avatar_url,
        total: 0,
        wins: 0,
        losses: 0,
        games: 0,
      }
    }
    acc[playerId].total += t.amount
    acc[playerId].games += 1
    if (t.amount > 0) acc[playerId].wins += t.amount
    else acc[playerId].losses += Math.abs(t.amount)
    return acc
  }, {} as Record<string, Player>)

  const players: Player[] = Object.values(playerStats || {})

  return (
    <div className="min-h-screen bg-gray-50">
      <SessionDetail
        session={session}
        transactions={transactions || []}
        players={players}
        currentUserId={user.id}
      />
    </div>
  )
}

