import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiGetAutomation, apiToggleRule } from '../../utils/api'
import './DashboardPages.css'

export default function SettingsPage() {
  const { user } = useAuth()
  const [rules, setRules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.meter_no) {
      apiGetAutomation(user.meter_no)
        .then(setRules)
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [user])

  const handleToggle = async (ruleId) => {
    try {
      const updatedRule = await apiToggleRule(ruleId)
      setRules(prev => prev.map(r => r.rule_id === ruleId ? { ...r, status: updatedRule.status } : r))
    } catch (err) {
      alert('Failed to toggle rule: ' + err.message)
    }
  }

  if (loading) return <div className="page"><p>Loading settings...</p></div>

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">Configure your SmartGrid+ intelligence settings for Meter {user?.meter_no}.</p>
      
      <div className="grid-2">
        <div className="glass-card">
          <div className="card-header"><h3 className="card-title">Automation Rules</h3></div>
          <p style={{ color: 'var(--on-surface-variant)', fontSize: 14, marginBottom: 16 }}>
            Enable AI-driven self-healing and load balancing rules.
          </p>
          {rules.map(rule => (
            <div key={rule.rule_id} className="billing-item" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 16 }}>
              <div className="billing-left">
                <div className="billing-info">
                  <span className="billing-title">{rule.rule_name}</span>
                  <span className="billing-date">Action: {rule.action}</span>
                </div>
              </div>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={rule.status === 'active'} 
                  onChange={() => handleToggle(rule.rule_id)} 
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
          ))}
          {rules.length === 0 && <p style={{ color: 'var(--on-surface-variant)' }}>No automation rules configured for this meter.</p>}
        </div>

        <div className="glass-card">
          <div className="card-header"><h3 className="card-title">Preferences</h3></div>
          <div className="form-group" style={{ marginBottom: 20 }}>
            <label className="input-label">Optimization Priority</label>
            <select className="input-field" defaultValue="cost">
              <option value="cost">Cost Savings (Default)</option>
              <option value="eco">Eco-Friendly (Low Carbon)</option>
              <option value="balanced">Balanced Performance</option>
            </select>
          </div>
          <div className="form-group">
            <label className="input-label">Notification Settings</label>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 8 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> SMS Alerts for Outages
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Email Billing Reminders
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked /> Weekly AI Insights Summary
              </label>
            </div>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 20 }}>Save Preferences</button>
        </div>
      </div>
    </div>
  )
}
