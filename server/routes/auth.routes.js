const express = require('express')
const router = express.Router()

const authMiddleware = require('../middleware/auth.middleware')
const {
  register,
  login,
  getMe,
  forgotPassword,
  updateProfile,
} = require('../controllers/auth.controller')

// POST /api/auth/register — public
router.post('/register', register)

// POST /api/auth/login — public
router.post('/login', login)

// GET /api/auth/me — protected
router.get('/me', authMiddleware, getMe)

// POST /api/auth/forgot-password — public
router.post('/forgot-password', forgotPassword)

// PATCH /api/auth/profile — protected
router.patch('/profile', authMiddleware, updateProfile)

module.exports = router
