const { prisma } = require('../config/database')

async function getNotifications(customerId, { type, unreadOnly = false } = {}) {
  const where = { customerId }
  if (type) where.type = type
  if (unreadOnly) where.read = false

  return prisma.notification.findMany({
    where,
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

async function getUnreadCount(customerId) {
  return prisma.notification.count({
    where: { customerId, read: false },
  })
}

async function markAsRead(notificationId, customerId) {
  return prisma.notification.updateMany({
    where: { id: notificationId, customerId },
    data: { read: true },
  })
}

async function markAllAsRead(customerId) {
  return prisma.notification.updateMany({
    where: { customerId, read: false },
    data: { read: true },
  })
}

async function createNotification(customerId, { type, title, message }) {
  return prisma.notification.create({
    data: { customerId, type, title, message },
  })
}

module.exports = { getNotifications, getUnreadCount, markAsRead, markAllAsRead, createNotification }
