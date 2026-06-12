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

const fill: CSSProperties = {
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

/**
 * Performance-minded ambient video:
 *  - verified poster still shows instantly; film cross-fades in once playing
 *  - ordered <source> chain → browser falls through to the next verified file
 *  - if every source fails, the poster simply remains
 *  - IntersectionObserver playback gate; muted/inline/looped for autoplay
 */
export default function SmartVideo({ asset, className, style, lazy = true, posterWidth = 1600 }: Props) {
  const ref = useRef<HTMLVideoElement>(null)
  const [failed, setFailed] = useState(false)
  const [rolling, setRolling] = useState(false)
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

  return (
    <div
      className={className}
      style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden', ...style }}
    >
      <img src={poster} alt={asset.poster.alt} style={fill} loading={lazy ? 'lazy' : 'eager'} decoding="async" />
      {!failed && (
        <video
          ref={ref}
          style={{ ...fill, opacity: rolling ? 1 : 0, transition: 'opacity 0.9s ease' }}
          muted
          loop
          playsInline
          autoPlay={!lazy}
          preload={lazy ? 'metadata' : 'auto'}
          aria-hidden="true"
          onPlaying={() => setRolling(true)}
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
      )}
    </div>
  )
}
