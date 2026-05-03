import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiGetBills, apiPayBill } from '../../utils/api'
import './DashboardPages.css'

export default function SecurePayment() {
  const { user } = useAuth()
  const [bills, setBills] = useState([])
  const [loading, setLoading] = useState(true)
  const [processing, setProcessing] = useState(false)

  useEffect(() => {
    if (user?.meter_no) {
      apiGetBills(user.meter_no)
        .then(setBills)
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [user])

  const unpaidBills = bills.filter(b => b.status === 'unpaid')
  const totalAmount = unpaidBills.reduce((s, b) => s + b.totalbill, 0)

  const handlePayAll = async () => {
    if (unpaidBills.length === 0) return
    setProcessing(true)
    try {
      for (const bill of unpaidBills) {
        await apiPayBill(bill.bill_id, bill.totalbill)
      }
      const updatedBills = await apiGetBills(user.meter_no)
      setBills(updatedBills)
      alert('Payment successful!')
    } catch (err) {
      alert('Payment failed: ' + err.message)
    } finally {
      setProcessing(false)
    }
  }

  if (loading) return <div className="page"><p>Loading payment info...</p></div>

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">Secure checkout for Meter {user?.meter_no}.</p>

      <div className="grid-2">
        <div className="glass-card">
          <div className="card-header"><h3 className="card-title">Outstanding Balance</h3></div>
          
          {unpaidBills.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--on-surface-variant)' }}>
              <span className="material-symbols-outlined" style={{ fontSize: 48, color: '#4ede83', marginBottom: 16 }}>check_circle</span>
              <h4>You're all caught up!</h4>
              <p>No unpaid bills found.</p>
            </div>
          ) : (
            <>
              <div style={{ fontSize: '3rem', fontWeight: 'bold', color: '#ef4444', textAlign: 'center', margin: '30px 0' }}>
                ₹{totalAmount.toLocaleString()}
              </div>
              <table className="data-table" style={{ marginBottom: 20 }}>
                <tbody>
                  {unpaidBills.map(b => (
                    <tr key={b.bill_id}>
                      <td>{b.month} Bill ({b.units} kWh)</td>
                      <td style={{ textAlign: 'right', fontWeight: 'bold' }}>₹{b.totalbill}</td>
                    </tr>
                  ))}
                  <tr style={{ borderTop: '2px solid rgba(255,255,255,0.1)' }}>
                    <td style={{ fontWeight: 'bold' }}>Total Due</td>
                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#ef4444' }}>₹{totalAmount}</td>
                  </tr>
                </tbody>
              </table>
              <button 
                className="btn btn-primary btn-lg btn-block" 
                onClick={handlePayAll}
                disabled={processing}
                style={{ background: '#4ede83', color: '#000' }}
              >
                {processing ? 'Processing...' : `Pay ₹${totalAmount.toLocaleString()} Now`}
              </button>
            </>
          )}
        </div>

        <div className="glass-card">
          <div className="card-header"><h3 className="card-title">Payment Methods</h3></div>
          <div className="billing-item">
            <div className="billing-left">
              <div className="billing-icon" style={{ background: 'rgba(255,255,255,0.1)' }}><span className="material-symbols-outlined">account_balance</span></div>
              <div className="billing-info">
                <span className="billing-title">Net Banking</span>
                <span className="billing-date">All major banks supported</span>
              </div>
            </div>
          </div>
          <div className="billing-item">
            <div className="billing-left">
              <div className="billing-icon" style={{ background: 'rgba(255,255,255,0.1)' }}><span className="material-symbols-outlined">credit_card</span></div>
              <div className="billing-info">
                <span className="billing-title">Credit / Debit Card</span>
                <span className="billing-date">Visa, MasterCard, RuPay</span>
              </div>
            </div>
          </div>
          <div className="billing-item">
            <div className="billing-left">
              <div className="billing-icon" style={{ background: 'rgba(255,255,255,0.1)' }}><span className="material-symbols-outlined">qr_code_scanner</span></div>
              <div className="billing-info">
                <span className="billing-title">UPI</span>
                <span className="billing-date">Google Pay, PhonePe, Paytm</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
