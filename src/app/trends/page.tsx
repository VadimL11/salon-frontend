'use client'

import { motion } from 'framer-motion'
import PageShell from '@/components/ui/PageShell'
import { useAppStore } from '@/store/useAppStore'
import { DICT } from '@/dictionaries'
import { getLocalizedText } from '@/data/salon'

export default function TrendsPage() {
  const language = useAppStore((state) => state.language)
  const trends = useAppStore((state) => state.trends)
  const t = DICT[language].trends

  return (
    <PageShell title={t.title} showBack>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {trends.map((trend, index) => (
          <motion.div
            key={trend.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.1, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ scale: 1.04, y: -4 }}
            className="group relative cursor-pointer overflow-hidden rounded-3xl"
            style={{
              aspectRatio: index === 2 ? '16/9' : '4/5',
              background: trend.image ? undefined : trend.gradient,
              backgroundImage: trend.image
                ? `linear-gradient(180deg, rgba(38,24,32,0.08) 0%, rgba(38,24,32,0.55) 100%), url(${trend.image})`
                : undefined,
              backgroundSize: trend.image ? 'cover' : undefined,
              backgroundPosition: trend.image ? 'center' : undefined,
              boxShadow: '0 18px 44px rgba(63,31,44,0.12)',
              border: '1px solid rgba(107,35,57,0.18)',
            }}
          >
            <div
              className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-30"
              style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.46) 0%, transparent 60%)' }}
            />
            <div className="absolute right-6 top-6 text-4xl opacity-25">{trend.emoji}</div>
            <div className="absolute bottom-0 left-0 right-0 h-28 rounded-b-3xl bg-gradient-to-t from-[rgba(45,30,39,0.76)] to-transparent" />
            <div className="absolute bottom-5 left-5 right-5">
              <h3 className="mb-1 font-serif text-lg font-semibold text-white drop-shadow">
                {getLocalizedText(trend.title, language)}
              </h3>
              <p className="text-xs leading-relaxed text-[rgba(255,255,255,0.82)]">
                {getLocalizedText(trend.description, language)}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </PageShell>
  )
}
