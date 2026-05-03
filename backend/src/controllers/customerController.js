const { prisma } = require('../config/database')

async function getProfile(req, res, next) {
  try {
    const customer = await prisma.customer.findUnique({
      where: { id: req.user.customerId },
      include: {
        meters: { select: { meterNumber: true, status: true, installationDate: true } },
        login: { select: { role: true, lastLogin: true, createdAt: true } },
      },
    })
    if (!customer) return res.status(404).json({ error: 'Customer not found' })
    res.json(customer)
  } catch (err) { next(err) }
}

async function updateProfile(req, res, next) {
  try {
    const { firstName, lastName, phone, propertyType, location, sqft, occupants, solarSystem, battery } = req.body
    const customer = await prisma.customer.update({
      where: { id: req.user.customerId },
      data: {
        ...(firstName && { firstName }),
        ...(lastName && { lastName }),
        ...(phone !== undefined && { phone }),
        ...(propertyType && { propertyType }),
        ...(location && { location }),
        ...(sqft !== undefined && { sqft }),
        ...(occupants !== undefined && { occupants }),
        ...(solarSystem !== undefined && { solarSystem }),
        ...(battery !== undefined && { battery }),
      },
    })
    res.json(customer)
  } catch (err) { next(err) }
}

module.exports = { getProfile, updateProfile }
