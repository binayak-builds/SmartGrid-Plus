const express = require('express')
const { pool } = require('../config/database')
const router = express.Router()

// GET /api/customer/profile/:meter_no
router.get('/profile/:meter_no', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT c.*, l.username, l.user_type FROM customer c JOIN login l ON c.meter_no = l.meter_no WHERE c.meter_no = ?',
      [req.params.meter_no]
    )
    if (rows.length === 0) return res.status(404).json({ error: 'Customer not found' })
    res.json(rows[0])
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch profile' })
  }
})

// PUT /api/customer/update/:meter_no
router.put('/update/:meter_no', async (req, res) => {
  try {
    const { name, email, phone, address, city, state } = req.body
    await pool.query(
      'UPDATE customer SET name=?, email=?, phone=?, address=?, city=?, state=? WHERE meter_no=?',
      [name, email, phone, address, city, state, req.params.meter_no]
    )
    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile' })
  }
})

module.exports = router
