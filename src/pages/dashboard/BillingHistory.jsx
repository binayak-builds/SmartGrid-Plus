import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiGetBills, apiPayBill } from '../../utils/api'
import './DashboardPages.css'

export default function BillingHistory() {
  const { user } = useAuth()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.meter_no) {
      apiGetBills(user.meter_no)
        .then(setBills)
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [user])

  const handlePay = async (bill) => {
    try {
      await apiPayBill(bill.bill_id, bill.totalbill)
      setBills(prev => prev.map(b => b.bill_id === bill.bill_id ? { ...b, status: 'paid' } : b))
    } catch (err) {
      alert('Payment failed: ' + err.message)
    }
  }

  if (loading) return <div className="page"><p>Loading bills...</p></div>

  const totalPaid = bills.filter(b => b.status === 'paid').reduce((s, b) => s + b.totalbill, 0)
  const totalUnpaid = bills.filter(b => b.status === 'unpaid').reduce((s, b) => s + b.totalbill, 0)

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">Your billing records for Meter {user?.meter_no}.</p>
      
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <span className="stat-label">Total Bills</span>
          <span className="stat-value">{bills.length}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Paid</span>
          <span className="stat-value" style={{ color: '#4ede83' }}>₹{totalPaid}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Unpaid</span>
          <span className="stat-value" style={{ color: '#ef4444' }}>₹{totalUnpaid}</span>
        </div>
      </div>

      <div className="glass-card">
        <div className="card-header"><h3 className="card-title">Bill History</h3></div>
        {bills.map(bill => (
          <div key={bill.bill_id} className="billing-item">
            <div className="billing-left">
              <div className="billing-icon"><span className="material-symbols-outlined">receipt_long</span></div>
              <div className="billing-info">
                <span className="billing-title">{bill.month} — {bill.units} kWh</span>
                <span className="billing-date">₹{bill.totalbill}</span>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className={`badge ${bill.status === 'paid' ? 'badge-success' : 'badge-warning'}`}>{bill.status}</span>
              {bill.status === 'unpaid' && (
                <button className="btn btn-primary btn-sm" onClick={() => handlePay(bill)}>Pay Now</button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
