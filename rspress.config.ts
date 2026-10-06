import * as path from 'node:path'
import { defineConfig } from '@rspress/core'
import pluginFileTree from 'rspress-plugin-file-tree'
import readingTime from 'rspress-plugin-reading-time'
import ghPages from 'rspress-plugin-gh-pages'
import { pluginTailwindcss } from '@rsbuild/plugin-tailwindcss'

export default defineConfig({
  route: {
    cleanUrls: true
  },
  root: path.join(__dirname, 'docs'),
  lang: 'zh',
  title: 'Ying Blog',
  icon: '/favicon.png',
  logo: '/snow_pixel_loli_4.gif',
  logoText: 'Ying Blog',
  head: [
    [
      'meta',
      {
        name: 'keywords',
        content:
          'rspress, 文档, javascript, typescript, nodejs, react, vue, web, ts全栈'
      }
    ]
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/jackying007/ying-blog'
      }
    ]
  },
  mediumZoom: {
    selector: '.rspress-doc p > img, .zoomable-img'
  },

  globalUIComponents: [
    path.join(__dirname, 'components', 'svg-deckle-edge.tsx'),
    path.join(__dirname, 'components', 'music-player.tsx')
  ],
  plugins: [
    pluginFileTree(),
    readingTime({
      defaultLocale: 'zh-CN'
    }),
    ghPages({
      repo: 'https://github.com/jackying007/jackying007.github.io',
      branch: 'gh-pages'
    })
  ],
  builderConfig: {
    plugins: [pluginTailwindcss()]
  }
})
