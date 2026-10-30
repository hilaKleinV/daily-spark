import { useEffect, useRef, useState } from 'react'
import { Pause, Play, RotateCcw } from 'lucide-react'

interface Props {
  minutes: number
  // inhale, hold, exhale, hold (seconds; 0 skips that phase)
  pattern: [number, number, number, number]
  onComplete: () => void
}

const PHASES = ['שאיפה', 'החזקה', 'נשיפה', 'החזקה'] as const

function chime() {
  try {
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type = 'sine'
    osc.frequency.value = 528
    gain.gain.setValueAtTime(0.0001, ctx.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.18, ctx.currentTime + 0.05)
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 2.4)
    osc.connect(gain).connect(ctx.destination)
    osc.start()
    osc.stop(ctx.currentTime + 2.5)
  } catch {
    // audio not available: silent finish is fine
  }
}

// Which breathing phase we are in at `elapsed` seconds, and how long is left in it.
function phaseAt(elapsed: number, pattern: Props['pattern']) {
  const cycle = pattern.reduce((a, b) => a + b, 0)
  let t = elapsed % cycle
  for (let i = 0; i < 4; i++) {
    if (pattern[i] === 0) continue
    if (t < pattern[i]) return { index: i, left: pattern[i] - t, length: pattern[i] }
    t -= pattern[i]
  }
  return { index: 0, left: pattern[0], length: pattern[0] }
}

const clock = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`

export function Meditation({ minutes, pattern, onComplete }: Props) {
  const total = minutes * 60
  const [elapsed, setElapsed] = useState(0)
  const [running, setRunning] = useState(false)
  const elapsedRef = useRef(0)

  useEffect(() => {
    if (!running) return
    const timer = window.setInterval(() => {
      elapsedRef.current += 1
      setElapsed(elapsedRef.current)
      if (elapsedRef.current >= total) {
        window.clearInterval(timer)
        setRunning(false)
        chime()
        onComplete()
      }
    }, 1000)
    return () => window.clearInterval(timer)
  }, [running, total, onComplete])

  const reset = () => {
    elapsedRef.current = 0
    setElapsed(0)
  }

  const started = elapsed > 0 || running
  const finished = elapsed >= total
  const { index, left, length } = phaseAt(elapsed, pattern)
  // Full circle after an inhale, small after an exhale; the CSS transition does the breathing.
  const expanded = running && (index === 0 || index === 1)
  const label = !started ? 'מוכנה' : finished ? 'כל הכבוד' : PHASES[index]

  return (
    <div className="meditation">
      <div className="breath-stage" aria-live="polite">
        <div
          className={`breath-circle ${expanded ? 'is-expanded' : ''}`}
          style={{ transitionDuration: running && (index === 0 || index === 2) ? `${length}s` : '0.6s' }}
        />
        <div className="breath-text">
          <span className="breath-phase">{label}</span>
          {running && <span className="breath-count">{left}</span>}
        </div>
      </div>

      <div className="timer-row">
        <span className="timer-clock">{clock(Math.max(0, total - elapsed))}</span>
        <div className="timer-actions">
          <button
            type="button"
            className="pill-btn"
            onClick={() => {
              if (finished) reset()
              setRunning((r) => !r)
            }}
          >
            {running ? <Pause size={14} /> : <Play size={14} />}
            {running ? 'השהיה' : started && !finished ? 'המשיכי' : 'התחילי'}
          </button>
          {started && (
            <button
              type="button"
              className="icon-btn"
              aria-label="איפוס"
              onClick={() => {
                setRunning(false)
                reset()
              }}
            >
              <RotateCcw size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
