import React, { useState, useEffect } from 'react'
import { interviewService } from '../services/interviewService'
import { applicationService } from '../services/applicationService'
import { formatDateTime, getErrorMessage } from '../utils/helpers'
import ConfirmDialog from '../components/common/ConfirmDialog'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { MdAdd, MdEdit, MdDelete, MdSave, MdClose, MdOpenInNew, MdSchedule } from 'react-icons/md'
import toast from 'react-hot-toast'

/**
 * InterviewsPage — manage all interview rounds.
 * Includes inline add/edit forms.
 */
function InterviewsPage() {
  const [interviews, setInterviews] = useState([])
  const [applications, setApplications] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editId, setEditId] = useState(null)
  const [deleteId, setDeleteId] = useState(null)
  const [deleting, setDeleting] = useState(false)
  const [saving, setSaving] = useState(false)

  const emptyForm = {
    jobApplicationId: '',
    interviewDate: '',
    round: '',
    interviewType: 'ONLINE',
    meetingLink: '',
    preparationNotes: '',
    status: 'SCHEDULED',
  }
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    try {
      const [interviewsRes, appsRes] = await Promise.all([
        interviewService.getAll(),
        applicationService.getAll(),
      ])
      setInterviews(interviewsRes.data)
      setApplications(appsRes.data)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleAdd = () => {
    setForm(emptyForm)
    setEditId(null)
    setShowForm(true)
  }

  const handleEdit = (interview) => {
    setForm({
      jobApplicationId: interview.jobApplicationId,
      interviewDate: interview.interviewDate?.slice(0, 16), // yyyy-MM-ddTHH:mm
      round: interview.round,
      interviewType: interview.interviewType || 'ONLINE',
      meetingLink: interview.meetingLink || '',
      preparationNotes: interview.preparationNotes || '',
      status: interview.status || 'SCHEDULED',
    })
    setEditId(interview.id)
    setShowForm(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.jobApplicationId || !form.interviewDate || !form.round) {
      toast.error('Please fill required fields')
      return
    }

    setSaving(true)
    try {
      const payload = { ...form, jobApplicationId: Number(form.jobApplicationId) }
      if (editId) {
        await interviewService.update(editId, payload)
        toast.success('Interview updated!')
      } else {
        await interviewService.create(payload)
        toast.success('Interview scheduled!')
      }
      setShowForm(false)
      loadData()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await interviewService.delete(deleteId)
      toast.success('Interview deleted')
      setDeleteId(null)
      loadData()
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setDeleting(false)
    }
  }

  const statusBadge = (status) => {
    const styles = {
      SCHEDULED:  { bg: '#E0F2FE', color: '#0369A1' },
      COMPLETED:  { bg: '#DCFCE7', color: '#15803D' },
      CANCELLED:  { bg: '#FEE2E2', color: '#991B1B' },
    }
    const s = styles[status] || styles.SCHEDULED
    return (
      <span style={{ background: s.bg, color: s.color, padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 500 }}>
        {status}
      </span>
    )
  }

  if (loading) return <LoadingSpinner fullPage={false} />

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>Interviews</h2>
          <p>Track your scheduled interview rounds</p>
        </div>
        <button className="btn btn-primary" onClick={handleAdd}>
          <MdAdd size={18} /> Schedule Interview
        </button>
      </div>

      {/* Add/Edit Form Panel */}
      {showForm && (
        <div className="card" style={{ marginBottom: 20, borderLeft: '3px solid var(--primary)' }}>
          <div className="card-header">
            <h3 className="card-title">{editId ? 'Edit Interview' : 'Schedule New Interview'}</h3>
            <button className="btn btn-secondary btn-sm" onClick={() => setShowForm(false)}>
              <MdClose size={16} />
            </button>
          </div>

          <form onSubmit={handleSave}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Job Application *</label>
                <select name="jobApplicationId" className="form-control" value={form.jobApplicationId} onChange={handleChange}>
                  <option value="">Select application...</option>
                  {applications.map(app => (
                    <option key={app.id} value={app.id}>{app.companyName} — {app.jobRole}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Round *</label>
                <input type="text" name="round" className="form-control" placeholder="e.g. Round 1 - Technical" value={form.round} onChange={handleChange} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
              <div className="form-group">
                <label className="form-label">Date & Time *</label>
                <input type="datetime-local" name="interviewDate" className="form-control" value={form.interviewDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select name="interviewType" className="form-control" value={form.interviewType} onChange={handleChange}>
                  <option value="ONLINE">Online</option>
                  <option value="OFFLINE">Offline</option>
                  <option value="PHONE">Phone</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Status</label>
                <select name="status" className="form-control" value={form.status} onChange={handleChange}>
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Meeting Link</label>
              <input type="url" name="meetingLink" className="form-control" placeholder="https://meet.google.com/..." value={form.meetingLink} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label className="form-label">Preparation Notes</label>
              <textarea name="preparationNotes" className="form-control" rows={3} placeholder="Topics to revise, key questions..." value={form.preparationNotes} onChange={handleChange} />
            </div>

            <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <MdSave size={16} /> {saving ? 'Saving...' : editId ? 'Update' : 'Schedule'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Interviews Table */}
      <div className="card" style={{ padding: 0 }}>
        {interviews.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><MdSchedule size={48} /></div>
            <h3>No interviews scheduled</h3>
            <p>Click "Schedule Interview" to add your first one</p>
          </div>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Round</th>
                  <th>Date & Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {interviews.map(interview => (
                  <tr key={interview.id}>
                    <td style={{ fontWeight: 600 }}>{interview.companyName}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{interview.jobRole}</td>
                    <td>{interview.round}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{formatDateTime(interview.interviewDate)}</td>
                    <td>{interview.interviewType}</td>
                    <td>{statusBadge(interview.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                        {interview.meetingLink && (
                          <a href={interview.meetingLink} target="_blank" rel="noreferrer" className="btn btn-secondary btn-sm" title="Join Meeting">
                            <MdOpenInNew size={14} />
                          </a>
                        )}
                        <button className="btn btn-secondary btn-sm" onClick={() => handleEdit(interview)}>
                          <MdEdit size={14} />
                        </button>
                        <button className="btn btn-danger btn-sm" onClick={() => setDeleteId(interview.id)}>
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

      <ConfirmDialog
        isOpen={!!deleteId}
        title="Delete Interview"
        message="Are you sure you want to delete this interview?"
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
        loading={deleting}
      />
    </div>
  )
}

export default InterviewsPage
