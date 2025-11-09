'use client'

import { useState } from 'react'
import { Budget } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { DollarSign, Calendar, Loader2, Plus, Trash2, AlertTriangle } from 'lucide-react'

interface BudgetManagerProps {
  budgets: Budget[]
  userId: string
}

export function BudgetManager({ budgets: initialBudgets, userId }: BudgetManagerProps) {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets)
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [formData, setFormData] = useState({
    period_type: 'monthly' as 'weekly' | 'monthly',
    amount: '',
  })
  const router = useRouter()
  const supabase = createClient()

  const calculatePeriodDates = (periodType: 'weekly' | 'monthly') => {
    const now = new Date()
    const startDate = new Date(now)
    const endDate = new Date(now)

    if (periodType === 'weekly') {
      // Start of current week (Sunday)
      startDate.setDate(now.getDate() - now.getDay())
      endDate.setDate(startDate.getDate() + 6)
    } else {
      // Start of current month
      startDate.setDate(1)
      endDate.setMonth(startDate.getMonth() + 1)
      endDate.setDate(0) // Last day of month
    }

    return {
      start_date: startDate.toISOString().split('T')[0],
      end_date: endDate.toISOString().split('T')[0],
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const dates = calculatePeriodDates(formData.period_type)
      
      const { data, error } = await supabase
        .from('budgets')
        .insert({
          user_id: userId,
          period_type: formData.period_type,
          amount: parseFloat(formData.amount),
          ...dates,
          is_active: true,
        })
        .select()
        .single()

      if (error) throw error

      setBudgets([...budgets, data])
      setFormData({ period_type: 'monthly', amount: '' })
      setShowForm(false)
      router.refresh()
    } catch (error: any) {
      console.error('Error creating budget:', error)
      alert(error.message || 'Failed to create budget')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (budgetId: string) => {
    if (!confirm('Are you sure you want to delete this budget?')) return

    try {
      const { error } = await supabase
        .from('budgets')
        .delete()
        .eq('id', budgetId)

      if (error) throw error

      setBudgets(budgets.filter(b => b.id !== budgetId))
      router.refresh()
    } catch (error: any) {
      console.error('Error deleting budget:', error)
      alert(error.message || 'Failed to delete budget')
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 flex items-center gap-2">
          <DollarSign className="w-5 h-5 text-purple-500 halloween:text-orange-500" />
          Budget Management
        </h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 halloween:hover:bg-orange-900/30 rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5 text-purple-500 halloween:text-orange-500" />
        </button>
      </div>

      {/* Active Budgets */}
      {budgets.length > 0 ? (
        <div className="space-y-3 mb-4">
          {budgets.map((budget) => (
            <div
              key={budget.id}
              className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 halloween:bg-gray-800 rounded-xl"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="w-4 h-4 text-gray-500 dark:text-gray-400 halloween:text-orange-400" />
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 capitalize">
                    {budget.period_type} Budget
                  </span>
                </div>
                <p className="text-2xl font-bold text-gray-900 dark:text-white halloween:text-orange-400">
                  ${budget.amount.toFixed(2)}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 halloween:text-orange-500 mt-1">
                  {new Date(budget.start_date).toLocaleDateString()} - {new Date(budget.end_date).toLocaleDateString()}
                </p>
              </div>
              <button
                onClick={() => handleDelete(budget.id)}
                className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 halloween:hover:bg-red-900/30 rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4 text-red-500 dark:text-red-400" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-400 dark:text-gray-500 halloween:text-orange-500 mb-4">
          <AlertTriangle className="w-12 h-12 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No budgets set. Create one to track your spending!</p>
        </div>
      )}

      {/* Add Budget Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="space-y-4 pt-4 border-t border-gray-200 dark:border-gray-700 halloween:border-orange-900">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
              Budget Period
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, period_type: 'weekly' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.period_type === 'weekly'
                    ? 'border-purple-500 halloween:border-orange-500 bg-purple-50 dark:bg-purple-900/30 halloween:bg-orange-900/30'
                    : 'border-gray-200 dark:border-gray-600 halloween:border-orange-800'
                }`}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white halloween:text-orange-300">Weekly</div>
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, period_type: 'monthly' })}
                className={`p-3 rounded-lg border-2 transition-all ${
                  formData.period_type === 'monthly'
                    ? 'border-purple-500 halloween:border-orange-500 bg-purple-50 dark:bg-purple-900/30 halloween:bg-orange-900/30'
                    : 'border-gray-200 dark:border-gray-600 halloween:border-orange-800'
                }`}
              >
                <div className="text-sm font-medium text-gray-900 dark:text-white halloween:text-orange-300">Monthly</div>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
              Budget Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 halloween:text-orange-400 font-semibold">
                $
              </span>
              <input
                type="number"
                step="0.01"
                required
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                className="w-full pl-8 pr-4 py-3 border-2 border-gray-200 dark:border-gray-600 halloween:border-orange-800 bg-white dark:bg-gray-700 halloween:bg-gray-800 text-gray-900 dark:text-white halloween:text-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 halloween:focus:ring-orange-500 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 halloween:from-orange-600 halloween:to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 halloween:hover:from-orange-700 halloween:hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Budget'
              )}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="px-6 py-3 bg-gray-100 dark:bg-gray-700 halloween:bg-gray-800 text-gray-700 dark:text-gray-300 halloween:text-orange-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 halloween:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

