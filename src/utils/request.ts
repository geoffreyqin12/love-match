const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'

export const request = async (endpoint: string, options: RequestInit = {}) => {
  const token = localStorage.getItem('token')
  
  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json'
  }

  if (token) {
    defaultHeaders['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers
    }
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || '请求失败')
  }

  return data
} 