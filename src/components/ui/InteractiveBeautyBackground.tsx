'use client'

import { useEffect, useState } from 'react'
import { motion, useSpring, useTransform } from 'framer-motion'

type BackgroundVariant = 'light' | 'dark'

interface BeautyBackgroundProps {
  variant?: BackgroundVariant
}

const AURAS = [
  { left: '8%', top: '12%', size: 300, delay: 0 },
  { left: '72%', top: '16%', size: 260, delay: -4 },
  { left: '62%', top: '68%', size: 360, delay: -8 },
  { left: '18%', top: '74%', size: 240, delay: -2 },
]

const RIBBONS = [
  { left: '12%', top: '18%', width: 420, height: 120, rotate: -20, delay: 0 },
  { left: '56%', top: '20%', width: 360, height: 110, rotate: 18, delay: -6 },
  { left: '60%', top: '62%', width: 480, height: 130, rotate: -14, delay: -10 },
  { left: '18%', top: '68%', width: 340, height: 100, rotate: 22, delay: -3 },
]

const VEILS = [
  { left: '-10%', top: '12%', width: 620, height: 180, rotate: -12, delay: 0 },
  { left: '48%', top: '8%', width: 520, height: 160, rotate: 14, delay: -5 },
  { left: '44%', top: '64%', width: 680, height: 200, rotate: -10, delay: -8 },
]

const MISTS = [
  { left: '-8%', top: '6%', width: 520, height: 280, rotate: -16, delay: 0 },
  { left: '54%', top: '4%', width: 460, height: 240, rotate: 14, delay: -6 },
  { left: '8%', top: '58%', width: 560, height: 300, rotate: 12, delay: -3 },
  { left: '58%', top: '60%', width: 520, height: 280, rotate: -10, delay: -8 },
]

const FILAMENTS = [
  { left: '-4%', top: '22%', width: '52vw', rotate: -8, delay: 0 },
  { left: '36%', top: '18%', width: '44vw', rotate: 11, delay: -4 },
  { left: '18%', top: '72%', width: '48vw', rotate: -12, delay: -9 },
]

const DUST_PARTICLES = [
  { left: '12%', top: '22%', size: 3, delay: 0, blur: 0.4 },
  { left: '18%', top: '56%', size: 4, delay: -4, blur: 0.6 },
  { left: '24%', top: '34%', size: 2, delay: -8, blur: 0.2 },
  { left: '36%', top: '18%', size: 3, delay: -3, blur: 0.4 },
  { left: '44%', top: '66%', size: 4, delay: -7, blur: 0.5 },
  { left: '54%', top: '24%', size: 2, delay: -2, blur: 0.2 },
  { left: '62%', top: '48%', size: 3, delay: -6, blur: 0.3 },
  { left: '72%', top: '20%', size: 4, delay: -1, blur: 0.5 },
  { left: '78%', top: '58%', size: 3, delay: -5, blur: 0.4 },
  { left: '84%', top: '34%', size: 2, delay: -9, blur: 0.2 },
  { left: '86%', top: '76%', size: 4, delay: -10, blur: 0.5 },
  { left: '28%', top: '78%', size: 3, delay: -11, blur: 0.4 },
]

