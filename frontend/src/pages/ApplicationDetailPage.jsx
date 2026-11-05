import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { applicationService } from '../services/applicationService'
import { formatDate, formatDateTime, getJobTypeLabel, getErrorMessage } from '../utils/helpers'
import StatusBadge from '../components/applications/StatusBadge'
import ConfirmDialog from '../components/common/ConfirmDialog'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { MdEdit, MdDelete, MdArrowBack, MdOpenInNew, MdCalendarToday, MdWork, MdLocationOn, MdAttachMoney } from 'react-icons/md'
import toast from 'react-hot-toast'

/**
 * ApplicationDetailPage — full view of a single job application.
 */
function ApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const response = await applicationService.getById(id)
        setApp(response.data)
      } catch (error) {
        toast.error('Failed to load application')
        navigate('/applications')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await applicationService.delete(id)
      toast.success('Application deleted')
      navigate('/applications')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  if (loading) return <LoadingSpinner fullPage={false} />
  if (!app) return null

  const InfoRow = ({ icon, label, value }) => (
    value ? (
      <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16 }}>
        <span style={{ color: 'var(--text-muted)', flexShrink: 0, marginTop: 1 }}>
          {React.cloneElement(icon, { size: 18 })}
        </span>
        <div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
          <div style={{ fontSize: 14, fontWeight: 500 }}>{value}</div>
        </div>
      </div>
    ) : null
  )

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <Link to="/applications" className="btn btn-secondary btn-sm" style={{ marginBottom: 8 }}>
            <MdArrowBack size={16} /> Back
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2>{app.companyName}</h2>
            <StatusBadge status={app.status} />
          </div>
          <p>{app.jobRole}</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Link to={`/applications/${id}/edit`} className="btn btn-secondary">
            <MdEdit size={16} /> Edit
          </Link>
          <button className="btn btn-danger" onClick={() => setShowDeleteDialog(true)}>
            <MdDelete size={16} /> Delete
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Application Details */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 20 }}>Application Details</h3>

          <InfoRow icon={<MdWork />} label="Job Role" value={app.jobRole} />
          <InfoRow icon={<MdLocationOn />} label="Location" value={app.jobLocation} />
          <InfoRow icon={<MdCalendarToday />} label="Applied On" value={formatDate(app.applicationDate)} />
          <InfoRow icon={<MdAttachMoney />} label="Salary Range" value={app.salaryRange} />
          <InfoRow icon={<MdWork />} label="Job Type" value={getJobTypeLabel(app.jobType)} />

          {app.jobPostingUrl && (
            <a
              href={app.jobPostingUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 4, display: 'inline-flex' }}
            >
              <MdOpenInNew size={14} /> View Job Posting
            </a>
          )}
        </div>

        {/* Metadata */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 20 }}>Timeline</h3>
          <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
            <div style={{ marginBottom: 8 }}>
              <strong>Added on:</strong> {formatDateTime(app.createdAt)}
            </div>
            <div style={{ marginBottom: 8 }}>
              <strong>Last updated:</strong> {formatDateTime(app.updatedAt)}
            </div>
            <div>
              <strong>Interviews scheduled:</strong> {app.interviewCount || 0}
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      {app.jobDescription && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 className="card-title" style={{ marginBottom: 12 }}>Job Description</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {app.jobDescription}
          </p>
        </div>
      )}

      {/* Notes */}
      {app.notes && (
        <div className="card" style={{ marginTop: 16 }}>
          <h3 className="card-title" style={{ marginBottom: 12 }}>Personal Notes</h3>
          <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
            {app.notes}
          </p>
        </div>
      )}

      <ConfirmDialog
        isOpen={showDeleteDialog}
        title="Delete Application"
        message={`Delete application for ${app.companyName}? This will also remove all associated interviews.`}
        onConfirm={handleDelete}
        onCancel={() => setShowDeleteDialog(false)}
        loading={deleting}
      />
    </div>
  )
}

export default ApplicationDetailPage
