const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { prisma } = require('../config/database')

async function signup({ firstName, lastName, email, password, propertyType, occupants, sqft, savingsGoal, priority }) {
  // Check if user exists
  const existing = await prisma.login.findUnique({ where: { email } })
  if (existing) throw Object.assign(new Error('Email already registered.'), { status: 400 })

  // Hash password
  const passwordHash = await bcrypt.hash(password, 12)

  // Create customer + login in transaction
  const customer = await prisma.customer.create({
    data: {
      firstName,
      lastName,
      email,
      propertyType: propertyType || null,
      occupants: occupants || null,
      sqft: sqft || null,
      savingsGoal: savingsGoal || 20,
      priority: priority || 'balanced',
      login: {
        create: { email, passwordHash, role: 'user' },
      },
      meters: {
        create: {
          meterNumber: `MTR-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        },
      },
    },
    include: { login: true, meters: true },
  })

  // Create welcome notification
  await prisma.notification.create({
    data: {
      customerId: customer.id,
      type: 'info',
      title: 'Welcome to SmartGrid+',
      message: `Hello ${firstName}! Your AI energy profile is being built. We'll optimize your grid usage starting today.`,
    },
  })

  const token = generateToken(customer)
  return { token, user: sanitizeUser(customer) }
}

async function login({ email, password }) {
  const loginRecord = await prisma.login.findUnique({
    where: { email },
    include: { customer: true },
  })

  if (!loginRecord) throw Object.assign(new Error('Invalid email or password.'), { status: 401 })

  const valid = await bcrypt.compare(password, loginRecord.passwordHash)
  if (!valid) throw Object.assign(new Error('Invalid email or password.'), { status: 401 })

  // Update last login
  await prisma.login.update({
    where: { id: loginRecord.id },
    data: { lastLogin: new Date() },
  })

  const token = generateToken(loginRecord.customer, loginRecord.role)
  return { token, user: sanitizeUser(loginRecord.customer, loginRecord.role) }
}

function generateToken(customer, role = 'user') {
  return jwt.sign(
    { id: customer.id, customerId: customer.id, email: customer.email, role },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  )
}

function sanitizeUser(customer, role = 'user') {
  return {
    id: customer.id,
    firstName: customer.firstName,
    lastName: customer.lastName,
    email: customer.email,
    role,
    plan: customer.plan,
    gridTier: customer.gridTier,
  }
}

module.exports = { signup, login }
