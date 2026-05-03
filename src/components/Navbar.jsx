import { Link } from 'react-router-dom'
import './Navbar.css'

export default function Navbar() {
  return (
    <nav className="navbar" id="landing-navbar">
      <div className="navbar-inner">
        <Link to="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: '#fff' }}>bolt</span>
          </div>
          <span className="navbar-brand">SmartGrid+</span>
        </Link>
        <div className="navbar-links">
          <a href="#features" className="navbar-link">Features</a>
          <a href="#stats" className="navbar-link">Network</a>
          <a href="#cta" className="navbar-link">Enterprise</a>
        </div>
        <div className="navbar-actions">
          <Link to="/login" className="btn btn-ghost navbar-auth-btn">Sign In</Link>
          <Link to="/signup" className="btn btn-primary navbar-auth-btn">
            Request Access
          </Link>
        </div>
      </div>
    </nav>
  )
}
