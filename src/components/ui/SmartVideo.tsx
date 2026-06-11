import { useEffect, useRef, useState, type CSSProperties } from 'react'
import { unsplash, type VideoAsset } from '../../data/media'

interface Props {
  asset: VideoAsset
  className?: string
  style?: CSSProperties
  /** play only while on screen (default true) — saves battery & bandwidth */
  lazy?: boolean
  posterWidth?: number
}

/**
 * Performance-minded ambient video:
 *  - ordered <source> chain → browser falls through to the next verified file
 *  - if every source fails, swaps to a verified poster still
 *  - IntersectionObserver playback gate; muted/inline/looped for autoplay
 */
export default function SmartVideo({ asset, className, style, lazy = true, posterWidth = 1600 }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const poster = unsplash(asset.poster.id, posterWidth)

  useEffect(() => {
    const video = ref.current
    if (!video || failed) return

    const tryPlay = () => video.play().catch(() => undefined)

    if (!lazy) {
      tryPlay()
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) tryPlay()
        else video.pause()
      },
      { rootMargin: '120px' },
    )
    io.observe(video)
    return () => io.disconnect()
  }, [failed, lazy])

  if (failed) {
    return (
      <img
        className={className}
        style={style}
        src={poster}
        alt={asset.poster.alt}
        loading="lazy"
        decoding="async"
      />
    )
  }

  return (
    <video
      ref={ref}
      className={className}
      style={style}
      muted
      loop
      playsInline
      autoPlay={!lazy}
      preload={lazy ? 'metadata' : 'auto'}
      poster={poster}
      aria-hidden="true"
      onError={() => setFailed(true)}
    >
      {asset.sources.map((src, i) => (
        <source
          key={src}
          src={src}
          type="video/mp4"
          // the spec fires source-exhaustion errors on the last <source>, not the <video>
          onError={i === asset.sources.length - 1 ? () => setFailed(true) : undefined}
        />
      ))}
    </video>
  )
}
