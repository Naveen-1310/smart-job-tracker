import React from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/layout/ProtectedRoute'

// Pages
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import ApplicationsPage from './pages/ApplicationsPage'
import AddApplicationPage from './pages/AddApplicationPage'
import EditApplicationPage from './pages/EditApplicationPage'
import ApplicationDetailPage from './pages/ApplicationDetailPage'
import InterviewsPage from './pages/InterviewsPage'
import ProfilePage from './pages/ProfilePage'

/**
 * App.jsx — Root component.
 *
 * - BrowserRouter: enables URL-based routing
 * - AuthProvider: provides auth state (user, token) to all children
 * - ProtectedRoute: wraps protected pages and redirects to login if not authenticated
 */
function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public routes — accessible without login */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes — require authentication */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
            <Route path="/applications/new" element={<AddApplicationPage />} />
            <Route path="/applications/:id/edit" element={<EditApplicationPage />} />
            <Route path="/applications/:id" element={<ApplicationDetailPage />} />
            <Route path="/interviews" element={<InterviewsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
