import React, { useState, useEffect } from 'react'
import { applicationService } from '../services/applicationService'
import {
  JOB_DOMAINS,
  COMPANY_TYPES,
  EXPERIENCE_LEVELS,
  jobNewsService
} from '../services/jobNewsService'
import {
  MdSearch, MdOpenInNew, MdCheckCircle, MdLocationOn,
  MdAttachMoney, MdWork, MdSchedule, MdFilterList,
  MdFlashOn, MdBusiness, MdSchool, MdPublic, MdRefresh
} from 'react-icons/md'
import { FaJava, FaReact, FaPython, FaAws, FaMobileAlt, FaShieldAlt, FaRupeeSign } from 'react-icons/fa'
import toast from 'react-hot-toast'

/**
 * JobNewsPage — Live verified hiring news & real-time tech openings across all domains & company tiers.
 * Fetches 100% REAL active jobs via Live API + Verified MNC/Campus Drives.
 */
function JobNewsPage() {
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedDomain, setSelectedDomain] = useState('All Domains')
  const [selectedType, setSelectedType] = useState('All Companies')
  const [selectedExp, setSelectedExp] = useState('All Levels')
  const [sourceFilter, setSourceFilter] = useState('ALL') // 'ALL' | 'LIVE' | 'DRIVES'
  const [trackedJobs, setTrackedJobs] = useState({})
  const [trackingId, setTrackingId] = useState(null)

  useEffect(() => {
    loadJobs()
  }, [])

  const loadJobs = async (forceRefresh = false) => {
    try {
      if (forceRefresh) setRefreshing(true)
      else setLoading(true)

      const allJobs = await jobNewsService.getAllOpenings(forceRefresh)
      setJobs(allJobs)

      if (forceRefresh) {
        toast.success(`Refreshed ${allJobs.length} live openings!`)
      }
    } catch {
      toast.error('Failed to load live jobs')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Filter jobs by search, domain, company type, experience, and source
  const filteredJobs = jobs.filter(job => {
    const q = search.toLowerCase()
    const matchesSearch =
      job.company.toLowerCase().includes(q) ||
      job.role.toLowerCase().includes(q) ||
      job.location.toLowerCase().includes(q) ||
      job.description.toLowerCase().includes(q) ||
      (job.skills && job.skills.some(s => s.toLowerCase().includes(q)))

    const matchesDomain =
      selectedDomain === 'All Domains' || job.domain === selectedDomain

    const matchesType =
      selectedType === 'All Companies' || job.companyType === selectedType

    const matchesExp =
      selectedExp === 'All Levels' || job.expLevel === selectedExp

    const matchesSource =
      sourceFilter === 'ALL' ||
      (sourceFilter === 'LIVE' && job.isRealLive) ||
      (sourceFilter === 'DRIVES' && !job.isRealLive)

    return matchesSearch && matchesDomain && matchesType && matchesExp && matchesSource
  })

  // Quick stats
  const totalCount = jobs.length
  const liveCount = jobs.filter(j => j.isRealLive).length
  const driveCount = jobs.filter(j => !j.isRealLive).length
  const fresherCount = jobs.filter(j => j.expLevel === 'Freshers (2024-2026)').length

  // 1-Click Track: automatically imports into MySQL database
  const handleTrackJob = async (job) => {
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
        notes: `Imported from Hiring Radar (${job.source || 'Live Feed'}). Domain: ${job.domain || 'Tech'} | ${job.isRealLive ? 'Real Live API' : 'Campus Drive'}`,
        jobType: 'FULL_TIME'
      })
      setTrackedJobs(prev => ({ ...prev, [job.id]: true }))
      toast.success(`Tracked "${job.company}" in your Applications & Kanban!`)
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

  const getDomainIcon = (domain) => {
    switch (domain) {
      case 'Java & Backend': return <FaJava />
      case 'React & Frontend': return <FaReact />
      case 'Full Stack': return <MdFlashOn />
      case 'Python & AI': return <FaPython />
      case 'Cloud & DevOps': return <FaAws />
      case 'Mobile (Android/iOS)': return <FaMobileAlt />
      case 'QA & Testing': return <MdCheckCircle />
      case 'Cybersecurity & Network': return <FaShieldAlt />
      default: return <MdWork />
    }
  }

  const getDomainColor = (domain) => {
    switch (domain) {
      case 'Java & Backend': return '#3B82F6'
      case 'React & Frontend': return '#0EA5E9'
      case 'Full Stack': return '#8B5CF6'
      case 'Python & AI': return '#10B981'
      case 'Cloud & DevOps': return '#F59E0B'
      case 'Mobile (Android/iOS)': return '#EC4899'
      case 'QA & Testing': return '#06B6D4'
      case 'Cybersecurity & Network': return '#EF4444'
      default: return 'var(--primary)'
    }
  }

  const getCompanyTypeBadge = (type) => {
    switch (type) {
      case 'Top MNCs':
        return { bg: 'rgba(59, 130, 246, 0.12)', color: '#3B82F6', label: '🏢 Top MNC' }
      case 'Startups & Unicorns':
        return { bg: 'rgba(236, 72, 153, 0.12)', color: '#EC4899', label: '🚀 Unicorn/Startup' }
      case 'Product Companies':
        return { bg: 'rgba(16, 185, 129, 0.12)', color: '#10B981', label: '⭐ Product Co' }
      case 'Remote Teams':
        return { bg: 'rgba(139, 92, 246, 0.12)', color: '#8B5CF6', label: '🌐 100% Remote' }
      default:
        return { bg: 'var(--primary-light)', color: 'var(--primary)', label: type }
    }
  }

  return (
    <div>
      {/* Page Header */}
      <div className="page-header" style={{ marginBottom: 20 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, margin: 0, color: 'var(--text)' }}>
              Hiring Radar & Real-Time Openings
            </h2>
            <span style={{
              background: 'rgba(16, 185, 129, 0.15)',
              color: '#10B981',
              padding: '3px 10px',
              borderRadius: 20,
              fontSize: 11,
              fontWeight: 700,
              border: '1px solid rgba(16, 185, 129, 0.35)',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 5
            }}>
              <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#10B981' }} />
              LIVE SYNC ACTIVE
            </span>
          </div>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>
            100% real-time active openings from live job boards + verified top MNC/Campus recruitment drives.
          </p>
        </div>

        {/* Refresh Live Jobs Button */}
        <div>
          <button
            onClick={() => loadJobs(true)}
            disabled={refreshing || loading}
            className="btn btn-secondary"
            style={{ fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6 }}
          >
            <MdRefresh size={18} style={{ transform: refreshing ? 'rotate(360deg)' : 'none', transition: 'transform 0.6s' }} />
            {refreshing ? 'Syncing Live Jobs...' : 'Refresh Live Feed'}
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: 12,
        marginBottom: 20
      }}>
        <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(79, 70, 229, 0.15)', color: '#4F46E5', padding: 10, borderRadius: 10 }}>
            <MdWork size={22} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{totalCount}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Total Active Openings</div>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.15)', color: '#10B981', padding: 10, borderRadius: 10 }}>
            <MdPublic size={22} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{liveCount}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Real-Time Live API Jobs</div>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(59, 130, 246, 0.15)', color: '#3B82F6', padding: 10, borderRadius: 10 }}>
            <MdBusiness size={22} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{driveCount}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Verified Campus Drives</div>
          </div>
        </div>

        <div className="card" style={{ padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ background: 'rgba(245, 158, 11, 0.15)', color: '#F59E0B', padding: 10, borderRadius: 10 }}>
            <MdSchool size={22} />
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, color: 'var(--text)' }}>{fresherCount}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Freshers / 2025/2026 Batch</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="card" style={{ marginBottom: 20, padding: 18 }}>
        {/* Source Tab Switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 14, borderBottom: '1px solid var(--border)', paddingBottom: 12 }}>
          <button
            onClick={() => setSourceFilter('ALL')}
            className={`btn btn-sm ${sourceFilter === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 12 }}
          >
            All Openings ({jobs.length})
          </button>
          <button
            onClick={() => setSourceFilter('LIVE')}
            className={`btn btn-sm ${sourceFilter === 'LIVE' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5 }}
          >
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10B981' }} />
            100% Real Live API ({liveCount})
          </button>
          <button
            onClick={() => setSourceFilter('DRIVES')}
            className={`btn btn-sm ${sourceFilter === 'DRIVES' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 12 }}
          >
            ⭐ Campus & MNC Drives ({driveCount})
          </button>
        </div>

        {/* Search & Selectors Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginBottom: 14 }}>
          {/* Search Box */}
          <div style={{ flex: '1 1 260px', position: 'relative' }}>
            <MdSearch size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by company, role, skill (e.g. Java, React, AWS, Python, Fresher)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="form-control"
              style={{ paddingLeft: 38, height: 40 }}
            />
          </div>

          {/* Company Type Filter */}
          <div style={{ flex: '0 0 auto' }}>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="form-control"
              style={{ height: 40, minWidth: 160 }}
            >
              {COMPANY_TYPES.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          {/* Experience Filter */}
          <div style={{ flex: '0 0 auto' }}>
            <select
              value={selectedExp}
              onChange={(e) => setSelectedExp(e.target.value)}
              className="form-control"
              style={{ height: 40, minWidth: 170 }}
            >
              {EXPERIENCE_LEVELS.map(exp => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Domain Filter Pills */}
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MdFilterList size={16} /> Filter by Domain ({JOB_DOMAINS.length - 1} Specializations):
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {JOB_DOMAINS.map(domain => {
              const isSelected = selectedDomain === domain
              const color = getDomainColor(domain)
              const count = domain === 'All Domains'
                ? jobs.length
                : jobs.filter(j => j.domain === domain).length

              return (
                <button
                  key={domain}
                  onClick={() => setSelectedDomain(domain)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: 20,
                    border: isSelected ? `2px solid ${color}` : '1px solid var(--border)',
                    background: isSelected ? (color === 'var(--primary)' ? 'var(--primary)' : color) : 'var(--white)',
                    color: isSelected ? '#FFFFFF' : 'var(--text)',
                    fontSize: 12,
                    fontWeight: isSelected ? 700 : 500,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? `0 2px 10px ${color}40` : 'none'
                  }}
                >
                  {getDomainIcon(domain)}
                  <span>{domain}</span>
                  <span style={{
                    background: isSelected ? 'rgba(255,255,255,0.25)' : 'var(--table-head)',
                    padding: '1px 6px',
                    borderRadius: 10,
                    fontSize: 10,
                    fontWeight: 700
                  }}>
                    {count}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
        <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>
          Showing <strong>{filteredJobs.length}</strong> openings
          {selectedDomain !== 'All Domains' && <span> in <strong>{selectedDomain}</strong></span>}
          {sourceFilter === 'LIVE' && <span> · <strong>100% Real Live API</strong></span>}
          {sourceFilter === 'DRIVES' && <span> · <strong>Campus & MNC Drives</strong></span>}
        </div>
        {(selectedDomain !== 'All Domains' || selectedType !== 'All Companies' || selectedExp !== 'All Levels' || sourceFilter !== 'ALL' || search) && (
          <button
            onClick={() => {
              setSelectedDomain('All Domains')
              setSelectedType('All Companies')
              setSelectedExp('All Levels')
              setSourceFilter('ALL')
              setSearch('')
            }}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--primary)',
              fontSize: 12,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline'
            }}
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="card" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <div style={{ fontSize: 16, fontWeight: 600, color: 'var(--text)' }}>Connecting to Real-Time Job Feed...</div>
          <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 6 }}>Fetching active openings from live job boards</div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="card empty-state" style={{ padding: '60px 20px', textAlign: 'center' }}>
          <MdWork size={44} style={{ color: 'var(--text-muted)', marginBottom: 12, opacity: 0.5 }} />
          <h4 style={{ color: 'var(--text)' }}>No job openings found</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, maxWidth: 400, margin: '8px auto 16px' }}>
            Try adjusting your search keywords, domain specialization, or feed source filters.
          </p>
          <button
            onClick={() => {
              setSelectedDomain('All Domains')
              setSelectedType('All Companies')
              setSelectedExp('All Levels')
              setSourceFilter('ALL')
              setSearch('')
            }}
            className="btn btn-primary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 16 }}>
          {filteredJobs.map(job => {
            const domainColor = getDomainColor(job.domain)
            const typeBadge = getCompanyTypeBadge(job.companyType)
            const isTracked = trackedJobs[job.id]
            const isTracking = trackingId === job.id

            return (
              <div
                key={job.id}
                className="card"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  padding: 20,
                  borderLeft: `4px solid ${domainColor}`,
                  position: 'relative'
                }}
              >
                <div>
                  {/* Top Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 10 }}>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                      {/* Live Badge vs Drive Badge */}
                      {job.isRealLive ? (
                        <span style={{
                          background: 'rgba(16, 185, 129, 0.15)',
                          color: '#10B981',
                          border: '1px solid rgba(16, 185, 129, 0.35)',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 700,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 4
                        }}>
                          <span style={{ width: 5, height: 5, borderRadius: '50%', background: '#10B981' }} />
                          LIVE OPENING
                        </span>
                      ) : (
                        <span style={{
                          background: 'rgba(245, 158, 11, 0.15)',
                          color: '#F59E0B',
                          border: '1px solid rgba(245, 158, 11, 0.35)',
                          padding: '2px 8px',
                          borderRadius: 6,
                          fontSize: 10,
                          fontWeight: 700
                        }}>
                          ⭐ CAMPUS DRIVE
                        </span>
                      )}

                      {/* Domain Badge */}
                      <span style={{
                        background: `${domainColor}18`,
                        color: domainColor,
                        border: `1px solid ${domainColor}40`,
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4
                      }}>
                        {getDomainIcon(job.domain)} {job.domain}
                      </span>

                      {/* Company Type Badge */}
                      <span style={{
                        background: typeBadge.bg,
                        color: typeBadge.color,
                        padding: '2px 8px',
                        borderRadius: 6,
                        fontSize: 11,
                        fontWeight: 600
                      }}>
                        {typeBadge.label}
                      </span>
                    </div>

                    {/* Posted */}
                    <span style={{ fontSize: 11, color: 'var(--text-muted)', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: 3 }}>
                      <MdSchedule size={13} /> {job.posted}
                    </span>
                  </div>

                  {/* Company & Role */}
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: '0 0 4px', color: 'var(--text)' }}>
                    {job.company}
                  </h3>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--primary)', marginBottom: 10 }}>
                    {job.role}
                  </div>

                  {/* Metadata: Location, Salary, Experience */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MdLocationOn size={14} style={{ color: '#EF4444' }} />
                      <span>{job.location}</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <FaRupeeSign size={13} style={{ color: '#10B981' }} />
                      <strong style={{ color: 'var(--text)' }}>{job.salary}</strong>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <MdSchool size={14} style={{ color: '#3B82F6' }} />
                      <span>{job.experience}</span>
                    </div>
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: 12, color: 'var(--text-muted)', margin: '0 0 12px', lineHeight: 1.5 }}>
                    {job.description}
                  </p>

                  {/* Skills tags */}
                  {job.skills && job.skills.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginBottom: 16 }}>
                      {job.skills.map((skill, idx) => (
                        <span key={idx} style={{
                          background: 'var(--table-head)',
                          color: 'var(--text)',
                          border: '1px solid var(--border)',
                          padding: '2px 7px',
                          borderRadius: 4,
                          fontSize: 11,
                          fontWeight: 500
                        }}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Actions Row */}
                <div style={{
                  display: 'flex',
                  gap: 8,
                  borderTop: '1px solid var(--border)',
                  paddingTop: 14,
                  marginTop: 'auto'
                }}>
                  {/* Real Apply Link */}
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary"
                    style={{ flex: 1, justifyContent: 'center', fontSize: 12 }}
                  >
                    Apply Now <MdOpenInNew size={14} />
                  </a>

                  {/* 1-Click Track Button */}
                  <button
                    onClick={() => handleTrackJob(job)}
                    disabled={isTracked || isTracking}
                    className="btn btn-primary"
                    style={{
                      flex: 1.2,
                      justifyContent: 'center',
                      fontSize: 12,
                      background: isTracked ? 'rgba(16, 185, 129, 0.2)' : undefined,
                      borderColor: isTracked ? '#10B981' : undefined,
                      color: isTracked ? '#10B981' : undefined
                    }}
                  >
                    {isTracking ? (
                      'Tracking...'
                    ) : isTracked ? (
                      <>
                        <MdCheckCircle size={15} /> Tracked!
                      </>
                    ) : (
                      <>
                        <MdFlashOn size={15} /> + Track Job
                      </>
                    )}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default JobNewsPage
