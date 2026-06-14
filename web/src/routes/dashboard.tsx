import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useApp } from '../context/Appcontext'
import { SurveyBuilder } from '../components/SurveyBuilder'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8787'

// System Admin View Themes
const PRESET_THEMES = [
  { name: '🌳 Overworld Green', bg: '#2c1b12', pane: '#1a110b', accent: '#5c8e32', text: '#ffff55' },
  { name: '🔥 Nether Crimson', bg: '#2a0e10', pane: '#190506', accent: '#ff5555', text: '#ffaa00' },
  { name: '🔮 End Purple', bg: '#16121e', pane: '#0d0914', accent: '#aa00aa', text: '#55ffff' },
  { name: '🧱 Deepslate Dark', bg: '#1b1b1b', pane: '#121212', accent: '#4a5153', text: '#ffffff' }
]

// Map backgrounds for client-side theme previewing
export const CLIENT_BG_MAP: Record<string, string> = {
  dirt: '#2c1b12',
  netherrack: '#2a0e10',
  endstone: '#16121e',
  deepslate: '#1b1b1b',
  obsidian: '#100c18'
}

function DashboardComponent() {
  const { isAuthenticated, isLoading, surveys, fetchSurveys } = useApp()
  const navigate = useNavigate()

  const [viewMode, setViewMode] = useState<'list' | 'create'>('list')
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [isResponsesLoading, setIsResponsesLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Interactive Live Preview States
  const [previewSurvey, setPreviewSurvey] = useState<any | null>(null)
  const [activeTheme, setActiveTheme] = useState(PRESET_THEMES[0])

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/auth/login' })
    }
  }, [isAuthenticated, isLoading, navigate])

  useEffect(() => {
    if (isAuthenticated) {
      fetchSurveys()
    }
  }, [isAuthenticated])

  useEffect(() => {
    if (!selectedSurveyId) {
      setResponses([])
      setPreviewSurvey(null)
      return
    }

    const current = surveys.find(s => s.id === selectedSurveyId)
    if (current) {
      let questionsArr = []
      let parsedBranding = { primaryColor: '#5c8e32', logoUrl: '', bgStyle: 'dirt' }
      
      try {
        if (typeof current.questions === 'string') {
          if (current.questions.includes("[object Object]")) {
            questionsArr = []
          } else {
            questionsArr = JSON.parse(current.questions)
          }
        } else if (Array.isArray(current.questions)) {
          questionsArr = current.questions
        } else {
          questionsArr = []
        }

        questionsArr = questionsArr.map((q: any) => {
          let options = []
          if (typeof q.options === 'string') {
            options = q.options.includes("[object Object]") ? [] : JSON.parse(q.options)
          } else if (Array.isArray(q.options)) {
            options = q.options
          }
          return { ...q, options: Array.isArray(options) ? options : [] }
        })
      } catch (e) {
        console.error("Safe parser error on question items:", e)
        questionsArr = []
      }

      try {
        if (typeof current.branding === 'string') {
          if (!current.branding.includes("[object Object]")) {
            parsedBranding = { ...parsedBranding, ...JSON.parse(current.branding) }
          }
        } else if (current.branding && typeof current.branding === 'object') {
          parsedBranding = { ...parsedBranding, ...current.branding }
        }
      } catch (e) {
        console.error("Safe parser error on branding items:", e)
      }

      setPreviewSurvey({ ...current, parsedQuestions: questionsArr, parsedBranding })
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
        console.error("Failed to load responses:", err)
      } finally {
        setIsResponsesLoading(false)
      }
    }
    loadResponses()
  }, [selectedSurveyId, surveys])

  const handleCopyLink = (id: string) => {
    const publicUrl = `${window.location.origin}/survey/${id}`
    navigator.clipboard.writeText(publicUrl)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const safeGetBgStyle = (surveyItem: any) => {
    if (!surveyItem) return 'dirt'
    if (typeof surveyItem.branding === 'string') {
      try {
        return JSON.parse(surveyItem.branding).bgStyle || 'dirt'
      } catch { return 'dirt' }
    }
    return surveyItem.branding?.bgStyle || 'dirt'
  }

  if (isLoading || !isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#2c1b12] font-mono">
        <div className="text-[#ffaa00] animate-pulse font-bold uppercase tracking-wider text-xl [text-shadow:2px_2px_0px_#141414]">
          ⛏️ Verifying workspace credentials...
        </div>
      </div>
    )
  }

  return (
    <div 
      style={{ backgroundColor: activeTheme.bg }} 
      className="relative min-h-screen text-[#f0f0f0] font-mono selection:bg-[#5c8e32] selection:text-white antialiased p-6 sm:p-8 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block */}
        <div style={{ backgroundColor: activeTheme.pane }} className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border-b-8 border-dashed border-black pb-8 p-6 border-4">
          <div>
            <span className="inline-block rounded-none border-2 border-black bg-[#1a0c24] px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-[#ffff55] ring-2 ring-[#4a0e4e] mb-2">
              👑 Operator Mode
            </span>
            <h1 className="text-3xl font-black uppercase tracking-wide text-white [text-shadow:3px_3px_0px_#141414]">
              Console Workspace
            </h1>
            
            <div className="mt-4 flex flex-wrap items-center gap-2 bg-black/40 p-2 border-2 border-black max-w-xl">
              <span className="text-[10px] font-bold text-zinc-400 uppercase mr-1">Admin Panel Accent:</span>
              {PRESET_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => setActiveTheme(theme)}
                  style={{ borderColor: activeTheme.name === theme.name ? theme.accent : 'transparent' }}
                  className="px-2 py-1 text-[10px] font-black uppercase bg-black/60 border-2 text-zinc-300 hover:text-white transition-all cursor-pointer"
                >
                  {theme.name.split(' ')[1]}
                </button>
              ))}
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setViewMode(viewMode === 'list' ? 'create' : 'list')}
              className={`w-full sm:w-auto text-center rounded-none border-4 border-b-8 border-black px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all active:border-b-4 active:translate-y-1 cursor-pointer ${
                viewMode === 'list' ? 'bg-[#5c8e32] text-white hover:bg-[#4d7828]' : 'bg-[#ffaa00] text-black hover:bg-[#df9400]'
              }`}
            >
              {viewMode === 'list' ? '➕ Create New Survey' : '📋 View Active Surveys'}
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            
            {/* Active Survey Loops */}
            <div className="xl:col-span-2 space-y-4">
              <h2 style={{ color: activeTheme.text }} className="text-xl font-black uppercase tracking-wide [text-shadow:2px_2px_0px_#141414]">
                Your Active Surveys ({surveys.length})
              </h2>
              
              {surveys.length === 0 ? (
                <div style={{ backgroundColor: activeTheme.pane }} className="rounded-none border-4 border-dashed border-black p-12 text-center text-[#aaaaaa]">
                  <span className="text-4xl block mb-4">📥</span>
                  <p className="font-bold uppercase tracking-wider text-sm text-[#e0a96d]">No active survey structures found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {surveys.map((survey) => (
                    <div 
                      key={survey.id}
                      style={{ backgroundColor: activeTheme.pane }}
                      className={`rounded-none border-4 p-5 transition-all ${
                        selectedSurveyId === survey.id ? 'border-[#ffff55] border-b-8 shadow-[4px_4px_0px_0px_#aa5500]' : 'border-black border-b-8 hover:-translate-y-0.5'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-black uppercase tracking-wide text-white text-lg [text-shadow:2px_2px_0px_#141414]">{survey.title}</h3>
                          <p className="text-[10px] text-[#aaaaaa] font-mono mt-1 bg-black/40 inline-block px-2 py-0.5 border border-zinc-800">ID: {survey.id}</p>
                        </div>
                        <div className="flex items-center gap-2 rounded-none bg-black/60 px-3 py-1 border-2 border-black">
                          <span className="font-mono text-[9px] uppercase text-zinc-400 font-black">
                            Texture: {safeGetBgStyle(survey)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs border-t-4 border-dashed border-black pt-4 font-bold">
                        <div className="text-[#e0a96d]"><strong className="text-white bg-black/30 px-1.5 py-0.5 border border-zinc-800 mr-1">{survey.questions_count || 0}</strong> questions</div>
                        <div className="text-[#55ff55]"><strong className="text-white bg-black/30 px-1.5 py-0.5 border border-zinc-800 mr-1">{survey.responses_count || 0}</strong> answers</div>
                        
                        <div className="ml-auto flex items-center gap-3">
                          <button type="button" onClick={() => handleCopyLink(survey.id)} className={`rounded-none border-2 border-b-4 border-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${copiedId === survey.id ? 'bg-[#55ff55] text-black' : 'bg-[#242c30] text-[#55ffff]'}`}>
                            {copiedId === survey.id ? '✅ Copied!' : '🔗 Copy Link'}
                          </button>
                          <button type="button" onClick={() => setSelectedSurveyId(survey.id === selectedSurveyId ? null : survey.id)} className={`rounded-none border-2 border-b-4 border-black px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider ${selectedSurveyId === survey.id ? 'bg-[#ff5555] text-white' : 'bg-[#ffaa00] text-black'}`}>
                            {selectedSurveyId === survey.id ? '📉 Close' : '📊 Inspect'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Ledger Metrics + Sandbox Live Canvas */}
            <div className="space-y-6">
              <div style={{ backgroundColor: activeTheme.pane }} className="rounded-none border-4 border-b-8 border-black p-6 min-h-[200px]">
                {!selectedSurveyId ? (
                  <div className="flex h-[140px] flex-col items-center justify-center text-center border-4 border-dashed border-black">
                    <p className="text-xs text-[#aaaaaa] font-bold uppercase p-2">Select "Inspect" to sync the layout preview matrix</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-[#ff5555] uppercase tracking-widest bg-black/40 px-2 py-0.5 border border-zinc-800">Ledger Metrics</span>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto custom-scrollbar">
                      {isResponsesLoading ? (
                        <p className="text-xs text-center py-4 animate-pulse">Mining logs...</p>
                      ) : responses.length === 0 ? (
                        <p className="text-xs text-center py-4">No data nodes committed.</p>
                      ) : (
                        responses.map((res) => (
                          <div key={res.id} className="border-2 border-black bg-black/30 p-2.5 space-y-2 text-xs">
                            <div className="text-[10px] text-[#55ffff] font-bold border-b border-black pb-1">ID #{res.id.slice(0,8)}</div>
                            {Object.entries(res.answers).map(([k, v]) => (
                              <div key={k} className="font-mono"><span className="text-[#ffff55]">{k}:</span> {String(v)}</div>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* LIVE SANDBOX CANVAS */}
              {previewSurvey && (
                <div 
                  style={{ backgroundColor: CLIENT_BG_MAP[previewSurvey.parsedBranding?.bgStyle || 'dirt'] }} 
                  className="rounded-none border-4 border-b-8 border-black p-6 space-y-4 transition-colors duration-300 shadow-2xl relative"
                >
                  <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
                  
                  <div className="relative z-10 space-y-4">
                    <div className="flex items-center justify-between border-b-4 border-dashed border-black pb-2">
                      <span className="text-[10px] font-black text-[#55ff55] bg-black px-2 py-0.5 border border-zinc-800 uppercase">
                        🖥️ Live View: {previewSurvey.parsedBranding?.bgStyle || 'dirt'}
                      </span>
                    </div>

                    <div className="bg-[#1a110b] border-4 border-black p-4 space-y-4">
                      <div className="flex items-center gap-3 border-b border-zinc-800 pb-2">
                        {previewSurvey.parsedBranding?.logoUrl ? (
                          <img src={previewSurvey.parsedBranding.logoUrl} alt="Logo asset" className="h-5 max-w-[80px] object-contain" onError={(e)=>{(e.target as HTMLElement).style.display='none'}} />
                        ) : <span>🏢</span>}
                        <h3 className="text-sm font-black uppercase text-white tracking-wide truncate">{previewSurvey.title}</h3>
                      </div>
                      
                      <div className="space-y-4 max-h-[300px] overflow-y-auto pr-1">
                        {previewSurvey.parsedQuestions?.map((q: any, idx: number) => (
                          <div key={q.id} className="bg-black/30 p-3 border-2 border-black space-y-2">
                            <p className="text-xs font-bold text-[#ffff55]">{idx + 1}. {q.label || 'Empty Label String'}</p>
                            {q.type === 'short_text' && <input type="text" disabled placeholder="Text value..." className="w-full bg-black/60 border border-zinc-800 text-[11px] p-2 cursor-not-allowed" />}
                            
                            {q.type === 'multiple_choice' && (
                              <div className="space-y-1">
                                {q.options?.map((o: string) => (
                                  <div key={o} className="text-[10px] bg-black/40 border border-zinc-900 p-1.5 text-zinc-400 font-mono">▪️ {o}</div>
                                ))}
                              </div>
                            )}
                            
                            {q.type === 'rating' && (
                              <div className="flex gap-1 pt-1">
                                {['1','2','3','4','5'].map(n => (
                                  <span key={n} className="w-5 h-5 bg-[#302020] border border-black text-[9px] font-bold flex items-center justify-center text-[#ff5555]">{n}</span>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                      <button type="button" disabled style={{ backgroundColor: previewSurvey.parsedBranding?.primaryColor || '#5c8e32' }} className="w-full py-2 border-2 border-black text-xs font-black uppercase text-white opacity-80 cursor-not-allowed">Submit Answers</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: activeTheme.pane }} className="rounded-none border-4 border-b-8 border-black p-6">
            <SurveyBuilder onCreateSuccess={() => setViewMode('list')} />
          </div>
        )}
      </div>
    </div>
  )
}