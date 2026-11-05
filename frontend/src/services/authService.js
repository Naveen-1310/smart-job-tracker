import api from './api'

/**
 * Auth API service.
 * Handles login and registration requests.
 * These are PUBLIC endpoints — no token needed.
 */

export const authService = {
  /**
   * Register a new user.
   * @param {Object} data - { name, email, password }
   */
  register: (data) => api.post('/auth/register', data),

  /**
   * Login with email and password.
   * @param {Object} data - { email, password }
   */
  login: (data) => api.post('/auth/login', data),
}
