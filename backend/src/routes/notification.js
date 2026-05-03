const router = require('express').Router()
const ctrl = require('../controllers/notificationController')
const { authenticate } = require('../middleware/auth')

router.use(authenticate)
router.get('/', ctrl.getNotifications)
router.put('/:id/read', ctrl.markAsRead) // use id='all' to mark all read

module.exports = router
