const billingService = require('../services/billingService')

async function getBills(req, res, next) {
  try {
    const bills = await billingService.getBills(req.user.customerId)
    res.json(bills)
  } catch (err) { next(err) }
}

async function getBillById(req, res, next) {
  try {
    const bill = await billingService.getBillById(parseInt(req.params.id), req.user.customerId)
    if (!bill) return res.status(404).json({ error: 'Bill not found' })
    res.json(bill)
  } catch (err) { next(err) }
}

async function generateBill(req, res, next) {
  try {
    const { billingPeriod } = req.body // e.g. "2026-03"
    if (!billingPeriod) return res.status(400).json({ error: 'billingPeriod required (e.g. 2026-03)' })
    const bill = await billingService.generateBill(req.user.customerId, billingPeriod)
    res.status(201).json(bill)
  } catch (err) { next(err) }
}

async function payBill(req, res, next) {
  try {
    const { paymentMethod } = req.body
    const result = await billingService.payBill(parseInt(req.params.id), req.user.customerId, paymentMethod)
    res.json(result)
  } catch (err) { next(err) }
}

module.exports = { getBills, getBillById, generateBill, payBill }
