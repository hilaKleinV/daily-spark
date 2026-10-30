import type { ReactNode } from 'react'
import { Check } from 'lucide-react'
import type { RitualId } from '../content'
import { href } from '../hooks/useRoute'
import { SafeImage } from './SafeImage'

interface Props {
  id: RitualId
  label: string
  icon: ReactNode
  image: { src: string; alt: string }
  title: string
  teaser: string
  done: boolean
}

// The home-screen entry for a ritual: a clickable card that opens its own page.
export function RitualTile({ id, label, icon, image, title, teaser, done }: Props) {
  return (
    <a href={href(id)} className={`card tile ritual-${id} ${done ? 'is-done' : ''}`}>
      <div className="card-media">
        <SafeImage src={image.src} alt={image.alt} />
        <span className="card-label">
          {icon}
          {label}
        </span>
        {done && (
          <span className="tile-done" aria-label="הושלם">
            <Check size={14} strokeWidth={2.2} />
          </span>
        )}
      </div>
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p className="tile-teaser">{teaser}</p>
      </div>
    </a>
  )
}
