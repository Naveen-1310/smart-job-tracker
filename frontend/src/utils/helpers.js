/**
 * Shared utility helper functions.
 */

/**
 * Format a date string to a readable format.
 * e.g. "2024-01-15" → "Jan 15, 2024"
 */
export function formatDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Format a datetime string to a readable format.
 * e.g. "2024-01-15T10:30:00" → "Jan 15, 2024 at 10:30 AM"
 */
export function formatDateTime(dateTimeStr) {
  if (!dateTimeStr) return '—'
  return new Date(dateTimeStr).toLocaleString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * Map ApplicationStatus enum to display label.
 */
export function getStatusLabel(status) {
  const labels = {
    APPLIED:             'Applied',
    ASSESSMENT:          'Assessment',
    INTERVIEW_SCHEDULED: 'Interview',
    SELECTED:            'Selected',
    REJECTED:            'Rejected',
  }
  return labels[status] || status
}

/**
 * Map ApplicationStatus to CSS badge class.
 */
export function getStatusBadgeClass(status) {
  const classes = {
    APPLIED:             'badge-applied',
    ASSESSMENT:          'badge-assessment',
    INTERVIEW_SCHEDULED: 'badge-interview',
    SELECTED:            'badge-selected',
    REJECTED:            'badge-rejected',
  }
  return `badge ${classes[status] || ''}`
}

/**
 * Extract error message from Axios error object.
 */
export function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.response?.data?.error ||
    error?.message ||
    'An unexpected error occurred'
  )
}

/**
 * Map job type enum to display label.
 */
export function getJobTypeLabel(type) {
  const labels = {
    FULL_TIME:  'Full-time',
    INTERNSHIP: 'Internship',
    REMOTE:     'Remote',
  }
  return labels[type] || type
}
