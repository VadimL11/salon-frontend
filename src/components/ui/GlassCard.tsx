'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'

interface GlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  href?: string
  delay?: number
  hoverable?: boolean
}

export default function GlassCard({
  children,
  className = '',
  onClick,
  delay = 0,
  hoverable = false,
}: GlassCardProps) {
  const interactive = Boolean(onClick)
  const hasHoverEffect = interactive || hoverable
  const hoverAnimation = hasHoverEffect
    ? {
        y: interactive ? -8 : -5,
        scale: interactive ? 1.016 : 1.009,
        boxShadow: interactive
          ? '0 28px 58px rgba(63,31,44,0.16), inset 0 1px 0 rgba(255,255,255,0.86)'
          : '0 20px 44px rgba(63,31,44,0.12), inset 0 1px 0 rgba(255,255,255,0.82)',
        borderColor: interactive ? 'rgba(107,35,57,0.34)' : 'rgba(107,35,57,0.24)',
      }
    : undefined
  const baseClass = `glass-card rounded-3xl p-6 select-none transition-[border-color,box-shadow,transform,background-color] duration-150 ${
    interactive ? 'cursor-pointer touch-manipulation' : ''
  } ${className}`
  const sharedProps = {
    initial: { opacity: 0, scale: 0.975, y: 10 },
    animate: { opacity: 1, scale: 1, y: 0 },
    transition: { duration: 0.42, delay, ease: [0.22, 1, 0.36, 1] as const },
    whileHover: hoverAnimation,
    style: {
      border: '1px solid rgba(96,42,60,0.18)',
      willChange: 'transform',
    },
  }

  if (interactive) {
    return (
      <motion.button
        type="button"
        onClick={onClick}
        whileTap={{ scale: 0.986, y: 1 }}
        className={`${baseClass} appearance-none border-none bg-transparent text-left outline-none`}
        {...sharedProps}
      >
        {children}
      </motion.button>
    )
  }

  return (
    <motion.div className={baseClass} {...sharedProps}>
      {children}
    </motion.div>
  )
}
