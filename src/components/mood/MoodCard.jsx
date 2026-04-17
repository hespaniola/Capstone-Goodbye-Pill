import { motion } from 'framer-motion'

export default function MoodCard({ mood, active, onClick }) {
  const Icon = mood.icon

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      onClick={onClick}
      className={`rounded-[1.5rem] border p-5 text-left transition ${
        active ? 'border-white/20 bg-white/12 ring-1 ring-white/10' : 'border-white/10 bg-black/20 hover:bg-white/8'
      } bg-gradient-to-br ${mood.accent} ${active ? mood.glow : ''}`}
    >
      <Icon className="mb-3 h-5 w-5 text-white/95" />
      <p className="text-lg font-semibold text-white">{mood.title}</p>
      <p className="mt-2 text-sm leading-6 text-white/70">{mood.desc}</p>
      {active && <p className="mt-3 text-xs uppercase tracking-[0.18em] text-white/55">Selected</p>}
    </motion.button>
  )
}
