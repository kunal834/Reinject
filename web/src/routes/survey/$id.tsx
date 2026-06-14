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

  // Theme Fallback states (including the new background configuration states)
  const [brandColor, setBrandColor] = useState('#5c8e32')
  const [brandLogo, setBrandLogo] = useState('')
  const [brandingBgType, setBrandingBgType] = useState<'preset' | 'custom'>('preset')
  const [brandingBgStyle, setBrandingBgStyle] = useState('dirt')
  const [brandingCustomBgColor, setBrandingCustomBgColor] = useState('#2c1b12')

  // Initialize Data & Safe Parsing
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPublicSurvey(id)
        if (data.success) {
          const rawSurvey = data.survey

          // Safe Parsing Layer for the JSON SQLite branding string fields
          let parsedBranding = { primaryColor: '#5c8e32', logoUrl: '', bgType: 'preset', bgStyle: 'dirt', customBgColor: '#2c1b12' }
          if (typeof rawSurvey.branding === 'string') {
            try {
              parsedBranding = JSON.parse(rawSurvey.branding)
            } catch (e) {
              console.error("Failed to parse branding metadata string:", e)
            }
          } else if (rawSurvey.branding) {
            parsedBranding = rawSurvey.branding
          }

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

          // Hydrate localized state engines cleanly
          setBrandColor(parsedBranding.primaryColor || '#5c8e32')
          setBrandLogo(parsedBranding.logoUrl || '')
          setBrandingBgType(parsedBranding.bgType || 'preset')
          setBrandingBgStyle(parsedBranding.bgStyle || 'dirt')
          setBrandingCustomBgColor(parsedBranding.customBgColor || '#2c1b12')
          
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

  // Local Preset lookup mapping resolution matrix
  const CLIENT_BG_MAP: Record<string, string> = {
    dirt: '#2c1b12',
    netherrack: '#2a0e10',
    endstone: '#16121e',
    deepslate: '#1b1b1b',
    obsidian: '#100c18'
  }

  // Dynamic Background Rule Evaluator
  const resolveViewportBackground = () => {
    if (brandingBgType === 'custom') return brandingCustomBgColor
    return CLIENT_BG_MAP[brandingBgStyle] || '#2c1b12'
  }

  return (
    <div 
      style={{ backgroundColor: resolveViewportBackground() }} 
      className="relative min-h-screen text-[#f0f0f0] font-mono selection:bg-[#5c8e32] selection:text-white antialiased flex flex-col items-center justify-start px-4 py-16 transition-colors duration-300"
    >
      
      {/* Retro Voxel Grid Pattern Overlay */}
      <div 
        className="absolute inset-0 -z-10 opacity-[0.04] pointer-events-none" 
        style={{ 
          backgroundImage: `linear-gradient(#fff 2px, transparent 2px), linear-gradient(90deg, #fff 2px, transparent 2px)`, 
          backgroundSize: '24px 24px' 
        }} 
      />

      <div className="w-full max-w-2xl bg-[#1a110b] border-4 border-b-8 border-black p-6 sm:p-10 space-y-8 z-10 shadow-2xl">
        
        {/* State: Loading */}
        {isLoading && (
          <div className="py-20 text-center text-[#ffaa00] font-black uppercase tracking-wider text-lg animate-pulse [text-shadow:2px_2px_0px_#000]">
            ⛏️ Mining Survey Nodes...
          </div>
        )}

        {/* State: Error */}
        {!isLoading && errorMsg && (
          <div className="py-12 text-center text-[#ff5555] font-black uppercase tracking-widest border-4 border-dashed border-[#141414] bg-black/20 p-4">
            ❌ Chunk Error: {errorMsg}
          </div>
        )}

        {/* State: Success Response Completed */}
        {!isLoading && !errorMsg && formSubmitted && (
          <div className="py-12 text-center space-y-6 border-4 border-dashed border-[#141414] bg-black/20">
            <span className="text-6xl block animate-bounce">🏆</span>
            <div>
              <h1 className="text-2xl font-black uppercase tracking-wide text-[#55ff55] [text-shadow:2px_2px_0px_#000]">
                Quest Complete
              </h1>
              <p className="text-xs text-[#aaaaaa] uppercase tracking-wider font-bold mt-2">
                Your response vector has saved safely to the data ledger.
              </p>
            </div>
          </div>
        )}

        {/* State: Active Form Content View */}
        {!isLoading && !errorMsg && !formSubmitted && surveyData && (
          <div className="space-y-8">
            
            {/* Survey Header Section */}
            <div className="border-b-4 border-dashed border-[#141414] pb-6 flex items-center justify-between gap-4">
              <div>
                <span className="inline-block rounded-none border-2 border-black bg-[#1a0c24] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#ffff55] ring-2 ring-[#4a0e4e] mb-2">
                  📝 Active Query Panel
                </span>
                <h1 className="text-2xl font-black uppercase tracking-wide text-white [text-shadow:2px_2px_0px_#000]">
                  {surveyData.title}
                </h1>
              </div>
              
              {brandLogo && (
                <div className="bg-black/40 border-2 border-black p-1 max-w-[80px] shrink-0">
                  <img src={brandLogo} alt="Brand Asset" className="max-h-10 object-contain" onError={(e)=>{(e.target as HTMLElement).style.display='none'}} />
                </div>
              )}
            </div>
            
            {/* Active Core Interactive Form */}
            <form onSubmit={handleResponseFormSubmit} className="space-y-8">
              {surveyData.questions.map((q: any, index: number) => (
                <div key={q.id} className="space-y-3 bg-[#242c30] p-5 border-4 border-b-8 border-black rounded-none">
                  
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center rounded-none bg-black px-2 py-0.5 text-[10px] font-mono text-[#55ffff] font-bold border border-zinc-800">
                      NODE {index + 1}
                    </span>
                    <label className="text-xs font-black uppercase tracking-wide text-[#ffff55] [text-shadow:1px_1px_0px_#000]">
                      {q.label || "Incomplete Query String"}
                    </label>
                  </div>

                  {/* Type 1: Short Text Field Input */}
                  {q.type === 'short_text' && (
                    <div className="pt-2">
                      <input
                        type="text"
                        required
                        placeholder="Write your textual input response here..."
                        className="w-full rounded-none border-2 border-black bg-black/50 p-3 text-xs font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-[#55ffff]"
                        onChange={(e) => handleInputChange(q.label, e.target.value)}
                      />
                    </div>
                  )}

                  {/* Type 2: Multiple Choice Array Layout */}
                  {q.type === 'multiple_choice' && (
                    <div className="grid gap-2.5 pt-2">
                      {q.options.map((opt: string) => {
                        const isSelected = formAnswers[q.label] === opt
                        return (
                          <label 
                            key={opt} 
                            style={{ borderColor: isSelected ? brandColor : 'black' }}
                            className={`p-3 border-2 text-xs font-bold uppercase tracking-wide cursor-pointer transition-all flex items-center gap-3 select-none ${
                              isSelected 
                                ? 'bg-black/60 text-white' 
                                : 'bg-black/20 text-[#aaaaaa] hover:bg-black/40 hover:text-white'
                            }`}
                          >
                            <input 
                              type="radio" 
                              className="sr-only" 
                              name={q.id} 
                              required
                              checked={isSelected}
                              onChange={() => handleInputChange(q.label, opt)} 
                            />
                            <span className={`h-3 w-3 border border-black inline-block shrink-0 ${isSelected ? 'bg-[#55ff55]' : 'bg-zinc-800'}`} />
                            {opt}
                          </label>
                        )
                      })}
                    </div>
                  )}

                  {/* Type 3: Linear Rating Grid System */}
                  {q.type === 'rating' && (
                    <div className="pt-2">
                      <div className="flex items-center justify-between gap-1 max-w-md mx-auto">
                        {['1', '2', '3', '4', '5'].map((num) => {
                          const isSelected = formAnswers[q.label] === num
                          return (
                            <button
                              key={num}
                              type="button"
                              onClick={() => handleInputChange(q.label, num)}
                              style={{ 
                                backgroundColor: isSelected ? brandColor : '#302020',
                                color: isSelected ? 'white' : '#ff5555'
                              }}
                              className="w-10 h-10 border-2 border-b-4 border-black font-black text-sm flex items-center justify-center transition-all active:border-b-2 active:translate-y-0.5 cursor-pointer"
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
                className="w-full text-center rounded-none border-4 border-b-8 border-black px-8 py-4 text-sm font-black uppercase tracking-wider text-white transition-all hover:brightness-110 active:border-b-4 active:translate-y-1 disabled:opacity-40 cursor-pointer [text-shadow:2px_2px_0px_#141414]"
              >
                {isSubmitting ? "Transmitting Fields..." : "💾 Commit Responses to Database"}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}