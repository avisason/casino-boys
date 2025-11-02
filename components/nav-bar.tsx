'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Calendar, BarChart3, Settings, Dices } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/calendar', icon: Calendar, label: 'Calendar' },
  { href: '/sessions', icon: Dices, label: 'Sessions' },
  { href: '/settings', icon: Settings, label: 'Settings' },
]

export function NavBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 halloween:bg-gray-950 border-t border-gray-200 dark:border-gray-800 halloween:border-orange-900 safe-area-inset-bottom">
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around px-2 py-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex flex-col items-center justify-center flex-1 py-2 px-3 rounded-xl transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-br from-purple-500 to-pink-500 halloween:from-orange-600 halloween:to-red-700 text-white shadow-lg scale-105'
                    : 'text-gray-600 dark:text-gray-400 halloween:text-orange-400 hover:bg-gray-100 dark:hover:bg-gray-800 halloween:hover:bg-orange-900/30'
                )}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

