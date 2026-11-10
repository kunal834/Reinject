import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    // Base application container - Rich Dark Slate with smooth font bindings
    <div className="relative min-h-screen bg-[#070913] text-[#e2e8f0] font-['Share_Tech_Mono',_monospace] selection:bg-[#ff007f] selection:text-white antialiased overflow-x-hidden">
      {/* Premium Linear Light bar accent running along the very top edge */}
      <div className="h-2 w-full bg-gradient-to-r from-[#00f5ff] via-[#ff007f] to-[#7b2cbf] shadow-[0_3px_15px_rgba(255,0,127,0.4)]" />

      {/* Cybernetic Grid Overlay Mesh */}
      <div
        className="absolute inset-0 -z-10 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
      />

      {/* Subtle background ambient mesh glow */}
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-[#ff007f]/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Hero Interactive Area */}
      <section className="mx-auto max-w-7xl px-6 pt-24 pb-20 text-center lg:px-8 lg:pt-32">
        {/* Legendary Rarity Tooltip Badge - Outlined with a glowing magenta neon shadow */}
        <span className="inline-block rounded-none border-4 border-black bg-[#0d091a] px-5 py-1.5 text-xl uppercase tracking-widest text-[#ff007f] font-['VT323',_monospace] shadow-[0_0_20px_rgba(255,0,127,0.25)] border-t-[#ff007f] border-l-[#ff007f]">
          ✨ LEVEL 100: PERSONAL BRANDING ENGINE ✨
        </span>

        {/* Title text using an ultra-premium dual linear gradient flow */}
        <h1 className="mx-auto mt-8 max-w-5xl text-5xl font-black uppercase tracking-wide text-[#ffffff] sm:text-7xl lg:text-8xl lg:leading-[0.9] font-['VT323',_monospace] [text-shadow:4px_4px_0px_#000000]">
          Build Beautiful, Fully <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f5ff] via-[#ff007f] to-[#9d4edd] drop-shadow-[0_2px_8px_rgba(0,245,255,0.2)]">
            Branded Surveys
          </span>
        </h1>

        {/* Body Descriptive block with clean high-contrast gray profiles */}
        <p className="mx-auto mt-8 max-w-2xl text-lg font-bold tracking-normal leading-7 text-slate-400 [text-shadow:1px_1px_0px_#000000]">
          Compose interactive queries, orchestrate logic trees, and customize standard visual forms
          with custom brand schemas. Secure fast, structured responses seamlessly.
        </p>

        {/* 3D Action Buttons mapped cleanly to Neon Cyan and Deep Orchid Purple */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-6 font-['Share_Tech_Mono',_monospace]">
          <Link
            to="/auth/login"
            className="w-full sm:w-auto text-center rounded-none border-4 border-b-8 border-black bg-[#00f5ff] px-8 py-3.5 text-base font-black uppercase tracking-wider text-black transition-all hover:bg-[#00d4dd] active:border-b-4 active:translate-y-1"
          >
            Create a Survey
          </Link>
          <a
            href="#features"
            className="w-full sm:w-auto text-center rounded-none border-4 border-b-8 border-black bg-[#7b2cbf] px-8 py-3.5 text-base font-black uppercase tracking-wider text-white transition-all hover:bg-[#62219c] active:border-b-4 active:translate-y-1"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Feature Section Layer - Styled atop a solid deep velvet charcoal matrix */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-6 py-20 border-t-4 border-black bg-[#0a0c16]"
      >
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-black uppercase tracking-widest text-[#ffff55] font-['VT323',_monospace] [text-shadow:2px_2px_0px_#000000] sm:text-5xl">
            Engineered for Complete Ownership
          </h2>
          <p className="mt-2 text-base tracking-wide text-slate-400">
            Everything you need to compile, configure, and analyze surveys under your own visual
            umbrella.
          </p>
        </div>

        {/* Dynamic Matrix Blocks Grid utilizing premium color trim accents */}
        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 text-left">
          {/* Card 1 - Neon Cyan Terminal Block */}
          <div className="rounded-none border-4 border-b-8 border-black bg-[#121626] p-8 transition-transform hover:-translate-y-1 border-t-4 border-t-[#00f5ff]">
            <div className="flex h-12 w-12 items-center justify-center rounded-none border-4 border-black bg-[#00f5ff] text-black shadow-[4px_4px_0px_0px_#008b94]">
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
                  d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z"
                />
              </svg>
            </div>
            <h3 className="mt-6 text-2xl font-bold uppercase tracking-wide text-[#00f5ff] font-['VT323',_monospace]">
              Visual Layout Builder
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Compose short text, structural multiple choice, or linear numerical rating blocks
              dynamically.
            </p>
          </div>

          {/* Card 2 - Neon Magenta/Hot-Pink Terminal Block */}
          <div className="rounded-none border-4 border-b-8 border-black bg-[#121626] p-8 transition-transform hover:-translate-y-1 border-t-4 border-t-[#ff007f]">
            <div className="flex h-12 w-12 items-center justify-center rounded-none border-4 border-black bg-[#ff007f] text-white shadow-[4px_4px_0px_0px_#a3004f]">
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
                  d="M9.53 16.122a3 3 0 0 0-3.03 0m3.03 0a3 3 0 0 1 3.03 0m-3.03 0-6.109 4.132A1.25 1.25 0 0 1 1.5 19.34V4.66a1.25 1.25 0 0 1 1.921-1.071l6.109 4.132a3 3 0 0 1 6.109 0l6.109-4.132A1.25 1.25 0 0 1 22.5 4.66v14.68a1.25 1.25 0 0 1-1.921 1.071l-6.109-4.132a3 3 0 0 0-3.03 0m0 0a3 3 0 0 1-3.03 0"
                />
              </svg>
            </div>
            <h3 className="mt-6 text-2xl font-bold uppercase tracking-wide text-[#ff007f] font-['VT323',_monospace]">
              Custom Brand Tokens
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Inject custom color definitions and structural logos directly into individual survey
              viewports.
            </p>
          </div>

          {/* Card 3 - Vibrant Purple/Violet Terminal Block */}
          <div className="rounded-none border-4 border-b-8 border-black bg-[#121626] p-8 transition-transform hover:-translate-y-1 col-span-1 sm:col-span-2 lg:col-span-1 border-t-4 border-t-[#9d4edd]">
            <div className="flex h-12 w-12 items-center justify-center rounded-none border-4 border-black bg-[#9d4edd] text-white shadow-[4px_4px_0px_0px_#5a189a]">
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
                  d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0v11.25A2.25 2.25 0 0 1 18 16.5h-2.25m-1.5 0H6.002m0 0a.75.75 0 1 0 0 1.5h12a.75.75 0 1 0 0-1.5h-12Zm0 0v3m12-3v3m-3.75-9H12v3h2.25v-3Zm0 0H16.5V6h-2.25v1.5Zm-5.25 0h2.25V6H9v1.5Z"
                />
              </svg>
            </div>
            <h3 className="mt-6 text-2xl font-bold uppercase tracking-wide text-[#9d4edd] font-['VT323',_monospace]">
              Telemetry Analytics
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">
              Persist anonymous responses securely to database nodes and view live performance
              metrics on your dashboard.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
