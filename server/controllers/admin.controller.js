const User = require('../models/User')
const Booking = require('../models/Booking')
const Partner = require('../models/Partner')
const Hotel = require('../models/Hotel')
const Operator = require('../models/Operator')

const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
const pctChange = (curr, prev) => (prev > 0 ? Math.round(((curr - prev) / prev) * 100) : null)

exports.dashboard = async (req, res, next) => {
  try {
    const today = startOfDay(new Date())
    const thirtyDaysAgo = new Date(today); thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
    const sixtyDaysAgo = new Date(thirtyDaysAgo); sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 30)

    const totalUsers = await User.countDocuments()
    const totalBookings = await Booking.countDocuments()
    const totalPartners = await Partner.countDocuments()

    const newUsersCurrent = await User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    const newUsersPrev = await User.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } })

    const newBookingsCurrent = await Booking.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    const newBookingsPrev = await Booking.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } })

    const newPartnersCurrent = await Partner.countDocuments({ createdAt: { $gte: thirtyDaysAgo } })
    const newPartnersPrev = await Partner.countDocuments({ createdAt: { $gte: sixtyDaysAgo, $lt: thirtyDaysAgo } })

    const confirmedRecent = await Booking.find({
      status: 'CONFIRMED',
      createdAt: { $gte: sixtyDaysAgo },
    })
    const revenueCurrent = confirmedRecent
      .filter(b => b.createdAt >= thirtyDaysAgo)
      .reduce((sum, b) => sum + (b.pricing?.grand_total || 0), 0)
    const revenuePrev = confirmedRecent
      .filter(b => b.createdAt >= sixtyDaysAgo && b.createdAt < thirtyDaysAgo)
      .reduce((sum, b) => sum + (b.pricing?.grand_total || 0), 0)

    const allBookingsLast30 = await Booking.find({ createdAt: { $gte: thirtyDaysAgo } })
    const bookingTrends = []
    for (let i = 0; i < 30; i++) {
      const day = new Date(thirtyDaysAgo); day.setDate(day.getDate() + i)
      const nextDay = new Date(day); nextDay.setDate(nextDay.getDate() + 1)
      const count = allBookingsLast30.filter(b => b.createdAt >= day && b.createdAt < nextDay).length
      bookingTrends.push({
        date: day.toISOString().slice(0, 10),
        count,
        isToday: day.getTime() === today.getTime(),
      })
    }

    const pendingPartnersRaw = await Partner.find({ is_approved: false })
      .populate('user_id', 'name email')
      .sort({ createdAt: -1 })

    const pendingPartners = await Promise.all(pendingPartnersRaw.map(async (p) => {
      let location = p.city || p.location || null
      if (!location && (p.type === 'hotel' || p.type === 'both')) {
        const h = await Hotel.findOne({ partner_id: p._id })
        location = h?.city || null
      }
      if (!location && (p.type === 'transport' || p.type === 'both')) {
        const op = await Operator.findOne({ partner_id: p._id })
        location = op?.from || null
      }
      return {
        _id: p._id,
        business_name: p.business_name,
        type: p.type,
        location: location || 'Location not set',
        applicant_name: p.user_id?.name || 'Unknown',
        createdAt: p.createdAt,
      }
    }))

    res.status(200).json({
      success: true,
      kpis: {
        totalUsers,
        totalUsersChange: pctChange(newUsersCurrent, newUsersPrev),
        totalBookings,
        totalBookingsChange: pctChange(newBookingsCurrent, newBookingsPrev),
        monthlyRevenue: revenueCurrent,
        monthlyRevenueChange: pctChange(revenueCurrent, revenuePrev),
        totalPartners,
        totalPartnersChange: pctChange(newPartnersCurrent, newPartnersPrev),
      },
      bookingTrends,
      pendingPartners,
    })
  } catch (err) {
    next(err)
  }
}

exports.getBookings = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const skip = (page - 1) * limit

    const total = await Booking.countDocuments()
    const bookings = await Booking.find()
      .populate('user_id', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const formatted = bookings.map(b => ({
      _id: b._id,
      ref_code: b.ref_code,
      traveler_name: b.user_id?.name || 'Traveler',
      destination: b.hotel?.hotel_name || b.forward_legs?.[0]?.to || 'N/A',
      detail: b.hotel
        ? `${b.hotel.room_type || 'Room'} • ${b.hotel.nights || 0} ${b.hotel.nights === 1 ? 'Night' : 'Nights'}`
        : 'Transport Only',
      grand_total: b.pricing?.grand_total || 0,
      status: b.status,
      createdAt: b.createdAt,
    }))

    res.status(200).json({
      success: true,
      bookings: formatted,
      total,
      page,
      totalPages: Math.ceil(total / limit) || 1,
    })
  } catch (err) {
    next(err)
  }
}

exports.approvePartner = async (req, res, next) => {
  try {
    const partner = await Partner.findByIdAndUpdate(
      req.params.id,
      { is_approved: true },
      { new: true }
    )
    if (!partner) {
      return res.status(404).json({ success: false, message: 'Partner not found' })
    }
    res.status(200).json({ success: true, partner })
  } catch (err) {
    next(err)
  }
}
