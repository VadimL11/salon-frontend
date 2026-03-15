'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'

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
      transition={{ delay: 0.6 }}
      whileHover={{ scale: 1.012, y: -1 }}
      whileTap={{ scale: 0.99, y: 0 }}
      className="
        flex items-center gap-1.5 px-3.5 py-2 rounded-full
        text-[11px] font-sans font-medium tracking-wide
        text-[#a07830] border border-[rgba(201,168,76,0.38)]
        bg-[rgba(253,250,245,0.70)] backdrop-blur-sm
        hover:bg-[rgba(232,213,163,0.28)] transition-[background-color,box-shadow,transform] duration-150
        focus:outline-none focus-visible:ring-2 focus-visible:ring-gold
        select-none
      "
      title={t.endSession}
    >
      <span className="text-[13px] leading-none">⏻</span>
      <span className="hidden sm:inline">{t.endSession}</span>
    </motion.button>
  )
}
