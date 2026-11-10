export function Footer() {
  return (
    // Replaced muddy brown layer with a solid, premium midnight space baseline container
    <footer className="w-full border-t border-slate-900 bg-[#0a0c16] font-['Share_Tech_Mono',_monospace] select-none relative">
      {/* Subtle Synthwave horizontal division border glow */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#ff007f]/30 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          {/* Informational Context */}
          <div className="space-y-4">
            {/* Original Blocky Pixel Logo (Kept perfectly preserved in size and asset configuration) */}
            <div className="flex items-center transition hover:opacity-95">
              <div className="inline-flex border-2 border-black text-black font-extrabold text-xs tracking-tight bg-black">
                {/* DO */}
                <span className="w-6 h-6 flex items-center justify-center bg-[#ffaa00] border-r border-black">
                  D
                </span>
                <span className="w-6 h-6 flex items-center justify-center bg-[#ffaa00] border-r-2 border-black">
                  O
                </span>
                {/* CO */}
                <span className="w-6 h-6 flex items-center justify-center bg-[#3b82f6] border-r border-black">
                  C
                </span>
                <span className="w-6 h-6 flex items-center justify-center bg-[#3b82f6] border-r-2 border-black">
                  O
                </span>
                {/* DE */}
                <span className="w-6 h-6 flex items-center justify-center bg-[#f43f5e] border-r border-black">
                  D
                </span>
                <span className="w-6 h-6 flex items-center justify-center bg-[#f43f5e] border-r-2 border-black">
                  E
                </span>
                {/* GO */}
                <span className="w-6 h-6 flex items-center justify-center bg-[#10b981] border-r border-black">
                  G
                </span>
                <span className="w-6 h-6 flex items-center justify-center bg-[#10b981]">O</span>
              </div>
            </div>

            {/* Descriptive block matching your high-contrast slate colors */}
            <p className="text-sm font-bold leading-6 text-slate-400 max-w-xs">
              Empowering platform operators to gather dynamic insight under explicit human
              management.
            </p>
          </div>

          {/* Links Column Grids - Replaced toxic text shadow setups with crisp neon selections */}
          <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-xs font-bold text-[#ffff55] uppercase tracking-widest">
                // Product Layouts
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href="#"
                    className="text-sm font-bold text-slate-500 transition hover:text-[#00f5ff]"
                  >
                    [ Survey Designer ]
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-bold text-slate-500 transition hover:text-[#00f5ff]"
                  >
                    [ Dynamic Engines ]
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-[#ffff55] uppercase tracking-widest">
                // Data Resources
              </h3>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <a
                    href="#"
                    className="text-sm font-bold text-slate-500 transition hover:text-[#ff007f]"
                  >
                    [ API Schemas ]
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-sm font-bold text-slate-500 transition hover:text-[#ff007f]"
                  >
                    [ Cloudflare Deploy ]
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Copy Framework Marker - Cleaned up dashed divider properties to match thin glass edges */}
        <div className="mt-12 border-t border-slate-900 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-slate-600">
            &copy; {new Date().getFullYear()} DoCoDeGO Platform. Open Source Framework Assignment.
          </p>
          <p className="text-xs font-bold text-[#ff007f] tracking-widest uppercase bg-[#ff007f]/5 border border-[#ff007f]/20 px-3 py-1 shadow-[0_0_10px_rgba(255,0,127,0.05)]">
            &lt; Biometric Alignment Verified &gt;
          </p>
        </div>
      </div>
    </footer>
  )
}
