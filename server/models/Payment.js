const mongoose = require('mongoose')

const { Schema, model } = mongoose

const paymentSchema = new Schema(
  {
    booking_id: { type: Schema.Types.ObjectId, ref: 'Booking', required: true },
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    method: { type: String, enum: ['bkash', 'nagad', 'card'] },
    amount: { type: Number, required: true },
    transaction_id: { type: String, unique: true },
    status: { type: String, enum: ['PENDING', 'SUCCESS', 'FAILED'], default: 'PENDING' },
    paid_at: { type: Date, default: null },
  },
  { timestamps: true },
)

module.exports = model('Payment', paymentSchema)
