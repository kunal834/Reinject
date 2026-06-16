import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { useApp } from '../context/Appcontext'
import { SurveyBuilder } from '../components/SurveyBuilder'

export const Route = createFileRoute('/dashboard')({
  component: DashboardComponent,
})

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

const PRESET_THEMES = [
  { name: '🌌 Neon Cyan', bg: '#070913', pane: '#121626', accent: '#00f5ff', text: '#00f5ff' },
  { name: '🔮 Laser Magenta', bg: '#0b0514', pane: '#180c24', accent: '#ff007f', text: '#ff007f' },
  { name: '🪐 Orchid Violet', bg: '#06030c', pane: '#110a1c', accent: '#9d4edd', text: '#9d4edd' },
  { name: '🐦 Obsidian Slate', bg: '#020408', pane: '#0b0f17', accent: '#475569', text: '#e2e8f0' }
]

export const CLIENT_BG_MAP: Record<string, string> = {
  dirt: '#111625',
  netherrack: '#210b14',
  endstone: '#150a21',
  deepslate: '#0f172a',
  obsidian: '#070510'
}

function DashboardComponent() {
  const { isAuthenticated, isLoading, surveys, fetchSurveys } = useApp()
  const navigate = useNavigate()

  const [viewMode, setViewMode] = useState<'list' | 'create'>('list')  //TypeScript generic type parameter
  const [selectedSurveyId, setSelectedSurveyId] = useState<string | null>(null)
  const [responses, setResponses] = useState<any[]>([])
  const [isResponsesLoading, setIsResponsesLoading] = useState(false)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  const [previewSurvey, setPreviewSurvey] = useState<any | null>(null)
  const [activeTheme, setActiveTheme] = useState(PRESET_THEMES[0])

  // Redirect to login if not authenticated, with a suspense loader during the check
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/auth/login' })
    }
  }, [isAuthenticated, isLoading, navigate])
  
  // Fetching list of surveys on initial load and whenever the view mode changes (to refresh after creation)
  useEffect(() => {
    if (isAuthenticated) {
      fetchSurveys()
    }
  }, [isAuthenticated, viewMode]) // Refetch on view switch to update listings
  
  // No surveys Selected thats why no preview
  // this useeffect is return data refinery assembly line. like questions , options and all  
  useEffect(() => {
    if (!selectedSurveyId) {
      setResponses([])
      setPreviewSurvey(null)
      return
    }

    const current = surveys.find(s => s.id === selectedSurveyId) // selecting current survey selected through an array of surveys
    console.log("Selected survey for preview:", current) // Debug log to verify survey data structure


    // cleaning up data for safe rendering in the preview inspector, with robust parsing to handle any inconsistencies in stored formats (stringified vs direct objects/arrays)
    if (current) {
     
      let questionsArr = []
      // default branding values to ensure the preview always has a valid theme, even if the stored branding data is malformed or missing fields
      let parsedBranding = { primaryColor: '#ff007f', logoUrl: '', bgType: 'preset', bgStyle: 'dirt', customBgColor: '#070913' }
        console.log("Raw questions data:", current.questions) // Debug log to check raw questions data
      try {

        // data Sanitizer 
        if (typeof current.questions === 'string') {// just for a s safety 
          questionsArr = current.questions.includes("[object Object]") ? [] : JSON.parse(current.questions)
        } else if (Array.isArray(current.questions)) {// expected this will run every time 
          questionsArr = current.questions
        }
      

        // Mapping all the questions from questions array that we ar getting from input 
        questionsArr = questionsArr.map((q: any) => {
          let options = []
          if (typeof q.options === 'string') {
            options = q.options.includes("[object Object]") ? [] : JSON.parse(q.options)
          } else if (Array.isArray(q.options)) {
            options = q.options        // for option based questions 
          }
          return { ...q, options: Array.isArray(options) ? options : [] }
        })
      } catch (e) {
        console.error("Safe parser error on questions:", e)
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
        console.error("Safe parser error on branding:", e)
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
        console.log("response question data" , data)
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

  // Resolves the exact dynamic live preview color inside your dashboard dashboard column
  const resolveInspectorBg = (branding: any) => {
    if (!branding) return '#070913'
    if (branding.bgType === 'custom') return branding.customBgColor || '#070913'
    return CLIENT_BG_MAP[branding.bgStyle] || '#111625'
  }

  return (
    <div 
      style={{ backgroundColor: activeTheme.bg }} 
      className="relative min-h-screen text-[#e2e8f0] font-['Share_Tech_Mono',_monospace] antialiased p-6 sm:p-8 transition-colors duration-300"
    >
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header Block Container */}
        <div style={{ backgroundColor: activeTheme.pane }} className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between border border-slate-800 p-6 rounded-none">
          <div>
            <span className="inline-block rounded-none border border-[#ff007f]/40 bg-[#ff007f]/5 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#ff007f] mb-2">
              ✨ CORE_WORKSPACE_ACTIVE
            </span>
            <h1 className="text-4xl font-black uppercase text-white font-['VT323',_monospace]">
              CONSOLE_OPERATIONS_DESK
            </h1>
            
            <div className="mt-4 flex flex-wrap items-center gap-2 bg-black/40 p-2 border border-slate-800 max-w-xl rounded-md">
              {PRESET_THEMES.map((theme) => (
                <button
                  key={theme.name}
                  type="button"
                  onClick={() => setActiveTheme(theme)}
                  style={{ borderColor: activeTheme.name === theme.name ? theme.accent : 'transparent' }}
                  className="px-2 py-1 text-[10px] font-black uppercase bg-slate-950/60 border rounded-md text-zinc-400 hover:text-white transition-all cursor-pointer"
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
              className={`w-full sm:w-auto text-center rounded-none border-4 border-b-8 border-black px-6 py-3 text-xs font-black uppercase tracking-widest transition-all active:border-b-4 active:translate-y-1 cursor-pointer ${
                viewMode === 'list' ? 'bg-[#39ff14] text-black' : 'bg-[#ffaa00] text-black'
              }`}
            >
              {viewMode === 'list' ? '➕ CREATE_NEW_SURVEY' : '📋 VIEW_ACTIVE_SCHEMA'}
            </button>
          </div>
        </div>

        {viewMode === 'list' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            <div className="xl:col-span-2 space-y-4">
              <h2 style={{ color: activeTheme.text }} className="text-2xl font-black uppercase tracking-widest font-['VT323',_monospace]">
                ACTIVE_SURVEY_NODES ({surveys.length})
              </h2>
              
              {surveys.length === 0 ? (
                <div style={{ backgroundColor: activeTheme.pane }} className="border border-dashed border-slate-800 p-12 text-center text-slate-500">
                  <p className="font-bold uppercase text-xs text-[#ff007f]">// No active surveys found.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {surveys.map((survey) => (
                    <div 
                      key={survey.id}
                      style={{ backgroundColor: activeTheme.pane }}
                      className={`border-4 p-5 transition-all ${
                        selectedSurveyId === survey.id ? 'border-[#00f5ff] border-b-8 shadow-[4px_4px_0px_0px_#008b94]' : 'border-black border-b-8'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="font-black uppercase text-white text-lg">{survey.title}</h3>
                          <p className="text-[10px] text-slate-400 font-mono mt-1 bg-black/40 inline-block px-2 py-0.5 border border-slate-900 rounded-md">ID: {survey.id.slice(0, 18)}...</p>
                        </div>
                      </div>

                      <div className="mt-6 flex flex-wrap items-center gap-4 text-xs border-t border-slate-900 pt-4 font-bold">
                        <div className="text-slate-300"><strong className="text-[#00f5ff] bg-black/30 px-1.5 py-0.5 border border-slate-900 mr-1 rounded-md">{survey.questions_count || 0}</strong> elements</div>
                        <div className="text-slate-300"><strong className="text-[#39ff14] bg-black/30 px-1.5 py-0.5 border border-slate-900 mr-1 rounded-md">{survey.responses_count || 0}</strong> records</div>
                        
                        <div className="ml-auto flex items-center gap-3">
                          <button type="button" onClick={() => handleCopyLink(survey.id)} className={`border-2 border-b-4 border-black px-3 py-1.5 text-[11px] font-black uppercase ${copiedId === survey.id ? 'bg-[#39ff14] text-black' : 'bg-slate-950 text-[#00f5ff] border-slate-800'}`}>
                            {copiedId === survey.id ? '✅ COPIED' : '🔗 SYNC_URL'}
                          </button>
                          <button type="button" onClick={() => setSelectedSurveyId(survey.id === selectedSurveyId ? null : survey.id)} className={`border-2 border-b-4 border-black px-3 py-1.5 text-[11px] font-black uppercase ${selectedSurveyId === survey.id ? 'bg-[#ff007f] text-white' : 'bg-[#ffaa00] text-black'}`}>
                            {selectedSurveyId === survey.id ? '📉 CLOSE' : '📊 INSPECT'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Dashboard Telemetry Ledger */}
            <div className="space-y-6">
              <div style={{ backgroundColor: activeTheme.pane }} className="border border-slate-800 p-6 min-h-[200px]">
                {!selectedSurveyId ? (
                  <div className="flex h-[140px] flex-col items-center justify-center text-center border-2 border-dashed border-slate-900 rounded-md">
                    <p className="text-[10px] text-slate-500 font-bold uppercase p-4">// Select "Inspect" to view telemetry logs</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <span className="text-[10px] font-bold text-[#ff007f] uppercase tracking-widest bg-[#ff007f]/5 px-2 py-0.5 border border-[#ff007f]/20 shadow-[0_0_10px_rgba(255,0,127,0.05)]">Incoming_Telemetry_Log</span>
                    <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 custom-scrollbar">
                      {isResponsesLoading ? (
                        <p className="text-xs text-center py-4 animate-pulse text-slate-500">// Interrogating database...</p>
                      ) : responses.length === 0 ? (
                        <p className="text-xs text-center py-4 text-slate-500">// No entries found on this node.</p>
                      ) : (
                        responses.map((res) => (
                          <div key={res.id} className="border border-slate-800 bg-black/40 p-2.5 space-y-2 text-xs rounded-md">
                            <div className="text-[10px] text-[#00f5ff] font-bold border-b border-slate-900 pb-1">RECORD_NODE_HASH #{res.id.slice(0,8).toUpperCase()}</div>
                            {Object.entries(res.answers).map(([k, v]) => (
                              <div key={k} className="font-mono text-slate-300"><span className="text-[#ffff55]">{k}:</span> {String(v)}</div>
                            ))}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* DYNAMIC BACKEND INSPECTOR LIVE VIEW */}
              {previewSurvey && (
                <div 
                  style={{ backgroundColor: resolveInspectorBg(previewSurvey.parsedBranding) }} 
                  className="rounded-none border-4 border-b-8 border-black p-4 space-y-3 shadow-2xl relative transition-all duration-300"
                >
                  <div className="relative z-10 bg-[#f8fafc] border border-slate-200 p-4 space-y-3 rounded-md text-slate-900">
                    <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                      {previewSurvey.parsedBranding?.logoUrl ? (
                        <img src={previewSurvey.parsedBranding.logoUrl} alt="Logo core" className="h-4 max-w-[75px] object-contain" onError={(e)=>{(e.target as HTMLElement).style.display='none'}} />
                      ) : <span className="text-xs">🏢</span>}
                      <h3 className="text-xs font-black uppercase text-slate-950 truncate">{previewSurvey.title}</h3>
                    </div>
                    
                    <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1 custom-scrollbar">
                      {previewSurvey.parsedQuestions?.map((q: any, idx: number) => (
                        <div key={q.id} className="bg-white p-3 border border-slate-200 space-y-1.5 rounded-sm shadow-sm">
                          <p className="text-xs font-bold text-slate-900">{idx + 1}. {q.label}</p>
                          {q.type === 'short_text' && <div className="h-6 bg-slate-50 border border-slate-200 w-full rounded-sm" />}
                          
                          {q.type === 'multiple_choice' && (
                            <div className="space-y-1">
                              {q.options?.map((o: string) => (
                                <div key={o} className="text-[9px] bg-slate-50 border border-slate-200 p-1 text-slate-600 rounded-xs truncate">▪️ {o}</div>
                              ))}
                            </div>
                          )}
                          
                          {q.type === 'rating' && (
                            <div className="flex gap-1">
                              {['1','2','3','4','5'].map(n => (
                                <span key={n} style={{ borderColor: previewSurvey.parsedBranding?.primaryColor }} className="w-4 h-4 bg-slate-50 border text-[8px] font-black flex items-center justify-center text-slate-500 rounded-sm">{n}</span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                    <button type="button" disabled style={{ backgroundColor: previewSurvey.parsedBranding?.primaryColor || '#ff007f' }} className="w-full py-2 rounded-md text-xs font-black uppercase text-white tracking-widest opacity-90 shadow-md">LIVE_PREVIEW_ACTIVE</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ backgroundColor: activeTheme.pane }} className="border border-slate-800 p-6 rounded-none">
            <SurveyBuilder onCreateSuccess={() => setViewMode('list')} />
          </div>
        )}
      </div>
    </div>
  )
}