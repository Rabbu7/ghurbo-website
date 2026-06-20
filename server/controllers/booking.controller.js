const Booking = require('../models/Booking')
const Payment = require('../models/Payment')
const generateRef = require('../utils/generateRef')
const { generateTicket } = require('../services/ticket.service')

/**
 * Create a new booking
 * Route: POST /api/bookings/create (Protected)
 */
exports.createBooking = async (req, res, next) => {
  try {
    const { trip_type, forward_legs, hotel, return_legs, pricing } = req.body

    // Validate: forward_legs must be non-empty array
    if (!Array.isArray(forward_legs) || forward_legs.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Forward legs are required',
      })
    }

    // Validate: pricing.grand_total must be a positive number
    if (!pricing || typeof pricing.grand_total !== 'number' || pricing.grand_total <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid pricing',
      })
    }

    // Generate ref_code using generateRef()
    const ref_code = generateRef()

    // Create Booking document
    const booking = new Booking({
      ref_code,
      user_id: req.user.id,
      trip_type,
      forward_legs,
      hotel,
      return_legs: return_legs || [],
      pricing,
      status: 'PENDING',
    })

    await booking.save()

    return res.status(201).json({
      success: true,
      message: 'Booking created',
      booking: {
        _id: booking._id,
        ref_code: booking.ref_code,
        status: booking.status,
        pricing: booking.pricing,
        trip_type: booking.trip_type,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Get all bookings for the logged-in user
 * Route: GET /api/bookings/my (Protected)
 */
exports.getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user_id: req.user.id })
      .sort({ createdAt: -1 })

    return res.status(200).json({
      success: true,
      count: bookings.length,
      bookings,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Get a single booking by ID (must own the booking)
 * Route: GET /api/bookings/:id (Protected)
 */
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    if (booking.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    return res.status(200).json({
      success: true,
      booking,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Cancel a booking (must own the booking and not already cancelled/refunded)
 * Route: PATCH /api/bookings/:id/cancel (Protected)
 */
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    if (booking.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    if (booking.status === 'CANCELLED' || booking.status === 'REFUNDED') {
      return res.status(400).json({
        success: false,
        message: 'Booking already cancelled',
      })
    }

    booking.status = 'CANCELLED'
    await booking.save()

    return res.status(200).json({
      success: true,
      message: 'Booking cancelled',
      booking: {
        _id: booking._id,
        ref_code: booking.ref_code,
        status: booking.status,
      },
    })
  } catch (err) {
    next(err)
  }
}

/**
 * Get ticket with QR code for a confirmed booking
 * Route: GET /api/bookings/:id/ticket (Protected)
 */
exports.getTicket = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      })
    }

    if (booking.user_id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied',
      })
    }

    if (booking.status !== 'CONFIRMED') {
      return res.status(400).json({
        success: false,
        message: 'Ticket only available for confirmed bookings',
      })
    }

    const ticket = await generateTicket(booking)

    return res.status(200).json({
      success: true,
      ticket,
    })
  } catch (err) {
    next(err)
  }
}

