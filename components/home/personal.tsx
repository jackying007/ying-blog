import { useRef } from 'react'
import { useScroll } from 'motion/react'
import { Intro } from './intro'
import { Skills } from './skills'

export function Personal() {
  const wrapperRef = useRef<HTMLElement>(null)

  const { scrollYProgress } = useScroll({
    target: wrapperRef
  })

  return (
    <section ref={wrapperRef}>
      <Intro scrollYProgress={scrollYProgress} />
      <Skills scrollYProgress={scrollYProgress} />
      <div style={{ height: '100vh' }}></div>
    </section>
  )
}
