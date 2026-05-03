import { useState, useEffect } from 'react'
import { apiGetUsageStats, apiGetPayments } from '../../utils/api'
import '../dashboard/DashboardPages.css'

export default function FinancialOverview() {
  const [stats, setStats] = useState(null)
  const [payments, setPayments] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([apiGetUsageStats(), apiGetPayments()])
      .then(([statsData, paymentsData]) => { setStats(statsData); setPayments(paymentsData) })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><p>Loading financials...</p></div>

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">Financial overview of the SmartGrid+ billing system.</p>
      {stats && (
        <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="stat-card"><span className="stat-label">Total Revenue</span><span className="stat-value">₹{stats.totalRevenue?.toLocaleString()}</span></div>
          <div className="stat-card"><span className="stat-label">Avg Bill</span><span className="stat-value">₹{stats.avgBill}</span></div>
          <div className="stat-card"><span className="stat-label">Unpaid Amount</span><span className="stat-value" style={{ color: '#ef4444' }}>₹{stats.unpaidTotal?.toLocaleString()}</span></div>
          <div className="stat-card"><span className="stat-label">Unpaid Bills</span><span className="stat-value" style={{ color: '#f59e0b' }}>{stats.unpaidCount}</span></div>
        </div>
      )}
      <div className="glass-card">
        <div className="card-header"><h3 className="card-title">Payment History ({payments.length} transactions)</h3></div>
        <table className="data-table">
          <thead><tr><th>Payment ID</th><th>Customer</th><th>Meter</th><th>Month</th><th>Amount</th><th>Date</th><th>Status</th></tr></thead>
          <tbody>
            {payments.map(p => (
              <tr key={p.payment_id}>
                <td style={{ fontWeight: 600 }}>PAY-{p.payment_id}</td>
                <td>{p.customer_name}</td>
                <td>{p.meter_no}</td>
                <td>{p.month}</td>
                <td style={{ color: '#4ede83' }}>₹{p.amount}</td>
                <td>{new Date(p.payment_date).toLocaleDateString()}</td>
                <td><span className="badge badge-success">{p.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
