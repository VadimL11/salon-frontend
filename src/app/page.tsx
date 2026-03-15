'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import InteractiveBeautyBackground from '@/components/ui/InteractiveBeautyBackground'
import GlassCard from '@/components/ui/GlassCard'
import GoldButton from '@/components/ui/GoldButton'
import { useAppStore } from '@/store/useAppStore'
import { DICT, type Language } from '@/dictionaries'

const languages: { code: Language; flag: string; label: string }[] = [
  { code: 'DE', flag: '🇩🇪', label: 'Deutsch' },
  { code: 'UA', flag: '🇺🇦', label: 'Українська' },
  { code: 'GB', flag: '🇬🇧', label: 'English' },
]

export default function LanguagePage() {
  const router = useRouter()
  const { language, setLanguage } = useAppStore()
  const [selected, setSelected] = useState<Language>(language)
  const t = DICT[selected].common

  const handleStart = () => {
    setLanguage(selected)
    router.push('/auth')
  }

  return (
    <div className="relative isolate min-h-dvh">
      <InteractiveBeautyBackground />
      <main className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-4 py-16 gap-10">

        {/* Brand Logo */}
        <motion.div
          initial={{ opacity: 0, y: -24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="text-center"
        >
          <p className="text-xs font-sans font-medium tracking-[0.28em] uppercase text-[#a07830] mb-1">
            {t.tagline}
          </p>
          <h1
            className="font-serif font-semibold text-[#3d2a1a]"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', letterSpacing: '-0.01em', lineHeight: 1.05 }}
          >
            TINTEL
          </h1>
          <h2
            className="font-serif italic font-light text-[#7a5c44]"
            style={{ fontSize: 'clamp(1.4rem, 4vw, 2.5rem)', letterSpacing: '0.22em' }}
          >
            BEAUTY
          </h2>
        </motion.div>

        {/* Language Cards */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="flex flex-col sm:flex-row gap-4 w-full max-w-lg"
        >
          {languages.map((lang, i) => (
            <GlassCard
              key={lang.code}
              delay={0.3 + i * 0.1}
              onClick={() => setSelected(lang.code)}
              className={`flex-1 flex flex-col items-center gap-3 py-7 transition-all duration-200 ${
                selected === lang.code
                  ? 'border-[rgba(201,168,76,0.7)] bg-[rgba(232,213,163,0.30)] shadow-[0_0_24px_rgba(201,168,76,0.25)]'
                  : ''
              }`}
            >
              <span className="text-4xl leading-none">{lang.flag}</span>
              <span className="font-sans text-sm font-medium tracking-wide text-[#5c4030]">
                {lang.label}
              </span>
              {selected === lang.code && (
                <motion.div
                  layoutId="lang-indicator"
                  className="w-4 h-0.5 rounded-full bg-gradient-to-r from-[#e8d5a3] to-[#c9a84c]"
                />
              )}
            </GlassCard>
          ))}
        </motion.div>

        {/* Start Button */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <GoldButton onClick={handleStart} className="px-14 py-4 text-base">
            {DICT[selected].common.start}
          </GoldButton>
        </motion.div>

      </main>
    </div>
  )
}
