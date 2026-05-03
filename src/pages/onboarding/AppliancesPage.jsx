import { useState } from 'react'
import { Link } from 'react-router-dom'
import './OnboardingPage.css'

const appliances = [
  { icon: 'ac_unit', label: 'HVAC System' },
  { icon: 'local_laundry_service', label: 'Washer / Dryer' },
  { icon: 'kitchen', label: 'Kitchen Appliances' },
  { icon: 'water_heater', label: 'Water Heater' },
  { icon: 'solar_power', label: 'Solar Panels' },
  { icon: 'battery_charging_full', label: 'Battery Storage' },
  { icon: 'directions_car', label: 'EV Charger' },
  { icon: 'pool', label: 'Pool / Hot Tub' },
]

export default function AppliancesPage() {
  const [selected, setSelected] = useState(new Set())

  const toggle = (label) => {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  return (
    <div className="onboarding-card">
      <h2 className="onboarding-title">Select your major appliances</h2>
      <p className="onboarding-desc">We'll monitor these to identify savings and optimization opportunities.</p>
      <div className="appliance-grid">
        {appliances.map((a) => (
          <button
            key={a.label}
            className={`appliance-item ${selected.has(a.label) ? 'selected' : ''}`}
            id={`appliance-${a.label.toLowerCase().replace(/\s+/g, '-')}`}
            onClick={() => toggle(a.label)}
          >
            <span className="material-symbols-outlined">{a.icon}</span>
            <span>{a.label}</span>
            {selected.has(a.label) && (
              <span className="appliance-check">
                <span className="material-symbols-outlined icon-sm">check</span>
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="onboarding-actions">
        <Link to="/onboarding/occupancy" className="btn btn-secondary">Back</Link>
        <Link to="/onboarding/budget" className={`btn btn-primary ${selected.size === 0 ? 'btn-disabled' : ''}`}>
          Continue ({selected.size} selected)
        </Link>
      </div>
    </div>
  )
}
