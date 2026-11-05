import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { authService } from '../services/authService'
import { getErrorMessage } from '../utils/helpers'
import toast from 'react-hot-toast'
import { MdPerson, MdEmail, MdLock, MdTrackChanges } from 'react-icons/md'

/**
 * RegisterPage — new user registration form.
 */
function RegisterPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' })
    }
  }

  const validate = () => {
    const newErrors = {}
    if (!form.name.trim()) newErrors.name = 'Name is required'
    if (!form.email) newErrors.email = 'Email is required'
    if (!form.password) newErrors.password = 'Password is required'
    else if (form.password.length < 6) newErrors.password = 'Minimum 6 characters'
    if (form.password !== form.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match'
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
      const { name, email, password } = form
      const response = await authService.register({ name, email, password })
      login(response.data)
      toast.success('Account created successfully! Welcome aboard 🎉')
      navigate('/dashboard')
    } catch (error) {
      toast.error(getErrorMessage(error))
    } finally {
      setLoading(false)
    }
  }

  const inputWithIcon = (icon, name, type, placeholder) => (
    <div style={{ position: 'relative' }}>
      <span style={{
        position: 'absolute', left: 12, top: '50%',
        transform: 'translateY(-50%)', color: 'var(--text-muted)',
      }}>
        {icon}
      </span>
      <input
        type={type}
        name={name}
        className="form-control"
        placeholder={placeholder}
        value={form[name]}
        onChange={handleChange}
        style={{ paddingLeft: 38 }}
      />
    </div>
  )

  return (
    <div className="auth-page">
      <div className="auth-card">

        <div className="auth-logo">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{
              width: 42, height: 42, background: 'var(--primary)',
              borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <MdTrackChanges size={24} color="white" />
            </div>
          </div>
          <h1>JobTracker</h1>
          <p>Smart Job Application Tracker</p>
        </div>

        <h2 className="auth-title">Create your account</h2>
        <p className="auth-subtitle">Start tracking your job applications today</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Full Name</label>
            {inputWithIcon(<MdPerson size={18} />, 'name', 'text', 'John Doe')}
            {errors.name && <p className="form-error">{errors.name}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Email address</label>
            {inputWithIcon(<MdEmail size={18} />, 'email', 'email', 'you@example.com')}
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            {inputWithIcon(<MdLock size={18} />, 'password', 'password', 'Min 6 characters')}
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            {inputWithIcon(<MdLock size={18} />, 'confirmPassword', 'password', 'Repeat password')}
            {errors.confirmPassword && <p className="form-error">{errors.confirmPassword}</p>}
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-block btn-lg"
            disabled={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{' '}
          <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  )
}

export default RegisterPage
