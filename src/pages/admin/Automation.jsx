import { useState, useEffect } from 'react'
import { apiGetAdminAutomation, apiToggleRule } from '../../utils/api'
import '../dashboard/DashboardPages.css'

export default function Automation() {
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGetAdminAutomation()
      .then(setRules)
      .catch(err => console.error(err))
      .finally(() => setLoading(false))
  }, [])

  const handleToggle = async (ruleId) => {
    try {
      const updatedRule = await apiToggleRule(ruleId)
      setRules(prev => prev.map(r => r.rule_id === ruleId ? { ...r, status: updatedRule.status } : r))
    } catch (err) {
      alert('Failed to toggle rule: ' + err.message)
    }
  }

  if (loading) return <div className="page"><p>Loading automation rules...</p></div>

  const activeRulesCount = rules.filter(r => r.status === 'active').length

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">Manage grid-wide automation and self-healing rules.</p>
      
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card"><span className="stat-label">Total Rules</span><span className="stat-value">{rules.length}</span></div>
        <div className="stat-card"><span className="stat-label">Active Rules</span><span className="stat-value" style={{ color: '#4ede83' }}>{activeRulesCount}</span></div>
        <div className="stat-card"><span className="stat-label">Inactive Rules</span><span className="stat-value" style={{ color: '#ef4444' }}>{rules.length - activeRulesCount}</span></div>
      </div>

      <div className="glass-card">
        <div className="card-header"><h3 className="card-title">Automation Rule Registry</h3></div>
        <table className="data-table">
          <thead><tr><th>Rule ID</th><th>Customer</th><th>Meter</th><th>Rule Name</th><th>Action</th><th>Status</th><th>Toggle</th></tr></thead>
          <tbody>
            {rules.map(r => (
              <tr key={r.rule_id}>
                <td style={{ fontWeight: 600 }}>AUTO-{r.rule_id}</td>
                <td>{r.customer_name}</td>
                <td>{r.meter_no}</td>
                <td>{r.rule_name}</td>
                <td>{r.action}</td>
                <td>
                  <span className={`badge ${r.status === 'active' ? 'badge-success' : 'badge-warning'}`}>
                    {r.status}
                  </span>
                </td>
                <td>
                  <button 
                    className={`btn btn-sm ${r.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handleToggle(r.rule_id)}
                  >
                    {r.status === 'active' ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
