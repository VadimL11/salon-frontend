'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import PageShell from '@/components/ui/PageShell'
import GlassCard from '@/components/ui/GlassCard'
import GoldButton from '@/components/ui/GoldButton'
import LuxuryMenuIcon, { type LuxuryMenuIconName } from '@/components/ui/LuxuryMenuIcon'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'
import { getAccountCopy } from '@/lib/accountCopy'

export default function MenuPage() {
  const router = useRouter()
  const language = useAppStore((state) => state.language)
  const user = useAppStore((state) => state.user)
  const userRole = useAppStore((state) => state.userRole)
  const t = DICT[language].menu
  const accountCopy = getAccountCopy(language)

  const menuItems: {
    icon: LuxuryMenuIconName
    title: string
    subtitle: string
    route: string
  }[] = [
    ...(user && userRole !== 'guest'
      ? [{ icon: 'account' as const, title: accountCopy.tileTitle, subtitle: accountCopy.tileSubtitle, route: '/account' }]
      : []),
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
          className="pointer-events-none absolute left-1/2 top-[3%] -z-10 h-[19rem] w-[min(54rem,84vw)] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(255,255,255,0.88)_0%,rgba(244,236,240,0.74)_24%,rgba(143,82,103,0.18)_48%,rgba(143,82,103,0)_76%)] blur-3xl"
          animate={{ opacity: [0.74, 0.94, 0.8], scale: [0.97, 1.04, 0.99] }}
          transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -left-8 top-[18%] -z-10 h-52 w-52 rounded-full bg-[radial-gradient(circle,rgba(255,247,249,0.82)_0%,rgba(143,82,103,0.16)_44%,rgba(143,82,103,0)_76%)] blur-[72px]"
          animate={{ x: [0, 18, 6, 0], y: [0, -8, 10, 0], opacity: [0.45, 0.6, 0.48, 0.45] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          aria-hidden
          className="pointer-events-none absolute -right-10 bottom-[4%] -z-10 h-60 w-60 rounded-full bg-[radial-gradient(circle,rgba(249,249,255,0.78)_0%,rgba(29,41,66,0.12)_42%,rgba(29,41,66,0)_76%)] blur-[80px]"
          animate={{ x: [0, -16, -4, 0], y: [0, 10, -8, 0], opacity: [0.38, 0.52, 0.42, 0.38] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut', delay: -4 }}
        />

        {user && userRole !== 'guest' && (
          <GlassCard className="relative mb-6 flex flex-col gap-5 overflow-hidden rounded-[30px] px-7 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <div className="pointer-events-none absolute inset-x-10 top-0 h-16 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0)_76%)] opacity-80" />
            <div className="relative">
              <p className="text-[11px] uppercase tracking-[0.28em] text-[#7c4258]">{accountCopy.signedInAs}</p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-[#332631]">
                {[user.firstName, user.lastName].filter(Boolean).join(' ') || user.email}
              </h2>
              <p className="mt-2 text-sm text-[#6b5a66]">{user.email}</p>
              <div className="mt-3 inline-flex items-center rounded-full border border-[rgba(107,35,57,0.16)] bg-[rgba(255,255,255,0.5)] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.22em] text-[#7c4258]">
                {user.role === 'admin' ? accountCopy.adminAccount : accountCopy.registeredClient}
              </div>
            </div>
            <div className="relative">
              <GoldButton variant="ghost" onClick={() => router.push('/account')} className="px-5 py-3 text-sm">
                {accountCopy.openAccount}
              </GoldButton>
            </div>
          </GlassCard>
        )}

        <div className="relative grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <GlassCard
              key={item.route}
              delay={0.1 + index * 0.07}
              onClick={() => router.push(item.route)}
              className="group relative flex min-h-[236px] flex-col items-start gap-5 overflow-hidden rounded-[30px] px-7 py-7 sm:px-8 sm:py-8"
            >
              <div className="pointer-events-none absolute inset-x-8 top-0 h-16 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.76)_0%,rgba(255,255,255,0)_76%)] opacity-80" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0)_0%,rgba(238,229,233,0.52)_100%)] opacity-75" />

              <div className="relative flex h-[4.25rem] w-[4.25rem] items-center justify-center rounded-[1.55rem] border border-[rgba(107,35,57,0.14)] bg-[linear-gradient(145deg,rgba(255,255,255,0.96)_0%,rgba(245,237,239,0.94)_58%,rgba(224,214,221,0.84)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.9),0_12px_26px_rgba(63,31,44,0.08)]">
                <LuxuryMenuIcon name={item.icon} className="h-6 w-6 text-[#5d3446]" />
              </div>

              <div className="relative max-w-[18rem]">
                <h3 className="mb-2 font-serif text-[1.35rem] font-semibold leading-tight text-[#332631]">
                  {item.title}
                </h3>
                <p className="font-sans text-sm leading-6 text-[#6b5a66]">{item.subtitle}</p>
              </div>

              <div className="relative mt-auto flex items-center gap-3">
                <span className="h-px w-8 bg-gradient-to-r from-[rgba(107,35,57,0.48)] to-transparent opacity-0 transition-opacity duration-200 group-hover:opacity-100" />
                <motion.span className="text-[11px] font-medium tracking-[0.28em] text-[#7c4258] opacity-70 transition-opacity duration-200 group-hover:opacity-100">
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
