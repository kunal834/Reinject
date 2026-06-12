import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: Home,
})

function Home() {
  return (
    <main style={{ padding: 24, fontFamily: 'system-ui, sans-serif' }}>
      <h1>Survey Builder — starter</h1>
      <p>
        Replace this with the app. See <code>README.md</code> at the repo root.
      </p>
    </main>
  )
}
