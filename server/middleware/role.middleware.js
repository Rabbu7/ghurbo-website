/**
 * role.middleware.js
 * Role-based access control guards.
 * Must be used AFTER authMiddleware (req.user must already be set).
 */

/**
 * requireAdmin — only allows users with role === 'admin'.
 */
const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }
  next()
}

/**
 * requirePartner — allows users with role === 'partner' OR 'admin'.
 * Admins have full access to partner-level routes.
 */
const requirePartner = (req, res, next) => {
  if (!req.user || !['partner', 'admin'].includes(req.user.role)) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }
  next()
}

module.exports = { requireAdmin, requirePartner }
