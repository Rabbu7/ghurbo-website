const mongoose = require('mongoose')

const { Schema, model } = mongoose

const transportLegSchema = new Schema(
  {
    from: { type: String },
    to: { type: String },
    mode: { type: String },
    operator_id: { type: Schema.Types.ObjectId, ref: 'Operator' },
    operator_name: { type: String },
    seat_type: { type: String },
    seat_numbers: { type: [String], default: [] },
    departure: { type: Date },
    price: { type: Number },
  },
)

const hotelBookingSchema = new Schema(
  {
    hotel_id: { type: Schema.Types.ObjectId, ref: 'Hotel' },
    hotel_name: { type: String },
    room_type: { type: String },
    room_count: { type: Number, default: 1 },
    check_in: { type: Date },
    check_out: { type: Date },
    nights: { type: Number },
    price_per_night: { type: Number },
    total_price: { type: Number },
  },
)

const bookingSchema = new Schema(
  {
    ref_code: { type: String, unique: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    trip_type: { type: String, enum: ['one_way', 'round_trip'] },
    forward_legs: { type: [transportLegSchema], default: [] },
    hotel: { type: hotelBookingSchema },
    return_legs: { type: [transportLegSchema], default: [] },
    pricing: {
      forward_transport: { type: Number },
      hotel_total: { type: Number },
      return_transport: { type: Number },
      grand_total: { type: Number },
    },
    status: {
      type: String,
      enum: ['PENDING', 'CONFIRMED', 'CANCELLED', 'REFUNDED'],
      default: 'PENDING',
    },
    payment_id: { type: Schema.Types.ObjectId, ref: 'Payment', default: null },
  },
  { timestamps: true },
)

module.exports = model('Booking', bookingSchema)
