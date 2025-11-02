'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'

export type Theme = 'light' | 'dark' | 'halloween'

interface ThemeContextType {
  theme: Theme
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>('light')
  const [mounted, setMounted] = useState(false)

  // Load theme from localStorage on mount
  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem('casino-boys-theme') as Theme
    if (stored && ['light', 'dark', 'halloween'].includes(stored)) {
      setThemeState(stored)
    }
  }, [])

  // Apply theme class to document and save to localStorage
  useEffect(() => {
    if (!mounted) return

    // Remove all theme classes
    document.documentElement.classList.remove('light', 'dark', 'halloween')
    // Add current theme class
    document.documentElement.classList.add(theme)
    // Save to localStorage
    localStorage.setItem('casino-boys-theme', theme)
  }, [theme, mounted])

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme)
  }

  // Prevent flash of unstyled content
  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    // During SSR or if provider is missing, return a default
    if (typeof window === 'undefined') {
      return { theme: 'light' as Theme, setTheme: () => {} }
    }
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}

