const { searchRoute } = require('../services/search.service')

/**
 * search.controller.js
 * Handles POST /api/search and GET /api/search/destinations
 */

// Hardcoded popular Bangladesh destinations
const DESTINATIONS = [
  { name: "Cox's Bazar",        district: "Cox's Bazar",  type: 'beach'  },
  { name: 'Saint Martin Island', district: "Cox's Bazar",  type: 'island' },
  { name: 'Sundarbans',          district: 'Khulna',        type: 'nature' },
  { name: 'Sylhet',              district: 'Sylhet',        type: 'nature' },
  { name: 'Sreemangal',          district: 'Moulvibazar',   type: 'nature' },
  { name: 'Sajek Valley',        district: 'Rangamati',     type: 'hill'   },
  { name: 'Bandarban',           district: 'Bandarban',     type: 'hill'   },
  { name: 'Rangamati',           district: 'Rangamati',     type: 'hill'   },
  { name: 'Kuakata',             district: 'Patuakhali',    type: 'beach'  },
  { name: 'Teknaf',              district: "Cox's Bazar",   type: 'nature' },
  { name: 'Chattogram',          district: 'Chattogram',    type: 'city'   },
  { name: 'Dhaka',               district: 'Dhaka',         type: 'city'   },
  { name: 'Rajshahi',            district: 'Rajshahi',      type: 'city'   },
  { name: 'Khulna',              district: 'Khulna',        type: 'city'   },
  { name: 'Barishal',            district: 'Barishal',      type: 'city'   },
  { name: 'Mymensingh',          district: 'Mymensingh',    type: 'city'   },
  { name: 'Rangpur',             district: 'Rangpur',       type: 'city'   },
  { name: 'Cumilla',             district: 'Cumilla',       type: 'city'   },
  { name: 'Moulvibazar',         district: 'Moulvibazar',   type: 'nature' },
  { name: 'Patuakhali',          district: 'Patuakhali',    type: 'nature' },
]

/**
 * POST /api/search
 * Body: { origin, destination, tripType }
 */
exports.search = async (req, res, next) => {
  try {
    const { origin, destination, tripType } = req.body

    if (!origin || !destination) {
      return res.status(400).json({
        success: false,
        message: 'Origin and destination are required',
      })
    }

    const resolvedTripType = tripType || 'one_way'

    const result = await searchRoute(origin, destination, resolvedTripType)

    return res.status(200).json({ success: true, data: result })
  } catch (err) {
    if (err.message === 'Route not feasible') {
      return res.status(400).json({
        success: false,
        message: 'Route not feasible between these cities',
      })
    }
    next(err)
  }
}

/**
 * GET /api/search/destinations
 * Returns a static list of popular Bangladesh destinations.
 */
exports.getDestinations = async (req, res, next) => {
  try {
    return res.status(200).json({ success: true, destinations: DESTINATIONS })
  } catch (err) {
    next(err)
  }
}
