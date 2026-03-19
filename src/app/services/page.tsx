'use client'

import { useRouter } from 'next/navigation'
import PageShell from '@/components/ui/PageShell'
import GlassCard from '@/components/ui/GlassCard'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'
import { getLocalizedText } from '@/data/salon'

export default function ServicesPage() {
  const router = useRouter()
  const language = useAppStore((state) => state.language)
  const serviceCategories = useAppStore((state) => state.serviceCategories)
  const services = useAppStore((state) => state.services)
  const setCategory = useAppStore((state) => state.setCategory)
  const t = DICT[language].services

  return (
    <PageShell title={t.title} showBack>
      <p className="mb-6 -mt-4 text-center text-sm text-[#6b5a66]">{t.chooseCategory}</p>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {serviceCategories.map((category, index) => {
          const categoryServices = services.filter((item) => item.categoryId === category.id)

          return (
            <GlassCard
              key={category.id}
              delay={0.1 + index * 0.08}
              onClick={() => {
                setCategory(category.slug, getLocalizedText(category.title, language), category.id)
                router.push(`/services/${category.slug}`)
              }}
              className="group flex items-center gap-5 p-7"
            >
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[rgba(107,35,57,0.14)] bg-[linear-gradient(145deg,rgba(255,255,255,0.96)_0%,rgba(245,237,239,0.94)_58%,rgba(224,214,221,0.84)_100%)] text-3xl shadow-[0_12px_26px_rgba(63,31,44,0.08)]">
                {category.icon}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-serif text-xl font-semibold text-[#332631]">
                  {getLocalizedText(category.title, language)}
                </h3>
                <p className="text-sm text-[#6b5a66]">{getLocalizedText(category.description, language)}</p>
                <p className="mt-2 text-xs tracking-wide text-[#7c4258]">
                  {categoryServices.length}{' '}
                  {language === 'DE' ? 'Leistungen' : language === 'GB' ? 'services' : 'послуг'}
                </p>
              </div>
              <span className="text-xs tracking-widest text-[#8f5267] opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </GlassCard>
          )
        })}
      </div>
    </PageShell>
  )
}
