'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { ReactNode } from 'react'

interface PageTransitionProps {
  children: ReactNode
  keyProp?: string
}

const variants = {
  hidden:  { opacity: 0, y: 14, scale: 0.99 },
  visible: { opacity: 1, y: 0,  scale: 1 },
  exit:    { opacity: 0, y: -8, scale: 0.99 },
}

export default function PageTransition({ children, keyProp }: PageTransitionProps) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={keyProp}
        variants={variants}
        initial="hidden"
        animate="visible"
        exit="exit"
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}
