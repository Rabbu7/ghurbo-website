const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/auth.middleware')
const {
  createBooking,
  getMyBookings,
  getBookingById,
  cancelBooking,
  getTicket,
} = require('../controllers/booking.controller')

router.post('/create', authMiddleware, createBooking)
router.get('/my', authMiddleware, getMyBookings)
router.get('/:id/ticket', authMiddleware, getTicket)
router.get('/:id', authMiddleware, getBookingById)
router.patch('/:id/cancel', authMiddleware, cancelBooking)

module.exports = router

