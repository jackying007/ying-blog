import type { PageIndexInfo } from '@rspress/core'
import { Personal, Projects, Contacts, Particles } from '@/components/home'
import { useThemeState } from '@/theme'
import { useEffect, useState } from 'react'

export const frontmatter: PageIndexInfo['frontmatter'] = {
  pageType: 'custom' // 或 'blank' 隐藏导航栏
}

export default function HomePage() {
  const [theme] = useThemeState()
  const [color, setColor] = useState<string>()

  useEffect(() => {
    if (theme === 'light') {
      setColor('#242424')
    } else {
      setColor('#ffffff')
    }
  }, [theme])

  return (
    <>
      <Particles
        className="fixed top-0 inset-0"
        quantity={100}
        ease={80}
        color={color}
      />
      <Personal />
      <Projects />
      <Contacts />
    </>
  )
}
