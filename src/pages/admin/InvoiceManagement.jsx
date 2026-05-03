import { useState, useEffect } from 'react'
import { apiGetAdminBills } from '../../utils/api'
import '../dashboard/DashboardPages.css'

export default function InvoiceManagement() {
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGetAdminBills()
      .then(setBills)
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><p>Loading invoices...</p></div>

  const totalAmount = bills.reduce((sum, b) => sum + b.totalbill, 0)
  const unpaidAmount = bills.filter(b => b.status === 'unpaid').reduce((sum, b) => sum + b.totalbill, 0)

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">All bills across the grid.</p>

      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <span className="stat-label">Total Bills</span>
          <span className="stat-value">{bills.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Billed Amount</span>
          <span className="stat-value">₹{totalAmount.toLocaleString()}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Uncollected</span>
          <span className="stat-value" style={{ color: '#f59e0b' }}>₹{unpaidAmount.toLocaleString()}</span>
        </div>
      </div>

      <div className="glass-card">
        <div className="card-header"><h3 className="card-title">Invoice Registry</h3></div>
        <table className="data-table">
          <thead><tr><th>Bill #</th><th>Meter</th><th>Month</th><th>Units</th><th>Amount</th><th>Status</th></tr></thead>
          <tbody>
            {bills.map(b => (
              <tr key={b.bill_id}>
                <td style={{ fontWeight: 600 }}>INV-{b.bill_id}</td>
                <td>{b.meter_no}</td>
                <td>{b.month}</td>
                <td>{b.units} kWh</td>
                <td style={{ color: 'var(--primary)' }}>₹{b.totalbill}</td>
                <td><span className={`badge ${b.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{b.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
