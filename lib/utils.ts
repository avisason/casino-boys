import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Safely parse and validate a number, preventing NaN and Infinity
 * @param value - Value to parse as a number
 * @param defaultValue - Default value if parsing fails (default: 0)
 * @returns A valid finite number or the default value
 */
export function safeNumber(value: any, defaultValue: number = 0): number {
  if (value === null || value === undefined) return defaultValue
  const num = typeof value === 'number' ? value : parseFloat(value)
  return isNaN(num) || !isFinite(num) ? defaultValue : num
}

export function formatCurrency(amount: number): string {
  const safeAmount = safeNumber(amount, 0)
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    signDisplay: 'exceptZero'
  }).format(safeAmount)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(date))
}

export function formatShortDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric'
  }).format(new Date(date))
}

export function getAmountColor(amount: number): string {
  if (amount > 0) return 'text-green-500'
  if (amount < 0) return 'text-red-500'
  return 'text-gray-500'
}

export function getAmountBgColor(amount: number): string {
  if (amount > 0) return 'bg-green-500/10'
  if (amount < 0) return 'bg-red-500/10'
  return 'bg-gray-500/10'
}

