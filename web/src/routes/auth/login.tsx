import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useApp } from '../../context/Appcontext'

export const Route = createFileRoute('/auth/login')({
  component: LoginComponent,
})

function LoginComponent() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { login, signup, isAuthenticated, isLoading } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) navigate({ to: '/dashboard' })
  }, [isAuthenticated, navigate])

  if (isLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-[#ddd9cf] border-t-[#ed6a43]" />
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      if (mode === 'signup') await signup(name, email, password)
      else await login(email, password)
      navigate({ to: '/dashboard' })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Authentication failed.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="grid min-h-[calc(100vh-72px)] lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-[#191919] lg:flex lg:flex-col lg:justify-between p-12 xl:p-16">
        <div className="relative z-10 flex items-center gap-2 text-white">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#ed6a43]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12h16M12 4v16M8 8l8 8M16 8l-8 8" /></svg>
          </span>
          <span className="text-xl font-[800] tracking-[-0.04em]">Reinject</span>
        </div>
        <div className="relative z-10 max-w-lg">
          <blockquote className="text-4xl font-[700] leading-[1.15] tracking-[-0.045em] text-white">
            “The fastest way to turn customer conversations into better products.”
          </blockquote>
          <p className="mt-6 text-sm font-medium text-[#aaa79f]">Built for teams that listen closely.</p>
        </div>
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full border-[70px] border-[#ed6a43]/10" />
      </div>

      <div className="flex items-center justify-center px-5 py-16">
        <div className="w-full max-w-[420px]">
          <div className="mb-9">
            <p className="text-sm font-bold text-[#ed6a43]">Welcome to Reinject</p>
            <h1 className="mt-2 text-[38px] font-[800] leading-tight tracking-[-0.05em]">
              {mode === 'signup' ? 'Create your account' : 'Sign in to your workspace'}
            </h1>
            <p className="mt-3 text-[#77736b]">
              {mode === 'signup' ? 'Set up your Reinject workspace.' : 'Enter your work email and password.'}
            </p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            {mode === 'signup' && (
              <div>
                <label htmlFor="full-name" className="mb-2 block text-sm font-bold text-[#3d3b37]">Full name</label>
                <input
                  id="full-name"
                  type="text"
                  required
                  minLength={1}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 w-full rounded-[10px] border border-[#dcd8ce] bg-white px-4 text-sm outline-none transition placeholder:text-[#aaa69d] focus:border-[#ed6a43] focus:ring-4 focus:ring-[#ed6a43]/10"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label htmlFor="email-address" className="mb-2 block text-sm font-bold text-[#3d3b37]">Work email</label>
              <input
                id="email-address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value.toLowerCase())}
                className="h-12 w-full rounded-[10px] border border-[#dcd8ce] bg-white px-4 text-sm outline-none transition placeholder:text-[#aaa69d] focus:border-[#ed6a43] focus:ring-4 focus:ring-[#ed6a43]/10"
                placeholder="you@company.com"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-bold text-[#3d3b37]">Password</label>
              <input
                id="password"
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-12 w-full rounded-[10px] border border-[#dcd8ce] bg-white px-4 text-sm outline-none transition placeholder:text-[#aaa69d] focus:border-[#ed6a43] focus:ring-4 focus:ring-[#ed6a43]/10"
                placeholder="At least 6 characters"
              />
            </div>
            {error && (
              <div role="alert" className="rounded-[10px] border border-[#edc3b5] bg-[#fff7f3] px-4 py-3 text-sm text-[#9d3d24]">
                {error}
              </div>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-[10px] bg-[#191919] text-sm font-bold text-white shadow-[0_8px_20px_rgba(25,25,25,.12)] transition hover:-translate-y-0.5 hover:bg-[#30302e] disabled:opacity-60 cursor-pointer"
            >
              {isSubmitting ? 'Please wait...' : mode === 'signup' ? 'Create account' : 'Sign in'}
            </button>
          </form>
          <p className="mt-6 text-center text-sm text-[#77736b]">
            {mode === 'signup' ? 'Already have an account?' : 'New to Reinject?'}
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'signup' ? 'signin' : 'signup')
                setError('')
              }}
              className="ml-1 font-bold text-[#ed6a43] hover:underline cursor-pointer"
            >
              {mode === 'signup' ? 'Sign in' : 'Create an account'}
            </button>
          </p>
          <p className="mt-6 text-center text-xs leading-5 text-[#99958c]">By continuing, you agree to Reinject's Terms and Privacy Policy.</p>
        </div>
      </div>
    </div>
  )
}
