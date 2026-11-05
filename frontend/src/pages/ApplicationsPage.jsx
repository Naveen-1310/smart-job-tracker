import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { applicationService } from '../services/applicationService'
import { formatDate, getErrorMessage } from '../utils/helpers'
import StatusBadge from '../components/applications/StatusBadge'
import ConfirmDialog from '../components/common/ConfirmDialog'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { MdAdd, MdEdit, MdDelete, MdSearch, MdOpenInNew } from 'react-icons/md'
import toast from 'react-hot-toast'

/**
 * ApplicationsPage — list all job applications with search, filter, and CRUD actions.
 */
function ApplicationsPage() {
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [keyword, setKeyword] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)

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

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2>Job Applications</h2>
          <p>Track all your job applications in one place</p>
        </div>
        <Link to="/applications/new" className="btn btn-primary">
          <MdAdd size={18} /> New Application
        </Link>
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

      {/* Applications Table */}
      <div className="card" style={{ padding: 0 }}>
        {loading ? (
          <LoadingSpinner fullPage={false} />
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <h3>No applications found</h3>
            <p>Start tracking your job applications</p>
            <Link to="/applications/new" className="btn btn-primary" style={{ marginTop: 16 }}>
              <MdAdd size={16} /> Add Your First Application
            </Link>
          </div>
        ) : (
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
        )}
      </div>

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
