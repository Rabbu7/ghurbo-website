const QRCode = require('qrcode')

/**
 * Generate a ticket with QR code for a booking
 * @param {Object} booking - The booking document
 * @returns {Promise<Object>} The formatted ticket object
 */
async function generateTicket(booking) {
  try {
    const ticketData = JSON.stringify({
      ref_code: booking.ref_code,
      user_id: booking.user_id,
      trip_type: booking.trip_type,
      status: booking.status,
      grand_total: booking.pricing.grand_total,
    })

    // Generate QR code as base64 data URL (PNG format)
    const qrCode = await QRCode.toDataURL(ticketData)

    // Build and return the ticket object
    return {
      ref_code: booking.ref_code,
      status: booking.status,
      trip_type: booking.trip_type,
      forward_legs: booking.forward_legs,
      return_legs: booking.return_legs,
      hotel: booking.hotel,
      pricing: booking.pricing,
      qr_code: qrCode,
      generated_at: new Date().toISOString(),
    }
  } catch (err) {
    throw err
  }
}

module.exports = {
  generateTicket,
}
