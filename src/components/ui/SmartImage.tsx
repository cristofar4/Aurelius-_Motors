import { useState, type CSSProperties } from 'react'
import { unsplash, srcSetOf, type ImageAsset } from '../../data/media'

interface Props {
  asset: ImageAsset
  /** rendered if the primary asset ever fails to resolve */
  fallback?: ImageAsset
  width?: number
  sizes?: string
  eager?: boolean
  className?: string
  style?: CSSProperties
}

/**
 * Responsive Unsplash image with srcset and a verified fallback asset —
 * the layout never shows a broken frame.
 */
export default function SmartImage({
  asset,
  fallback,
  width = 1800,
  sizes = '100vw',
  eager = false,
  className,
  style,
}: Props) {
  const [current, setCurrent] = useState(asset)
  const [dead, setDead] = useState(false)

  if (dead) return null

  return (
    <img
      className={className}
      style={style}
      src={unsplash(current.id, width)}
      srcSet={srcSetOf(current.id)}
      sizes={sizes}
      alt={current.alt}
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      draggable={false}
      onError={() => {
        if (fallback && current.id !== fallback.id) setCurrent(fallback)
        else setDead(true)
      }}
    />
  )
}
