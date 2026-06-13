import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useApp } from '../../context/Appcontext'

export const Route = createFileRoute('/auth/login')({
  component: LoginComponent,
})

function LoginComponent() {
  const [email, setEmail] = useState('')
  const { login, isAuthenticated, isLoading } = useApp()
  const navigate = useNavigate()

  // 1. ACTION LAYER: Guard the route if the user is already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, navigate])

  // 2. INTERFACE GUARD: Prevent screen flicker during authentication checks
  if (isLoading || isAuthenticated) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <div className="text-slate-400 font-medium">Verifying session...</div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      // 3. EXECUTION LAYER: Run the fetch operation to your Hono backend
      await login(email)
      
      // 4. TRANSFER LAYER: Instantly push them to the dashboard upon success
      navigate({ to: '/dashboard' })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Authentication failed')
    }
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem-17.5rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-800/80 bg-slate-900/30 p-8 shadow-xl backdrop-blur-sm">
        <div className="text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600 text-2xl">
            🔒
          </div>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-white">Welcome Back</h2>
          <p className="mt-2 text-sm text-slate-400">Enter your email to instantly access your forms.</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email-address" className="block text-sm font-medium text-slate-300 mb-1.5">
              Email Address
            </label>
            <input
              id="email-address"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2.5 text-white placeholder-slate-500 transition focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm"
              placeholder="name@domain.com"
            />
          </div>

          <button
            type="submit"
            className="flex w-full justify-center rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            Sign In / Register
          </button>
        </form>
      </div>
    </div>
  )
}