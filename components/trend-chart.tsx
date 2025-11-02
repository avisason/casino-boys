'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format, parseISO } from 'date-fns'
import { TrendingUp } from 'lucide-react'

interface DailyBalance {
  user_id: string
  transaction_date: string
  daily_total: number
  transaction_count: number
}

interface TrendChartProps {
  dailyBalances: DailyBalance[]
}

export function TrendChart({ dailyBalances }: TrendChartProps) {
  if (!dailyBalances || dailyBalances.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500 halloween:text-orange-500" />
          Performance Trend
        </h3>
        <div className="h-64 flex items-center justify-center text-gray-400 dark:text-gray-500 halloween:text-orange-500">
          <p>No data yet. Start playing to see your trend!</p>
        </div>
      </div>
    )
  }

  // Sort by date ascending and calculate cumulative total
  const sortedData = [...dailyBalances]
    .sort((a, b) => new Date(a.transaction_date).getTime() - new Date(b.transaction_date).getTime())
    .reverse()

  let cumulativeTotal = 0
  const chartData = sortedData.reverse().map((balance) => {
    cumulativeTotal += balance.daily_total
    return {
      date: format(parseISO(balance.transaction_date), 'MMM dd'),
      amount: balance.daily_total,
      cumulative: cumulativeTotal,
    }
  })

  return (
    <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-purple-500 halloween:text-orange-500" />
          Performance Trend (Last 30 Days)
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 halloween:text-orange-300 mt-1">Cumulative balance over time</p>
      </div>

      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorCumulative" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 11, fill: '#6b7280' }}
              tickLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '8px 12px',
              }}
              formatter={(value: number) => [`$${value.toFixed(2)}`, 'Balance']}
            />
            <Area 
              type="monotone" 
              dataKey="cumulative" 
              stroke="#8b5cf6" 
              strokeWidth={3}
              fill="url(#colorCumulative)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

