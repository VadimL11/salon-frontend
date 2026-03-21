'use client'

import type { TargetAndTransition, Transition } from 'framer-motion'

export const MOTION_EASE = [0.22, 1, 0.36, 1] as const

export function fadeUpTransition(delay = 0, duration = 0.28): Transition {
  return {
    delay,
    duration,
    ease: MOTION_EASE,
  }
}

export function createHoverLift({
  y = -2,
  scale = 1.006,
  boxShadow,
  borderColor,
}: {
  y?: number
  scale?: number
  boxShadow?: string
  borderColor?: string
} = {}): TargetAndTransition {
  return {
    y,
    scale,
    ...(boxShadow ? { boxShadow } : {}),
    ...(borderColor ? { borderColor } : {}),
    transition: {
      duration: 0.16,
      ease: MOTION_EASE,
    },
  }
}

export function createTapPress(scale = 0.992): TargetAndTransition {
  return {
    y: 0,
    scale,
    transition: {
      duration: 0.12,
      ease: MOTION_EASE,
    },
  }
}
