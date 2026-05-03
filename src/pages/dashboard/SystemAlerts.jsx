import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiGetAlerts } from '../../utils/api'
import './DashboardPages.css'

export default function SystemAlerts() {
  const { user } = useAuth()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')

  useEffect(() => {
    if (user?.meter_no) {
      apiGetAlerts(user.meter_no)
        .then(setAlerts)
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [user])

  if (loading) return <div className="page"><p>Loading alerts...</p></div>

  const filtered = filter === 'all' ? alerts : alerts.filter(a => a.severity === filter)
  const severityColors = { high: '#ef4444', medium: '#f59e0b', low: '#4ede83' }
  const severityIcons = { high: 'error', medium: 'warning', low: 'info' }

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">System alerts for Meter {user?.meter_no}.</p>
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card"><span className="stat-label">Total Alerts</span><span className="stat-value">{alerts.length}</span></div>
        <div className="stat-card"><span className="stat-label">High Severity</span><span className="stat-value" style={{ color: '#ef4444' }}>{alerts.filter(a => a.severity === 'high').length}</span></div>
        <div className="stat-card"><span className="stat-label">Medium</span><span className="stat-value" style={{ color: '#f59e0b' }}>{alerts.filter(a => a.severity === 'medium').length}</span></div>
      </div>
      <div className="glass-card">
        <div className="card-header">
          <h3 className="card-title">Alert Feed</h3>
          <div style={{ display: 'flex', gap: 4 }}>
            {['all', 'high', 'medium', 'low'].map(f => (
              <button key={f} className={`btn btn-sm ${filter === f ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setFilter(f)}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>
        {filtered.map(a => (
          <div key={a.alert_id} className="billing-item">
            <div className="billing-left">
              <div className="billing-icon" style={{ background: `${severityColors[a.severity]}20` }}>
                <span className="material-symbols-outlined" style={{ color: severityColors[a.severity] }}>{severityIcons[a.severity]}</span>
              </div>
              <div className="billing-info">
                <span className="billing-title">{a.message}</span>
                <span className="billing-date">{a.severity} • {new Date(a.created_at).toLocaleString()}</span>
              </div>
            </div>
            <span className={`badge ${a.severity === 'high' ? 'badge-danger' : a.severity === 'medium' ? 'badge-warning' : 'badge-success'}`}>{a.severity}</span>
          </div>
        ))}
        {filtered.length === 0 && <p style={{ padding: 20, textAlign: 'center', color: 'var(--on-surface-variant)' }}>No alerts found.</p>}
      </div>
    </div>
  )
}
