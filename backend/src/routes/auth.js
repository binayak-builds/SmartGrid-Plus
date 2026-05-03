const express = require('express')
const jwt = require('jsonwebtoken')
const { pool } = require('../config/database')
const router = express.Router()

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password, meter_no } = req.body

    let query, params
    if (meter_no) {
      query = 'SELECT * FROM login WHERE meter_no = ? AND password = ?'
      params = [meter_no, password]
    } else {
      query = 'SELECT * FROM login WHERE username = ? AND password = ?'
      params = [username, password]
    }

    const [rows] = await pool.query(query, params)
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' })
    }

    const user = rows[0]

    // Get customer info
    const [customers] = await pool.query('SELECT * FROM customer WHERE meter_no = ?', [user.meter_no])
    const customer = customers[0] || {}

    const token = jwt.sign(
      { meter_no: user.meter_no, username: user.username, user_type: user.user_type },
      process.env.JWT_SECRET || 'smartgrid_secret',
      { expiresIn: '24h' }
    )

    res.json({
      token,
      user: {
        meter_no: user.meter_no,
        username: user.username,
        name: user.name,
        user_type: user.user_type,
        email: customer.email || '',
        phone: customer.phone || '',
        address: customer.address || '',
        city: customer.city || '',
        state: customer.state || '',
      }
    })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ error: 'Login failed' })
  }
})

// GET /api/auth/me
router.get('/me', async (req, res) => {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader) return res.status(401).json({ error: 'No token' })

    const token = authHeader.replace('Bearer ', '')
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'smartgrid_secret')

    const [users] = await pool.query('SELECT * FROM login WHERE meter_no = ?', [decoded.meter_no])
    if (users.length === 0) return res.status(401).json({ error: 'User not found' })

    const user = users[0]
    const [customers] = await pool.query('SELECT * FROM customer WHERE meter_no = ?', [user.meter_no])
    const customer = customers[0] || {}

    res.json({
      meter_no: user.meter_no,
      username: user.username,
      name: user.name,
      user_type: user.user_type,
      role: user.user_type,
      email: customer.email || '',
      phone: customer.phone || '',
      address: customer.address || '',
      city: customer.city || '',
      state: customer.state || '',
    })
  } catch (err) {
    console.error('Auth/me error:', err)
    res.status(401).json({ error: 'Invalid token' })
  }
})

module.exports = router
