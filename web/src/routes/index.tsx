import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    // Deep, textured underground/dirt background tone with pixel font settings
    <div className="relative min-h-screen bg-[#2c1b12] text-[#f0f0f0] font-mono selection:bg-[#5c8e32] selection:text-white antialiased">
      
      {/* Grass Block top layer banner replica */}
     

      {/* Retro Voxel Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.06] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      {/* Hero Visual Block */}
      <section className="mx-auto max-w-7xl px-6 pt-20 pb-20 text-center lg:px-8 lg:pt-28">
        {/* Enchantment / Rare Item Chat Tooltip Style */}
        <span className="inline-block rounded-none border-4 border-[#141414] bg-[#1a0c24] px-4 py-2 text-xs font-bold uppercase tracking-wider text-[#ffff55] ring-4 ring-[#4a0e4e] ring-offset-0">
          ✨ Level 100: Personal Branding Engine ✨
        </span>
        
        <h1 className="mx-auto mt-8 max-w-4xl text-4xl font-black uppercase tracking-wide text-[#ffffff] sm:text-6xl [text-shadow:5px_5px_0px_#141414]">
          Build Beautiful, Fully Branded <br />
          <span className="text-[#55ff55] [text-shadow:5px_5px_0px_#1c3b1c]">Surveys in Seconds</span>
        </h1>
        
        <p className="mx-auto mt-6 max-w-2xl text-base font-bold leading-7 text-[#e0a96d] [text-shadow:2px_2px_0px_#141414]">
          Compose interactive queries, orchestrate logic trees, and customize standard visual forms with custom brand schemas. Secure fast, structured responses seamlessly.
        </p>
        
        {/* Retro 3D Block Buttons */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6">
          <Link
            to="/auth/login"
            className="w-full sm:w-auto text-center rounded-none border-4 border-b-8 border-black bg-[#5c8e32] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-white transition-all hover:bg-[#4d7828] active:border-b-4 active:translate-y-1"
          >
            Create a Survey
          </Link>
          <a 
            href="#features" 
            className="w-full sm:w-auto text-center rounded-none border-4 border-b-8 border-black bg-[#ffaa00] px-8 py-3.5 text-sm font-bold uppercase tracking-wider text-black transition-all hover:bg-[#df9400] active:border-b-4 active:translate-y-1"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Feature Section - Set atop structural cobblestone/deepslate colors */}
      <section id="features" className="mx-auto max-w-7xl px-6 py-20 sm:py-24 lg:px-8 border-t-8 border-dashed border-[#141414] bg-[#1a110b]">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold uppercase tracking-wide text-[#ffff55] [text-shadow:3px_3px_0px_#141414] sm:text-4xl">
            Engineered for Complete Ownership
          </h2>
          <p className="mt-4 text-base text-[#aaaaaa]">
            Everything you need to compile, configure, and analyze surveys under your own visual umbrella.
          </p>
        </div>

        {/* Dynamic Resource Ore Style Blocks Grid */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1 - Diamond Ore Blueprint */}
          <div className="rounded-none border-4 border-b-8 border-black bg-[#242c30] p-8 transition-transform hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-none border-4 border-black bg-[#00aaaa] text-white shadow-[4px_4px_0px_0px_#005555]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-bold uppercase tracking-wide text-[#55ffff] [text-shadow:2px_2px_0px_#005555]">Visual Layout Builder</h3>
            <p className="mt-3 text-sm leading-6 text-[#e0e0e0]">
              Compose short text, structural multiple choice, or linear numerical rating blocks dynamically.
            </p>
          </div>

          {/* Card 2 - Gold Ore Blueprint */}
          <div className="rounded-none border-4 border-b-8 border-black bg-[#302c20] p-8 transition-transform hover:-translate-y-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-none border-4 border-black bg-[#ffaa00] text-black shadow-[4px_4px_0px_0px_#aa5500]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M9.53 16.122a3 3 0 0 0-3.03 0m3.03 0a3 3 0 0 1 3.03 0m-3.03 0-6.109 4.132A1.25 1.25 0 0 1 1.5 19.34V4.66a1.25 1.25 0 0 1 1.921-1.071l6.109 4.132a3 3 0 0 1 6.109 0l6.109-4.132A1.25 1.25 0 0 1 22.5 4.66v14.68a1.25 1.25 0 0 1-1.921 1.071l-6.109-4.132a3 3 0 0 0-3.03 0m0 0a3 3 0 0 1-3.03 0" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-bold uppercase tracking-wide text-[#ffff55] [text-shadow:2px_2px_0px_#aa5500]">Custom Brand Tokens</h3>
            <p className="mt-3 text-sm leading-6 text-[#e0e0e0]">
              Inject custom color definitions and structural logos directly into individual survey viewports.
            </p>
          </div>

          {/* Card 3 - Redstone Ore Blueprint */}
          <div className="rounded-none border-4 border-b-8 border-black bg-[#302020] p-8 transition-transform hover:-translate-y-1 col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex h-12 w-12 items-center justify-center rounded-none border-4 border-black bg-[#ff5555] text-white shadow-[4px_4px_0px_0px_#aa0000]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="square" strokeLinejoin="miter" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-1.5 0H6.002m0 0a.75.75 0 1 0 0 1.5h12a.75.75 0 1 0 0-1.5h-12Zm0 0v3m12-3v3m-3.75-9H12v3h2.25v-3Zm0 0H16.5V6h-2.25v1.5Zm-5.25 0h2.25V6H9v1.5Z" />
              </svg>
            </div>
            <h3 className="mt-6 text-lg font-bold uppercase tracking-wide text-[#ff5555] [text-shadow:2px_2px_0px_#aa0000]">Redstone Analytics</h3>
            <p className="mt-3 text-sm leading-6 text-[#e0e0e0]">
              Persist anonymous responses securely to database nodes and view live performance metrics on your dashboard.
            </p>
          </div>

        </div>
      </section>
    </div>
  )
}