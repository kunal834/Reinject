export function Footer() {
  return (
    <footer className="border-t border-[#e7e4dc] bg-[#f5f3ed]">
      <div className="mx-auto flex max-w-7xl flex-col gap-5 px-5 py-8 text-sm sm:flex-row sm:items-center sm:justify-between lg:px-8">
        <div className="flex items-center gap-2 font-[800] tracking-[-0.03em]">
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#ed6a43] text-white">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M4 12h16M12 4v16M8 8l8 8M16 8l-8 8" /></svg>
          </span>
          Reinject
        </div>
        <p className="text-[#85827b]">&copy; {new Date().getFullYear()} Reinject. Customer intelligence for modern teams.</p>
      </div>
    </footer>
  )
}
