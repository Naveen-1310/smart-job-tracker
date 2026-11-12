import api from './api'

/**
 * Dashboard API service.
 */
export const dashboardService = {
  /** Get summary stats (counts by status + monthly data) */
  getStats: () => api.get('/dashboard/stats'),

  /** Get 5 most recent applications */
  getRecentApplications: () => api.get('/dashboard/recent-applications'),

  /** Get upcoming scheduled interviews */
  getUpcomingInterviews: () => api.get('/dashboard/upcoming-interviews'),

  /** Load realistic demo data */
  loadDemoData: () => api.post('/dashboard/demo-data'),
}

/**
 * User Profile API service.
 */
export const userService = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
}
