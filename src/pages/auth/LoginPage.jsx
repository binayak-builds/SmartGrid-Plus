import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { apiLogin } from '../../utils/api'
import './AuthPage.css'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await apiLogin(username, password)
      login(data.user, data.token)
      if (data.user.user_type === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.')
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
            <span className="material-symbols-outlined" style={{ fontSize: 28, color: '#fff' }}>bolt</span>
          </div>
          <h1 className="auth-headline">The Future of<br />Energy Control.</h1>
          <p className="auth-tagline">
            Precision intelligence for executive stakeholders.<br />
            Manage massive grids with quiet, automated power.
          </p>
          <span className="auth-copyright">&copy; 2026 SmartGrid+ Intelligence.</span>
        </div>
      </div>
      <div className="auth-right">
        <div className="auth-form-wrapper">
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to access your dashboard.</p>
          {error && <div className="auth-error">{error}</div>}
          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="input-label" htmlFor="login-username">EMAIL, USERNAME, OR METER NO</label>
              <input id="login-username" className="input-field" type="text" placeholder="e.g. user@example.com or admin" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="input-label" htmlFor="login-password">PASSWORD</label>
              <input id="login-password" className="input-field" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg btn-block" id="login-submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
          <p className="auth-footer-text">
            Don't have an account? <Link to="/signup">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
