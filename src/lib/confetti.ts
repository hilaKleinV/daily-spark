const COLORS = ['#C5A059', '#E3CB94', '#7A8B7B', '#B7C4B8', '#FDFBF7', '#8C8275']

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rot: number
  vr: number
  color: string
  round: boolean
}

interface Options {
  count?: number
  // Where the burst starts, as fractions of the viewport.
  origin?: { x: number; y: number }
}

// Small dependency-free confetti: a short, soft burst on a temporary canvas.
export function fireConfetti({ count = 120, origin = { x: 0.5, y: 0.6 } }: Options = {}) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const canvas = document.createElement('canvas')
  const dpr = window.devicePixelRatio || 1
  const w = window.innerWidth
  const h = window.innerHeight
  canvas.width = w * dpr
  canvas.height = h * dpr
  Object.assign(canvas.style, {
    position: 'fixed',
    inset: '0',
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: '9999',
  })
  document.body.appendChild(canvas)
  const ctx = canvas.getContext('2d')
  if (!ctx) return canvas.remove()
  ctx.scale(dpr, dpr)

  const particles: Particle[] = Array.from({ length: count }, () => {
    const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 0.9
    const speed = 6 + Math.random() * 9
    return {
      x: origin.x * w,
      y: origin.y * h,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 5 + Math.random() * 6,
      rot: Math.random() * Math.PI,
      vr: (Math.random() - 0.5) * 0.3,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      round: Math.random() < 0.35,
    }
  })

  const start = performance.now()
  const tick = (now: number) => {
    const elapsed = now - start
    ctx.clearRect(0, 0, w, h)
    const fade = Math.max(0, 1 - Math.max(0, elapsed - 2200) / 1200)
    for (const p of particles) {
      p.vy += 0.22
      p.vx *= 0.99
      p.x += p.vx
      p.y += p.vy
      p.rot += p.vr
      ctx.save()
      ctx.globalAlpha = fade
      ctx.translate(p.x, p.y)
      ctx.rotate(p.rot)
      ctx.fillStyle = p.color
      if (p.round) {
        ctx.beginPath()
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2)
        ctx.fill()
      } else {
        ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
      }
      ctx.restore()
    }
    if (elapsed < 3400) requestAnimationFrame(tick)
    else canvas.remove()
  }
  requestAnimationFrame(tick)
}
