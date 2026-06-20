require('dotenv').config()

const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const { connectDB } = require('./config/db')
const errorHandler = require('./middleware/error.middleware')

const app = express()
const PORT = process.env.PORT || 5000

// ─── Global Middleware ──────────────────────────────────────────────────────
app.use(express.json())
app.use(cors({
  origin: process.env.CLIENT_URL,
  credentials: true,
}))
app.use(morgan('dev'))

// ─── Route Mounts ───────────────────────────────────────────────────────────
// Uncomment each route as its module is built and tested.
app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/search', require('./routes/search.routes'))
app.use('/api/bookings', require('./routes/booking.routes'))
app.use('/api/payments', require('./routes/payment.routes'))

const hotelRoutes = require('./routes/hotel.routes')
app.use('/api/hotels', hotelRoutes)
app.use('/api/partners', require('./routes/partner.routes'))
app.use('/api/admin', require('./routes/admin.routes'))

// ─── Health Check ───────────────────────────────────────────────────────────
app.get('/health', (req, res) => res.json({ ok: true }))

// ─── Global Error Handler ───────────────────────────────────────────────────
app.use(errorHandler)

// ─── DB + Server Boot ───────────────────────────────────────────────────────
async function start() {
  try {
    await connectDB()
    console.log('Connected to MongoDB Atlas')

    app.listen(PORT, () => {
      console.log(`GHURBO server running on port ${PORT}`)
    })
  } catch (err) {
    console.error('Server failed to start:', err)
    process.exit(1)
  }
}

start()
