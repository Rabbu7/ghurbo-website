const crypto = require('crypto')
const Payment = require('../models/Payment')
const Booking = require('../models/Booking')

/**
 * Initiate payment for a booking
 * Route: POST /api/payments/initiate (Protected)
 */
exports.initiatePayment = async (req, res, next) => {
  try {
    const { booking_id, method, amount } = req.body

    // Validate: booking_id, method, amount are all required
    if (!booking_id || !method || !amount) {
      return res.status(400).json({
        success: false,
        message: 'booking_id, method and amount are required',
      })
    }

    // Validate method is one of: bkash, nagad, card
    if (!['bkash', 'nagad', 'card'].includes(method)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment method',
      })
    }

    // Find booking by booking_id
    const booking = await Booking.findById(booking_id)
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    // Check booking.user_id.toString() === req.user.id
    if (booking.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    // If booking.status is already CONFIRMED
    if (booking.status === 'CONFIRMED') {
      return res.status(400).json({
        success: false,
        message: 'Booking already paid',
      })
    }

    // Generate transaction_id
    const transaction_id = crypto.randomBytes(12).toString('hex').toUpperCase()

    // Create Payment document
    const payment = new Payment({
      booking_id,
      user_id: req.user.id,
      method,
      amount,
      transaction_id,
      status: 'PENDING',
    })

    await payment.save()

    return res.status(200).json({
      success: true,
      message: 'Payment initiated',
      transaction_id,
      booking_id,
      amount,
      method,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Webhook callback for payment processors
 * Route: POST /api/payments/webhook (Public)
 */
exports.webhookPayment = async (req, res, next) => {
  try {
    const { transaction_id, status } = req.body

    // Find Payment by transaction_id
    const payment = await Payment.findOne({ transaction_id })
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      })
    }

    // Handle status: SUCCESS
    if (status === 'SUCCESS') {
      payment.status = 'SUCCESS'
      payment.paid_at = new Date()

      // Find related Booking by payment.booking_id
      const booking = await Booking.findById(payment.booking_id)
      if (!booking) {
        return res.status(404).json({
          success: false,
          message: 'Booking not found',
        })
      }

      booking.status = 'CONFIRMED'
      booking.payment_id = payment._id

      // Save both
      await payment.save()
      await booking.save()

      return res.status(200).json({
        success: true,
        message: 'Payment confirmed',
        ref_code: booking.ref_code,
      })
    }

    // Handle status: FAILED
    if (status === 'FAILED') {
      payment.status = 'FAILED'
      await payment.save()

      return res.status(200).json({
        success: true,
        message: 'Payment failed recorded',
      })
    }

    // In case status is not SUCCESS or FAILED
    return res.status(400).json({
      success: false,
      message: 'Invalid status received',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Get payment status for a booking
 * Route: GET /api/payments/:bookingId (Protected)
 */
exports.getPaymentStatus = async (req, res, next) => {
  try {
    const payment = await Payment.findOne({ booking_id: req.params.bookingId })
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found',
      })
    }

    // Check ownership of the payment (never trust client)
    if (payment.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    return res.status(200).json({
      success: true,
      payment,
    })
  } catch (err) {
    next(err)
  }
}
