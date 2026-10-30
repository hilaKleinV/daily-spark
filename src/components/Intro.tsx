import { useState } from 'react'
import { Gift, Sparkles } from 'lucide-react'
import { CONFIG } from '../config'
import { fireConfetti } from '../lib/confetti'

// Soft, fixed positions for the drifting sparkles (no randomness, so renders are stable).
const SPARKS = [
  { left: '8%', top: '18%', size: 14, delay: 0 },
  { left: '88%', top: '14%', size: 18, delay: 1.2 },
  { left: '18%', top: '78%', size: 12, delay: 2.1 },
  { left: '80%', top: '72%', size: 16, delay: 0.6 },
  { left: '50%', top: '8%', size: 10, delay: 1.8 },
  { left: '92%', top: '46%', size: 10, delay: 2.6 },
  { left: '5%', top: '48%', size: 12, delay: 3.1 },
]

export function Intro({ onEnter }: { onEnter: () => void }) {
  const [leaving, setLeaving] = useState(false)
  const { intro } = CONFIG

  const open = () => {
    setLeaving(true)
    fireConfetti({ count: 170, origin: { x: 0.5, y: 0.65 } })
    window.setTimeout(onEnter, 900)
  }

  return (
    <section className={`intro ${leaving ? 'is-leaving' : ''}`}>
      {SPARKS.map((s, i) => (
        <Sparkles
          key={i}
          className="intro-spark"
          size={s.size}
          strokeWidth={1.2}
          style={{ left: s.left, top: s.top, animationDelay: `${s.delay}s` }}
        />
      ))}

      <div className="intro-inner">
        <p className="eyebrow intro-in" style={{ animationDelay: '0.2s' }}>
          {intro.eyebrow}
        </p>
        <h1 className="intro-title intro-in" style={{ animationDelay: '0.5s' }}>
          {intro.title},
        </h1>
        <p className="intro-name intro-in" style={{ animationDelay: '0.9s' }}>
          {CONFIG.name}
        </p>
        <span className="intro-rule intro-in" style={{ animationDelay: '1.3s' }} />
        <p className="intro-letter intro-in" style={{ animationDelay: '1.6s' }}>
          {intro.letter}
        </p>
        <p className="intro-sign intro-in" style={{ animationDelay: '2s' }}>
          {intro.signature}
        </p>
        <button type="button" className="intro-btn intro-in" style={{ animationDelay: '2.4s' }} onClick={open}>
          <Gift size={16} strokeWidth={1.5} />
          {intro.button}
        </button>
      </div>
    </section>
  )
}
