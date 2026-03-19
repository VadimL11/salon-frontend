'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import InteractiveBeautyBackground from './InteractiveBeautyBackground'
import BackButton from './BackButton'
import EndSessionButton from './EndSessionButton'

interface LuxuryShellProps {
  children: ReactNode
  title?: string
  subtitle?: string
  showBack?: boolean
  showEndSession?: boolean
  maxWidth?: string
  backgroundVariant?: 'light' | 'dark'
  contentAlign?: 'center' | 'start'
}

export default function LuxuryShell({
  children,
  title,
  subtitle,
  showBack = false,
  showEndSession = true,
  maxWidth = 'max-w-6xl',
  backgroundVariant = 'dark',
  contentAlign = 'center',
}: LuxuryShellProps) {
  const isDark = backgroundVariant === 'dark'
  const contentAlignClass = contentAlign === 'start' ? 'justify-start pt-4 sm:pt-6' : 'justify-center'
  const brandClass = isDark ? 'text-[#c69aad]' : 'text-[#7c4258]'
  const titleClass = isDark ? 'text-[#f7edf0]' : 'text-[#332631]'
  const subtitleClass = isDark
    ? 'text-[rgba(246,235,239,0.68)]'
    : 'text-[rgba(51,38,49,0.72)]'

  return (
    <div className="relative isolate min-h-dvh">
      <InteractiveBeautyBackground variant={backgroundVariant} />
      <main className="relative z-10 min-h-dvh px-4 py-10 sm:px-6">
        <div className="mx-auto w-full max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`font-serif text-xs tracking-[0.35em] uppercase ${brandClass}`}
            >
              TINTEL BEAUTY
            </motion.div>
            {showEndSession ? <EndSessionButton /> : <div className="h-9" />}
          </div>

          <div className={`mx-auto mt-10 flex min-h-[calc(100dvh-7rem)] w-full flex-col items-center ${contentAlignClass}`}>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              className={`w-full ${maxWidth}`}
            >
              {(title || subtitle) && (
                <div className="mb-8 text-center">
                  {title && (
                    <h1 className={`font-serif text-4xl font-semibold sm:text-5xl ${titleClass}`}>
                      {title}
                    </h1>
                  )}
                  {subtitle && (
                    <p className={`mx-auto mt-3 max-w-2xl text-sm sm:text-base ${subtitleClass}`}>
                      {subtitle}
                    </p>
                  )}
                </div>
              )}

              {children}

              {showBack && (
                <div className="mt-8 flex justify-center">
                  <BackButton />
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
