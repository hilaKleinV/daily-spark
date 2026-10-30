import { useEffect, useRef, useState } from 'react'
import { Dices, Loader2, Music, Pause, Play, Search } from 'lucide-react'
import { usePersisted } from '../hooks/usePersisted'

interface Song {
  id: number
  name: string
  artist: string
  year: string
  cover: string
  preview?: string
}

type Language = 'he' | 'en' | 'both'

const LANGUAGES: { id: Language; label: string }[] = [
  { id: 'he', label: 'עברית' },
  { id: 'en', label: 'אנגלית' },
  { id: 'both', label: 'שתיהן' },
]

const ERAS = [
  { label: 'הכול', start: 1960, end: 2029 },
  { label: '60s–70s', start: 1960, end: 1979 },
  { label: '80s', start: 1980, end: 1989 },
  { label: '90s', start: 1990, end: 1999 },
  { label: '2000s', start: 2000, end: 2009 },
  { label: '2010s', start: 2010, end: 2019 },
  { label: '2020s', start: 2020, end: 2029 },
]

const HEBREW_ARTISTS = [
  'אריק איינשטיין', 'עידן רייכל', 'שלמה ארצי', 'יהודית רביץ', 'עומר אדם', 'אביב גפן', 'חנה גור',
  'עפרה חזה', 'יעל נעים', 'אהוד בנאי', 'דודו טסה', 'שרית חדד', 'סטטיק ובן אל', 'נועה קירל', 'אייל גולן',
]

const ENGLISH_ARTISTS = [
  'Beatles', 'Elton John', 'Billy Joel', 'Adele', 'Coldplay', 'Queen', 'David Bowie', 'Whitney Houston',
  'Michael Jackson', 'Stevie Wonder', 'Alicia Keys', 'John Legend', 'Frank Sinatra', 'Nina Simone',
]

const pick = <T,>(list: T[]) => list[Math.floor(Math.random() * list.length)]

interface ITunesTrack {
  trackId: number
  trackName: string
  artistName: string
  releaseDate?: string
  artworkUrl100: string
  previewUrl?: string
}

async function drawSong(language: Language, start: number, end: number): Promise<Song | null> {
  // A search can come back empty for the chosen era, so try a few different artists.
  for (let attempt = 0; attempt < 5; attempt++) {
    const hebrew = language === 'he' || (language === 'both' && Math.random() < 0.5)
    const term = pick(hebrew ? HEBREW_ARTISTS : ENGLISH_ARTISTS)
    const country = hebrew ? 'il' : 'us'
    const res = await fetch(
      `https://itunes.apple.com/search?term=${encodeURIComponent(term)}&country=${country}&media=music&entity=song&limit=50`,
    )
    const data: { results?: ITunesTrack[] } = await res.json()
    const inEra = (data.results ?? []).filter((t) => {
      const year = Number(t.releaseDate?.slice(0, 4))
      return year >= start && year <= end
    })
    if (inEra.length === 0) continue

    const t = pick(inEra)
    return {
      id: t.trackId,
      name: t.trackName,
      artist: t.artistName,
      year: t.releaseDate!.slice(0, 4),
      cover: t.artworkUrl100.replace('100x100', '600x600'),
      preview: t.previewUrl,
    }
  }
  return null
}

const youtube = (s: Song) =>
  `https://www.youtube.com/results?search_query=${encodeURIComponent(`${s.name} ${s.artist} piano tutorial`)}`
const sheetMusic = (s: Song) => `https://musescore.com/sheetmusic?text=${encodeURIComponent(`${s.name} ${s.artist}`)}`

