import { useCallback, useEffect, useState } from 'react'
import { dateKey } from '../lib/date'

// useState that survives refreshes via localStorage. Falls back to memory if storage is unavailable.
export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // storage full or blocked: keep working in memory
    }
  }, [key, value])

  return [value, setValue] as const
}

// The current local date key, refreshed when the tab returns to focus or midnight passes.
export function useToday() {
  const [today, setToday] = useState(() => dateKey())

  useEffect(() => {
    const refresh = () => setToday(dateKey())
    const timer = window.setInterval(refresh, 60_000)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      window.clearInterval(timer)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])

  return today
}

export function useToggleMap<K extends string>(storageKey: string) {
  const [map, setMap] = usePersisted<Record<string, Partial<Record<K, boolean>>>>(storageKey, {})

  const toggle = useCallback(
    (day: string, id: K, force?: boolean) =>
      setMap((prev) => ({
        ...prev,
        [day]: { ...prev[day], [id]: force ?? !prev[day]?.[id] },
      })),
    [setMap],
  )

  return [map, toggle] as const
}
