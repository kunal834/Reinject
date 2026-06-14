export function Footer() {
  return (
    <footer className="w-full border-t-8 border-black bg-[#1a110b] font-mono select-none">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="xl:grid xl:grid-cols-3 xl:gap-8">
          
          {/* Informational Context */}
          <div className="space-y-4">
            {/* Inline Pixel Logo exactly from image_54e660.png (small variant) */}
            <div className="flex items-center transition hover:opacity-95">
              <div className="inline-flex border-2 border-black text-black font-extrabold text-xs tracking-tight bg-black">
                {/* DO */}
                <span className="w-6 h-6 flex items-center justify-center bg-[#ffaa00] border-r border-black">D</span>
                <span className="w-6 h-6 flex items-center justify-center bg-[#ffaa00] border-r-2 border-black">O</span>
                {/* CO */}
                <span className="w-6 h-6 flex items-center justify-center bg-[#3b82f6] border-r border-black">C</span>
                <span className="w-6 h-6 flex items-center justify-center bg-[#3b82f6] border-r-2 border-black">O</span>
                {/* DE */}
                <span className="w-6 h-6 flex items-center justify-center bg-[#f43f5e] border-r border-black">D</span>
                <span className="w-6 h-6 flex items-center justify-center bg-[#f43f5e] border-r-2 border-black">E</span>
                {/* GO */}
                <span className="w-6 h-6 flex items-center justify-center bg-[#10b981] border-r border-black">G</span>
                <span className="w-6 h-6 flex items-center justify-center bg-[#10b981]">O</span>
              </div>
            </div>
            <p className="text-sm font-bold leading-6 text-[#e0a96d] max-w-xs [text-shadow:2px_2px_0px_#141414]">
              Empowering platform operators to gather dynamic insight under explicit human management.
            </p>
          </div>

          {/* Links Column Grids */}
          <div className="mt-8 grid grid-cols-2 gap-8 xl:col-span-2 xl:mt-0">
            <div>
              <h3 className="text-sm font-bold text-[#ffff55] uppercase tracking-wide [text-shadow:2px_2px_0px_#141414]">Product Layouts</h3>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#" className="text-sm font-bold text-[#aaaaaa] transition hover:text-[#55ff55]">[ Survey Designer ]</a></li>
                <li><a href="#" className="text-sm font-bold text-[#aaaaaa] transition hover:text-[#55ff55]">[ Dynamic Engines ]</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#ffff55] uppercase tracking-wide [text-shadow:2px_2px_0px_#141414]">Data Resources</h3>
              <ul className="mt-4 space-y-2.5">
                <li><a href="#" className="text-sm font-bold text-[#aaaaaa] transition hover:text-[#55ffff]">[ API Schemas ]</a></li>
                <li><a href="#" className="text-sm font-bold text-[#aaaaaa] transition hover:text-[#55ffff]">[ Cloudflare Deploy ]</a></li>
              </ul>
            </div>
          </div>

        </div>

        {/* Copy Framework Marker - Designed like systemic chat notifications */}
        <div className="mt-12 border-t-4 border-dashed border-black pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs font-bold text-[#8a8a8a]">
            &copy; {new Date().getFullYear()} DoCoDeGO Platform. Open Source Framework Assignment.
          </p>
          <p className="text-xs font-bold text-[#ff5555] tracking-wide uppercase [text-shadow:1px_1px_0px_#000]">
            &lt; Biometric Alignment Verified &gt;
          </p>
        </div>
      </div>
    </footer>
  )
}