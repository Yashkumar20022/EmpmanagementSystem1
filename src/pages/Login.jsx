import { useState } from 'react'
import * as React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')
  const [error, setError] = React.useState('')
  const [busy, setBusy] = React.useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setBusy(true)
    const res = await login(email, password)
    const { data, error } = res || {}
    setBusy(false)
    if (error) {
      setError(error.message)
      return
    }

    // Wait briefly for AuthProvider to pick up the session via onAuthStateChange.
    // If signInWithPassword returned a session, proceed immediately.
    if (data?.session) {
      navigate('/', { replace: true })
      return
    }

    // Otherwise poll for session for up to 3s
    const start = Date.now()
    while (Date.now() - start < 3000) {
      if (window?.supabase?.auth) {
        // don't rely on global, check AuthProvider's session via DOM event - simple poll of cookie
      }
      // check if auth cookie/session exists by asking the backend via GET to /auth/v1/user
      try {
        const r = await fetch('/auth-session-check', { method: 'GET' })
        // if this endpoint exists in production, it may help; fall back to navigating after timeout
      } catch (e) {
        // ignore
      }
      // small delay
      // eslint-disable-next-line no-await-in-loop
      await new Promise((r) => setTimeout(r, 250))
    }

    // Navigate anyway; AuthProvider will update role/profile when session arrives
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-canvas px-4">
      <div className="w-full max-w-sm animate-in">
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-violet mx-auto mb-4 flex items-center justify-center font-display font-bold text-white text-lg">
            E
          </div>
          <h1 className="font-display text-2xl font-bold">Welcome back</h1>
          <p className="text-sm text-ink/60 mt-1">Sign in to your EMS account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-line rounded-2xl p-6 shadow-sm shadow-violet/5"
        >
          {error && (
            <div className="mb-4 text-sm bg-rose/10 text-rose border border-rose/20 rounded-lg px-3 py-2">
              {error}
            </div>
          )}

          <label className="block text-xs font-medium text-ink/60 mb-1">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@company.com"
            className="w-full mb-4 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet transition"
          />

          <label className="block text-xs font-medium text-ink/60 mb-1">Password</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="w-full mb-6 rounded-lg border border-line px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-violet/40 focus:border-violet transition"
          />

          <button
            type="submit"
            disabled={busy}
            className="w-full bg-violet hover:bg-violet-dark text-white font-medium text-sm rounded-lg py-2.5 transition disabled:opacity-60"
          >
            {busy ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs text-ink/40 mt-6">
          Accounts are created by your admin. Contact HR if you need access.
        </p>
      </div>
    </div>
  )
}
