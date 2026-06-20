const express = require('express')
const router = express.Router()
const authMiddleware = require('../middleware/auth.middleware')
const { requireAdmin } = require('../middleware/role.middleware')
const adminController = require('../controllers/admin.controller')

router.get('/users', authMiddleware, requireAdmin, (req, res) => res.json([]))
router.get('/analytics', authMiddleware, requireAdmin, (req, res) => res.json({}))

router.get('/dashboard', authMiddleware, requireAdmin, adminController.dashboard)
router.get('/bookings', authMiddleware, requireAdmin, adminController.getBookings)
router.patch('/partners/:id/approve', authMiddleware, requireAdmin, adminController.approvePartner)

module.exports = router
