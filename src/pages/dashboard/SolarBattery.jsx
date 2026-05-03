import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiGetEnergy } from '../../utils/api'
import './DashboardPages.css'

export default function SolarBattery() {
  const { user } = useAuth()
  const [assets, setAssets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.meter_no) {
      apiGetEnergy(user.meter_no)
        .then(setAssets)
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [user])

  if (loading) return <div className="page"><p>Loading energy assets...</p></div>

  const solar = assets.filter(a => a.type === 'solar')
  const battery = assets.filter(a => a.type === 'battery')

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">Energy assets linked to Meter {user?.meter_no}.</p>
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card"><span className="stat-label">Solar Panels</span><span className="stat-value">{solar.length}</span></div>
        <div className="stat-card"><span className="stat-label">Battery Units</span><span className="stat-value">{battery.length}</span></div>
        <div className="stat-card"><span className="stat-label">Total Capacity</span><span className="stat-value">{assets.reduce((s, a) => s + a.capacity, 0)} kW</span></div>
      </div>
      <div className="glass-card">
        <div className="card-header"><h3 className="card-title">Energy Assets</h3></div>
        <table className="data-table">
          <thead><tr><th>Type</th><th>Capacity</th><th>Status</th></tr></thead>
          <tbody>
            {assets.map((a) => (
              <tr key={a.asset_id}>
                <td style={{ fontWeight: 600, textTransform: 'capitalize' }}><span className="material-symbols-outlined" style={{ fontSize: 16, verticalAlign: 'middle', marginRight: 6, color: a.type === 'solar' ? '#f59e0b' : '#3b82f6' }}>{a.type === 'solar' ? 'solar_power' : 'battery_charging_full'}</span>{a.type}</td>
                <td>{a.capacity} kW</td>
                <td><span className={`badge ${a.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
        {assets.length === 0 && <p style={{ padding: 20, textAlign: 'center', color: 'var(--on-surface-variant)' }}>No energy assets linked to this meter.</p>}
      </div>
    </div>
  )
}
