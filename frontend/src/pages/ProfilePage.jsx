import React, { useState, useEffect } from 'react'
import { userService } from '../services/dashboardService'
import { getErrorMessage, formatDate } from '../utils/helpers'
import LoadingSpinner from '../components/common/LoadingSpinner'
import { MdPerson, MdEmail, MdPhone, MdSchool, MdCode, MdLink, MdEdit, MdSave, MdClose, MdLock } from 'react-icons/md'
import toast from 'react-hot-toast'

/**
 * ProfilePage — view and update user profile.
 */
function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [showPasswordForm, setShowPasswordForm] = useState(false)

  const [form, setForm] = useState({
    name: '', phone: '', college: '', skills: '', linkedinUrl: '', githubUrl: '',
  })
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '', newPassword: '', confirmNewPassword: '',
  })

  useEffect(() => {
    loadProfile()
  }, [])

  const loadProfile = async () => {
    try {
      const response = await userService.getProfile()
      setProfile(response.data)
      setForm({
        name:        response.data.name || '',
        phone:       response.data.phone || '',
        college:     response.data.college || '',
        skills:      response.data.skills || '',
        linkedinUrl: response.data.linkedinUrl || '',
        githubUrl:   response.data.githubUrl || '',
      })
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })
  const handlePasswordChange = (e) => setPasswordForm({ ...passwordForm, [e.target.name]: e.target.value })

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    if (!form.name.trim()) { toast.error('Name is required'); return }
    setSaving(true)
    try {
      const response = await userService.updateProfile(form)
      setProfile(response.data)
      setEditing(false)
      toast.success('Profile updated!')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword !== passwordForm.confirmNewPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters')
      return
    }
    setSaving(true)
    try {
      await userService.updateProfile({
        currentPassword: passwordForm.currentPassword,
        newPassword:     passwordForm.newPassword,
      })
      toast.success('Password changed successfully!')
      setPasswordForm({ currentPassword: '', newPassword: '', confirmNewPassword: '' })
      setShowPasswordForm(false)
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <LoadingSpinner fullPage={false} />

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div>
          <h2>My Profile</h2>
          <p>Manage your account information</p>
        </div>
        {!editing && (
          <button className="btn btn-primary" onClick={() => setEditing(true)}>
            <MdEdit size={16} /> Edit Profile
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 16, alignItems: 'start' }}>

        {/* Avatar Card */}
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80,
            background: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px',
            fontSize: 30, color: 'white', fontWeight: 700,
          }}>
            {profile?.name?.charAt(0).toUpperCase()}
          </div>
          <h3 style={{ fontWeight: 700, marginBottom: 4 }}>{profile?.name}</h3>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>{profile?.email}</p>

          <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'left' }}>
            <div style={{ marginBottom: 6 }}>
              <strong>Member since:</strong><br />
              {formatDate(profile?.createdAt)}
            </div>
          </div>

          <hr style={{ margin: '16px 0', borderColor: 'var(--border)' }} />

          <button
            className="btn btn-secondary btn-sm btn-block"
            onClick={() => setShowPasswordForm(!showPasswordForm)}
          >
            <MdLock size={14} /> Change Password
          </button>
        </div>

        {/* Profile Details */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 20 }}>
            {editing ? 'Edit Profile' : 'Profile Information'}
          </h3>

          {editing ? (
            <form onSubmit={handleSaveProfile}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input type="text" name="name" className="form-control" value={form.name} onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label className="form-label">Phone</label>
                  <input type="tel" name="phone" className="form-control" value={form.phone} onChange={handleChange} placeholder="+91 9876543210" />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">College / University</label>
                <input type="text" name="college" className="form-control" value={form.college} onChange={handleChange} placeholder="e.g. IIT Delhi" />
              </div>
              <div className="form-group">
                <label className="form-label">Skills (comma separated)</label>
                <input type="text" name="skills" className="form-control" value={form.skills} onChange={handleChange} placeholder="Java, Spring Boot, React, MySQL" />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group">
                  <label className="form-label">LinkedIn URL</label>
                  <input type="url" name="linkedinUrl" className="form-control" value={form.linkedinUrl} onChange={handleChange} placeholder="https://linkedin.com/in/..." />
                </div>
                <div className="form-group">
                  <label className="form-label">GitHub URL</label>
                  <input type="url" name="githubUrl" className="form-control" value={form.githubUrl} onChange={handleChange} placeholder="https://github.com/..." />
                </div>
              </div>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                  <MdClose size={15} /> Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={saving}>
                  <MdSave size={15} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {[
                { icon: <MdPerson size={16} />, label: 'Name', value: profile?.name },
                { icon: <MdEmail size={16} />, label: 'Email', value: profile?.email },
                { icon: <MdPhone size={16} />, label: 'Phone', value: profile?.phone },
                { icon: <MdSchool size={16} />, label: 'College', value: profile?.college },
                { icon: <MdCode size={16} />, label: 'Skills', value: profile?.skills },
                { icon: <MdLink size={16} />, label: 'LinkedIn', value: profile?.linkedinUrl },
                { icon: <MdLink size={16} />, label: 'GitHub', value: profile?.githubUrl },
              ].map(({ icon, label, value }) => (
                value ? (
                  <div key={label} style={{ display: 'flex', gap: 10, marginBottom: 16, alignItems: 'flex-start' }}>
                    <span style={{ color: 'var(--text-muted)', marginTop: 2 }}>{icon}</span>
                    <div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 2 }}>{label}</div>
                      {(label === 'LinkedIn' || label === 'GitHub') ? (
                        <a href={value} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontSize: 14 }}>{value}</a>
                      ) : (
                        <div style={{ fontSize: 14 }}>{value}</div>
                      )}
                    </div>
                  </div>
                ) : null
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Change Password Form */}
      {showPasswordForm && (
        <div className="card" style={{ marginTop: 16, maxWidth: 500 }}>
          <h3 className="card-title" style={{ marginBottom: 20 }}>Change Password</h3>
          <form onSubmit={handleChangePassword}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input type="password" name="currentPassword" className="form-control" value={passwordForm.currentPassword} onChange={handlePasswordChange} />
            </div>
            <div className="form-group">
              <label className="form-label">New Password</label>
              <input type="password" name="newPassword" className="form-control" value={passwordForm.newPassword} onChange={handlePasswordChange} placeholder="Min 6 characters" />
            </div>
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <input type="password" name="confirmNewPassword" className="form-control" value={passwordForm.confirmNewPassword} onChange={handlePasswordChange} />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowPasswordForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

export default ProfilePage
