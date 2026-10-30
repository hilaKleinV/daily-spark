import { useEffect, useRef, useState } from 'react'
import { Camera, Feather, X } from 'lucide-react'
import { compressImage } from '../lib/image'

interface Props {
  value: string
  photo?: string
  onSave: (text: string) => void
  onPhoto: (photo: string | null) => void
}

// Writing space: type on screen (saved quietly as she goes) or write on paper and attach a photo of the page.
// Mount with key={entry} so each exercise starts fresh.
export function Journal({ value, photo, onSave, onPhoto }: Props) {
  const [open, setOpen] = useState(value.length > 0)
  const [text, setText] = useState(value)
  const [saved, setSaved] = useState(false)
  const [photoError, setPhotoError] = useState(false)
  const first = useRef(true)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (first.current) {
      first.current = false
      return
    }
    if (text === value) return
    const timer = window.setTimeout(() => {
      onSave(text)
      setSaved(true)
    }, 600)
    return () => window.clearTimeout(timer)
  }, [text, value, onSave])

  useEffect(() => {
    if (!saved) return
    const timer = window.setTimeout(() => setSaved(false), 1800)
    return () => window.clearTimeout(timer)
  }, [saved])

  const attach = async (file?: File) => {
    if (!file) return
    setPhotoError(false)
    try {
      onPhoto(await compressImage(file))
    } catch {
      setPhotoError(true)
    }
  }

  return (
    <div className="journal">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        hidden
        onChange={(e) => {
          attach(e.target.files?.[0])
          e.target.value = ''
        }}
      />

      {open && (
        <div className="journal-field">
          <textarea
            autoFocus={value.length === 0}
            value={text}
            placeholder="כתבי כאן. זה רק שלך."
            rows={6}
            onChange={(e) => setText(e.target.value)}
            aria-label="הכתיבה שלך"
          />
          <span className={`saved-note ${saved ? 'is-visible' : ''}`}>נשמר</span>
        </div>
      )}

      {photo && (
        <figure className="paper">
          <img src={photo} alt="צילום של הכתיבה שלך על נייר" />
          <button type="button" className="paper-remove" aria-label="הסרת התמונה" onClick={() => onPhoto(null)}>
            <X size={14} />
          </button>
        </figure>
      )}

      <div className="btn-row">
        {!open && (
          <button type="button" className="pill-btn" onClick={() => setOpen(true)}>
            <Feather size={14} />
            להתחיל לכתוב
          </button>
        )}
        <button type="button" className="pill-btn pill-btn-quiet" onClick={() => fileRef.current?.click()}>
          <Camera size={14} />
          {photo ? 'להחליף תמונה' : 'כתבתי על נייר'}
        </button>
      </div>

      {photoError && <p className="notice">לא הצלחתי לטעון את התמונה. נסי שוב.</p>}
    </div>
  )
}
