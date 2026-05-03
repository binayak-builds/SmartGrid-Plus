import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { apiGetProfile, apiUpdateProfile } from '../../utils/api'
import './DashboardPages.css'

export default function UserProfile() {
  const [editing, setEditing] = useState(false)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiGetProfile().then(setProfile).catch(console.error).finally(() => setLoading(false))
  }, [])

  const update = (field) => (e) => setProfile({ ...profile, [field]: e.target.value })

  const handleSave = async () => {
    try {
      const updated = await apiUpdateProfile({
        firstName: profile.firstName, lastName: profile.lastName,
        phone: profile.phone, location: profile.location,
        propertyType: profile.propertyType,
      })
      setProfile({ ...profile, ...updated })
      setEditing(false)
    } catch (err) { alert(err.message) }
  }

  if (loading || !profile) return <div className="page animate-fade-in-up"><p style={{ color: 'var(--muted-text)' }}>Loading profile...</p></div>

  const initials = `${profile.firstName?.[0] || ''}${profile.lastName?.[0] || ''}`

  return (
    <div className="page animate-fade-in-up">
      <div className="glass-card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="profile-header-section">
          <div className="profile-avatar-large">{initials}</div>
          <div className="profile-details">
            <h2 className="profile-name">{profile.firstName} {profile.lastName}</h2>
            <p className="profile-email">{profile.email}</p>
            <div style={{ display: 'flex', gap: 'var(--space-2)', marginTop: 'var(--space-2)' }}>
              <span className="badge badge-info">{profile.login?.role === 'admin' ? 'Admin' : 'Prosumer'}</span>
              <span className="badge badge-success">Active</span>
            </div>
          </div>
          <button className={`btn ${editing ? 'btn-primary' : 'btn-secondary'}`} onClick={editing ? handleSave : () => setEditing(true)} id="btn-edit-profile">
            {editing ? <><span className="material-symbols-outlined icon-sm">check</span>Save</> : 'Edit Profile'}
          </button>
        </div>
      </div>
      <div className="grid-2">
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Account Details</h3>
          <div className="profile-section">
            {[
              { key: 'firstName', label: 'First Name' }, { key: 'lastName', label: 'Last Name' },
              { key: 'email', label: 'Email' }, { key: 'phone', label: 'Phone' },
              { key: 'propertyType', label: 'Property' }, { key: 'location', label: 'Location' },
            ].map((field) => (
              <div key={field.key} className="settings-row">
                <span className="settings-label">{field.label}</span>
                {editing && field.key !== 'email' ? (
                  <input className="input-field" style={{ maxWidth: 220, textAlign: 'right' }} value={profile[field.key] || ''} onChange={update(field.key)} />
                ) : (
                  <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>{profile[field.key] || '—'}</span>
                )}
              </div>
            ))}
            <div className="settings-row">
              <span className="settings-label">Member Since</span>
              <span style={{ fontSize: 14, color: 'var(--on-surface-variant)' }}>{new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
        <div className="glass-card">
          <h3 className="card-title" style={{ marginBottom: 'var(--space-4)' }}>Energy Profile</h3>
          <div className="profile-section">
            {[
              { label: 'Plan', value: profile.plan },
              { label: 'Grid Tier', value: profile.gridTier },
              { label: 'Solar System', value: profile.solarSystem || 'Not configured' },
              { label: 'Battery', value: profile.battery || 'Not configured' },
              { label: 'Meter', value: profile.meters?.[0]?.meterNumber || '—' },
              { label: 'Meter Status', value: profile.meters?.[0]?.status || '—' },
            ].map((field) => (
              <div key={field.label} className="settings-row">
                <span className="settings-label">{field.label}</span>
                <span style={{ fontSize: 14, color: 'var(--secondary)' }}>{field.value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 'var(--space-4)', paddingTop: 'var(--space-4)', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Link to="/dashboard/settings" className="btn btn-ghost btn-sm">
              <span className="material-symbols-outlined icon-sm">settings</span>Manage Settings
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
