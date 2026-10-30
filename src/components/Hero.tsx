import { Flame } from 'lucide-react'
import { CONFIG } from '../config'
import { greeting, longDate } from '../lib/date'

interface Props {
  quote: { text: string; author: string }
  done: number
  total: number
  day: number
  streak: number
}

function ProgressRing({ done, total }: { done: number; total: number }) {
  const r = 52
  const circumference = 2 * Math.PI * r
  const complete = done === total

  return (
    <div
      className={`ring ${complete ? 'is-complete' : ''}`}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={total}
      aria-valuenow={done}
      aria-label={`${done} מתוך ${total} רגעים יומיים הושלמו`}
    >
      <svg viewBox="0 0 120 120">
        <circle className="ring-track" cx="60" cy="60" r={r} />
        <circle
          className="ring-fill"
          cx="60"
          cy="60"
          r={r}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - done / total)}
        />
      </svg>
      <div className="ring-label">
        <strong>
          {done}
          <span>/{total}</span>
        </strong>
        <small>רגעים</small>
      </div>
    </div>
  )
}

export function Hero({ quote, done, total, day, streak }: Props) {
  return (
    <header className="hero">
      <div className="hero-text">
        <p className="eyebrow">{longDate()}</p>
        <h1>
          {greeting()}, <em>{CONFIG.name}.</em>
        </h1>

        <blockquote className="quote">
          “{quote.text}”<cite>{quote.author}</cite>
        </blockquote>

        <div className="chips">
          <span className="chip">יום {day} של צמיחה</span>
          {streak > 1 && (
            <span className="chip chip-gold">
              <Flame size={13} strokeWidth={1.6} />
              {streak} ימים ברצף
            </span>
          )}
        </div>
      </div>

      <ProgressRing done={done} total={total} />
    </header>
  )
}
