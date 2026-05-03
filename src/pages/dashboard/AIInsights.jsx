import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiGetPredictions } from '../../utils/api'
import './DashboardPages.css'

export default function AIInsights() {
  const { user } = useAuth()
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.meter_no) {
      apiGetPredictions(user.meter_no)
        .then(setPredictions)
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [user])

  if (loading) return <div className="page"><p>Loading AI insights...</p></div>

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">AI-powered consumption predictions for Meter {user?.meter_no}.</p>
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        {predictions.slice(0, 3).map((p, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>psychology</span>
              <span className="stat-label">{p.month} Prediction</span>
            </div>
            <span className="stat-value">{p.predicted_units} kWh</span>
            <span style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>Est. Bill: ₹{p.predicted_bill}</span>
          </div>
        ))}
      </div>
      <div className="glass-card">
        <div className="card-header"><h3 className="card-title">All AI Predictions</h3></div>
        <table className="data-table">
          <thead><tr><th>Month</th><th>Predicted Units</th><th>Predicted Bill</th></tr></thead>
          <tbody>
            {predictions.map((p, i) => (
              <tr key={i}>
                <td style={{ fontWeight: 600 }}>{p.month}</td>
                <td>{p.predicted_units} kWh</td>
                <td>₹{p.predicted_bill}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
