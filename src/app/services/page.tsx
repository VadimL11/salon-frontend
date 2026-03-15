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
      <p className="mb-6 -mt-4 text-center text-sm text-[#7a5c44]">{t.chooseCategory}</p>
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
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl border border-[rgba(201,168,76,0.22)] bg-gradient-to-br from-[rgba(232,213,163,0.35)] to-[rgba(201,168,76,0.15)] text-3xl">
                {category.icon}
              </div>
              <div className="flex-1">
                <h3 className="mb-1 font-serif text-xl font-semibold text-[#3d2a1a]">
                  {getLocalizedText(category.title, language)}
                </h3>
                <p className="text-sm text-[#7a5c44]">{getLocalizedText(category.description, language)}</p>
                <p className="mt-2 text-xs tracking-wide text-[#a07830]">
                  {categoryServices.length}{' '}
                  {language === 'DE' ? 'Leistungen' : language === 'GB' ? 'services' : 'послуг'}
                </p>
              </div>
              <span className="text-xs tracking-widest text-[#c9a84c] opacity-0 transition-opacity group-hover:opacity-100">
                →
              </span>
            </GlassCard>
          )
        })}
      </div>
    </PageShell>
  )
}
