'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageShell from '@/components/ui/PageShell'
import GlassCard from '@/components/ui/GlassCard'
import GoldButton from '@/components/ui/GoldButton'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'
import { getLocalizedText } from '@/data/salon'

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message.replace(/^API Error:\s*\d+\s*/, '').trim()
  }

  return 'Drink order failed. Try again.'
}

export default function OrderDrinkPage() {
  const language = useAppStore((state) => state.language)
  const drinks = useAppStore((state) => state.drinks)
  const placeDrinkOrder = useAppStore((state) => state.placeDrinkOrder)
  const t = DICT[language].orderDrink

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [ordered, setOrdered] = useState(false)
  const [isOrdering, setIsOrdering] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const selectedDrink = drinks.find((item) => item.id === selectedId) ?? null

  const handleOrder = async () => {
    if (!selectedId) {
      return
    }

    setError(null)
    setIsOrdering(true)

    try {
      await placeDrinkOrder(selectedId)
      setOrdered(true)
    } catch (err) {
      console.error('Drink order failed:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsOrdering(false)
    }
  }

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
            <h2 className="font-serif text-3xl font-semibold text-[#332631]">{t.ordered}</h2>
            {selectedDrink && (
              <p className="text-[#6b5a66]">
                {getLocalizedText(selectedDrink.title, language)} {t.comingSoon}
              </p>
            )}
            <GoldButton
              onClick={() => {
                setOrdered(false)
                setSelectedId(null)
                setError(null)
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
                  onClick={() => {
                    setSelectedId(drink.id === selectedId ? null : drink.id)
                    setError(null)
                  }}
                  className={`flex flex-col items-center gap-3 px-4 py-7 transition-all duration-200 ${
                    selectedId === drink.id
                      ? 'border-[rgba(107,35,57,0.32)] bg-[rgba(107,35,57,0.08)] shadow-[0_0_28px_rgba(65,31,46,0.18)]'
                      : ''
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(107,35,57,0.14)] bg-[linear-gradient(145deg,rgba(255,255,255,0.96)_0%,rgba(245,237,239,0.94)_58%,rgba(224,214,221,0.84)_100%)] text-3xl">
                    {drink.icon}
                  </div>
                  <p className="text-center text-xs font-medium leading-tight text-[#5e4754]">
                    {getLocalizedText(drink.title, language)}
                  </p>
                  {selectedId === drink.id && (
                    <motion.div
                      layoutId="drink-check"
                      className="flex h-5 w-5 items-center justify-center rounded-full bg-[linear-gradient(135deg,#8f5267_0%,#6b2339_55%,#1d2942_100%)] text-[10px] text-white"
                    >
                      ✓
                    </motion.div>
                  )}
                </GlassCard>
              ))}
            </div>

            <GoldButton onClick={handleOrder} disabled={!selectedId || isOrdering} className="px-14 py-4 text-base">
              {isOrdering ? '...' : t.order}
            </GoldButton>
            {error && (
              <div className="w-full max-w-xl rounded-2xl border border-[rgba(122,64,85,0.18)] bg-[rgba(255,241,245,0.76)] px-4 py-3 text-center text-sm text-[#7a4055] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                {error}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </PageShell>
  )
}
