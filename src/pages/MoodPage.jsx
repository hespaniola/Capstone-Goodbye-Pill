import { useEffect, useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppSidebar from '../components/layout/AppSidebar'
import AppHeader from '../components/layout/AppHeader'
import PageShell from '../components/shared/PageShell'
import MoodCard from '../components/mood/MoodCard'
import { moods } from '../data/moods'
import { getSessionSummary, getStoredUserId, saveMoodSelection } from '../lib/api'

export default function MoodPage() {
  const [selectedMood, setSelectedMood] = useState(moods[0].id)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
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
          setSelectedMood(session.activeMoodId)
        }
      } catch (nextError) {
        if (!cancelled) {
          setError(nextError.message)
        }

        if (!getStoredUserId()) {
          navigate('/login')
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    loadSession()

    return () => {
      cancelled = true
    }
  }, [navigate])

  async function handleContinue() {
    setSaving(true)
    setError('')

    try {
      await saveMoodSelection(selectedMood)
      navigate('/breathing')
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-container">
        <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
          <AppSidebar />
          <main className="space-y-6">
            <AppHeader title="Mood Check-In" subtitle="Select how you feel right now to personalize the rest of the experience." />
            <PageShell
              title="Choose your current emotional state"
              description="This helps guide the breathing, release, reflection, and recommendation flow."
              action={
                <button
                  onClick={handleContinue}
                  disabled={loading || saving}
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-white hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  Continue <ArrowRight className="ml-2 inline h-4 w-4" />
                </button>
              }
            >
              {error ? <p className="mb-4 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {moods.map((mood) => (
                  <MoodCard
                    key={mood.id}
                    mood={mood}
                    active={selectedMood === mood.id}
                    onClick={() => setSelectedMood(mood.id)}
                  />
                ))}
              </div>
            </PageShell>
          </main>
        </div>
      </div>
    </div>
  )
}
