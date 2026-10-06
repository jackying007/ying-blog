import {
  DocLayout as BaseDocLayout,
  type DocLayoutProps
} from '@rspress/core/theme-original'
import { usePage } from '@rspress/core/runtime'
import dayjs from 'dayjs'

export function DocLayout(props: DocLayoutProps) {
  const { page } = usePage()
  const date = page.frontmatter?.date as string

  return (
    <BaseDocLayout
      {...props}
      afterOutline={
        <div className="mt-4">
          {date && (
            <div className="text-sm">
              发布日期：{dayjs(date).format('YYYY-MM-DD')}
            </div>
          )}
          <img className="scale-x-[-1] mt-4" src="/snow_pixel_loli_1.gif" />
        </div>
      }
    />
  )
}
