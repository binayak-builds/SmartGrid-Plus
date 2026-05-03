import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiGetUsage, apiGetAnalytics } from '../../utils/api'
import './DashboardPages.css'

export default function EnergyAnalytics() {
  const { user } = useAuth()
  const [usage, setUsage] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiGetUsage(user?.meter_no),
      apiGetAnalytics()
    ]).then(([usageData, statsData]) => {
      setUsage(usageData)
      setStats(statsData)
    }).catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [user])

  if (loading) return <div className="page"><p>Loading analytics...</p></div>

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">Detailed energy consumption analysis for Meter {user?.meter_no}.</p>
      
      {stats && (
        <div className="grid-3">
          <div className="stat-card">
            <span className="stat-label">Grid Total Revenue</span>
            <span className="stat-value">₹{stats.total_revenue}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Grid Avg Units</span>
            <span className="stat-value">{Math.round(stats.avg_units)} kWh</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Grid Max Bill</span>
            <span className="stat-value" style={{ color: '#ef4444' }}>₹{stats.max_bill}</span>
          </div>
        </div>
      )}

      <div className="glass-card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header"><h3 className="card-title">Your Monthly Consumption Trend</h3></div>
        <div className="chart-placeholder">
          <div className="chart-bars">
            {usage.map((u, i) => {
              const max = Math.max(...usage.map(x => x.units), 1)
              return (
                <div key={i} className="chart-bar" style={{ height: `${(u.units / max) * 100}%` }} title={`${u.month}: ${u.units} kWh`}>
                  <div className="chart-bar-fill" style={{ animationDelay: `${i * 60}ms` }} />
                </div>
              )
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', marginTop: 8, fontSize: 11, color: 'var(--on-surface-variant)' }}>
            {usage.map((u, i) => <span key={i}>{u.month}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}
