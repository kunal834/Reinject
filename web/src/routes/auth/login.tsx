import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { useApp } from '../../context/Appcontext' // Mapped cleanly to your context file

export const Route = createFileRoute('/auth/login')({
  component: LoginComponent,
})

function LoginComponent() {
  const [email, setEmail] = useState('')
  const { login, isAuthenticated, isLoading } = useApp()
  const navigate = useNavigate()

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: '/dashboard' })
    }
  }, [isAuthenticated, navigate])

  // 2. INTERFACE GUARD: Psychological suspense skeleton loader
  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center bg-[#070913] font-['Share_Tech_Mono',_monospace]">
        <div className="text-[#39ff14] tracking-widest text-sm animate-pulse font-bold">
          ⚡ GRANTING_PREMIUM_CREATOR_ACCESS...
        </div>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    try {
      await login(email)

      // 4. TRANSFER LAYER: Instantly push them to the dashboard upon success
      navigate({ to: '/dashboard' })
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Authentication failed')
    }
  }

  return (
    // Base block mapped directly to your core Synthwave configuration rules
    <div className="flex min-h-[calc(100vh-4rem-17.5rem)] items-center justify-center px-4 py-12 bg-[#070913] font-['Share_Tech_Mono',_monospace]">
      {/* Login Card Structure - Styled with clear neon borders and an internal dotted mesh boundary */}
      <div className="w-full max-w-md space-y-8 rounded-none border-4 border-black bg-[#121626] p-8 shadow-[8px_8px_0px_0px_#000000] relative before:absolute before:inset-0 before:border-2 before:border-dashed before:border-[#ff007f]/20 before:pointer-events-none border-t-[#39ff14]">
        <div className="text-center">
          {/* Glowing Crown/Prestige Indicator */}
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-none border-4 border-black bg-[#ffff55] text-black shadow-[4px_4px_0px_0px_#aa5500]">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="square"
                strokeLinejoin="miter"
                d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12Zm11.378-3.917c-.89-.777-2.366-.777-3.255 0a.75.75 0 0 1-.988-1.114c1.44-1.257 3.792-1.257 5.232 0a.75.75 0 1 1-.989 1.114ZM9 10.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm6 0a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5ZM7.047 14.93a.75.75 0 0 1 1.04-.15c1.17.84 2.658 1.32 4.163 1.32 1.505 0 2.992-.48 4.162-1.32a.75.75 0 1 1 .89 1.21c-1.42 1.022-3.23 1.61-5.052 1.61-1.82 0-3.631-.588-5.052-1.61a.75.75 0 0 1-.15-1.04Z"
              />
            </svg>
          </div>

          <h2 className="mt-6 text-4xl font-black uppercase tracking-wide text-white font-['VT323',_monospace] [text-shadow:3px_3px_0px_#000000]">
            CLAIM_YOUR_EMPIRE
          </h2>
          <p className="mt-2 text-xs font-bold uppercase tracking-wider text-slate-400">
            Enter your email to unlock supreme branding tools and elite telemetry power.
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email-address"
              className="block text-xs font-bold uppercase tracking-widest text-[#00f5ff] mb-2"
            >
              ENTER YOUR EMAIL
            </label>
            <input
              id="email-address"
              type="email"
              required
              value={email}
              // 🟢 Data strategy: We normalize the state to lowercase under the hood
              onChange={(e) => setEmail(e.target.value.toLowerCase())}
              className="block w-full rounded-none border-4 border-black bg-[#070b12] px-4 py-3 text-sm font-bold tracking-wider text-[#00f5ff] placeholder-[#ff007f]/30 focus:outline-none focus:border-[#ff007f] transition-colors"
              placeholder="name@gmail.com"
            />
          </div>

          {/* High-Motivation 3D Block Action Trigger */}
          <button
            type="submit"
            className="flex w-full justify-center rounded-none border-4 border-b-8 border-black bg-[#39ff14] px-4 py-3.5 text-sm font-black uppercase tracking-widest text-black transition-all hover:bg-[#2acc10] active:border-b-4 active:translate-y-1 cursor-pointer"
          >
            Lets Serve the World
          </button>
        </form>
      </div>
    </div>
  )
}
