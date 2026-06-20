const mongoose = require('mongoose')

const { Schema, model } = mongoose

const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true, select: false },
    phone: { type: String, required: true },
    role: { type: String, enum: ['user', 'partner', 'admin'], default: 'user' },
    isVerified: { type: Boolean, default: false },
    birthDate:  { type: Date },
    city:       { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country:    { type: String, trim: true, default: 'Bangladesh' },
  },
  { timestamps: true },
)

module.exports = model('User', userSchema)
