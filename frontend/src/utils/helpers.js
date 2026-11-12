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

/**
 * Convert any salary string (USD, EUR, LPA, or hourly) into Indian Rupees (₹).
 * Handles:
 * - "$55,000 - $95,000 / yr" → "₹46.7 - 80.7 LPA ($55k - $95k)"
 * - "$35,000 - $55,000 / yr" → "₹29.7 - 46.7 LPA ($35k - $55k)"
 * - "16 - 22 LPA" → "₹16 - 22 LPA"
 * - "$15 - $25 / hr" → "₹25 - 42 LPA (₹1,275 - 2,125/hr)"
 */
export function formatSalaryInRupees(salaryStr) {
  if (!salaryStr || typeof salaryStr !== 'string' || !salaryStr.trim()) {
    return '₹ Competitive (Industry Standard)'
  }

  const str = salaryStr.trim()

  // If already starts with ₹
  if (str.startsWith('₹')) return str

  // If already in Indian LPA / Lakhs format without ₹
  if (/LPA|Lakh|Lacs|INR|Rs/i.test(str)) {
    const cleaned = str.replace(/^Rs\.?\s*/i, '').replace(/^INR\s*/i, '').trim()
    return `₹${cleaned}`
  }

  const USD_TO_INR = 85.0 // Current standard conversion rate

  // Check for USD range: e.g. "$55,000 - $95,000" or "$35k - $55k" or "$15 - $25 / hr"
  const rangeMatch = str.match(/\$?\s*([\d,]+(?:\.\d+)?)\s*(k)?\s*(?:-|to)\s*\$?\s*([\d,]+(?:\.\d+)?)\s*(k)?/i)

  if (rangeMatch) {
    let min = parseFloat(rangeMatch[1].replace(/,/g, ''))
    let max = parseFloat(rangeMatch[3].replace(/,/g, ''))
    const isHourly = /hour|hr/i.test(str)

    if (isHourly) {
      const minHrInr = Math.round(min * USD_TO_INR)
      const maxHrInr = Math.round(max * USD_TO_INR)
      const minLpa = ((min * 2000 * USD_TO_INR) / 100000).toFixed(1)
      const maxLpa = ((max * 2000 * USD_TO_INR) / 100000).toFixed(1)
      return `₹${minLpa} - ${maxLpa} LPA (₹${minHrInr.toLocaleString('en-IN')}/hr)`
    }

    if (rangeMatch[2] || rangeMatch[4] || (min < 500 && !isHourly)) {
      min = min * 1000
      max = max * 1000
    }

    const minLpa = ((min * USD_TO_INR) / 100000).toFixed(1).replace(/\.0$/, '')
    const maxLpa = ((max * USD_TO_INR) / 100000).toFixed(1).replace(/\.0$/, '')
    const minK = Math.round(min / 1000)
    const maxK = Math.round(max / 1000)

    return `₹${minLpa} - ${maxLpa} LPA ($${minK}k - $${maxK}k)`
  }

  // Single USD value: e.g. "$80,000"
  if (str.includes('$')) {
    const singleMatch = str.match(/\$?\s*([\d,]+)/)
    if (singleMatch) {
      let val = parseFloat(singleMatch[1].replace(/,/g, ''))
      if (val < 500 && str.toLowerCase().includes('k')) val = val * 1000
      if (val >= 1000) {
        const lpa = ((val * USD_TO_INR) / 100000).toFixed(1).replace(/\.0$/, '')
        return `₹${lpa} LPA ($${Math.round(val / 1000)}k)`
      }
    }
  }

  // Fallback: prefix with ₹
  return `₹ ${str}`
}
