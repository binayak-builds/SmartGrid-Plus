const authService = require('../services/authService')

async function signup(req, res, next) {
  try {
    const result = await authService.signup(req.body)
    res.status(201).json(result)
  } catch (err) { next(err) }
}

async function login(req, res, next) {
  try {
    const result = await authService.login(req.body)
    res.json(result)
  } catch (err) { next(err) }
}

async function me(req, res, next) {
  try {
    const { prisma } = require('../config/database')
    const customer = await prisma.customer.findUnique({
      where: { id: req.user.customerId },
      include: { login: { select: { role: true, lastLogin: true } } },
    })
    if (!customer) return res.status(404).json({ error: 'User not found' })
    res.json({
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      role: customer.login?.role || 'user',
      plan: customer.plan,
      gridTier: customer.gridTier,
    })
  } catch (err) { next(err) }
}

module.exports = { signup, login, me }
