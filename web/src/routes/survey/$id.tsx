import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import { getPublicSurvey, submitResponse } from '../../lib/survey-api'

export const Route = createFileRoute('/survey/$id')({
  component: PublicSurveyComponent,
})

function PublicSurveyComponent() {
  const { id } = Route.useParams()

  // State Management
  const [surveyData, setSurveyData] = useState<any>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formSubmitted, setFormSubmitted] = useState(false)
  const [formAnswers, setFormAnswers] = useState<Record<string, any>>({})

  // Theme Fallback States
  const [brandColor, setBrandColor] = useState('#ff007f')
  const [brandLogo, setBrandLogo] = useState('')
  const [brandingBgType, setBrandingBgType] = useState<'preset' | 'custom'>('preset')
  const [brandingBgStyle, setBrandingBgStyle] = useState('dirt')
  const [brandingCustomBgColor, setBrandingCustomBgColor] = useState('#070913')

  // Initialize Data & Safe Parsing
  useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getPublicSurvey(id)
      if (data.success) {
        const rawSurvey = data.survey
        console.log("Fetched survey data:", rawSurvey)

        // 1. DYNAMIC BRANDING INTERCEPTOR LAYER
        let parsedBranding: any = {}
        
        if (typeof rawSurvey.branding === 'string') {
          try {
            parsedBranding = JSON.parse(rawSurvey.branding)
          } catch (e) {
            console.error("Failed parsing inline branding string:", e)
          }
        } else if (rawSurvey.branding && typeof rawSurvey.branding === 'object') {
          // Cleanly catch the pre-parsed object directly from Hono
          parsedBranding = rawSurvey.branding
        }

        // 2. DYNAMIC STATE HYDRATION (No hardcoded fallback strings to block updates)
        setBrandColor(parsedBranding.primaryColor)
        setBrandLogo(parsedBranding.logoUrl || '')
        setBrandingBgType(parsedBranding.bgType || 'preset')
        setBrandingBgStyle(parsedBranding.bgStyle)
        setBrandingCustomBgColor(parsedBranding.customBgColor)
        
        // Safe Parsing Layer for each question's options array string
        const normalizedQuestions = (rawSurvey.questions || []).map((q: any) => {
          let optionsArray = []
          if (typeof q.options === 'string') {
            try {
              optionsArray = JSON.parse(q.options)
            } catch (e) {
              console.error(`Failed parsing option strings on block ${q.id}:`, e)
            }
          } else if (Array.isArray(q.options)) {
            optionsArray = q.options
          }
          return { ...q, options: optionsArray }
        })

        setSurveyData({
          ...rawSurvey,
          questions: normalizedQuestions
        })
      } else {
        setErrorMsg(data.error || "Survey structure not found.")
      }
    } catch (err) {
      setErrorMsg("Failed to establish context connection with database nodes.")
    } finally {
      setIsLoading(false)
    }
  }
  fetchData()
}, [id])

  const handleInputChange = (questionLabel: string, value: string) => {
    setFormAnswers(prev => ({ ...prev, [questionLabel]: value }))
  }

  const handleResponseFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const data = await submitResponse(id, formAnswers)
      if (data.success) {
        setFormSubmitted(true)
      } else {
        alert(data.error || "Submission rejected by server node.")
      }
    } catch (err) {
      alert("Transmission failure across client ports.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Local Preset lookup mapping resolution matrix matched to your dashboard variables
  const CLIENT_BG_MAP: Record<string, string> = {
    dirt: '#111625',
    netherrack: '#210b14',
    endstone: '#150a21',
    deepslate: '#0f172a',
    obsidian: '#070510'
  }

  // Dynamic Background Rule Evaluator
  const resolveViewportBackground = () => {
    if (brandingBgType === 'custom') return brandingCustomBgColor
    return CLIENT_BG_MAP[brandingBgStyle] || '#070913'
  }

  return (

    <div 
      style={{ backgroundColor: `${resolveViewportBackground()}` }} 
      className="relative min-h-screen font-['Share_Tech_Mono',_monospace] selection:bg-[#ff007f] selection:text-white antialiased flex flex-col items-center justify-start px-4 py-16 transition-colors duration-300"
    >
      
      {/* Cybernetic Grid Pattern Overlay matching your app skin */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.015] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)`, 
          backgroundSize: '32px 32px' 
        }} 
      />

      {/* Clean Paper Style Document Canvas Container */}
      <div className="w-full max-w-2xl bg-[#f8fafc] border-2 border-slate-300 p-6 sm:p-10 space-y-8 z-10 shadow-2xl text-slate-900">
        
        {/* State: Loading */}
        {isLoading && (
          <div className="py-20 text-center text-[#ff007f] font-black uppercase tracking-widest text-sm animate-pulse">
            // SYNCING_EXTERNAL_FORM_NODES...
          </div>
        )}

        {/* State: Error */}
        {!isLoading && errorMsg && (
          <div className="py-12 text-center text-red-500 font-bold uppercase text-xs tracking-wider border-2 border-dashed border-red-200 bg-red-50/50 p-4">
            ✕ CHUNK_SYNCHRONIZATION_EXCEPTION: {errorMsg}
          </div>
        )}

        {/* State: Success Response Completed */}
        {!isLoading && !errorMsg && formSubmitted && (
          <div className="py-12 text-center space-y-4 border-2 border-dashed border-slate-200 bg-slate-50 rounded-sm">
            <span className="text-5xl block animate-bounce">✨</span>
            <div>
              <h1 className="text-3xl font-black uppercase tracking-wide text-slate-950 font-['VT323',_monospace]">
                SUBMISSION_SUCCESSFUL
              </h1>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">
                Your data response payload has been written safely to the live record ledger.
              </p>
            </div>
          </div>
        )}

        {/* State: Active Form Content View */}
        {!isLoading && !errorMsg && !formSubmitted && surveyData && (
          <div className="space-y-8">
            
            {/* Survey Header Section */}
            <div className="border-b border-slate-200 pb-6 flex items-center justify-between gap-4">
              <div>
                <span 
                  style={{ color: brandColor, borderColor: `${brandColor}40`, backgroundColor: `${brandColor}0d` }}
                  className="inline-block rounded-sm border px-2 py-0.5 text-[10px] font-black uppercase tracking-widest mb-2"
                >
                  📝 ACTIVE_DOCUMENT_FEED
                </span>
                <h1 className="text-2xl font-black uppercase tracking-wide text-slate-950 font-['Share_Tech_Mono',_monospace]">
                  {surveyData.title}
                </h1>
              </div>
              
              {brandLogo && (
                <div className="bg-white border border-slate-200 p-1 max-w-[90px] shrink-0 shadow-sm rounded-sm">
                  <img src={brandLogo} alt="Brand Token Logo" className="max-h-10 object-contain mx-auto" onError={(e)=>{(e.target as HTMLElement).style.display='none'}} />
                </div>
              )}
            </div>
            
            {/* Active Core Interactive Form */}
            <form onSubmit={handleResponseFormSubmit} className="space-y-6">
              {surveyData.questions.map((q: any, index: number) => (
                <div key={q.id} className="space-y-3 bg-white p-5 border border-slate-200 shadow-sm rounded-sm">
                  
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center rounded-sm bg-slate-100 px-2 py-0.5 text-[9px] font-mono text-slate-500 font-black border border-slate-200">
                      FIELD #{index + 1}
                    </span>
                    <label className="text-sm font-bold text-slate-900">
                      {q.label || "Untitled form parameter declaration"}
                    </label>
                  </div>

                  {/* Type 1: Short Text Field Input */}
                  {q.type === 'short_text' && (
                    <div className="pt-1">
                      <input
                        type="text"
                        required
                        placeholder="Type your text response here..."
                        className="w-full rounded-md border border-slate-200 bg-slate-50/50 p-3 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:bg-white transition-colors"
                        onChange={(e) => handleInputChange(q.label, e.target.value)}
                        onFocus={(e) => e.target.style.borderColor = brandColor}
                        onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                      />
                    </div>
                  )}

                  {/* Type 2: Multiple Choice Array Layout */}
                  {q.type === 'multiple_choice' && (
                    <div className="grid grid-cols-1 gap-2 pt-1">
                      {q.options.map((opt: string) => {
                        const isSelected = formAnswers[q.label] === opt
                        return (
                          <label 
                            key={opt} 
                            style={{ 
                              borderColor: isSelected ? brandColor : '#e2e8f0',
                              backgroundColor: isSelected ? `${brandColor}0d` : 'transparent'
                            }}
                            className="p-3 border rounded-md text-xs font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-3 select-none cursor-pointer"
                          >
                            <input 
                              type="radio" 
                              className="sr-only" 
                              name={q.id} 
                              required
                              checked={isSelected}
                              onChange={() => handleInputChange(q.label, opt)} 
                            />
                            <span 
                              style={{ backgroundColor: isSelected ? brandColor : '#f1f5f9', borderColor: isSelected ? brandColor : '#cbd5e1' }}
                              className="h-3 w-3 border rounded-full inline-block shrink-0 transition-colors" 
                            />
                            {opt}
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {/* Type 3: Linear Rating Grid System */}
                  {q.type === 'rating' && (
                    <div className="pt-1">
                      <div className="flex items-center justify-between gap-2 max-w-sm mx-auto">
                        {['1', '2', '3', '4', '5'].map((num) => {
                          const isSelected = formAnswers[q.label] === num
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleInputChange(q.label, num)}
                              style={{ 
                                backgroundColor: isSelected ? brandColor : '#f8fafc',
                                color: isSelected ? 'white' : '#64748b',
                                borderColor: isSelected ? brandColor : '#e2e8f0'
                              }}
                              className="w-10 h-10 border rounded-md font-black text-sm flex items-center justify-center transition-all cursor-pointer shadow-sm hover:border-slate-300"
                            >
                              {num}
                            </button>
                          )
                        })}
                      </div>
                      <input type="hidden" required value={formAnswers[q.label] || ''} />
                    </div>
                  )}

                </div>
              ))}

              {/* Form Submission Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{ backgroundColor: brandColor }}
                className="w-full text-center rounded-md px-8 py-3.5 text-xs font-black uppercase tracking-widest text-white transition-all hover:brightness-105 active:scale-[0.99] disabled:opacity-40 cursor-pointer shadow-md"
              >
                {isSubmitting ? "TRANSMITTING_PAYLOAD..." : "🚀 SUBMIT_MY_RESPONSES"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}