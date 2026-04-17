import { useEffect, useState } from 'react'
import { CheckCircle2, Gift, Stars, Play } from 'lucide-react'
import AppSidebar from '../components/layout/AppSidebar'
import AppHeader from '../components/layout/AppHeader'
import InteractiveMetric from '../components/shared/InteractiveMetric'
import QuickActionCard from '../components/dashboard/QuickActionCard'
import { quickActions } from '../data/quickActions'
import { getMoodById } from '../data/moods'
import { useNavigate } from 'react-router-dom'
import { getSessionSummary, getStoredUserId } from '../lib/api'

export default function DashboardPage() {
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [error, setError] = useState('')
  const stats = session?.stats ?? {
    tokensAvailable: '--',
    resetsCompleted: '--',
  }
  const activeMood = getMoodById(session?.activeMoodId)

  useEffect(() => {
    let cancelled = false

    async function loadSession() {
      if (!getStoredUserId()) {
        navigate('/login')
        return
      }

      try {
        const data = await getSessionSummary()

        if (!cancelled) {
          setSession(data)
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError.message)
        }

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
            <AppHeader
              title="Dashboard"
              subtitle="Your personal reset hub. Track your progress, continue your routine, and choose the next step that feels most supportive."
            />

            <section className="grid gap-4 md:grid-cols-3">
              <InteractiveMetric label="Resets completed" value={stats.resetsCompleted} icon={CheckCircle2} accent="from-white/10 to-white/5" />
              <InteractiveMetric label="Tokens available" value={stats.tokensAvailable} icon={Gift} accent="from-emerald-500/15 to-cyan-500/10" />
              <InteractiveMetric label="Active mood" value={activeMood.title} icon={Stars} accent={activeMood.accent} />
            </section>

            <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
              <div className="glass rounded-[2rem]">
                <div className="border-b border-white/10 px-6 py-5">
                  <h2 className="text-xl font-semibold text-white">Quick actions</h2>
                  <p className="mt-1 text-sm text-white/60">Jump into the next part of your emotional reset routine.</p>
                </div>

                <div className="grid gap-4 px-6 pb-6 pt-6 sm:grid-cols-2">
                  {quickActions.map((action) => (
                    <QuickActionCard key={action.id} {...action} />
                  ))}
                </div>
              </div>

              <div className="rounded-[2rem] border border-white/10 bg-gradient-to-br from-cyan-500/10 to-violet-500/10 p-6 backdrop-blur-xl">
                <h2 className="text-xl font-semibold text-white">Today’s suggestion</h2>
                <p className="mt-1 text-sm text-white/60">A supportive next step based on your recent activity.</p>

                {error ? <p className="mt-5 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
                <div className="mt-5 rounded-2xl border border-white/10 bg-black/20 p-4 text-white/75">
                  {session?.recommendedAction ?? 'You may benefit from a quick breathing reset followed by a short journal entry.'}
                </div>

                <button
                  onClick={() => navigate('/breathing')}
                  className="mt-5 rounded-2xl bg-white px-5 py-3 font-medium text-black hover:bg-white/90"
                >
                  Start breathing reset <Play className="ml-2 inline h-4 w-4" />
                </button>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  )
}
