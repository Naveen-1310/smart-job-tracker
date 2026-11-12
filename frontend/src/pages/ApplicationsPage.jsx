import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationService } from '../services/applicationService'
import { formatDate, getErrorMessage } from '../utils/helpers'
import StatusBadge from '../components/applications/StatusBadge'
import ConfirmDialog from '../components/common/ConfirmDialog'
import LoadingSpinner from '../components/common/LoadingSpinner'
import {
  MdAdd, MdEdit, MdDelete, MdSearch, MdOpenInNew,
  MdViewList, MdViewKanban, MdFileDownload, MdLocationOn, MdAttachMoney
} from 'react-icons/md'
import toast from 'react-hot-toast'

const KANBAN_COLUMNS = [
  { id: 'APPLIED', label: 'Applied', color: '#3B82F6', icon: '📥' },
  { id: 'ASSESSMENT', label: 'Assessment', color: '#F59E0B', icon: '📝' },
  { id: 'INTERVIEW_SCHEDULED', label: 'Interview Scheduled', color: '#0EA5E9', icon: '💬' },
  { id: 'SELECTED', label: 'Selected', color: '#10B981', icon: '🎉' },
  { id: 'REJECTED', label: 'Rejected', color: '#EF4444', icon: '❌' },
]

/**
 * ApplicationsPage — manages job applications with List view, Kanban Board,
 * CSV Export, search, filtering, and instant status updates.
 */
