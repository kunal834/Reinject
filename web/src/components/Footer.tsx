export function Footer() {
  return (
    <footer className="w-full border-t border-slate-900 bg-[#080b12]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Informational Context */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-lg font-bold text-white">
              <span className="text-xl">📊</span> FormFlow
            </div>
            <p className="text-sm leading-6 text-slate-400 max-w-xs">
              Empowering platform operators to gather dynamic insight under explicit human management.
            </p>
          </div>

          {/* Links Column Grids */}
          <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Product Layouts</h3>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#" className="text-sm text-slate-400 transition hover:text-white">Survey Designer</a></li>
                <li><a href="#" className="text-sm text-slate-400 transition hover:text-white">Dynamic Brand Engines</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-200 uppercase tracking-wider">Data Resources</h3>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#" className="text-sm text-slate-400 transition hover:text-white">API Schemas</a></li>
                <li><a href="#" className="text-sm text-slate-400 transition hover:text-white">Cloudflare Deployments</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Copy System Framework Marker */}
        <div className="mt-12 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-slate-500">&copy; {new Date().getFullYear()} FormFlow Platform. Open Source Framework Assignment.</p>
          <p className="text-xs text-slate-600 tracking-wide font-mono">Biometric Alignment Verified</p>
        </div>
      </div>
    </footer>
  )
}