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
            className="font-serif text-sm font-semibold tracking-[0.18em] text-[#c9a84c] pointer-events-none select-none"
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
            className="mb-4 text-xs font-sans tracking-widest uppercase text-[#a07830] border border-[rgba(201,168,76,0.40)] rounded-full px-4 py-1.5 bg-[rgba(232,213,163,0.15)]"
          >
            {contextPill}
          </motion.p>
        )}

        {/* Page title */}
        {title && (
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-serif font-semibold text-[#3d2a1a] text-center mb-8"
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
