const mongoose = require('mongoose')

const { Schema, model } = mongoose

const legSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    mode: { type: String, enum: ['bus', 'train', 'ship', 'launch'] },
    estimated_hours: { type: Number, required: true },
    notes: { type: String, default: null },
  },
)

const routeCacheSchema = new Schema(
  {
    origin: { type: String, required: true },
    destination: { type: String, required: true },
    legs: { type: [legSchema], default: [] },
    connection_cities: { type: [String], default: [] },
    total_hours: { type: Number, required: true },
    seasonal_notes: { type: String, default: null },
    cached_at: { type: Date, default: Date.now },
    expires_at: { type: Date, required: true },
  },
  { timestamps: true },
)

routeCacheSchema.index({ origin: 1, destination: 1 })

module.exports = model('RouteCache', routeCacheSchema)
