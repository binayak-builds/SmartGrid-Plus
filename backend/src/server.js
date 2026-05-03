require('dotenv').config()
const express = require('express')
const cors = require('cors')

const apiRoutes = require('./routes/index')

const app = express()
const PORT = process.env.PORT || 5000

// Middleware — allow any localhost port in development to avoid CORS mismatch
const corsOrigin = process.env.NODE_ENV === 'production'
  ? process.env.CLIENT_URL
  : (origin, callback) => {
      if (!origin || /^http:\/\/localhost:\d+$/.test(origin)) {
        callback(null, true)
      } else {
        callback(new Error('Not allowed by CORS'))
      }
    }
app.use(cors({ origin: corsOrigin, credentials: true }))
app.use(express.json())

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`)
  next()
})

// Mount all requested API routes
app.use('/api', apiRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err.message)
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' })
})

// Start server
app.listen(PORT, () => {
  console.log(`\n⚡ SmartGrid+ API running on http://localhost:${PORT}`)
  console.log(`   Database: smartgrid (MySQL)`)
  console.log(`   Frontend: ${process.env.CLIENT_URL}\n`)
})
