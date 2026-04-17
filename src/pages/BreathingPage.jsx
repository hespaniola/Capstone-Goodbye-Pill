import { ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import AppSidebar from '../components/layout/AppSidebar'
import AppHeader from '../components/layout/AppHeader'
import PageShell from '../components/shared/PageShell'
import BreathingCircle from '../components/breathing/BreathingCircle'

export default function BreathingPage() {
  const navigate = useNavigate()

  return (
    <div className="page-wrap">
      <div className="page-container">
        <div className="grid gap-6 lg:grid-cols-[290px_1fr]">
          <AppSidebar />
          <main className="space-y-6">
            <AppHeader title="Breathing Exercise" subtitle="A peaceful visual breathing tool that helps users slow down before continuing." />
            <PageShell
              title="Follow the guided breathing rhythm"
              description="Use this moment to reduce mental noise and reconnect with the present."
              action={
                <button onClick={() => navigate('/release')} className="rounded-2xl bg-white px-5 py-3 font-medium text-black hover:bg-white/90">
                  Next step <ArrowRight className="ml-2 inline h-4 w-4" />
                </button>
              }
            >
              <BreathingCircle />
              <div className="mx-auto mt-2 max-w-xl rounded-2xl border border-white/10 bg-black/20 p-4 text-center text-sm text-white/68">
                Try one full minute of slow breathing before moving on.
              </div>
            </PageShell>
          </main>
        </div>
      </div>
    </div>
  )
}
