const mongoose = require('mongoose')

const { Schema, model } = mongoose

const partnerSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    business_name: { type: String, required: true },
    type: { type: String, enum: ['transport', 'hotel', 'both'] },
    is_approved: { type: Boolean, default: false },
    contact_info: {
      phone: { type: String },
      address: { type: String },
      email: { type: String },
    },
    documents: { type: [String], default: [] },
  },
  { timestamps: true },
)

module.exports = model('Partner', partnerSchema)
