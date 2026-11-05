import React from 'react'
import { getStatusBadgeClass, getStatusLabel } from '../../utils/helpers'

/**
 * StatusBadge — displays a colored badge for application status.
 *
 * Props:
 * - status: 'APPLIED' | 'ASSESSMENT' | 'INTERVIEW_SCHEDULED' | 'SELECTED' | 'REJECTED'
 */
function StatusBadge({ status }) {
  return (
    <span className={getStatusBadgeClass(status)}>
      {getStatusLabel(status)}
    </span>
  )
}

export default StatusBadge
