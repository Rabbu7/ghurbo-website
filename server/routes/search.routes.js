const express = require('express')
const router = express.Router()

const { search, getDestinations } = require('../controllers/search.controller')

// POST /api/search  — public
router.post('/route', search)

// GET /api/search/destinations  — public
router.get('/destinations', getDestinations)

module.exports = router
