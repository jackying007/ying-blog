import { useLang, useNavigate, usePages } from '@rspress/core/runtime'
import dayjs from 'dayjs'
import { useMemo, useState } from 'react'
import { motion } from 'motion/react'
import { cn } from '@/utils'
import { Card } from './card'

type BlogFrontmatter = {
  description?: string
  date?: string
  tags?: string[]
}

const getDateValue = (date?: string): number => {
  if (!date) {
    return 0
  }

  const timestamp = new Date(date).getTime()

  return Number.isNaN(timestamp) ? 0 : timestamp
}

type PageData = {
  id?: string
  title: string
  href: string
  description?: string
  date?: string
  tags?: string[]
  readingTime: number
}

export const useBlogPages = (): PageData[] => {
  const { pages } = usePages()
  const lang = useLang()

  return useMemo(
    () =>
      pages
        .filter(page => page.lang === lang)
        .filter(
          page =>
            page.routePath.includes('/blog/') &&
            !page.routePath.endsWith('/blog/')
        )
        .map(
          (
            page: (typeof pages)[number] & {
              readingTimeData?: {
                minutes: number
                text: string
                time: number
                words: number
              }
            }
          ) => {
            const frontmatter = (page.frontmatter ?? {}) as BlogFrontmatter
            const pathArr = page.routePath.split('/')
            let filename = pathArr.pop()
            if (!filename) filename = pathArr.pop()

            return {
              id: filename,
              title: page.title,
              href: page.routePath,
              description: frontmatter.description ?? page.description,
              date: frontmatter.date,
              tags: frontmatter.tags,
              readingTime: Math.round(page.readingTimeData?.minutes ?? 1)
            }
          }
        )
        .sort((a, b) => getDateValue(b.date) - getDateValue(a.date)),
    [pages]
  )
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0
  }
}

export function BlogList() {
  const navigate = useNavigate()
  const allBlogPages = useBlogPages()

  const tags = useMemo(() => {
    const tagSet = new Set<string>()
    allBlogPages.forEach(blog => {
      blog.tags?.forEach(tag => tagSet.add(tag))
    })
    return [...tagSet]
  }, [allBlogPages])

  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const blogPages = useMemo(() => {
    return allBlogPages.filter(el =>
      selectedTags.every(tag => el.tags?.includes(tag))
    )
  }, [allBlogPages, selectedTags])

  return (
    <div className="min-h-[calc(100vh-var(--rp-nav-height))] flex flex-col gap-4 mx-auto py-5 w-full max-w-3xl px-5">
      <Card classNames={{ body: 'p-3' }}>
        <div className="text-sm mb-2">按标签筛选</div>
        <div className="flex gap-2 flex-wrap">
          {tags.map((tag, i) => (
            <span
              key={i}
              className={cn(
                'cursor-pointer px-2 py-1 rounded-md text-xs font-medium fc transition-colors bg-primary/8 text-primary',
                selectedTags.includes(tag) && 'bg-primary text-white'
              )}
              onClick={() => {
                setSelectedTags(prev => {
                  if (!prev.includes(tag)) {
                    return [...prev, tag]
                  } else {
                    return prev.filter(el => el !== tag)
                  }
                })
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </Card>
      {blogPages.map(el => (
        <motion.div
          key={el.href}
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.4,
            delay: 0.05
          }}
        >
          <Card
            classNames={{
              wrapper:
                'transition-transform duration-300 hover:-translate-y-0.5 after:absolute after:top-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-primary after:transition-transform after:duration-300 after:ease-out hover:after:scale-x-100',
              body: 'px-3 py-2 flex flex-col'
            }}
          >
            <div
              className="cursor-pointer hover:text-primary hover:underline"
              onClick={() => navigate(el.href)}
            >
              {el.title}
            </div>
            <div className="text-sm">{el.description}</div>
            <div className="flex justify-between border-t border-black/8 dark:border-white/8 pt-2 mt-2 text-sm">
              <div className="flex gap-2 flex-wrap">
                {el.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="cursor-pointer px-2 py-1 rounded-md text-xs font-medium fc transition-colors bg-primary/8 text-primary hover:bg-primary hover:text-white"
                    onClick={() => {
                      setSelectedTags(prev => {
                        if (!prev.includes(tag)) {
                          return [...prev, tag]
                        } else {
                          return prev
                        }
                      })
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="italic shrink-0">
                <span className="mr-2">预计阅读: {el.readingTime}分钟</span>
                {dayjs(el.date).format('YYYY-MM-DD')}
              </div>
            </div>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
