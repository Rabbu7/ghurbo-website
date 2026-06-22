const { searchRoute } = require('../services/search.service')

/**
 * search.controller.js
 * Handles POST /api/search and GET /api/search/destinations
 */

// Hardcoded popular Bangladesh destinations
const DESTINATIONS = [
  { name: "Bagerhat", district: "Bagerhat", type: 'nature' },
  { name: "Bandarban", district: "Bandarban", type: 'hill' },
  { name: "Barguna", district: "Barguna", type: 'coastal' },
  { name: "Barishal", district: "Barishal", type: 'city' },
  { name: "Bhola", district: "Bhola", type: 'nature' },
  { name: "Bogura", district: "Bogura", type: 'heritage' },
  { name: "Brahmanbaria", district: "Brahmanbaria", type: 'nature' },
  { name: "Chandpur", district: "Chandpur", type: 'nature' },
  { name: "Chattogram", district: "Chattogram", type: 'city' },
  { name: "Chuadanga", district: "Chuadanga", type: 'nature' },
  { name: "Comilla", district: "Comilla", type: 'heritage' },
  { name: "Cox's Bazar", district: "Cox's Bazar", type: 'beach' },
  { name: "Dhaka", district: "Dhaka", type: 'city' },
  { name: "Dinajpur", district: "Dinajpur", type: 'heritage' },
  { name: "Faridpur", district: "Faridpur", type: 'nature' },
  { name: "Feni", district: "Feni", type: 'nature' },
  { name: "Gaibandha", district: "Gaibandha", type: 'nature' },
  { name: "Gazipur", district: "Gazipur", type: 'nature' },
  { name: "Gopalganj", district: "Gopalganj", type: 'nature' },
  { name: "Habiganj", district: "Habiganj", type: 'nature' },
  { name: "Jamalpur", district: "Jamalpur", type: 'nature' },
  { name: "Jashore", district: "Jashore", type: 'heritage' },
  { name: "Jhalokati", district: "Jhalokati", type: 'nature' },
  { name: "Jhenaidah", district: "Jhenaidah", type: 'nature' },
  { name: "Joypurhat", district: "Joypurhat", type: 'nature' },
  { name: "Khagrachhari", district: "Khagrachhari", type: 'hill' },
  { name: "Khulna", district: "Khulna", type: 'city' },
  { name: "Kishoreganj", district: "Kishoreganj", type: 'nature' },
  { name: "Kurigram", district: "Kurigram", type: 'nature' },
  { name: "Kushtia", district: "Kushtia", type: 'heritage' },
  { name: "Lakshmipur", district: "Lakshmipur", type: 'nature' },
  { name: "Lalmonirhat", district: "Lalmonirhat", type: 'nature' },
  { name: "Madaripur", district: "Madaripur", type: 'nature' },
  { name: "Magura", district: "Magura", type: 'nature' },
  { name: "Manikganj", district: "Manikganj", type: 'nature' },
  { name: "Meherpur", district: "Meherpur", type: 'heritage' },
  { name: "Moulvibazar", district: "Moulvibazar", type: 'nature' },
  { name: "Munshiganj", district: "Munshiganj", type: 'heritage' },
  { name: "Mymensingh", district: "Mymensingh", type: 'city' },
  { name: "Naogaon", district: "Naogaon", type: 'heritage' },
  { name: "Narail", district: "Narail", type: 'nature' },
  { name: "Narayanganj", district: "Narayanganj", type: 'city' },
  { name: "Narsingdi", district: "Narsingdi", type: 'nature' },
  { name: "Natore", district: "Natore", type: 'heritage' },
  { name: "Chapainawabganj", district: "Chapainawabganj", type: 'heritage' },
  { name: "Netrokona", district: "Netrokona", type: 'nature' },
  { name: "Nilphamari", district: "Nilphamari", type: 'nature' },
  { name: "Noakhali", district: "Noakhali", type: 'coastal' },
  { name: "Pabna", district: "Pabna", type: 'heritage' },
  { name: "Panchagarh", district: "Panchagarh", type: 'nature' },
  { name: "Patuakhali", district: "Patuakhali", type: 'coastal' },
  { name: "Pirojpur", district: "Pirojpur", type: 'nature' },
  { name: "Rajbari", district: "Rajbari", type: 'nature' },
  { name: "Rajshahi", district: "Rajshahi", type: 'city' },
  { name: "Rangamati", district: "Rangamati", type: 'hill' },
  { name: "Rangpur", district: "Rangpur", type: 'city' },
  { name: "Satkhira", district: "Satkhira", type: 'nature' },
  { name: "Shariatpur", district: "Shariatpur", type: 'nature' },
  { name: "Sherpur", district: "Sherpur", type: 'nature' },
  { name: "Sirajganj", district: "Sirajganj", type: 'nature' },
  { name: "Sunamganj", district: "Sunamganj", type: 'nature' },
  { name: "Sylhet", district: "Sylhet", type: 'nature' },
  { name: "Tangail", district: "Tangail", type: 'heritage' },
  { name: "Thakurgaon", district: "Thakurgaon", type: 'nature' },
  { name: "Sreemangal", district: "Moulvibazar", type: 'nature' },
  { name: "Saint Martin Island", district: "Cox's Bazar", type: 'island' },
  { name: "Sajek Valley", district: "Rangamati", type: 'hill' },
  { name: "Sundarbans", district: "Khulna", type: 'nature' },
  { name: "Teknaf", district: "Cox's Bazar", type: 'nature' },
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

/**
GET /api/search/autocomplete?q=...
Returns filtered destinations based on query
*/
exports.autocomplete = async (req, res, next) => {
  try {
    const { q } = req.query
    if (!q || q.length < 1) {
      return res.status(200).json({ success: true, destinations: [] })
    }
    const lowerQuery = q.toLowerCase()
    const filtered = DESTINATIONS.filter(dest => 
      dest.name.toLowerCase().includes(lowerQuery) ||
      dest.district.toLowerCase().includes(lowerQuery)
    ).slice(0, 8) // Limit to 8 suggestions
    return res.status(200).json({ success: true, destinations: filtered })
  } catch (err) {
    next(err)
  }
}
