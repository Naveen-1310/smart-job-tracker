import React, { useState, useEffect } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import LoadingSpinner from '../common/LoadingSpinner'

/**
 * ProtectedRoute — wraps all authenticated pages with responsive sidebar drawer,
 * backdrop overlay, and top navbar.
 */
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()

  // Auto-close sidebar on route change on mobile
  useEffect(() => {
    setSidebarOpen(false)
  }, [location.pathname])

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-layout">
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          className="sidebar-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar with mobile drawer support */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main Content Area */}
      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen(prev => !prev)} />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ProtectedRoute
