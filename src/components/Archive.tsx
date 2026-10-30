import { ArrowRight, Trash2 } from 'lucide-react'
import { POOLS } from '../content'
import { href } from '../hooks/useRoute'

interface Props {
  journal: Record<string, string>
  photos: Record<string, string>
  onDelete: (key: string) => void
}

// Entries are stored under "YYYY-MM-DD#exerciseIndex".
const parse = (key: string) => {
  const [day, idx] = key.split('#')
  const [y, m, d] = day.split('-').map(Number)
  return { date: new Date(y, m - 1, d), day, exercise: POOLS.writing[Number(idx)] }
}

export function Archive({ journal, photos, onDelete }: Props) {
  const keys = [...new Set([...Object.keys(journal).filter((k) => journal[k].trim()), ...Object.keys(photos)])].sort(
    (a, b) => (a < b ? 1 : -1),
  )

  return (
    <div className="archive">
      <a href={href('')} className="back-link">
        <ArrowRight size={16} strokeWidth={1.6} />
        חזרה להיום
      </a>

      <h1 className="rp-title">הארכיון שלי</h1>
      <p className="archive-sub">כל מה שכתבת עד עכשיו, במקום אחד.</p>

      {keys.length === 0 && <p className="archive-empty">עוד אין כאן כלום. הכתיבה הראשונה שלך תופיע כאן.</p>}

      <div className="archive-list">
        {keys.map((key) => {
          const { date, exercise } = parse(key)
          return (
            <article key={key} className="entry">
              <header>
                <time>
                  {date.toLocaleDateString('he-IL', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </time>
                <button
                  type="button"
                  className="icon-btn"
                  aria-label="מחיקת הכתיבה"
                  onClick={() => window.confirm('למחוק את הכתיבה הזאת?') && onDelete(key)}
                >
                  <Trash2 size={14} />
                </button>
              </header>

              {exercise && (
                <p className="entry-prompt">
                  <span>{exercise.kind}</span> {exercise.prompt ? `${exercise.instruction} ${exercise.prompt}` : exercise.instruction}
                </p>
              )}
              {journal[key]?.trim() && <p className="entry-text">{journal[key]}</p>}
              {photos[key] && <img className="entry-photo" src={photos[key]} alt="כתיבה על נייר" />}
            </article>
          )
        })}
      </div>
    </div>
  )
}
