const mongoose = require('mongoose')

const { Schema, model } = mongoose

const scheduleSchema = new Schema(
  {
    departure: { type: String },
    arrival: { type: String },
    duration_hours: { type: Number },
    days_available: { type: [String], default: ['everyday'] },
  },
)

const seatTypeSchema = new Schema(
  {
    type: { type: String },
    price: { type: Number },
    total_seats: { type: Number },
  },
)

const operatorSchema = new Schema(
  {
    from: { type: String, required: true },
    to: { type: String, required: true },
    mode: { type: String, enum: ['bus', 'train', 'ship', 'launch'] },
    operator_name: { type: String, required: true },
    partner_id: { type: Schema.Types.ObjectId, ref: 'Partner', default: null },
    schedules: { type: [scheduleSchema], default: [] },
    seat_types: { type: [seatTypeSchema], default: [] },
    seasonal_note: { type: String, default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
)

module.exports = model('Operator', operatorSchema)
