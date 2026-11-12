import React from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'
import toast from 'react-hot-toast'
import {
  MdDashboard,
  MdWork,
  MdEventNote,
  MdPerson,
  MdLogout,
  MdTrackChanges,
  MdCalculate,
  MdCampaign,
  MdClose,
} from 'react-icons/md'

/**
 * Sidebar — navigation panel with desktop fixed & mobile off-canvas drawer support.
 */
function Sidebar({ isOpen = false, onClose = () => {} }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    onClose()
    toast.success('Logged out successfully')
    navigate('/login')
  }

  const navItems = [
    { to: '/dashboard',    icon: <MdDashboard size={20} />,  label: 'Dashboard' },
    { to: '/applications', icon: <MdWork size={20} />,       label: 'Applications' },
    { to: '/interviews',   icon: <MdEventNote size={20} />,  label: 'Interviews' },
    { to: '/job-news',     icon: <MdCampaign size={20} />,   label: 'Hiring Radar' },
    { to: '/offers',       icon: <MdCalculate size={20} />,  label: 'Offer Calculator' },
    { to: '/profile',      icon: <MdPerson size={20} />,     label: 'Profile' },
  ]

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      {/* Logo & Mobile Close Header */}
      <div style={{
        padding: '18px 20px',
        borderBottom: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34,
            height: 34,
            background: 'var(--primary)',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <MdTrackChanges size={20} color="white" />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>
              JobTracker
            </div>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              Smart & Simple
            </div>
          </div>
        </div>

        {/* Close Button on Mobile Drawer */}
        <button
          onClick={onClose}
          className="mobile-close-btn"
          aria-label="Close navigation menu"
        >
          <MdClose size={20} />
        </button>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '12px 10px', overflowY: 'auto' }}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={onClose}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 12px',
              borderRadius: 8,
              textDecoration: 'none',
              marginBottom: 4,
              color: isActive ? 'var(--primary)' : 'var(--text-muted)',
              background: isActive ? 'var(--primary-light)' : 'transparent',
              fontWeight: isActive ? 600 : 400,
              fontSize: 14,
              boxShadow: isActive ? '0 0 16px rgba(99, 102, 241, 0.22)' : 'none',
              borderLeft: isActive ? '3px solid var(--primary)' : '3px solid transparent',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
            })}
          >
            {item.icon}
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User Info & Logout at bottom */}
      <div style={{
        padding: '16px',
        borderTop: '1px solid var(--border)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginBottom: 12,
        }}>
          <div style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'var(--primary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 700,
            fontSize: 14,
            flexShrink: 0,
          }}>
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <div style={{
              fontWeight: 600,
              fontSize: 13,
              color: 'var(--text)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {user?.name}
            </div>
            <div style={{
              fontSize: 11,
              color: 'var(--text-muted)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {user?.email}
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="btn btn-secondary btn-block btn-sm"
          style={{ justifyContent: 'flex-start', gap: 8, width: '100%' }}
        >
          <MdLogout size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}

export default Sidebar
