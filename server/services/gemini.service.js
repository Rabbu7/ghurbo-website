const { GoogleGenerativeAI } = require('@google/generative-ai')

/**
 * gemini.service.js
 * Calls the Gemini 2.5 Flash API to generate a multi-leg route plan
 * between two Bangladesh cities.
 *
 * Exported: generateRoute(origin, destination) → parsed JSON route object
 */

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

/**
 * generateRoute
 * @param {string} origin       - Departure city/district name
 * @param {string} destination  - Destination city/district name
 * @returns {Promise<Object>}   - Parsed route JSON from Gemini
 * @throws {Error}              - On API failure, invalid JSON, or infeasible route
 */
async function generateRoute(origin, destination) {
  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

    const prompt = `You are a travel routing assistant for Bangladesh.
The user wants to travel from "${origin}" to "${destination}".

Available transport modes: bus, train, ship, launch (river ferry).

Geography rules you must follow:
- Saint Martin Island MUST have a ship leg from Teknaf
- Sandwip and Hatiya islands MUST have launch legs
- Sundarbans trips require launch from Mongla or Khulna
- No direct bus/train to Saint Martin — must go via Cox's Bazar then Teknaf
- Use realistic transit hubs: Dhaka, Chattogram, Sylhet, Rajshahi, Khulna
- If origin and destination are the same district, return feasible: false

Return ONLY a valid JSON object, no markdown, no explanation:
{
  "feasible": true,
  "legs": [
    {
      "from": "city name",
      "to": "city name",
      "mode": "bus|train|ship|launch",
      "estimated_hours": number,
      "notes": null
    }
  ],
  "total_hours": number,
  "connection_cities": ["city1"],
  "seasonal_notes": null
}`

    const result = await model.generateContent(prompt)
    const response = await result.response
    let text = response.text()

    // Strip markdown code fences if Gemini wraps the JSON in them
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim()

    let parsed
    try {
      parsed = JSON.parse(text)
    } catch {
      throw new Error('Gemini returned invalid JSON')
    }

    if (!parsed.feasible) {
      throw new Error('Route not feasible')
    }

    return parsed
  } catch (err) {
    throw err
  }
}

module.exports = { generateRoute }
