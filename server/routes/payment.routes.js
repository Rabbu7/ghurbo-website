const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/auth.middleware')
const {
  initiatePayment,
  webhookPayment,
  getPaymentStatus,
} = require('../controllers/payment.controller')

// POST /api/payments/initiate — protected
router.post('/initiate', authMiddleware, initiatePayment)

// POST /api/payments/webhook — public
router.post('/webhook', webhookPayment)

// GET /api/payments/:bookingId — protected
router.get('/:bookingId', authMiddleware, getPaymentStatus)

module.exports = router
