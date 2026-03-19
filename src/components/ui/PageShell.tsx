'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import InteractiveBeautyBackground from './InteractiveBeautyBackground'
import BackButton from './BackButton'
import EndSessionButton from './EndSessionButton'

interface PageShellProps {
  children: ReactNode
  title?: string
  showBack?: boolean
  /** Contextual pill shown when a category/selection context is active */
  contextPill?: string
  maxWidth?: string
}

export default function PageShell({
  children,
  title,
  showBack = false,
  contextPill,
  maxWidth = 'max-w-5xl',
}: PageShellProps) {
  return (
    <div className="relative isolate min-h-dvh">
      <InteractiveBeautyBackground />
      <main className="relative z-10 min-h-dvh flex flex-col items-center justify-center px-4 py-12">

        {/* Top bar: brand name left, end-session right */}
        <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-3.5 pointer-events-none">
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="font-serif text-sm font-semibold tracking-[0.18em] text-[#7c4258] pointer-events-none select-none"
          >
            TINTEL
          </motion.span>
          <div className="pointer-events-auto">
            <EndSessionButton />
          </div>
        </div>

        {/* Context pill — only when a real context is available (e.g. selected category) */}
        {contextPill && (
          <motion.p
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="mb-4 rounded-full border border-[rgba(107,35,57,0.2)] bg-[rgba(255,255,255,0.52)] px-4 py-1.5 text-xs font-sans tracking-widest uppercase text-[#7c4258]"
          >
            {contextPill}
          </motion.p>
        )}

        {/* Page title */}
        {title && (
          <motion.h1
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 text-center font-serif text-4xl font-semibold text-[#332631] md:text-5xl"
          >
            {title}
          </motion.h1>
        )}

        {/* Page content */}
        <div className={`w-full ${maxWidth}`}>
          {children}
        </div>

        {/* Back button */}
        {showBack && (
          <div className="mt-8 flex justify-center">
            <BackButton />
          </div>
        )}
      </main>
    </div>
  )
}
