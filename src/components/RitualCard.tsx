import type { ReactNode } from 'react'
import { ArrowLeft, ArrowRight, Check, Shuffle } from 'lucide-react'
import type { RitualId } from '../content'
import { href } from '../hooks/useRoute'
import { SafeImage } from './SafeImage'

interface Props {
  id: RitualId
  label: string
  badge?: string
  icon: ReactNode
  image: { src: string; alt: string }
  title: string
  done: boolean
  onToggle: () => void
  // "Draw another" button (the piano page has its own, inside the song picker).
  draw?: { label: string; onDraw: () => void }
  // Where the "next" link goes: another ritual, or home after the last one.
  next: { route: string; label: string }
  children: ReactNode
}

// A ritual's dedicated, full-screen page.
export function RitualCard({ id, label, badge, icon, image, title, done, onToggle, draw, next, children }: Props) {
  return (
    <div className={`rp ritual-${id} ${done ? 'is-done' : ''}`}>
      <div className="rp-back-bar">
        <a href={href('')} className="rp-back">
          <ArrowRight size={16} strokeWidth={1.6} />
          חזרה להיום
        </a>
      </div>
      <div className="rp-hero">
        <SafeImage src={image.src} alt={image.alt} />
      </div>

      <div className="rp-body">
        <div className="rp-tags">
          <span className="rp-label">
            {icon}
            {label}
          </span>
          {badge && <span className="rp-badge">{badge}</span>}
        </div>

        <h1 className="rp-title">{title}</h1>
        <div className="rp-content">{children}</div>

        {draw && (
          <button type="button" className="pill-btn pill-btn-lg" onClick={draw.onDraw}>
            <Shuffle size={16} />
            {draw.label}
          </button>
        )}

        <div className="rp-footer">
          <button type="button" className="complete-btn" aria-pressed={done} onClick={onToggle}>
            <span className="complete-check">
              <Check size={16} strokeWidth={2.2} />
            </span>
            {done ? 'הושלם' : 'סמני כהושלם'}
          </button>

          <a href={href(next.route)} className="next-link">
            {next.label}
            <ArrowLeft size={16} strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </div>
  )
}
