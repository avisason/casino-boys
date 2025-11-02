'use client'

import { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { GameType, GAME_LABELS, GAME_EMOJIS } from '@/lib/types'

export function QuickAddButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessions, setSessions] = useState<any[]>([])
  const [formData, setFormData] = useState({
    session_id: '',
    game: 'blackjack' as GameType,
    amount: '',
    notes: '',
    transaction_date: new Date().toISOString().split('T')[0],
  })
  const router = useRouter()
  const supabase = createClient()

  const fetchSessions = async () => {
    const { data } = await supabase
      .from('sessions')
      .select('*')
      .eq('is_active', true)
      .order('date', { ascending: false })
    setSessions(data || [])
  }

  const handleOpen = () => {
    setIsOpen(true)
    fetchSessions()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('transactions').insert({
        user_id: user.id,
        session_id: formData.session_id,
        game: formData.game,
        amount: parseFloat(formData.amount),
        notes: formData.notes || null,
        transaction_date: formData.transaction_date,
      })

      if (error) throw error

      setIsOpen(false)
      setFormData({
        session_id: '',
        game: 'blackjack',
        amount: '',
        notes: '',
        transaction_date: new Date().toISOString().split('T')[0],
      })
      router.refresh()
    } catch (error: any) {
      console.error('Error adding transaction:', error)
      alert(error.message || 'Failed to add transaction')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleOpen}
        className="fixed bottom-24 right-4 z-40 p-4 bg-gradient-to-br from-purple-500 to-pink-500 halloween:from-orange-600 halloween:to-red-700 text-white rounded-full shadow-2xl hover:from-purple-600 hover:to-pink-600 halloween:hover:from-orange-700 halloween:hover:to-red-800 transition-all hover:scale-110"
      >
        <Plus className="w-8 h-8" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 dark:bg-black/70 halloween:bg-black/80">
          <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-6 max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-gray-800 halloween:bg-gray-900 pb-4">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white halloween:text-orange-400">Add Transaction</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 halloween:hover:bg-orange-900/30 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400 halloween:text-orange-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Session Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
                  Session *
                </label>
                {sessions.length === 0 ? (
                  <div className="p-4 bg-yellow-50 dark:bg-yellow-900/30 halloween:bg-orange-900/30 border border-yellow-200 dark:border-yellow-700 halloween:border-orange-700 rounded-xl text-sm text-yellow-800 dark:text-yellow-300 halloween:text-orange-300">
                    No active sessions. Create one first!
                  </div>
                ) : (
                  <select
                    required
                    value={formData.session_id}
                    onChange={(e) => setFormData({ ...formData, session_id: e.target.value })}
                    className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 halloween:border-orange-800 bg-white dark:bg-gray-700 halloween:bg-gray-800 text-gray-900 dark:text-white halloween:text-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 halloween:focus:ring-orange-500 focus:border-transparent transition-all"
                  >
                    <option value="">Select a session</option>
                    {sessions.map((session) => (
                      <option key={session.id} value={session.id}>
                        {session.name} - {session.location || 'No location'}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {/* Game Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
                  Game *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {Object.entries(GAME_LABELS).map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, game: key as GameType })}
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.game === key
                          ? 'border-purple-500 halloween:border-orange-500 bg-purple-50 dark:bg-purple-900/30 halloween:bg-orange-900/30'
                          : 'border-gray-200 dark:border-gray-600 halloween:border-orange-800 hover:border-gray-300 dark:hover:border-gray-500 halloween:hover:border-orange-700'
                      }`}
                    >
                      <div className="text-3xl mb-2">{GAME_EMOJIS[key as GameType]}</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white halloween:text-orange-300">{label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
                  Amount * (positive for win, negative for loss)
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
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: '-50' })}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                  >
                    -$50
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: '-100' })}
                    className="flex-1 px-3 py-2 bg-red-50 text-red-600 text-sm rounded-lg hover:bg-red-100 transition-colors"
                  >
                    -$100
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: '100' })}
                    className="flex-1 px-3 py-2 bg-green-50 text-green-600 text-sm rounded-lg hover:bg-green-100 transition-colors"
                  >
                    +$100
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: '500' })}
                    className="flex-1 px-3 py-2 bg-green-50 text-green-600 text-sm rounded-lg hover:bg-green-100 transition-colors"
                  >
                    +$500
                  </button>
                </div>
              </div>

              {/* Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.transaction_date}
                  onChange={(e) => setFormData({ ...formData, transaction_date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 halloween:border-orange-800 bg-white dark:bg-gray-700 halloween:bg-gray-800 text-gray-900 dark:text-white halloween:text-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 halloween:focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
                  Notes (optional)
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Add any details..."
                  rows={3}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 halloween:border-orange-800 bg-white dark:bg-gray-700 halloween:bg-gray-800 text-gray-900 dark:text-white halloween:text-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 halloween:focus:ring-orange-500 focus:border-transparent transition-all resize-none placeholder:text-gray-400 dark:placeholder:text-gray-500 halloween:placeholder:text-orange-600"
                />
              </div>

              <button
                type="submit"
                disabled={loading || sessions.length === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 halloween:from-orange-600 halloween:to-red-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 halloween:hover:from-orange-700 halloween:hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Adding...
                  </span>
                ) : (
                  'Add Transaction'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

