const express = require('express')
const { pool } = require('../config/database')
const router = express.Router()

// GET /api/predictions — All predictions (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT p.*, c.name as customer_name FROM ai_predictions p JOIN customer c ON p.meter_no = c.meter_no ORDER BY p.id DESC'
    )
    res.json(rows)
  } catch (err) {
    console.error('Predictions error:', err)
    res.status(500).json({ error: 'Failed to fetch predictions' })
  }
})

// GET /api/predictions/:meter_no — Predictions for a customer
router.get('/:meter_no', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM ai_predictions WHERE meter_no = ? ORDER BY id DESC',
      [req.params.meter_no]
    )
    res.json(rows)
  } catch (err) {
    console.error('Customer predictions error:', err)
    res.status(500).json({ error: 'Failed to fetch predictions' })
  }
})

module.exports = router
