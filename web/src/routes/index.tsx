import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="relative isolate overflow-hidden">
      {/* Ambient Radial Mesh Background */}
      <div className="absolute top-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="absolute top-1/3 left-1/4 -z-10 h-96 w-96 rounded-full bg-purple-600/10 blur-3xl" />

      {/* Hero Visual Block */}
      <section className="mx-auto max-w-7xl px-4 pt-20 pb-16 text-center sm:px-6 lg:px-8 lg:pt-32">
        <span className="inline-flex items-center rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-400 ring-1 ring-inset ring-indigo-500/20">
          Introducing Personal Branding Engines
        </span>
        <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl">
          Build Beautiful, Fully Branded{' '}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Surveys in Seconds
          </span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-400">
          Compose interactive queries, orchestrate logic trees, and customize standard visual forms with custom brand schemas. Secure fast, structured responses seamlessly.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            to="/auth/login"
            className="rounded-xl bg-indigo-600 px-6 py-3 text-md font-semibold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            Create a Survey
          </Link>
          <a href="#features" className="text-md font-semibold leading-6 text-slate-300 transition hover:text-white">
            Explore Features <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* Feature Highlighting Grid Section */}
      <section id="features" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 border-t border-slate-900">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Engineered for Complete Ownership</h2>
          <p className="mt-4 text-slate-400">Everything you need to compile, configure, and analyze surveys under your own visual umbrella.</p>
        </div>

        <div className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          
          {/* Card 1 */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-xl text-indigo-400">🛠️</div>
            <h3 className="mt-4 text-lg font-semibold text-white">Visual Layout Builder</h3>
            <p className="mt-2 text-sm text-slate-400">Compose short text, structural multiple choice, or linear numerical rating blocks dynamically.</p>
          </div>

          {/* Card 2 */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10 text-xl text-purple-400">🎨</div>
            <h3 className="mt-4 text-lg font-semibold text-white">Custom Brand Tokens</h3>
            <p className="mt-2 text-sm text-slate-400">Inject custom color definitions and structural logos directly into individual survey viewports.</p>
          </div>

          {/* Card 3 */}
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/40 p-6 backdrop-blur-sm col-span-1 sm:col-span-2 lg:col-span-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-pink-500/10 text-xl text-pink-400">⚡</div>
            <h3 className="mt-4 text-lg font-semibold text-white">Server-side Analytics</h3>
            <p className="mt-2 text-sm text-slate-400">Persist anonymous responses securely to database nodes and view live performance metrics on your dashboard.</p>
          </div>

        </div>
      </section>
    </div>
  )
}