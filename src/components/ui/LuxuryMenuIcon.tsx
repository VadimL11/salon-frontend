'use client'

import {
  CalendarHeart,
  Tag,
  Coffee,
  Sparkles,
  TrendingUp,
  Settings,
  UserPlus,
} from 'lucide-react'

export type LuxuryMenuIconName =
  | 'account'
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

const ICON_MAP = {
  account: UserPlus,
  booking: CalendarHeart,
  price: Tag,
  drinks: Coffee,
  care: Sparkles,
  trends: TrendingUp,
  admin: Settings,
} as const

export default function LuxuryMenuIcon({
  name,
  className = 'h-6 w-6',
}: LuxuryMenuIconProps) {
  const Icon = ICON_MAP[name]

  return (
    <Icon
      className={className}
      strokeWidth={1.6}
      aria-hidden="true"
    />
  )
}
