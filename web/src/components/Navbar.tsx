import { Link, useNavigate } from '@tanstack/react-router'
import { useApp } from '../context/Appcontext' // Mapped cleanly to your context provider

export function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useApp()
  const navigate = useNavigate()

  const handleLogoutClick = async () => {
    try {
      await logout()
      // Send them back to the login screen cleanly after session destruction
      navigate({ to: '/' })
    } catch (err) {
      console.error('Failed to execute logout runtime routine:', err)
    }
  }

  return (
    // Replaced muddy voxel background with a premium, blurred dark navigation shell
    <header className="sticky top-0 z-50 w-full border-b border-slate-900 bg-[#070913]/80 backdrop-blur-md select-none font-['Share_Tech_Mono',_monospace]">
      {/* Micro Glow Accent line under the navbar boundary */}
      <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff007f]/40 to-transparent" />

      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Original Branding Token (Kept exactly identical to preserve identity) */}
        <Link to="/" className="flex items-center transition hover:opacity-95">
          <div className="inline-flex border-4 border-black text-black font-black text-lg sm:text-xl tracking-tight bg-black">
            {/* DO */}
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#ffaa00] border-r-2 border-black">
              D
            </span>
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#ffaa00] border-r-4 border-black">
              O
            </span>
            {/* CO */}
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#3b82f6] border-r-2 border-black">
              C
            </span>
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#3b82f6] border-r-4 border-black">
              O
            </span>
            {/* DE */}
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#f43f5e] border-r-2 border-black">
              D
            </span>
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#f43f5e] border-r-4 border-black">
              E
            </span>
            {/* GO */}
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#10b981] border-r-2 border-black">
              G
            </span>
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#10b981]">
              O
            </span>
          </div>
        </Link>

        {/* Navigation Actions Grid with Synthwave Styling */}
        <nav className="flex items-center gap-2 sm:gap-4 text-xs font-bold uppercase tracking-wider">
          <Link
            to="/"
            className="px-3 py-1.5 text-slate-400 transition hover:text-slate-200"
            activeProps={{
              className:
                '!text-[#00f5ff] bg-slate-950 border border-slate-800 shadow-[0_0_10px_rgba(0,245,255,0.1)]',
            }}
          >
            Home
          </Link>

          {/* Render Dashboard anchor dynamically only to logged-in operators */}
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="px-3 py-1.5 text-slate-400 transition hover:text-slate-200"
              activeProps={{
                className:
                  '!text-[#00f5ff] bg-slate-950 border border-slate-800 shadow-[0_0_10px_rgba(0,245,255,0.1)]',
              }}
            >
              Dashboard
            </Link>
          )}

          {/* Elegant geometric splitter element */}
          <div className="h-4 w-[1px] bg-slate-800 mx-1" />

          {/* DYNAMIC AUTHENTICATION INTERCEPT FORK */}
          {isLoading ? (
            <span className="text-[10px] tracking-widest text-[#ff007f] animate-pulse px-4">
              // SYNCING_NODE
            </span>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Active Profile ID Block */}
              {user?.email && (
                <span className="hidden md:inline text-[10px] text-[#00f5ff] bg-[#00f5ff]/5 border border-[#00f5ff]/20 px-2 py-1 tracking-widest">
                  SYS_OP: {user.email.split('@')[0]}
                </span>
              )}

              {/* Crimson Tech Style Logout Dispatcher */}
              <button
                onClick={handleLogoutClick}
                className="relative overflow-hidden rounded-md border border-[#ff007f] bg-[#ff007f]/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-[#ff007f] shadow-[0_0_15px_rgba(255,0,127,0.1)] transition-all hover:bg-[#ff007f] hover:text-white cursor-pointer active:scale-95 animate-none"
              >
                Logout
              </button>
            </div>
          ) : (
            // Sleek Chrome/Steel Link for Guest Authorization Injection
            <Link
              to="/auth/login"
              className="rounded-md border border-slate-800 bg-slate-950 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-slate-300 transition-all hover:bg-slate-900 hover:border-slate-700 shadow-[0_1px_2px_rgba(0,0,0,0.5)]"
            >
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
