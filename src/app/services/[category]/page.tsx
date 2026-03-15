'use client'

import { useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import PageShell from '@/components/ui/PageShell'
import GlassCard from '@/components/ui/GlassCard'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'
import { getLocalizedText, type Master, type ServiceItem } from '@/data/salon'

export default function CategoryPage({ params }: { params: { category: string } }) {
  const router = useRouter()
  const {
    language,
    serviceCategories,
    services,
    masters,
    setService,
    setMaster,
    selectedCategoryName,
  } = useAppStore()
  const t = DICT[language].services

  const category = serviceCategories.find((entry) => entry.slug === params.category)
  if (!category) {
    return notFound()
  }

  const categoryServices = services.filter((entry) => entry.categoryId === category.id)
  const categoryMasters = masters.filter(
    (entry) => entry.specialtyCategoryIds.length === 0 || entry.specialtyCategoryIds.includes(category.id)
  )

  const [step, setStep] = useState<'service' | 'master'>('service')
  const [chosenService, setChosenService] = useState<ServiceItem | null>(null)

  const handleServiceSelect = (service: ServiceItem) => {
    setChosenService(service)
    setService(service.id, getLocalizedText(service.title, language))
    setStep('master')
  }

  const handleMasterSelect = (master: Master) => {
    setMaster(master.id, master.name)
    router.push('/booking')
  }

  return (
    <PageShell
      showBack
      contextPill={selectedCategoryName ?? getLocalizedText(category.title, language)}
      maxWidth="max-w-4xl"
    >
      <AnimatePresence mode="wait">
        {step === 'service' && (
          <motion.div
            key="service"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="mb-2 text-center font-serif text-3xl font-semibold text-[#3d2a1a]">
              {t.chooseService}
            </h2>
            <p className="mb-8 text-center text-sm text-[#7a5c44]">
              {category.icon} {getLocalizedText(category.title, language)}
            </p>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {categoryServices.map((service, index) => (
                <GlassCard
                  key={service.id}
                  delay={0.05 + index * 0.06}
                  onClick={() => handleServiceSelect(service)}
                  className="group flex items-center justify-between px-6 py-5"
                >
                  <div>
                    <span className="font-serif text-lg font-semibold text-[#3d2a1a]">
                      {getLocalizedText(service.title, language)}
                    </span>
                    <p className="mt-1 text-xs text-[#a07830]">
                      {service.durationMinutes} min • €{service.price}
                    </p>
                  </div>
                  <motion.span className="text-xs tracking-widest text-[#c9a84c] opacity-40 transition-opacity group-hover:opacity-100">
                    →
                  </motion.span>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        )}

        {step === 'master' && (
          <motion.div
            key="master"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          >
            <h2 className="mb-2 text-center font-serif text-3xl font-semibold text-[#3d2a1a]">
              {t.chooseMaster}
            </h2>
            {chosenService && (
              <p className="mb-8 text-center text-sm text-[#7a5c44]">
                {category.icon} {getLocalizedText(chosenService.title, language)}
              </p>
            )}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {categoryMasters.map((master, index) => (
                <GlassCard
                  key={master.id}
                  delay={0.05 + index * 0.07}
                  onClick={() => handleMasterSelect(master)}
                  className="group flex items-center gap-5 p-6"
                >
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#e8d5a3] to-[#c9a84c] font-serif text-base font-semibold text-white shadow-[0_4px_14px_rgba(201,168,76,0.35)]">
                    {master.initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="mb-0.5 font-serif text-lg font-semibold text-[#3d2a1a]">{master.name}</p>
                    <p className="text-xs text-[#7a5c44]">{getLocalizedText(master.role, language)}</p>
                    <p className="mt-0.5 text-[11px] text-[#a07830]">
                      {master.experienceLabel} {t.experience}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs tracking-widest text-[#c9a84c] opacity-0 transition-opacity group-hover:opacity-100">
                    →
                  </span>
                </GlassCard>
              ))}
            </div>

            <div className="mt-6 flex justify-center">
              <motion.button
                onClick={() => setStep('service')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-[rgba(201,168,76,0.40)] bg-[rgba(232,213,163,0.10)] px-6 py-2.5 text-sm font-medium text-[#a07830] transition-colors duration-200 hover:bg-[rgba(232,213,163,0.22)]"
              >
                ← {t.chooseService}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}
