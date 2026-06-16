import { createRootRoute, Outlet } from '@tanstack/react-router'
import { Footer } from '../components/Footer'
import { Navbar } from '../components/Navbar'

export const Route = createRootRoute({
  component: () => (
    <div className="flex min-h-screen flex-col bg-[#0b0f19] text-slate-100 font-sans antialiased">
      {/* Persistent global header navbar */}
      <Navbar />

      {/* Primary viewport shell for current route segment mapping */}
      <main className="flex-1 [flex-grow:1] [flex-shrink:0] [flex-basis:auto]">
        <Outlet />
      </main>

      {/* Persistent global footer */}
      <Footer />
    </div>
  ),
})
