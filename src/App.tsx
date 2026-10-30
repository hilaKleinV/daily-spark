import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react'
import { BookOpen, ExternalLink, Gift, Library, Music, Sparkles, Wind } from 'lucide-react'
import { CONFIG } from './config'
import { contentFor, POOLS, type RitualId } from './content'
import { addDays, dayNumber } from './lib/date'
import { fireConfetti } from './lib/confetti'
import { usePersisted, useToday, useToggleMap } from './hooks/usePersisted'
import { href, useRoute } from './hooks/useRoute'
import { Hero } from './components/Hero'
import { Intro } from './components/Intro'
import { Archive } from './components/Archive'
import { Journal } from './components/Journal'
import { Meditation } from './components/Meditation'
import { RitualCard } from './components/RitualCard'
import { RitualTile } from './components/RitualTile'
import { SongPicker } from './components/SongPicker'

const RITUALS: RitualId[] = ['knowledge', 'piano', 'writing', 'meditation']
const ICON = { size: 14, strokeWidth: 1.5 }

type DrawId = 'knowledge' | 'writing' | 'meditation'

const DRAW_LABEL: Partial<Record<RitualId, string>> = {
  knowledge: 'עוד עובדה',
  writing: 'שאלה אחרת',
  meditation: 'תרגיל אחר',
}

const randomOther = (size: number, current: number) => {
  let next = current
  while (next === current) next = Math.floor(Math.random() * size)
  return next
}

const INTRO_KEY = 'dailyspark:intro-seen'

