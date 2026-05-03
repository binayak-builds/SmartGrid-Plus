import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

// Layouts
import PublicLayout from './layouts/PublicLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AdminLayout from './layouts/AdminLayout'
import OnboardingLayout from './layouts/OnboardingLayout'

// Public Pages
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/auth/LoginPage'
import SignUpPage from './pages/auth/SignUpPage'

// Onboarding Pages
import PropertyTypePage from './pages/onboarding/PropertyTypePage'
import OccupancyPage from './pages/onboarding/OccupancyPage'
import AppliancesPage from './pages/onboarding/AppliancesPage'
import BudgetGoalPage from './pages/onboarding/BudgetGoalPage'
import AIProcessingPage from './pages/onboarding/AIProcessingPage'

// User Dashboard Pages
import UserDashboard from './pages/dashboard/UserDashboard'
import EnergyAnalytics from './pages/dashboard/EnergyAnalytics'
import UsageAnalytics from './pages/dashboard/UsageAnalytics'
import SolarBattery from './pages/dashboard/SolarBattery'
import AIInsights from './pages/dashboard/AIInsights'
import UserProfile from './pages/dashboard/Profile'
import SettingsPage from './pages/dashboard/SettingsPage'
import SystemAlerts from './pages/dashboard/SystemAlerts'
import BillingHistory from './pages/dashboard/BillingHistory'
import SecurePayment from './pages/dashboard/SecurePayment'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import LiveGridMonitoring from './pages/admin/LiveGridMonitoring'
import EnergyAssets from './pages/admin/EnergyAssets'
import AIPredictions from './pages/admin/AIPredictions'
import FinancialOverview from './pages/admin/FinancialOverview'
import Automation from './pages/admin/Automation'
import CustomerManagement from './pages/admin/CustomerManagement'
import InvoiceManagement from './pages/admin/InvoiceManagement'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div style={{ textAlign: 'center', color: 'var(--muted-text)' }}>
        <span className="material-symbols-outlined animate-pulse" style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>bolt</span>
        Loading...
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  return children
}

function AdminRoute({ children }) {
  const { user, loading, isAdmin } = useAuth()
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--background)' }}>
      <div style={{ textAlign: 'center', color: 'var(--muted-text)' }}>
        <span className="material-symbols-outlined animate-pulse" style={{ fontSize: 40, display: 'block', marginBottom: 12 }}>bolt</span>
        Loading...
      </div>
    </div>
  )
  if (!user) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/dashboard" replace />
  return children
}

function App() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<LandingPage />} />
      </Route>

      {/* Auth Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignUpPage />} />

      {/* Onboarding Flow */}
      <Route element={<ProtectedRoute><OnboardingLayout /></ProtectedRoute>}>
        <Route path="/onboarding/property" element={<PropertyTypePage />} />
        <Route path="/onboarding/occupancy" element={<OccupancyPage />} />
        <Route path="/onboarding/appliances" element={<AppliancesPage />} />
        <Route path="/onboarding/budget" element={<BudgetGoalPage />} />
        <Route path="/onboarding/processing" element={<AIProcessingPage />} />
      </Route>

      {/* User Dashboard Routes — Protected */}
      <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/dashboard/analytics" element={<EnergyAnalytics />} />
        <Route path="/dashboard/usage" element={<UsageAnalytics />} />
        <Route path="/dashboard/solar" element={<SolarBattery />} />
        <Route path="/dashboard/insights" element={<AIInsights />} />
        <Route path="/dashboard/profile" element={<UserProfile />} />
        <Route path="/dashboard/settings" element={<SettingsPage />} />
        <Route path="/dashboard/alerts" element={<SystemAlerts />} />
        <Route path="/dashboard/billing" element={<BillingHistory />} />
        <Route path="/dashboard/payment" element={<SecurePayment />} />
      </Route>

      {/* Admin Routes — Admin Only */}
      <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/grid" element={<LiveGridMonitoring />} />
        <Route path="/admin/assets" element={<EnergyAssets />} />
        <Route path="/admin/predictions" element={<AIPredictions />} />
        <Route path="/admin/financial" element={<FinancialOverview />} />
        <Route path="/admin/automation" element={<Automation />} />
        <Route path="/admin/customers" element={<CustomerManagement />} />
        <Route path="/admin/invoices" element={<InvoiceManagement />} />
      </Route>

      {/* Catch-all: redirect to landing */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
