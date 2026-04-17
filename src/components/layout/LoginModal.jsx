import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate } from 'react-router-dom'

export default function LoginModal({ open, onClose }) {
  const navigate = useNavigate()

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
        >
          <motion.div
            initial={{ y: 12, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.96, opacity: 0 }}
            className="glass w-full max-w-md rounded-[2rem] p-7 shadow-2xl"
          >
            <p className="text-xs uppercase tracking-[0.3em] text-white/40">GoodbyePills</p>
            <h2 className="mt-3 text-3xl font-semibold text-white">Welcome back</h2>
            <p className="mt-2 text-white/65">Login to continue your reset journey.</p>

            <div className="mt-8 space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30"
              />
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white outline-none placeholder:text-white/30"
              />

              <button
                onClick={() => navigate('/dashboard')}
                className="w-full rounded-2xl bg-white px-4 py-3 font-medium text-black transition hover:bg-white/90"
              >
                Login
              </button>
            </div>

            <div className="mt-5 flex items-center justify-between text-sm">
              <button onClick={onClose} className="text-white/55 underline underline-offset-4">
                Continue without login
              </button>
              <button onClick={() => navigate('/signup')} className="text-white underline underline-offset-4">
                Create account
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
