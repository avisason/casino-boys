'use client'

import { Budget } from '@/lib/types'
import { DollarSign, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react'
import Link from 'next/link'

interface BudgetStatusProps {
  budgets: Budget[]
  periodSpending: { weekly: number; monthly: number }
}

export function BudgetStatus({ budgets, periodSpending }: BudgetStatusProps) {
  if (budgets.length === 0) {
    return (
      <Link href="/settings">
        <div className="bg-purple-50 dark:bg-purple-900/20 halloween:bg-orange-900/20 border-2 border-purple-200 dark:border-purple-800 halloween:border-orange-700 rounded-2xl p-4 hover:border-purple-300 dark:hover:border-purple-700 halloween:hover:border-orange-600 transition-colors cursor-pointer">
          <div className="flex items-center gap-3">
            <DollarSign className="w-8 h-8 text-purple-500 halloween:text-orange-500" />
            <div className="flex-1">
              <p className="text-sm font-medium text-purple-900 dark:text-purple-300 halloween:text-orange-300">
                No Budget Set
              </p>
              <p className="text-xs text-purple-700 dark:text-purple-400 halloween:text-orange-400">
                Tap to create a budget and track your spending
              </p>
            </div>
          </div>
        </div>
      </Link>
    )
  }

  return (
    <div className="space-y-3">
      {budgets.map((budget) => {
        const spent = budget.period_type === 'weekly' ? periodSpending.weekly : periodSpending.monthly
        const remaining = budget.amount - spent
        const percentUsed = (spent / budget.amount) * 100
        
        const isOverBudget = remaining < 0
        const isNearLimit = percentUsed >= 80 && !isOverBudget
        const isHealthy = percentUsed < 80

        return (
          <div
            key={budget.id}
            className={`rounded-2xl p-4 border-2 ${
              isOverBudget
                ? 'bg-red-50 dark:bg-red-900/20 halloween:bg-red-900/20 border-red-300 dark:border-red-800 halloween:border-red-700'
                : isNearLimit
                ? 'bg-yellow-50 dark:bg-yellow-900/20 halloween:bg-yellow-900/20 border-yellow-300 dark:border-yellow-800 halloween:border-yellow-700'
                : 'bg-green-50 dark:bg-green-900/20 halloween:bg-green-900/20 border-green-300 dark:border-green-800 halloween:border-green-700'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                {isOverBudget ? (
                  <AlertTriangle className="w-5 h-5 text-red-500 dark:text-red-400" />
                ) : isNearLimit ? (
                  <TrendingUp className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
                ) : (
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                )}
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white halloween:text-orange-300 capitalize">
                    {budget.period_type} Budget
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 halloween:text-orange-400">
                    {new Date(budget.start_date).toLocaleDateString()} - {new Date(budget.end_date).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className={`text-lg font-bold ${
                  isOverBudget
                    ? 'text-red-600 dark:text-red-400'
                    : isNearLimit
                    ? 'text-yellow-600 dark:text-yellow-400'
                    : 'text-green-600 dark:text-green-400'
                }`}>
                  ${Math.abs(remaining).toFixed(2)}
                </p>
                <p className="text-xs text-gray-600 dark:text-gray-400 halloween:text-orange-400">
                  {isOverBudget ? 'over budget' : 'remaining'}
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="relative">
              <div className="h-2 bg-gray-200 dark:bg-gray-700 halloween:bg-gray-800 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${
                    isOverBudget
                      ? 'bg-red-500'
                      : isNearLimit
                      ? 'bg-yellow-500'
                      : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(percentUsed, 100)}%` }}
                />
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-600 dark:text-gray-400 halloween:text-orange-400">
                <span>${spent.toFixed(2)} spent</span>
                <span>${budget.amount.toFixed(2)} budget</span>
              </div>
            </div>

            {/* Warning Message */}
            {isOverBudget && (
              <div className="mt-2 text-xs text-red-700 dark:text-red-400 halloween:text-red-400">
                ⚠️ You've exceeded your budget! Consider reducing spending.
              </div>
            )}
            {isNearLimit && (
              <div className="mt-2 text-xs text-yellow-700 dark:text-yellow-400 halloween:text-yellow-400">
                ⚠️ You're close to your limit. {percentUsed.toFixed(0)}% used.
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

