import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MdAdd } from 'react-icons/md'

/**
 * Navbar — top horizontal bar showing current page title and action button.
 */
function Navbar() {
  const location = useLocation()

  // Map routes to page titles
  const pageTitles = {
    '/dashboard':    { title: 'Dashboard',         subtitle: 'Overview of your job search' },
    '/applications': { title: 'Applications',       subtitle: 'Manage your job applications' },
    '/interviews':   { title: 'Interviews',         subtitle: 'Track your interview schedule' },
    '/profile':      { title: 'Profile',            subtitle: 'Your personal information' },
  }

  const currentPath = location.pathname
  const pageInfo = pageTitles[currentPath] ||
    { title: 'Job Tracker', subtitle: '' }

  return (
    <header style={{
      height: 'var(--navbar-height)',
      background: 'var(--white)',
      borderBottom: '1px solid var(--border)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 32px',
      position: 'fixed',
      top: 0,
      left: 'var(--sidebar-width)',
      right: 0,
      zIndex: 99,
    }}>
      {/* Page title */}
      <div>
        <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0 }}>
          {pageInfo.title}
        </h1>
        {pageInfo.subtitle && (
          <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
            {pageInfo.subtitle}
          </p>
        )}
      </div>

      {/* Quick action button */}
      {currentPath === '/applications' && (
        <Link to="/applications/new" className="btn btn-primary btn-sm">
          <MdAdd size={18} />
          New Application
        </Link>
      )}
    </header>
  )
}

export default Navbar
