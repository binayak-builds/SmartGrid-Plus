import { useLocation, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './TopBar.css'

const titles = {
  '/dashboard': 'Dashboard Overview',
  '/dashboard/analytics': 'Energy Analytics',
  '/dashboard/usage': 'Usage Breakdown',
  '/dashboard/solar': 'Solar & Battery',
  '/dashboard/insights': 'AI Insights',
  '/dashboard/alerts': 'System Alerts',
  '/dashboard/billing': 'Billing History',
  '/dashboard/payment': 'Secure Payment',
  '/dashboard/profile': 'Profile',
  '/dashboard/settings': 'Settings',
  '/admin': 'Command Center',
  '/admin/grid': 'Live Grid Monitoring',
  '/admin/assets': 'Energy Assets',
  '/admin/predictions': 'AI Predictions',
  '/admin/financial': 'Financial Overview',
  '/admin/automation': 'Automation Rules',
  '/admin/customers': 'Customer Management',
  '/admin/invoices': 'Invoice Management',
}

export default function TopBar() {
  const location = useLocation()
  const { isAdmin } = useAuth()
  const title = titles[location.pathname] || 'Dashboard'
  const isAdminPage = location.pathname.startsWith('/admin')

  return (
    <div className="topbar" id="topbar">
      <div className="topbar-left">
        <h1 className="topbar-title">{title}</h1>
      </div>
      <div className="topbar-right">
        {isAdminPage ? (
          <Link to="/dashboard" className="btn btn-ghost btn-sm" id="switch-to-user">
            <span className="material-symbols-outlined icon-sm">swap_horiz</span>
            User View
          </Link>
        ) : isAdmin ? (
          <Link to="/admin" className="btn btn-ghost btn-sm" id="switch-to-admin">
            <span className="material-symbols-outlined icon-sm">admin_panel_settings</span>
            Admin Panel
          </Link>
        ) : null}
      </div>
    </div>
  )
}
