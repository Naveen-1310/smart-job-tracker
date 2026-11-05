import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { applicationService } from '../services/applicationService'
import { getErrorMessage } from '../utils/helpers'
import toast from 'react-hot-toast'
import { MdArrowBack } from 'react-icons/md'

/**
 * AddApplicationPage — form to create a new job application.
 */
function AddApplicationPage() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const [form, setForm] = useState({
    companyName: '',
    jobRole: '',
    jobDescription: '',
    jobLocation: '',
    jobType: 'FULL_TIME',
    applicationDate: new Date().toISOString().split('T')[0], // Today's date
    salaryRange: '',
    jobPostingUrl: '',
    status: 'APPLIED',
    notes: '',
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
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

    setLoading(true)
    try {
      await applicationService.create(form)
      toast.success('Application added successfully!')
      navigate('/applications')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header">
        <div>
          <Link to="/applications" className="btn btn-secondary btn-sm" style={{ marginBottom: 8 }}>
            <MdArrowBack size={16} /> Back
          </Link>
          <h2>Add New Application</h2>
          <p>Track a new job you've applied for</p>
        </div>
      </div>

      <div className="card" style={{ maxWidth: 760 }}>
        <form onSubmit={handleSubmit}>

          {/* Row 1: Company + Role */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Company Name *</label>
              <input
                type="text"
                name="companyName"
                className="form-control"
                placeholder="e.g. Google, Infosys"
                value={form.companyName}
                onChange={handleChange}
              />
              {errors.companyName && <p className="form-error">{errors.companyName}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Job Role *</label>
              <input
                type="text"
                name="jobRole"
                className="form-control"
                placeholder="e.g. Software Engineer"
                value={form.jobRole}
                onChange={handleChange}
              />
              {errors.jobRole && <p className="form-error">{errors.jobRole}</p>}
            </div>
          </div>

          {/* Row 2: Location + Job Type */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Job Location</label>
              <input
                type="text"
                name="jobLocation"
                className="form-control"
                placeholder="e.g. Bangalore, Remote"
                value={form.jobLocation}
                onChange={handleChange}
              />
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

          {/* Row 3: Date + Salary */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Application Date *</label>
              <input
                type="date"
                name="applicationDate"
                className="form-control"
                value={form.applicationDate}
                onChange={handleChange}
              />
              {errors.applicationDate && <p className="form-error">{errors.applicationDate}</p>}
            </div>

            <div className="form-group">
              <label className="form-label">Salary Range</label>
              <input
                type="text"
                name="salaryRange"
                className="form-control"
                placeholder="e.g. 8-12 LPA"
                value={form.salaryRange}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Row 4: Status + URL */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div className="form-group">
              <label className="form-label">Application Status</label>
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
              <input
                type="url"
                name="jobPostingUrl"
                className="form-control"
                placeholder="https://..."
                value={form.jobPostingUrl}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Job Description</label>
            <textarea
              name="jobDescription"
              className="form-control"
              placeholder="Key responsibilities, requirements..."
              rows={4}
              value={form.jobDescription}
              onChange={handleChange}
            />
          </div>

          {/* Notes */}
          <div className="form-group">
            <label className="form-label">Personal Notes</label>
            <textarea
              name="notes"
              className="form-control"
              placeholder="Interview tips, contacts, impressions..."
              rows={3}
              value={form.notes}
              onChange={handleChange}
            />
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
            <Link to="/applications" className="btn btn-secondary">Cancel</Link>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Application'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddApplicationPage
