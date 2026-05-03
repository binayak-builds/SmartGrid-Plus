const router = require('express').Router()
const ctrl = require('../controllers/paymentController')
const { authenticate } = require('../middleware/auth')

router.use(authenticate)
router.get('/history', ctrl.getPayments)
router.post('/', ctrl.createPayment)

module.exports = router
