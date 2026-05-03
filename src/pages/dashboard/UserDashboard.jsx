import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiGetDashboard } from '../../utils/api'
import './DashboardPages.css'

export default function UserDashboard() {
  const { user } = useAuth()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.meter_no) {
      apiGetDashboard(user.meter_no)
        .then(setData)
        .catch(err => console.error('Dashboard error:', err))
        .finally(() => setLoading(false))
    }
  }, [user])

  if (loading) return <div className="page"><p>Loading dashboard...</p></div>
  if (!data || !data.history) return <div className="page"><p>Failed to load dashboard data.</p></div>

  const { history, latestBill, statusCount } = data

  const totalSpent = history.reduce((sum, h) => sum + h.totalbill, 0)
  const totalUnits = history.reduce((sum, h) => sum + h.units, 0)
  const unpaidCount = statusCount.find(s => s.status === 'unpaid')?.count || 0
  const paidCount = statusCount.find(s => s.status === 'paid')?.count || 0

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">Welcome back, <strong>{history[0]?.name || user?.username}</strong>. Meter: {user?.meter_no}</p>

      {/* Stats Row */}
      <div className="grid-4">
        <div className="stat-card">
          <span className="stat-label">Total Consumption</span>
          <span className="stat-value">{totalUnits} <small>kWh</small></span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Spent</span>
          <span className="stat-value">₹{totalSpent}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Unpaid Bills</span>
          <span className="stat-value" style={{ color: unpaidCount > 0 ? '#ef4444' : '#4ede83' }}>
            {unpaidCount}
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Paid Bills</span>
          <span className="stat-value" style={{ color: '#4ede83' }}>{paidCount}</span>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
        {/* Recent Bills */}
        <div className="glass-card">
          <div className="card-header"><h3 className="card-title">Billing History</h3></div>
          {history.map((h, i) => (
            <div key={i} className="billing-item">
              <div className="billing-left">
                <div className="billing-icon"><span className="material-symbols-outlined">receipt</span></div>
                <div className="billing-info">
                  <span className="billing-title">{h.month} — {h.units} kWh</span>
                  <span className="billing-date">₹{h.totalbill}</span>
                </div>
              </div>
              <span className={`badge ${h.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{h.status}</span>
            </div>
          ))}
          {history.length === 0 && <p style={{ padding: 16 }}>No billing history found.</p>}
        </div>

        {/* Latest Bill */}
        <div className="glass-card">
          <div className="card-header"><h3 className="card-title">Latest Bill</h3></div>
          {latestBill ? (
            <div style={{ padding: 24, textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: latestBill.status === 'unpaid' ? '#ef4444' : '#4ede83', marginBottom: 16 }}>
                ₹{latestBill.totalbill}
              </div>
              <p style={{ color: 'var(--on-surface-variant)', marginBottom: 8 }}>{latestBill.month} — {latestBill.units} kWh</p>
              <span className={`badge ${latestBill.status === 'paid' ? 'badge-success' : 'badge-danger'}`} style={{ fontSize: '1.2rem', padding: '8px 16px' }}>
                {latestBill.status.toUpperCase()}
              </span>
            </div>
          ) : (
             <p style={{ padding: 16 }}>No bills generated yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}
