type VideoZoomOptions = {
  margin?: number
  bg?: string
  duration?: number
}

type VideoZoomInstance = {
  open: () => void
  close: () => void
}

export function videoZoomable(
  video: HTMLVideoElement,
  options: VideoZoomOptions = {}
): VideoZoomInstance {
  const { margin = 40, bg = 'var(--rp-c-bg)', duration = 300 } = options

  let activeClone: HTMLVideoElement | null = null
  let isAnimating = false
  let scrollY = 0

  const overlay = document.createElement('div')
  overlay.style.cssText = `
    position: fixed; inset: 0; z-index: 998;
    background: ${bg}; opacity: 0; pointer-events: none;
    transition: opacity ${duration}ms ease; cursor: zoom-out;
  `

  function animate(rect: DOMRect) {
    console.log('animate')
    const vw = window.innerWidth - margin * 2
    const vh = window.innerHeight - margin * 2

    const natW = video.videoWidth || vw
    const natH = video.videoHeight || vh

    const scaleX = Math.min(natW, vw) / rect.width
    const scaleY = Math.min(natH, vh) / rect.height
    const scale = Math.min(scaleX, scaleY)

    const tx = (-rect.left + (vw - rect.width) / 2 + margin) / scale
    const ty = (-rect.top + (vh - rect.height) / 2 + margin) / scale

    if (activeClone) {
      activeClone.style.transform = `scale(${scale}) translate3d(${tx}px, ${ty}px, 0)`
    }
  }

  function open() {
    if (activeClone || isAnimating) return

    if (!video.videoWidth) {
      const onMeta = () => {
        video.removeEventListener('loadedmetadata', onMeta)
        open()
      }
      video.addEventListener('loadedmetadata', onMeta, { once: true })
      if (video.preload === 'none') {
        video.preload = 'metadata'
        video.load()
      }
      return
    }

    const rect = video.getBoundingClientRect()
    scrollY = window.scrollY
    isAnimating = true

    activeClone = video.cloneNode(true) as HTMLVideoElement

    activeClone.removeAttribute('id')
    activeClone.removeAttribute('width')
    activeClone.removeAttribute('height')

    activeClone.style.cssText = `
      position: fixed; z-index: 999; cursor: zoom-out;
      top: ${rect.top}px; left: ${rect.left}px;
      width: ${rect.width}px; height: ${rect.height}px;
      transition: transform ${duration}ms cubic-bezier(0.2, 0, 0.2, 1);
      will-change: transform; object-fit: contain;
    `

    video.classList.add('opacity-0', 'invisible')

    document.body.appendChild(overlay)
    document.body.appendChild(activeClone)

    requestAnimationFrame(() => {
      overlay.style.opacity = '1'
      overlay.style.pointerEvents = 'auto'
      animate(rect)
    })

    const onEnd = () => {
      isAnimating = false
      activeClone?.removeEventListener('transitionend', onEnd)
    }
    activeClone.addEventListener('transitionend', onEnd, { once: true })

    activeClone.addEventListener('click', e => {
      e.preventDefault()
      close()
    })
  }

  function close() {
    if (!activeClone || isAnimating) return
    isAnimating = true

    overlay.style.opacity = '0'
    overlay.style.pointerEvents = 'none'
    activeClone.style.transform = ''

    const onEnd = () => {
      activeClone?.remove()
      overlay.remove()
      video.classList.remove('opacity-0', 'invisible')

      activeClone = null
      isAnimating = false
    }

    activeClone.addEventListener('transitionend', onEnd, { once: true })
    setTimeout(onEnd, duration + 50)
  }

  video.style.cursor = 'zoom-in'
  video.addEventListener('click', e => {
    if (activeClone) return

    const rect = video.getBoundingClientRect()
    const hitControls =
      video.hasAttribute('controls') && e.clientY > rect.bottom - 40

    if (!hitControls) {
      e.preventDefault()
      open()
    }
  })

  // 点击遮罩或克隆视频时关闭
  overlay.addEventListener('click', e => {
    e.preventDefault()
    close()
  })

  document.addEventListener('keyup', e => {
    if (e.key === 'Escape') close()
  })

  document.addEventListener('scroll', () => {
    if (activeClone && Math.abs(window.scrollY - scrollY) > 40) close()
  })

  window.addEventListener('resize', () => {
    if (activeClone) close()
  })

  return { open, close }
}
