const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth.middleware')
const { requirePartner } = require('../middleware/role.middleware')
const {
  apply,
  dashboard,
  addOperator,
  updateOperator,
} = require('../controllers/partner.controller')

// POST /api/partners/apply — protected (authenticated user)
router.post('/apply', authMiddleware, apply)

// GET /api/partners/dashboard — protected (partner only)
router.get('/dashboard', authMiddleware, requirePartner, dashboard)

// POST /api/partners/operators — protected (partner only)
router.post('/operators', authMiddleware, requirePartner, addOperator)

// PUT /api/partners/operators/:id — protected (partner only)
router.put('/operators/:id', authMiddleware, requirePartner, updateOperator)

module.exports = router
