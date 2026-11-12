import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService } from '../services/dashboardService'
import { applicationService } from '../services/applicationService'
import { jobNewsService } from '../services/jobNewsService'
import { formatDate, formatDateTime } from '../utils/helpers'
import StatusBadge from '../components/applications/StatusBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts'
import {
  MdWork, MdEventNote, MdCheckCircle, MdCancel, MdAdd, MdSend,
  MdOpenInNew, MdFlashOn
} from 'react-icons/md'
import toast from 'react-hot-toast'

// Colors for pie chart slices
const PIE_COLORS = ['#4F46E5', '#D97706', '#0EA5E9', '#16A34A', '#DC2626']

/**
 * DashboardPage — overview with stat cards, charts, live hiring radar, recent apps, and upcoming interviews.
 */
function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentApps, setRecentApps] = useState([])
  const [upcomingInterviews, setUpcomingInterviews] = useState([])
  const [liveAlerts, setLiveAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [trackedJobs, setTrackedJobs] = useState({})
  const [trackingId, setTrackingId] = useState(null)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      const [statsRes, recentRes, interviewsRes, jobs] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentApplications(),
        dashboardService.getUpcomingInterviews(),
        jobNewsService.getAllOpenings(),
      ])
      setStats(statsRes.data)
      setRecentApps(recentRes.data)
      setUpcomingInterviews(interviewsRes.data)
      setLiveAlerts(jobs.slice(0, 3))
    } catch {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  // 1-Click Track directly from Dashboard widget
  const handleTrackFromDashboard = async (job) => {
    setTrackingId(job.id)
    try {
      await applicationService.create({
        companyName: (job.company || 'Tech Company').slice(0, 250),
        jobRole: (job.role || 'Software Engineer').slice(0, 250),
        jobLocation: (job.location || 'Remote').slice(0, 450),
        salaryRange: (job.salary || 'Competitive').slice(0, 200),
        jobPostingUrl: (job.url || '').slice(0, 1000),
        jobDescription: (job.description || '').slice(0, 5000),
        status: 'APPLIED',
        applicationDate: new Date().toISOString().slice(0, 10),
        notes: `Imported from Dashboard Hiring Radar. Domain: ${job.domain || 'Tech'} | ${job.isRealLive ? 'Real Live API' : 'Campus Drive'}`,
        jobType: 'FULL_TIME'
      })
      setTrackedJobs(prev => ({ ...prev, [job.id]: true }))
      toast.success(`Tracked "${job.company}" into your applications!`)
      loadDashboard()
    } catch (error) {
      console.error('Track error:', error)
      const errMsg =
        error.response?.data?.message ||
        (error.response
          ? `Server returned ${error.response.status}`
          : 'Backend server is not running on port 8080! Please run "run-app.bat".')
      toast.error(errMsg)
    } finally {
      setTrackingId(null)
    }
  }

  if (loading) return <LoadingSpinner fullPage={false} />

  // Prepare pie chart data
  const pieData = stats ? [
    { name: 'Applied',    value: stats.appliedCount },
    { name: 'Assessment', value: stats.assessmentCount },
    { name: 'Interview',  value: stats.interviewScheduledCount },
    { name: 'Selected',   value: stats.selectedCount },
    { name: 'Rejected',   value: stats.rejectedCount },
  ].filter(d => d.value > 0) : []

  const statCards = [
    { label: 'Total',     value: stats?.totalApplications || 0, icon: <MdWork />,     color: '#4F46E5', bg: '#EEF2FF' },
    { label: 'Applied',   value: stats?.appliedCount || 0,      icon: <MdSend />,     color: '#0EA5E9', bg: '#E0F2FE' },
    { label: 'Interviews',value: stats?.interviewScheduledCount || 0, icon: <MdEventNote />, color: '#D97706', bg: '#FEF3C7' },
    { label: 'Selected',  value: stats?.selectedCount || 0,     icon: <MdCheckCircle />, color: '#16A34A', bg: '#DCFCE7' },
    { label: 'Rejected',  value: stats?.rejectedCount || 0,     icon: <MdCancel />,   color: '#DC2626', bg: '#FEE2E2' },
  ]

  return (
    <div>
      {/* Welcome Bar */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, margin: 0, color: 'var(--text)' }}>Overview</h2>
        <p style={{ fontSize: 13, color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
          Monitor your pipeline, interview schedule, and 100% real-time verified tech job openings
        </p>
      </div>

      {/* Stat Cards */}
      <div className="stats-grid">
        {statCards.map((card) => (
          <div key={card.label} className="stat-card">
            <div className="stat-icon" style={{ background: card.bg, color: card.color }}>
              {React.cloneElement(card.icon, { size: 24 })}
            </div>
            <div className="stat-info">
              <h3>{card.value}</h3>
              <p>{card.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="charts-grid" style={{ marginBottom: 24 }}>
        {/* Pie Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Application Status</h3>
          </div>
          {pieData.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" iconSize={10} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '40px 0', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No applications yet. <Link to="/applications/new" style={{ color: 'var(--primary)', fontWeight: 600 }}>Add one!</Link></p>
            </div>
          )}
        </div>

        {/* Bar Chart */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Monthly Applications</h3>
          </div>
          {stats?.monthlyData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={stats.monthlyData} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: 'var(--text-muted)' }} />
                <Tooltip />
                <Bar dataKey="count" name="Applications" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '40px 0', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No data for this period.</p>
            </div>
          )}
        </div>
      </div>

      {/* Live Hiring Radar & Alerts Widget */}
      <div className="card" style={{ marginBottom: 24, borderLeft: '4px solid #10B981' }}>
        <div className="card-header" style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              padding: '4px 10px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5
            }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
              LIVE RADAR
            </span>
            <h3 className="card-title" style={{ margin: 0 }}>Real-Time Tech Openings & Drives</h3>
          </div>
          <Link to="/job-news" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
            View All Openings & Domain Filters →
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 14 }}>
          {liveAlerts.map(job => {
            const isTracked = trackedJobs[job.id]
            const isTracking = trackingId === job.id

            return (
              <div
                key={job.id}
                style={{
                  padding: 14,
                  borderRadius: 10,
                  background: 'var(--table-head)',
                  border: '1px solid var(--border)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: 10
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <span style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: '#3B82F6',
                      background: 'rgba(59, 130, 246, 0.15)',
                      padding: '2px 6px',
                      borderRadius: 4
                    }}>
                      {job.domain}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{job.posted}</span>
                  </div>

                  <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--text)' }}>{job.company}</div>
                  <div style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600 }}>{job.role}</div>

                  <div style={{ display: 'flex', gap: 10, marginTop: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                    <span>📍 {job.location.split(',')[0]}</span>
                    <span>💰 {job.salary}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 6, paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{ flex: 1, justifyContent: 'center', fontSize: 11, padding: '4px 8px' }}
                  >
                    Apply ↗
                  </a>
                  <button
                    onClick={() => handleTrackFromDashboard(job)}
                    disabled={isTracked || isTracking}
                    className="btn btn-primary btn-sm"
                    style={{
                      flex: 1.2,
                      justifyContent: 'center',
                      fontSize: 11,
                      padding: '4px 8px',
                      background: isTracked ? 'rgba(16, 185, 129, 0.2)' : undefined,
                      borderColor: isTracked ? '#10B981' : undefined,
                      color: isTracked ? '#10B981' : undefined
                    }}
                  >
                    {isTracking ? 'Tracking...' : isTracked ? '✓ Tracked' : '+ ⚡ Track'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
        {/* Recent Applications */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Applications</h3>
            <Link to="/applications" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No applications yet.</p>
              <Link to="/applications/new" className="btn btn-primary btn-sm" style={{ marginTop: 12 }}>
                <MdAdd size={16} /> Add Application
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentApps.map(app => (
                <div key={app.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '10px 0',
                  borderBottom: '1px solid var(--border)',
                }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{app.companyName}</div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
                      {app.jobRole} · {formatDate(app.applicationDate)}
                    </div>
                  </div>
                  <StatusBadge status={app.status} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upcoming Interviews */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Upcoming Interviews</h3>
            <Link to="/interviews" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>

          {upcomingInterviews.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0', textAlign: 'center' }}>
              <p style={{ color: 'var(--text-muted)' }}>No upcoming interviews.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcomingInterviews.slice(0, 4).map(interview => (
                <div key={interview.id} style={{
                  padding: '10px 12px',
                  background: 'var(--primary-light)',
                  borderRadius: 8,
                  borderLeft: '3px solid var(--primary)',
                }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: 'var(--text)' }}>{interview.companyName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {interview.round} · {formatDateTime(interview.interviewDate)}
                  </div>
                  {interview.meetingLink && (
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: 12, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4, fontWeight: 500 }}
                    >
                      <MdOpenInNew size={13} /> Join Meeting
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
