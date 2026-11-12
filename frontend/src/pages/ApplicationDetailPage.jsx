import React, { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { applicationService } from '../services/applicationService'
import { formatDate, formatDateTime, getJobTypeLabel, getErrorMessage } from '../utils/helpers'
import StatusBadge from '../components/applications/StatusBadge'
import ConfirmDialog from '../components/common/ConfirmDialog'
import LoadingSpinner from '../components/common/LoadingSpinner'
import {
  MdEdit, MdDelete, MdArrowBack, MdOpenInNew, MdCalendarToday,
  MdWork, MdLocationOn, MdAttachMoney, MdPsychology, MdCheckCircle,
  MdRadioButtonUnchecked, MdAssignmentTurnedIn, MdStar
} from 'react-icons/md'
import { FaRupeeSign } from 'react-icons/fa'
import toast from 'react-hot-toast'

// Common technical skills library for ATS matching
const TECH_SKILLS = [
  'Java', 'Spring Boot', 'Spring Security', 'REST API', 'MySQL', 'SQL',
  'Hibernate', 'JdbcTemplate', 'React', 'JavaScript', 'HTML', 'CSS',
  'Microservices', 'Docker', 'AWS', 'Git', 'Kafka', 'Redis', 'DSA',
  'System Design', 'Linux', 'Unit Testing', 'JUnit', 'Mockito', 'Cloud'
]

// Common interview questions by domain
const PREP_QUESTIONS = [
  { id: 'q1', category: 'Java & OOPs', text: 'Explain the internal working of HashMap and equals()/hashCode() contract.' },
  { id: 'q2', category: 'Java & OOPs', text: 'Difference between String, StringBuilder, and StringBuffer in multithreading.' },
  { id: 'q3', category: 'Spring Boot', text: 'Explain the lifecycle of a Spring Bean and how Dependency Injection works.' },
  { id: 'q4', category: 'Spring Boot', text: 'Difference between Spring Boot @RestController vs @Controller and how JWT filters authenticate.' },
  { id: 'q5', category: 'Database & SQL', text: 'What is Indexing in MySQL and how do B-Trees optimize SELECT queries?' },
  { id: 'q6', category: 'Database & SQL', text: 'Explain ACID properties and Isolation Levels in relational databases.' },
  { id: 'q7', category: 'System Architecture', text: 'How do you handle API rate limiting and CORS errors between React and Spring Boot?' },
  { id: 'q8', category: 'HR & Behavioral', text: 'Walk me through a challenging bug you fixed in this project and what you learned.' },
]

/**
 * ApplicationDetailPage — full view of a single job application with
 * ATS Skill Matcher, Interview Preparation Checklist, and Timeline.
 */
function ApplicationDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [app, setApp] = useState(null)
  const [loading, setLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleting, setDeleting] = useState(false)

  // Checklist state stored in localStorage per application
  const [checkedQuestions, setCheckedQuestions] = useState(() => {
    const saved = localStorage.getItem(`prep_checklist_${id}`)
    return saved ? JSON.parse(saved) : {}
  })

  useEffect(() => {
    localStorage.setItem(`prep_checklist_${id}`, JSON.stringify(checkedQuestions))
  }, [checkedQuestions, id])

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

  const toggleQuestion = (qId) => {
    setCheckedQuestions(prev => ({
      ...prev,
      [qId]: !prev[qId]
    }))
  }

  if (loading) return <LoadingSpinner fullPage={false} />
  if (!app) return null

  // ATS Skill Matcher Logic
  const fullText = `${app.jobRole || ''} ${app.jobDescription || ''} ${app.notes || ''}`.toLowerCase()
  const detectedSkills = TECH_SKILLS.filter(skill =>
    fullText.includes(skill.toLowerCase())
  )

  // Default core skills if none explicitly detected in description
  const targetSkills = detectedSkills.length > 0
    ? detectedSkills
    : ['Java', 'Spring Boot', 'MySQL', 'REST API', 'React', 'Git']

  // User's known skills (from full stack stack)
  const userSkills = ['Java', 'Spring Boot', 'Spring Security', 'REST API', 'MySQL', 'SQL', 'JdbcTemplate', 'React', 'JavaScript', 'HTML', 'CSS', 'Git', 'Unit Testing']
  
  const matchedSkills = targetSkills.filter(s => userSkills.includes(s))
  const missingSkills = targetSkills.filter(s => !userSkills.includes(s))
  const matchScore = targetSkills.length > 0
    ? Math.round((matchedSkills.length / targetSkills.length) * 100)
    : 85

  const checkedCount = Object.values(checkedQuestions).filter(Boolean).length
  const prepProgress = Math.round((checkedCount / PREP_QUESTIONS.length) * 100)

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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 16 }}>
        <div>
          <Link to="/applications" className="btn btn-secondary btn-sm" style={{ marginBottom: 12 }}>
            <MdArrowBack size={16} /> Back to Applications
          </Link>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0 }}>{app.companyName}</h2>
            <StatusBadge status={app.status} />
          </div>
          <p style={{ fontSize: 15, color: 'var(--text-muted)', marginTop: 4 }}>{app.jobRole}</p>
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

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>

        {/* Application Details */}
        <div className="card">
          <h3 className="card-title" style={{ marginBottom: 20 }}>Application Details</h3>
          <InfoRow icon={<MdWork />} label="Job Role" value={app.jobRole} />
          <InfoRow icon={<MdLocationOn />} label="Location" value={app.jobLocation} />
          <InfoRow icon={<MdCalendarToday />} label="Applied On" value={formatDate(app.applicationDate)} />
          <InfoRow icon={<FaRupeeSign size={15} />} label="Salary Range" value={app.salaryRange} />
          <InfoRow icon={<MdWork />} label="Job Type" value={getJobTypeLabel(app.jobType)} />

          {app.jobPostingUrl && (
            <a
              href={app.jobPostingUrl}
              target="_blank"
              rel="noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ marginTop: 8, display: 'inline-flex' }}
            >
              <MdOpenInNew size={14} /> Open Job Posting
            </a>
          )}
        </div>

        {/* ATS Skill Matcher & Analyzer */}
        <div className="card" style={{
          background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 100%)',
          border: '1px solid rgba(99, 102, 241, 0.25)',
          boxShadow: 'var(--shadow-glow)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0, color: 'var(--primary)' }}>
              <MdPsychology size={20} /> ATS Skill Matcher
            </h3>
            <span style={{
              background: matchScore >= 75 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)',
              color: matchScore >= 75 ? '#10B981' : '#F59E0B',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 12,
              fontWeight: 700,
              border: `1px solid ${matchScore >= 75 ? '#10B981' : '#F59E0B'}`
            }}>
              {matchScore}% Match
            </span>
          </div>

          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 16 }}>
            Automated keyword extraction against your profile stack:
          </p>

          {/* Matched Skills */}
          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#10B981', textTransform: 'uppercase', marginBottom: 6 }}>
              ✓ Matched Skills ({matchedSkills.length})
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {matchedSkills.map(skill => (
                <span key={skill} style={{
                  fontSize: 11,
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: '#10B981',
                  padding: '3px 8px',
                  borderRadius: 6,
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  fontWeight: 600
                }}>
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Missing Skills */}
          {missingSkills.length > 0 && (
            <div>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#F59E0B', textTransform: 'uppercase', marginBottom: 6 }}>
                ⚡ Recommended to Revise ({missingSkills.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {missingSkills.map(skill => (
                  <span key={skill} style={{
                    fontSize: 11,
                    background: 'rgba(245, 158, 11, 0.15)',
                    color: '#F59E0B',
                    padding: '3px 8px',
                    borderRadius: 6,
                    border: '1px solid rgba(245, 158, 11, 0.3)',
                    fontWeight: 600
                  }}>
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Description & Notes */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 20, marginTop: 20 }}>
        {app.jobDescription && (
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 12 }}>Job Description</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {app.jobDescription}
            </p>
          </div>
        )}

        {app.notes && (
          <div className="card">
            <h3 className="card-title" style={{ marginBottom: 12 }}>Application Notes</h3>
            <p style={{ fontSize: 14, color: 'var(--text-muted)', lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>
              {app.notes}
            </p>
          </div>
        )}
      </div>

      {/* 📚 Interview Prep Questions Checklist */}
      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <h3 className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8, margin: 0 }}>
              <MdAssignmentTurnedIn color="var(--primary)" size={20} /> Interview Preparation Checklist
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Track your revision for technical and managerial rounds
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)' }}>
              {checkedCount} of {PREP_QUESTIONS.length} completed ({prepProgress}%)
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ width: '100%', height: 6, background: 'var(--border)', borderRadius: 3, marginBottom: 20, overflow: 'hidden' }}>
          <div style={{ width: `${prepProgress}%`, height: '100%', background: 'var(--primary)', transition: 'width 0.3s ease' }} />
        </div>

        {/* Checklist Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PREP_QUESTIONS.map(q => {
            const isDone = !!checkedQuestions[q.id]
            return (
              <div
                key={q.id}
                onClick={() => toggleQuestion(q.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 16px',
                  borderRadius: 10,
                  background: isDone ? 'var(--primary-light)' : 'var(--bg)',
                  border: `1px solid ${isDone ? 'rgba(99, 102, 241, 0.4)' : 'var(--border)'}`,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {isDone ? (
                  <MdCheckCircle color="var(--primary)" size={20} style={{ flexShrink: 0 }} />
                ) : (
                  <MdRadioButtonUnchecked color="var(--text-muted)" size={20} style={{ flexShrink: 0 }} />
                )}
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginRight: 8 }}>
                    [{q.category}]
                  </span>
                  <span style={{
                    fontSize: 14,
                    color: isDone ? 'var(--text-muted)' : 'var(--text)',
                    textDecoration: isDone ? 'line-through' : 'none'
                  }}>
                    {q.text}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </div>

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
