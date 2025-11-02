'use client'

import { SessionSummary } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { MapPin, Users, DollarSign, Dices } from 'lucide-react'
import Link from 'next/link'

interface SessionsListProps {
  sessions: SessionSummary[]
  userId: string
}

export function SessionsList({ sessions, userId }: SessionsListProps) {
  if (sessions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-12">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="p-4 bg-gray-100 dark:bg-gray-700 halloween:bg-gray-800 rounded-full">
              <Dices className="w-12 h-12 text-gray-400 dark:text-gray-500 halloween:text-orange-500" />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400">No sessions yet</h3>
            <p className="text-gray-500 dark:text-gray-400 halloween:text-orange-300 mt-1">Create your first casino session to get started!</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {sessions.map((session) => {
        // Find current user's total in this session
        const userTotal = session.players?.find((p: any) => p.user_id === userId)?.total || 0
        const isWinning = userTotal > 0

        return (
          <Link
            key={session.session_id}
            href={`/sessions/${session.session_id}`}
            className="block"
          >
            <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6 hover:shadow-lg transition-all hover:scale-[1.02]">
              {/* Session Header */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white halloween:text-orange-400">{session.name}</h3>
                  <div className="flex items-center gap-2 mt-1 text-sm text-gray-500 dark:text-gray-400 halloween:text-orange-400">
                    <MapPin className="w-4 h-4" />
                    <span>{session.location || 'No location'}</span>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 halloween:text-orange-500 mt-1">
                    {format(parseISO(session.date), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
                {session.is_active && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 halloween:bg-green-900/50 text-green-700 dark:text-green-400 halloween:text-green-400 text-xs font-semibold rounded-full">
                    Active
                  </span>
                )}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 halloween:bg-gray-800 rounded-xl">
                  <Users className="w-5 h-5 mx-auto mb-1 text-purple-500 halloween:text-orange-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 halloween:text-orange-400">Players</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white halloween:text-orange-300">{session.player_count}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 halloween:bg-gray-800 rounded-xl">
                  <Dices className="w-5 h-5 mx-auto mb-1 text-purple-500 halloween:text-orange-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 halloween:text-orange-400">Games</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white halloween:text-orange-300">{session.total_transactions}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 halloween:bg-gray-800 rounded-xl">
                  <DollarSign className="w-5 h-5 mx-auto mb-1 text-purple-500 halloween:text-orange-500" />
                  <p className="text-xs text-gray-500 dark:text-gray-400 halloween:text-orange-400">Total</p>
                  <p className="text-lg font-bold text-gray-900 dark:text-white halloween:text-orange-300">
                    ${Math.abs(session.total_amount || 0).toFixed(0)}
                  </p>
                </div>
              </div>

              {/* Your Performance */}
              <div className={`p-4 rounded-xl ${isWinning ? 'bg-green-50 dark:bg-green-900/20 halloween:bg-green-900/30' : 'bg-red-50 dark:bg-red-900/20 halloween:bg-red-900/30'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300">Your Performance</span>
                  <span className={`text-lg font-bold ${isWinning ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {isWinning ? '+' : ''}${userTotal.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

