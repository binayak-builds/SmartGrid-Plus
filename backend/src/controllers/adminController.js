const { prisma } = require('../config/database')
const bcrypt = require('bcryptjs')

async function getUsers(req, res, next) {
  try {
    const users = await prisma.customer.findMany({
      include: {
        login: { select: { role: true, lastLogin: true } },
        _count: { select: { bills: true, usageRecords: true } },
      },
      orderBy: { createdAt: 'desc' },
    })
    res.json(users)
  } catch (err) { next(err) }
}

async function createUser(req, res, next) {
  try {
    const { firstName, lastName, email, password, role = 'user' } = req.body
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'firstName, lastName, email, and password are required' })
    }

    const existing = await prisma.login.findUnique({ where: { email } })
    if (existing) return res.status(400).json({ error: 'Email already exists' })

    const passwordHash = await bcrypt.hash(password, 12)
    const customer = await prisma.customer.create({
      data: {
        firstName, lastName, email,
        login: { create: { email, passwordHash, role } },
        meters: { create: { meterNumber: `MTR-${Date.now()}-${Math.floor(Math.random() * 1000)}` } },
      },
      include: { login: { select: { role: true } } },
    })
    res.status(201).json(customer)
  } catch (err) { next(err) }
}

async function deleteUser(req, res, next) {
  try {
    const id = parseInt(req.params.id)
    // Don't let admin delete themselves
    if (id === req.user.customerId) {
      return res.status(400).json({ error: 'Cannot delete your own account' })
    }
    await prisma.customer.delete({ where: { id } })
    res.json({ success: true, message: 'User deleted' })
  } catch (err) { next(err) }
}

async function getDashboardStats(req, res, next) {
  try {
    const [customerCount, totalUsage, totalRevenue, activeMeters] = await Promise.all([
      prisma.customer.count(),
      prisma.usage.aggregate({ _sum: { consumptionKwh: true } }),
      prisma.payment.aggregate({ _sum: { amount: true } }),
      prisma.meterInfo.count({ where: { status: 'active' } }),
    ])

    res.json({
      customerCount,
      totalConsumption: totalUsage._sum.consumptionKwh || 0,
      totalRevenue: totalRevenue._sum.amount || 0,
      activeMeters,
    })
  } catch (err) { next(err) }
}

module.exports = { getUsers, createUser, deleteUser, getDashboardStats }
