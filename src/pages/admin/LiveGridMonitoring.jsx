import { useState, useEffect } from 'react'
import { apiGetMeters } from '../../utils/api'
import '../dashboard/DashboardPages.css'

export default function LiveGridMonitoring() {
  const [meters, setMeters] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGetMeters()
      .then(setMeters)
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><p>Loading grid data...</p></div>

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">Real-time view of all meters across the grid.</p>
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card"><span className="stat-label">Active Meters</span><span className="stat-value">{meters.length}</span></div>
        <div className="stat-card"><span className="stat-label">Digital</span><span className="stat-value">{meters.filter(m => m.meter_type === 'Digital').length}</span></div>
        <div className="stat-card"><span className="stat-label">Analog</span><span className="stat-value">{meters.filter(m => m.meter_type === 'Analog').length}</span></div>
        <div className="stat-card"><span className="stat-label">Three Phase</span><span className="stat-value">{meters.filter(m => m.phase_code === 'Three').length}</span></div>
      </div>
      <div className="glass-card">
        <div className="card-header"><h3 className="card-title">Meter Grid Map</h3></div>
        <table className="data-table">
          <thead><tr><th>Meter No</th><th>Customer</th><th>Location</th><th>Type</th><th>Phase</th><th>Bill Type</th><th>Cycle</th></tr></thead>
          <tbody>
            {meters.map(m => (
              <tr key={m.meter_no}>
                <td style={{ fontWeight: 600 }}>{m.meter_no}</td>
                <td>{m.customer_name}</td>
                <td>{m.meter_location}</td>
                <td>{m.meter_type}</td>
                <td>{m.phase_code}</td>
                <td><span className={`badge ${m.bill_type === 'Commercial' ? 'badge-info' : 'badge-success'}`}>{m.bill_type}</span></td>
                <td>{m.days} days</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
