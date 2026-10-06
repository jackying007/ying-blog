import { useEffect } from 'react'
import Typed from 'typed.js'
import { motion, useSpring, useTransform } from 'motion/react'
import type { MotionValue, Variants } from 'motion/react'
import { useMedia } from 'react-use'

const variants: Variants = {
  visible: i => ({
    opacity: 1,
    y: 0,
    transition: {
      type: 'spring',
      damping: 25,
      duration: 0.8,
      delay: i * 0.4
    }
  }),
  hidden: { opacity: 0, y: 30 }
}

export function Intro({ scrollYProgress }: { scrollYProgress: MotionValue }) {
  const isMobile = useMedia('(max-width: 1024px)')

  const scale = useSpring(
    useTransform(scrollYProgress, [0, 0.24], [1, isMobile ? 0 : 1])
  )
  const rotateY = useSpring(
    useTransform(scrollYProgress, [0.6, 0.8], [0, isMobile ? 0 : 20])
  )
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.3], [0, 0.3]))

  useEffect(() => {
    const typed = new Typed('.intro-text', {
      strings: [
        '我是<span style="color: var(--rp-c-brand);">JackYing</span>， <br/> 一名喜欢唱、跳、',
        '我是<span style="color: var(--rp-c-brand);">JackYing</span>， <br/> 一名^800喜欢用 TS 的全栈开发者。</span>'
      ],
      typeSpeed: 100,
      backSpeed: 60,
      backDelay: 100
    })

    return () => typed.destroy()
  }, [])

  return (
    <div className="sticky top-0 h-screen mx-auto max-w-360 px-6 flex flex-col justify-center items-start perspective-[1660px]">
      <motion.div className="fc flex-col relative" style={{ scale, rotateY }}>
        <motion.div
          className="absolute top-0 w-full h-full bg-linear-to-r from-[rgb(150,255,244,0.81)] to-[rgb(0,71,252,0.81)] rounded-full blur-[80px] z-[-1]"
          style={{ opacity }}
        />
        <div className="text-4xl font-bold tracking-[3px]">
          你好!欢迎来到<span className="text-primary">Ying Blog</span>👋
          <br />
          <span className="intro-text text-3xl"></span>
        </div>
        <motion.div className="fc">
          <motion.img
            variants={variants}
            initial="hidden"
            animate="visible"
            custom={1}
            src="/snow_pixel_loli_2.gif"
          />
          <motion.img
            variants={variants}
            initial="hidden"
            animate="visible"
            custom={2}
            src="/snow_pixel_loli_3.gif"
          />
        </motion.div>
      </motion.div>
    </div>
  )
}
