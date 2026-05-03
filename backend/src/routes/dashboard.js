const express = require('express')
const { pool } = require('../config/database')
const router = express.Router()

// GET /api/dashboard/:meter_no — Join customer + bill + usage_history
router.get('/:meter_no', async (req, res) => {
  try {
    const { meter_no } = req.params

    // Customer info
    const [customers] = await pool.query(
      'SELECT c.*, l.username, l.user_type FROM customer c JOIN login l ON c.meter_no = l.meter_no WHERE c.meter_no = ?',
      [meter_no]
    )
    const customer = customers[0] || null

    // Bills
    const [bills] = await pool.query(
      'SELECT * FROM bill WHERE meter_no = ? ORDER BY bill_id DESC',
      [meter_no]
    )

    // Usage history
    const [usage] = await pool.query(
      'SELECT * FROM usage_history WHERE meter_no = ? ORDER BY id DESC',
      [meter_no]
    )

    // Meter info
    const [meters] = await pool.query(
      'SELECT * FROM meter_info WHERE meter_no = ?',
      [meter_no]
    )

    // Stats
    const [billStats] = await pool.query(
      'SELECT SUM(totalbill) as totalSpent, SUM(units) as totalUnits, COUNT(*) as totalBills FROM bill WHERE meter_no = ?',
      [meter_no]
    )

    const [unpaidBills] = await pool.query(
      'SELECT SUM(totalbill) as unpaidAmount, COUNT(*) as unpaidCount FROM bill WHERE meter_no = ? AND status = "unpaid"',
      [meter_no]
    )

    // Latest alerts
    const [alerts] = await pool.query(
      'SELECT * FROM alerts WHERE meter_no = ? ORDER BY created_at DESC LIMIT 5',
      [meter_no]
    )

    // AI prediction
    const [predictions] = await pool.query(
      'SELECT * FROM ai_predictions WHERE meter_no = ? ORDER BY id DESC LIMIT 1',
      [meter_no]
    )

    // Energy assets
    const [assets] = await pool.query(
      'SELECT * FROM energy_assets WHERE meter_no = ?',
      [meter_no]
    )

    res.json({
      customer,
      bills,
      usage,
      meter: meters[0] || null,
      stats: {
        totalSpent: billStats[0]?.totalSpent || 0,
        totalUnits: billStats[0]?.totalUnits || 0,
        totalBills: billStats[0]?.totalBills || 0,
        unpaidAmount: unpaidBills[0]?.unpaidAmount || 0,
        unpaidCount: unpaidBills[0]?.unpaidCount || 0,
      },
      alerts,
      prediction: predictions[0] || null,
      assets,
    })
  } catch (err) {
    console.error('Dashboard error:', err)
    res.status(500).json({ error: 'Failed to load dashboard' })
  }
})

module.exports = router
