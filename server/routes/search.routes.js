const express = require('express')
const router = express.Router()

const { search, getDestinations, autocomplete } = require('../controllers/search.controller')

// POST /api/search  — public
router.post('/route', search)

// GET /api/search/destinations  — public
router.get('/destinations', getDestinations)

// GET /api/search/autocomplete — public
router.get('/autocomplete', autocomplete)

module.exports = router
