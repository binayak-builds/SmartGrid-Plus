import { useState } from 'react'
import { Link } from 'react-router-dom'
import './OnboardingPage.css'

const propertyTypes = [
  { icon: 'home', label: 'Residential Home', desc: 'Single family dwelling' },
  { icon: 'apartment', label: 'Apartment / Condo', desc: 'Multi-unit complex' },
  { icon: 'business', label: 'Commercial Office', desc: 'Business or retail space' },
  { icon: 'factory', label: 'Industrial Facility', desc: 'Manufacturing or warehouse' },
]

export default function PropertyTypePage() {
  const [selected, setSelected] = useState(null)

  return (
    <div className="onboarding-card">
      <h2 className="onboarding-title">What type of property do you manage?</h2>
      <p className="onboarding-desc">This helps us tailor your AI energy model for maximum accuracy.</p>
      <div className="option-grid">
        {propertyTypes.map((type) => (
          <button
            key={type.label}
            className={`option-card ${selected === type.label ? 'selected' : ''}`}
            id={`option-${type.label.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => setSelected(type.label)}
          >
            <span className="material-symbols-outlined option-icon">{type.icon}</span>
            <span className="option-label">{type.label}</span>
            <span className="option-desc">{type.desc}</span>
            {selected === type.label && (
              <span className="option-check">
                <span className="material-symbols-outlined icon-sm">check_circle</span>
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="onboarding-actions">
        <Link to="/" className="btn btn-secondary">Back</Link>
        <Link to="/onboarding/occupancy" className={`btn btn-primary ${!selected ? 'btn-disabled' : ''}`}>Continue</Link>
      </div>
    </div>
  )
}
