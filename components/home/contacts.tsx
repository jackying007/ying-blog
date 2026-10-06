import { useRef } from 'react'
import { Icon } from '@iconify/react'
import { type Variants, motion, useInView } from 'motion/react'

const contactsVariants: Variants = {
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

const contacts = [
  {
    icon: 'mdi:github',
    link: 'https://github.com/jackying007'
  },
  {
    icon: 'uiw:weixin',
    link: '/wechat.png'
  },
  {
    icon: 'ri:qq-fill',
    link: '/qq.jpg'
  },
  {
    icon: 'clarity:email-solid',
    link: 'mailto:1556393081@qq.com'
  }
]

export function Contacts() {
  const wrapperRef = useRef(null)
  const inView = useInView(wrapperRef)

  return (
    <motion.div
      variants={contactsVariants}
      initial="initial"
      animate={inView ? 'open' : ''}
      className="relative h-[30vh] px-6 fc items-start"
      ref={wrapperRef}
    >
      {contacts.map((contact, index) => {
        return (
          <motion.div
            key={index}
            variants={contactsVariants}
            className="w-14 h-14 p-2 fc rounded-lg m-4 cursor-pointer transition-shadow convex hover:concave"
          >
            <Icon
              className="w-full h-auto"
              icon={contact.icon}
              color="var(--rp-c-brand)"
              onClick={() => window.open(contact.link)}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
