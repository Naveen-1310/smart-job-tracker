import React from 'react'
import { MdWarning } from 'react-icons/md'

/**
 * ConfirmDialog — modal confirmation before destructive actions (e.g. delete).
 *
 * Props:
 * - isOpen: boolean
 * - title: string
 * - message: string
 * - onConfirm: () => void
 * - onCancel: () => void
 * - confirmText: string (default 'Delete')
 */
function ConfirmDialog({
  isOpen,
  title = 'Confirm Action',
  message = 'Are you sure? This action cannot be undone.',
  onConfirm,
  onCancel,
  confirmText = 'Delete',
  loading = false,
}) {
  if (!isOpen) return null

  return (
    <div className="dialog-overlay" onClick={onCancel}>
      <div className="dialog-box" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <MdWarning size={22} color="var(--danger)" />
          <h3>{title}</h3>
        </div>
        <p>{message}</p>
        <div className="dialog-actions">
          <button
            className="btn btn-secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Deleting...' : confirmText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmDialog
