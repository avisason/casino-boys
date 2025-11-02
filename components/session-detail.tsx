'use client'

import { useState } from 'react'
import { Session, Transaction, GAME_LABELS, GAME_EMOJIS } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { MapPin, Calendar, Users, ArrowLeft, TrendingUp, TrendingDown, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

interface Player {
  id: string
  name: string
  avatar_url?: string
  total: number
  wins: number
  losses: number
  games: number
}

interface SessionDetailProps {
  session: Session
  transactions: any[]
  players: Player[]
  currentUserId: string
}

export function SessionDetail({ session, transactions, players, currentUserId }: SessionDetailProps) {
  const router = useRouter()
  const supabase = createClient()
  const [deleting, setDeleting] = useState<string | null>(null)

  const handleDeleteTransaction = async (transactionId: string) => {
    if (!confirm('Are you sure you want to delete this transaction?')) return

    setDeleting(transactionId)
    try {
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', transactionId)

      if (error) throw error

      router.refresh()
    } catch (error: any) {
      console.error('Error deleting transaction:', error)
      alert(error.message || 'Failed to delete transaction')
    } finally {
      setDeleting(null)
    }
  }

  const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0)
  const sortedPlayers = [...players].sort((a, b) => b.total - a.total)

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Back Button */}
      <Link
        href="/sessions"
        className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Sessions
      </Link>

      {/* Session Info */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl shadow-xl p-6 text-white">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold mb-2">{session.name}</h1>
            {session.is_active && (
              <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-semibold rounded-full">
                Active
              </span>
            )}
          </div>
        </div>

        <div className="space-y-2 text-sm opacity-90">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{session.location || 'No location'}</span>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <span>{format(parseISO(session.date), 'EEEE, MMMM d, yyyy')}</span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span>{players.length} players • {transactions.length} transactions</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-white/20">
          <p className="text-sm opacity-75">Total Pool</p>
          <p className="text-3xl font-bold">${Math.abs(totalAmount).toFixed(2)}</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Leaderboard</h2>
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => {
            const isCurrentUser = player.id === currentUserId
            const isWinning = player.total > 0
            return (
              <div
                key={player.id}
                className={`flex items-center gap-4 p-4 rounded-xl ${
                  isCurrentUser ? 'bg-purple-50 border-2 border-purple-200' : 'bg-gray-50'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {player.name} {isCurrentUser && '(You)'}
                  </p>
                  <p className="text-sm text-gray-500">{player.games} games</p>
                </div>

                <div className="text-right">
                  <div className="flex items-center gap-1">
                    {isWinning ? (
                      <TrendingUp className="w-4 h-4 text-green-500" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500" />
                    )}
                    <span className={`text-lg font-bold ${isWinning ? 'text-green-600' : 'text-red-600'}`}>
                      {isWinning ? '+' : ''}${player.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500">
                    W: ${player.wins.toFixed(0)} L: ${player.losses.toFixed(0)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Transaction History</h2>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <p>No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {transactions.map((transaction: any) => {
              const isWin = transaction.amount > 0
              const isOwnTransaction = transaction.user_id === currentUserId
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-xl group"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="text-2xl">{GAME_EMOJIS[transaction.game]}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900">
                        {GAME_LABELS[transaction.game]}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {transaction.profiles?.full_name || transaction.profiles?.email || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-400">
                        {format(parseISO(transaction.transaction_date), 'MMM dd, yyyy')}
                      </p>
                      {transaction.notes && (
                        <p className="text-xs text-gray-500 mt-1">{transaction.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className={`text-lg font-bold ${isWin ? 'text-green-600' : 'text-red-600'}`}>
                      {isWin ? '+' : ''}${transaction.amount.toFixed(2)}
                    </span>
                    {isOwnTransaction && (
                      <button
                        onClick={() => handleDeleteTransaction(transaction.id)}
                        disabled={deleting === transaction.id}
                        className="opacity-0 group-hover:opacity-100 p-2 hover:bg-red-100 rounded-lg transition-all disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

