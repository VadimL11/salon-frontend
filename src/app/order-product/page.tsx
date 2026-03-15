'use client'

import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import PageShell from '@/components/ui/PageShell'
import GlassCard from '@/components/ui/GlassCard'
import GoldButton from '@/components/ui/GoldButton'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'
import { getLocalizedText } from '@/data/salon'

export default function OrderProductPage() {
  const language = useAppStore((state) => state.language)
  const careProducts = useAppStore((state) => state.careProducts)
  const cart = useAppStore((state) => state.cart)
  const addToCart = useAppStore((state) => state.addToCart)
  const removeFromCart = useAppStore((state) => state.removeFromCart)
  const updateQuantity = useAppStore((state) => state.updateQuantity)
  const clearCart = useAppStore((state) => state.clearCart)
  const t = DICT[language].orderProduct

  const [ordered, setOrdered] = useState(false)
  const [addedId, setAddedId] = useState<string | null>(null)

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  const handleAddToCart = (id: string) => {
    const product = careProducts.find((entry) => entry.id === id)
    if (!product) {
      return
    }

    addToCart({
      id: product.id,
      name: getLocalizedText(product.title, language),
      price: product.price,
    })
    setAddedId(product.id)
    window.setTimeout(() => setAddedId(null), 1100)
  }

  if (ordered) {
    return (
      <PageShell showBack>
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center gap-6 py-16 text-center"
        >
          <div className="text-6xl">◈</div>
          <h2 className="font-serif text-3xl font-semibold text-[#3d2a1a]">{t.ordered}</h2>
          <GoldButton
            onClick={() => {
              clearCart()
              setOrdered(false)
            }}
          >
            {t.orderAgain}
          </GoldButton>
        </motion.div>
      </PageShell>
    )
  }

  return (
    <PageShell title={t.title} showBack>
      <div className="flex flex-col gap-8">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {careProducts.map((product, index) => (
            <GlassCard
              key={product.id}
              delay={0.05 + index * 0.06}
              className="relative flex flex-col items-center gap-3 px-5 py-7 text-center"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(201,168,76,0.22)] bg-gradient-to-br from-[rgba(232,213,163,0.35)] to-[rgba(201,168,76,0.15)] text-3xl">
                {product.icon}
              </div>
              <h3 className="font-serif text-base font-semibold leading-snug text-[#3d2a1a]">
                {getLocalizedText(product.title, language)}
              </h3>
              <p className="text-[11px] uppercase tracking-wide text-[#a07830]">{product.brand}</p>
              <p className="font-serif text-xl font-semibold text-[#3d2a1a]">€{product.price.toFixed(2)}</p>
              <motion.button
                onClick={() => handleAddToCart(product.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-1 rounded-full border border-[rgba(201,168,76,0.45)] bg-[rgba(232,213,163,0.12)] px-5 py-2 text-xs font-medium tracking-wide text-[#a07830] transition-colors duration-200 hover:bg-[rgba(232,213,163,0.28)] focus-visible:ring-2 focus-visible:ring-[#c9a84c]"
              >
                {addedId === product.id ? `✓ ${t.added}` : t.addToCart}
              </motion.button>
            </GlassCard>
          ))}
        </div>

        <AnimatePresence>
          {cart.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="glass-card rounded-3xl p-6"
            >
              <h3 className="mb-5 font-serif text-xl font-semibold text-[#3d2a1a]">{t.cart}</h3>
              <div className="flex flex-col gap-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[rgba(201,168,76,0.18)] bg-[rgba(253,250,245,0.6)] px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#3d2a1a]">{item.name}</p>
                      <p className="text-xs text-[#a07830]">€{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(201,168,76,0.40)] bg-[rgba(232,213,163,0.10)] text-sm font-medium text-[#a07830] transition-colors hover:bg-[rgba(232,213,163,0.25)]"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-[#3d2a1a]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(201,168,76,0.40)] bg-[rgba(232,213,163,0.10)] text-sm font-medium text-[#a07830] transition-colors hover:bg-[rgba(232,213,163,0.25)]"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-[#b0956a] transition-colors hover:text-[#8f6f47]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <p className="font-serif text-lg font-semibold text-[#3d2a1a]">
                  {t.total}: <span className="text-[#c9a84c]">€{total.toFixed(2)}</span>
                </p>
                <GoldButton onClick={() => setOrdered(true)}>{t.orderNow}</GoldButton>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {cart.length === 0 && <p className="py-4 text-center text-sm text-[#b0956a]">{t.emptyCart}</p>}
      </div>
    </PageShell>
  )
}
