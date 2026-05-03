const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding SmartGrid+ database...\n')

  // Clear existing data
  await prisma.notification.deleteMany()
  await prisma.payment.deleteMany()
  await prisma.usage.deleteMany()
  await prisma.bill.deleteMany()
  await prisma.meterInfo.deleteMany()
  await prisma.login.deleteMany()
  await prisma.customer.deleteMany()
  await prisma.tax.deleteMany()

  // Create taxes
  await prisma.tax.createMany({
    data: [
      { name: 'State Energy Tax', rate: 0.05 },
      { name: 'Federal Surcharge', rate: 0.03 },
    ],
  })
  console.log('✓ Taxes created')

  // Create admin user
  const adminHash = await bcrypt.hash('admin123', 12)
  const admin = await prisma.customer.create({
    data: {
      firstName: 'Binayak',
      lastName: 'Mondal',
      email: 'admin@smartgrid.io',
      phone: '+1 (555) 100-0001',
      propertyType: 'Commercial Office',
      location: 'San Francisco, CA',
      plan: 'SmartGrid+ Enterprise',
      gridTier: 'Admin',
      solarSystem: '25 kW Array',
      battery: 'Tesla Megapack 100 kWh',
      login: { create: { email: 'admin@smartgrid.io', passwordHash: adminHash, role: 'admin' } },
      meters: { create: { meterNumber: 'MTR-ADMIN-001' } },
    },
  })
  console.log(`✓ Admin user: admin@smartgrid.io / admin123`)

  // Create demo user
  const userHash = await bcrypt.hash('user123', 12)
  const user = await prisma.customer.create({
    data: {
      firstName: 'Binayak',
      lastName: 'Mondal',
      email: 'binayak@smartgrid.io',
      phone: '+1 (555) 123-4567',
      propertyType: 'Residential Home',
      location: 'San Francisco, CA',
      sqft: 2400,
      occupants: 4,
      plan: 'SmartGrid+ Pro',
      gridTier: 'Tier 2 — Prosumer',
      solarSystem: '7.2 kW Array',
      battery: 'Tesla Powerwall 13.5 kWh',
      savingsGoal: 20,
      priority: 'cost_savings',
      login: { create: { email: 'binayak@smartgrid.io', passwordHash: userHash, role: 'user' } },
      meters: { create: { meterNumber: 'MTR-USR-001' } },
    },
  })
  console.log(`✓ Demo user: binayak@smartgrid.io / user123`)

  // Create second demo user
  const user2Hash = await bcrypt.hash('user123', 12)
  const user2 = await prisma.customer.create({
    data: {
      firstName: 'Jane',
      lastName: 'Smith',
      email: 'jane@smartgrid.io',
      phone: '+1 (555) 987-6543',
      propertyType: 'Apartment / Condo',
      location: 'Los Angeles, CA',
      sqft: 1200,
      occupants: 2,
      plan: 'SmartGrid+ Basic',
      gridTier: 'Tier 1 — Consumer',
      login: { create: { email: 'jane@smartgrid.io', passwordHash: user2Hash, role: 'user' } },
      meters: { create: { meterNumber: 'MTR-USR-002' } },
    },
  })
  console.log(`✓ Demo user 2: jane@smartgrid.io / user123`)

  // Get meters
  const userMeter = await prisma.meterInfo.findFirst({ where: { customerId: user.id } })
  const user2Meter = await prisma.meterInfo.findFirst({ where: { customerId: user2.id } })

  // Generate 90 days of usage data for main user (hourly samples, every 6 hours)
  console.log('\n📊 Generating usage data...')
  const usageData = []
  const now = new Date()
  for (let d = 89; d >= 0; d--) {
    for (let h = 0; h < 24; h += 6) {
      const timestamp = new Date(now)
      timestamp.setDate(timestamp.getDate() - d)
      timestamp.setHours(h, 0, 0, 0)

      const isPeak = h >= 12 && h <= 18
      const baseConsumption = isPeak ? 3.5 + Math.random() * 2 : 1.5 + Math.random() * 1.5
      const isSunny = h >= 6 && h <= 18
      const solarGen = isSunny ? 1.0 + Math.random() * 3.2 : 0
      const batteryLevel = 30 + Math.random() * 60
      const peakDemand = isPeak ? 8 + Math.random() * 5 : 3 + Math.random() * 3

      usageData.push({
        customerId: user.id,
        meterId: userMeter.id,
        timestamp,
        consumptionKwh: parseFloat(baseConsumption.toFixed(2)),
        solarGenerationKwh: parseFloat(solarGen.toFixed(2)),
        batteryLevel: parseFloat(batteryLevel.toFixed(0)),
        peakDemandKw: parseFloat(peakDemand.toFixed(2)),
      })
    }
  }

  // Usage data for user2 (less granular)
  for (let d = 59; d >= 0; d--) {
    for (let h = 0; h < 24; h += 6) {
      const timestamp = new Date(now)
      timestamp.setDate(timestamp.getDate() - d)
      timestamp.setHours(h, 0, 0, 0)
      usageData.push({
        customerId: user2.id,
        meterId: user2Meter.id,
        timestamp,
        consumptionKwh: parseFloat((2 + Math.random() * 2).toFixed(2)),
        solarGenerationKwh: 0,
        batteryLevel: 0,
        peakDemandKw: parseFloat((4 + Math.random() * 3).toFixed(2)),
      })
    }
  }

  await prisma.usage.createMany({ data: usageData })
  console.log(`✓ ${usageData.length} usage records created`)

  // Generate bills for last 4 months
  console.log('\n💰 Generating bills...')
  const months = ['2025-12', '2026-01', '2026-02', '2026-03']
  const billAmounts = [168.90, 156.20, 142.80, 127.40]

  for (let i = 0; i < months.length; i++) {
    const dueDate = new Date(`${months[i]}-15`)
    dueDate.setMonth(dueDate.getMonth() + 1)

    const subtotal = parseFloat((billAmounts[i] / 1.08).toFixed(2))
    const taxAmount = parseFloat((billAmounts[i] - subtotal).toFixed(2))

    const bill = await prisma.bill.create({
      data: {
        customerId: user.id,
        billingPeriod: months[i],
        unitsConsumed: parseFloat((billAmounts[i] / 0.15).toFixed(0)),
        costPerUnit: 0.15,
        subtotal,
        taxAmount,
        totalAmount: billAmounts[i],
        status: 'paid',
        dueDate,
        paidDate: new Date(dueDate.getTime() - 5 * 24 * 60 * 60 * 1000),
      },
    })

    // Create payment for each bill
    await prisma.payment.create({
      data: {
        billId: bill.id,
        customerId: user.id,
        amount: billAmounts[i],
        paymentMethod: 'autopay',
        transactionId: `TXN-${months[i].replace('-', '')}-${user.id}`,
        status: 'completed',
        paidAt: bill.paidDate || new Date(),
      },
    })
  }

  // Create current unpaid bill
  await prisma.bill.create({
    data: {
      customerId: user.id,
      billingPeriod: '2026-04',
      unitsConsumed: 780,
      costPerUnit: 0.15,
      subtotal: 117.00,
      taxAmount: 9.36,
      totalAmount: 126.36,
      status: 'unpaid',
      dueDate: new Date('2026-05-15'),
    },
  })
  console.log(`✓ 5 bills created (4 paid, 1 current)`)

  // Create notifications
  console.log('\n🔔 Generating notifications...')
  const notifications = [
    { customerId: user.id, type: 'critical', title: 'Grid voltage fluctuation detected', message: 'Sector 4B experiencing intermittent voltage drops. Auto-stabilizer engaged.', createdAt: new Date(Date.now() - 2 * 60 * 1000) },
    { customerId: user.id, type: 'warning', title: 'HVAC anomaly detected', message: 'Unusual consumption pattern between 2-4 PM. Efficiency down 15%.', createdAt: new Date(Date.now() - 15 * 60 * 1000) },
    { customerId: user.id, type: 'info', title: 'Solar panel maintenance due', message: 'Panel array #3 efficiency declining. Scheduled cleaning recommended.', createdAt: new Date(Date.now() - 60 * 60 * 1000) },
    { customerId: user.id, type: 'success', title: 'Battery optimization complete', message: 'Storage cycle optimized. Estimated savings: $4.20/day.', createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000) },
    { customerId: user.id, type: 'warning', title: 'Peak demand approaching', message: 'Grid load reaching 85% capacity. Load shedding may activate.', createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000) },
    { customerId: user.id, type: 'info', title: 'Firmware update available', message: 'Smart meter firmware v2.4.1 ready for installation.', createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    { customerId: user.id, type: 'info', title: 'Welcome to SmartGrid+', message: 'Hello Binayak! Your AI energy profile is active and optimizing.', read: true, createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
  ]

  await prisma.notification.createMany({ data: notifications })
  console.log(`✓ ${notifications.length} notifications created`)

  console.log('\n✅ Seed complete!\n')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('  Login credentials:')
  console.log('  Admin: admin@smartgrid.io / admin123')
  console.log('  User:  binayak@smartgrid.io / user123')
  console.log('  User2: jane@smartgrid.io / user123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
}

main()
  .catch((e) => {
    console.error('Seed failed:', e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
