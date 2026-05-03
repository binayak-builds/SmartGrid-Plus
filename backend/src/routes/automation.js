const express = require('express')
const { pool } = require('../config/database')
const router = express.Router()

// GET /api/automation — All rules (admin)
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT ar.*, c.name as customer_name FROM automation_rules ar JOIN customer c ON ar.meter_no = c.meter_no ORDER BY ar.rule_id'
    )
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch automation rules' })
  }
})

// GET /api/automation/:meter_no — Rules for a customer
router.get('/:meter_no', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM automation_rules WHERE meter_no = ?', [req.params.meter_no])
    res.json(rows)
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch rules' })
  }
})

// PUT /api/automation/:rule_id/toggle
router.put('/:rule_id/toggle', async (req, res) => {
  try {
    const [rules] = await pool.query('SELECT * FROM automation_rules WHERE rule_id = ?', [req.params.rule_id])
    if (rules.length === 0) return res.status(404).json({ error: 'Rule not found' })
    const newStatus = rules[0].status === 'active' ? 'inactive' : 'active'
    await pool.query('UPDATE automation_rules SET status = ? WHERE rule_id = ?', [newStatus, req.params.rule_id])
    res.json({ ...rules[0], status: newStatus })
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle rule' })
  }
})

module.exports = router
