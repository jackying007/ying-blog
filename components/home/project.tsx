import type { Ref } from 'react'
import { Card } from '@/components/card'
import { ZoomableVideo } from './zoomable-video'

export type TProject = {
  title: string
  link: string
  desc: string
  images?: string[]
  videos?: string[]
}

type ProjectProps = {
  item: TProject
  className?: string
  ref?: Ref<HTMLDivElement>
}
export function Project({ item, className, ref }: ProjectProps) {
  return (
    <Card
      classNames={{
        wrapper: className,
        body: 'p-5 pt-4 zoomable'
      }}
      ref={ref}
    >
      <div
        className="text-xl text-center font-bold mb-3 pb-3 border-b border-black/8 dark:border-white/8 cursor-pointer hover:text-primary hover:underline"
        onClick={() => window.open(item.link)}
      >
        {item.title}
      </div>
      {item.images?.map(image => (
        <img key={image} className="w-full mb-1 zoomable-img" src={image} />
      ))}
      {item.videos?.map(video => (
        <ZoomableVideo key={video} className="w-full" src={video} />
      ))}
      <p className="mt-3 pt-3 border-t border-black/8 dark:border-white/8">
        {item.desc}
      </p>
    </Card>
  )
}
