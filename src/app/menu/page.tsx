'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import PageShell from '@/components/ui/PageShell'
import GlassCard from '@/components/ui/GlassCard'
import LuxuryMenuIcon, { type LuxuryMenuIconName } from '@/components/ui/LuxuryMenuIcon'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'

export default function MenuPage() {
  const router = useRouter()
  const language = useAppStore((state) => state.language)
  const userRole = useAppStore((state) => state.userRole)
  const t = DICT[language].menu

  const menuItems: {
    icon: LuxuryMenuIconName
    title: string
    subtitle: string
    route: string
  }[] = [
    { icon: 'booking', title: t.booking, subtitle: t.bookingSubtitle, route: '/services' },
    { icon: 'price', title: t.price, subtitle: t.priceSubtitle, route: '/price' },
    { icon: 'drinks', title: t.orderDrink, subtitle: t.orderDrinkSubtitle, route: '/order-drink' },
    { icon: 'care', title: t.orderProduct, subtitle: t.orderProductSubtitle, route: '/order-product' },
    { icon: 'trends', title: t.trends, subtitle: t.trendsSubtitle, route: '/trends' },
  ]

  if (userRole === 'admin') {
    menuItems.push({
      icon: 'admin',
      title: t.admin,
      subtitle: t.adminSubtitle,
      route: '/admin',
    })
  }

  return (
    <PageShell title={t.title} maxWidth="max-w-6xl">
      <div className="relative isolate">
        <motion.div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-[3%] -z-10 h-[19rem] w-[min(54rem,84vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.88)_0%,rgba(244,235,220,0.74)_24%,rgba(225,199,159,0.24)_48%,rgba(225,199,159,0)_76%)] blur-3xl"
          animate={{ opacity: [0.74, 0.94, 0.8], scale: [0.97, 1.04, 0.99] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-8 top-[18%] -z-10 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(255,245,232,0.82)_0%,rgba(232,210,174,0.22)_44%,rgba(232,210,174,0)_76%)] blur-[72px]"
          animate={{ x: [0, 18, 6, 0], y: [0, -8, 10, 0], opacity: [0.45, 0.6, 0.48, 0.45] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-[4%] -z-10 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(255,250,244,0.78)_0%,rgba(217,188,149,0.20)_42%,rgba(217,188,149,0)_76%)] blur-[80px]"
          animate={{ x: [0, -16, -4, 0], y: [0, 10, -8, 0], opacity: [0.38, 0.52, 0.42, 0.38] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: -4 }}
        />

        <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <GlassCard
              key={item.route}
              delay={0.1 + index * 0.07}
              onClick={() => router.push(item.route)}
              className="group relative flex min-h-[236px] flex-col items-start gap-5 overflow-hidden rounded-[30px] px-7 py-7 sm:px-8 sm:py-8"
            >
              <div className="pointer-events-none absolute inset-x-8 top-0 h-16 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0)_76%)] opacity-80" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(243,234,221,0.46)_100%)] opacity-75" />

              <div className="relative flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-[1.55rem] border border-[rgba(189,160,123,0.24)] bg-[linear-gradient(145deg,rgba(255,252,248,0.96)_0%,rgba(245,236,222,0.94)_58%,rgba(233,216,191,0.82)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_26px_rgba(137,103,72,0.08)]">
                <LuxuryMenuIcon name={item.icon} className="h-6 w-6 text-[#6d4f36]" />
              </div>

              <div className="relative max-w-[18rem]">
                <h3 className="mb-2 font-serif text-[1.35rem] font-semibold leading-tight text-[#4a3524]">
                  {item.title}
                </h3>
                <p className="font-sans text-sm leading-6 text-[#6f5640]">{item.subtitle}</p>
              </div>

              <div className="relative mt-auto flex items-center gap-3">
                <span className="h-px w-8 bg-gradient-to-r from-[rgba(160,120,48,0.55)] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <motion.span className="text-[11px] font-medium tracking-[0.28em] text-[#8d6a31] opacity-70 transition-opacity duration-200 group-hover:opacity-100">
                  {t.open}
                </motion.span>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>
    </PageShell>
  )
}
