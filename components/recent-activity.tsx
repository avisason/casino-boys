'use client'

import { Transaction, GAME_LABELS, GAME_EMOJIS } from '@/lib/types'
import { format, parseISO } from 'date-fns'
import { Clock, TrendingUp, TrendingDown } from 'lucide-react'
import { safeNumber } from '@/lib/utils'

interface RecentActivityProps {
  transactions: Transaction[]
}

export function RecentActivity({ transactions }: RecentActivityProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-purple-500 halloween:text-orange-500" />
          Recent Activity
        </h3>
        <div className="text-center py-8 text-gray-400 dark:text-gray-500 halloween:text-orange-500">
          <p>No recent activity. Start playing!</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 mb-4 flex items-center gap-2">
        <Clock className="w-5 h-5 text-purple-500 halloween:text-orange-500" />
        Recent Activity
      </h3>

      <div className="space-y-3">
        {transactions.map((transaction) => {
          const safeAmount = safeNumber(transaction.amount, 0)
          const isWin = safeAmount > 0
          return (
            <div
              key={transaction.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 halloween:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 halloween:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">
                  {GAME_EMOJIS[transaction.game]}
                </div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white halloween:text-orange-300">
                    {GAME_LABELS[transaction.game]}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 halloween:text-orange-400">
                    {format(parseISO(transaction.transaction_date), 'MMM dd, yyyy')}
                  </p>
                  {transaction.notes && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 halloween:text-orange-500 mt-1">{transaction.notes}</p>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {isWin ? (
                  <TrendingUp className="w-4 h-4 text-green-500 dark:text-green-400" />
                ) : (
                  <TrendingDown className="w-4 h-4 text-red-500 dark:text-red-400" />
                )}
                <span className={`text-lg font-bold ${isWin ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {isWin ? '+' : ''}${safeAmount.toFixed(2)}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

