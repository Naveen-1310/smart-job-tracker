import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { applicationService } from '../services/applicationService'
import { getErrorMessage } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'
import toast from 'react-hot-toast'
import { MdArrowBack } from 'react-icons/md'

/**
 * EditApplicationPage — pre-fills form with existing application data.
 */
function EditApplicationPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    companyName: '', jobRole: '', jobDescription: '', jobLocation: '',
    jobType: 'FULL_TIME', applicationDate: '', salaryRange: '',
    jobPostingUrl: '', status: 'APPLIED', notes: '',
  })

  useEffect(() => {
    const load = async () => {
      try {
        const response = await applicationService.getById(id)
        const app = response.data
        setForm({
          companyName:    app.companyName || '',
          jobRole:        app.jobRole || '',
          jobDescription: app.jobDescription || '',
          jobLocation:    app.jobLocation || '',
          jobType:        app.jobType || 'FULL_TIME',
          applicationDate: app.applicationDate || '',
          salaryRange:    app.salaryRange || '',
          jobPostingUrl:  app.jobPostingUrl || '',
          status:         app.status || 'APPLIED',
          notes:          app.notes || '',
        })
      } catch (error) {
        toast.error('Failed to load application')
        navigate('/applications')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [id])

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' })
  }

  const validate = () => {
    const newErrors = {}
    if (!form.companyName.trim()) newErrors.companyName = 'Company name is required'
    if (!form.jobRole.trim()) newErrors.jobRole = 'Job role is required'
    if (!form.applicationDate) newErrors.applicationDate = 'Application date is required'
    return newErrors
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors)
      return
    }

    setSaving(true)
    try {
      await applicationService.update(id, form)
      toast.success('Application updated!')
      navigate(`/applications/${id}`)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner fullPage={false} />

  return (
    <div>
      <div className="page-header">
        <div>
          <Link to={`/applications/${id}`} className="btn btn-secondary btn-sm" style={{ marginBottom: 8 }}>
            <MdArrowBack size={16} /> Back
          </Link>
          <h2>Edit Application</h2>
          <p>Update your application details</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 760 }}>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input type="text" name="companyName" className="form-control" value={form.companyName} onChange={handleChange} />
              {errors.companyName && <p className="form-error">{errors.companyName}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Job Role *</label>
              <input type="text" name="jobRole" className="form-control" value={form.jobRole} onChange={handleChange} />
              {errors.jobRole && <p className="form-error">{errors.jobRole}</p>}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Location</label>
              <input type="text" name="jobLocation" className="form-control" value={form.jobLocation} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select name="jobType" className="form-control" value={form.jobType} onChange={handleChange}>
                <option value="FULL_TIME">Full-time</option>
                <option value="INTERNSHIP">Internship</option>
                <option value="REMOTE">Remote</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Application Date *</label>
              <input type="date" name="applicationDate" className="form-control" value={form.applicationDate} onChange={handleChange} />
              {errors.applicationDate && <p className="form-error">{errors.applicationDate}</p>}
            </div>
            <div className="form-group">
              <label className="form-label">Salary Range</label>
              <input type="text" name="salaryRange" className="form-control" value={form.salaryRange} onChange={handleChange} placeholder="e.g. 8-12 LPA" />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select name="status" className="form-control" value={form.status} onChange={handleChange}>
                <option value="APPLIED">Applied</option>
                <option value="ASSESSMENT">Assessment</option>
                <option value="INTERVIEW_SCHEDULED">Interview Scheduled</option>
                <option value="SELECTED">Selected</option>
                <option value="REJECTED">Rejected</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Job Posting URL</label>
              <input type="url" name="jobPostingUrl" className="form-control" value={form.jobPostingUrl} onChange={handleChange} placeholder="https://..." />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Job Description</label>
            <textarea name="jobDescription" className="form-control" rows={4} value={form.jobDescription} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label className="form-label">Personal Notes</label>
            <textarea name="notes" className="form-control" rows={3} value={form.notes} onChange={handleChange} />
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Link to={`/applications/${id}`} className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Update Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditApplicationPage
