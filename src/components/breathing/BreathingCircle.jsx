import { useState } from 'react'
import { motion } from 'framer-motion'

export default function BreathingCircle() {
  const [phase, setPhase] = useState('Inhale')

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <motion.div
        animate={{ scale: [1, 1.18, 1.06, 1], opacity: [0.65, 1, 0.78, 0.65] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        onUpdate={(latest) => {
          const scale = latest.scale
          if (typeof scale === 'number') {
            if (scale > 1.14) setPhase('Hold')
            else if (scale > 1.03) setPhase('Inhale')
            else setPhase('Exhale')
          }
        }}
        className="relative flex h-56 w-56 items-center justify-center rounded-full bg-gradient-to-br from-cyan-300/30 via-sky-300/20 to-violet-400/30 shadow-[0_0_120px_rgba(120,200,255,0.22)]"
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute inset-3 rounded-full border border-white/10"
        />
        <div className="flex h-36 w-36 flex-col items-center justify-center rounded-full border border-white/15 bg-white/10 text-center backdrop-blur-xl">
          <p className="text-xs uppercase tracking-[0.22em] text-white/50">Breathing</p>
          <p className="mt-2 text-2xl font-semibold text-white">{phase}</p>
        </div>
      </motion.div>
      <p className="mt-5 text-sm uppercase tracking-[0.25em] text-white/50">Breathe with the circle</p>
    </div>
  )
}
