import { useState } from 'react'
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

export function SurveyBuilder({ onCreateSuccess }: SurveyBuilderProps) {
  const { createSurvey } = useApp()

  // Form Configuration Core Hooks
  const [surveyTitle, setSurveyTitle] = useState('')
  const [primaryColor, setPrimaryColor] = useState('#6366f1')
  const [logoUrl, setLogoUrl] = useState('')
  const [questions, setQuestions] = useState<QuestionInput[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)

  // --- COMPOSER MUTATION LAYER ---
  const addQuestion = (type: 'short_text' | 'multiple_choice' | 'rating') => {
    const defaultOptions = 
      type === 'multiple_choice' ? ['Option 1', 'Option 2'] : 
      type === 'rating' ? ['1', '2', '3', '4', '5'] : []
    
    const newQuestion: QuestionInput = {
      id: crypto.randomUUID(),
      type,
      label: '',
      options: defaultOptions
    }
    setQuestions([...questions, newQuestion])
  }

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id))
  }

  const updateQuestionLabel = (id: string, value: string) => {
    setQuestions(questions.map(q => q.id === id ? { ...q, label: value } : q))
  }

  const addOption = (qId: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: [...q.options, `Option ${q.options.length + 1}`] }
      }
      return q
    }))
  }

  const updateOptionValue = (qId: string, optIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        const updated = [...q.options]
        updated[optIndex] = value
        return { ...q, options: updated }
      }
      return q
    }))
  }

  const removeOption = (qId: string, optIndex: number) => {
    setQuestions(questions.map(q => {
      if (q.id === qId) {
        return { ...q, options: q.options.filter((_, idx) => idx !== optIndex) }
      }
      return q
    }))
  }

  // --- NATIVE DRAG AND DROP REORDER MECHANISM ---
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)

  const handleDragStart = (index: number) => setDraggedIndex(index)
  
  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return
    
    const reordered = [...questions]
    const currentDraggedItem = reordered[draggedIndex]
    reordered.splice(draggedIndex, 1)
    reordered.splice(index, 0, currentDraggedItem)
    
    setDraggedIndex(index)
    setQuestions(reordered)
  }

  const handleDragEnd = () => setDraggedIndex(null)

  const handleCreateSurveySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!surveyTitle.trim()) return alert("A survey title is required.")
    if (questions.length === 0) return alert("Please add at least one question block.")

    setIsSubmitting(true)
    try {
      const payload = {
        title: surveyTitle.trim(),
        branding: { primaryColor, logoUrl: logoUrl.trim() },
        questions: questions.map(q => ({ type: q.type, label: q.label, options: q.options }))
      }
      
      const res = await createSurvey(payload)
      if (res.success) {
        onCreateSuccess()
      } else {
        alert(res.error || "Failed to persist survey layout matrix.")
      }
    } catch (err) {
      alert("Network transmission error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleCreateSurveySubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      {/* Left Column Canvas: Title Setup + Questions Flow Builder */}
      <div className="lg:col-span-2 space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/20 p-6 space-y-4 backdrop-blur-sm">
          <h2 className="text-lg font-semibold text-slate-200">1. Core Schema Setup</h2>
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Survey Display Title</label>
            <input
              type="text"
              required
              placeholder="e.g., Q3 Product Satisfaction Index"
              value={surveyTitle}
              onChange={(e) => setSurveyTitle(e.target.value)}
              className="block w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-white placeholder-slate-600 text-md focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Interactive Element Blocks Sequence View */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-200">2. Form Layout Sequence</h2>
            <span className="text-xs text-slate-500 font-medium font-mono">Nodes configured: {questions.length}</span>
          </div>

          {questions.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-slate-800 p-12 text-center text-slate-500">
              Form layout matrix empty. Choose an element block type below to begin mounting interactive inputs.
            </div>
          ) : (
            <div className="space-y-4">
              {questions.map((q, index) => (
                <div
                  key={q.id}
                  draggable
                  onDragStart={() => handleDragStart(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`group relative rounded-2xl border p-5 bg-slate-900/40 border-slate-800 transition shadow-inner cursor-grab active:cursor-grabbing ${
                    draggedIndex === index ? 'opacity-40 border-indigo-500 bg-slate-950/80' : ''
                  }`}
                >
                  <div className="absolute top-6 left-3 text-slate-600 group-hover:text-slate-400 transition select-none text-sm font-mono tracking-tighter">
                    ::
                  </div>

                  <div className="pl-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center rounded-md bg-slate-950 border border-slate-800 px-2 py-0.5 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                        Block {index + 1} • {q.type.replace('_', ' ')}
                      </span>
                      <button
                        type="button"
                        onClick={() => removeQuestion(q.id)}
                        className="text-xs font-semibold text-rose-500 hover:text-rose-400 transition cursor-pointer"
                      >
                        Remove Node
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        required
                        placeholder="Type question prompt label here..."
                        value={q.label}
                        onChange={(e) => updateQuestionLabel(q.id, e.target.value)}
                        className="block w-full rounded-lg border border-slate-800 bg-slate-950/40 px-3 py-2 text-sm text-white focus:border-indigo-500 focus:outline-none"
                      />
                    </div>

                    {/* Choice Configuration Array Fields loop */}
                    {q.type === 'multiple_choice' && (
                      <div className="space-y-2 border-l border-slate-800 pl-3 pt-1">
                        <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Option Configurations</label>
                        {q.options.map((option, optIdx) => (
                          <div key={optIdx} className="flex items-center gap-2">
                            <input
                              type="text"
                              required
                              value={option}
                              onChange={(e) => updateOptionValue(q.id, optIdx, e.target.value)}
                              className="block w-full max-w-sm rounded-md border border-slate-800 bg-slate-950/80 px-2.5 py-1.5 text-xs text-slate-300 focus:border-indigo-500 focus:outline-none"
                            />
                            {q.options.length > 2 && (
                              <button
                                type="button"
                                onClick={() => removeOption(q.id, optIdx)}
                                className="text-xs text-slate-600 hover:text-rose-400 transition p-1 cursor-pointer"
                              >
                                ✕
                              </button>
                            )}
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => addOption(q.id)}
                          className="inline-flex items-center text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 pt-1 cursor-pointer"
                        >
                          ➕ Add Choice Option
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Insertion Elements Hub */}
        <div className="rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 space-y-3">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest text-center sm:text-left">Add Layout Element Nodes</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => addQuestion('short_text')}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/40 py-2.5 text-xs font-semibold text-slate-200 hover:border-indigo-500 hover:bg-indigo-500/5 transition cursor-pointer"
            >
              📝 Short Text Block
            </button>
            <button
              type="button"
              onClick={() => addQuestion('multiple_choice')}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/40 py-2.5 text-xs font-semibold text-slate-200 hover:border-indigo-500 hover:bg-indigo-500/5 transition cursor-pointer"
            >
              🔘 Multiple Choice
            </button>
            <button
              type="button"
              onClick={() => addQuestion('rating')}
              className="flex items-center justify-center gap-2 rounded-xl border border-slate-800/80 bg-slate-900/40 py-2.5 text-xs font-semibold text-slate-200 hover:border-indigo-500 hover:bg-indigo-500/5 transition cursor-pointer"
            >
              ⭐ Linear 1–5 Rating
            </button>
          </div>
        </div>
      </div>

      {/* Right Column Workspace Panel: Branding Controls Tokens + Form Dispatcher */}
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/10 p-6 space-y-4 backdrop-blur-md">
          <h2 className="text-lg font-semibold text-slate-200">3. Brand Integration</h2>
          
          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Theme Identity Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="h-10 w-12 rounded-lg border border-slate-800 bg-transparent cursor-pointer p-0.5"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 font-mono text-xs uppercase text-slate-300 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Corporate Logo URL</label>
            <input
              type="url"
              placeholder="https://brand.com/logo.png"
              value={logoUrl}
              onChange={(e) => setLogoUrl(e.target.value)}
              className="block w-full rounded-lg border border-slate-800 bg-slate-950/60 px-3 py-2 text-xs text-white placeholder-slate-700 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Local Component Brand Preview Sandbox */}
          <div className="rounded-xl border border-slate-800/60 bg-slate-950/40 p-4 space-y-3">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block">Live Theme Profile Token Preview</span>
            <div className="flex items-center gap-2 border-b border-slate-900 pb-2">
              {logoUrl.trim() ? (
                <img src={logoUrl} alt="Preview Logo" className="h-5 max-w-[60px] object-contain error-fallback" />
              ) : (
                <div className="h-5 w-5 bg-slate-800 rounded flex items-center justify-center text-[10px]">🏢</div>
              )}
              <span className="text-xs font-bold text-white truncate max-w-[120px]">{surveyTitle || "Untitled Form"}</span>
            </div>
            <button
              type="button"
              style={{ backgroundColor: primaryColor }}
              className="w-full text-center py-2 text-white font-semibold text-xs rounded-lg shadow-sm pointer-events-none filter brightness-95"
            >
              Sample Brand Submit Button
            </button>
          </div>
        </div>

        {/* Form Submission Pipeline Trigger */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full text-center py-3.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-600/10 transition disabled:opacity-50 cursor-pointer"
        >
          {isSubmitting ? "Syncing Batch Records..." : "🚀 Compile & Deploy Live Survey"}
        </button>
      </div>

    </form>
  )
}