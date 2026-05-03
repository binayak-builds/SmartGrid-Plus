import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './OnboardingPage.css'

export default function AIProcessingPage() {
  const [progress, setProgress] = useState(0)

  const stages = [
    'Analyzing property data...',
    'Building consumption model...',
    'Training AI predictor...',
    'Optimizing energy profile...',
    'Finalizing your dashboard...',
  ]

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval)
          return 100
        }
        return p + 1
      })
    }, 50)
    return () => clearInterval(interval)
  }, [])

  const stage = Math.min(Math.floor(progress / 20), stages.length - 1)

  return (
    <div className="onboarding-card processing-card">
      <div className="processing-icon">
        <span className="material-symbols-outlined" style={{ fontSize: 48, color: 'var(--primary-raw)' }}>
          psychology
        </span>
        <div className="processing-ring" />
      </div>
      <h2 className="onboarding-title">AI is Learning Your Grid</h2>
      <p className="onboarding-desc">{stages[stage]}</p>
      <div className="progress-bar-wrapper">
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <span className="progress-percent">{progress}%</span>
      </div>
      {progress >= 100 && (
        <div className="processing-complete animate-fade-in-up">
          <span className="badge badge-success">
            <span className="material-symbols-outlined icon-sm">check_circle</span>
            Profile Ready
          </span>
          <Link to="/dashboard" className="btn btn-primary btn-lg">
            Enter Dashboard
          </Link>
        </div>
      )}
    </div>
  )
}