function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem('job_tracker_view_mode') || 'table'
  })

  useEffect(() => {
    localStorage.setItem('job_tracker_view_mode', viewMode)
  }, [viewMode])

  useEffect(() => {
    loadApplications()
  }, [keyword, statusFilter])

  const loadApplications = async () => {
    setLoading(true)
    try {
      const params = {}
      if (keyword) params.keyword = keyword
      if (statusFilter) params.status = statusFilter
      const response = await applicationService.getAll(params)
      setApplications(response.data)
    } catch (error) {
      toast.error('Failed to load applications')
    } finally {
      setLoading(false)
    }
  }

  // Quick status update for Kanban Board
  const handleStatusChange = async (appId, newStatus) => {
    const previous = [...applications]
    // Optimistic UI update
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: newStatus } : app))
    )
    try {
      await applicationService.updateStatus(appId, newStatus)
      toast.success(`Moved to ${newStatus.replace('_', ' ')}!`)
    } catch (error) {
      setApplications(previous)
      toast.error('Failed to update status')
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await applicationService.delete(deleteId)
      toast.success('Application deleted')
      setDeleteId(null)
      loadApplications()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  // Export to CSV spreadsheet
  const handleExportCSV = () => {
    if (applications.length === 0) {
      toast.error('No applications to export')
      return
    }

    const headers = ['ID,Company,Job Role,Location,Job Type,Applied Date,Salary Range,Status,Job URL,Notes']
    const rows = applications.map(app => [
      app.id,
      `"${(app.companyName || '').replace(/"/g, '""')}"`,
      `"${(app.jobRole || '').replace(/"/g, '""')}"`,
      `"${(app.jobLocation || '').replace(/"/g, '""')}"`,
      app.jobType || '',
      app.applicationDate || '',
      `"${(app.salaryRange || '').replace(/"/g, '""')}"`,
      app.status || '',
      `"${(app.jobPostingUrl || '').replace(/"/g, '""')}"`,
      `"${(app.notes || '').replace(/"/g, '""')}"`
    ].join(','))

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `job_applications_${new Date().toISOString().slice(0, 10)}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success('Downloaded CSV spreadsheet!')
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <h2>Job Applications</h2>
          <p>Track, manage, and visualize your job search pipeline</p>
        </div>

        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          {/* View Toggle */}
          <div className="view-toggle">
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
              onClick={() => setViewMode('table')}
              title="Table View"
            >
              <MdViewList size={16} /> Table
            </button>
            <button
              type="button"
              className={`view-toggle-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
              title="Kanban Board View"
            >
              <MdViewKanban size={16} /> Kanban
            </button>
          </div>

          {/* Export to CSV */}
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={handleExportCSV}
            title="Export all applications to CSV"
          >
            <MdFileDownload size={16} /> Export CSV
          </button>

          <Link to="/applications/new" className="btn btn-primary btn-sm">
            <MdAdd size={18} /> New Application
          </Link>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="filter-bar">
        <div className="search-input-wrapper">
          <MdSearch className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Search by company or role..."
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>

        <select
          className="form-control"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          style={{ width: 'auto', minWidth: 160 }}
        >
          <option value="">All Statuses</option>
          <option value="APPLIED">Applied</option>
          <option value="ASSESSMENT">Assessment</option>
          <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
          <option value="SELECTED">Selected</option>
          <option value="REJECTED">Rejected</option>
        </select>

        {(keyword || statusFilter) && (
          <button
            className="btn btn-secondary btn-sm"
            onClick={() => { setKeyword(''); setStatusFilter('') }}
          >
            Clear
          </button>
        )}

        <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 'auto' }}>
          {applications.length} result{applications.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Main Content Area: Table View or Kanban View */}
      {loading ? (
        <div className="card" style={{ padding: 40, textAlign: 'center' }}>
          <LoadingSpinner fullPage={false} />
        </div>
      ) : applications.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No applications found</h3>
            <p>Start tracking your job search applications</p>
            <Link to="/applications/new" className="btn btn-primary" style={{ marginTop: 16 }}>
              <MdAdd size={16} /> Add Your First Application
            </Link>
          </div>
        </div>
      ) : viewMode === 'kanban' ? (
        /* ─── KANBAN BOARD VIEW ─────────────────────────────────────── */
        <div className="kanban-board">
          {KANBAN_COLUMNS.map(col => {
            const colApps = applications.filter(app => app.status === col.id)
            return (
              <div key={col.id} className="kanban-col">
                <div className="kanban-col-header">
                  <div className="kanban-col-title" style={{ color: col.color }}>
                    <span>{col.icon}</span>
                    <span>{col.label}</span>
                  </div>
                  <span className="kanban-col-count">{colApps.length}</span>
                </div>

                <div className="kanban-cards">
                  {colApps.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)', fontSize: 12 }}>
                      No applications
                    </div>
                  ) : (
                    colApps.map(app => (
                      <div key={app.id} className="kanban-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                          <Link to={`/applications/${app.id}`} style={{ textDecoration: 'none' }}>
                            <div className="kanban-card-title">{app.companyName}</div>
                          </Link>
                          {app.jobPostingUrl && (
                            <a href={app.jobPostingUrl} target="_blank" rel="noreferrer" title="Open Job Posting" style={{ color: 'var(--primary)' }}>
                              <MdOpenInNew size={14} />
                            </a>
                          )}
                        </div>

                        <div className="kanban-card-subtitle">{app.jobRole}</div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 4, fontSize: 11, color: 'var(--text-muted)', marginBottom: 8 }}>
                          {app.jobLocation && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <MdLocationOn size={13} /> {app.jobLocation}
                            </span>
                          )}
                          {app.salaryRange && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                              <MdAttachMoney size={13} /> {app.salaryRange}
                            </span>
                          )}
                        </div>

                        <div className="kanban-card-footer">
                          <span>{formatDate(app.applicationDate)}</span>
                          <select
                            className="kanban-move-select"
                            value={app.status}
                            onChange={(e) => handleStatusChange(app.id, e.target.value)}
                            title="Move to another status"
                          >
                            <option value="APPLIED">Move: Applied</option>
                            <option value="ASSESSMENT">Move: Assessment</option>
                            <option value="INTERVIEW_SCHEDULED">Move: Interview</option>
                            <option value="SELECTED">Move: Selected</option>
                            <option value="REJECTED">Move: Rejected</option>
                          </select>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ─── TABLE VIEW ────────────────────────────────────────────── */
        <div className="card" style={{ padding: 0 }}>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Location</th>
                  <th>Applied On</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app, index) => (
                  <tr key={app.id}>
                    <td style={{ color: 'var(--text-muted)', fontSize: 13 }}>{index + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{app.companyName}</div>
                      {app.jobPostingUrl && (
                        <a
                          href={app.jobPostingUrl}
                          target="_blank"
                          rel="noreferrer"
                          style={{ fontSize: 11, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 2 }}
                        >
                          <MdOpenInNew size={11} /> View Posting
                        </a>
                      )}
                    </td>
                    <td>{app.jobRole}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{app.jobLocation || '—'}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{formatDate(app.applicationDate)}</td>
                    <td><StatusBadge status={app.status} /></td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link
                          to={`/applications/${app.id}`}
                          className="btn btn-secondary btn-sm"
                          title="View Details"
                        >
                          View
                        </Link>
                        <Link
                          to={`/applications/${app.id}/edit`}
                          className="btn btn-secondary btn-sm"
                          title="Edit"
                        >
                          <MdEdit size={14} />
                        </Link>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => setDeleteId(app.id)}
                          title="Delete"
                        >
                          <MdDelete size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Application"
        message="This will permanently delete the application and all its associated interviews. This cannot be undone."
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

export default ApplicationsPage
