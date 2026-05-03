const { prisma } = require('../config/database')

async function getPayments(req, res, next) {
  try {
    const payments = await prisma.payment.findMany({
      where: { customerId: req.user.customerId },
      orderBy: { paidAt: 'desc' },
      include: { bill: { select: { billingPeriod: true, totalAmount: true } } },
    })
    res.json(payments)
  } catch (err) { next(err) }
}

async function createPayment(req, res, next) {
  try {
    const { billId, paymentMethod } = req.body
    if (!billId) return res.status(400).json({ error: 'billId required' })

    const billingService = require('../services/billingService')
    const result = await billingService.payBill(billId, req.user.customerId, paymentMethod)
    res.status(201).json(result)
  } catch (err) { next(err) }
}

module.exports = { getPayments, createPayment }
