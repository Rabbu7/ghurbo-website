require('dotenv').config()

const mongoose = require('mongoose')
const { connectDB } = require('../config/db')
const Hotel = require('../models/Hotel')

const hotels = [
  // ── COX'S BAZAR ───────────────────────────────────────────────────────────
  {
    name: 'Long Beach Hotel',
    city: "Cox's Bazar", district: "Cox's Bazar", category: 'luxury',
    rating: 4.8, reviews_count: 1240,
    rooms: [
      { type: 'Deluxe Sea View', price: 6500, total_rooms: 20 },
      { type: 'Standard', price: 3500, total_rooms: 30 },
    ],
    amenities: ['pool', 'wifi', 'restaurant', 'parking', 'gym'],
    active: true,
  },
  {
    name: 'Sea Crown Hotel',
    city: "Cox's Bazar", district: "Cox's Bazar", category: 'standard',
    rating: 4.3, reviews_count: 680,
    rooms: [
      { type: 'Sea View Double', price: 3200, total_rooms: 25 },
      { type: 'Standard Twin', price: 2200, total_rooms: 30 },
    ],
    amenities: ['wifi', 'restaurant', 'ac'],
    active: true,
  },
  {
    name: 'Hotel Mermaid Beach Resort',
    city: "Cox's Bazar", district: "Cox's Bazar", category: 'luxury',
    rating: 4.6, reviews_count: 890,
    rooms: [
      { type: 'Beach Cottage', price: 8000, total_rooms: 15 },
      { type: 'Deluxe Room', price: 5000, total_rooms: 20 },
    ],
    amenities: ['pool', 'wifi', 'restaurant', 'beach access', 'parking'],
    active: true,
  },
  {
    name: 'Sayeman Heritage Resort',
    city: "Cox's Bazar", district: "Cox's Bazar", category: 'luxury',
    rating: 4.7, reviews_count: 1100,
    rooms: [
      { type: 'Heritage Suite', price: 9000, total_rooms: 10 },
      { type: 'Deluxe Double', price: 5500, total_rooms: 25 },
    ],
    amenities: ['pool', 'wifi', 'restaurant', 'spa', 'gym', 'parking'],
    active: true,
  },
  {
    name: 'Hotel Ocean Paradise',
    city: "Cox's Bazar", district: "Cox's Bazar", category: 'standard',
    rating: 4.1, reviews_count: 450,
    rooms: [
      { type: 'Standard Sea View', price: 2800, total_rooms: 30 },
      { type: 'Standard Room', price: 1800, total_rooms: 40 },
    ],
    amenities: ['wifi', 'restaurant', 'ac', 'parking'],
    active: true,
  },
  {
    name: 'Coral Reef Guest House',
    city: "Cox's Bazar", district: "Cox's Bazar", category: 'budget',
    rating: 3.8, reviews_count: 220,
    rooms: [
      { type: 'Double Room', price: 1200, total_rooms: 20 },
      { type: 'Single Room', price: 800, total_rooms: 15 },
    ],
    amenities: ['wifi', 'ac'],
    active: true,
  },

  // ── SAINT MARTIN ISLAND ───────────────────────────────────────────────────
  {
    name: 'Blue Marine Resort',
    city: 'Saint Martin Island', district: "Cox's Bazar", category: 'luxury',
    rating: 4.5, reviews_count: 380,
    rooms: [
      { type: 'Sea View Cottage', price: 7000, total_rooms: 10 },
      { type: 'Standard Cottage', price: 4500, total_rooms: 12 },
    ],
    amenities: ['wifi', 'restaurant', 'beach access'],
    active: true,
  },
  {
    name: 'Hotel Sea Breeze',
    city: 'Saint Martin Island', district: "Cox's Bazar", category: 'standard',
    rating: 4.0, reviews_count: 210,
    rooms: [
      { type: 'Double Room', price: 3000, total_rooms: 15 },
      { type: 'Single Room', price: 2000, total_rooms: 10 },
    ],
    amenities: ['wifi', 'restaurant'],
    active: true,
  },
  {
    name: 'Nature Park Resort',
    city: 'Saint Martin Island', district: "Cox's Bazar", category: 'budget',
    rating: 3.7, reviews_count: 150,
    rooms: [{ type: 'Basic Cottage', price: 1500, total_rooms: 20 }],
    amenities: ['restaurant'],
    active: true,
  },

  // ── SYLHET ────────────────────────────────────────────────────────────────
  {
    name: 'Rose View Hotel',
    city: 'Sylhet', district: 'Sylhet', category: 'luxury',
    rating: 4.6, reviews_count: 920,
    rooms: [
      { type: 'Deluxe Suite', price: 6000, total_rooms: 15 },
      { type: 'Superior Double', price: 3500, total_rooms: 25 },
    ],
    amenities: ['pool', 'wifi', 'restaurant', 'gym', 'parking'],
    active: true,
  },
  {
    name: 'Hotel Noorjahan Grand',
    city: 'Sylhet', district: 'Sylhet', category: 'standard',
    rating: 4.2, reviews_count: 540,
    rooms: [
      { type: 'Deluxe Double', price: 2800, total_rooms: 30 },
      { type: 'Standard Room', price: 1800, total_rooms: 40 },
    ],
    amenities: ['wifi', 'restaurant', 'ac', 'parking'],
    active: true,
  },
  {
    name: 'Surma Valley Rest House',
    city: 'Sylhet', district: 'Sylhet', category: 'budget',
    rating: 3.9, reviews_count: 180,
    rooms: [
      { type: 'Double Room', price: 1200, total_rooms: 20 },
      { type: 'Single Room', price: 800, total_rooms: 15 },
    ],
    amenities: ['wifi', 'ac'],
    active: true,
  },

  // ── SREEMANGAL ────────────────────────────────────────────────────────────
  {
    name: 'Grand Sultan Tea Resort',
    city: 'Sreemangal', district: 'Moulvibazar', category: 'luxury',
    rating: 4.8, reviews_count: 760,
    rooms: [
      { type: 'Forest View Suite', price: 9000, total_rooms: 10 },
      { type: 'Deluxe Cottage', price: 5500, total_rooms: 15 },
    ],
    amenities: ['pool', 'wifi', 'restaurant', 'spa', 'tea garden tour'],
    active: true,
  },
  {
    name: 'Tea Town Resort',
    city: 'Sreemangal', district: 'Moulvibazar', category: 'standard',
    rating: 4.1, reviews_count: 320,
    rooms: [
      { type: 'Double Room', price: 2500, total_rooms: 20 },
      { type: 'Single Room', price: 1500, total_rooms: 15 },
    ],
    amenities: ['wifi', 'restaurant', 'ac'],
    active: true,
  },

  // ── BANDARBAN ─────────────────────────────────────────────────────────────
  {
    name: 'Hotel Hillside Resort',
    city: 'Bandarban', district: 'Bandarban', category: 'standard',
    rating: 4.2, reviews_count: 410,
    rooms: [
      { type: 'Hill View Double', price: 3000, total_rooms: 20 },
      { type: 'Standard Room', price: 2000, total_rooms: 25 },
    ],
    amenities: ['wifi', 'restaurant', 'parking'],
    active: true,
  },
  {
    name: 'Nilgiri Resort',
    city: 'Bandarban', district: 'Bandarban', category: 'luxury',
    rating: 4.5, reviews_count: 580,
    rooms: [
      { type: 'Cloud Cottage', price: 8000, total_rooms: 8 },
      { type: 'Deluxe Room', price: 5000, total_rooms: 12 },
    ],
    amenities: ['wifi', 'restaurant', 'mountain view'],
    active: true,
  },

  // ── RANGAMATI ─────────────────────────────────────────────────────────────
  {
    name: 'Parjatan Holiday Complex',
    city: 'Rangamati', district: 'Rangamati', category: 'standard',
    rating: 3.9, reviews_count: 290,
    rooms: [
      { type: 'Lake View Room', price: 2500, total_rooms: 25 },
      { type: 'Standard Room', price: 1800, total_rooms: 30 },
    ],
    amenities: ['wifi', 'restaurant', 'lake view', 'parking'],
    active: true,
  },

  // ── SUNDARBANS ────────────────────────────────────────────────────────────
  {
    name: 'Sundarban Tiger Camp',
    city: 'Sundarbans', district: 'Khulna', category: 'luxury',
    rating: 4.4, reviews_count: 340,
    rooms: [
      { type: 'Deluxe Tent', price: 7000, total_rooms: 10 },
      { type: 'Standard Tent', price: 4500, total_rooms: 15 },
    ],
    amenities: ['restaurant', 'forest tour', 'boat ride'],
    active: true,
  },

  // ── KUAKATA ───────────────────────────────────────────────────────────────
  {
    name: 'Hotel Kuakata Inn',
    city: 'Kuakata', district: 'Patuakhali', category: 'standard',
    rating: 4.0, reviews_count: 260,
    rooms: [
      { type: 'Sea View Double', price: 2800, total_rooms: 20 },
      { type: 'Standard Room', price: 1800, total_rooms: 25 },
    ],
    amenities: ['wifi', 'restaurant', 'parking'],
    active: true,
  },
  {
    name: 'Kuakata Grand Hotel',
    city: 'Kuakata', district: 'Patuakhali', category: 'luxury',
    rating: 4.3, reviews_count: 380,
    rooms: [
      { type: 'Deluxe Sea View', price: 4500, total_rooms: 15 },
      { type: 'Standard Room', price: 2800, total_rooms: 20 },
    ],
    amenities: ['pool', 'wifi', 'restaurant', 'parking'],
    active: true,
  },

  // ── SAJEK VALLEY ──────────────────────────────────────────────────────────
  {
    name: 'Sajek Resort',
    city: 'Sajek Valley', district: 'Rangamati', category: 'standard',
    rating: 4.3, reviews_count: 480,
    rooms: [
      { type: 'Cloud View Cottage', price: 4000, total_rooms: 12 },
      { type: 'Standard Room', price: 2500, total_rooms: 15 },
    ],
    amenities: ['wifi', 'restaurant', 'valley view'],
    active: true,
  },
]

async function seed() {
  try {
    await connectDB()

    await Hotel.deleteMany({})
    console.log('Cleared existing hotels')

    await Hotel.insertMany(hotels)
    console.log(`Hotels seeded successfully (${hotels.length} records)`)

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('Hotel seed failed:', err)
    process.exit(1)
  }
}

seed()
