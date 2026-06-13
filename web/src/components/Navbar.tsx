import { Link } from '@tanstack/react-router'

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/60 bg-[#0b0f19]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding Token */}
        <Link to="/" className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-white transition hover:opacity-90">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/20">
            <span className="text-lg">📊</span>
          </div>
          <span>FormFlow</span>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-1 sm:gap-4">
          <Link 
            to="/" 
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:text-white"
            activeProps={{ className: '!text-indigo-400 font-semibold bg-slate-800/40' }}
          >
            Home
          </Link>
          <Link 
            to="/dashboard" 
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 transition hover:text-white"
            activeProps={{ className: '!text-indigo-400 font-semibold bg-slate-800/40' }}
          >
            Dashboard
          </Link>
          
          <div className="h-4 w-px bg-slate-800 mx-2" />

          <Link 
            to="/auth/login" 
            className="inline-flex items-center justify-center rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
          >
            Sign In
          </Link>
        </nav>

      </div>
    </header>
  )
}