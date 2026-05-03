const usageService = require('../services/usageService')

async function getUsage(req, res, next) {
  try {
    const { period = '7d', limit = 168 } = req.query
    const records = await usageService.getUsage(req.user.customerId, { period, limit: parseInt(limit) })
    res.json(records)
  } catch (err) { next(err) }
}

async function getUsageStats(req, res, next) {
  try {
    const stats = await usageService.getUsageStats(req.user.customerId)
    res.json(stats)
  } catch (err) { next(err) }
}

async function recordUsage(req, res, next) {
  try {
    const record = await usageService.recordUsage(req.user.customerId, req.body)
    res.status(201).json(record)
  } catch (err) { next(err) }
}

module.exports = { getUsage, getUsageStats, recordUsage }
