'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { createHoverLift, createTapPress, fadeUpTransition } from './motion'

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
    ? createHoverLift({
        y: interactive ? -3 : -2,
        scale: interactive ? 1.008 : 1.004,
        boxShadow: interactive
          ? '0 20px 40px rgba(63,31,44,0.12), inset 0 1px 0 rgba(255,255,255,0.84)'
          : '0 16px 32px rgba(63,31,44,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
        borderColor: interactive ? 'rgba(107,35,57,0.28)' : 'rgba(107,35,57,0.22)',
      })
    : undefined
  const baseClass = `glass-card rounded-3xl p-6 select-none transition-[border-color,box-shadow,transform,background-color] duration-150 ${
    interactive ? 'cursor-pointer touch-manipulation' : ''
  } ${className}`
  const sharedProps = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    transition: fadeUpTransition(delay),
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
        whileTap={createTapPress()}
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
