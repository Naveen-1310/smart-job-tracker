import api from './api'

/**
 * Job Application API service.
 */
export const applicationService = {
  /** Get all applications (with optional search/filter) */
  getAll: (params = {}) => api.get('/applications', { params }),

  /** Get single application by ID */
  getById: (id) => api.get(`/applications/${id}`),

  /** Create a new application */
  create: (data) => api.post('/applications', data),

  /** Update an existing application */
  update: (id, data) => api.put(`/applications/${id}`, data),

  /** Delete an application */
  delete: (id) => api.delete(`/applications/${id}`),
}
