'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'

type GoldButtonProps = HTMLMotionProps<'button'> & {
  children: ReactNode
  variant?: 'solid' | 'ghost'
  fullWidth?: boolean
}

export default function GoldButton({
  children,
  variant = 'solid',
  fullWidth = false,
  className = '',
  disabled,
  ...rest
}: GoldButtonProps) {
  const base = [
    'inline-flex items-center justify-center gap-2',
    'px-8 py-3 rounded-full font-sans font-medium text-sm tracking-wide',
    'transition-[background-color,border-color,box-shadow,transform] duration-150 select-none',
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#c9a84c] focus-visible:ring-offset-0',
    disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
    fullWidth ? 'w-full' : '',
  ].join(' ')

  const solid = 'text-white bg-gradient-to-r from-[#e8d5a3] via-[#c9a84c] to-[#a07830] shadow-[0_4px_18px_rgba(201,168,76,0.22)]'
  const ghost = 'text-[#a07830] border border-[rgba(201,168,76,0.45)] bg-[rgba(232,213,163,0.12)] hover:bg-[rgba(232,213,163,0.22)]'

  return (
    <motion.button
      transition={{ type: 'spring', stiffness: 280, damping: 20, mass: 0.7 }}
      whileHover={disabled ? {} : {
        y: -1,
        scale: 1.012,
        boxShadow: variant === 'solid'
          ? '0 8px 24px rgba(201,168,76,0.28)'
          : '0 8px 20px rgba(201,168,76,0.14)',
      }}
      whileTap={disabled ? {} : { scale: 0.988, y: 0 }}
      disabled={disabled}
      className={`${base} ${variant === 'solid' ? solid : ghost} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
