const express = require('express')
const { pool } = require('../config/database')
const router = express.Router()

// GET /api/usage — All usage (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT u.*, c.name as customer_name FROM usage_history u JOIN customer c ON u.meter_no = c.meter_no ORDER BY u.id DESC'
    )
    res.json(rows)
  } catch (err) {
    console.error('Usage error:', err)
    res.status(500).json({ error: 'Failed to fetch usage' })
  }
})

// GET /api/usage/stats — Aggregated analytics
router.get('/stats', async (req, res) => {
  try {
    const [totalStats] = await pool.query(
      'SELECT SUM(units) as totalUnits, AVG(units) as avgUnits, COUNT(DISTINCT meter_no) as totalMeters FROM usage_history'
    )
    const [billStats] = await pool.query(
      'SELECT SUM(totalbill) as totalRevenue, AVG(totalbill) as avgBill FROM bill'
    )
    const [unpaid] = await pool.query(
      'SELECT SUM(totalbill) as unpaidTotal, COUNT(*) as unpaidCount FROM bill WHERE status = "unpaid"'
    )
    const [monthlyUsage] = await pool.query(
      'SELECT month, SUM(units) as totalUnits, COUNT(*) as meterCount FROM usage_history GROUP BY month ORDER BY FIELD(month, "Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec")'
    )

    res.json({
      totalUnits: totalStats[0]?.totalUnits || 0,
      avgUnits: Math.round(totalStats[0]?.avgUnits || 0),
      totalMeters: totalStats[0]?.totalMeters || 0,
      totalRevenue: billStats[0]?.totalRevenue || 0,
      avgBill: Math.round(billStats[0]?.avgBill || 0),
      unpaidTotal: unpaid[0]?.unpaidTotal || 0,
      unpaidCount: unpaid[0]?.unpaidCount || 0,
      monthlyUsage,
    })
  } catch (err) {
    console.error('Usage stats error:', err)
    res.status(500).json({ error: 'Failed to fetch stats' })
  }
})

// GET /api/usage/:meter_no — Usage for a customer
router.get('/:meter_no', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM usage_history WHERE meter_no = ? ORDER BY id',
      [req.params.meter_no]
    )
    res.json(rows)
  } catch (err) {
    console.error('Customer usage error:', err)
    res.status(500).json({ error: 'Failed to fetch usage' })
  }
})

module.exports = router
