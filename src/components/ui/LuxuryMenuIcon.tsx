'use client'

import type { ReactNode } from 'react'

export type LuxuryMenuIconName =
  | 'booking'
  | 'price'
  | 'drinks'
  | 'care'
  | 'trends'
  | 'admin'

interface LuxuryMenuIconProps {
  name: LuxuryMenuIconName
  className?: string
}

function IconRoot({
  className = '',
  children,
}: {
  className?: string
  children: ReactNode
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.45}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      {children}
    </svg>
  )
}

export default function LuxuryMenuIcon({
  name,
  className,
}: LuxuryMenuIconProps) {
  if (name === 'booking') {
    return (
      <IconRoot className={className}>
        <path d="M7 4.75V7.25" />
        <path d="M17 4.75V7.25" />
        <rect x="4.5" y="6.25" width="15" height="13.25" rx="3.25" />
        <path d="M4.5 10.25H19.5" />
        <path d="M12 11.1 14.35 13.45 12 15.8 9.65 13.45 12 11.1Z" />
      </IconRoot>
    )
  }

  if (name === 'price') {
    return (
      <IconRoot className={className}>
        <path d="M20 11.75 12.35 19.4 4.6 11.65V5.25h7.6L20 11.75Z" />
        <circle cx="8.2" cy="8.15" r="0.95" />
        <path d="M11.25 10.75h4.4" />
        <path d="M11.25 13.9h2.75" />
      </IconRoot>
    )
  }

  if (name === 'drinks') {
    return (
      <IconRoot className={className}>
        <path d="M7 8.25h8.5v3.2a4.2 4.2 0 0 1-4.2 4.2H11.2A4.2 4.2 0 0 1 7 11.45V8.25Z" />
        <path d="M15.5 9h1.3a2.4 2.4 0 1 1 0 4.8h-1.1" />
        <path d="M9.1 19h5.8" />
        <path d="M9.4 4.6c0 1 .75 1.45.75 2.35" />
        <path d="M12 4.1c0 1 .75 1.4.75 2.3" />
      </IconRoot>
    )
  }

  if (name === 'care') {
    return (
      <IconRoot className={className}>
        <path d="M10 3.9h4" />
        <path d="M11 3.9v2.45" />
        <path d="M13 3.9v2.45" />
        <path d="M9 7.1h6" />
        <path d="M8.2 9.2v7.3a2.5 2.5 0 0 0 2.5 2.5h2.6a2.5 2.5 0 0 0 2.5-2.5V9.2A2.2 2.2 0 0 0 13.6 7h-3.2a2.2 2.2 0 0 0-2.2 2.2Z" />
        <path d="M12 11.05c-.95 1.15-1.6 2.05-1.6 3.05a1.6 1.6 0 0 0 3.2 0c0-1-.65-1.9-1.6-3.05Z" />
      </IconRoot>
    )
  }

  if (name === 'trends') {
    return (
      <IconRoot className={className}>
        <path d="m12 3.5 1.35 4 4 1.35-4 1.35-1.35 4-1.35-4-4-1.35 4-1.35 1.35-4Z" />
        <path d="m18.25 13.25.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2Z" />
      </IconRoot>
    )
  }

  return (
    <IconRoot className={className}>
      <rect x="4.5" y="5.5" width="15" height="13" rx="3.5" />
      <path d="M8 9.25h8" />
      <path d="M8 12.5h8" />
      <path d="M8 15.75h5" />
      <circle cx="16.5" cy="15.75" r="0.9" fill="currentColor" stroke="none" />
    </IconRoot>
  )
}
