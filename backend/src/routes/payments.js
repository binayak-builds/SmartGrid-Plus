const express = require('express')
const { pool } = require('../config/database')
const router = express.Router()

// POST /api/payments — Pay a bill and update status
router.post('/', async (req, res) => {
  try {
    const { bill_id, amount } = req.body

    // Insert payment
    const [result] = await pool.query(
      'INSERT INTO payments (bill_id, amount, payment_date, status) VALUES (?, ?, CURDATE(), "completed")',
      [bill_id, amount]
    )

    // Update bill status to paid
    await pool.query('UPDATE bill SET status = "paid" WHERE bill_id = ?', [bill_id])

    res.json({ payment_id: result.insertId, bill_id, amount, status: 'completed' })
  } catch (err) {
    console.error('Payment error:', err)
    res.status(500).json({ error: 'Payment failed' })
  }
})

// GET /api/payments/history — All payments
router.get('/history', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT p.*, b.meter_no, b.month, c.name as customer_name FROM payments p JOIN bill b ON p.bill_id = b.bill_id JOIN customer c ON b.meter_no = c.meter_no ORDER BY p.payment_id DESC'
    )
    res.json(rows)
  } catch (err) {
    console.error('Payment history error:', err)
    res.status(500).json({ error: 'Failed to fetch payments' })
  }
})

// GET /api/payments/:meter_no — Payments for a customer
router.get('/:meter_no', async (req, res) => {
  try {
    const [rows] = await pool.query(
      'SELECT p.*, b.month FROM payments p JOIN bill b ON p.bill_id = b.bill_id WHERE b.meter_no = ? ORDER BY p.payment_id DESC',
      [req.params.meter_no]
    )
    res.json(rows)
  } catch (err) {
    console.error('Customer payments error:', err)
    res.status(500).json({ error: 'Failed to fetch payments' })
  }
})

module.exports = router
