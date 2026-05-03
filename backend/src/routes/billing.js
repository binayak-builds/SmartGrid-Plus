const router = require('express').Router()
const ctrl = require('../controllers/billingController')
const { authenticate } = require('../middleware/auth')

router.use(authenticate)
router.get('/', ctrl.getBills)
router.get('/:id', ctrl.getBillById)
router.post('/generate', ctrl.generateBill)
router.put('/:id/pay', ctrl.payBill)

module.exports = router
