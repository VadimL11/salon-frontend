'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'
import { createHoverLift, createTapPress, fadeUpTransition } from './motion'

export default function EndSessionButton() {
  const router = useRouter()
  const { endSession, language } = useAppStore()
  const t = DICT[language].common

  const handleEnd = () => {
    endSession()
    router.push('/')
  }

  return (
    <motion.button
      onClick={handleEnd}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={fadeUpTransition(0.14, 0.22)}
      whileHover={createHoverLift()}
      whileTap={createTapPress()}
      className="
        flex items-center gap-1.5 px-3.5 py-2 rounded-full
        text-[11px] font-sans font-medium tracking-wide
        text-[#6b2339] border border-[rgba(107,35,57,0.22)]
        bg-[rgba(255,255,255,0.62)] backdrop-blur-sm
        hover:bg-[rgba(107,35,57,0.08)] transition-[background-color,box-shadow,transform] duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f5267]
        select-none
      "
      title={t.endSession}
    >
      <span className="text-[13px] leading-none">⏻</span>
      <span className="hidden sm:inline">{t.endSession}</span>
    </motion.button>
  )
}
