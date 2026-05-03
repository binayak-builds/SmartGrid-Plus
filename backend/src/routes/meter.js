const express = require('express')
const { pool } = require('../config/database')
const router = express.Router()

// GET /api/meter — All meters (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT m.*, c.name as customer_name FROM meter_info m JOIN customer c ON m.meter_no = c.meter_no ORDER BY m.meter_no'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meters' })
  }
})

// GET /api/meter/:meter_no
router.get('/:meter_no', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM meter_info WHERE meter_no = ?', [req.params.meter_no])
    if (rows.length === 0) return res.status(404).json({ error: 'Meter not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meter' })
  }
})

module.exports = router
