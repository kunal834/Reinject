import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'

interface AppContextType {
  user: { id: string; email: string } | null
  surveys: any[]
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string) => Promise<void>
  logout: () => void
  fetchSurveys: () => Promise<void>
  createSurvey: (data: { title: string; questions: any[]; branding: any }) => Promise<any>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ id: string; email: string } | null>(null)
  const [surveys, setSurveys] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 1. Session Initialization: Check if the cookie is valid on mount
  useEffect(() => {
    const checkSession = async () => {
      try {
        //Including { credentials: 'include' } in your fetch configurations tells the browser's security engine to attach the session cookie to the request when communicating with your backend API.
        const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
          credentials: 'include'
        })
        if (response.ok) {
          const data = await response.json()
          if (data.authenticated) setUser(data.user)
        }
      } catch (e) {
        console.error("Session check failed", e)
      } finally {
        setIsLoading(false)
      }
    }
    checkSession()
  }, [])

  // 2. Authentication Logic
  const login = async (email: string) => {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
      credentials: 'include'
    })
    
    const data = await response.json()
    if (data.success) {
      setUser(data.user)
    } else {
      throw new Error(data.error)
    }
  }

  const logout = async () => {
    await fetch(`${API_BASE_URL}/api/auth/logout`, { method: 'POST', credentials: 'include' })
    setUser(null)
    setSurveys([])
  }

  // 3. Dashboard Data Logic
  const fetchSurveys = async () => {
    const response = await fetch(`${API_BASE_URL}/api/surveys/surveys`, {
      credentials: 'include'
    })
    const data = await response.json()
    if (data.success) setSurveys(data.surveys)
  }

  const createSurvey = async (surveyData: any) => {
    const response = await fetch(`${API_BASE_URL}/api/surveys/build`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(surveyData),
      credentials: 'include'
    })
    const data = await response.json()
    if (data.success) {
      await fetchSurveys() // Refresh list after creation
    }
    return data
  }

  return (
    <AppContext.Provider value={{ 
      user, 
      surveys, 
      isAuthenticated: !!user, 
      isLoading, 
      login, 
      logout, 
      fetchSurveys, 
      createSurvey 
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) throw new Error('useApp must be used within an AppProvider')
  return context
}