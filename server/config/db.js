const mongoose = require('mongoose')

/**
 * connectDB
 * Builds the MongoDB Atlas URI from individual env vars and connects Mongoose.
 * Throws on failure so index.js can catch and exit cleanly.
 */
async function connectDB() {
  const user = encodeURIComponent(process.env.DB_USER)
  const pass = encodeURIComponent(process.env.DB_PASS)
  const host = process.env.DB_HOST
  const db   = process.env.DB_NAME

  const uri = `mongodb+srv://${user}:${pass}@${host}/${db}?retryWrites=true&w=majority`

  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 })
  console.log('MongoDB Atlas connected')
}

module.exports = { connectDB }
