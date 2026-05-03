import { Outlet, useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import './OnboardingLayout.css'

const steps = [
  { path: '/onboarding/property', label: 'Property Type', step: 1 },
  { path: '/onboarding/occupancy', label: 'Occupancy', step: 2 },
  { path: '/onboarding/appliances', label: 'Appliances', step: 3 },
  { path: '/onboarding/budget', label: 'Budget Goal', step: 4 },
  { path: '/onboarding/processing', label: 'AI Processing', step: 5 },
]

export default function OnboardingLayout() {
  const location = useLocation()
  const currentStep = steps.findIndex(s => s.path === location.pathname) + 1

  return (
    <div className="onboarding-layout">
      <div className="onboarding-header">
        <Link to="/" className="onboarding-logo">
          <span className="material-symbols-outlined">bolt</span>
          <span>SmartGrid+</span>
        </Link>
        <div className="onboarding-progress">
          {steps.map((step, i) => (
            <div
              key={step.path}
              className={`progress-step ${
                i + 1 < currentStep ? 'completed' :
                i + 1 === currentStep ? 'active' : ''
              }`}
            >
              <div className="step-dot">
                {i + 1 < currentStep ? (
                  <span className="material-symbols-outlined icon-sm">check</span>
                ) : (
                  <span>{step.step}</span>
                )}
              </div>
              <span className="step-label">{step.label}</span>
              {i < steps.length - 1 && <div className="step-connector" />}
            </div>
          ))}
        </div>
      </div>
      <main className="onboarding-content">
        <Outlet />
      </main>
    </div>
  )
}
