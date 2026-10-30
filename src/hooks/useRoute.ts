import { useEffect, useState } from 'react'

// Tiny hash router ("#/piano"), so it works from any static host or a plain `vite preview` with no server setup.
const read = () => window.location.hash.replace(/^#\/?/, '')

export function useRoute() {
  const [route, setRoute] = useState(read)

  useEffect(() => {
    const onChange = () => {
      setRoute(read())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  return route
}

export const href = (route: string) => `#/${route}`
