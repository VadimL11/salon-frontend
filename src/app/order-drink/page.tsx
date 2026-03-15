'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageShell from '@/components/ui/PageShell'
import GlassCard from '@/components/ui/GlassCard'
import GoldButton from '@/components/ui/GoldButton'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'
import { getLocalizedText } from '@/data/salon'

export default function OrderDrinkPage() {
  const language = useAppStore((state) => state.language)
  const drinks = useAppStore((state) => state.drinks)
  const t = DICT[language].orderDrink

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [ordered, setOrdered] = useState(false)

  const selectedDrink = drinks.find((item) => item.id === selectedId) ?? null

  return (
    <PageShell title={t.title} showBack>
      <AnimatePresence mode="wait">
        {ordered ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.93 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-6 py-14 text-center"
          >
            <div className="text-6xl">◈</div>
            <h2 className="font-serif text-3xl font-semibold text-[#3d2a1a]">{t.ordered}</h2>
            {selectedDrink && (
              <p className="text-[#7a5c44]">
                {getLocalizedText(selectedDrink.title, language)} {t.comingSoon}
              </p>
            )}
            <GoldButton
              onClick={() => {
                setOrdered(false)
                setSelectedId(null)
              }}
            >
              {t.orderAgain}
            </GoldButton>
          </motion.div>
        ) : (
          <motion.div
            key="order"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-8"
          >
            <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {drinks.map((drink, index) => (
                <GlassCard
                  key={drink.id}
                  delay={0.05 + index * 0.07}
                  onClick={() => setSelectedId(drink.id === selectedId ? null : drink.id)}
                  className={`flex flex-col items-center gap-3 px-4 py-7 transition-all duration-200 ${
                    selectedId === drink.id
                      ? 'border-[rgba(201,168,76,0.75)] bg-[rgba(232,213,163,0.32)] shadow-[0_0_28px_rgba(201,168,76,0.28)]'
                      : ''
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(201,168,76,0.22)] bg-gradient-to-br from-[rgba(232,213,163,0.4)] to-[rgba(201,168,76,0.18)] text-3xl">
                    {drink.icon}
                  </div>
                  <p className="text-center text-xs font-medium leading-tight text-[#5c4030]">
                    {getLocalizedText(drink.title, language)}
                  </p>
                  {selectedId === drink.id && (
                    <motion.div
                      layoutId="drink-check"
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-br from-[#e8d5a3] to-[#c9a84c] text-[10px] text-white"
                    >
                      ✓
                    </motion.div>
                  )}
                </GlassCard>
              ))}
            </div>

            <GoldButton onClick={() => selectedId && setOrdered(true)} disabled={!selectedId} className="px-14 py-4 text-base">
              {t.order}
            </GoldButton>
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}
