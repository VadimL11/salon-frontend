'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowRight, Languages } from 'lucide-react'
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
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[rgba(107,35,57,0.16)] bg-[rgba(255,255,255,0.42)] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.28em] text-[#7c4258] shadow-[inset_0_1px_0_rgba(255,255,255,0.78)]">
            <Languages className="h-3.5 w-3.5" strokeWidth={1.8} />
            <span>{t.tagline}</span>
          </div>
          <h1
            className="font-serif font-semibold text-[#332631]"
            style={{ fontSize: 'clamp(2.8rem, 8vw, 5.5rem)', letterSpacing: '-0.01em', lineHeight: 1.05 }}
          >
            TINTEL
          </h1>
          <h2
            className="font-serif italic font-light text-[#6b5a66]"
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
                  ? 'border-[rgba(107,35,57,0.34)] bg-[rgba(107,35,57,0.08)] shadow-[0_0_26px_rgba(107,35,57,0.14)]'
                  : ''
              }`}
            >
              <span className="text-5xl leading-none drop-shadow-sm">{lang.flag}</span>
              <span className="font-sans text-sm font-semibold tracking-wide text-[#5c4030]">
                {lang.label}
              </span>
              {selected === lang.code && (
                <motion.div
                  layoutId="lang-indicator"
                  className="h-0.5 w-4 rounded-full bg-[linear-gradient(90deg,#8f5267_0%,#6b2339_55%,#1d2942_100%)]"
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
            <span>{DICT[selected].common.start}</span>
            <ArrowRight className="h-4 w-4" strokeWidth={1.9} />
          </GoldButton>
        </motion.div>

      </main>
    </div>
  )
}
