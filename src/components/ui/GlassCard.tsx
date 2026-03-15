'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  delay?: number
}

export default function GlassCard({
  children,
  className = '',
  onClick,
  delay = 0,
}: GlassCardProps) {
  const interactive = Boolean(onClick)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={interactive ? {
        y: -3,
        scale: 1.008,
        boxShadow: '0 18px 38px rgba(129,97,66,0.12), inset 0 1px 0 rgba(255,255,255,0.82)',
        borderColor: 'rgba(193,163,124,0.42)',
      } : undefined}
      whileTap={interactive ? { scale: 0.992, y: 0 } : undefined}
      onClick={onClick}
      className={`glass-card rounded-3xl p-6 transition-[border-color,box-shadow,transform] duration-200 select-none ${interactive ? 'cursor-pointer' : ''} ${className}`}
      style={{
        border: '1px solid rgba(205,179,146,0.3)',
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  )
}
