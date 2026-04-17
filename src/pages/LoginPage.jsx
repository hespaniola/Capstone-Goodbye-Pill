import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../lib/api'

export default function LoginPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setError('')

    try {
      await login(form)
      navigate('/dashboard')
    } catch (nextError) {
      setError(nextError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-wrap">
      <div className="page-container flex min-h-screen items-center justify-center">
        <div className="glass w-full max-w-md rounded-[2rem] p-8">
          <p className="text-xs uppercase tracking-[0.3em] text-white/40">GoodbyePills</p>
          <h1 className="mt-3 text-3xl font-semibold">Welcome back</h1>
          <p className="mt-2 text-white/65">Sign in to continue your emotional reset journey.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/30"
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-white placeholder:text-white/30"
              required
            />
            {error ? <p className="rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-100">{error}</p> : null}
            <button type="submit" disabled={submitting} className="w-full rounded-2xl bg-white px-4 py-3 font-medium text-black hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-60">
              {submitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
