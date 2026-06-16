// web/src/lib/survey-api.ts

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8787'
export const getPublicSurvey = async (id: string) => {
  const response = await fetch(`${API_BASE_URL}/api/public/survey/${id}`)
  return response.json()
}

export const submitResponse = async (id: string, answers: any) => {
  const response = await fetch(`${API_BASE_URL}/api/public/survey/${id}/respond`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ answers })
  })
  return response.json()
}