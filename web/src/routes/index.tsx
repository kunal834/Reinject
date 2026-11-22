import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: HomeComponent,
})

function HomeComponent() {
  return (
    <div className="overflow-hidden bg-[#faf9f6]">
      <section className="relative mx-auto max-w-7xl px-5 pb-16 pt-20 sm:pt-24 lg:px-8 lg:pb-24 lg:pt-28">
        <div className="pointer-events-none absolute right-[-8rem] top-[-10rem] h-[34rem] w-[34rem] rounded-full bg-[#f1b29f]/20 blur-[100px]" />
        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-[#dfdcd3] bg-white px-3 py-1.5 text-xs font-bold text-[#66645f] shadow-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#ed6a43]" />
            Customer insight, without the drag
          </div>
          <h1 className="text-[44px] font-[800] leading-[1.02] tracking-[-0.055em] text-[#191919] sm:text-[64px] lg:text-[78px]">
            Ask better questions.
            <br />
            <span className="text-[#ed6a43]">Build what matters.</span>
          </h1>
          <p className="mx-auto mt-7 max-w-[650px] text-lg leading-8 text-[#6d6a64] sm:text-xl">
            Reinject turns customer responses into clear, actionable insight—so every team can ship with confidence.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              to="/auth/login"
              className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#191919] px-5 py-3.5 text-sm font-bold text-white shadow-[0_8px_24px_rgba(25,25,25,.14)] transition hover:-translate-y-0.5 sm:w-auto"
            >
              Start for free
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </Link>
            <a
              href="#features"
              className="flex w-full items-center justify-center rounded-[10px] border border-[#dedbd2] bg-white px-5 py-3.5 text-sm font-bold text-[#3e3d39] transition hover:border-[#c9c5ba] sm:w-auto"
            >
              See how it works
            </a>
          </div>
        </div>

        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute inset-x-[12%] bottom-[-18px] h-16 rounded-[24px] bg-[#ed6a43]/10 blur-2xl" />
          <div className="relative rounded-[18px] border border-[#dedbd2] bg-[#eeece6] p-2 shadow-[0_24px_70px_rgba(51,47,37,.10)] sm:p-3">
            <div className="overflow-hidden rounded-[12px] border border-[#d9d5cb] bg-white">
              <div className="flex h-11 items-center border-b border-[#ebe8e0] px-4">
                <div className="flex gap-1.5">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d9d5cb]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d9d5cb]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[#d9d5cb]" />
                </div>
                <div className="mx-auto mr-[38px] h-6 w-44 rounded-md bg-[#f5f3ed]" />
              </div>
              <div className="grid min-h-[390px] grid-cols-[185px_1fr] sm:grid-cols-[220px_1fr]">
                <aside className="hidden border-r border-[#ebe8e0] p-5 sm:block">
                  <div className="mb-6 flex items-center gap-2">
                    <span className="h-7 w-7 rounded-lg bg-[#ed6a43]" />
                    <span className="h-2.5 w-20 rounded bg-[#ddd9cf]" />
                  </div>
                  {['Overview', 'Surveys', 'Responses', 'Audience'].map((item, index) => (
                    <div key={item} className={`mb-2 flex h-9 items-center gap-2 rounded-lg px-2 ${index === 1 ? 'bg-[#f2eee8]' : ''}`}>
                      <span className={`h-3.5 w-3.5 rounded-[4px] ${index === 1 ? 'bg-[#ed6a43]' : 'border border-[#cfcbbf]'}`} />
                      <span className="h-2 w-16 rounded bg-[#d7d3c8]" />
                    </div>
                  ))}
                </aside>
                <div className="p-5 sm:p-8">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="h-3 w-24 rounded bg-[#dcd8ce]" />
                      <div className="mt-3 h-7 w-52 rounded-md bg-[#292927]" />
                    </div>
                    <div className="h-9 w-28 rounded-lg bg-[#191919]" />
                  </div>
                  <div className="mt-8 grid grid-cols-3 gap-3">
                    {[
                      ['Responses', '1,284', '+18%'],
                      ['Completion', '86%', '+4%'],
                      ['Avg. score', '8.4', '+0.6'],
                    ].map(([label, value, delta]) => (
                      <div key={label} className="rounded-xl border border-[#ebe8e0] p-3 sm:p-5">
                        <div className="text-[9px] font-bold text-[#9a978f] sm:text-xs">{label}</div>
                        <div className="mt-2 text-xl font-[800] tracking-tight sm:text-3xl">{value}</div>
                        <div className="mt-2 text-[9px] font-bold text-[#4b8270] sm:text-xs">{delta}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-[1.4fr_.6fr] gap-3">
                    <div className="h-36 rounded-xl border border-[#ebe8e0] p-4 sm:h-44">
                      <div className="h-2.5 w-24 rounded bg-[#dcd8ce]" />
                      <div className="mt-7 flex h-24 items-end gap-2 border-b border-[#eeeae2]">
                        {[35, 58, 44, 72, 64, 82, 76, 92, 70, 88, 80, 96].map((height, i) => (
                          <div key={i} className="flex-1 rounded-t-sm bg-[#ed6a43]/70" style={{ height: `${height}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="h-36 rounded-xl border border-[#ebe8e0] p-4 sm:h-44">
                      <div className="h-2.5 w-16 rounded bg-[#dcd8ce]" />
                      <div className="mx-auto mt-5 h-20 w-20 rounded-full border-[12px] border-[#ed6a43] border-r-[#efede7] sm:h-28 sm:w-28" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="features" className="border-y border-[#e7e4dc] bg-[#f5f3ed]">
        <div className="mx-auto grid max-w-7xl gap-px px-5 py-16 sm:grid-cols-3 lg:px-8">
          {[
            ['01', 'Build in minutes', 'Create flexible surveys with text, choice, and rating questions—no engineering required.'],
            ['02', 'Make it yours', 'Add your brand, palette, and logo to give every touchpoint a consistent identity.'],
            ['03', 'Act on responses', 'Track submissions and inspect the signal that matters, all from one clean workspace.'],
          ].map(([number, title, copy]) => (
            <div key={number} className="border-b border-[#ddd9cf] py-8 sm:border-b-0 sm:border-r sm:px-8 first:sm:pl-0 last:sm:border-r-0 last:sm:pr-0">
              <div className="mb-8 flex h-9 w-9 items-center justify-center rounded-full bg-[#ed6a43]/10 text-xs font-[800] text-[#ed6a43]">{number}</div>
              <h2 className="text-xl font-[800] tracking-[-0.035em]">{title}</h2>
              <p className="mt-3 max-w-sm leading-7 text-[#746f66]">{copy}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
