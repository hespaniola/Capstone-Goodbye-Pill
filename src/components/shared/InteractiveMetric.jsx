import { motion } from 'framer-motion'

export default function InteractiveMetric({ label, value, icon: Icon, accent }) {
  return (
    <motion.div whileHover={{ y: -4, scale: 1.01 }} transition={{ duration: 0.18 }}>
      <div className={`rounded-[1.75rem] border border-white/10 bg-gradient-to-br ${accent} p-5 backdrop-blur-xl`}>
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-black/20">
          <Icon className="h-5 w-5 text-white" />
        </div>
        <p className="text-3xl font-semibold text-white">{value}</p>
        <p className="mt-1 text-sm text-white/70">{label}</p>
      </div>
    </motion.div>
  )
}
