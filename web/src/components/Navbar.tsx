import { Link, useNavigate } from '@tanstack/react-router'
import { useApp } from '../context/Appcontext' // Make sure this path correctly points to your context file

export function Navbar() {
  const { isAuthenticated, user, logout, isLoading } = useApp()
  const navigate = useNavigate()

  const handleLogoutClick = async () => {
    try {
      await logout()
      // Send them back to the login screen or home page cleanly after session destruction
      navigate({ to: '/' })
    } catch (err) {
      console.error("Failed to execute logout runtime routine:", err)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b-4 border-black bg-[#2c1b12] font-mono select-none">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Branding Token */}
        <Link to="/" className="flex items-center transition hover:opacity-95">
          <div className="inline-flex border-4 border-black text-black font-black text-lg sm:text-xl tracking-tight bg-black">
            {/* DO */}
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#ffaa00] border-r-2 border-black">D</span>
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#ffaa00] border-r-4 border-black">O</span>
            {/* CO */}
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#3b82f6] border-r-2 border-black">C</span>
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#3b82f6] border-r-4 border-black">O</span>
            {/* DE */}
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#f43f5e] border-r-2 border-black">D</span>
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#f43f5e] border-r-4 border-black">E</span>
            {/* GO */}
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#10b981] border-r-2 border-black">G</span>
            <span className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center bg-[#10b981]">O</span>
          </div>
        </Link>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-1 sm:gap-3">
          <Link 
            to="/" 
            className="rounded-none px-3 py-1.5 text-sm font-bold uppercase text-[#aaaaaa] transition hover:text-white"
            activeProps={{ className: '!text-[#ffff55] bg-[#1a110b] border-2 border-black [text-shadow:2px_2px_0px_#141414]' }}
          >
            Home
          </Link>

          {/* Only show Dashboard link to logged-in operators */}
          {isAuthenticated && (
            <Link 
              to="/dashboard" 
              className="rounded-none px-3 py-1.5 text-sm font-bold uppercase text-[#aaaaaa] transition hover:text-white"
              activeProps={{ className: '!text-[#ffff55] bg-[#1a110b] border-2 border-black [text-shadow:2px_2px_0px_#141414]' }}
            >
              Dashboard
            </Link>
          )}
          
          {/* Voxel Border Splitter */}
          <div className="h-6 w-1 bg-black mx-2" />

          {/* DYNAMIC AUTH FORK */}
          {isLoading ? (
            // Prevent button flicker during initial background session checks
            <span className="text-xs text-slate-500 animate-pulse uppercase font-bold px-4">Syncing...</span>
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* Optional: Displays active profile handle on wider desktop viewports */}
              {user?.email && (
                <span className="hidden md:inline text-xs text-[#10b981] bg-black/40 border border-black px-2 py-1 font-mono uppercase tracking-tight">
                  User: {user.email.split('@')[0]}
                </span>
              )}

              {/* Red Brick Style Logout Trigger */}
              <button 
                onClick={handleLogoutClick}
                className="inline-flex items-center justify-center rounded-none border-4 border-b-6 border-black bg-[#f43f5e] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-black transition-all hover:bg-[#e11d48] active:border-b-4 active:translate-y-[2px] cursor-pointer"
              >
                Logout
              </button>
            </div>
          ) : (
            // Classic Gray Brick Style for Guest Sign In
            <Link 
              to="/auth/login" 
              className="inline-flex items-center justify-center rounded-none border-4 border-b-6 border-black bg-[#4a4b4c] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#e0e0e0] transition-all hover:bg-[#3a3b3c] active:border-b-4 active:translate-y-[2px]"
            >
              Sign In
            </Link>
          )}
        </nav>

      </div>
    </header>
  )
}