'use client'

import { useState } from 'react'
import { Plus, X, Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function CreateSessionButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: new Date().toISOString().split('T')[0],
  })
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase.from('sessions').insert({
        name: formData.name,
        location: formData.location || null,
        date: formData.date,
        created_by: user.id,
      })

      if (error) throw error

      setIsOpen(false)
      setFormData({ name: '', location: '', date: new Date().toISOString().split('T')[0] })
      router.refresh()
    } catch (error: any) {
      console.error('Error creating session:', error)
      alert(error.message || 'Failed to create session')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-3 bg-gradient-to-br from-purple-500 to-pink-500 halloween:from-orange-600 halloween:to-red-700 text-white rounded-xl shadow-lg hover:from-purple-600 hover:to-pink-600 halloween:hover:from-orange-700 halloween:hover:to-red-800 transition-all"
      >
        <Plus className="w-6 h-6" />
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/50 dark:bg-black/70 halloween:bg-black/80">
          <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-t-3xl sm:rounded-3xl w-full max-w-md p-6 space-y-6 animate-slide-up">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white halloween:text-orange-400">New Session</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 halloween:hover:bg-orange-900/30 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500 dark:text-gray-400 halloween:text-orange-400" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
                  Session Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., Vegas Trip 2024"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 halloween:border-orange-800 bg-white dark:bg-gray-700 halloween:bg-gray-800 text-gray-900 dark:text-white halloween:text-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 halloween:focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 halloween:placeholder:text-orange-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Bellagio Casino"
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 halloween:border-orange-800 bg-white dark:bg-gray-700 halloween:bg-gray-800 text-gray-900 dark:text-white halloween:text-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 halloween:focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 halloween:placeholder:text-orange-600"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 halloween:border-orange-800 bg-white dark:bg-gray-700 halloween:bg-gray-800 text-gray-900 dark:text-white halloween:text-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 halloween:focus:ring-orange-500 focus:border-transparent transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 halloween:from-orange-600 halloween:to-red-700 text-white px-6 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 halloween:hover:from-orange-700 halloween:hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  'Create Session'
                )}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

