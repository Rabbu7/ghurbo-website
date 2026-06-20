const Hotel = require('../models/Hotel')
const Partner = require('../models/Partner')

/**
 * hotel.controller.js
 * Handles public hotel listing, retrieval, and partner management of hotels.
 */

/**
 * GET /api/hotels
 * Query params: city, category, minPrice, maxPrice
 */
exports.getHotels = async (req, res, next) => {
  try {
    const { city, category } = req.query

    const filter = { active: true }

    if (city) {
      filter.city = { $regex: new RegExp(city, 'i') }
    }

    if (category) {
      filter.category = category
    }

    const hotels = await Hotel.find(filter).lean()

    return res.status(200).json({
      success: true,
      count: hotels.length,
      hotels,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/hotels/:id
 */
exports.getHotelById = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id).lean()

    if (!hotel) {
      return res.status(404).json({ success: false, message: 'Hotel not found' })
    }

    return res.status(200).json({ success: true, hotel })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/hotels
 * Protected — Partner only
 */
exports.createHotel = async (req, res, next) => {
  try {
    const partner = await Partner.findOne({ user_id: req.user.id })
    if (!partner || (partner.type !== 'hotel' && partner.type !== 'both')) {
      return res.status(403).json({ success: false, message: 'Not authorized to add hotels' })
    }
    if (!partner.is_approved) {
      return res.status(403).json({ success: false, message: 'Partner account not yet approved' })
    }
    const hotel = await Hotel.create({ ...req.body, partner_id: partner._id })
    return res.status(201).json({ success: true, hotel })
  } catch (err) {
    next(err)
  }
}

/**
 * PUT /api/hotels/:id
 * Protected — Partner only
 */
exports.updateHotel = async (req, res, next) => {
  try {
    const partner = await Partner.findOne({ user_id: req.user.id })
    const hotel = await Hotel.findById(req.params.id)
    if (!hotel || !partner || String(hotel.partner_id) !== String(partner._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this hotel' })
    }
    Object.assign(hotel, req.body)
    await hotel.save()
    return res.status(200).json({ success: true, hotel })
  } catch (err) {
    next(err)
  }
}
