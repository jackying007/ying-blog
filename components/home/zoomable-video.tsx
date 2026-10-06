import { useEffect, useRef, type ComponentPropsWithoutRef } from 'react'
import { videoZoomable } from './zoom'

type ZoomableVideoProps = ComponentPropsWithoutRef<'video'> & {
  className?: string
  src: string
}
export function ZoomableVideo({
  className,
  src,
  ...videoProps
}: ZoomableVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    if (!videoRef.current) return
    videoZoomable(videoRef.current)
  }, [])

  return (
    <video
      {...videoProps}
      ref={videoRef}
      loop
      muted
      autoPlay
      playsInline
      src={src}
    />
  )
}
