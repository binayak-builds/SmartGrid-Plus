const notificationService = require('../services/notificationService')

async function getNotifications(req, res, next) {
  try {
    const { type, unread } = req.query
    const notifications = await notificationService.getNotifications(req.user.customerId, {
      type,
      unreadOnly: unread === 'true',
    })
    const unreadCount = await notificationService.getUnreadCount(req.user.customerId)
    res.json({ notifications, unreadCount })
  } catch (err) { next(err) }
}

async function markAsRead(req, res, next) {
  try {
    const { id } = req.params
    if (id === 'all') {
      await notificationService.markAllAsRead(req.user.customerId)
    } else {
      await notificationService.markAsRead(parseInt(id), req.user.customerId)
    }
    res.json({ success: true })
  } catch (err) { next(err) }
}

module.exports = { getNotifications, markAsRead }
