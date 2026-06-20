require('dotenv').config()

const mongoose = require('mongoose')
const { connectDB } = require('../config/db')
const Operator = require('../models/Operator')

const operators = [
  // ── BUS ROUTES ────────────────────────────────────────────────────────────
  {
    from: 'Dhaka', to: "Cox's Bazar", mode: 'bus',
    operator_name: 'Green Line Paribahan',
    schedules: [{ departure: '21:00', arrival: '06:00', duration_hours: 9, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Sleeper', price: 1200, total_seats: 40 },
      { type: 'Non-AC Chair', price: 600, total_seats: 45 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: "Cox's Bazar", mode: 'bus',
    operator_name: 'Shyamoli NR Travel',
    schedules: [{ departure: '22:00', arrival: '07:00', duration_hours: 9, days_available: ['everyday'] }],
    seat_types: [{ type: 'AC Semi-Sleeper', price: 1000, total_seats: 40 }],
    active: true,
  },
  {
    from: 'Dhaka', to: "Cox's Bazar", mode: 'bus',
    operator_name: 'Hanif Enterprise',
    schedules: [{ departure: '20:00', arrival: '06:00', duration_hours: 10, days_available: ['everyday'] }],
    seat_types: [{ type: 'Non-AC Chair', price: 550, total_seats: 50 }],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Sylhet', mode: 'bus',
    operator_name: 'Shyamoli Paribahan',
    schedules: [{ departure: '22:00', arrival: '04:00', duration_hours: 6, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Sleeper', price: 800, total_seats: 40 },
      { type: 'Non-AC Chair', price: 400, total_seats: 45 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Sylhet', mode: 'bus',
    operator_name: 'Green Line Paribahan',
    schedules: [{ departure: '21:30', arrival: '03:30', duration_hours: 6, days_available: ['everyday'] }],
    seat_types: [{ type: 'AC Sleeper', price: 900, total_seats: 40 }],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Chattogram', mode: 'bus',
    operator_name: 'S.A. Paribahan',
    schedules: [{ departure: '23:00', arrival: '05:00', duration_hours: 6, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Sleeper', price: 900, total_seats: 40 },
      { type: 'Non-AC Chair', price: 450, total_seats: 45 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Chattogram', mode: 'bus',
    operator_name: 'Soudia Eagle Paribahan',
    schedules: [{ departure: '22:30', arrival: '04:30', duration_hours: 6, days_available: ['everyday'] }],
    seat_types: [{ type: 'AC Semi-Sleeper', price: 800, total_seats: 40 }],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Rajshahi', mode: 'bus',
    operator_name: 'Hanif Enterprise',
    schedules: [{ departure: '22:00', arrival: '04:00', duration_hours: 6, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Sleeper', price: 750, total_seats: 40 },
      { type: 'Non-AC Chair', price: 380, total_seats: 45 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Khulna', mode: 'bus',
    operator_name: 'Soudia Eagle Paribahan',
    schedules: [{ departure: '22:30', arrival: '07:00', duration_hours: 8.5, days_available: ['everyday'] }],
    seat_types: [{ type: 'AC Sleeper', price: 900, total_seats: 40 }],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Barishal', mode: 'bus',
    operator_name: 'Sakura Paribahan',
    schedules: [{ departure: '07:00', arrival: '12:00', duration_hours: 5, days_available: ['everyday'] }],
    seat_types: [{ type: 'AC Chair', price: 600, total_seats: 40 }],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Rangpur', mode: 'bus',
    operator_name: 'Nabil Paribahan',
    schedules: [{ departure: '21:00', arrival: '03:00', duration_hours: 6, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Sleeper', price: 800, total_seats: 40 },
      { type: 'Non-AC Chair', price: 420, total_seats: 45 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Mymensingh', mode: 'bus',
    operator_name: 'Ena Transport',
    schedules: [{ departure: '07:00', arrival: '09:30', duration_hours: 2.5, days_available: ['everyday'] }],
    seat_types: [{ type: 'AC Chair', price: 300, total_seats: 40 }],
    active: true,
  },
  {
    from: 'Chattogram', to: "Cox's Bazar", mode: 'bus',
    operator_name: 'S.A. Paribahan',
    schedules: [
      { departure: '07:00', arrival: '10:30', duration_hours: 3.5, days_available: ['everyday'] },
      { departure: '14:00', arrival: '17:30', duration_hours: 3.5, days_available: ['everyday'] },
    ],
    seat_types: [
      { type: 'AC Chair', price: 400, total_seats: 40 },
      { type: 'Non-AC Chair', price: 220, total_seats: 45 },
    ],
    active: true,
  },
  {
    from: "Cox's Bazar", to: 'Teknaf', mode: 'bus',
    operator_name: 'Local Bus Service',
    schedules: [
      { departure: '07:00', arrival: '08:30', duration_hours: 1.5, days_available: ['everyday'] },
      { departure: '10:00', arrival: '11:30', duration_hours: 1.5, days_available: ['everyday'] },
    ],
    seat_types: [{ type: 'Non-AC Chair', price: 80, total_seats: 40 }],
    active: true,
  },
  {
    from: 'Sylhet', to: 'Sreemangal', mode: 'bus',
    operator_name: 'Local Bus Service',
    schedules: [{ departure: '08:00', arrival: '10:00', duration_hours: 2, days_available: ['everyday'] }],
    seat_types: [{ type: 'Non-AC Chair', price: 120, total_seats: 40 }],
    active: true,
  },
  {
    from: 'Chattogram', to: 'Bandarban', mode: 'bus',
    operator_name: 'Purbani Paribahan',
    schedules: [
      { departure: '07:00', arrival: '09:30', duration_hours: 2.5, days_available: ['everyday'] },
      { departure: '13:00', arrival: '15:30', duration_hours: 2.5, days_available: ['everyday'] },
    ],
    seat_types: [{ type: 'Non-AC Chair', price: 150, total_seats: 40 }],
    active: true,
  },
  {
    from: 'Chattogram', to: 'Rangamati', mode: 'bus',
    operator_name: 'BRTC',
    schedules: [{ departure: '07:30', arrival: '09:30', duration_hours: 2, days_available: ['everyday'] }],
    seat_types: [{ type: 'Non-AC Chair', price: 130, total_seats: 40 }],
    active: true,
  },

  // ── TRAIN ROUTES ──────────────────────────────────────────────────────────
  {
    from: 'Dhaka', to: 'Chattogram', mode: 'train',
    operator_name: 'Subarna Express',
    schedules: [{ departure: '07:00', arrival: '11:00', duration_hours: 4, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Seat', price: 681, total_seats: 60 },
      { type: 'Shovon Chair', price: 215, total_seats: 100 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Chattogram', mode: 'train',
    operator_name: 'Turna Nishitha',
    schedules: [{ departure: '23:00', arrival: '05:00', duration_hours: 6, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Berth', price: 1029, total_seats: 40 },
      { type: 'Shovon Chair', price: 215, total_seats: 80 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Sylhet', mode: 'train',
    operator_name: 'Parabat Express',
    schedules: [{ departure: '06:40', arrival: '12:00', duration_hours: 5.5, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Seat', price: 550, total_seats: 60 },
      { type: 'Shovon Chair', price: 215, total_seats: 100 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Sylhet', mode: 'train',
    operator_name: 'Jayantika Express',
    schedules: [{ departure: '12:00', arrival: '17:30', duration_hours: 5.5, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Seat', price: 550, total_seats: 60 },
      { type: 'Shovon Chair', price: 215, total_seats: 100 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Rajshahi', mode: 'train',
    operator_name: 'Silkcity Express',
    schedules: [{ departure: '14:40', arrival: '22:00', duration_hours: 7.5, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Seat', price: 680, total_seats: 60 },
      { type: 'Shovon Chair', price: 215, total_seats: 100 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Khulna', mode: 'train',
    operator_name: 'Sundarban Express',
    schedules: [{ departure: '06:20', arrival: '15:00', duration_hours: 8.5, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Seat', price: 726, total_seats: 60 },
      { type: 'Shovon Chair', price: 215, total_seats: 100 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Rangpur', mode: 'train',
    operator_name: 'Rangpur Express',
    schedules: [{ departure: '10:00', arrival: '17:00', duration_hours: 7, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Seat', price: 700, total_seats: 60 },
      { type: 'Shovon Chair', price: 215, total_seats: 100 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: "Cox's Bazar", mode: 'train',
    operator_name: "Cox's Bazar Express",
    schedules: [{ departure: '22:00', arrival: '07:00', duration_hours: 9, days_available: ['everyday'] }],
    seat_types: [
      { type: 'AC Berth', price: 1029, total_seats: 40 },
      { type: 'AC Seat', price: 681, total_seats: 60 },
      { type: 'Shovon Chair', price: 215, total_seats: 100 },
    ],
    active: true,
  },

  // ── SHIP / LAUNCH ROUTES ──────────────────────────────────────────────────
  {
    from: 'Teknaf', to: 'Saint Martin Island', mode: 'ship',
    operator_name: 'KRNB Ship',
    schedules: [{ departure: '09:00', arrival: '11:30', duration_hours: 2.5, days_available: ['everyday'] }],
    seat_types: [
      { type: 'Deck', price: 650, total_seats: 200 },
      { type: 'VIP Cabin', price: 1500, total_seats: 20 },
    ],
    seasonal_note: 'Operates October to April only',
    active: true,
  },
  {
    from: 'Teknaf', to: 'Saint Martin Island', mode: 'ship',
    operator_name: 'Bay Cruiser',
    schedules: [{ departure: '09:30', arrival: '12:00', duration_hours: 2.5, days_available: ['everyday'] }],
    seat_types: [{ type: 'Deck', price: 700, total_seats: 180 }],
    seasonal_note: 'Operates October to April only',
    active: true,
  },
  {
    from: 'Dhaka', to: 'Barishal', mode: 'launch',
    operator_name: 'Rocket Steamer (BIWTC)',
    schedules: [{ departure: '18:00', arrival: '05:00', duration_hours: 11, days_available: ['everyday'] }],
    seat_types: [
      { type: 'First Class Cabin', price: 1500, total_seats: 20 },
      { type: 'Deck', price: 200, total_seats: 300 },
    ],
    active: true,
  },
  {
    from: 'Dhaka', to: 'Khulna', mode: 'launch',
    operator_name: 'Rocket Steamer (BIWTC)',
    schedules: [{ departure: '06:00', arrival: '05:00', duration_hours: 23, days_available: ['sat', 'sun', 'tue', 'wed'] }],
    seat_types: [
      { type: 'First Class Cabin', price: 2200, total_seats: 20 },
      { type: 'Deck', price: 350, total_seats: 300 },
    ],
    active: true,
  },
  {
    from: 'Khulna', to: 'Sundarbans', mode: 'launch',
    operator_name: 'Chitra Launch',
    schedules: [{ departure: '07:00', arrival: '12:00', duration_hours: 5, days_available: ['everyday'] }],
    seat_types: [{ type: 'Deck', price: 500, total_seats: 100 }],
    active: true,
  },
  {
    from: 'Mongla', to: 'Sundarbans', mode: 'launch',
    operator_name: 'Mongla Tour Boat',
    schedules: [{ departure: '08:00', arrival: '11:00', duration_hours: 3, days_available: ['everyday'] }],
    seat_types: [{ type: 'Deck', price: 400, total_seats: 60 }],
    active: true,
  },
  // ── REVERSE BUS & TRAIN ROUTES ─────────────────────────────────────────────
  {
    from: "Cox's Bazar", to: "Dhaka", mode: "bus",
    operator_name: "Green Line Paribahan",
    schedules: [{ departure: "21:00", arrival: "06:00", duration_hours: 9, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Sleeper", price: 1200, total_seats: 40 },
      { type: "Non-AC Chair", price: 600, total_seats: 45 }
    ],
    active: true
  },
  {
    from: "Cox's Bazar", to: "Dhaka", mode: "bus",
    operator_name: "Shyamoli NR Travel",
    schedules: [{ departure: "22:00", arrival: "07:00", duration_hours: 9, days_available: ["everyday"] }],
    seat_types: [{ type: "AC Semi-Sleeper", price: 1000, total_seats: 40 }],
    active: true
  },
  {
    from: "Cox's Bazar", to: "Dhaka", mode: "train",
    operator_name: "Cox's Bazar Express",
    schedules: [{ departure: "22:00", arrival: "07:00", duration_hours: 9, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Berth", price: 1029, total_seats: 40 },
      { type: "AC Seat", price: 681, total_seats: 60 },
      { type: "Shovon Chair", price: 215, total_seats: 100 }
    ],
    active: true
  },
  {
    from: "Sylhet", to: "Dhaka", mode: "bus",
    operator_name: "Shyamoli Paribahan",
    schedules: [{ departure: "22:00", arrival: "04:00", duration_hours: 6, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Sleeper", price: 800, total_seats: 40 },
      { type: "Non-AC Chair", price: 400, total_seats: 45 }
    ],
    active: true
  },
  {
    from: "Sylhet", to: "Dhaka", mode: "train",
    operator_name: "Parabat Express",
    schedules: [{ departure: "14:30", arrival: "20:00", duration_hours: 5.5, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Seat", price: 550, total_seats: 60 },
      { type: "Shovon Chair", price: 215, total_seats: 100 }
    ],
    active: true
  },
  {
    from: "Chattogram", to: "Dhaka", mode: "bus",
    operator_name: "S.A. Paribahan",
    schedules: [{ departure: "23:00", arrival: "05:00", duration_hours: 6, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Sleeper", price: 900, total_seats: 40 },
      { type: "Non-AC Chair", price: 450, total_seats: 45 }
    ],
    active: true
  },
  {
    from: "Chattogram", to: "Dhaka", mode: "train",
    operator_name: "Subarna Express",
    schedules: [{ departure: "15:00", arrival: "19:00", duration_hours: 4, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Seat", price: 681, total_seats: 60 },
      { type: "Shovon Chair", price: 215, total_seats: 100 }
    ],
    active: true
  },
  {
    from: "Rajshahi", to: "Dhaka", mode: "bus",
    operator_name: "Hanif Enterprise",
    schedules: [{ departure: "22:00", arrival: "04:00", duration_hours: 6, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Sleeper", price: 750, total_seats: 40 },
      { type: "Non-AC Chair", price: 380, total_seats: 45 }
    ],
    active: true
  },
  {
    from: "Khulna", to: "Dhaka", mode: "bus",
    operator_name: "Soudia Eagle Paribahan",
    schedules: [{ departure: "22:30", arrival: "07:00", duration_hours: 8.5, days_available: ["everyday"] }],
    seat_types: [{ type: "AC Sleeper", price: 900, total_seats: 40 }],
    active: true
  },
  {
    from: "Rangpur", to: "Dhaka", mode: "bus",
    operator_name: "Nabil Paribahan",
    schedules: [{ departure: "21:00", arrival: "03:00", duration_hours: 6, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Sleeper", price: 800, total_seats: 40 },
      { type: "Non-AC Chair", price: 420, total_seats: 45 }
    ],
    active: true
  },
  {
    from: "Teknaf", to: "Cox's Bazar", mode: "bus",
    operator_name: "Local Bus Service",
    schedules: [
      { departure: "14:00", arrival: "15:30", duration_hours: 1.5, days_available: ["everyday"] },
      { departure: "17:00", arrival: "18:30", duration_hours: 1.5, days_available: ["everyday"] }
    ],
    seat_types: [{ type: "Non-AC Chair", price: 80, total_seats: 40 }],
    active: true
  },
  {
    from: "Saint Martin Island", to: "Teknaf", mode: "ship",
    operator_name: "KRNB Ship",
    schedules: [{ departure: "14:00", arrival: "16:30", duration_hours: 2.5, days_available: ["everyday"] }],
    seat_types: [
      { type: "Deck", price: 650, total_seats: 200 },
      { type: "VIP Cabin", price: 1500, total_seats: 20 }
    ],
    seasonal_note: "Operates October to April only",
    active: true
  },
  {
    from: "Cox's Bazar", to: "Dhaka", mode: "bus",
    operator_name: "Hanif Enterprise",
    schedules: [{ departure: "20:00", arrival: "06:00", duration_hours: 10, days_available: ["everyday"] }],
    seat_types: [{ type: "Non-AC Chair", price: 550, total_seats: 50 }],
    active: true
  },
  {
    from: "Sylhet", to: "Dhaka", mode: "bus",
    operator_name: "Green Line Paribahan",
    schedules: [{ departure: "21:30", arrival: "03:30", duration_hours: 6, days_available: ["everyday"] }],
    seat_types: [{ type: "AC Sleeper", price: 900, total_seats: 40 }],
    active: true
  },
  {
    from: "Chattogram", to: "Dhaka", mode: "bus",
    operator_name: "Soudia Eagle Paribahan",
    schedules: [{ departure: "22:30", arrival: "04:30", duration_hours: 6, days_available: ["everyday"] }],
    seat_types: [{ type: "AC Semi-Sleeper", price: 800, total_seats: 40 }],
    active: true
  },
  {
    from: "Barishal", to: "Dhaka", mode: "bus",
    operator_name: "Sakura Paribahan",
    schedules: [{ departure: "07:00", arrival: "12:00", duration_hours: 5, days_available: ["everyday"] }],
    seat_types: [{ type: "AC Chair", price: 600, total_seats: 40 }],
    active: true
  },
  {
    from: "Mymensingh", to: "Dhaka", mode: "bus",
    operator_name: "Ena Transport",
    schedules: [{ departure: "07:00", arrival: "09:30", duration_hours: 2.5, days_available: ["everyday"] }],
    seat_types: [{ type: "AC Chair", price: 300, total_seats: 40 }],
    active: true
  },
  {
    from: "Cox's Bazar", to: "Chattogram", mode: "bus",
    operator_name: "S.A. Paribahan",
    schedules: [
      { departure: "07:00", arrival: "10:30", duration_hours: 3.5, days_available: ["everyday"] },
      { departure: "14:00", arrival: "17:30", duration_hours: 3.5, days_available: ["everyday"] }
    ],
    seat_types: [
      { type: "AC Chair", price: 400, total_seats: 40 },
      { type: "Non-AC Chair", price: 220, total_seats: 45 }
    ],
    active: true
  },
  {
    from: "Sreemangal", to: "Sylhet", mode: "bus",
    operator_name: "Local Bus Service",
    schedules: [{ departure: "08:00", arrival: "10:00", duration_hours: 2, days_available: ["everyday"] }],
    seat_types: [{ type: "Non-AC Chair", price: 120, total_seats: 40 }],
    active: true
  },
  {
    from: "Bandarban", to: "Chattogram", mode: "bus",
    operator_name: "Purbani Paribahan",
    schedules: [
      { departure: "07:00", arrival: "09:30", duration_hours: 2.5, days_available: ["everyday"] },
      { departure: "13:00", arrival: "15:30", duration_hours: 2.5, days_available: ["everyday"] }
    ],
    seat_types: [{ type: "Non-AC Chair", price: 150, total_seats: 40 }],
    active: true
  },
  {
    from: "Rangamati", to: "Chattogram", mode: "bus",
    operator_name: "BRTC",
    schedules: [{ departure: "07:30", arrival: "09:30", duration_hours: 2, days_available: ["everyday"] }],
    seat_types: [{ type: "Non-AC Chair", price: 130, total_seats: 40 }],
    active: true
  },
  {
    from: "Chattogram", to: "Dhaka", mode: "train",
    operator_name: "Turna Nishitha",
    schedules: [{ departure: "23:00", arrival: "05:00", duration_hours: 6, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Berth", price: 1029, total_seats: 40 },
      { type: "Shovon Chair", price: 215, total_seats: 80 }
    ],
    active: true
  },
  {
    from: "Sylhet", to: "Dhaka", mode: "train",
    operator_name: "Jayantika Express",
    schedules: [{ departure: "12:00", arrival: "17:30", duration_hours: 5.5, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Seat", price: 550, total_seats: 60 },
      { type: "Shovon Chair", price: 215, total_seats: 100 }
    ],
    active: true
  },
  {
    from: "Rajshahi", to: "Dhaka", mode: "train",
    operator_name: "Silkcity Express",
    schedules: [{ departure: "14:40", arrival: "22:00", duration_hours: 7.5, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Seat", price: 680, total_seats: 60 },
      { type: "Shovon Chair", price: 215, total_seats: 100 }
    ],
    active: true
  },
  {
    from: "Khulna", to: "Dhaka", mode: "train",
    operator_name: "Sundarban Express",
    schedules: [{ departure: "06:20", arrival: "15:00", duration_hours: 8.5, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Seat", price: 726, total_seats: 60 },
      { type: "Shovon Chair", price: 215, total_seats: 100 }
    ],
    active: true
  },
  {
    from: "Rangpur", to: "Dhaka", mode: "train",
    operator_name: "Rangpur Express",
    schedules: [{ departure: "10:00", arrival: "17:00", duration_hours: 7, days_available: ["everyday"] }],
    seat_types: [
      { type: "AC Seat", price: 700, total_seats: 60 },
      { type: "Shovon Chair", price: 215, total_seats: 100 }
    ],
    active: true
  }
]

async function seed() {
  try {
    await connectDB()

    await Operator.deleteMany({})
    console.log('Cleared existing operators')

    await Operator.insertMany(operators)
    console.log(`Operators seeded successfully (${operators.length} records)`)

    await mongoose.disconnect()
    process.exit(0)
  } catch (err) {
    console.error('Operator seed failed:', err)
    process.exit(1)
  }
}

seed()