function getPalette(variant: BackgroundVariant) {
  if (variant === 'dark') {
    return {
      base: 'linear-gradient(180deg, #100d0a 0%, #070707 48%, #030303 100%)',
      ambient:
        'radial-gradient(circle at 50% 0%, rgba(223,188,115,0.18) 0%, rgba(5,5,5,0) 38%), radial-gradient(circle at 10% 58%, rgba(255,255,255,0.05) 0%, rgba(5,5,5,0) 30%), radial-gradient(circle at 92% 28%, rgba(210,173,94,0.12) 0%, rgba(5,5,5,0) 34%)',
      glow: ['rgba(210,173,94,0.18)', 'rgba(255,255,255,0.08)', 'rgba(123,102,77,0.12)'],
      ribbon: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, rgba(210,173,94,0.14) 45%, rgba(255,255,255,0.03) 100%)',
      overlay:
        'radial-gradient(circle at 50% 45%, rgba(12,12,12,0.02) 0%, rgba(5,5,5,0.28) 55%, rgba(5,5,5,0.82) 100%)',
      dust: 'rgba(236,206,141,0.3)',
      edgeShade:
        'radial-gradient(circle at center, rgba(4,4,4,0) 46%, rgba(4,4,4,0.18) 74%, rgba(4,4,4,0.48) 100%)',
      grain:
        'radial-gradient(circle at 20% 20%, rgba(255,255,255,0.13) 0.55px, transparent 0.9px), radial-gradient(circle at 76% 34%, rgba(236,206,141,0.09) 0.5px, transparent 0.85px), radial-gradient(circle at 60% 78%, rgba(255,255,255,0.08) 0.45px, transparent 0.82px)',
      veil: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 18%, rgba(210,173,94,0.12) 48%, rgba(255,255,255,0.03) 76%, rgba(255,255,255,0) 100%)',
      halo: 'conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0) 0deg, rgba(220,188,112,0.18) 94deg, rgba(255,255,255,0.04) 160deg, rgba(255,255,255,0) 320deg)',
      mist: 'radial-gradient(circle at 35% 40%, rgba(255,255,255,0.18) 0%, rgba(220,188,112,0.16) 34%, rgba(8,8,8,0) 74%)',
      filament: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.05) 18%, rgba(220,188,112,0.20) 48%, rgba(255,255,255,0.08) 76%, rgba(255,255,255,0) 100%)',
      coreGlow: 'radial-gradient(circle, rgba(220,188,112,0.22) 0%, rgba(220,188,112,0) 72%)',
    }
  }

  return {
    base: 'linear-gradient(180deg, #fffdfb 0%, #fbf7f0 46%, #efe4d3 100%)',
    ambient:
      'radial-gradient(circle at 50% 12%, rgba(255,255,255,0.92) 0%, rgba(255,250,244,0.56) 24%, rgba(253,250,245,0) 48%), radial-gradient(circle at 18% 34%, rgba(241,222,193,0.34) 0%, rgba(253,250,245,0) 34%), radial-gradient(circle at 82% 28%, rgba(228,204,166,0.26) 0%, rgba(253,250,245,0) 36%), radial-gradient(circle at 50% 72%, rgba(214,184,146,0.18) 0%, rgba(253,250,245,0) 32%)',
    glow: ['rgba(239,220,189,0.32)', 'rgba(255,255,255,0.38)', 'rgba(215,188,150,0.22)'],
    ribbon: 'linear-gradient(135deg, rgba(255,255,255,0.42) 0%, rgba(236,219,192,0.36) 46%, rgba(255,255,255,0.08) 100%)',
    overlay:
      'radial-gradient(circle at 50% 44%, rgba(255,255,255,0) 0%, rgba(253,249,242,0.08) 54%, rgba(236,223,205,0.34) 100%)',
    dust: 'rgba(141,111,77,0.24)',
    edgeShade:
      'radial-gradient(circle at center, rgba(255,255,255,0) 48%, rgba(204,178,146,0.08) 76%, rgba(108,83,60,0.16) 100%)',
    grain:
      'radial-gradient(circle at 22% 18%, rgba(122,92,68,0.09) 0.55px, transparent 0.92px), radial-gradient(circle at 76% 34%, rgba(255,255,255,0.24) 0.48px, transparent 0.86px), radial-gradient(circle at 58% 80%, rgba(201,168,76,0.06) 0.5px, transparent 0.88px)',
    veil: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.34) 18%, rgba(231,213,186,0.22) 48%, rgba(255,255,255,0.16) 76%, rgba(255,255,255,0) 100%)',
    halo: 'conic-gradient(from 180deg at 50% 50%, rgba(255,255,255,0) 0deg, rgba(199,166,124,0.12) 110deg, rgba(255,255,255,0.14) 180deg, rgba(255,255,255,0) 320deg)',
    mist: 'radial-gradient(circle at 35% 40%, rgba(255,255,255,0.66) 0%, rgba(236,219,194,0.3) 34%, rgba(253,250,245,0) 74%)',
    filament: 'linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.48) 18%, rgba(232,213,181,0.26) 48%, rgba(255,255,255,0.26) 76%, rgba(255,255,255,0) 100%)',
    coreGlow: 'radial-gradient(circle, rgba(241,226,205,0.62) 0%, rgba(225,198,158,0.2) 36%, rgba(225,198,158,0) 76%)',
  }
}

