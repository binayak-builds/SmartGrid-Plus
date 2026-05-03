import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiSignup } from '../../utils/api'
import './AuthPage.css'

export default function SignUpPage() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.firstName.trim() || !form.lastName.trim()) return setError('Please enter your full name.')
    if (!form.email.trim()) return setError('Please enter your email address.')
    if (form.password.length < 8) return setError('Password must be at least 8 characters.')

    setLoading(true)
    try {
      const data = await apiSignup(form)
      login(data.user, data.token)
      navigate('/onboarding/property')
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="auth-glow" />
          <div className="auth-brand">
            <span className="material-symbols-outlined" style={{ fontSize: 32, color: 'var(--primary-raw)' }}>bolt</span>
          </div>
          <h1 className="auth-headline">
            Start Your<br />Energy Revolution.
          </h1>
          <p className="auth-tagline">
            Join thousands of energy executives leveraging AI-driven grid
            optimization and real-time intelligence.
          </p>
          <span className="auth-copyright">© 2026 SmartGrid+ Intelligence.</span>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h2 className="auth-form-title">Create Account</h2>
          <p className="auth-form-subtitle">Get started with SmartGrid+ in seconds.</p>
          {error && (
            <div className="auth-error" id="signup-error">
              <span className="material-symbols-outlined icon-sm">error</span>
              {error}
            </div>
          )}
          <form className="auth-form" id="signup-form" onSubmit={handleSubmit}>
            <div className="form-row-2">
              <div className="form-group">
                <label className="input-label" htmlFor="signup-first">First Name</label>
                <input type="text" id="signup-first" className="input-field" placeholder="John" value={form.firstName} onChange={update('firstName')} />
              </div>
              <div className="form-group">
                <label className="input-label" htmlFor="signup-last">Last Name</label>
                <input type="text" id="signup-last" className="input-field" placeholder="Doe" value={form.lastName} onChange={update('lastName')} />
              </div>
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="signup-email">Email</label>
              <input type="email" id="signup-email" className="input-field" placeholder="you@company.com" value={form.email} onChange={update('email')} />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="signup-password">Password</label>
              <input type="password" id="signup-password" className="input-field" placeholder="Min. 8 characters" value={form.password} onChange={update('password')} />
            </div>
            <button type="submit" className="btn btn-primary btn-lg auth-submit" id="signup-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>
          <p className="auth-switch">
            Already have an account? <Link to="/login" className="form-link">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
