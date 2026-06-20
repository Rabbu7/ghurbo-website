const Partner = require('../models/Partner')
const Operator = require('../models/Operator')
const Hotel = require('../models/Hotel')
const Booking = require('../models/Booking')

// POST /api/partners/apply
exports.apply = async (req, res, next) => {
  try {
    const existing = await Partner.findOne({ user_id: req.user.id })
    if (existing) {
      return res.status(400).json({ success: false, message: 'Partner application already exists' })
    }
    const { business_name, type, contact_info } = req.body
    const partner = await Partner.create({
      user_id: req.user.id,
      business_name,
      type,
      contact_info,
    })
    return res.status(201).json({ success: true, partner })
  } catch (err) {
    next(err)
  }
}

// GET /api/partners/dashboard
exports.dashboard = async (req, res, next) => {
  try {
    const partner = await Partner.findOne({ user_id: req.user.id })
    if (!partner) {
      return res.status(404).json({ success: false, message: 'No partner profile found' })
    }

    const operators = partner.type !== 'hotel'
      ? await Operator.find({ partner_id: partner._id })
      : []
    const hotels = partner.type !== 'transport'
      ? await Hotel.find({ partner_id: partner._id })
      : []

    let stats = null
    let recentBookings = []
    let transportStats = null
    let recentTicketSales = []

    if (partner.type === 'hotel' || partner.type === 'both') {
      const hotelIds = hotels.map(h => h._id)

      const allHotelBookings = await Booking.find({
        'hotel.hotel_id': { $in: hotelIds },
      })
        .populate('user_id', 'name')
        .sort({ createdAt: -1 })

      const confirmedBookings = allHotelBookings.filter(b => b.status === 'CONFIRMED')

      const totalRoomCapacity = hotels.reduce(
        (sum, h) => sum + h.rooms.reduce((rSum, r) => rSum + (r.total_rooms || 0), 0),
        0
      )

      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)

      const occupiedToday = confirmedBookings
        .filter(b => b.hotel?.check_in < tomorrow && b.hotel?.check_out > today)
        .reduce((sum, b) => sum + (b.hotel?.room_count || 1), 0)

      const checkInsToday = confirmedBookings.filter(b => {
        const ci = new Date(b.hotel?.check_in)
        return ci >= today && ci < tomorrow
      }).length

      const totalRevenue = confirmedBookings.reduce(
        (sum, b) => sum + (b.hotel?.total_price || 0), 0
      )

      const avgDailyRate = confirmedBookings.length
        ? Math.round(
            confirmedBookings.reduce((sum, b) => sum + (b.hotel?.price_per_night || 0), 0) /
            confirmedBookings.length
          )
        : 0

      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
      const revenueByDay = []
      for (let i = 0; i < 30; i++) {
        const day = new Date(thirtyDaysAgo)
        day.setDate(day.getDate() + i)
        const nextDay = new Date(day)
        nextDay.setDate(nextDay.getDate() + 1)
        const dayTotal = confirmedBookings
          .filter(b => b.createdAt >= day && b.createdAt < nextDay)
          .reduce((sum, b) => sum + (b.hotel?.total_price || 0), 0)
        revenueByDay.push({ date: day.toISOString().slice(0, 10), amount: dayTotal })
      }

      stats = {
        totalHotels: hotels.length,
        totalRoomCapacity,
        roomsAvailableToday: Math.max(totalRoomCapacity - occupiedToday, 0),
        occupancyRate: totalRoomCapacity
          ? Math.round((occupiedToday / totalRoomCapacity) * 100)
          : 0,
        checkInsToday,
        totalRevenue,
        avgDailyRate,
        revenueByDay,
      }

      recentBookings = allHotelBookings.slice(0, 10).map(b => ({
        _id: b._id,
        ref_code: b.ref_code,
        status: b.status,
        guest_name: b.user_id?.name || 'Guest',
        nights: b.hotel?.nights,
        check_in: b.hotel?.check_in,
        check_out: b.hotel?.check_out,
        total_price: b.hotel?.total_price,
      }))
    }

    if (partner.type === 'transport' || partner.type === 'both') {
      const operatorIds = operators.map(o => o._id)
      const operatorIdSet = new Set(operatorIds.map(String))

      const allTransportBookings = await Booking.find({
        $or: [
          { 'forward_legs.operator_id': { $in: operatorIds } },
          { 'return_legs.operator_id': { $in: operatorIds } },
        ],
      })
        .populate('user_id', 'name')
        .sort({ createdAt: -1 })

      const ticketSales = []
      for (const b of allTransportBookings) {
        const allLegs = [...(b.forward_legs || []), ...(b.return_legs || [])]
        for (const leg of allLegs) {
          if (leg.operator_id && operatorIdSet.has(String(leg.operator_id))) {
            ticketSales.push({
              booking_id: b._id,
              ref_code: b.ref_code,
              status: b.status,
              createdAt: b.createdAt,
              passenger_name: b.user_id?.name || 'Passenger',
              from: leg.from,
              to: leg.to,
              mode: leg.mode,
              operator_id: leg.operator_id,
              operator_name: leg.operator_name,
              seat_type: leg.seat_type,
              seat_numbers: leg.seat_numbers || [],
              departure: leg.departure,
              price: leg.price || 0,
            })
          }
        }
      }

      const confirmedSales = ticketSales.filter(t => t.status === 'CONFIRMED')

      const startOfDay = (d) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x }
      const today = startOfDay(new Date())
      const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1)
      const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1)

      const todayRevenue = confirmedSales
        .filter(t => t.createdAt >= today && t.createdAt < tomorrow)
        .reduce((sum, t) => sum + t.price, 0)

      const yesterdayRevenue = confirmedSales
        .filter(t => t.createdAt >= yesterday && t.createdAt < today)
        .reduce((sum, t) => sum + t.price, 0)

      const revenueChangePercent = yesterdayRevenue > 0
        ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
        : null

      const thirtyDaysAgo = new Date(today)
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 29)
      const revenueByDay = []
      for (let i = 0; i < 30; i++) {
        const day = new Date(thirtyDaysAgo)
        day.setDate(day.getDate() + i)
        const nextDay = new Date(day)
        nextDay.setDate(nextDay.getDate() + 1)
        const dayTotal = confirmedSales
          .filter(t => t.createdAt >= day && t.createdAt < nextDay)
          .reduce((sum, t) => sum + t.price, 0)
        revenueByDay.push({
          date: day.toISOString().slice(0, 10),
          amount: dayTotal,
          isToday: day.getTime() === today.getTime(),
        })
      }

      const now = new Date()
      const upcoming = confirmedSales
        .filter(t => t.departure && new Date(t.departure) > now)
        .sort((a, b) => new Date(a.departure) - new Date(b.departure))

      let nextDeparture = null
      if (upcoming.length) {
        const next = upcoming[0]
        const operator = operators.find(o => String(o._id) === String(next.operator_id))
        const seatType = operator?.seat_types?.find(s => s.type === next.seat_type)
        const totalSeats = seatType?.total_seats || 0
        const bookedSeats = confirmedSales
          .filter(t =>
            String(t.operator_id) === String(next.operator_id) &&
            t.seat_type === next.seat_type &&
            t.departure && new Date(t.departure).getTime() === new Date(next.departure).getTime()
          )
          .reduce((sum, t) => sum + (t.seat_numbers?.length || 1), 0)

        nextDeparture = {
          operator_name: next.operator_name,
          from: next.from,
          to: next.to,
          departure: next.departure,
          total_seats: totalSeats,
          booked_seats: Math.min(bookedSeats, totalSeats || bookedSeats),
          available_seats: Math.max(totalSeats - bookedSeats, 0),
        }
      }

      const routeCounts = {}
      confirmedSales.forEach(t => {
        const key = `${t.from} → ${t.to}`
        routeCounts[key] = (routeCounts[key] || 0) + 1
      })
      const busiestEntry = Object.entries(routeCounts).sort((a, b) => b[1] - a[1])[0]
      const busiestRoute = busiestEntry ? { route: busiestEntry[0], count: busiestEntry[1] } : null

      transportStats = {
        totalRoutes: operators.length,
        todayRevenue,
        yesterdayRevenue,
        revenueChangePercent,
        revenueByDay,
        nextDeparture,
        busiestRoute,
      }

      recentTicketSales = ticketSales.slice(0, 10)
    }

    return res.status(200).json({
      success: true,
      partner,
      operators,
      hotels,
      stats,
      recentBookings,
      transportStats,
      recentTicketSales,
    })
  } catch (err) {
    next(err)
  }
}

// POST /api/partners/operators
exports.addOperator = async (req, res, next) => {
  try {
    const partner = await Partner.findOne({ user_id: req.user.id })
    if (!partner || (partner.type !== 'transport' && partner.type !== 'both')) {
      return res.status(403).json({ success: false, message: 'Not authorized to add transport routes' })
    }
    if (!partner.is_approved) {
      return res.status(403).json({ success: false, message: 'Partner account not yet approved' })
    }
    const operator = await Operator.create({ ...req.body, partner_id: partner._id })
    return res.status(201).json({ success: true, operator })
  } catch (err) {
    next(err)
  }
}

// PUT /api/partners/operators/:id
exports.updateOperator = async (req, res, next) => {
  try {
    const partner = await Partner.findOne({ user_id: req.user.id })
    const operator = await Operator.findById(req.params.id)
    if (!operator || !partner || String(operator.partner_id) !== String(partner._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to edit this route' })
    }
    Object.assign(operator, req.body)
    await operator.save()
    return res.status(200).json({ success: true, operator })
  } catch (err) {
    next(err)
  }
}
