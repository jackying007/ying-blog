import { useEffect, useRef, useState } from 'react'

export default function () {
  const loadedNumRef = useRef(0)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (loadedNumRef.current >= 3) {
      if (!loaded) {
        setLoaded(true)
      }
      return
    }
    const aPlayerCss = document.createElement('link')
    const aPlayerJs = document.createElement('script')
    const metingJs = document.createElement('script')
    aPlayerCss.rel = 'stylesheet'
    aPlayerCss.href =
      'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css'
    aPlayerJs.src = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js'
    metingJs.src = 'https://cdn.jsdelivr.net/npm/meting@2/dist/Meting.min.js'
    function loadFuc() {
      loadedNumRef.current++
      if (loadedNumRef.current >= 3) {
        if (!loaded) {
          setLoaded(true)
        }
      }
    }
    aPlayerCss.onload = loadFuc
    aPlayerJs.onload = loadFuc
    metingJs.onload = loadFuc

    const header = document.getElementsByTagName('head')[0]
    header.append(aPlayerCss, aPlayerJs, metingJs)

    return () => {
      aPlayerCss.remove()
      aPlayerJs.remove()
      metingJs.remove()
      loadedNumRef.current = 0
    }
  }, [])

  return (
    <>
      {loaded && (
        <meting-js
          api="https://api.injahow.cn/meting/?server=:server&type=:type&id=:id&auth=:auth&r=:r"
          server="netease"
          type="playlist"
          id="18338716079"
          fixed="true"
          autoplay="true"
        />
      )}
    </>
  )
}
