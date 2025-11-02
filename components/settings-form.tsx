'use client'

import { useState } from 'react'
import { Profile } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { User, Mail, Loader2, Save, LogOut } from 'lucide-react'

interface SettingsFormProps {
  profile: Profile | null
}

export function SettingsForm({ profile }: SettingsFormProps) {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    full_name: profile?.full_name || '',
  })
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: formData.full_name || null,
        })
        .eq('id', user.id)

      if (error) throw error

      alert('Profile updated successfully!')
      router.refresh()
    } catch (error: any) {
      console.error('Error updating profile:', error)
      alert(error.message || 'Failed to update profile')
    } finally {
      setLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <div className="space-y-6">
      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-purple-500 halloween:text-orange-500" />
          Profile Information
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
              Full Name
            </label>
            <input
              type="text"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-600 halloween:border-orange-800 bg-white dark:bg-gray-700 halloween:bg-gray-800 text-gray-900 dark:text-white halloween:text-orange-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 halloween:focus:ring-orange-500 focus:border-transparent transition-all placeholder:text-gray-400 dark:placeholder:text-gray-500 halloween:placeholder:text-orange-600"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 halloween:text-orange-300 mb-2">
              Email Address
            </label>
            <div className="flex items-center gap-3 px-4 py-3 bg-gray-50 dark:bg-gray-700 halloween:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-600 halloween:border-orange-800">
              <Mail className="w-5 h-5 text-gray-400 dark:text-gray-500 halloween:text-orange-400" />
              <span className="text-gray-700 dark:text-gray-300 halloween:text-orange-300">{profile?.email}</span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 halloween:text-orange-500 mt-2">
              Email address cannot be changed
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 halloween:from-orange-600 halloween:to-red-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 halloween:hover:from-orange-700 halloween:hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </form>
      </div>

      {/* Account Actions */}
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 mb-4">Account Actions</h2>
        
        <button
          onClick={handleSignOut}
          className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-red-50 dark:bg-red-900/30 halloween:bg-red-900/50 text-red-600 dark:text-red-400 halloween:text-red-400 rounded-xl font-semibold hover:bg-red-100 dark:hover:bg-red-900/50 halloween:hover:bg-red-900/70 transition-all"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>

      {/* App Info */}
      <div className="bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 halloween:border-orange-900 p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white halloween:text-orange-400 mb-4">About</h2>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400 halloween:text-orange-300">
          <p><strong className="dark:text-white halloween:text-orange-300">Casino Boys</strong> - Version 1.0.0</p>
          <p>Track your casino adventures with friends!</p>
          <p className="text-xs text-gray-500 dark:text-gray-500 halloween:text-orange-500 mt-4">
            Built with Next.js, TypeScript, and Supabase
          </p>
        </div>
      </div>
    </div>
  )
}

