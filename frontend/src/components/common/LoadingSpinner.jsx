import React from 'react'

/**
 * LoadingSpinner — centered spinner for loading states.
 */
function LoadingSpinner({ fullPage = true }) {
  if (fullPage) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg)',
      }}>
        <div className="spinner" />
      </div>
    )
  }

  return (
    <div className="spinner-container">
      <div className="spinner" />
    </div>
  )
}

export default LoadingSpinner
