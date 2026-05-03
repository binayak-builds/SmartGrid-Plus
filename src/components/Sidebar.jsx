import { NavLink } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

const userNavItems = [
  { path: '/dashboard', icon: 'dashboard', label: 'Overview' },
  { path: '/dashboard/analytics', icon: 'query_stats', label: 'Energy Analytics' },
  { path: '/dashboard/usage', icon: 'electric_meter', label: 'Usage Breakdown' },
  { path: '/dashboard/solar', icon: 'solar_power', label: 'Solar & Battery' },
  { path: '/dashboard/insights', icon: 'psychology', label: 'AI Insights' },
  { path: '/dashboard/alerts', icon: 'notifications_active', label: 'Alerts' },
  { path: '/dashboard/billing', icon: 'receipt_long', label: 'Billing' },
  { path: '/dashboard/payment', icon: 'credit_card', label: 'Payment' },
]

const userBottomItems = [
  { path: '/dashboard/settings', icon: 'settings', label: 'Settings' },
  { path: '/dashboard/profile', icon: 'person', label: 'Profile' },
]

const adminNavItems = [
  { path: '/admin', icon: 'space_dashboard', label: 'Command Center' },
  { path: '/admin/grid', icon: 'cell_tower', label: 'Live Grid' },
  { path: '/admin/assets', icon: 'account_tree', label: 'Energy Assets' },
  { path: '/admin/predictions', icon: 'query_stats', label: 'AI Predictions' },
  { path: '/admin/financial', icon: 'payments', label: 'Financials' },
  { path: '/admin/automation', icon: 'smart_toy', label: 'Automation' },
  { path: '/admin/customers', icon: 'group', label: 'Customers' },
  { path: '/admin/invoices', icon: 'receipt_long', label: 'Invoices' },
]

const adminBottomItems = [
  { path: '/dashboard', icon: 'swap_horiz', label: 'User View' },
]

export default function Sidebar({ variant = 'user' }) {
  const { user, logout, isAdmin } = useAuth()
  const navItems = variant === 'admin' ? adminNavItems : userNavItems
  const bottomItems = variant === 'admin' ? adminBottomItems : userBottomItems

  const nameParts = user?.name ? user.name.split(' ') : []
  const firstName = user?.firstName || nameParts[0] || 'User'
  const lastName = user?.lastName || nameParts.slice(1).join(' ') || ''
  
  const initials = user ? `${firstName[0] || ''}${lastName[0] || ''}`.toUpperCase() : 'SG'
  const displayName = user ? `${firstName} ${lastName ? lastName[0] + '.' : ''}`.trim() : 'Guest'
  const role = variant === 'admin' ? 'Administrator' : (user?.gridTier || 'Prosumer')

  return (
    <aside className="sidebar" id="app-sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="logo-icon"><span className="material-symbols-outlined">bolt</span></div>
          <div className="logo-text">
            <span className="logo-brand">SmartGrid+</span>
            <span className="logo-tagline">{variant === 'admin' ? 'Enterprise AI' : 'Intelligence'}</span>
          </div>
        </div>
      </div>
      <nav className="sidebar-nav" aria-label="Main navigation">
        <span className="nav-section-label">Navigation</span>
        <ul className="nav-list">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} end={item.path === '/dashboard' || item.path === '/admin'} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`} id={`nav-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <span className="material-symbols-outlined nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="sidebar-bottom">
        <div className="sidebar-divider" />
        <ul className="nav-list">
          {bottomItems.map((item) => (
            <li key={item.path}>
              <NavLink to={item.path} className={({ isActive }) => `nav-link ${isActive ? 'nav-link-active' : ''}`}>
                <span className="material-symbols-outlined nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </NavLink>
            </li>
          ))}
          {isAdmin && variant === 'user' && (
            <li>
              <NavLink to="/admin" className="nav-link">
                <span className="material-symbols-outlined nav-icon">admin_panel_settings</span>
                <span className="nav-label">Admin Panel</span>
              </NavLink>
            </li>
          )}
          <li>
            <button className="nav-link" onClick={logout} style={{ width: '100%', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left' }} id="nav-logout">
              <span className="material-symbols-outlined nav-icon">logout</span>
              <span className="nav-label">Sign Out</span>
            </button>
          </li>
        </ul>
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-role">{role}</span>
          </div>
        </div>
      </div>
    </aside>
  )
}
