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

  return 'Checkout failed. Try again.'
}

export default function OrderProductPage() {
  const language = useAppStore((state) => state.language)
  const careProducts = useAppStore((state) => state.careProducts)
  const cart = useAppStore((state) => state.cart)
  const addToCart = useAppStore((state) => state.addToCart)
  const removeFromCart = useAppStore((state) => state.removeFromCart)
  const updateQuantity = useAppStore((state) => state.updateQuantity)
  const clearCart = useAppStore((state) => state.clearCart)
  const checkoutCareProducts = useAppStore((state) => state.checkoutCareProducts)
  const t = DICT[language].orderProduct

  const [ordered, setOrdered] = useState(false)
  const [addedId, setAddedId] = useState<string | null>(null)
  const [isOrdering, setIsOrdering] = useState(false)
  const [error, setError] = useState<string | null>(null)

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
    setError(null)
    setAddedId(product.id)
    window.setTimeout(() => setAddedId(null), 1100)
  }

  const handleCheckout = async () => {
    setError(null)
    setIsOrdering(true)

    try {
      await checkoutCareProducts()
      setOrdered(true)
    } catch (err) {
      console.error('Care product checkout failed:', err)
      setError(getErrorMessage(err))
    } finally {
      setIsOrdering(false)
    }
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
          <h2 className="font-serif text-3xl font-semibold text-[#332631]">{t.ordered}</h2>
          <GoldButton
            onClick={() => {
              clearCart()
              setOrdered(false)
              setError(null)
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
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[rgba(107,35,57,0.14)] bg-[linear-gradient(145deg,rgba(255,255,255,0.96)_0%,rgba(245,237,239,0.94)_58%,rgba(224,214,221,0.84)_100%)] text-3xl">
                {product.icon}
              </div>
              <h3 className="font-serif text-base font-semibold leading-snug text-[#332631]">
                {getLocalizedText(product.title, language)}
              </h3>
              <p className="text-[11px] uppercase tracking-wide text-[#7c4258]">{product.brand}</p>
              <p className="font-serif text-xl font-semibold text-[#332631]">€{product.price.toFixed(2)}</p>
              <motion.button
                onClick={() => handleAddToCart(product.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-1 rounded-full border border-[rgba(107,35,57,0.24)] bg-[rgba(255,255,255,0.42)] px-5 py-2 text-xs font-medium tracking-wide text-[#6b2339] transition-colors duration-200 hover:bg-[rgba(107,35,57,0.08)] focus-visible:ring-2 focus-visible:ring-[#8f5267]"
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
              <h3 className="mb-5 font-serif text-xl font-semibold text-[#332631]">{t.cart}</h3>
              <div className="flex flex-col gap-3">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 rounded-2xl border border-[rgba(107,35,57,0.12)] bg-[rgba(255,255,255,0.56)] px-4 py-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[#332631]">{item.name}</p>
                      <p className="text-xs text-[#7c4258]">€{item.price.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(107,35,57,0.24)] bg-[rgba(255,255,255,0.42)] text-sm font-medium text-[#6b2339] transition-colors hover:bg-[rgba(107,35,57,0.08)]"
                      >
                        −
                      </button>
                      <span className="w-6 text-center text-sm font-semibold text-[#332631]">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-[rgba(107,35,57,0.24)] bg-[rgba(255,255,255,0.42)] text-sm font-medium text-[#6b2339] transition-colors hover:bg-[rgba(107,35,57,0.08)]"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-sm text-[#a38290] transition-colors hover:text-[#7a4055]"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <p className="font-serif text-lg font-semibold text-[#332631]">
                  {t.total}: <span className="text-[#6b2339]">€{total.toFixed(2)}</span>
                </p>
                <GoldButton onClick={handleCheckout} disabled={isOrdering}>
                  {isOrdering ? '...' : t.orderNow}
                </GoldButton>
              </div>
              {error && (
                <div className="mt-4 rounded-2xl border border-[rgba(122,64,85,0.18)] bg-[rgba(255,241,245,0.76)] px-4 py-3 text-sm text-[#7a4055] shadow-[inset_0_1px_0_rgba(255,255,255,0.7)]">
                  {error}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {cart.length === 0 && <p className="py-4 text-center text-sm text-[#a38290]">{t.emptyCart}</p>}
      </div>
    </PageShell>
  )
}
