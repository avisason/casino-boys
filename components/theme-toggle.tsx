'use client'

import { Theme } from '@/lib/theme-context'
import { Sun, Moon, Ghost } from 'lucide-react'
import { useState, useEffect } from 'react'

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false)
  const [theme, setThemeState] = useState<Theme>('light')

  // Load and set up theme after mount
  useEffect(() => {
    setMounted(true)
    // Load from localStorage
    const stored = localStorage.getItem('casino-boys-theme') as Theme
    if (stored && ['light', 'dark', 'halloween'].includes(stored)) {
      setThemeState(stored)
    }
  }, [])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
    // Update DOM
    document.documentElement.classList.remove('light', 'dark', 'halloween')
    document.documentElement.classList.add(newTheme)
    // Save to localStorage
    localStorage.setItem('casino-boys-theme', newTheme)
  }

  const themes: { value: Theme; icon: React.ReactNode; label: string }[] = [
    { value: 'light', icon: <Sun className="w-5 h-5" />, label: 'Light' },
    { value: 'dark', icon: <Moon className="w-5 h-5" />, label: 'Dark' },
    { value: 'halloween', icon: <Ghost className="w-5 h-5" />, label: 'Halloween' },
  ]

  // Show a placeholder during SSR to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="flex items-center gap-1 bg-gray-100 rounded-xl p-1 w-[180px] h-[42px]">
        <div className="flex-1 h-full rounded-lg bg-gray-200 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-gray-800 halloween:bg-orange-900/30 rounded-xl p-1">
      {themes.map((t) => (
        <button
          key={t.value}
          onClick={() => setTheme(t.value)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-lg transition-all
            ${
              theme === t.value
                ? 'bg-white dark:bg-gray-700 halloween:bg-orange-600 text-gray-900 dark:text-white halloween:text-white shadow-sm'
                : 'text-gray-600 dark:text-gray-400 halloween:text-orange-300 hover:bg-white/50 dark:hover:bg-gray-700/50 halloween:hover:bg-orange-700/50'
            }
          `}
          title={t.label}
        >
          {t.icon}
          <span className="text-sm font-medium hidden sm:inline">{t.label}</span>
        </button>
      ))}
    </div>
  )
}

