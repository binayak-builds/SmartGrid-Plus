const express = require('express')
const { pool } = require('../config/database')
const router = express.Router()

// GET /api/admin/users — All users
router.get('/users', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT l.meter_no, l.username, l.name, l.user_type, c.email, c.phone, c.address, c.city, c.state FROM login l LEFT JOIN customer c ON l.meter_no = c.meter_no ORDER BY l.meter_no'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users' })
  }
})

// GET /api/admin/dashboard — Admin stats
router.get('/dashboard', async (req, res) => {
  try {
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM login')
    const [totalBills] = await pool.query('SELECT SUM(totalbill) as total, COUNT(*) as count FROM bill')
    const [unpaid] = await pool.query('SELECT SUM(totalbill) as total, COUNT(*) as count FROM bill WHERE status = "unpaid"')
    const [totalUnits] = await pool.query('SELECT SUM(units) as total FROM usage_history')
    const [activeAssets] = await pool.query('SELECT COUNT(*) as count FROM energy_assets WHERE status = "active"')
    const [activeRules] = await pool.query('SELECT COUNT(*) as count FROM automation_rules WHERE status = "active"')
    const [alertCount] = await pool.query('SELECT COUNT(*) as count FROM alerts')
    const [highAlerts] = await pool.query('SELECT COUNT(*) as count FROM alerts WHERE severity = "high"')

    res.json({
      customerCount: userCount[0].count,
      totalRevenue: totalBills[0]?.total || 0,
      totalBillCount: totalBills[0]?.count || 0,
      unpaidAmount: unpaid[0]?.total || 0,
      unpaidCount: unpaid[0]?.count || 0,
      totalConsumption: totalUnits[0]?.total || 0,
      activeAssets: activeAssets[0].count,
      activeRules: activeRules[0].count,
      totalAlerts: alertCount[0].count,
      highAlerts: highAlerts[0].count,
    })
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin dashboard' })
  }
})

module.exports = router
