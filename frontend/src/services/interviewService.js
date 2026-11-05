import api from './api'

/**
 * Interview API service.
 */
export const interviewService = {
  /** Get all interviews for the user */
  getAll: () => api.get('/interviews'),

  /** Schedule a new interview */
  create: (data) => api.post('/interviews', data),

  /** Update interview details/status */
  update: (id, data) => api.put(`/interviews/${id}`, data),

  /** Delete an interview */
  delete: (id) => api.delete(`/interviews/${id}`),
}
