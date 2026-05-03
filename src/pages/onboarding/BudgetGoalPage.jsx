import { Link } from 'react-router-dom'
import './OnboardingPage.css'

export default function BudgetGoalPage() {
  return (
    <div className="onboarding-card">
      <h2 className="onboarding-title">Set your energy budget goal</h2>
      <p className="onboarding-desc">Our AI will optimize your grid to hit this target every billing cycle.</p>
      <div className="form-stack">
        <div className="form-group">
          <label className="input-label" htmlFor="budget">Monthly Budget Target ($)</label>
          <input type="number" id="budget" className="input-field" placeholder="e.g. 150" />
        </div>
        <div className="form-group">
          <label className="input-label" htmlFor="savings-goal">Savings Goal (%)</label>
          <input type="range" id="savings-goal" min="5" max="50" defaultValue="20" className="range-input" />
          <div className="range-labels">
            <span>5%</span>
            <span>Conservative</span>
            <span>50%</span>
          </div>
        </div>
        <div className="form-group">
          <label className="input-label" htmlFor="priority">Optimization Priority</label>
          <select id="priority" className="input-field">
            <option value="">Choose priority</option>
            <option value="cost">Minimize Cost</option>
            <option value="green">Maximize Green Energy</option>
            <option value="comfort">Maximize Comfort</option>
            <option value="balanced">Balanced</option>
          </select>
        </div>
      </div>
      <div className="onboarding-actions">
        <Link to="/onboarding/appliances" className="btn btn-secondary">Back</Link>
        <Link to="/onboarding/processing" className="btn btn-primary">
          <span className="material-symbols-outlined icon-sm">auto_awesome</span>
          Generate AI Profile
        </Link>
      </div>
    </div>
  )
}
