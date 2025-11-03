'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { Transaction, GAME_LABELS, GAME_COLORS, GAME_EMOJIS } from '@/lib/types'
import { Dices } from 'lucide-react'
import { safeNumber } from '@/lib/utils'

interface GameBreakdownProps {
  transactions: Transaction[]
}

export function GameBreakdown({ transactions }: GameBreakdownProps) {
  if (!transactions || transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 mb-4 flex items-center gap-2">
          <Dices className="w-5 h-5 text-purple-500 halloween:text-orange-500" />
          Game Performance
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 halloween:text-orange-500">
          <p>No games played yet. Start your casino journey!</p>
        </div>
      </div>
    )
  }

  // Calculate totals by game
  const gameStats = transactions.reduce((acc, transaction) => {
    if (!acc[transaction.game]) {
      acc[transaction.game] = { total: 0, count: 0 }
    }
    acc[transaction.game].total += safeNumber(transaction.amount, 0)
    acc[transaction.game].count += 1
    return acc
  }, {} as Record<string, { total: number; count: number }>)

  const chartData = Object.entries(gameStats).map(([game, stats]) => ({
    name: GAME_LABELS[game as keyof typeof GAME_LABELS],
    value: Math.abs(safeNumber(stats.total, 0)),
    total: safeNumber(stats.total, 0),
    count: stats.count,
    color: GAME_COLORS[game as keyof typeof GAME_COLORS],
    emoji: GAME_EMOJIS[game as keyof typeof GAME_EMOJIS],
  }))

  return (
    <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 flex items-center gap-2">
          <Dices className="w-5 h-5 text-purple-500 halloween:text-orange-500" />
          Game Performance
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 halloween:text-orange-300 mt-1">Breakdown by game type</p>
      </div>

      <div className="space-y-4">
        {/* Pie Chart */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={(props: any) => `${props.name} ${(props.percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '8px 12px',
                }}
                formatter={(value: number, name: string, props: any) => [
                  `$${safeNumber(props.payload.total, 0).toFixed(2)} (${props.payload.count} games)`,
                  name
                ]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Game List */}
        <div className="space-y-3">
          {chartData.map((game, index) => {
            const safeTotal = safeNumber(game.total, 0)
            return (
              <div
                key={index}
                className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 halloween:bg-gray-800 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 halloween:hover:bg-gray-700 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{game.emoji}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white halloween:text-orange-300">{game.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 halloween:text-orange-400">{game.count} games</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${safeTotal >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                    {safeTotal >= 0 ? '+' : ''}${safeTotal.toFixed(2)}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

