const pad = (n: number) => String(n).padStart(2, '0')

// Local-date key (not UTC), so the day rolls over at her midnight.
export const dateKey = (d = new Date()) =>
  `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`

const parseKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export const addDays = (key: string, n: number) => {
  const d = parseKey(key)
  d.setDate(d.getDate() + n)
  return dateKey(d)
}

// 1 on the start date, 2 the day after, and so on (never below 1).
export const dayNumber = (startKey: string, today = new Date()) => {
  const ms = parseKey(dateKey(today)).getTime() - parseKey(startKey).getTime()
  return Math.max(1, Math.round(ms / 86_400_000) + 1)
}

export const longDate = (d = new Date()) =>
  d.toLocaleDateString('he-IL', { weekday: 'long', month: 'long', day: 'numeric' })

export const greeting = (d = new Date()) => {
  const h = d.getHours()
  if (h < 5) return 'לילה טוב'
  if (h < 12) return 'בוקר טוב'
  if (h < 18) return 'צהריים טובים'
  return 'ערב טוב'
}
