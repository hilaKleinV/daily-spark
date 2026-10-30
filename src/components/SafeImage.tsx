import { useState } from 'react'

interface Props {
  src: string
  alt: string
  className?: string
}

// A soft gradient sits behind the photo, so a slow or failed load never looks broken.
export function SafeImage({ src, alt, className = '' }: Props) {
  const [failed, setFailed] = useState(false)
  const [loaded, setLoaded] = useState(false)

  return (
    <div className={`safe-image ${className}`}>
      {!failed && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={loaded ? 'is-loaded' : ''}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  )
}
