import { auth } from '../firebase.js'

const AUTH_API_BASE_URL = import.meta.env.VITE_API_ONE_URL ||
  import.meta.env.VITE_AUTH_API_BASE_URL || 'http://localhost:8080'
const OTHER_API_BASE_URL = import.meta.env.VITE_API_TWO_URL ||
  import.meta.env.VITE_OTHER_API_BASE_URL || 'http://localhost:8000'

async function apiFetch(baseUrl, path, options = {}, isRetry = false) {
  const user = auth.currentUser
  const headers = { 'Content-Type': 'application/json', ...options.headers }

  if (user) {
    headers.Authorization = `Bearer ${await user.getIdToken(isRetry)}`
  }

  const response = await fetch(`${baseUrl}${path}`, { ...options, headers })

  if (response.status === 401 && user && !isRetry) {
    return apiFetch(baseUrl, path, options, true)
  }

  const data = response.status === 204 ? null : await response.json().catch(() => null)
  if (!response.ok) {
    const error = new Error(data?.detail || `Request failed (${response.status})`)
    error.status = response.status
    error.data = data
    throw error
  }

  return data
}

export const apiOne = (path, options) => apiFetch(AUTH_API_BASE_URL, path, options)
export const apiTwo = (path, options) => apiFetch(OTHER_API_BASE_URL, path, options)
export const getMe = () => apiOne('/api/auth/me/')
export const updateMe = (fields) => apiOne('/api/auth/me/', {
  method: 'PATCH',
  body: JSON.stringify(fields)
})
