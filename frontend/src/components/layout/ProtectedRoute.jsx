import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import Sidebar from './Sidebar'
import Navbar from './Navbar'
import LoadingSpinner from '../common/LoadingSpinner'

/**
 * ProtectedRoute — wraps all authenticated pages.
 *
 * - If loading (checking localStorage): show spinner
 * - If not authenticated: redirect to /login
 * - If authenticated: render the layout + page
 *
 * <Outlet /> renders the matched child route (the actual page).
 */
function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth()

  if (loading) {
    return <LoadingSpinner />
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Navbar />
        <main className="page-content">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default ProtectedRoute
