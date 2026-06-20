const jwt = require('jsonwebtoken')

/**
 * auth.middleware.js
 * Verifies JWT from the Authorization: Bearer <token> header.
 * On success: attaches decoded payload to req.user and calls next().
 * On failure: returns 401 { success: false, message: 'Unauthorized' }.
 */
module.exports = function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  const token = authHeader.split(' ')[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    req.user = decoded // { id, role, iat, exp }
    next()
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }
}
