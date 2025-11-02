'use client'

import { useState, useMemo } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, parseISO, startOfWeek, endOfWeek, startOfDay } from 'date-fns'
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react'
import { Transaction, GAME_EMOJIS, GAME_LABELS } from '@/lib/types'
import { safeNumber } from '@/lib/utils'

interface DailyBalance {
  user_id: string
  transaction_date: string
  daily_total: number
  transaction_count: number
}

interface CalendarViewProps {
  dailyBalances: DailyBalance[]
  transactions: Transaction[]
}

/**
 * Normalizes a date string or Date object to YYYY-MM-DD format
 * Handles various input formats and ensures consistent output
 */
function normalizeDateKey(date: string | Date): string {
  try {
    if (typeof date === 'string') {
      // If it's already in YYYY-MM-DD format, return as-is
      if (/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date
      }
      // Parse ISO string and format
      return format(parseISO(date), 'yyyy-MM-dd')
    }
    // Format Date object
    return format(startOfDay(date), 'yyyy-MM-dd')
  } catch (error) {
    console.error('Error normalizing date:', date, error)
    return ''
  }
}

export function CalendarView({ dailyBalances, transactions }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)

  // Create a normalized map of dates to balances for quick lookup
  // Key format: YYYY-MM-DD (e.g., "2025-11-02")
  const balancesByDate = useMemo(() => {
    const map = new Map<string, DailyBalance>()
    
    dailyBalances.forEach(balance => {
      const dateKey = normalizeDateKey(balance.transaction_date)
      if (dateKey) {
        map.set(dateKey, balance)
      }
    })
    
    console.log('📅 Loaded balances for dates:', Array.from(map.keys()))
    return map
  }, [dailyBalances])

  // Group transactions by date for quick lookup
  const transactionsByDate = useMemo(() => {
    const map = new Map<string, Transaction[]>()
    
    transactions.forEach(transaction => {
      const dateKey = normalizeDateKey(transaction.transaction_date)
      if (dateKey) {
        if (!map.has(dateKey)) {
          map.set(dateKey, [])
        }
        map.get(dateKey)!.push(transaction)
      }
    })
    
    return map
  }, [transactions])

  // Get transactions for selected date
  const selectedDateTransactions = useMemo(() => {
    if (!selectedDate) return []
    const dateKey = normalizeDateKey(selectedDate)
    return transactionsByDate.get(dateKey) || []
  }, [selectedDate, transactionsByDate])

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  const calendarStart = startOfWeek(monthStart)
  const calendarEnd = endOfWeek(monthEnd)

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd })

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))
  }

  /**
   * Gets the balance data for a specific calendar day
   */
  const getDayBalance = (date: Date): DailyBalance | undefined => {
    const dateKey = normalizeDateKey(date)
    return balancesByDate.get(dateKey)
  }

  /**
   * Returns CSS classes for coloring calendar day based on profit/loss
   */
  const getDayColor = (balance: number): string => {
    const safeBalance = safeNumber(balance, 0)
    if (safeBalance > 0) return 'bg-green-500 text-white'
    if (safeBalance < 0) return 'bg-red-500 text-white'
    return 'bg-gray-200 text-gray-700'
  }

  return (
    <div className="space-y-4">
      {/* Calendar Card */}
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
        {/* Month Navigation */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white halloween:text-orange-400 flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-purple-500 halloween:text-orange-500" />
            {format(currentDate, 'MMMM yyyy')}
          </h2>
          <div className="flex gap-2">
            <button
              onClick={previousMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 halloween:hover:bg-orange-900/30 rounded-lg transition-colors"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600 dark:text-gray-400 halloween:text-orange-400" />
            </button>
            <button
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 halloween:hover:bg-orange-900/30 rounded-lg transition-colors"
            >
              <ChevronRight className="w-5 h-5 text-gray-600 dark:text-gray-400 halloween:text-orange-400" />
            </button>
          </div>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-xs font-semibold text-gray-500 dark:text-gray-400 halloween:text-orange-400 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((day, index) => {
            const balance = getDayBalance(day)
            const isCurrentMonth = isSameMonth(day, currentDate)
            const isTodayDate = isToday(day)
            const isSelected = selectedDate && format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')

            return (
              <button
                key={index}
                onClick={() => setSelectedDate(day)}
                disabled={!isCurrentMonth}
                className={`
                  aspect-square p-1 rounded-lg text-sm font-medium transition-all
                  ${!isCurrentMonth ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105'}
                  ${isTodayDate && !balance ? 'ring-2 ring-purple-500 halloween:ring-orange-500' : ''}
                  ${isSelected ? 'ring-2 ring-blue-500 halloween:ring-orange-400 scale-105' : ''}
                  ${balance ? getDayColor(balance.daily_total) : 'bg-gray-50 dark:bg-gray-700 halloween:bg-gray-800 text-gray-700 dark:text-gray-300 halloween:text-orange-300'}
                `}
              >
                <div className="flex flex-col items-center justify-center h-full">
                  <span>{format(day, 'd')}</span>
                  {balance && (
                    <span className="text-[9px] font-bold mt-0.5">
                      ${Math.abs(safeNumber(balance.daily_total, 0)).toFixed(0)}
                    </span>
                  )}
                </div>
              </button>
            )
          })}
        </div>

        {/* Legend */}
        <div className="flex justify-center gap-4 mt-6 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-green-500"></div>
            <span className="text-gray-600 dark:text-gray-400 halloween:text-orange-300">Winning Day</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-red-500"></div>
            <span className="text-gray-600 dark:text-gray-400 halloween:text-orange-300">Losing Day</span>
          </div>
        </div>
      </div>

      {/* Selected Day Details */}
      {selectedDate && (
        <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white halloween:text-orange-400 mb-4">
            {format(selectedDate, 'EEEE, MMMM d, yyyy')}
          </h3>

          {selectedDateTransactions.length > 0 ? (
            <div className="space-y-3">
              {selectedDateTransactions.map((transaction) => {
                const safeAmount = safeNumber(transaction.amount, 0)
                const isWin = safeAmount > 0
                return (
                  <div
                    key={transaction.id}
                    className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 halloween:bg-gray-800 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{GAME_EMOJIS[transaction.game]}</span>
                      <div>
                        <p className="font-semibold text-gray-900 dark:text-white halloween:text-orange-300">
                          {GAME_LABELS[transaction.game]}
                        </p>
                        {transaction.notes && (
                          <p className="text-xs text-gray-500 dark:text-gray-400 halloween:text-orange-400">{transaction.notes}</p>
                        )}
                      </div>
                    </div>
                    <span className={`text-lg font-bold ${isWin ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                      {isWin ? '+' : ''}${safeAmount.toFixed(2)}
                    </span>
                  </div>
                )
              })}
              
              {/* Daily Total */}
              <div className="border-t border-gray-200 dark:border-gray-600 halloween:border-orange-900 pt-3 mt-3">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-gray-900 dark:text-white halloween:text-orange-300">Daily Total</span>
                  <span className={`text-xl font-bold ${
                    (() => {
                      const total = selectedDateTransactions.reduce((sum, t) => sum + safeNumber(t.amount, 0), 0)
                      return safeNumber(total, 0) >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    })()
                  }`}>
                    ${(() => {
                      const total = selectedDateTransactions.reduce((sum, t) => sum + safeNumber(t.amount, 0), 0)
                      return safeNumber(total, 0).toFixed(2)
                    })()}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500 halloween:text-orange-500">
              <p>No transactions on this day</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

