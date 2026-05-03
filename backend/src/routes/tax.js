const express = require('express')
const { pool } = require('../config/database')
const router = express.Router()

// GET /api/tax — All tax rates
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM tax ORDER BY tax_id')
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch tax rates' })
  }
})

module.exports = router
