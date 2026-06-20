const mongoose = require('mongoose')

const { Schema, model } = mongoose

const roomSchema = new Schema(
  {
    type: { type: String },
    price: { type: Number },
    total_rooms: { type: Number },
  },
)

const hotelSchema = new Schema(
  {
    name: { type: String, required: true },
    city: { type: String, required: true },
    district: { type: String, required: true },
    category: { type: String, enum: ['budget', 'standard', 'luxury'] },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    reviews_count: { type: Number, default: 0 },
    rooms: { type: [roomSchema], default: [] },
    amenities: { type: [String], default: [] },
    images: { type: [String], default: [] },
    partner_id: { type: Schema.Types.ObjectId, ref: 'Partner', default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = model('Hotel', hotelSchema)
