const express = require('express')
const { pool } = require('../config/database')
const router = express.Router()

// GET /api/bills — All bills (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT b.*, c.name as customer_name FROM bill b JOIN customer c ON b.meter_no = c.meter_no ORDER BY b.bill_id DESC'
    )
    res.json(rows)
  } catch (err) {
    console.error('Bills error:', err)
    res.status(500).json({ error: 'Failed to fetch bills' })
  }
})

// GET /api/bills/:meter_no — Bills for a customer
router.get('/:meter_no', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT * FROM bill WHERE meter_no = ? ORDER BY bill_id DESC',
      [req.params.meter_no]
    )
    res.json(rows)
  } catch (err) {
    console.error('Customer bills error:', err)
    res.status(500).json({ error: 'Failed to fetch bills' })
  }
})

// POST /api/bills — Generate a new bill
router.post('/', async (req, res) => {
  try {
    const { meter_no, month, units } = req.body
    // Get tax rate (use first tax row)
    const [taxes] = await pool.query('SELECT * FROM tax LIMIT 1')
    const tax = taxes[0]
    const totalbill = units * (tax?.cost_per_unit || 9)

    const [result] = await pool.query(
      'INSERT INTO bill (meter_no, month, units, totalbill, status) VALUES (?, ?, ?, ?, "unpaid")',
      [meter_no, month, units, totalbill]
    )

    res.json({ bill_id: result.insertId, meter_no, month, units, totalbill, status: 'unpaid' })
  } catch (err) {
    console.error('Generate bill error:', err)
    res.status(500).json({ error: 'Failed to generate bill' })
  }
})

module.exports = router
