const express = require('express')
const { pool } = require('../config/database')
const router = express.Router()

// GET /api/energy-assets — All energy assets (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT ea.*, c.name as customer_name FROM energy_assets ea JOIN customer c ON ea.meter_no = c.meter_no ORDER BY ea.asset_id'
    )
    res.json(rows)
  } catch (err) {
    console.error('Assets error:', err)
    res.status(500).json({ error: 'Failed to fetch assets' })
  }
})

// GET /api/energy-assets/stats — Asset summary
router.get('/stats', async (req, res) => {
  try {
    const [solar] = await pool.query(
      'SELECT COUNT(*) as count, SUM(capacity) as totalCapacity FROM energy_assets WHERE type = "solar"'
    )
    const [battery] = await pool.query(
      'SELECT COUNT(*) as count, SUM(capacity) as totalCapacity FROM energy_assets WHERE type = "battery"'
    )
    const [active] = await pool.query(
      'SELECT COUNT(*) as count FROM energy_assets WHERE status = "active"'
    )
    const [inactive] = await pool.query(
      'SELECT COUNT(*) as count FROM energy_assets WHERE status = "inactive"'
    )

    res.json({
      solar: { count: solar[0].count, totalCapacity: solar[0].totalCapacity || 0 },
      battery: { count: battery[0].count, totalCapacity: battery[0].totalCapacity || 0 },
      activeCount: active[0].count,
      inactiveCount: inactive[0].count,
    })
  } catch (err) {
    console.error('Asset stats error:', err)
    res.status(500).json({ error: 'Failed to fetch asset stats' })
  }
})

// GET /api/energy-assets/:meter_no — Assets for a customer
router.get('/:meter_no', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM energy_assets WHERE meter_no = ?',
      [req.params.meter_no]
    )
    res.json(rows)
  } catch (err) {
    console.error('Customer assets error:', err)
    res.status(500).json({ error: 'Failed to fetch assets' })
  }
})

module.exports = router
