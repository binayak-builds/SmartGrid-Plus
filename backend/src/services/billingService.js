const { prisma } = require('../config/database')

const TAX_RATE = 0.08 // 8% tax
const COST_PER_UNIT = 0.15 // $0.15 per kWh

async function generateBill(customerId, billingPeriod) {
  // Calculate total usage for the period
  const startDate = new Date(billingPeriod + '-01')
  const endDate = new Date(startDate)
  endDate.setMonth(endDate.getMonth() + 1)

  const usageRecords = await prisma.usage.findMany({
    where: {
      customerId,
      timestamp: { gte: startDate, lt: endDate },
    },
  })

  const totalUnits = usageRecords.reduce((sum, r) => sum + r.consumptionKwh, 0)
  const solarCredit = usageRecords.reduce((sum, r) => sum + r.solarGenerationKwh, 0)
  const netUnits = Math.max(0, totalUnits - solarCredit)

  const subtotal = parseFloat((netUnits * COST_PER_UNIT).toFixed(2))
  const taxAmount = parseFloat((subtotal * TAX_RATE).toFixed(2))
  const totalAmount = parseFloat((subtotal + taxAmount).toFixed(2))

  const dueDate = new Date(endDate)
  dueDate.setDate(dueDate.getDate() + 15) // Due 15 days after period ends

  const bill = await prisma.bill.create({
    data: {
      customerId,
      billingPeriod,
      unitsConsumed: parseFloat(netUnits.toFixed(2)),
      costPerUnit: COST_PER_UNIT,
      subtotal,
      taxAmount,
      totalAmount,
      dueDate,
    },
  })

  return bill
}

async function getBills(customerId) {
  return prisma.bill.findMany({
    where: { customerId },
    orderBy: { createdAt: 'desc' },
    include: { payments: true },
  })
}

async function getBillById(billId, customerId) {
  return prisma.bill.findFirst({
    where: { id: billId, customerId },
    include: { payments: true },
  })
}

async function payBill(billId, customerId, paymentMethod = 'card') {
  const bill = await prisma.bill.findFirst({
    where: { id: billId, customerId },
  })

  if (!bill) throw Object.assign(new Error('Bill not found.'), { status: 404 })
  if (bill.status === 'paid') throw Object.assign(new Error('Bill already paid.'), { status: 400 })

  const transactionId = `TXN-${Date.now()}-${Math.floor(Math.random() * 10000)}`

  const [updatedBill, payment] = await prisma.$transaction([
    prisma.bill.update({
      where: { id: billId },
      data: { status: 'paid', paidDate: new Date() },
    }),
    prisma.payment.create({
      data: {
        billId,
        customerId,
        amount: bill.totalAmount,
        paymentMethod,
        transactionId,
        status: 'completed',
      },
    }),
  ])

  // Create notification
  await prisma.notification.create({
    data: {
      customerId,
      type: 'success',
      title: 'Payment received',
      message: `Your payment of $${bill.totalAmount.toFixed(2)} for ${bill.billingPeriod} has been processed. Transaction ID: ${transactionId}`,
    },
  })

  return { bill: updatedBill, payment }
}

module.exports = { generateBill, getBills, getBillById, payBill }
