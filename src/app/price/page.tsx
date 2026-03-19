'use client'

import PageShell from '@/components/ui/PageShell'
import GlassCard from '@/components/ui/GlassCard'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'
import { getLocalizedText } from '@/data/salon'

export default function PricePage() {
  const language = useAppStore((state) => state.language)
  const services = useAppStore((state) => state.services)
  const t = DICT[language].price

  return (
    <PageShell title={t.title} showBack>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {services.map((service, index) => (
          <GlassCard
            key={service.id}
            delay={0.1 + index * 0.08}
            className="flex flex-col items-center gap-4 px-5 py-8 text-center"
          >
            <div className="text-2xl text-[#8f5267]">⏱</div>
            <h3 className="font-serif text-base font-semibold leading-snug text-[#332631]">
              {getLocalizedText(service.title, language)}
            </h3>
            <p className="text-xs tracking-wide text-[#7c4258]">{service.durationMinutes} min</p>
            <p className="font-serif text-2xl font-semibold text-[#332631]">€{service.price}</p>
          </GlassCard>
        ))}
      </div>
    </PageShell>
  )
}
