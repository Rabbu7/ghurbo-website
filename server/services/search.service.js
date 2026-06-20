const RouteCache = require('../models/RouteCache')
const Operator = require('../models/Operator')
const Hotel = require('../models/Hotel')
const { generateRoute } = require('./gemini.service')
const normalizeCity = require('../utils/normalizeCity')

/**
 * search.service.js
 * Orchestrates the full search flow:
 *   1. Normalize inputs
 *   2. Check RouteCache → call Gemini only on cache miss
 *   3. Match each leg with real Operator documents from DB
 *   4. Fetch hotels at the final destination
 *   5. Build return_legs if round_trip
 *   6. Return merged result object
 */

/**
 * matchOperatorsForLeg
 * Queries the Operator collection for a single route leg.
 * @param {Object} leg - { from, to, mode }
 * @returns {Promise<Object[]>} - Matching operator documents
 */
async function matchOperatorsForLeg(leg) {
  return Operator.find({
    from: { $regex: new RegExp(`^${leg.from}$`, 'i') },
    to:   { $regex: new RegExp(`^${leg.to}$`, 'i') },
    mode: leg.mode,
    active: true,
  }).lean()
}

/**
 * searchRoute
 * @param {string} origin      - Raw origin city/district
 * @param {string} destination - Raw destination city/district
 * @param {string} tripType    - 'one_way' | 'round_trip'
 * @returns {Promise<Object>}  - Full merged search result
 */
async function searchRoute(origin, destination, tripType) {
  try {
    // ── STEP 1: Normalize inputs ───────────────────────────────────────────
    const normOrigin = normalizeCity(origin)
    const normDest   = normalizeCity(destination)

    // ── STEP 2: Check RouteCache → call Gemini on miss ────────────────────
    let routePlan

    const cached = await RouteCache.findOne({
      origin:      { $regex: new RegExp(`^${normOrigin}$`, 'i') },
      destination: { $regex: new RegExp(`^${normDest}$`, 'i') },
      expires_at:  { $gt: new Date() },
    }).lean()

    if (cached) {
      // Cache hit — use stored legs
      routePlan = {
        legs:              cached.legs,
        connection_cities: cached.connection_cities,
        total_hours:       cached.total_hours,
        seasonal_notes:    cached.seasonal_notes,
      }
    } else {
      // Cache miss — call Gemini and persist result
      const geminiResult = await generateRoute(normOrigin, normDest)

      const expiresAt = new Date()
      expiresAt.setDate(expiresAt.getDate() + 30)

      await RouteCache.create({
        origin:            normOrigin,
        destination:       normDest,
        legs:              geminiResult.legs,
        connection_cities: geminiResult.connection_cities,
        total_hours:       geminiResult.total_hours,
        seasonal_notes:    geminiResult.seasonal_notes,
        cached_at:         new Date(),
        expires_at:        expiresAt,
      })

      routePlan = {
        legs:              geminiResult.legs,
        connection_cities: geminiResult.connection_cities,
        total_hours:       geminiResult.total_hours,
        seasonal_notes:    geminiResult.seasonal_notes,
      }
    }

    // ── STEP 3: Match each forward leg with operators from DB ─────────────
    const forwardLegs = await Promise.all(
      routePlan.legs.map(async (leg) => {
        const operators = await matchOperatorsForLeg(leg)
        return {
          ...leg,
          operators,
          operators_available: operators.length > 0,
        }
      })
    )

    // ── STEP 4: Fetch hotels at final destination ─────────────────────────
    const finalCity = routePlan.legs[routePlan.legs.length - 1].to

    const hotels = await Hotel.find({
      city:   { $regex: new RegExp(`^${finalCity}$`, 'i') },
      active: true,
    }).lean()

    // ── STEP 5: Build return_legs if round_trip ───────────────────────────
    let returnLegs = []

    if (tripType === 'round_trip') {
      returnLegs = await Promise.all(
        routePlan.legs
          .slice()
          .reverse()
          .map(async (leg) => {
            const reversedLeg = { ...leg, from: leg.to, to: leg.from }
            const operators = await matchOperatorsForLeg(reversedLeg)
            return {
              ...reversedLeg,
              operators,
              operators_available: operators.length > 0,
            }
          })
      )
    }

    // ── STEP 6: Return merged result ──────────────────────────────────────
    const fullyBookable = forwardLegs.every((leg) => leg.operators_available === true)

    return {
      origin:        normOrigin,
      destination:   normDest,
      forward_legs:  forwardLegs,
      return_legs:   returnLegs,
      hotels,
      total_hours:   routePlan.total_hours,
      seasonal_notes: routePlan.seasonal_notes,
      fully_bookable: fullyBookable,
    }
  } catch (err) {
    throw err
  }
}

module.exports = { searchRoute }
