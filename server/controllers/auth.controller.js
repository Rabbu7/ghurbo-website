const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const Partner = require('../models/Partner')

/**
 * auth.controller.js
 * Handles registration, login, profile retrieval, and password reset initiation.
 * All functions wrap logic in try/catch and pass errors to the global error handler.
 */

// Helper: sign a JWT for a given user document
const signToken = (user) =>
  jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  )

// Helper: safe user response shape — never exposes passwordHash
const safeUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  birthDate: user.birthDate,
  city: user.city,
  postalCode: user.postalCode,
  country: user.country,
  isVerified: user.isVerified,
})

// Helper: enrich user response with partner details when applicable
const attachPartnerInfo = async (userObj) => {
  if (userObj.role !== 'partner') return userObj
  const partner = await Partner.findOne({ user_id: userObj.id || userObj._id })
  return {
    ...userObj,
    partnerType: partner?.type || null,
    isApproved: partner?.is_approved || false,
    businessName: partner?.business_name || null,
  }
}

/**
 * POST /api/auth/register
 * Body: { name, email, phone, password, role }
 * role is coerced — 'admin' is never accepted from the API.
 */
exports.register = async (req, res, next) => {
  try {
    const { name, email, phone, password, role } = req.body

    // Guard: only 'user' or 'partner' roles are allowed from the public API
    const allowedRoles = ['user', 'partner']
    const assignedRole = allowedRoles.includes(role) ? role : 'user'

    // Check for duplicate email
    const existing = await User.findOne({ email: email?.toLowerCase() })
    if (existing) {
      return res.status(400).json({ success: false, message: 'Email already registered' })
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 10)

    // Create and persist user
    const user = await User.create({
      name,
      email,
      phone,
      passwordHash,
      role: assignedRole,
    })

    const token = signToken(user)
    const userResponse = await attachPartnerInfo(safeUser(user))

    return res.status(201).json({
      success: true,
      token,
      user: userResponse,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/login
 * Body: { email, password }
 */
exports.login = async (req, res, next) => {
  try {
    const { email: identifier, password } = req.body

    // Find user — select passwordHash explicitly (it's excluded by default in some schemas)
    const user = await User.findOne({
      $or: [
        { email: identifier?.toLowerCase() },
        { phone: identifier },
      ],
    }).select('+passwordHash')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Validate password
    const isMatch = await bcrypt.compare(password, user.passwordHash)
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' })
    }

    const token = signToken(user)
    const userResponse = await attachPartnerInfo(safeUser(user))

    return res.status(200).json({
      success: true,
      token,
      user: userResponse,
    })
  } catch (err) {
    next(err)
  }
}

/**
 * GET /api/auth/me
 * Protected: requires authMiddleware.
 * Returns the current user's profile without passwordHash.
 */
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('-passwordHash')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const userObj = user.toObject ? user.toObject() : user
    const userResponse = await attachPartnerInfo(userObj)

    return res.status(200).json({ success: true, user: userResponse })
  } catch (err) {
    next(err)
  }
}

/**
 * POST /api/auth/forgot-password
 * Body: { email }
 * Phase 3 will integrate real Nodemailer delivery.
 */
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body

    const user = await User.findOne({ email: email?.toLowerCase() })
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    // Phase 3: generate reset token and send via Nodemailer
    // For now, simulate success
    return res.status(200).json({
      success: true,
      message: 'Reset email sent (simulated)',
    })
  } catch (err) {
    next(err)
  }
}

/**
 * PATCH /api/auth/profile
 * Body: { name, phone, birthDate, city, postalCode, country,
 *         currentPassword, newPassword }
 * Protected — requires authMiddleware (req.user.id is available).
 */
exports.updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+passwordHash')
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' })
    }

    const {
      name,
      phone,
      birthDate,
      city,
      postalCode,
      country,
      currentPassword,
      newPassword,
    } = req.body

    // Update only present/truthy fields
    if (name) user.name = name
    if (phone) user.phone = phone
    if (birthDate) user.birthDate = birthDate
    if (city) user.city = city
    if (postalCode) user.postalCode = postalCode
    if (country) user.country = country

    // Password change is optional: only attempt if both are present
    if (currentPassword && newPassword) {
      const isMatch = await bcrypt.compare(currentPassword, user.passwordHash)
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Current password is incorrect',
        })
      }
      user.passwordHash = await bcrypt.hash(newPassword, 10)
    }

    await user.save()

    return res.status(200).json({
      success: true,
      user: safeUser(user),
    })
  } catch (err) {
    next(err)
  }
}
