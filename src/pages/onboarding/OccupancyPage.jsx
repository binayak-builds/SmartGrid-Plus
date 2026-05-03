import { Link } from 'react-router-dom'
import './OnboardingPage.css'

export default function OccupancyPage() {
  return (
    <div className="onboarding-card">
      <h2 className="onboarding-title">How many occupants?</h2>
      <p className="onboarding-desc">Occupancy patterns directly affect energy consumption forecasts.</p>
      <div className="form-stack">
        <div className="form-group">
          <label className="input-label" htmlFor="occupants">Number of Occupants</label>
          <input type="number" id="occupants" className="input-field" placeholder="e.g. 4" min="1" />
        </div>
        <div className="form-group">
          <label className="input-label" htmlFor="sqft">Square Footage</label>
          <input type="number" id="sqft" className="input-field" placeholder="e.g. 2400" />
        </div>
        <div className="form-group">
          <label className="input-label" htmlFor="schedule">Typical Schedule</label>
          <select id="schedule" className="input-field">
            <option value="">Select schedule pattern</option>
            <option value="home-all-day">Home all day</option>
            <option value="work-9-5">Away 9 AM – 5 PM</option>
            <option value="variable">Variable / Shift work</option>
          </select>
        </div>
      </div>
      <div className="onboarding-actions">
        <Link to="/onboarding/property" className="btn btn-secondary">Back</Link>
        <Link to="/onboarding/appliances" className="btn btn-primary">Continue</Link>
      </div>
    </div>
  )
}
