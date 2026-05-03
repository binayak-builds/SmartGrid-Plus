import { useState, useEffect } from 'react'
import { apiGetPredictions } from '../../utils/api'
import '../dashboard/DashboardPages.css'

export default function AIPredictions() {
  const [predictions, setPredictions] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGetPredictions()
      .then(setPredictions)
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><p>Loading predictions...</p></div>

  const totalPredicted = predictions.reduce((s, p) => s + p.predicted_units, 0)
  const totalBill = predictions.reduce((s, p) => s + p.predicted_bill, 0)

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">AI-powered grid-wide consumption forecasts.</p>
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card"><span className="stat-label">Total Predicted Units</span><span className="stat-value">{totalPredicted} kWh</span></div>
        <div className="stat-card"><span className="stat-label">Total Predicted Revenue</span><span className="stat-value">₹{totalBill.toLocaleString()}</span></div>
        <div className="stat-card"><span className="stat-label">Meters Analyzed</span><span className="stat-value">{predictions.length}</span></div>
      </div>
      <div className="glass-card">
        <div className="card-header"><h3 className="card-title">Prediction Table</h3></div>
        <table className="data-table">
          <thead><tr><th>Customer</th><th>Meter</th><th>Month</th><th>Predicted Units</th><th>Predicted Bill</th></tr></thead>
          <tbody>
            {predictions.map(p => (
              <tr key={p.id}>
                <td style={{ fontWeight: 600 }}>{p.customer_name}</td>
                <td>{p.meter_no}</td>
                <td>{p.month}</td>
                <td>{p.predicted_units} kWh</td>
                <td style={{ color: 'var(--primary)' }}>₹{p.predicted_bill}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="glass-card" style={{ marginTop: 'var(--space-6)' }}>
        <div className="card-header"><h3 className="card-title">Predicted Consumption Chart</h3></div>
        <div className="chart-placeholder">
          <div className="chart-bars">
            {predictions.map((p, i) => {
              const max = Math.max(...predictions.map(x => x.predicted_units), 1)
              return (
                <div key={i} className="chart-bar" style={{ height: `${(p.predicted_units / max) * 100}%` }} title={`${p.customer_name}: ${p.predicted_units} kWh`}>
                  <div className="chart-bar-fill" style={{ animationDelay: `${i * 50}ms`, background: 'linear-gradient(to top, var(--primary-raw), rgba(59,130,246,0.3))' }} />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
