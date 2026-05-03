const { prisma } = require('../config/database')
const notificationService = require('./notificationService')

async function getUsage(customerId, { period = '7d', limit = 168 } = {}) {
  const now = new Date()
  let since = new Date()

  if (period === '24h') since.setHours(since.getHours() - 24)
  else if (period === '7d') since.setDate(since.getDate() - 7)
  else if (period === '30d') since.setDate(since.getDate() - 30)
  else if (period === '90d') since.setDate(since.getDate() - 90)
  else since.setDate(since.getDate() - 7)

  return prisma.usage.findMany({
    where: {
      customerId,
      timestamp: { gte: since, lte: now },
    },
    orderBy: { timestamp: 'asc' },
    take: limit,
  })
}

async function getUsageStats(customerId) {
  const now = new Date()
  const thirtyDaysAgo = new Date(now)
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const sixtyDaysAgo = new Date(now)
  sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

  // Current period
  const currentUsage = await prisma.usage.findMany({
    where: { customerId, timestamp: { gte: thirtyDaysAgo } },
  })

  // Previous period
  const prevUsage = await prisma.usage.findMany({
    where: { customerId, timestamp: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
  })

  const totalConsumption = currentUsage.reduce((s, r) => s + r.consumptionKwh, 0)
  const prevConsumption = prevUsage.reduce((s, r) => s + r.consumptionKwh, 0)
  const totalSolar = currentUsage.reduce((s, r) => s + r.solarGenerationKwh, 0)
  const peakDemand = currentUsage.length > 0 ? Math.max(...currentUsage.map(r => r.peakDemandKw)) : 0
  const avgBattery = currentUsage.length > 0 ? currentUsage.reduce((s, r) => s + r.batteryLevel, 0) / currentUsage.length : 0
  const latestBattery = currentUsage.length > 0 ? currentUsage[currentUsage.length - 1].batteryLevel : 0
  const latestSolar = currentUsage.length > 0 ? currentUsage[currentUsage.length - 1].solarGenerationKwh : 0

  const changePercent = prevConsumption > 0
    ? parseFloat((((totalConsumption - prevConsumption) / prevConsumption) * 100).toFixed(1))
    : 0

  // Carbon offset: ~0.0005 tons CO2 per kWh of solar
  const carbonOffset = parseFloat((totalSolar * 0.0005).toFixed(2))

  return {
    totalConsumption: parseFloat(totalConsumption.toFixed(1)),
    totalSolar: parseFloat(totalSolar.toFixed(1)),
    peakDemand: parseFloat(peakDemand.toFixed(1)),
    batteryLevel: parseFloat(latestBattery.toFixed(0)),
    currentSolarOutput: parseFloat(latestSolar.toFixed(1)),
    carbonOffset,
    changePercent,
    recordCount: currentUsage.length,
  }
}

async function recordUsage(customerId, data) {
  const { consumptionKwh, solarGenerationKwh = 0, batteryLevel = 0, peakDemandKw = 0 } = data

  // Find meter
  const meter = await prisma.meterInfo.findFirst({ where: { customerId } })

  const record = await prisma.usage.create({
    data: {
      customerId,
      meterId: meter?.id || null,
      consumptionKwh,
      solarGenerationKwh,
      batteryLevel,
      peakDemandKw,
    },
  })

  // Check for usage spike → create alert
  await checkUsageSpike(customerId, consumptionKwh)

  return record
}

async function checkUsageSpike(customerId, currentConsumption) {
  // Get average of last 24 records
  const recent = await prisma.usage.findMany({
    where: { customerId },
    orderBy: { timestamp: 'desc' },
    take: 25,
    skip: 1, // skip the one we just inserted
  })

  if (recent.length < 5) return // not enough data

  const avg = recent.reduce((s, r) => s + r.consumptionKwh, 0) / recent.length
  const spikePercent = ((currentConsumption - avg) / avg) * 100

  if (spikePercent > 20) {
    await notificationService.createNotification(customerId, {
      type: 'warning',
      title: 'Unusual energy spike detected',
      message: `Your consumption of ${currentConsumption.toFixed(1)} kWh is ${spikePercent.toFixed(0)}% above your recent average of ${avg.toFixed(1)} kWh. Check for anomalies.`,
    })
  }
}

module.exports = { getUsage, getUsageStats, recordUsage }
