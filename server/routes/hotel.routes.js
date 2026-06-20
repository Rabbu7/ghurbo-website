const express = require('express')
const router = express.Router()
const {
  getHotels,
  getHotelById,
  createHotel,
  updateHotel,
} = require('../controllers/hotel.controller')
const authMiddleware = require('../middleware/auth.middleware')
const { requirePartner } = require('../middleware/role.middleware')

// GET /api/hotels          — public
router.get('/', getHotels)

// GET /api/hotels/:id      — public
router.get('/:id', getHotelById)

// POST /api/hotels         — partner only
router.post('/', authMiddleware, requirePartner, createHotel)

// PUT /api/hotels/:id      — partner only
router.put('/:id', authMiddleware, requirePartner, updateHotel)

module.exports = router
