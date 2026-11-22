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
    <header className="sticky top-0 z-50 border-b border-[#e7e4dc] bg-[#faf9f6]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 lg:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <span className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#ed6a43] text-white shadow-[0_5px_14px_rgba(237,106,67,.25)]">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12h16M12 4v16" />
              <path d="m8 8 8 8M16 8l-8 8" opacity=".38" />
            </svg>
          </span>
          <span className="text-[20px] font-[800] tracking-[-0.04em]">Reinject</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm font-semibold">
          <Link
            to="/"
            className="hidden rounded-lg px-3 py-2 text-[#686767] transition hover:text-[#191919] sm:block"
            activeProps={{ className: '!text-[#191919]' }}
          >
            Product
          </Link>
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="rounded-lg px-3 py-2 text-[#686767] transition hover:text-[#191919]"
              activeProps={{ className: '!text-[#191919]' }}
            >
              Dashboard
            </Link>
          )}
          {isLoading ? (
            <span className="ml-2 h-9 w-20 animate-pulse rounded-lg bg-[#edeae3]" />
          ) : isAuthenticated ? (
            <div className="flex items-center gap-3">
              {user?.email && <span className="hidden text-xs text-[#85827b] md:inline">{user.email}</span>}
              <button
                onClick={handleLogoutClick}
                className="rounded-lg border border-[#dedbd2] px-3.5 py-2 text-sm text-[#4d4b47] transition hover:bg-white cursor-pointer"
              >
                Sign out
              </button>
            </div>
          ) : (
            <Link
              to="/auth/login"
              className="ml-2 rounded-lg bg-[#191919] px-4 py-2.5 text-sm font-semibold text-white shadow-[0_4px_12px_rgba(25,25,25,.12)] transition hover:-translate-y-0.5 hover:bg-[#30302e]"
            >
              Get started
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
