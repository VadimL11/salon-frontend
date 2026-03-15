'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'

export default function BackButton({ label }: { label?: string }) {
  const router = useRouter()
  const language = useAppStore((s) => s.language)
  const defaultLabel = DICT[language].common.back

  return (
    <motion.button
      onClick={() => router.back()}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.4 }}
      whileHover={{ scale: 1.012, y: -1 }}
      whileTap={{ scale: 0.99, y: 0 }}
      className="
        mt-6 px-7 py-2.5 rounded-full
        text-sm font-sans font-medium tracking-wide
        text-[#a07830] border border-[rgba(201,168,76,0.40)]
        bg-[rgba(232,213,163,0.10)]
        hover:bg-[rgba(232,213,163,0.22)]
        transition-[background-color,box-shadow,transform] duration-150 select-none
        focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c]
      "
    >
      {label ?? defaultLabel}
    </motion.button>
  )
}
