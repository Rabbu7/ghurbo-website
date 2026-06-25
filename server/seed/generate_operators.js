const path = require('path')
require('dotenv').config({ path: path.join(__dirname, '../.env') })

const mongoose = require('mongoose')
const { GoogleGenerativeAI } = require('@google/generative-ai')

const RouteCache = require('../models/RouteCache')
const Operator = require('../models/Operator')
const { connectDB } = require('../config/db')

async function run() {
  try {
    console.log('Connecting to database...')
    await connectDB()

    console.log('Fetching RouteCache documents...')
    const caches = await RouteCache.find({})
    
    // Collect and deduplicate unique legs (including reverse directions)
    const uniqueLegsMap = new Map()

    for (const cache of caches) {
      if (!cache.legs) continue
      for (const leg of cache.legs) {
        if (!leg.from || !leg.to || !leg.mode) continue
        
        const normalFrom = leg.from.trim()
        const normalTo = leg.to.trim()
        const mode = leg.mode.trim().toLowerCase()

        // Forward leg key
        const keyFwd = `${normalFrom.toLowerCase()}->${normalTo.toLowerCase()}:${mode}`
        if (!uniqueLegsMap.has(keyFwd)) {
          uniqueLegsMap.set(keyFwd, { from: normalFrom, to: normalTo, mode })
        }

        // Reverse leg key
        const keyRev = `${normalTo.toLowerCase()}->${normalFrom.toLowerCase()}:${mode}`
        if (!uniqueLegsMap.has(keyRev)) {
          uniqueLegsMap.set(keyRev, { from: normalTo, to: normalFrom, mode })
        }
      }
    }

    const allLegs = Array.from(uniqueLegsMap.values())
    console.log(`Total unique legs found (including reverse): ${allLegs.length}`)

    let skippedCount = 0
    const legsToGenerate = []

    for (const leg of allLegs) {
      // Escape special characters in regex
      const escapedFrom = leg.from.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
      const escapedTo = leg.to.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

      const existing = await Operator.findOne({
        from: { $regex: new RegExp(`^${escapedFrom}$`, 'i') },
        to: { $regex: new RegExp(`^${escapedTo}$`, 'i') },
        mode: leg.mode
      })

      if (existing) {
        skippedCount++
      } else {
        legsToGenerate.push(leg)
      }
    }

    console.log(`How many legs already have operators (skipped): ${skippedCount}`)
    console.log(`How many legs need generation: ${legsToGenerate.length}`)

    if (legsToGenerate.length === 0) {
      console.log('No new operators need to be generated.')
      await mongoose.disconnect()
      console.log('Disconnected from database.')
      process.exit(0)
    }

    // Initialize Gemini
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' })
    let totalInserted = 0

    for (const leg of legsToGenerate) {
      console.log(`Generating operators for ${leg.from} → ${leg.to} (${leg.mode})...`)

      const prompt = `You are a transport data generator for Bangladesh.
Generate realistic operator data for this route leg:
  From: ${leg.from}
  To: ${leg.to}
  Mode: ${leg.mode}

Rules:
- Generate exactly 2 operator entries
- Use real Bangladesh transport operator names where plausible
  (e.g. Hanif Enterprise, Shyamoli, Green Line, S.A. Paribahan,
  Sakura, BRTC, Bangladesh Railway, BIWTC for launches/ships)
- For bus: include AC and Non-AC seat types with realistic prices
- For train: use Bangladesh Railway as operator_name, realistic named
  express trains, AC Seat and Shovon Chair seat types
- For launch/ship: use BIWTC or a regional launch service name,
  Deck and Cabin seat types
- Prices must be realistic for Bangladesh (bus 80-1500 BDT,
  train 150-1200 BDT, launch/ship 150-1200 BDT)
- Each operator gets 1-2 schedules with realistic departure/arrival times
- total_seats: bus 40-50, train 60-100, launch 80-200

Return ONLY valid JSON, no markdown, no explanation:
[
  {
    "operator_name": "string",
    "schedules": [
      { "departure": "HH:MM", "arrival": "HH:MM",
        "duration_hours": number, "days_available": ["everyday"] }
    ],
    "seat_types": [
      { "type": "string", "price": number, "total_seats": number }
    ]
  }
]
`

      let attempts = 0
      const maxAttempts = 3
      let success = false

      while (attempts < maxAttempts && !success) {
        attempts++
        try {
          const result = await model.generateContent(prompt)
          const response = await result.response
          let text = response.text()

          // Strip markdown code fences
          text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

          const parsed = JSON.parse(text)

          if (!Array.isArray(parsed)) {
            console.warn(`Warning: Response for ${leg.from} → ${leg.to} was not an array. Skipping.`)
            break
          }

          const docs = parsed.map(entry => ({
            from: leg.from,
            to: leg.to,
            mode: leg.mode,
            operator_name: entry.operator_name,
            partner_id: null,
            schedules: entry.schedules,
            seat_types: entry.seat_types,
            seasonal_note: null,
            active: true
          }))

          await Operator.insertMany(docs)
          console.log(`Inserted ${docs.length} operators for ${leg.from} → ${leg.to} (Attempt ${attempts}/${maxAttempts})`)
          totalInserted += docs.length
          success = true

        } catch (err) {
          const isRateLimit = err.message && (err.message.includes('429') || err.message.toLowerCase().includes('quota') || err.message.toLowerCase().includes('too many requests'))
          if (isRateLimit && attempts < maxAttempts) {
            const waitTime = 15000 * attempts // Exponential wait (15s, 30s)
            console.warn(`Rate limit hit for ${leg.from} → ${leg.to} (${leg.mode}). Waiting ${waitTime / 1000}s before retry (Attempt ${attempts}/${maxAttempts})...`)
            await new Promise(resolve => setTimeout(resolve, waitTime))
          } else {
            console.error(`Warning: Failed to generate operators for ${leg.from} → ${leg.to} (${leg.mode}) on attempt ${attempts}. Error: ${err.message}`)
            break // Skip if it's a non-rate-limit error (e.g. JSON.parse error) or we exhausted all attempts
          }
        }
      }

      // Add a 1-second delay between Gemini calls to avoid rate limits
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    console.log(`Done. Total operators inserted: ${totalInserted}`)
    await mongoose.disconnect()
    console.log('Disconnected from database.')
    process.exit(0)
  } catch (err) {
    console.error('Fatal error during seed execution:', err)
    try {
      await mongoose.disconnect()
    } catch {}
    process.exit(1)
  }
}

run()
