import { motion } from 'framer-motion'

export default function FloatingOrb({ className = '' }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0], opacity: [0.55, 0.85, 0.55] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      className={`rounded-full blur-3xl ${className}`}
    />
  )
}
