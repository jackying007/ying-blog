import { cn } from '@/utils'
import type { ReactNode, Ref } from 'react'

type CardProps = {
  classNames?: {
    wrapper?: string
    body?: string
  }
  children?: ReactNode
  ref?: Ref<HTMLDivElement>
}
export function Card({ classNames, children, ref }: CardProps) {
  return (
    <div className={cn('relative', classNames?.wrapper)} ref={ref}>
      <div className="absolute inset-0 filter-[url(#deckle-edge)] bg-card shadow-sm" />
      <div className={cn('relative', classNames?.body)}>{children}</div>
    </div>
  )
}
