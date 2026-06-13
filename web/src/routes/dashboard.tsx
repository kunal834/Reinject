import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useApp } from '../context/Appcontext'
import { SurveyBuilder } from '../components/SurveyBuilder'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

function DashboardComponent() {
  const { isAuthenticated, isLoading, surveys, fetchSurveys } = useApp()
  const navigate = useNavigate()

  // App Workspace Navigation Layer: 'list' | 'create'
  const [viewMode, setViewMode] = useState<'list' | 'create'>('list')
  
  // Real Database Response Aggregation States
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [isResponsesLoading, setIsResponsesLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Global Session Authentication Security Guard
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/auth/login' })
    }
  }, [isAuthenticated, isLoading, navigate])

  // Initial Sync: Hydrate survey data rows from database
  useEffect(() => {
    if (isAuthenticated) {
      fetchSurveys()
    }
  }, [isAuthenticated])

  // Deep Inspection Lookup: Fetch survey answers on sub-panel click selection
  useEffect(() => {
    if (!selectedSurveyId) {
      setResponses([])
      return
    }
    const loadResponses = async () => {
      setIsResponsesLoading(true)
      try {
        const response = await fetch(`${API_BASE_URL}/api/surveys/surveys/${selectedSurveyId}/responses`, {
          credentials: 'include'
        })
        const data = await response.json()
        if (data.success) setResponses(data.responses)
      } catch (err) {
        console.error("Failed to load survey submission datasets:", err)
      } finally {
        setIsResponsesLoading(false)
      }
    }
    loadResponses()
  }, [selectedSurveyId])

  const handleCopyLink = (id: string) => {
    const publicUrl = `${window.location.origin}/survey/${id}`
    navigator.clipboard.writeText(publicUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="text-slate-400 animate-pulse font-medium">Verifying workspace credentials...</div>
      </div>
    )
  }

  return (
    <div className="space-y-8 py-6">
      
      {/* Dynamic Action Controls Branding Bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-slate-800/60 pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Console Workspace</h1>
          <p className="text-sm text-slate-400 mt-1">
            {viewMode === 'list' 
              ? 'Orchestrate active forms, inspect structural responses, and copy distribution paths.' 
              : 'Compose layout elements, customize visual colors, and drag nodes to reorder keys.'}
          </p>
        </div>
        <div>
          <button
            onClick={() => setViewMode(viewMode === 'list' ? 'create' : 'list')}
            className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-600/10 transition hover:bg-indigo-500 cursor-pointer"
          >
            {viewMode === 'list' ? '➕ Create New Survey' : '📋 View Active Surveys'}
          </button>
        </div>
      </div>

      {/* RENDER FORK 1: ACTIVE FORMS SNAPSHOT LIST */}
      {viewMode === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-semibold text-slate-200">Your Active Surveys ({surveys.length})</h2>
            {surveys.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-800 p-12 text-center text-slate-500">
                <span className="text-3xl block mb-2">📥</span>
                No active survey structures found. Click "Create New Survey" to open the form matrix designer.
              </div>
            ) : (
              <div className="space-y-4">
                {surveys.map((survey) => (
                  <div 
                    key={survey.id}
                    className={`group rounded-2xl border p-5 transition bg-slate-900/20 backdrop-blur-sm ${
                      selectedSurveyId === survey.id ? 'border-indigo-500 shadow-md shadow-indigo-500/5' : 'border-slate-800/80 hover:border-slate-700/80'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-white group-hover:text-indigo-400 transition text-lg">{survey.title}</h3>
                        <p className="text-xs text-slate-500 font-mono mt-0.5">ID: {survey.id}</p>
                      </div>
                      <div className="flex items-center gap-1.5 rounded-full bg-slate-950 px-2.5 py-1 text-xs text-slate-400 border border-slate-800">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: survey.branding?.primaryColor || '#6366f1' }} />
                        <span className="font-mono text-[10px] uppercase">{survey.branding?.primaryColor || '#6366f1'}</span>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap items-center gap-4 text-sm border-t border-slate-800/40 pt-4">
                      <div className="text-slate-400">
                        <strong className="text-white">{survey.questions_count || 0}</strong> question nodes
                      </div>
                      <div className="h-3 w-px bg-slate-800" />
                      <div className="text-slate-400">
                        <strong className="text-indigo-400">{survey.responses_count || 0}</strong> submissions
                      </div>
                      <div className="ml-auto flex items-center gap-2">
                        <button
                          onClick={() => handleCopyLink(survey.id)}
                          className="rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition cursor-pointer"
                        >
                          {copiedId === survey.id ? '✅ Link Copied!' : '🔗 Copy Link'}
                        </button>
                        <button
                          onClick={() => setSelectedSurveyId(survey.id === selectedSurveyId ? null : survey.id)}
                          className={`rounded-lg px-3 py-1.5 text-xs font-medium transition cursor-pointer ${
                            selectedSurveyId === survey.id ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
                          }`}
                        >
                          {selectedSurveyId === survey.id ? '📉 Close Data' : '📊 View Responses'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Side Context Inspector Row Box */}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-6 backdrop-blur-md min-h-[300px]">
            {!selectedSurveyId ? (
              <div className="flex h-[250px] flex-col items-center justify-center text-center p-4">
                <span className="text-3xl mb-3">📈</span>
                <h3 className="text-sm font-semibold text-slate-300">No Target Loaded</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-[200px]">Click "View Responses" to render server-side response schemas.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Inspection Node</span>
                  <h3 className="text-md font-bold text-white truncate mt-0.5">{surveys.find(s=>s.id === selectedSurveyId)?.title}</h3>
                  <p className="text-xs text-slate-500 font-mono">{responses.length} submissions loaded</p>
                </div>

                <div className="border-t border-slate-800/80 pt-4 space-y-3 max-h-[450px] overflow-y-auto pr-1">
                  {isResponsesLoading ? (
                    <p className="text-xs text-slate-500 text-center py-6 animate-pulse">Running collection lookup...</p>
                  ) : responses.length === 0 ? (
                    <p className="text-xs text-slate-500 text-center py-6">No responses recorded yet.</p>
                  ) : (
                    responses.map((res) => (
                      <div key={res.id} className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-3.5 space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-900 pb-1.5 text-[10px]">
                          <span className="font-mono text-slate-500">{res.id.slice(0,8)}...</span>
                          <span className="text-slate-400">{new Date(res.created_at).toLocaleDateString()}</span>
                        </div>
                        <div className="space-y-1.5">
                          {Object.entries(res.answers).map(([key, val]) => (
                            <div key={key} className="text-xs leading-relaxed">
                              <span className="text-slate-500 font-medium">{key}:</span>{' '}
                              <span className="text-slate-300">{String(val)}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* RENDER FORK 2: EXTRACTED FORM BUILDER LAYOUT */
        <SurveyBuilder onCreateSuccess={() => setViewMode('list')} />
      )}
    </div>
  )
}