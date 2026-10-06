import { Icon } from '@iconify/react'
import { motion, useSpring, useTransform } from 'motion/react'
import type { MotionValue } from 'motion/react'
import { useMedia } from 'react-use'
import { BgIcon } from './bg-icon'

export function Skills({ scrollYProgress }: { scrollYProgress: MotionValue }) {
  const isMobile = useMedia('(max-width: 1024px)')

  const scale = useSpring(useTransform(scrollYProgress, [0.5, 0.7], [1, 0.85]))
  const rotateY = useSpring(
    useTransform(scrollYProgress, [0.6, 0.8], [0, isMobile ? 0 : -20])
  )

  const logos = [
    {
      name: 'logos:vue',
      left: '-1%',
      top: '1%',
      opacity: useTransform(
        scrollYProgress,
        [0.36, 0.41, 0.65, 1],
        [0, 0.7, 1, 1]
      ),
      y: useTransform(
        scrollYProgress,
        [0.36, 0.41, 0.65, 1],
        ['0%', '-15%', '-15%', '-30.8%']
      )
    },
    {
      name: 'logos:nuxt-icon',
      left: '15%',
      top: '-11%',
      opacity: useTransform(
        scrollYProgress,
        [0.37, 0.42, 0.65, 1],
        [0, 0.4, 1, 1]
      ),
      y: useTransform(
        scrollYProgress,
        [0.37, 0.42, 0.65, 1],
        ['0%', '-15%', '-25%', '-22.8%']
      )
    },
    {
      name: 'logos:react',
      left: '80%',
      top: '-5%',
      opacity: useTransform(
        scrollYProgress,
        [0.38, 0.43, 0.65, 1],
        [0, 0.6, 1, 1]
      ),
      y: useTransform(
        scrollYProgress,
        [0.38, 0.43, 0.65, 1],
        ['0%', '-5%', '-5%', '-12%']
      )
    },
    {
      name: 'logos:nextjs-icon',
      left: '38%',
      top: '-8%',
      opacity: useTransform(
        scrollYProgress,
        [0.34, 0.39, 0.65, 1],
        [0, 0.3, 1, 1]
      ),
      y: useTransform(
        scrollYProgress,
        [0.34, 0.39, 0.65, 1],
        ['0%', '-5%', '-5%', '-8.8%']
      )
    },
    {
      name: 'logos:javascript',
      left: '56%',
      top: '-3%',
      opacity: useTransform(
        scrollYProgress,
        [0.37, 0.62, 0.65, 1],
        [0, 0.4, 1, 1]
      ),
      y: useTransform(
        scrollYProgress,
        [0.37, 0.62, 0.65, 1],
        ['0%', '-5%', '-5%', '-8.5%']
      )
    },
    {
      name: 'logos:typescript-icon',
      left: '80%',
      top: '16%',
      opacity: useTransform(
        scrollYProgress,
        [0.37, 0.53, 0.65, 1],
        [0, 0.3, 1, 1]
      ),
      y: useTransform(
        scrollYProgress,
        [0.37, 0.62, 0.65, 1],
        ['0%', '-10%', '-10%', '-17.5%']
      )
    },
    {
      name: 'logos:nestjs',
      left: '83%',
      top: '36%',
      opacity: useTransform(
        scrollYProgress,
        [0.38, 0.57, 0.65, 1],
        [0, 0.3, 1, 1]
      ),
      y: useTransform(
        scrollYProgress,
        [0.38, 0.57, 0.65, 1],
        ['0%', '-12%', '-18%', '-27.5%']
      )
    },
    {
      name: 'logos:nodejs-icon-alt',
      left: '80%',
      top: '90%',
      opacity: useTransform(
        scrollYProgress,
        [0.36, 0.58, 0.65, 1],
        [0, 0.3, 1, 1]
      ),
      y: useTransform(
        scrollYProgress,
        [0.36, 0.58, 0.65, 1],
        ['0%', '-20%', '-25%', '-29.5%']
      )
    },
    {
      name: 'logos:docker-icon',
      left: '3%',
      top: '83%',
      opacity: useTransform(
        scrollYProgress,
        [0.37, 0.48, 0.65, 1],
        [0, 0.44, 1, 1]
      ),
      y: useTransform(
        scrollYProgress,
        [0.37, 0.48, 0.65, 1],
        ['0%', '-11%', '-15%', '-20.5%']
      )
    },
    {
      name: 'logos:visual-studio-code',
      left: '60%',
      top: '98%',
      opacity: useTransform(
        scrollYProgress,
        [0.34, 0.51, 0.65, 1],
        [0, 0.44, 1, 1]
      ),
      y: useTransform(
        scrollYProgress,
        [0.34, 0.51, 0.65, 1],
        ['0%', '-13%', '-17%', '-21%']
      )
    }
  ]

  return (
    <div className="sticky top-0 h-screen mx-auto max-w-360 px-6 flex flex-col justify-center items-end perspective-[1660px]">
      <motion.div className="relative" style={{ scale, rotateY }}>
        <BgIcon scrollYProgress={scrollYProgress} />
        {logos.map((logo, index) => {
          return (
            <motion.div
              key={index}
              id={logo.name}
              className="w-14 h-14 p-2 inline-flex justify-center items-center rounded-lg m-4 convex hover:concave"
              style={{
                position: 'absolute',
                left: logo.left,
                top: logo.top,
                y: logo.y,
                opacity: logo.opacity
              }}
            >
              <Icon icon={logo.name} className="w-full h-auto"></Icon>
            </motion.div>
          )
        })}
      </motion.div>
    </div>
  )
}
