import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function QuickActionCard({ title, text, icon: Icon, path }) {
  const navigate = useNavigate()

  return (
    <motion.button
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.18 }}
      onClick={() => navigate(path)}
      className="rounded-[1.5rem] border border-white/10 bg-black/20 p-5 text-left transition hover:bg-white/10"
    >
      <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/10">
        <Icon className="h-5 w-5 text-white" />
      </div>

      <p className="text-lg font-semibold text-white">{title}</p>
      <p className="mt-2 text-sm leading-6 text-white/65">{text}</p>
    </motion.button>
  )
}
