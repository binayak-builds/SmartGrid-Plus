import { useState, useEffect } from 'react'
import { apiGetAdminAssets, apiGetAssetStats } from '../../utils/api'
import '../dashboard/DashboardPages.css'

export default function EnergyAssets() {
  const [assets, setAssets] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([apiGetAdminAssets(), apiGetAssetStats()])
      .then(([assetsData, statsData]) => { setAssets(assetsData); setStats(statsData) })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><p>Loading assets...</p></div>

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">All energy assets across the grid.</p>
      {stats && (
        <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="stat-card"><span className="stat-label">Solar Panels</span><span className="stat-value">{stats.solar.count}</span><span style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{stats.solar.totalCapacity} kW total</span></div>
          <div className="stat-card"><span className="stat-label">Battery Units</span><span className="stat-value">{stats.battery.count}</span><span style={{ fontSize: 12, color: 'var(--on-surface-variant)' }}>{stats.battery.totalCapacity} kW total</span></div>
          <div className="stat-card"><span className="stat-label">Active</span><span className="stat-value" style={{ color: '#4ede83' }}>{stats.activeCount}</span></div>
          <div className="stat-card"><span className="stat-label">Inactive</span><span className="stat-value" style={{ color: '#ef4444' }}>{stats.inactiveCount}</span></div>
        </div>
      )}
      <div className="glass-card">
        <div className="card-header"><h3 className="card-title">Asset Registry ({assets.length} assets)</h3></div>
        <table className="data-table">
          <thead><tr><th>Asset ID</th><th>Customer</th><th>Meter</th><th>Type</th><th>Capacity</th><th>Status</th></tr></thead>
          <tbody>
            {assets.map(a => (
              <tr key={a.asset_id}>
                <td style={{ fontWeight: 600 }}>AST-{a.asset_id}</td>
                <td>{a.customer_name}</td>
                <td>{a.meter_no}</td>
                <td style={{ textTransform: 'capitalize' }}>{a.type}</td>
                <td>{a.capacity} kW</td>
                <td><span className={`badge ${a.status === 'active' ? 'badge-success' : 'badge-warning'}`}>{a.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
