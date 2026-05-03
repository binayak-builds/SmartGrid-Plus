import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { apiGetProfile, apiUpdateProfile } from '../../utils/api'
import './DashboardPages.css'

export default function Profile() {
  const { user } = useAuth()
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: ''
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (user?.meter_no) {
      apiGetProfile(user.meter_no)
        .then(data => {
          if (data) {
            setProfile({
              name: data.name || '',
              email: data.email || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || '',
              state: data.state || ''
            })
          }
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false))
    }
  }, [user])

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      await apiUpdateProfile(user.meter_no, profile)
      setMessage('Profile updated successfully!')
      setTimeout(() => setMessage(''), 3000)
    } catch (err) {
      setMessage('Failed to update profile: ' + err.message)
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="page"><p>Loading profile...</p></div>

  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">Manage your personal and grid connection information.</p>
      
      <div className="glass-card" style={{ maxWidth: 800, margin: '0 auto' }}>
        <div className="card-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div className="user-avatar" style={{ width: 64, height: 64, fontSize: 24, background: 'var(--primary)', color: '#000' }}>
              {profile.name.charAt(0) || user?.name?.charAt(0) || 'U'}
            </div>
            <div>
              <h3 className="card-title" style={{ margin: 0, fontSize: '1.5rem' }}>{user?.name}</h3>
              <p style={{ color: 'var(--on-surface-variant)', margin: '4px 0 0 0' }}>{user?.user_type === 'admin' ? 'Administrator' : 'Customer'}</p>
            </div>
          </div>
        </div>

        {message && (
          <div style={{ padding: '12px 20px', background: message.includes('success') ? 'rgba(78,222,131,0.1)' : 'rgba(239,68,68,0.1)', color: message.includes('success') ? '#4ede83' : '#ef4444', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ padding: 24 }}>
          <div className="grid-2">
            <div className="form-group">
              <label className="input-label">Full Name</label>
              <input type="text" className="input-field" name="name" value={profile.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="input-label">Email Address</label>
              <input type="email" className="input-field" name="email" value={profile.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="input-label">Phone Number</label>
              <input type="tel" className="input-field" name="phone" value={profile.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="input-label">Meter Number</label>
              <input type="text" className="input-field" value={user?.meter_no || ''} disabled style={{ opacity: 0.7, cursor: 'not-allowed' }} />
            </div>
          </div>

          <h4 style={{ marginTop: 24, marginBottom: 16, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>Address Details</h4>
          
          <div className="form-group">
            <label className="input-label">Street Address</label>
            <input type="text" className="input-field" name="address" value={profile.address} onChange={handleChange} />
          </div>
          <div className="grid-2" style={{ marginTop: 16 }}>
            <div className="form-group">
              <label className="input-label">City</label>
              <input type="text" className="input-field" name="city" value={profile.city} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="input-label">State</label>
              <input type="text" className="input-field" name="state" value={profile.state} onChange={handleChange} />
            </div>
          </div>

          <div style={{ marginTop: 32, display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="btn btn-primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
