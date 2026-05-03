import { useState, useEffect } from 'react'
import { apiGetAnalytics, apiGetAdminCustomers, apiGetAdminBills } from '../../utils/api'
import '../dashboard/DashboardPages.css'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [customers, setCustomers] = useState([])
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiGetAnalytics(),
      apiGetAdminCustomers(),
      apiGetAdminBills()
    ])
      .then(([statsData, customersData, billsData]) => {
        setStats(statsData)
        setCustomers(customersData)
        setBills(billsData)
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><p>Loading command center...</p></div>
  if (!stats) return <div className="page"><p>Failed to load admin data.</p></div>

  const unpaidCount = bills.filter(b => b.status === 'unpaid').length
  const maxBill = stats.max_bill

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">SmartGrid+ AI Electricity Billing System — Admin Overview</p>
      
      <div className="grid-4">
        <div className="stat-card">
          <span className="stat-label">Total Customers</span>
          <span className="stat-value">{customers.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value">₹{stats.total_revenue?.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Grid Avg Units</span>
          <span className="stat-value">{Math.round(stats.avg_units)} kWh</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Max Bill</span>
          <span className="stat-value" style={{ color: '#ef4444' }}>₹{maxBill?.toLocaleString()}</span>
        </div>
      </div>

      <div className="grid-2" style={{ marginTop: 'var(--space-6)' }}>
        <div className="glass-card">
          <div className="card-header"><h3 className="card-title">Billing Overview</h3></div>
          <div className="stat-card" style={{ background: 'transparent', padding: 0, border: 'none' }}>
            <span className="stat-label">Total Bills Generated</span>
            <span className="stat-value" style={{ marginBottom: 16 }}>{bills.length}</span>
            <span className="stat-label">Unpaid Bills</span>
            <span className="stat-value" style={{ color: '#f59e0b' }}>{unpaidCount}</span>
          </div>
        </div>

        <div className="glass-card">
          <div className="card-header"><h3 className="card-title">Recent Unpaid Bills</h3></div>
          {bills.filter(b => b.status === 'unpaid').slice(0, 4).map(b => (
            <div key={b.bill_id} className="billing-item">
              <div className="billing-left">
                <div className="billing-icon" style={{ background: 'rgba(239,68,68,0.1)' }}>
                  <span className="material-symbols-outlined" style={{ color: '#ef4444' }}>warning</span>
                </div>
                <div className="billing-info">
                  <span className="billing-title">Meter: {b.meter_no}</span>
                  <span className="billing-date">{b.month} — ₹{b.totalbill}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
