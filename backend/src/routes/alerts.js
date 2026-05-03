const express = require('express')
const { pool } = require('../config/database')
const router = express.Router()

// GET /api/alerts — All alerts (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT a.*, c.name as customer_name FROM alerts a JOIN customer c ON a.meter_no = c.meter_no ORDER BY a.created_at DESC'
    )
    res.json(rows)
  } catch (err) {
    console.error('Alerts error:', err)
    res.status(500).json({ error: 'Failed to fetch alerts' })
  }
})

// GET /api/alerts/:meter_no — Alerts for a customer
router.get('/:meter_no', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM alerts WHERE meter_no = ? ORDER BY created_at DESC',
      [req.params.meter_no]
    )
    res.json(rows)
  } catch (err) {
    console.error('Customer alerts error:', err)
    res.status(500).json({ error: 'Failed to fetch alerts' })
  }
})

module.exports = router
