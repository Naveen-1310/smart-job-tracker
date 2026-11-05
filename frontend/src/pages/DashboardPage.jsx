import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { dashboardService } from '../services/dashboardService'
import { formatDate, formatDateTime, getStatusLabel } from '../utils/helpers'
import StatusBadge from '../components/applications/StatusBadge'
import LoadingSpinner from '../components/common/LoadingSpinner'
import {
  PieChart, Pie, Cell, Tooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts'
import { MdWork, MdEventNote, MdCheckCircle, MdCancel, MdAdd, MdSend, MdOpenInNew } from 'react-icons/md'
import toast from 'react-hot-toast'

// Colors for pie chart slices
const PIE_COLORS = ['#4F46E5', '#D97706', '#0EA5E9', '#16A34A', '#DC2626']

/**
 * DashboardPage — overview with stat cards, charts, recent apps, and upcoming interviews.
 */
function DashboardPage() {
  const [stats, setStats] = useState(null)
  const [recentApps, setRecentApps] = useState([])
  const [upcomingInterviews, setUpcomingInterviews] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    try {
      // Fetch all dashboard data in parallel
      const [statsRes, recentRes, interviewsRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentApplications(),
        dashboardService.getUpcomingInterviews(),
      ])
      setStats(statsRes.data)
      setRecentApps(recentRes.data)
      setUpcomingInterviews(interviewsRes.data)
    } catch (error) {
      toast.error('Failed to load dashboard data')
    } finally {
      setLoading(false)
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
      <div className="charts-grid">

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
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <p>No applications yet. <Link to="/applications/new">Add one!</Link></p>
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
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" name="Applications" fill="#4F46E5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '40px 0' }}>
              <p>No data for this period.</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

        {/* Recent Applications */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">Recent Applications</h3>
            <Link to="/applications" style={{ fontSize: 13, color: 'var(--primary)', textDecoration: 'none' }}>
              View all →
            </Link>
          </div>

          {recentApps.length === 0 ? (
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>No applications yet.</p>
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
                    <div style={{ fontWeight: 600, fontSize: 13 }}>{app.companyName}</div>
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
            <div className="empty-state" style={{ padding: '30px 0' }}>
              <p>No upcoming interviews.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {upcomingInterviews.slice(0, 4).map(interview => (
                <div key={interview.id} style={{
                  padding: '10px 12px',
                  background: '#EEF2FF',
                  borderRadius: 8,
                  borderLeft: '3px solid var(--primary)',
                }}>
                  <div style={{ fontWeight: 600, fontSize: 13 }}>{interview.companyName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                    {interview.round} · {formatDateTime(interview.interviewDate)}
                  </div>
                  {interview.meetingLink && (
                    <a
                      href={interview.meetingLink}
                      target="_blank"
                      rel="noreferrer"
                      style={{ fontSize: 12, color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 4 }}
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
