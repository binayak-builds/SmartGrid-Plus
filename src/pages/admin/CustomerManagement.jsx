import { useState, useEffect } from 'react'
import { apiGetAdminCustomers, apiGetAdminUnpaidCustomers } from '../../utils/api'
import '../dashboard/DashboardPages.css'

export default function CustomerManagement() {
  const [customers, setCustomers] = useState([])
  const [unpaidCustomers, setUnpaidCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      apiGetAdminCustomers(),
      apiGetAdminUnpaidCustomers()
    ])
      .then(([customersData, unpaidData]) => {
        setCustomers(customersData)
        setUnpaidCustomers(unpaidData.map(u => u.name))
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="page"><p>Loading customers...</p></div>

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">Manage all registered customers and meters.</p>
      
      <div className="grid-2" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <span className="stat-label">Total Customers</span>
          <span className="stat-value">{customers.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Customers with Unpaid Bills</span>
          <span className="stat-value" style={{ color: '#f59e0b' }}>{unpaidCustomers.length}</span>
        </div>
      </div>

      <div className="glass-card">
        <div className="card-header"><h3 className="card-title">Customer Registry</h3></div>
        <table className="data-table">
          <thead><tr><th>Meter</th><th>Name</th><th>Email</th><th>Phone</th><th>Location</th><th>Payment Status</th></tr></thead>
          <tbody>
            {customers.map(c => {
              const hasUnpaid = unpaidCustomers.includes(c.name)
              return (
                <tr key={c.meter_no}>
                  <td style={{ fontWeight: 600 }}>{c.meter_no}</td>
                  <td>{c.name}</td>
                  <td>{c.email}</td>
                  <td>{c.phone}</td>
                  <td>{c.address}, {c.city}</td>
                  <td>
                    <span className={`badge ${hasUnpaid ? 'badge-warning' : 'badge-success'}`}>
                      {hasUnpaid ? 'Has Dues' : 'Clear'}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