export function SongPicker({ day }: { day: string }) {
  // The song she drew today stays put until she draws another one.
  const [saved, setSaved] = usePersisted<{ day: string; song: Song } | null>('dailyspark:song', null)
  const [language, setLanguage] = useState<Language>('both')
  const [eraIndex, setEraIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [failed, setFailed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)
  const autoDrawn = useRef(false)

  const song = saved?.day === day ? saved.song : null

  const draw = async () => {
    const era = ERAS[eraIndex]
    audioRef.current?.pause()
    setPlaying(false)
    setProgress(0)
    setLoading(true)
    setFailed(false)
    try {
      const next = await drawSong(language, era.start, era.end)
      if (next) setSaved({ day, song: next })
      else setFailed(true)
    } catch {
      setFailed(true)
    }
    setLoading(false)
  }

  // Opening the page with no song yet draws one straight away.
  useEffect(() => {
    if (!song && !autoDrawn.current) {
      autoDrawn.current = true
      draw()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const togglePreview = () => {
    const audio = audioRef.current
    if (!audio) return
    if (audio.paused) audio.play()
    else audio.pause()
  }

  return (
    <div className="song-picker">
      <div className="song-stage">
        {song ? (
          <>
            <div className="song-art">
              <img src={song.cover} alt="" />
              {song.preview && (
                <button
                  type="button"
                  className="play-btn"
                  onClick={togglePreview}
                  aria-label={playing ? 'השהיית התצוגה המקדימה' : 'השמעת תצוגה מקדימה'}
                >
                  {playing ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                </button>
              )}
            </div>

            <div className="song-info">
              <p className="eyebrow">השיר של היום</p>
              <h2 className="song-title">{song.name}</h2>
              <p className="song-artist">
                {song.artist} · {song.year}
              </p>

              {song.preview && (
                <div className="preview">
                  <div className="preview-bar">
                    <span style={{ width: `${progress * 100}%` }} />
                  </div>
                  <span className="preview-label">תצוגה מקדימה · 30 שניות</span>
                  <audio
                    key={song.id}
                    ref={audioRef}
                    src={song.preview}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => {
                      setPlaying(false)
                      setProgress(0)
                    }}
                    onTimeUpdate={(e) => setProgress(e.currentTarget.currentTime / (e.currentTarget.duration || 30))}
                  />
                </div>
              )}

              <div className="btn-row">
                <a className="pill-btn pill-btn-quiet" href={youtube(song)} target="_blank" rel="noreferrer">
                  <Music size={14} /> מדריך ביוטיוב
                </a>
                <a className="pill-btn pill-btn-quiet" href={sheetMusic(song)} target="_blank" rel="noreferrer">
                  <Search size={14} /> תווים
                </a>
              </div>
            </div>
          </>
        ) : (
          <p className="song-empty">{loading ? 'מחפשים לך שיר…' : 'עוד לא הוגרל שיר להיום.'}</p>
        )}
      </div>

      {failed && <p className="notice">לא נמצא שיר. נסי תקופה או שפה אחרת, או בדקי את החיבור לאינטרנט.</p>}

      <div className="song-controls">
        <div className="choice-group" role="group" aria-label="שפה">
          {LANGUAGES.map((l) => (
            <button
              key={l.id}
              type="button"
              className={`choice ${language === l.id ? 'is-active' : ''}`}
              aria-pressed={language === l.id}
              onClick={() => setLanguage(l.id)}
            >
              {l.label}
            </button>
          ))}
        </div>

        <div className="choice-group" role="group" aria-label="תקופה">
          {ERAS.map((e, i) => (
            <button
              key={e.label}
              type="button"
              className={`choice ${eraIndex === i ? 'is-active' : ''}`}
              aria-pressed={eraIndex === i}
              onClick={() => setEraIndex(i)}
            >
              {e.label}
            </button>
          ))}
        </div>

        <button type="button" className="pill-btn pill-btn-lg" onClick={draw} disabled={loading}>
          {loading ? <Loader2 size={16} className="spin" /> : <Dices size={16} />}
          {song ? 'שיר אחר' : 'הגרילי לי שיר'}
        </button>
      </div>
    </div>
  )
}
