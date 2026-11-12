import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { MdAdd, MdDarkMode, MdLightMode, MdMenu } from 'react-icons/md'
import { useTheme } from '../../hooks/useTheme'

/**
 * Navbar — responsive top horizontal bar with mobile hamburger toggle,
 * title, dark mode switcher, and quick actions.
 */
function Navbar({ onToggleSidebar = () => {} }) {
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  // Map routes to page titles
  const pageTitles = {
    '/dashboard':    { title: 'Dashboard',         subtitle: 'Overview of your job search' },
    '/applications': { title: 'Applications',       subtitle: 'Manage your job applications' },
    '/interviews':   { title: 'Interviews',         subtitle: 'Track your interview schedule' },
    '/job-news':     { title: 'Hiring Radar',       subtitle: 'Live openings across MNCs & Startups' },
    '/offers':       { title: 'Offer Calculator',   subtitle: 'Compare job offers and in-hand salaries' },
    '/profile':      { title: 'Profile',            subtitle: 'Your personal information' },
  }

  const currentPath = location.pathname
  const pageInfo = pageTitles[currentPath] ||
    { title: 'Job Tracker', subtitle: '' }

  return (
    <header className="navbar">
      {/* Left: Mobile Hamburger & Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        {/* Hamburger menu button on mobile */}
        <button
          type="button"
          onClick={onToggleSidebar}
          className="mobile-menu-btn"
          aria-label="Toggle navigation menu"
        >
          <MdMenu size={24} />
        </button>

        <div>
          <h1 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text)', margin: 0, lineHeight: 1.2 }}>
            {pageInfo.title}
          </h1>
          {pageInfo.subtitle && (
            <p className="navbar-subtitle" style={{ fontSize: 12, color: 'var(--text-muted)', margin: 0 }}>
              {pageInfo.subtitle}
            </p>
          )}
        </div>
      </div>

      {/* Right: Actions: Theme Toggle & Quick Action */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <button
          onClick={toggleTheme}
          className="theme-toggle-btn"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
          type="button"
        >
          {theme === 'dark' ? (
            <>
              <MdLightMode size={16} color="#FBBF24" />
              <span className="theme-toggle-label">Light</span>
            </>
          ) : (
            <>
              <MdDarkMode size={16} color="#6366F1" />
              <span className="theme-toggle-label">Dark</span>
            </>
          )}
        </button>

        {currentPath === '/applications' && (
          <Link to="/applications/new" className="btn btn-primary btn-sm">
            <MdAdd size={18} />
            <span className="btn-new-app-label">New Application</span>
          </Link>
        )}
      </div>
    </header>
  )
}

export default Navbar
