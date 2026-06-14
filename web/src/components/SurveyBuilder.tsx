import { useState, useEffect } from 'react'
import { useApp } from '../context/Appcontext'
import { CLIENT_BG_MAP } from '../routes/dashboard'

interface QuestionInput {
  id: string
  type: 'short_text' | 'multiple_choice' | 'rating'
  label: string
  options: string[]
}

interface SurveyBuilderProps {
  onCreateSuccess: () => void
}

const BG_STYLE_PRESETS = [
  { id: 'dirt', name: '🟫 Ground Dirt', desc: 'Standard earthy brown structural look' },
  { id: 'netherrack', name: '🟥 Crimson Netherrack', desc: 'Deep nether core high-contrast red' },
  { id: 'endstone', name: '🟨 Void Endstone', desc: 'Eerie, custom light astral violet tone' },
  { id: 'deepslate', name: '⬛ Cobbled Deepslate', desc: 'Industrial slate charcoal profile' },
  { id: 'obsidian', name: '🟪 Dark Obsidian', desc: 'High strength stellar dark violet base' }
]

export function SurveyBuilder({ onCreateSuccess }: SurveyBuilderProps) {
  const { createSurvey } = useApp()

  const [surveyTitle, setSurveyTitle] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#5c8e32')
  const [logoUrl, setLogoUrl] = useState('')
  
  // New State additions for background options handling
  const [bgType, setBgType] = useState<'preset' | 'custom'>('preset')
  const [bgStyle, setBgStyle] = useState('dirt')
  const [customBgColor, setCustomBgColor] = useState('#111827') // Default to deep gray
  
  const [questions, setQuestions] = useState<QuestionInput[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localLiveMock, setLocalLiveMock] = useState<any>(null)

  useEffect(() => {
    setLocalLiveMock({
      title: surveyTitle.trim() || 'Untitled Document Matrix',
      primaryColor,
      logoUrl,
      bgType,
      bgStyle,
      customBgColor,
      questions
    })
  }, [surveyTitle, primaryColor, logoUrl, bgType, bgStyle, customBgColor, questions])

  const addQuestion = (type: 'short_text' | 'multiple_choice' | 'rating') => {
    const defaultOptions = 
      type === 'multiple_choice' ? ['Option A', 'Option B'] : 
      type === 'rating' ? ['1', '2', '3', '4', '5'] : []
    
    setQuestions([...questions, { id: crypto.randomUUID(), type, label: '', options: defaultOptions }])
  }

  const removeQuestion = (id: string) => setQuestions(questions.filter(q => q.id !== id))
  
  const updateQuestionLabel = (id: string, value: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, label: value } : q))
  }

  const moveQuestion = (currentIndex: number, direction: 'UP' | 'DOWN') => {
    const targetIndex = direction === 'UP' ? currentIndex - 1 : currentIndex + 1
    if (targetIndex < 0 || targetIndex >= questions.length) return

    const reorderedQuestions = [...questions]
    const [removedNode] = reorderedQuestions.splice(currentIndex, 1)
    reorderedQuestions.splice(targetIndex, 0, removedNode)
    setQuestions(reorderedQuestions)
  }

  const addOption = (qId: string) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, options: [...q.options, `Option ${q.options.length + 1}`] } : q))
  }

  const updateOptionValue = (qId: string, optIdx: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const updated = [...q.options]
        updated[optIdx] = value
        return { ...q, options: updated }
      }
      return q
    }))
  }

  const removeOption = (qId: string, optIdx: number) => {
    setQuestions(questions.map(q => q.id === qId ? { ...q, options: q.options.filter((_, idx) => idx !== optIdx) } : q))
  }

  const handleCreateSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!surveyTitle.trim()) return alert("A survey title is required.")
    if (questions.length === 0) return alert("Please add at least one question node.")

    setIsSubmitting(true)
    try {
      const payload = {
        title: surveyTitle.trim(),
        // Bundled safely inside your branding string wrapper matrix
        branding: JSON.stringify({ 
          primaryColor, 
          logoUrl: logoUrl.trim(), 
          bgType,
          bgStyle, 
          customBgColor 
        }),
        questions: questions.map((q, idx) => ({
          id: q.id,
          type: q.type,
          label: q.label.trim() || 'Untitled Query Parameter',
          options: JSON.stringify(q.options),
          sort_order: idx
        }))
      }
      
      const res = await createSurvey(payload)
      if (res.success) onCreateSuccess()
      else alert(res.error || "Failed to commit record matrices.")
    } catch (err) {
      alert("Network exception error.")
    } finally {
      setIsSubmitting(false)
    }
  }

  // Get current active preview canvas color background
  const getMockBgColor = () => {
    if (bgType === 'custom') return customBgColor
    return CLIENT_BG_MAP[bgStyle] || '#2c1b12'
  }

  return (
    <form onSubmit={handleCreateSurveySubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-[#f0f0f0]">
      
      {/* Left Column Fields Creator */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-none border-4 border-b-8 border-black bg-black/20 p-6 space-y-4">
          <h2 className="text-xl font-black uppercase text-[#ffff55] [text-shadow:1px_1px_0px_#000]">1. Matrix Properties</h2>
          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase text-zinc-400">Display Meta Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Ender Dragon Raid Feedback Form"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              className="w-full rounded-none border-4 border-black bg-black/40 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#ffaa00]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-black uppercase text-[#ffff55] [text-shadow:1px_1px_0px_#000]">2. Structural Fields Flow</h2>
          
          {questions.length === 0 ? (
            <div className="border-4 border-dashed border-black bg-black/10 p-8 text-center text-zinc-500 font-bold uppercase text-xs">
              Matrix stack empty. Choose a node component option below.
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, idx) => (
                <div key={q.id} className="border-4 border-b-8 border-black bg-[#242c30] p-4 space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase">
                    <span className="bg-black px-2 py-0.5 border border-zinc-800 text-[#55ffff]">Node Array Index: {idx}</span>
                    
                    <div className="flex gap-3 items-center">
                      <button type="button" disabled={idx === 0} onClick={() => moveQuestion(idx, 'UP')} className="text-[#55ff55] disabled:opacity-20 hover:underline cursor-pointer">▲ Move Up</button>
                      <button type="button" disabled={idx === questions.length - 1} onClick={() => moveQuestion(idx, 'DOWN')} className="text-[#55ff55] disabled:opacity-20 hover:underline cursor-pointer">▼ Move Down</button>
                      <span className="text-zinc-600">|</span>
                      <button type="button" onClick={() => removeQuestion(q.id)} className="text-[#ff5555] hover:underline cursor-pointer">[ Destroy ]</button>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    required
                    placeholder="Enter explicit label query text string..."
                    value={q.label}
                    onChange={(e) => updateQuestionLabel(q.id, e.target.value)}
                    className="w-full border-2 border-black bg-black/50 p-2.5 text-xs text-white focus:outline-none focus:border-white"
                  />
                  
                  {q.type === 'multiple_choice' && (
                    <div className="space-y-2 pl-4 bg-black/20 p-2.5 border border-black">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex gap-2 items-center">
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => updateOptionValue(q.id, oIdx, e.target.value)}
                            className="bg-black/60 border border-black p-1.5 text-xs text-zinc-300 font-mono w-64 focus:outline-none focus:border-indigo-400"
                          />
                          {q.options.length > 2 && (
                            <button type="button" onClick={() => removeOption(q.id, oIdx)} className="text-xs text-[#ff5555] font-bold px-1 hover:text-red-400">✕</button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => addOption(q.id)} className="text-[10px] font-bold text-[#55ff55] uppercase mt-1 block hover:underline">+ Append Vector Value</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-4 border-black bg-[#1a110b] p-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button type="button" onClick={() => addQuestion('short_text')} className="bg-[#302c20] border-2 border-b-4 border-black p-2.5 text-xs font-bold text-[#ffff55] hover:bg-[#3f3a2a] cursor-pointer">📝 Short Text Node</button>
          <button type="button" onClick={() => addQuestion('multiple_choice')} className="bg-[#242c30] border-2 border-b-4 border-black p-2.5 text-xs font-bold text-[#55ffff] hover:bg-[#2e383e] cursor-pointer">🔘 Choice Array Node</button>
          <button type="button" onClick={() => addQuestion('rating')} className="bg-[#302020] border-2 border-b-4 border-black p-2.5 text-xs font-bold text-[#ff5555] hover:bg-[#3d2929] cursor-pointer">⭐ 1-5 Metric Node</button>
        </div>
      </div>

      {/* Right Sidebar Profiles Controls */}
      <div className="space-y-6">
        <div className="border-4 border-b-8 border-black bg-black/20 p-6 space-y-6">
          <h2 className="text-xl font-black uppercase text-[#ffff55] border-b-4 border-dashed border-black pb-2">3. Visual Core Profiles</h2>

          {/* BG SELECTION FORK BLOCK */}
          <div className="space-y-3">
            <label className="block text-xs font-black uppercase text-[#e0a96d]">Background Mode Selection</label>
            <div className="grid grid-cols-2 gap-2 bg-black/40 p-1.5 border-2 border-black">
              <button
                type="button"
                onClick={() => setBgType('preset')}
                className={`py-1.5 text-xs font-bold uppercase transition-all cursor-pointer ${bgType === 'preset' ? 'bg-[#5c8e32] text-white' : 'bg-black/40 text-zinc-400'}`}
              >
                🎮 Presets
              </button>
              <button
                type="button"
                onClick={() => setBgType('custom')}
                className={`py-1.5 text-xs font-bold uppercase transition-all cursor-pointer ${bgType === 'custom' ? 'bg-[#5c8e32] text-white' : 'bg-black/40 text-zinc-400'}`}
              >
                🎨 Custom Color
              </button>
            </div>
          </div>

          {bgType === 'preset' ? (
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase text-[#e0a96d]">Viewport Texture Profile</label>
              <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-1 bg-black/40 p-2 border-2 border-black">
                {BG_STYLE_PRESETS.map((preset) => {
                  const isCurrent = bgStyle === preset.id
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setBgStyle(preset.id)}
                      className={`text-left p-2 border-2 text-xs transition-all cursor-pointer ${
                        isCurrent ? 'bg-zinc-800 border-[#ffff55] text-white font-black' : 'bg-black/50 border-transparent text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="text-[11px]">{preset.name}</div>
                      <div className="text-[9px] opacity-60 font-mono font-normal mt-0.5">{preset.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-black uppercase text-[#e0a96d]">Custom Background Hex Color</label>
              <div className="flex gap-2">
                <input type="color" value={customBgColor} onChange={e => setCustomBgColor(e.target.value)} className="h-9 w-12 border-2 border-black cursor-pointer bg-transparent" />
                <input type="text" value={customBgColor} onChange={e => setCustomBgColor(e.target.value)} className="w-full bg-black/50 border-2 border-black px-2 text-xs font-mono text-zinc-300 uppercase" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase text-[#e0a96d]">Primary Hex Button Accent</label>
            <div className="flex gap-2">
              <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="h-9 w-12 border-2 border-black cursor-pointer bg-transparent" />
              <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full bg-black/50 border-2 border-black px-2 text-xs font-mono text-zinc-300 uppercase" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-black uppercase text-[#e0a96d]">Corporate Logo Asset Link</label>
            <input type="url" placeholder="https://domain.com/logo.png" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="w-full bg-black/50 border-2 border-black p-2 text-xs text-white focus:outline-none" />
          </div>
        </div>

        {/* REACTION SYSTEM SANDBOX LIVE MOCK PREVIEW */}
        {localLiveMock && (
          <div 
            style={{ backgroundColor: getMockBgColor() }} 
            className="border-4 border-b-8 border-black p-4 space-y-3 shadow-xl relative transition-colors duration-300"
          >
            <div className="absolute inset-0 bg-white/[0.02] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            
            <div className="relative z-10 bg-[#1a110b] border-4 border-black p-4 space-y-3">
              <div className="flex items-center gap-2 border-b border-zinc-800 pb-1.5">
                {localLiveMock.logoUrl.trim() ? (
                  <img src={localLiveMock.logoUrl} alt="Logo" className="h-4 max-w-[60px] object-contain" onError={(e)=>{(e.target as HTMLElement).style.display='none'}} />
                ) : <span className="text-xs">🏢</span>}
                <span className="text-xs font-black text-white uppercase tracking-wide truncate max-w-[140px]">{localLiveMock.title}</span>
              </div>
              
              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1">
                {localLiveMock.questions.length === 0 ? (
                  <p className="text-[10px] text-zinc-600 italic">No nodes compiled in workspace layout.</p>
                ) : (
                  localLiveMock.questions.map((q: any, i: number) => (
                    <div key={q.id} className="bg-black/30 p-2 border border-black text-[10px] space-y-1">
                      <span className="text-[#ffff55] font-bold block">{i + 1}. {q.label || 'Untitled Field Node'}</span>
                      {q.type === 'short_text' && <div className="h-5 bg-black/60 border border-zinc-900 w-full" />}
                      
                      {q.type === 'multiple_choice' && (
                        <div className="space-y-0.5 pt-0.5">
                          {q.options?.map((optionString: string) => (
                            <div key={optionString} className="text-[8px] text-zinc-400 font-mono bg-black/20 px-1 border border-zinc-900 truncate">
                              ▪️ {optionString || 'Empty option state'}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {q.type === 'rating' && (
                        <div className="flex gap-0.5">
                          {['1','2','3','4','5'].map(n=><span key={n} className="w-3.5 h-3.5 bg-zinc-900 text-center text-[7px] text-zinc-500 border border-black flex items-center justify-center">{n}</span>)}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <button type="button" disabled style={{ backgroundColor: localLiveMock.primaryColor }} className="w-full text-center text-white text-[11px] font-black uppercase py-2 border-2 border-black opacity-60 cursor-not-allowed">Deploy Mock Trigger</button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-center border-4 border-b-8 border-black bg-[#5c8e32] py-3.5 text-xs font-black uppercase tracking-wider text-white hover:bg-[#4d7828] active:border-b-4 active:translate-y-0.5 disabled:opacity-40 cursor-pointer"
        >
          {isSubmitting ? "Syncing Workspace Transactions..." : "🚀 Compile & Deploy Public Survey Node"}
        </button>
      </div>

    </form>
  )
}