export default function InteractiveBeautyBackground({
  variant = 'light',
}: BeautyBackgroundProps) {
  const [mounted, setMounted] = useState(false)
  const pointerRange =
    variant === 'dark'
      ? {
          aura: ['2%', '-2%'],
          ribbon: ['4%', '-4%'],
          particle: ['6%', '-6%'],
          veil: ['8%', '-8%'],
          vertical: ['5%', '-5%'],
        }
      : {
          aura: ['1.2%', '-1.2%'],
          ribbon: ['2%', '-2%'],
          particle: ['3%', '-3%'],
          veil: ['4%', '-4%'],
          vertical: ['3%', '-3%'],
        }
  const pointerX = useSpring(0, { stiffness: 16, damping: 34 })
  const pointerY = useSpring(0, { stiffness: 16, damping: 34 })

  const auraX = useTransform(pointerX, [-1, 1], pointerRange.aura)
  const auraY = useTransform(pointerY, [-1, 1], pointerRange.aura)
  const ribbonX = useTransform(pointerX, [-1, 1], pointerRange.ribbon)
  const ribbonY = useTransform(pointerY, [-1, 1], pointerRange.ribbon)
  const particleX = useTransform(pointerX, [-1, 1], pointerRange.particle)
  const particleY = useTransform(pointerY, [-1, 1], pointerRange.particle)
  const veilX = useTransform(pointerX, [-1, 1], pointerRange.veil)
  const veilY = useTransform(pointerY, [-1, 1], pointerRange.vertical)

  const palette = getPalette(variant)

  useEffect(() => {
    setMounted(true)

    const handlePointerMove = (event: PointerEvent) => {
      pointerX.set((event.clientX / window.innerWidth) * 2 - 1)
      pointerY.set((event.clientY / window.innerHeight) * 2 - 1)
    }

    const handleTouchMove = (event: TouchEvent) => {
      const touch = event.touches[0]

      if (!touch) {
        return
      }

      pointerX.set((touch.clientX / window.innerWidth) * 2 - 1)
      pointerY.set((touch.clientY / window.innerHeight) * 2 - 1)
    }

    window.addEventListener('pointermove', handlePointerMove, { passive: true })
    window.addEventListener('touchmove', handleTouchMove, { passive: true })

    return () => {
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('touchmove', handleTouchMove)
    }
  }, [pointerX, pointerY])

  return (
    <div
      className="fixed inset-0 z-0 overflow-hidden pointer-events-none"
      style={{ background: palette.base }}
      aria-hidden="true"
    >
      <div
        className="absolute inset-[-12%]"
        style={{
          background: palette.ambient,
          filter: variant === 'dark' ? 'blur(24px)' : 'blur(18px)',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background:
            variant === 'dark'
              ? 'radial-gradient(circle at 50% 16%, rgba(255,255,255,0.04) 0%, rgba(5,5,5,0) 36%), radial-gradient(circle at 50% 42%, rgba(210,173,94,0.10) 0%, rgba(5,5,5,0) 42%)'
              : 'radial-gradient(circle at 50% 14%, rgba(255,255,255,0.8) 0%, rgba(253,250,245,0) 36%), radial-gradient(circle at 50% 40%, rgba(232,213,163,0.26) 0%, rgba(253,250,245,0) 42%)',
        }}
      />

      <motion.div
        className="absolute left-1/2 top-[22%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full"
        style={{
          background: palette.coreGlow,
          filter: variant === 'dark' ? 'blur(50px)' : 'blur(52px)',
        }}
        animate={{
          opacity: variant === 'dark' ? [0.24, 0.38, 0.28] : [0.54, 0.68, 0.58],
          scale: [0.97, 1.04, 0.99],
        }}
        transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }}
      />

      <motion.div className="absolute inset-0" style={{ x: ribbonX, y: auraY }}>
        {MISTS.map((mist, index) => (
          <motion.div
            key={`${variant}-mist-${index}`}
            className="absolute rounded-full"
            style={{
              left: mist.left,
              top: mist.top,
              width: mist.width,
              height: mist.height,
              background: palette.mist,
              rotate: `${mist.rotate}deg`,
              filter: variant === 'dark' ? 'blur(34px)' : 'blur(26px)',
              opacity: variant === 'dark' ? 0.34 : 0.42,
            }}
            animate={{
              x: [0, 18, -10, 0],
              y: [0, -14, 10, 0],
              opacity: variant === 'dark' ? [0.22, 0.4, 0.26, 0.22] : [0.3, 0.48, 0.34, 0.3],
              scale: [1, 1.04, 0.98, 1],
            }}
            transition={{
              duration: 28,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: mist.delay,
            }}
          />
        ))}
      </motion.div>

      <motion.div className="absolute inset-0" style={{ x: auraX, y: auraY }}>
        {AURAS.map((aura, index) => (
          <motion.div
            key={`${variant}-aura-${index}`}
            className="absolute rounded-full"
            style={{
              left: aura.left,
              top: aura.top,
              width: aura.size,
              height: aura.size,
              background: palette.glow[index % palette.glow.length],
              filter: 'blur(70px)',
            }}
            animate={{
              scale: [1, 1.08, 0.98, 1],
              opacity: variant === 'dark' ? [0.35, 0.52, 0.28, 0.35] : [0.5, 0.72, 0.38, 0.5],
              y: [0, -12, 8, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: aura.delay,
            }}
          />
        ))}
      </motion.div>

      <motion.div className="absolute inset-0" style={{ x: veilX, y: ribbonY }}>
        {FILAMENTS.map((filament, index) => (
          <motion.div
            key={`${variant}-filament-${index}`}
            className="absolute rounded-full"
            style={{
              left: filament.left,
              top: filament.top,
              width: filament.width,
              height: 2,
              background: palette.filament,
              rotate: `${filament.rotate}deg`,
              filter: 'blur(0.4px)',
              opacity: variant === 'dark' ? 0.5 : 0.66,
            }}
            animate={{
              opacity: variant === 'dark' ? [0.14, 0.42, 0.16, 0.14] : [0.22, 0.6, 0.28, 0.22],
              scaleX: [0.94, 1.04, 0.96, 0.94],
              x: [0, 10, -6, 0],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: filament.delay,
            }}
          />
        ))}
      </motion.div>

      <motion.div className="absolute inset-0" style={{ x: ribbonX, y: ribbonY }}>
        {RIBBONS.map((ribbon, index) => (
          <motion.div
            key={`${variant}-ribbon-${index}`}
            className="absolute rounded-full"
            style={{
              left: ribbon.left,
              top: ribbon.top,
              width: ribbon.width,
              height: ribbon.height,
              background: palette.ribbon,
              opacity: variant === 'dark' ? 0.32 : 0.4,
              rotate: `${ribbon.rotate}deg`,
              filter: 'blur(26px)',
              border:
                variant === 'dark'
                  ? '1px solid rgba(255,255,255,0.06)'
                  : '1px solid rgba(255,255,255,0.28)',
            }}
            animate={{
              x: [0, 12, -6, 0],
              y: [0, -10, 6, 0],
              opacity:
                variant === 'dark' ? [0.26, 0.36, 0.24, 0.26] : [0.34, 0.46, 0.3, 0.34],
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: ribbon.delay,
            }}
          />
        ))}
      </motion.div>

      <motion.div className="absolute inset-0" style={{ x: veilX, y: veilY }}>
        {VEILS.map((veil, index) => (
          <motion.div
            key={`${variant}-veil-${index}`}
            className="absolute rounded-full"
            style={{
              left: veil.left,
              top: veil.top,
              width: veil.width,
              height: veil.height,
              background: palette.veil,
              rotate: `${veil.rotate}deg`,
              opacity: variant === 'dark' ? 0.26 : 0.34,
              filter: 'blur(38px)',
            }}
            animate={{
              x: [0, 16, -8, 0],
              y: [0, -12, 10, 0],
              opacity: variant === 'dark' ? [0.18, 0.3, 0.2, 0.18] : [0.22, 0.4, 0.26, 0.22],
            }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: veil.delay,
            }}
          />
        ))}
      </motion.div>

      <motion.div
        className="absolute left-1/2 top-1/2 h-[62vw] w-[62vw] max-h-[760px] max-w-[760px] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background: palette.halo,
          filter: variant === 'dark' ? 'blur(36px)' : 'blur(28px)',
          opacity: variant === 'dark' ? 0.18 : 0.24,
          maskImage: 'radial-gradient(circle at center, transparent 34%, black 54%, transparent 72%)',
        }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 52, repeat: Infinity, ease: 'linear' }}
      />

      {mounted && (
        <motion.div className="absolute inset-0" style={{ x: particleX, y: particleY }}>
          {DUST_PARTICLES.map((particle, index) => (
            <motion.div
              key={`${variant}-dust-${index}`}
              className="absolute rounded-full"
              style={{
                left: particle.left,
                top: particle.top,
                width: particle.size,
                height: particle.size,
                background: palette.dust,
                filter: `blur(${particle.blur}px)`,
              }}
              animate={{
                opacity: variant === 'dark' ? [0.08, 0.24, 0.1, 0.08] : [0.06, 0.18, 0.08, 0.06],
                y: [0, -10, 3, 0],
                x: [0, 3, -2, 0],
                scale: [1, 1.12, 0.96, 1],
              }}
              transition={{
                duration: 12,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: particle.delay,
              }}
            />
          ))}
        </motion.div>
      )}

      <div
        className="absolute inset-0"
        style={{
          backgroundImage: palette.grain,
          backgroundSize: '7px 7px, 11px 11px, 13px 13px',
          opacity: variant === 'dark' ? 0.22 : 0.18,
          mixBlendMode: variant === 'dark' ? 'screen' : 'multiply',
        }}
      />

      <div
        className="absolute inset-0"
        style={{
          background: palette.edgeShade,
          mixBlendMode: 'multiply',
        }}
      />

      <div className="absolute inset-0" style={{ background: palette.overlay }} />
    </div>
  )
}
