import axios from 'axios'

/**
 * Base Axios instance.
 * All API calls use this instance, which automatically:
 * - Sets the base URL (proxied by Vite to localhost:8080)
 * - Attaches the JWT token as Authorization header
 * - Handles 401 errors (token expired → redirect to login)
 */
const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// ─── Request Interceptor ────────────────────────────────────────────
// Automatically attach the JWT token to every outgoing request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ─── Response Interceptor ───────────────────────────────────────────
// Handle 401 Unauthorized or 403 Forbidden — token expired, invalid, or user reset
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear invalid session and redirect to login
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
