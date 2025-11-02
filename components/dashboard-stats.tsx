'use client'

import { TrendingUp, TrendingDown, DollarSign, Dices } from 'lucide-react'
import { safeNumber, formatCurrency } from '@/lib/utils'

interface DashboardStatsProps {
  netTotal: number
  totalWinnings: number
  totalLosses: number
  totalGames: number
}

export function DashboardStats({ netTotal, totalWinnings, totalLosses, totalGames }: DashboardStatsProps) {
  const safeNetTotal = safeNumber(netTotal, 0)
  const safeTotalWinnings = safeNumber(totalWinnings, 0)
  const safeTotalLosses = safeNumber(totalLosses, 0)
  const safeTotalGames = Math.max(0, Math.floor(safeNumber(totalGames, 0)))
  
  const isProfit = safeNetTotal >= 0

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Net Total */}
      <div className={`col-span-2 p-6 rounded-2xl ${isProfit ? 'bg-gradient-to-br from-green-500 to-emerald-600' : 'bg-gradient-to-br from-red-500 to-rose-600'} text-white shadow-xl`}>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium opacity-90">Net Total</p>
            <p className="text-3xl font-bold">{formatCurrency(safeNetTotal)}</p>
            <p className="text-xs opacity-75 flex items-center gap-1">
              {isProfit ? (
                <>
                  <TrendingUp className="w-4 h-4" />
                  You're up!
                </>
              ) : (
                <>
                  <TrendingDown className="w-4 h-4" />
                  Down this session
                </>
              )}
            </p>
          </div>
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Total Winnings */}
      <div className="p-5 bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 halloween:text-orange-300">Winnings</p>
            <div className="p-2 bg-green-100 dark:bg-green-900/30 halloween:bg-green-900/50 rounded-lg">
              <TrendingUp className="w-4 h-4 text-green-600 dark:text-green-400 halloween:text-green-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-green-600 dark:text-green-400 halloween:text-green-400">{formatCurrency(safeTotalWinnings)}</p>
        </div>
      </div>

      {/* Total Losses */}
      <div className="p-5 bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 halloween:text-orange-300">Losses</p>
            <div className="p-2 bg-red-100 dark:bg-red-900/30 halloween:bg-red-900/50 rounded-lg">
              <TrendingDown className="w-4 h-4 text-red-600 dark:text-red-400 halloween:text-red-400" />
            </div>
          </div>
          <p className="text-2xl font-bold text-red-600 dark:text-red-400 halloween:text-red-400">{formatCurrency(safeTotalLosses)}</p>
        </div>
      </div>

      {/* Total Games */}
      <div className="col-span-2 p-5 bg-gradient-to-br from-purple-500 to-pink-500 halloween:from-orange-600 halloween:to-red-700 rounded-2xl shadow-md text-white">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium opacity-90">Total Games Played</p>
            <p className="text-3xl font-bold">{safeTotalGames}</p>
          </div>
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <Dices className="w-6 h-6" />
          </div>
        </div>
      </div>
    </div>
  )
}