function App() {
  const [entered, setEntered] = useState(() => sessionStorage.getItem(INTRO_KEY) === '1')
  const today = useToday()
  const route = useRoute()
  const [progress, toggle] = useToggleMap<RitualId>('dailyspark:progress')
  const [journal, setJournal] = usePersisted<Record<string, string>>('dailyspark:journal', {})

  const [photos, setPhotos] = usePersisted<Record<string, string>>('dailyspark:photos', {})

  const content = contentFor()
  const weekday = new Date().getDay()

  // "Draw another": today's picks are kept per ritual, as indexes into POOLS (default = today's weekday item).
  const [draws, setDraws] = usePersisted<{ day: string; picks: Partial<Record<RitualId, number>> }>(
    'dailyspark:draws',
    { day: '', picks: {} },
  )
  const picks = draws.day === today ? draws.picks : {}
  const pickOf = (id: DrawId) => picks[id] ?? weekday
  const drawAnother = (id: DrawId) => {
    const size = POOLS[id].length
    const current = pickOf(id)
    const next = randomOther(size, current)
    setDraws({ day: today, picks: { ...picks, [id]: next } })
  }
  const day = dayNumber(CONFIG.startDate)
  const done = progress[today] ?? {}
  const doneCount = RITUALS.filter((id) => done[id]).length

  // Consecutive days with at least one ritual, counting back from today (or yesterday).
  let streak = 0
  let cursor = doneCount > 0 ? today : addDays(today, -1)
  while (Object.values(progress[cursor] ?? {}).some(Boolean)) {
    streak++
    cursor = addDays(cursor, -1)
  }

  // Celebrate only when she completes the last ritual, not when reopening a finished day.
  const prevCount = useRef(doneCount)
  const [celebrating, setCelebrating] = useState(false)
  useEffect(() => {
    if (doneCount === RITUALS.length && prevCount.current < RITUALS.length) {
      fireConfetti({ count: 150 })
      setCelebrating(true)
    }
    prevCount.current = doneCount
  }, [doneCount])

  const markDone = useCallback((id: RitualId) => toggle(today, id, true), [toggle, today])
  const onMeditationDone = useCallback(() => markDone('meditation'), [markDone])
  // Her answer is kept per prompt, so drawing another question never overwrites an earlier one.
  const journalKey = `${today}#${draws.day === today ? (draws.picks.writing ?? weekday) : weekday}`
  const savePhoto = useCallback(
    (photo: string | null) =>
      setPhotos((prev) => {
        const next = { ...prev }
        if (photo) next[journalKey] = photo
        else delete next[journalKey]
        return next
      }),
    [setPhotos, journalKey],
  )
  const deleteEntry = (key: string) => {
    const without = <T,>(map: Record<string, T>) => Object.fromEntries(Object.entries(map).filter(([k]) => k !== key))
    setJournal(without)
    setPhotos(without)
  }
  const saveJournal = useCallback(
    (text: string) => setJournal((prev) => ({ ...prev, [journalKey]: text })),
    [setJournal, journalKey],
  )

  const archiveCount = new Set([...Object.keys(journal).filter((k) => journal[k].trim()), ...Object.keys(photos)]).size

  const enter = () => {
    sessionStorage.setItem(INTRO_KEY, '1')
    setEntered(true)
  }
  const replayIntro = () => {
    sessionStorage.removeItem(INTRO_KEY)
    setEntered(false)
    window.scrollTo({ top: 0 })
  }

  if (!entered) return <Intro onEnter={enter} />

  const { piano } = content
  const knowledge = POOLS.knowledge[pickOf('knowledge')]
  const writing = POOLS.writing[pickOf('writing')]
  const meditation = POOLS.meditation[pickOf('meditation')]

  const meta: Record<RitualId, { label: string; icon: ReactNode; title: string; teaser: string; image: { src: string; alt: string } }> = {
    knowledge: { label: 'ידע יומי', icon: <BookOpen {...ICON} />, title: knowledge.title, teaser: knowledge.fact, image: knowledge.image },
    piano: { label: 'השראה בפסנתר', icon: <Music {...ICON} />, title: 'שיר לנגן היום', teaser: 'בחרי שפה ותקופה, ונמצא לך שיר לנגן.', image: piano.image },
    writing: { label: 'כתיבה יוצרת', icon: <Sparkles {...ICON} />, title: 'תרגיל הכתיבה של היום', teaser: writing.prompt ?? writing.instruction, image: writing.image },
    meditation: { label: 'נשימה', icon: <Wind {...ICON} />, title: meditation.title, teaser: `${meditation.minutes} דקות. ${meditation.blurb}`, image: meditation.image },
  }

  if (route === 'archive') {
    return (
      <div className="page">
        <Archive journal={journal} photos={photos} onDelete={deleteEntry} />
      </div>
    )
  }

  const id = RITUALS.find((r) => r === route)
  if (id) {
    const m = meta[id]
    const nextId = RITUALS[RITUALS.indexOf(id) + 1]
    const next = nextId ? { route: nextId, label: `הבא: ${meta[nextId].title}` } : { route: '', label: 'חזרה להיום' }

    return (
      <>
        <RitualCard
          id={id}
          label={m.label}
          badge={
            id === 'knowledge' ? knowledge.category : id === 'meditation' ? `${meditation.minutes} דק׳` : id === 'writing' ? writing.kind : undefined
          }
          icon={m.icon}
          image={m.image}
          title={m.title}
          done={!!done[id]}
          onToggle={() => toggle(today, id)}
          next={next}
          draw={DRAW_LABEL[id] ? { label: DRAW_LABEL[id], onDraw: () => drawAnother(id as DrawId) } : undefined}
        >
          {id === 'knowledge' && (
            <>
              <p>{knowledge.fact}</p>
              <a className="link" href={knowledge.learnMore} target="_blank" rel="noreferrer">
                לקריאה נוספת <ExternalLink size={12} />
              </a>
            </>
          )}
          {id === 'piano' && <SongPicker day={today} />}
          {id === 'writing' && (
            <>
              {writing.prompt ? (
                <>
                  <p>{writing.instruction}</p>
                  <p className="prompt">{writing.prompt}</p>
                </>
              ) : (
                <p className="prompt">{writing.instruction}</p>
              )}
              <Journal
                key={journalKey}
                value={journal[journalKey] ?? ''}
                photo={photos[journalKey]}
                onSave={saveJournal}
                onPhoto={savePhoto}
              />
              <a className="link" href={href('archive')}>
                <Library size={14} /> הכתיבות שלי
              </a>
            </>
          )}
          {id === 'meditation' && (
            <>
              <p>{meditation.blurb}</p>
              <Meditation
                key={`${today}-${pickOf('meditation')}`}
                minutes={meditation.minutes}
                pattern={meditation.pattern}
                onComplete={onMeditationDone}
              />
            </>
          )}
        </RitualCard>
      </>
    )
  }

  return (
    <div className="page">
      <Hero quote={content.quote} done={doneCount} total={RITUALS.length} day={day} streak={streak} />

      {celebrating && doneCount === RITUALS.length && (
        <p className="celebrate" role="status">
          <Sparkles size={16} strokeWidth={1.4} />
          זה האחוז שלך להיום, {CONFIG.name}.
        </p>
      )}

      <main className="grid">
        {RITUALS.map((r) => (
          <RitualTile key={r} id={r} {...meta[r]} done={!!done[r]} />
        ))}
      </main>

      <a href={href('archive')} className="archive-link">
        <Library size={16} strokeWidth={1.5} />
        הארכיון שלי
        <span>{archiveCount} כתיבות</span>
      </a>

      <footer className="footer">
        <button type="button" className="replay" onClick={replayIntro} aria-label="הצגה חוזרת של ברכת יום ההולדת">
          <Gift size={14} strokeWidth={1.4} />
        </button>
      </footer>

      <p className="love-note">{CONFIG.footerNote}</p>
    </div>
  )
}

export default App
