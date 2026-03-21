'use client'

import { motion, HTMLMotionProps } from 'framer-motion'
import { ReactNode } from 'react'
import { createHoverLift, createTapPress, MOTION_EASE } from './motion'

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
      transition={{ duration: 0.16, ease: MOTION_EASE }}
      whileHover={
        disabled
          ? undefined
          : createHoverLift({
              y: -2,
              scale: 1.008,
              boxShadow:
                variant === 'solid'
                  ? '0 14px 30px rgba(65,31,46,0.22)'
                  : '0 10px 22px rgba(65,31,46,0.1)',
            })
      }
      whileTap={disabled ? undefined : createTapPress()}
      disabled={disabled}
      className={`${base} ${variant === 'solid' ? solid : ghost} ${className}`}
      {...rest}
    >
      {children}
    </motion.button>
  )
}
