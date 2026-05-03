import { Outlet } from 'react-router-dom'
import Navbar from '../components/Navbar'
import './PublicLayout.css'

export default function PublicLayout() {
  return (
    <div className="public-layout">
      <Navbar />
      <main className="public-content">
        <Outlet />
      </main>
      <footer className="public-footer" id="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <span className="material-symbols-outlined">bolt</span>
              <span>SmartGrid+</span>
            </div>
            <p className="footer-tagline">
              The autonomous grid management platform engineered for executive control.
            </p>
          </div>
          <div className="footer-links">
            <div className="footer-col">
              <h4>Platform</h4>
              <a href="#">Solutions</a>
              <a href="#">Intelligence</a>
              <a href="#">Pricing</a>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <a href="#">About</a>
              <a href="#">Careers</a>
              <a href="#">Contact</a>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <a href="#">Privacy</a>
              <a href="#">Terms</a>
              <a href="#">Security</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2026 SmartGrid+ Intelligence. All rights reserved.</span>
          <a href="#">Status</a>
        </div>
      </footer>
    </div>
  )
}
