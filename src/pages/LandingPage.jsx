import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, Brain, Shield, Waves } from 'lucide-react'
import FloatingOrb from '../components/shared/FloatingOrb'
import LoginModal from '../components/layout/LoginModal'
import { moods } from '../data/moods'

export default function LandingPage() {
  const [showLogin, setShowLogin] = useState(true)
  const navigate = useNavigate()

  return (
    <div className="page-wrap">
      <div className="pointer-events-none absolute inset-0">
        <FloatingOrb className="absolute left-[-8%] top-[-10%] h-80 w-80 bg-fuchsia-500/20" />
        <FloatingOrb className="absolute right-[-8%] top-[10%] h-96 w-96 bg-cyan-500/20" />
        <FloatingOrb className="absolute bottom-[-12%] left-[20%] h-[28rem] w-[28rem] bg-violet-500/15" />
      </div>

      <LoginModal open={showLogin} onClose={() => setShowLogin(false)} />

      <div className="page-container">
        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <div className="glass overflow-hidden rounded-[2rem] p-2">
            <div className="relative p-6 md:p-8">
              <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100 inline-block">
                Non-clinical • Reflective • Supportive
              </div>

              <h1 className="mt-5 max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white/95 md:text-6xl">
                Slow down. Reflect. Reset.
              </h1>

              <p className="mt-5 max-w-xl text-base leading-7 text-white/68 md:text-lg">
                A calming digital wellness platform designed to help users process emotions, breathe,
                journal, and experience symbolic emotional release through a peaceful, modern interface.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowLogin(true)}
                  className="rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-white/90"
                >
                  Get started <ArrowRight className="ml-2 inline h-4 w-4" />
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-3 text-white transition hover:bg-white/10"
                >
                  Explore the platform
                </button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                <div className="glass-dark rounded-2xl p-4">
                  <p className="text-2xl font-semibold text-white">4</p>
                  <p className="mt-1 text-sm text-white/60">Mood paths</p>
                </div>
                <div className="glass-dark rounded-2xl p-4">
                  <p className="text-2xl font-semibold text-white">1–3 min</p>
                  <p className="mt-1 text-sm text-white/60">Reset sessions</p>
                </div>
                <div className="glass-dark rounded-2xl p-4">
                  <p className="text-2xl font-semibold text-white">40</p>
                  <p className="mt-1 text-sm text-white/60">Demo tokens</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="glass rounded-[2rem] bg-gradient-to-br from-fuchsia-500/10 to-cyan-500/10">
              <div className="border-b border-white/10 px-6 py-5">
                <h2 className="text-xl font-semibold text-white">Platform highlights</h2>
                <p className="mt-1 text-sm text-white/60">Core features in one calm, polished view.</p>
              </div>
              <div className="grid gap-3 p-6">
                {[
                  { icon: Waves, title: 'Breathing tools', text: 'Guided visual breathing to help users settle.', color: 'text-cyan-200' },
                  { icon: Brain, title: 'Mood-based reflection', text: 'Prompts and recommendations tied to emotional state.', color: 'text-violet-200' },
                  { icon: Shield, title: 'Privacy-aware design', text: 'Supportive experience without medical claims.', color: 'text-emerald-200' },
                ].map((item) => {
                  const Icon = item.icon
                  return (
                    <div key={item.title} className="glass-dark rounded-2xl p-4">
                      <Icon className={`mb-2 h-5 w-5 ${item.color}`} />
                      <p className="font-medium text-white">{item.title}</p>
                      <p className="mt-1 text-sm text-white/65">{item.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="glass rounded-[2rem]">
              <div className="border-b border-white/10 px-6 py-5">
                <h2 className="text-xl font-semibold text-white">Quick mood preview</h2>
                <p className="mt-1 text-sm text-white/60">Preview the emotional states users can choose from.</p>
              </div>
              <div className="grid gap-3 p-6 sm:grid-cols-2">
                {moods.map((mood) => {
                  const Icon = mood.icon
                  return (
                    <button
                      key={mood.id}
                      onClick={() => navigate('/mood')}
                      className={`rounded-2xl border border-white/10 bg-gradient-to-br ${mood.accent} p-4 text-left transition hover:bg-white/10`}
                    >
                      <Icon className="mb-2 h-5 w-5 text-white" />
                      <p className="font-medium text-white">{mood.title}</p>
                      <p className="mt-1 text-xs text-white/65">{mood.desc}</p>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
