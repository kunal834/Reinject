import { useState, useEffect } from 'react'
import { useApp } from '../context/Appcontext'

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
  { id: 'dirt', name: '🌌 Neon Cyan Matrix', hex: '#111625', desc: 'Deep cyberspace baseline node' },
  { id: 'netherrack', name: '🔮 Laser Magenta Layer', hex: '#210b14', desc: 'Reflective ultra-bright core color' },
  { id: 'endstone', name: '🪐 Orchid Violet Grid', hex: '#150a21', desc: 'Eerie high-contrast premium workspace' },
  { id: 'deepslate', name: '🐦 Obsidian Slate Hull', hex: '#0f172a', desc: 'Industrial dark telemetry console' },
  { id: 'obsidian', name: '🕶️ Pure Pitch Void', hex: '#070510', desc: 'Absolute zero light baseline absorption' }
]

export function SurveyBuilder({ onCreateSuccess }: SurveyBuilderProps) {
  const { createSurvey } = useApp()

  const [surveyTitle, setSurveyTitle] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#ff007f')
  const [logoUrl, setLogoUrl] = useState('')
  
  const [bgType, setBgType] = useState<'preset' | 'custom'>('preset')
  const [bgStyle, setBgStyle] = useState('dirt')
  const [customBgColor, setCustomBgColor] = useState('#070913')
  
  const [questions, setQuestions] = useState<QuestionInput[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [localLiveMock, setLocalLiveMock] = useState<any>(null)

  useEffect(() => {
    setLocalLiveMock({
      title: surveyTitle.trim() || 'UNTITLED SURVEY',
      primaryColor,
      logoUrl,
      bgType,
      bgStyle,
      customBgColor,
      questions
    })
  }, [surveyTitle, primaryColor, logoUrl, bgType, bgStyle, customBgColor, questions])
   

  console.log("Live Mock Preview Data:", localLiveMock) // Debug log to verify the live mock data structure)
  const addQuestion = (type: 'short_text' | 'multiple_choice' | 'rating') => {
    const defaultOptions = 
      type === 'multiple_choice' ? ['Option 1', 'Option 2'] : 
      type === 'rating' ? ['1', '2', '3', '4', '5'] : []
    
    setQuestions([...questions, { id: crypto.randomUUID(), type, label: '', options: defaultOptions }])
  }

  const removeQuestion = (id: string) => setQuestions(questions.filter(q => q.id !== id))
  console.log("Current Questions State:", questions) // Debug log to verify question state updates
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
    console.log(`Adding option to question ID: ${qId}`) // Debug log to verify which question is being updated
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
    if (questions.length === 0) return alert("Please add at least one question to your survey.")

    setIsSubmitting(true)
    try {
      const payload = {
        title: surveyTitle.trim(),
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
          label: q.label.trim() || 'Untitled Question',
          options: JSON.stringify(q.options),
          sort_order: idx
        }))
      }
      
      const res = await createSurvey(payload)
      if (res.success) onCreateSuccess()
      else alert(res.error || "Failed to save survey layout.")
    } catch (err) {
      alert("Network connection error.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const getMockBgColor = () => {
    if (bgType === 'custom') return customBgColor
    const activePreset = BG_STYLE_PRESETS.find(p => p.id === bgStyle)
    return activePreset ? activePreset.hex : '#111625'
  }

  return (
    <form onSubmit={handleCreateSurveySubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start text-[#e2e8f0] font-['Share_Tech_Mono',_monospace]">
      
      {/* Left Column Canvas Sheet */}
      <div className="lg:col-span-2 space-y-6 bg-[#f8fafc] border-2 border-slate-300 p-8 rounded-none shadow-2xl text-slate-900">
        <div className="space-y-2 border-b border-slate-200 pb-6">
          <label className="block text-xs font-black uppercase tracking-widest text-slate-500">Survey Title Header</label>
          <input
            type="text"
            required
            placeholder="Click to name this document matrix..."
            value={surveyTitle}
            onChange={(e) => setSurveyTitle(e.target.value)}
            className="w-full rounded-none border-b-2 border-slate-300 bg-transparent py-2 text-2xl font-black text-slate-950 focus:outline-none focus:border-[#ff007f] transition-colors placeholder-slate-400"
          />
        </div>

        <div className="space-y-6 pt-2">
          {questions.length === 0 ? (
            <div className="border-2 border-dashed border-slate-300 bg-slate-50 py-16 text-center text-slate-400 font-bold uppercase text-xs tracking-wider">
              Empty questionnaire sheet. Choose an element variant from the builder shelf below.
            </div>
          ) : (   
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={q.id} className="group bg-white border border-slate-200 p-5 space-y-4 relative shadow-sm">
                  <div className="flex justify-between items-center text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    <span>Field Element #{idx + 1} — {q.type.replace('_', ' ')}</span>
                    <div className="flex gap-3 items-center opacity-60 group-hover:opacity-100 transition-opacity">
                      <button type="button" disabled={idx === 0} onClick={() => moveQuestion(idx, 'UP')} className="text-slate-500 disabled:opacity-20 hover:text-indigo-600 font-bold cursor-pointer">▲ Move Up</button>
                      <button type="button" disabled={idx === questions.length - 1} onClick={() => moveQuestion(idx, 'DOWN')} className="text-slate-500 disabled:opacity-20 hover:text-indigo-600 font-bold cursor-pointer">▼ Move Down</button>
                      <span className="text-slate-300">|</span>
                      <button type="button" onClick={() => removeQuestion(q.id)} className="text-red-500 hover:text-red-700 font-bold cursor-pointer">[ Remove ]</button>
                    </div>
                  </div>
                  
                  <input
                    type="text"
                    required
                    placeholder="Type your question prompt string here..."
                    value={q.label}
                    onChange={(e) => updateQuestionLabel(q.id, e.target.value)}
                    className="w-full border-b border-slate-200 bg-transparent py-2 text-base font-medium text-slate-900 focus:outline-none focus:border-[#ff007f] transition-colors placeholder-slate-400"
                  />
                  
                  {q.type === 'multiple_choice' && (
                    <div className="space-y-2 pl-4 pt-1">
                      {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex gap-2 items-center">
                          <span className="text-xs text-slate-400 font-bold font-mono">{String.fromCharCode(65 + oIdx)}.</span>
                          <input
                            type="text"
                            required
                            value={opt}
                            onChange={(e) => updateOptionValue(q.id, oIdx, e.target.value)}
                            className="bg-slate-50 border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-800 w-64 focus:outline-none focus:border-indigo-500 rounded-sm"
                          />
                          {q.options.length > 2 && (
                            <button type="button" onClick={() => removeOption(q.id, oIdx)} className="text-xs text-red-500 font-bold px-1.5 hover:text-red-700">✕</button>
                          )}
                        </div>
                      ))}
                      <button type="button" onClick={() => addOption(q.id)} className="text-[10px] font-black text-indigo-600 uppercase mt-2 block hover:underline">+ Append Choice Row</button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-slate-200 pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button type="button" onClick={() => addQuestion('short_text')} className="bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 py-2.5 text-xs font-bold transition-all cursor-pointer text-center">📝 Add Text Input</button>
          <button type="button" onClick={() => addQuestion('multiple_choice')} className="bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 py-2.5 text-xs font-bold transition-all cursor-pointer text-center">🔘 Add Choice List</button>
          <button type="button" onClick={() => addQuestion('rating')} className="bg-slate-100 border border-slate-300 text-slate-700 hover:bg-slate-200 py-2.5 text-xs font-bold transition-all cursor-pointer text-center">⭐ Add 1-5 Rating</button>
        </div>
      </div>

      {/* Right Sidebar Controls */}
      <div className="space-y-6">
        <div className="border border-slate-800 bg-[#121626]/80 p-6 space-y-6 rounded-none relative before:absolute before:inset-0 before:border before:border-dashed before:border-slate-900 before:pointer-events-none">
          <h2 className="text-xl font-black uppercase text-[#ff007f] border-b border-slate-900 pb-3 font-['VT323',_monospace] tracking-wider">// 03. SKIN_BRAND_SCHEMA_TOKENS</h2>

          <div className="space-y-3">
            <label className="block text-xs font-bold uppercase tracking-widest text-[#00f5ff]">// Background Mode Engine</label>
            <div className="grid grid-cols-2 gap-2 bg-black/40 p-1.5 border border-slate-900 rounded-md">
              <button
                type="button"
                onClick={() => setBgType('preset')}
                className={`py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer rounded-sm ${bgType === 'preset' ? 'bg-[#ff007f] text-white shadow-[0_0_10px_rgba(255,0,127,0.2)]' : 'bg-transparent text-slate-500 hover:text-slate-300'}`}
              >
               PRESETS
              </button>
              <button
                type="button"
                onClick={() => setBgType('custom')}
                className={`py-1.5 text-xs font-black uppercase tracking-wider transition-all cursor-pointer rounded-sm ${bgType === 'custom' ? 'bg-[#ff007f] text-white shadow-[0_0_10px_rgba(255,0,127,0.2)]' : 'bg-transparent text-slate-500 hover:text-slate-300'}`}
              >
              CUSTOM_HEX
              </button>
            </div>
          </div>

          {bgType === 'preset' ? (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Skin Surface Configuration</label>
              <div className="grid grid-cols-1 gap-2 max-h-[180px] overflow-y-auto pr-1 bg-black/40 p-2 border border-slate-900 rounded-md custom-scrollbar">
                {BG_STYLE_PRESETS.map((preset) => {
                  const isCurrent = bgStyle === preset.id
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => setBgStyle(preset.id)}
                      className={`text-left p-2 border transition-all cursor-pointer rounded-md ${
                        isCurrent ? 'bg-slate-950 border-[#00f5ff] text-white font-black shadow-[0_0_10px_rgba(0,245,255,0.1)]' : 'bg-slate-950/40 border-transparent text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <div className="text-[11px] font-bold uppercase tracking-wide">{preset.name}</div>
                      <div className="text-[9px] opacity-60 font-mono font-normal mt-0.5 tracking-tight">{preset.desc}</div>
                    </button>
                  )
                })}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Custom Workspace Hex Matrix</label>
              <div className="flex gap-2">
                <input type="color" value={customBgColor} onChange={e => setCustomBgColor(e.target.value)} className="h-9 w-12 border border-black cursor-pointer bg-transparent rounded-md" />
                <input type="text" value={customBgColor} onChange={e => setCustomBgColor(e.target.value)} className="w-full bg-[#070b12] border border-black px-3 text-xs font-mono font-bold text-[#00f5ff] uppercase rounded-md focus:outline-none" />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Primary Core Button Color Accent</label>
            <div className="flex gap-2">
              <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="h-9 w-12 border border-black cursor-pointer bg-transparent rounded-md" />
              <input type="text" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-full bg-[#070b12] border border-black px-3 text-xs font-mono font-bold text-[#00f5ff] uppercase rounded-md focus:outline-none" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-bold uppercase tracking-widest text-slate-400">Branded Enterprise Logo Endpoint Asset Link</label>
            <input type="url" placeholder="https://company.com/branding_logo.png" value={logoUrl} onChange={e => setLogoUrl(e.target.value)} className="w-full bg-[#070b12] border border-black p-2.5 text-xs font-bold text-[#00f5ff] placeholder-[#ff007f]/20 focus:outline-none focus:border-[#ff007f] transition-colors rounded-md" />
          </div>
        </div>

        {/* REACTION SYSTEM SANDBOX LIVE MOCK PREVIEW CANVAS */}
        {localLiveMock && (
          <div 
            style={{ backgroundColor: `${getMockBgColor()}` }} 
            className="rounded-none border-4 border-b-8 border-black p-4 space-y-3 shadow-2xl relative transition-colors duration-300"
          >
            <div className="absolute inset-0 bg-white/[0.01] pointer-events-none" style={{ backgroundImage: 'linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)', backgroundSize: '16px 16px' }} />
            
            <div className="relative z-10 bg-[#f8fafc] border border-slate-200 p-4 space-y-3 rounded-md text-slate-900">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                {localLiveMock.logoUrl.trim() ? (
                  <img src={localLiveMock.logoUrl} alt="Logo" className="h-4 max-w-[60px] object-contain" onError={(e)=>{(e.target as HTMLElement).style.display='none'}} />
                ) : <span className="text-xs">🏢</span>}
                <span className="text-[10px] font-black text-slate-950 uppercase tracking-widest truncate max-w-[140px] font-['Share_Tech_Mono',_monospace]">{localLiveMock.title}</span>
              </div>
              
              <div className="space-y-3 max-h-[180px] overflow-y-auto pr-1 custom-scrollbar">
                {localLiveMock.questions.length === 0 ? (
                  <p className="text-[10px] text-slate-400 italic tracking-wide">// No fields configured.</p>
                ) : (
                  localLiveMock.questions.map((q: any, i: number) => (
                    <div key={q.id} className="bg-white p-2 border border-slate-200 text-[10px] space-y-2 rounded-sm">
                      <span className="text-slate-900 font-bold block">{i + 1}. {q.label || 'Untitled Field'}</span>
                      {q.type === 'short_text' && <div className="h-5 bg-slate-50 border border-slate-200 w-full" />}
                      
                      {q.type === 'multiple_choice' && (
                        <div className="space-y-1">
                          {q.options?.map((optionString: string) => (
                            <div key={optionString} className="text-[8px] text-slate-500 font-mono bg-slate-50 px-1.5 py-0.5 border border-slate-200 truncate">
                              ▪️ {optionString}
                            </div>
                          ))}
                        </div>
                      )}
                      
                      {q.type === 'rating' && (
                        <div className="flex gap-1">
                          {['1','2','3','4','5'].map(n=><span key={n} style={{ borderColor: localLiveMock.primaryColor }} className="w-4 h-4 bg-slate-50 text-center text-[8px] text-slate-400 border flex items-center justify-center rounded-xs">{n}</span>)}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              <button type="button" disabled style={{ backgroundColor: localLiveMock.primaryColor }} className="w-full text-center text-white text-[10px] font-black uppercase py-2 border border-black opacity-90 tracking-widest">LIVE_PREVIEW_ACTIVE</button>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-center border-4 border-b-8 border-black bg-[#39ff14] py-3.5 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-[#2acc10] active:border-b-4 active:translate-y-0.5 disabled:opacity-40 cursor-pointer"
        >
          {isSubmitting ? "PUBLISHING_METRIC_NODES..." : "🚀 COMPILE & LAUNCH PUBLIC SURVEY"}
        </button>
      </div>

    </form>
  )
}