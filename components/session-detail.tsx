'use client'

import { useState, useMemo } from 'react'
import { Session, Transaction, GAME_LABELS, GAME_EMOJIS } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { MapPin, Calendar, Users, ArrowLeft, TrendingUp, TrendingDown, Trash2, Filter } from 'lucide-react'
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

interface TransactionWithProfile extends Transaction {
  profiles?: {
    id: string
    full_name: string | null
    email: string
    avatar_url: string | null
  }
}

interface SessionDetailProps {
  session: Session
  transactions: TransactionWithProfile[]
  players: Player[]
  currentUserId: string
}

export function SessionDetail({ session, transactions, players, currentUserId }: SessionDetailProps) {
  const router = useRouter()
  const supabase = createClient()
  const [deleting, setDeleting] = useState<string | null>(null)
  const [selectedPlayer, setSelectedPlayer] = useState<string>('all')

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

  // Filter transactions based on selected player
  const filteredTransactions = useMemo(() => {
    if (selectedPlayer === 'all') return transactions
    return transactions.filter(t => t.user_id === selectedPlayer)
  }, [transactions, selectedPlayer])

  // Recalculate stats based on filtered transactions
  const filteredStats = useMemo(() => {
    const totalAmount = filteredTransactions.reduce((sum, t) => sum + t.amount, 0)
    const filteredPlayers = selectedPlayer === 'all' 
      ? players 
      : players.filter(p => p.id === selectedPlayer)
    const sortedPlayers = [...filteredPlayers].sort((a, b) => b.total - a.total)
    
    return { totalAmount, sortedPlayers }
  }, [filteredTransactions, players, selectedPlayer])

  const { totalAmount, sortedPlayers } = filteredStats

  return (
    <div className="max-w-md mx-auto px-4 py-6 space-y-6">
      {/* Back Button */}
      <Link
        href="/sessions"
        className="inline-flex items-center gap-2 text-purple-600 dark:text-purple-400 halloween:text-orange-500 hover:text-purple-700 dark:hover:text-purple-300 halloween:hover:text-orange-400 font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        Back to Sessions
      </Link>

      {/* Session Info */}
      <div className="bg-gradient-to-br from-purple-500 to-pink-500 halloween:from-orange-600 halloween:to-orange-800 rounded-2xl shadow-xl p-6 text-white">
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

      {/* Player Filter */}
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-4">
        <div className="flex items-center gap-3">
          <Filter className="w-5 h-5 text-purple-500 halloween:text-orange-500 flex-shrink-0" />
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="flex-1 px-4 py-2 border-2 border-gray-200 dark:border-gray-600 halloween:border-orange-800 bg-white dark:bg-gray-700 halloween:bg-gray-800 text-gray-900 dark:text-white halloween:text-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 halloween:focus:ring-orange-500 focus:border-transparent transition-all"
          >
            <option value="all">All Players ({players.length})</option>
            {players.map((player) => (
              <option key={player.id} value={player.id}>
                {player.name} {player.id === currentUserId && '(You)'}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white halloween:text-orange-400 mb-4">Leaderboard</h2>
        <div className="space-y-3">
          {sortedPlayers.map((player, index) => {
            const isCurrentUser = player.id === currentUserId
            const isWinning = player.total > 0
            return (
              <div
                key={player.id}
                className={`flex items-center gap-4 p-4 rounded-xl ${
                  isCurrentUser ? 'bg-purple-50 dark:bg-purple-900/20 halloween:bg-orange-900/20 border-2 border-purple-200 dark:border-purple-700 halloween:border-orange-700' : 'bg-gray-50 dark:bg-gray-700 halloween:bg-gray-800'
                }`}
              >
                <div className="flex-shrink-0">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 halloween:from-orange-600 halloween:to-orange-800 flex items-center justify-center text-white font-bold">
                    {index + 1}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 dark:text-white halloween:text-orange-300 truncate leading-tight">
                    {player.name} {isCurrentUser && '(You)'}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 halloween:text-orange-400 mt-0.5">{player.games} games</p>
                </div>

                <div className="text-right flex-shrink-0">
                  <div className="flex items-center justify-end gap-1">
                    {isWinning ? (
                      <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400 flex-shrink-0" />
                    ) : (
                      <TrendingDown className="w-4 h-4 text-red-500 dark:text-red-400 flex-shrink-0" />
                    )}
                    <span className={`text-lg font-bold whitespace-nowrap ${isWinning ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isWinning ? '+' : ''}${player.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 halloween:text-orange-400 mt-0.5 whitespace-nowrap">
                    W: ${player.wins.toFixed(0)} L: ${player.losses.toFixed(0)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Transaction History */}
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white halloween:text-orange-400 mb-4">
          Transaction History
          {selectedPlayer !== 'all' && (
            <span className="text-sm font-normal text-gray-500 dark:text-gray-400 halloween:text-orange-400 ml-2">
              ({filteredTransactions.length} of {transactions.length})
            </span>
          )}
        </h2>

        {filteredTransactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400 dark:text-gray-500 halloween:text-orange-500">
            <p>No transactions {selectedPlayer !== 'all' && 'for this player'}</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredTransactions.map((transaction) => {
              const isWin = transaction.amount > 0
              const isOwnTransaction = transaction.user_id === currentUserId
              return (
                <div
                  key={transaction.id}
                  className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700 halloween:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 halloween:hover:bg-gray-700 transition-colors group"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center">
                      <span className="text-2xl leading-none">{GAME_EMOJIS[transaction.game]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 dark:text-white halloween:text-orange-300 leading-tight">
                        {GAME_LABELS[transaction.game]}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 halloween:text-orange-400 truncate mt-0.5">
                        {transaction.profiles?.full_name || transaction.profiles?.email || 'Unknown'}
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 halloween:text-orange-500 mt-0.5">
                        {format(parseISO(transaction.transaction_date), 'MMM dd, yyyy')}
                      </p>
                      {transaction.notes && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 halloween:text-orange-400 mt-1">{transaction.notes}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-lg font-bold whitespace-nowrap ${isWin ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isWin ? '+' : ''}${transaction.amount.toFixed(2)}
                    </span>
                    <div className="w-8 h-8 flex items-center justify-center">
                      {isOwnTransaction && (
                        <button
                          onClick={() => handleDeleteTransaction(transaction.id)}
                          disabled={deleting === transaction.id}
                          className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-100 dark:hover:bg-red-900/30 halloween:hover:bg-red-900/30 rounded-lg transition-all disabled:opacity-50"
                        >
                          <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
                        </button>
                      )}
                    </div>
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

