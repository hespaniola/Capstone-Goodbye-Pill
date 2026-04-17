import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppSidebar from '../components/layout/AppSidebar'
import AppHeader from '../components/layout/AppHeader'
import PageShell from '../components/shared/PageShell'
import { getMoodById } from '../data/moods'
import { getRecommendations, getStoredUserId } from '../lib/api'

export default function RecommendationsPage() {
  const navigate = useNavigate()
  const [recommendations, setRecommendations] = useState(null)
  const [error, setError] = useState('')
  const mood = getMoodById(recommendations?.activeMoodId)

  useEffect(() => {
    let cancelled = false

    async function loadRecommendations() {
      if (!getStoredUserId()) {
        navigate('/login')
        return
      }

      try {
        const data = await getRecommendations()

        if (!cancelled) {
          setRecommendations(data)
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

    loadRecommendations()

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
            <AppHeader title="Recommendations" subtitle="Supportive suggestions based on the selected mood." />
            <PageShell
              title="Your next best steps"
              description="Simple recommendations to keep the reset experience moving in a supportive direction."
              action={
                <button onClick={() => navigate('/dashboard')} className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-white hover:bg-white/10">
                  Back to dashboard
                </button>
              }
            >
              {error ? <p className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
              <div className="grid gap-4 md:grid-cols-2">
                <div className="glass-dark rounded-[1.5rem] p-6">
                  <h2 className="text-xl font-semibold text-white">Mood-based suggestion</h2>
                  <p className="mt-3 text-white/75">{recommendations?.moodRecommendation ?? mood.recommendation}</p>
                </div>
                <div className="glass-dark rounded-[1.5rem] p-6">
                  <h2 className="text-xl font-semibold text-white">Recommended next step</h2>
                  <p className="mt-3 text-white/75">{recommendations?.nextStep ?? 'Try the breathing page first, then return to the journal for a short reflection entry.'}</p>
                  <p className="mt-4 text-sm text-white/55">{recommendations?.journalInsight ?? 'Your saved reflection will appear here once you submit one.'}</p>
                </div>
              </div>
            </PageShell>
          </main>
        </div>
      </div>
    </div>
  )
}
