'use client'

import { useState } from 'react'
import { notFound, useRouter } from 'next/navigation'
import { AnimatePresence, motion } from 'framer-motion'
import PageShell from '@/components/ui/PageShell'
import GlassCard from '@/components/ui/GlassCard'
import GoldButton from '@/components/ui/GoldButton'
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
  const [expandedMasterId, setExpandedMasterId] = useState<string | null>(null)

  const servicesText = {
    showCredentials:
      language === 'UA'
        ? 'Показати всі документи'
        : language === 'DE'
          ? 'Alle Dokumente zeigen'
          : 'Show all documents',
    hideCredentials:
      language === 'UA'
        ? 'Сховати зайві документи'
        : language === 'DE'
          ? 'Dokumente reduzieren'
          : 'Show fewer documents',
    credentialsTitle:
      language === 'UA'
        ? 'Дипломи та сертифікати'
        : language === 'DE'
          ? 'Diplome und Zertifikate'
          : 'Diplomas & certificates',
    experienceTitle: language === 'UA' ? 'Досвід' : language === 'DE' ? 'Erfahrung' : 'Experience',
    credentialsEmpty:
      language === 'UA'
        ? 'Для цього майстра документи ще не додані.'
        : language === 'DE'
          ? 'Für diese Fachkraft wurden noch keine Dokumente hochgeladen.'
          : 'No documents uploaded for this specialist yet.',
    selectMaster: language === 'UA' ? 'Обрати майстра' : language === 'DE' ? 'Master wählen' : 'Select master',
    openDocument: language === 'UA' ? 'Відкрити' : language === 'DE' ? 'Öffnen' : 'Open',
  }

  const handleServiceSelect = (service: ServiceItem) => {
    setChosenService(service)
    setExpandedMasterId(null)
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
      maxWidth="max-w-5xl"
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
            <h2 className="mb-2 text-center font-serif text-3xl font-semibold text-[#332631]">
              {t.chooseService}
            </h2>
            <p className="mb-8 text-center text-sm text-[#6b5a66]">
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
                    <span className="font-serif text-lg font-semibold text-[#332631]">
                      {getLocalizedText(service.title, language)}
                    </span>
                    <p className="mt-1 text-xs text-[#7c4258]">
                      {service.durationMinutes} min • €{service.price}
                    </p>
                  </div>
                  <motion.span className="text-xs tracking-widest text-[#8f5267] opacity-40 transition-opacity group-hover:opacity-100">
                    {'->'}
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
            <h2 className="mb-2 text-center font-serif text-3xl font-semibold text-[#332631]">
              {t.chooseMaster}
            </h2>
            {chosenService && (
              <p className="mb-8 text-center text-sm text-[#6b5a66]">
                {category.icon} {getLocalizedText(chosenService.title, language)}
              </p>
            )}

            <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
              {categoryMasters.map((master, index) => {
                const credentialCount = master.credentials?.length ?? 0
                const visibleCredentials =
                  credentialCount === 0
                    ? []
                    : expandedMasterId === master.id
                      ? master.credentials!
                      : master.credentials!.slice(0, 2)

                return (
                  <GlassCard key={master.id} delay={0.05 + index * 0.07} className="p-6">
                    <div className="flex flex-col gap-5">
                      <div className="flex items-start gap-5">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8f5267_0%,#6b2339_55%,#1d2942_100%)] font-serif text-base font-semibold text-white shadow-[0_8px_18px_rgba(65,31,46,0.22)]">
                          {master.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="mb-0.5 font-serif text-lg font-semibold text-[#332631]">{master.name}</p>
                          <p className="text-xs text-[#6b5a66]">{getLocalizedText(master.role, language)}</p>
                        </div>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <div className="rounded-[20px] border border-[rgba(107,35,57,0.14)] bg-[rgba(255,255,255,0.52)] p-4">
                          <p className="text-[11px] uppercase tracking-[0.22em] text-[#7c4258]">
                            {servicesText.experienceTitle}
                          </p>
                          <p className="mt-2 font-serif text-xl font-semibold text-[#332631]">
                            {master.experienceLabel}
                          </p>
                          <p className="mt-1 text-xs text-[#6b5a66]">{t.experience}</p>
                        </div>
                        <div className="rounded-[20px] border border-[rgba(107,35,57,0.14)] bg-[rgba(255,255,255,0.52)] p-4">
                          <div className="flex items-center justify-between gap-3">
                            <p className="text-[11px] uppercase tracking-[0.22em] text-[#7c4258]">
                              {servicesText.credentialsTitle}
                            </p>
                            <span className="rounded-full border border-[rgba(107,35,57,0.14)] bg-[rgba(255,255,255,0.58)] px-3 py-1 text-[11px] uppercase tracking-[0.2em] text-[#7c4258]">
                              {String(credentialCount).padStart(2, '0')}
                            </span>
                          </div>
                          <p className="mt-2 text-sm text-[#6b5a66]">
                            {credentialCount ? servicesText.openDocument : servicesText.credentialsEmpty}
                          </p>
                        </div>
                      </div>

                      {credentialCount ? (
                        <div className="space-y-2">
                          {visibleCredentials.map((credential) => {
                            const typeLabel = credential.type.toLowerCase().includes('pdf') ? 'PDF' : 'IMAGE'

                            return (
                              <a
                                key={credential.id}
                                href={credential.fileUrl}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-between gap-3 rounded-[18px] border border-[rgba(107,35,57,0.12)] bg-[rgba(255,255,255,0.62)] px-4 py-3 text-sm text-[#332631] transition-colors hover:bg-[rgba(255,255,255,0.82)]"
                              >
                                <div className="min-w-0">
                                  <p className="truncate font-medium">{credential.name}</p>
                                  <p className="mt-1 text-[11px] uppercase tracking-[0.2em] text-[#7c4258]">
                                    {typeLabel}
                                  </p>
                                </div>
                                <span className="shrink-0 text-xs uppercase tracking-[0.2em] text-[#8f5267]">
                                  {servicesText.openDocument}
                                </span>
                              </a>
                            )
                          })}
                          {credentialCount > 2 && (
                            <button
                              type="button"
                              onClick={() =>
                                setExpandedMasterId((current) => (current === master.id ? null : master.id))
                              }
                              className="rounded-full border border-[rgba(107,35,57,0.22)] bg-[rgba(255,255,255,0.58)] px-4 py-2 text-xs font-medium uppercase tracking-[0.18em] text-[#6b2339] transition-colors hover:bg-[rgba(107,35,57,0.08)]"
                            >
                              {expandedMasterId === master.id
                                ? servicesText.hideCredentials
                                : servicesText.showCredentials}
                            </button>
                          )}
                        </div>
                      ) : (
                        <div className="rounded-[20px] border border-[rgba(107,35,57,0.12)] bg-[rgba(255,255,255,0.48)] px-4 py-3 text-sm text-[#6b5a66]">
                          {servicesText.credentialsEmpty}
                        </div>
                      )}

                      <GoldButton fullWidth onClick={() => handleMasterSelect(master)}>
                        {servicesText.selectMaster}
                      </GoldButton>
                    </div>
                  </GlassCard>
                )
              })}
            </div>

            <div className="mt-6 flex justify-center">
              <motion.button
                onClick={() => setStep('service')}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="rounded-full border border-[rgba(107,35,57,0.24)] bg-[rgba(255,255,255,0.42)] px-6 py-2.5 text-sm font-medium text-[#6b2339] transition-colors duration-200 hover:bg-[rgba(107,35,57,0.08)]"
              >
                {'<-'} {t.chooseService}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}
