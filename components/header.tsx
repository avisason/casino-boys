'use client'

import { Profile } from '@/lib/types'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { ThemeToggle } from './theme-toggle'

interface HeaderProps {
  profile: Profile
  title?: string
}

export function Header({ profile, title }: HeaderProps) {
  const router = useRouter()
  const supabase = createClient()
  const [showMenu, setShowMenu] = useState(false)

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="bg-white dark:bg-gray-900 halloween:bg-gray-900 border-b border-gray-200 dark:border-gray-800 halloween:border-orange-900 sticky top-0 z-40 transition-colors">
      <div className="max-w-md mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1">
            {title && <h1 className="text-2xl font-bold text-gray-900 dark:text-white halloween:text-orange-400">{title}</h1>}
          </div>
          
          <ThemeToggle />
          
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 halloween:from-orange-600 halloween:to-red-600 text-white hover:from-purple-600 hover:to-pink-600 halloween:hover:from-orange-700 halloween:hover:to-red-700 transition-all duration-200 shadow-md"
            >
              {profile.avatar_url ? (
                <img
                  src={profile.avatar_url}
                  alt={profile.full_name || profile.email}
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
              <span className="text-sm font-medium hidden sm:inline">
                {profile.full_name || 'Account'}
              </span>
            </button>

            {showMenu && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setShowMenu(false)}
                />
                <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-800 halloween:bg-gray-900 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 halloween:border-orange-900 overflow-hidden z-50">
                  <div className="p-4 border-b border-gray-100 dark:border-gray-700 halloween:border-orange-900">
                    <p className="font-semibold text-gray-900 dark:text-white halloween:text-orange-400">
                      {profile.full_name || 'User'}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 halloween:text-orange-300">{profile.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-600 dark:text-red-400 halloween:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 halloween:hover:bg-red-900/30 transition-colors"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Sign Out</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

