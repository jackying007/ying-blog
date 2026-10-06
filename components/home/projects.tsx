import { useEffect, useRef } from 'react'
import { motion, useInView, useScroll, type Variants } from 'motion/react'
import { Icon } from '@iconify/react'
import { Project, type TProject } from './project'

const items: TProject[] = [
  {
    title: 'ying-tunnel',
    link: 'https://github.com/JackDeng666/ying-tunnel',
    desc: '这是一个基于 Nodejs 并使用 Typescript 实现的内网穿透服务与连接客户端 CLI，核心模块包零依赖，基于 tcp 实现了 http 流量的代理。',
    images: ['/projects/ying-tunnel.png']
  },
  {
    title: 'ying-starter',
    link: 'https://github.com/JackDeng666/ying-starter',
    desc: '这是一个使用 Pnpm + Turborepo 的 Monorepo 单仓全栈项目，基于 Nestjs 实现服务端，Vite + React 实现后台管理系统，Vite + TanStack Start 实现客户端。集成了基本的后台管理系统的角色权限控制逻辑，基于 Tiptap 的内容管理，注册登录和第三方 Oauth 登录逻辑，客户端多语言，Web 离线消息推送。',
    videos: ['/projects/ying-starter.mp4']
  },
  {
    title: 'ying-tools',
    link: 'https://github.com/JackDeng666/ying-tools',
    desc: '这个项目是一个终端应用，基于 Nodejs，实现的功能有：搜索指定 github 用户的仓库并下载创建项目，压缩图片。使用 React Ink 构建，这套东西可以用来实现各种终端应用，作为玩具来用还是比较好玩的。',
    images: ['/projects/ying-crt.gif', '/projects/ying-image-c-g.gif']
  }
]

const splitLength = 1 / items.length
const splitRange = items.reduce(
  (prev, _, currentIndex) => [...prev, (currentIndex + 1) * splitLength],
  [0]
)

function calcCardWith() {
  return Math.max(window.innerWidth * 0.33, 345)
}

const tipWrapVariants: Variants = {
  initial: {
    y: 50,
    opacity: 0
  },
  open: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      delayChildren: 0.1,
      staggerChildren: 0.2
    }
  }
}

export function Projects() {
  const calcWidthRef = useRef(0)
  const wrapperRef = useRef<HTMLElement>(null)
  const sliderRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement[]>([])
  const indexRef = useRef(0)
  const wrapInView = useInView(wrapperRef)

  const { scrollYProgress } = useScroll({
    target: wrapperRef
  })

  useEffect(() => {
    if (wrapInView) move(0)
    else move(-1)
  }, [wrapInView])

  const updateCardSize = () => {
    calcWidthRef.current = calcCardWith()
    for (var i = 0; i < itemsRef.current.length; i++) {
      let item = itemsRef.current[i]
      item.style.width = `${calcWidthRef.current}px`
    }
  }

  const updateSliderTransform = () => {
    if (!sliderRef.current) return

    const width = calcWidthRef.current
    sliderRef.current.style.transform = `translate3d(${
      window.innerWidth / 2 - width / 2 - indexRef.current * width
    }px, 0, 0)`
  }

  const initSize = () => {
    updateCardSize()
    updateSliderTransform()
  }

  const move = (index: number) => {
    indexRef.current = index
    for (let i = 0; i < itemsRef.current.length; i++) {
      let item = itemsRef.current[i]
      if (i === index) {
        item.style.transform = 'perspective(1200px)'
      } else {
        item.style.transform = `perspective(1200px) rotateY(${i < index ? 40 : -40}deg)`
      }
    }
    updateSliderTransform()
  }

  const scrollChange = (val: number) => {
    for (let i = 0; i < splitRange.length; i++) {
      const currentSplitNum = splitRange[i]
      const nextSplitNum = splitRange[i + 1]
      if (
        val >= currentSplitNum &&
        val < nextSplitNum &&
        indexRef.current !== currentSplitNum
      ) {
        return move(i)
      }
    }
  }

  useEffect(() => {
    initSize()
    window.addEventListener('resize', initSize)
    return () => window.removeEventListener('reset', initSize)
  }, [])

  useEffect(() => {
    scrollYProgress.on('change', scrollChange)
    return () => scrollYProgress.clearListeners()
  }, [scrollYProgress])

  return (
    <section ref={wrapperRef}>
      <div className="sticky top-0 left-0 w-full h-screen overflow-hidden fc flex-col">
        <motion.div
          className="w-full flex flex-col items-center text-primary mb-5"
          variants={tipWrapVariants}
          initial="initial"
          animate={wrapInView ? 'open' : ''}
        >
          <h2 className="text-2xl">我的开源项目</h2>
          <motion.div
            initial={{
              opacity: 0.3,
              y: 0
            }}
            animate={{
              opacity: 1,
              y: 10,
              transition: {
                duration: 0.8,
                repeat: Infinity,
                repeatType: 'mirror'
              }
            }}
          >
            <Icon icon="pixelarticons:arrow-down" className="text-4xl" />
          </motion.div>
        </motion.div>
        <div
          className="transition-transform duration-1000 ease-in-out w-full flex items-start"
          ref={sliderRef}
        >
          {items.map((item, index) => (
            <Project
              key={item.link}
              className="transition-transform duration-1000 ease-in-out shrink-0"
              item={item}
              ref={ele => {
                if (!ele) return
                itemsRef.current[index] = ele
              }}
            />
          ))}
        </div>
      </div>
      <div style={{ height: '200vh' }}></div>
    </section>
  )
}
