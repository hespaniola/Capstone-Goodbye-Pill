import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import AppSidebar from '../components/layout/AppSidebar'
import AppHeader from '../components/layout/AppHeader'
import PageShell from '../components/shared/PageShell'
import { getMoodById } from '../data/moods'
import { createJournalEntry, getSessionSummary, getStoredUserId } from '../lib/api'

export default function JournalPage() {
  const [journal, setJournal] = useState('')
  const [activeMoodId, setActiveMoodId] = useState('stress')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const mood = getMoodById(activeMoodId)

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

  async function handleSave() {
    setSaving(true)
    setError('')

    try {
      await createJournalEntry(journal)
      navigate('/recommendations')
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
            <AppHeader title="Journal and Reflection" subtitle="Guided writing helps the user process what they are carrying." />
            <PageShell
              title="Reflect for a moment"
              description="Write as little or as much as you need. This is a low-pressure space."
              action={
                <button
                  onClick={handleSave}
                  disabled={loading || saving || !journal.trim()}
                  className="rounded-2xl bg-white px-5 py-3 font-medium text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saving ? 'Saving...' : 'Save and continue'}
                </button>
              }
            >
              <div className="space-y-4">
                {error ? <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
                <div className="glass-dark rounded-2xl p-4 text-sm text-white/75">
                  Prompt: {mood.prompt}
                </div>
                <textarea
                  value={journal}
                  onChange={(e) => setJournal(e.target.value)}
                  placeholder="Write what you are feeling and what would help you release even a little of it..."
                  className="min-h-[220px] w-full rounded-[1.5rem] border border-white/10 bg-black/20 p-4 text-white outline-none placeholder:text-white/35"
                />
                <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white/55">
                  <span>Reflection depth</span>
                  <span>{Math.min(journal.length, 100)} / 100</span>
                </div>
              </div>
            </PageShell>
          </main>
        </div>
      </div>
    </div>
  )
}
