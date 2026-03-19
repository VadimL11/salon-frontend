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
    'focus:outline-none focus-visible:ring-2 focus-visible:ring-[#8f5267] focus-visible:ring-offset-0',
    disabled ? 'opacity-40 cursor-not-allowed pointer-events-none' : '',
    fullWidth ? 'w-full' : '',
  ].join(' ')

  const solid = 'text-[#fff8f8] bg-[linear-gradient(135deg,#8f5267_0%,#6b2339_54%,#1d2942_100%)] shadow-[0_10px_28px_rgba(65,31,46,0.22)]'
  const ghost = 'text-[#6b2339] border border-[rgba(107,35,57,0.28)] bg-[rgba(255,255,255,0.36)] hover:bg-[rgba(107,35,57,0.08)]'

  return (
    <motion.button
      transition={{ type: 'spring', stiffness: 280, damping: 20, mass: 0.7 }}
      whileHover={disabled ? {} : {
        y: -1,
        scale: 1.012,
        boxShadow: variant === 'solid'
          ? '0 14px 34px rgba(65,31,46,0.26)'
          : '0 10px 24px rgba(65,31,46,0.12)',
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
