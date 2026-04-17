import { useEffect, useState } from 'react'
import { Gift } from 'lucide-react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import AppSidebar from '../components/layout/AppSidebar'
import AppHeader from '../components/layout/AppHeader'
import PageShell from '../components/shared/PageShell'
import { getMoodById } from '../data/moods'
import { getSessionSummary, getStoredUserId } from '../lib/api'

export default function ReleasePage() {
  const [releaseDone, setReleaseDone] = useState(false)
  const [activeMoodId, setActiveMoodId] = useState('stress')
  const mood = getMoodById(activeMoodId)
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      if (!getStoredUserId()) {
        navigate('/login')
        return
      }

      try {
        const session = await getSessionSummary()

        if (!cancelled) {
          setActiveMoodId(session.activeMoodId)
        }
      } catch {
        if (!getStoredUserId()) {
          navigate('/login')
        }
      }
    }

    loadSession()

    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <div className="page-wrap">
      <div className="page-container">
        <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
          <AppSidebar />
          <main className="space-y-6">
            <AppHeader title="Emotional Release" subtitle="This is the symbolic reset moment that makes the platform unique." />
            <PageShell
              title="Tap to release"
              description="Use the orb below to simulate a symbolic emotional release moment."
              action={
                <button onClick={() => navigate('/journal')} className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-white hover:bg-white/10">
                  Continue to reflection
                </button>
              }
            >
              <div className="grid gap-6 md:grid-cols-[1fr_0.9fr]">
                <div className={`rounded-[2rem] border border-white/10 bg-gradient-to-br ${mood.accent} ${mood.glow}`}>
                  <div className="border-b border-white/10 px-6 py-5">
                    <h2 className="text-xl font-semibold text-white">{mood.release}</h2>
                    <p className="mt-1 text-sm text-white/70">Selected emotion: {mood.title}</p>
                  </div>
                  <div className="flex flex-col items-center p-6 text-white/75">
                    <motion.button
                      whileTap={{ scale: 0.96 }}
                      onClick={() => setReleaseDone((prev) => !prev)}
                      className="group relative mb-5 flex h-52 w-52 items-center justify-center rounded-full border border-white/15 bg-white/10 backdrop-blur-xl"
                    >
                      <motion.div
                        animate={releaseDone ? { scale: [1, 1.1, 0.96], opacity: [1, 0.85, 1] } : { scale: [1, 1.05, 1] }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-4 rounded-full border border-white/15"
                      />
                      <motion.div
                        animate={releaseDone ? { scale: [1, 1.18, 1], opacity: [0.5, 0.2, 0.5] } : { opacity: 0.65 }}
                        transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
                        className="absolute inset-0 rounded-full bg-white/10 blur-2xl"
                      />
                      <div className="relative text-center">
                        <p className="text-xs uppercase tracking-[0.24em] text-white/50">Tap to release</p>
                        <p className="mt-2 text-2xl font-semibold text-white">{releaseDone ? 'Released' : mood.title}</p>
                      </div>
                    </motion.button>
                    <p className="max-w-sm text-center text-sm leading-6 text-white/72">
                      {releaseDone
                        ? 'A gentle symbolic release animation helps the user feel closure before moving forward.'
                        : 'Tap the orb to simulate the symbolic emotional release moment.'}
                    </p>
                  </div>
                </div>

                <div className="glass-dark rounded-[2rem] p-6">
                  <h2 className="text-xl font-semibold text-white">Reward loop</h2>
                  <div className="mt-4 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-emerald-100">
                    <div className="flex items-center gap-2">
                      <Gift className="h-4 w-4" />
                      <p className="font-medium">+10 tokens after reset</p>
                    </div>
                    <p className="mt-2 text-sm text-emerald-50/85">
                      Encourages engagement while keeping the experience calm and intentional.
                    </p>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                    This feature gives the site a memorable, interactive moment instead of feeling like a static wellness page.
                  </div>
                </div>
              </div>
            </PageShell>
          </main>
        </div>
      </div>
    </div>
  )
}
