'use client'

import { motion } from 'framer-motion'
import { ReactNode } from 'react'
import { createHoverLift, createTapPress, fadeUpTransition } from './motion'

interface DarkGlassCardProps {
  children: ReactNode
  className?: string
  onClick?: () => void
  delay?: number
}

export default function DarkGlassCard({
  children,
  className = '',
  onClick,
  delay = 0,
}: DarkGlassCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={fadeUpTransition(delay, 0.3)}
      whileHover={
        onClick
          ? createHoverLift({
              y: -2,
              scale: 1.008,
              boxShadow: '0 16px 32px rgba(63,31,44,0.16), inset 0 1px 0 rgba(255,255,255,0.05)',
              borderColor: 'rgba(143,82,103,0.26)',
            })
          : undefined
      }
      whileTap={onClick ? createTapPress() : undefined}
      onClick={onClick}
      className={`rounded-2xl p-6 ${onClick ? 'cursor-pointer' : ''} transition-colors duration-150 select-none ${className}`}
      style={{
        background: 'linear-gradient(135deg, rgba(39,24,35,0.9) 0%, rgba(19,26,43,0.84) 100%)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(143,82,103,0.18)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.04)',
        willChange: 'transform',
      }}
    >
      {children}
    </motion.div>
  )
}
