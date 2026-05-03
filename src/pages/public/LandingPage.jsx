import { Link } from 'react-router-dom'
import './LandingPage.css'

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* Hero Section */}
      <section className="hero-section" id="hero">
        <div className="hero-glow" />
        <div className="hero-glow-secondary" />
        <div className="hero-grid-bg" />
        <div className="hero-content">
          <div className="hero-badge">
            <span className="badge badge-info">
              <span className="material-symbols-outlined icon-sm">auto_awesome</span>
              AI-Powered Grid Intelligence
            </span>
          </div>
          <h1 className="hero-title">
            Powering the Next
            <br />
            <span className="hero-gradient-text">Intelligence.</span>
          </h1>
          <p className="hero-description">
            The autonomous grid management platform engineered for executive control.
            Anticipate demand, optimize flow, and visualize energy futures with quiet,
            relentless precision.
          </p>
          <div className="hero-actions">
            <Link to="/signup" className="btn btn-primary btn-lg" id="hero-cta">
              <span className="material-symbols-outlined icon-sm">rocket_launch</span>
              Request Access
            </Link>
            <Link to="/login" className="btn btn-secondary btn-lg" id="hero-login">
              <span className="material-symbols-outlined icon-sm">login</span>
              Sign In
            </Link>
          </div>
        </div>

        {/* Dashboard Preview Card — the signature Stitch hero element */}
        <div className="hero-preview-card">
          <div className="preview-topbar">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div className="preview-dot" style={{ background: '#ef4444' }} />
              <div className="preview-dot" style={{ background: '#f59e0b' }} />
              <div className="preview-dot" style={{ background: '#22c55e' }} />
            </div>
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', fontWeight: 500 }}>SmartGrid+ Dashboard</span>
            <div />
          </div>
          <div className="preview-body">
            <div className="preview-sidebar">
              {['dashboard', 'bolt', 'query_stats', 'psychology', 'settings'].map((icon, i) => (
                <div key={icon} className={`preview-nav-item ${i === 0 ? 'active' : ''}`}>
                  <span className="material-symbols-outlined" style={{ fontSize: 16 }}>{icon}</span>
                </div>
              ))}
            </div>
            <div className="preview-main">
              <div className="preview-stats">
                {[
                  { label: 'Load', value: '8.4 GW', color: '#3b82f6' },
                  { label: 'Health', value: '99.7%', color: '#2dd4bf' },
                  { label: 'Savings', value: '$2.4M', color: '#3b82f6' },
                ].map((s) => (
                  <div key={s.label} className="preview-stat-card">
                    <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>{s.label}</span>
                    <span style={{ fontSize: 18, fontWeight: 700, color: s.color }}>{s.value}</span>
                  </div>
                ))}
              </div>
              <div className="preview-chart-area">
                <svg viewBox="0 0 300 80" preserveAspectRatio="none" style={{ width: '100%', height: 80 }}>
                  <defs>
                    <linearGradient id="heroGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path d="M0,60 Q30,55 60,40 T120,35 T180,25 T240,30 T300,15" fill="none" stroke="#3b82f6" strokeWidth="2" />
                  <path d="M0,60 Q30,55 60,40 T120,35 T180,25 T240,30 T300,15 L300,80 L0,80 Z" fill="url(#heroGrad)" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" id="features">
        <div className="section-container">
          <div className="section-header">
            <span className="label-caps" style={{ color: 'var(--accent-teal)' }}>
              Capabilities
            </span>
            <h2 className="headline-lg">Engineered for Scale</h2>
            <p className="body-lg" style={{ color: 'var(--muted-text)', maxWidth: 560 }}>
              Deep layers of analytics obscured by a radically simple interface.
            </p>
          </div>
          <div className="features-grid">
            {[
              {
                icon: 'hub',
                title: 'Neural Network Routing',
                desc: 'Predictive load balancing that anticipates regional spikes before they occur, routing power with microsecond latency.',
                color: 'var(--accent-teal)',
                chart: [30, 45, 35, 60, 50, 70, 55, 80],
              },
              {
                icon: 'speed',
                title: 'Zero-Latency Flow',
                desc: 'Real-time execution protocols ensuring absolute stability during critical transitions.',
                color: 'var(--accent-blue)',
                chart: [20, 40, 30, 55, 45, 65, 50, 75],
              },
              {
                icon: 'shield',
                title: 'Obsidian Security',
                desc: 'Military-grade encryption wrapping every data packet. Impervious to intrusion.',
                color: 'var(--accent-teal)',
                chart: null,
              },
              {
                icon: 'psychology',
                title: 'Automated Insight Synthesis',
                desc: 'Our AI models synthesize millions of data points into clear, actionable prose for executive briefings.',
                color: 'var(--accent-blue)',
                chart: [50, 55, 60, 58, 65, 70, 68, 75],
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="feature-card glass-card"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="feature-top">
                  <div
                    className="feature-icon-wrapper"
                    style={{ background: `color-mix(in srgb, ${feature.color} 12%, transparent)` }}
                  >
                    <span
                      className="material-symbols-outlined"
                      style={{ color: feature.color, fontSize: 24 }}
                    >
                      {feature.icon}
                    </span>
                  </div>
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-desc">{feature.desc}</p>
                {feature.chart && (
                  <div className="feature-mini-chart">
                    <svg viewBox="0 0 200 50" preserveAspectRatio="none" style={{ width: '100%', height: 40 }}>
                      <defs>
                        <linearGradient id={`fg-${i}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={feature.color === 'var(--accent-teal)' ? '#2dd4bf' : '#3b82f6'} stopOpacity="0.2" />
                          <stop offset="100%" stopColor={feature.color === 'var(--accent-teal)' ? '#2dd4bf' : '#3b82f6'} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        d={feature.chart.map((v, j) => `${j === 0 ? 'M' : 'L'}${j * (200 / (feature.chart.length - 1))},${50 - v * 0.6}`).join(' ')}
                        fill="none"
                        stroke={feature.color === 'var(--accent-teal)' ? '#2dd4bf' : '#3b82f6'}
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                      <path
                        d={feature.chart.map((v, j) => `${j === 0 ? 'M' : 'L'}${j * (200 / (feature.chart.length - 1))},${50 - v * 0.6}`).join(' ') + ` L200,50 L0,50 Z`}
                        fill={`url(#fg-${i})`}
                      />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section" id="stats">
        <div className="section-container">
          <div className="stats-grid">
            {[
              { value: '$4.2B', label: 'Energy Optimized', icon: 'trending_up' },
              { value: '340K', label: 'Active Users', icon: 'group' },
              { value: '12.8GW', label: 'Peak Capacity', icon: 'bolt' },
              { value: '98.6%', label: 'AI Accuracy', icon: 'psychology' },
            ].map((stat) => (
              <div key={stat.label} className="stats-item">
                <span className="material-symbols-outlined stats-item-icon">
                  {stat.icon}
                </span>
                <span className="stats-value">{stat.value}</span>
                <span className="stats-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section" id="cta">
        <div className="section-container">
          <div className="cta-card">
            <div className="cta-glow" />
            <h2 className="headline-lg">Ready to Transform Your Grid?</h2>
            <p className="body-lg" style={{ color: 'var(--muted-text)', maxWidth: 480 }}>
              Join the next generation of energy executives using SmartGrid+ to
              manage infrastructure with autonomous precision.
            </p>
            <Link to="/signup" className="btn btn-primary btn-lg">
              Get Started Today
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
