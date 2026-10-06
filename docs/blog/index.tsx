import type { PageIndexInfo } from '@rspress/core'
import { BlogList } from '@/components/blog-list'

export const frontmatter: PageIndexInfo['frontmatter'] = {
  pageType: 'custom'
}

export default function BlogListPage() {
  return <BlogList />
}
