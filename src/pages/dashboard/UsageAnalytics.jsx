import './DashboardPages.css'

export default function UsageAnalytics() {
  return (
    <div className="page animate-fade-in-up">
      <p className="page-subtitle">Detailed appliance-level usage data and patterns.</p>
      <div className="grid-4" style={{ marginBottom: 'var(--space-6)' }}>
        {[
          { label: 'HVAC', value: '342 kWh', pct: '40%', icon: 'ac_unit' },
          { label: 'Water Heater', value: '128 kWh', pct: '15%', icon: 'water_heater' },
          { label: 'Kitchen', value: '102 kWh', pct: '12%', icon: 'kitchen' },
          { label: 'Lighting', value: '85 kWh', pct: '10%', icon: 'lightbulb' },
        ].map((item) => (
          <div key={item.label} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--primary)', fontSize: 20 }}>{item.icon}</span>
              <span className="stat-label">{item.label}</span>
            </div>
            <span className="stat-value" style={{ fontSize: 24 }}>{item.value}</span>
            <span style={{ fontSize: 13, color: 'var(--on-surface-variant)' }}>{item.pct} of total</span>
          </div>
        ))}
      </div>
      <div className="glass-card">
        <div className="card-header">
          <h3 className="card-title">Appliance Usage Timeline</h3>
        </div>
        <div className="chart-placeholder">
          <div className="chart-bars">
            {[80, 55, 90, 45, 70, 35, 65, 50, 85, 40, 75, 60].map((h, i) => (
              <div key={i} className="chart-bar" style={{ height: `${h}%` }}>
                <div className="chart-bar-fill" style={{ animationDelay: `${i * 50}ms`, background: `linear-gradient(to top, var(--secondary), rgba(78, 222, 163, 0.3))` }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
