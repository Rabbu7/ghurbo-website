import { useState, useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { myBookings } from '../../api/booking.api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function BookingHistory() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [filter, setFilter] = useState('all') // 'all' | 'upcoming' | 'completed' | 'cancelled'
  const [expandedId, setExpandedId] = useState(null)
  const [visibleCount, setVisibleCount] = useState(5)

  const { data, isLoading } = useQuery({
    queryKey: ['myBookings'],
    queryFn: myBookings,
  })

  const bookings = data?.bookings || []

  const isPastDeparture = (b) => {
    const dep = b.forward_legs?.[0]?.departure
    return dep ? dayjs(dep).isBefore(dayjs()) : false
  }

  // Categorize:
  //  upcoming  = CONFIRMED (future departure) OR PENDING
  //  completed = CONFIRMED (past departure)
  //  cancelled = CANCELLED
  const categorize = (b) => {
    if (b.status === 'CANCELLED') return 'cancelled'
    if (b.status === 'PENDING') return 'upcoming'
    if (b.status === 'CONFIRMED') return isPastDeparture(b) ? 'completed' : 'upcoming'
    return 'upcoming'
  }

  const filtered = useMemo(() => {
    if (filter === 'all') return bookings
    return bookings.filter(b => categorize(b) === filter)
  }, [bookings, filter])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  const getTripTitle = (b) => {
    const from = b.forward_legs?.[0]?.from
    const to = b.forward_legs?.[0]?.to
    if (from && to) return `${from} → ${to}`
    return b.ref_code
  }

  const getDateRange = (b) => {
    const ci = b.hotel?.check_in
    const co = b.hotel?.check_out
    const dep = b.forward_legs?.[0]?.departure
    if (ci && co) return `${dayjs(ci).format('MMM D')} - ${dayjs(co).format('MMM D, YYYY')}`
    if (dep) return dayjs(dep).format('MMM D, YYYY')
    return '—'
  }

  const handleDownloadTicket = () => {
    toast('Ticket download coming soon')
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-container">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-screen-2xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-2">
            <div className="bg-surface-container-low rounded-lg p-3 space-y-1">
              <Link
                to="/dashboard"
                className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">dashboard</span>
                Overview
              </Link>
              <button className="w-full flex items-center gap-4 px-6 py-4 rounded-xl bg-surface-container-lowest text-on-surface font-bold shadow-sm cursor-default">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  history
                </span>
                Booking History
              </button>
              <Link
                to="#"
                onClick={(e) => e.preventDefault()}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">favorite</span>
                Saved Spots
              </Link>
              <Link
                to="#"
                onClick={(e) => e.preventDefault()}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">payments</span>
                Transactions
              </Link>
              <Link
                to="#"
                onClick={(e) => e.preventDefault()}
                className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">settings</span>
                Settings
              </Link>
            </div>

            <div className="bg-tertiary-container/20 rounded-lg p-6 mt-6">
              <span className="material-symbols-outlined text-tertiary text-4xl mb-4">
                help_center
              </span>
              <h3 className="font-headline font-bold text-on-tertiary-container mb-2">Need Help?</h3>
              <p className="text-sm text-on-tertiary-container/80 mb-4">
                Our curators are available 24/7 for support.
              </p>
              <button className="text-tertiary font-bold hover:underline">Contact Support</button>
            </div>
          </aside>

          {/* Main Content Area */}
          <section className="lg:col-span-9 space-y-10">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
              <div>
                <h1 className="text-4xl font-headline font-extrabold tracking-tight text-on-surface mb-2">
                  Booking History
                </h1>
                <p className="text-on-surface-variant">
                  Manage your past and upcoming journeys across Bangladesh.
                </p>
              </div>

              {/* Filter Chips */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => {
                    setFilter('all')
                    setVisibleCount(5)
                  }}
                  className={`px-6 py-2.5 rounded-full font-headline font-bold text-sm whitespace-nowrap active:scale-95 transition-all ${
                    filter === 'all'
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest font-medium'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => {
                    setFilter('upcoming')
                    setVisibleCount(5)
                  }}
                  className={`px-6 py-2.5 rounded-full font-headline font-bold text-sm whitespace-nowrap active:scale-95 transition-all ${
                    filter === 'upcoming'
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest font-medium'
                  }`}
                >
                  Upcoming
                </button>
                <button
                  onClick={() => {
                    setFilter('completed')
                    setVisibleCount(5)
                  }}
                  className={`px-6 py-2.5 rounded-full font-headline font-bold text-sm whitespace-nowrap active:scale-95 transition-all ${
                    filter === 'completed'
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest font-medium'
                  }`}
                >
                  Completed
                </button>
                <button
                  onClick={() => {
                    setFilter('cancelled')
                    setVisibleCount(5)
                  }}
                  className={`px-6 py-2.5 rounded-full font-headline font-bold text-sm whitespace-nowrap active:scale-95 transition-all ${
                    filter === 'cancelled'
                      ? 'bg-primary text-on-primary shadow-md'
                      : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest font-medium'
                  }`}
                >
                  Cancelled
                </button>
              </div>
            </div>

            {/* Bookings List */}
            {isLoading ? (
              <p className="text-on-surface-variant">Loading your journeys...</p>
            ) : filtered.length === 0 ? (
              <div className="bg-surface-container-lowest rounded-lg p-12 text-center">
                <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                  luggage
                </span>
                <p className="mt-4 font-headline font-bold text-on-surface">
                  No {filter !== 'all' ? filter : ''} bookings found
                </p>
                <p className="text-sm text-on-surface-variant mt-1">
                  Time to plan your next trip.
                </p>
                <button
                  onClick={() => navigate('/')}
                  className="mt-6 px-6 py-2.5 bg-primary text-on-primary rounded-full font-bold text-sm"
                >
                  Search Trips
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {visible.map((b) => {
                  const status = categorize(b)

                  if (status === 'upcoming') {
                    const isPending = b.status === 'PENDING'
                    return (
                      <div
                        key={b._id}
                        className="bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-on-surface/5 transition-all duration-500 group"
                      >
                        <div className="w-full md:w-56 h-40 flex-shrink-0 overflow-hidden rounded-md relative">
                          <img
                            alt={getTripTitle(b)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCdVJzmail5NTI8CKOANJZEZt2cZwhOrB9XJvAmsslnpV7SYtltZTi-odbhsPDBtLBfOTb0P2DoU0uKHAvTbno6vx_V0R8CY0G4pufopymTZddnyeQ6c5q-aWjsh7XdU-bjWLCG9-FVmQkejl9CZLFFWPSisntIc6ENZYVMu6rAr-OWLyBP6tDKEpL8Yfci2tEHZqwnmyYXNjP_3o4jXGnLWVOUwwOoV2FHiP_lh5kxQnatS1-tfrdsBRY1Je1c3PHdE6AA0ycm5X4"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-wider">
                            {isPending ? (
                              <span className="text-tertiary">Pending Payment</span>
                            ) : (
                              <span className="text-primary">Upcoming</span>
                            )}
                          </div>
                        </div>
                        <div className="flex-grow flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-headline font-extrabold text-on-surface">
                                {getTripTitle(b)}
                              </h3>
                              <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest">
                                  Booking ID
                                </p>
                                <p className="font-mono text-sm font-bold text-on-surface-variant">
                                  #{b.ref_code}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-on-surface-variant">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-primary">
                                  calendar_today
                                </span>
                                <span className="font-medium">{getDateRange(b)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-primary">
                                  bed
                                </span>
                                <span className="font-medium">
                                  {b.hotel ? b.hotel.room_type : 'Own Arrangement'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="h-px bg-surface-container-low mb-4" />
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2">
                              <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60">
                                  {isPending ? 'Amount Due' : 'Total Paid'}
                                </p>
                                <p className="text-2xl font-headline font-black text-on-surface">
                                  ৳ {b.pricing?.grand_total?.toLocaleString()}
                                </p>
                              </div>
                              <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                  onClick={() => navigate(`/dashboard/cancel/${b._id}`)}
                                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-sm hover:bg-error-container hover:text-on-error-container transition-colors active:scale-95"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() =>
                                    setExpandedId(expandedId === b._id ? null : b._id)
                                  }
                                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-sm hover:bg-surface-container-highest transition-colors active:scale-95"
                                >
                                  {expandedId === b._id ? 'Hide Details' : 'View Details'}
                                </button>
                                {isPending ? (
                                  <button
                                    onClick={() => navigate('/booking/payment')}
                                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                                  >
                                    Pay Now
                                  </button>
                                ) : (
                                  <button
                                    onClick={handleDownloadTicket}
                                    className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-primary text-on-primary font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                                  >
                                    Download Ticket
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>

                          {expandedId === b._id && renderExpandedPanel(b)}
                        </div>
                      </div>
                    )
                  }

                  if (status === 'completed') {
                    return (
                      <div
                        key={b._id}
                        className="bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-on-surface/5 transition-all duration-500 group"
                      >
                        <div className="w-full md:w-56 h-40 flex-shrink-0 overflow-hidden rounded-md relative">
                          <img
                            alt={getTripTitle(b)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeFjM5SAkMwos34EPYwTMs8INwf-DLC7OfDRFelK05ovge9BwQMGw88nCRAaeLjtjbHnLZpRhWuqL1yLV0mnpHsBsQzwcEoSzM1dHJb77gLMJS9qOwCY-FGJaJbAZWl63T1xPtAfcxQGElAtAWbNHb9G4IMhqB2EFVFmNp-WH3x3LP8RjBfbLA5IFfRG31giJGQbFFTMasFSzghxSoIYmz4_Sz30Wc4Y_djyei2wW8Zd6Rd1K9tODaQVejD523wuPxCRZJIfvSjxA"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 bg-primary-container text-on-primary-container rounded-full text-xs font-bold uppercase tracking-wider">
                            Completed
                          </div>
                        </div>
                        <div className="flex-grow flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-headline font-extrabold text-on-surface">
                                {getTripTitle(b)}
                              </h3>
                              <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest">
                                  Booking ID
                                </p>
                                <p className="font-mono text-sm font-bold text-on-surface-variant">
                                  #{b.ref_code}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-on-surface-variant">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-primary">
                                  calendar_today
                                </span>
                                <span className="font-medium">{getDateRange(b)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-primary">
                                  bed
                                </span>
                                <span className="font-medium">
                                  {b.hotel ? b.hotel.room_type : 'Own Arrangement'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="h-px bg-surface-container-low mb-4" />
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2">
                              <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-on-surface-variant/60">
                                  Total Paid
                                </p>
                                <p className="text-2xl font-headline font-black text-on-surface">
                                  ৳ {b.pricing?.grand_total?.toLocaleString()}
                                </p>
                              </div>
                              <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                  onClick={() =>
                                    setExpandedId(expandedId === b._id ? null : b._id)
                                  }
                                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-sm hover:bg-surface-container-highest transition-colors active:scale-95"
                                >
                                  {expandedId === b._id ? 'Hide Details' : 'View Details'}
                                </button>
                                <button
                                  onClick={() => navigate('/')}
                                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-secondary text-on-secondary font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                                >
                                  Rebook
                                </button>
                              </div>
                            </div>
                          </div>

                          {expandedId === b._id && renderExpandedPanel(b)}
                        </div>
                      </div>
                    )
                  }

                  if (status === 'cancelled') {
                    return (
                      <div
                        key={b._id}
                        className="bg-surface-container-low rounded-lg p-6 flex flex-col md:flex-row gap-6 border-l-4 border-error/40 hover:shadow-xl hover:shadow-on-surface/5 transition-all duration-500 group grayscale hover:grayscale-0"
                      >
                        <div className="w-full md:w-56 h-40 flex-shrink-0 overflow-hidden rounded-md relative">
                          <img
                            alt={getTripTitle(b)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuCFNZVLBhOVRZDD6wOtVRtk1v0HgpWyItjItNtlCF2tzF2BE7lLu6dpf04W85wi2ZsrF1fsGwc-D7bu03TNWNXFTdWtTGEsVUnROQM_0IJGkdGc14eedM1j_2JlvlP2H01s-M4ZP3zr5aj2M4siT40KHEvYR4TmT2Od7tKkHyXQhtZAAr-zQDFSzburdZ_Zh4nCDAvgKso-pQ31Q7AJba34StNepswukbiAvLLTmhFFRhd2Dno1CCarVKxaIHIWodI1v4K_tjod3rA"
                          />
                          <div className="absolute top-3 left-3 px-3 py-1 bg-error-container text-on-error-container rounded-full text-xs font-bold uppercase tracking-wider">
                            Cancelled
                          </div>
                        </div>
                        <div className="flex-grow flex flex-col justify-between py-1">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-headline font-extrabold text-on-surface">
                                {getTripTitle(b)}
                              </h3>
                              <div className="text-right">
                                <p className="text-[10px] uppercase font-bold text-on-surface-variant/60 tracking-widest">
                                  Booking ID
                                </p>
                                <p className="font-mono text-sm font-bold text-on-surface-variant">
                                  #{b.ref_code}
                                </p>
                              </div>
                            </div>
                            <div className="flex flex-wrap gap-y-2 gap-x-6 text-sm text-on-surface-variant">
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-error">
                                  event_busy
                                </span>
                                <span className="font-medium">{getDateRange(b)}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-lg text-primary">
                                  bed
                                </span>
                                <span className="font-medium">
                                  {b.hotel ? b.hotel.room_type : 'Own Arrangement'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div>
                            <div className="h-px bg-surface-container-low mb-4" />
                            <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-2">
                              <div>
                                <p className="text-[10px] uppercase font-bold tracking-widest text-error/60">
                                  Booking Cancelled
                                </p>
                                <p className="text-lg font-bold text-on-surface">
                                  ৳ {b.pricing?.grand_total?.toLocaleString()}{' '}
                                  <span className="text-sm font-normal text-on-surface-variant">
                                    (original total)
                                  </span>
                                </p>
                              </div>
                              <div className="flex gap-3 w-full sm:w-auto">
                                <button
                                  onClick={() =>
                                    setExpandedId(expandedId === b._id ? null : b._id)
                                  }
                                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-sm hover:bg-surface-container-highest transition-colors active:scale-95"
                                >
                                  {expandedId === b._id ? 'Hide Details' : 'View Details'}
                                </button>
                                <button
                                  onClick={() => navigate(`/dashboard/cancel/${b._id}`)}
                                  className="flex-1 sm:flex-none px-6 py-2.5 rounded-full bg-surface-container-highest text-on-surface-variant font-bold text-sm hover:bg-surface-container transition-colors active:scale-95"
                                >
                                  Refund Info
                                </button>
                              </div>
                            </div>
                          </div>

                          {expandedId === b._id && renderExpandedPanel(b)}
                        </div>
                      </div>
                    )
                  }

                  return null
                })}
              </div>
            )}

            {/* View Older Journeys */}
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={() => setVisibleCount((v) => v + 5)}
                  className="px-8 py-3 rounded-full bg-surface-container-high text-on-primary-container font-headline font-extrabold hover:bg-surface-container-highest transition-all flex items-center gap-2 group shadow-sm"
                >
                  View Older Journeys
                  <span className="material-symbols-outlined group-hover:translate-y-1 transition-transform">
                    keyboard_arrow_down
                  </span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}

function renderExpandedPanel(b) {
  return (
    <div className="bg-surface-container-low rounded-md p-4 mt-4 text-sm text-on-surface-variant space-y-3">
      {/* Outbound legs */}
      {b.forward_legs && b.forward_legs.length > 0 && (
        <div>
          <h4 className="font-bold text-on-surface mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">flight_takeoff</span>
            Outbound Journey
          </h4>
          {b.forward_legs.map((leg, idx) => (
            <div key={idx} className="ml-5">
              <span className="capitalize font-semibold">{leg.mode}</span>:{' '}
              {leg.operators?.[0]?.name || 'Operator'} ({leg.from} → {leg.to}) · Dep:{' '}
              {dayjs(leg.departure).format('MMM DD, YYYY HH:mm')}
            </div>
          ))}
        </div>
      )}

      {/* Return legs */}
      {b.return_legs && b.return_legs.length > 0 && (
        <div>
          <h4 className="font-bold text-on-surface mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">flight_land</span>
            Return Journey
          </h4>
          {b.return_legs.map((leg, idx) => (
            <div key={idx} className="ml-5">
              <span className="capitalize font-semibold">{leg.mode}</span>:{' '}
              {leg.operators?.[0]?.name || 'Operator'} ({leg.from} → {leg.to}) · Dep:{' '}
              {dayjs(leg.departure).format('MMM DD, YYYY HH:mm')}
            </div>
          ))}
        </div>
      )}

      {/* Hotel accommodation */}
      {b.hotel && b.hotel.hotel_name && (
        <div>
          <h4 className="font-bold text-on-surface mb-1 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-base">hotel</span>
            Hotel Accommodation
          </h4>
          <div className="ml-5">
            <span className="font-semibold">{b.hotel.hotel_name}</span> ({b.hotel.room_type})
            <br />
            Check-in: {dayjs(b.hotel.check_in).format('MMM DD, YYYY')} · Check-out:{' '}
            {dayjs(b.hotel.check_out).format('MMM DD, YYYY')} ({b.hotel.nights} nights)
          </div>
        </div>
      )}

      {/* Pricing breakdown */}
      <div>
        <h4 className="font-bold text-on-surface mb-1 flex items-center gap-1.5">
          <span className="material-symbols-outlined text-base">receipt_long</span>
          Pricing Breakdown
        </h4>
        <div className="ml-5 space-y-1">
          {b.pricing?.forward_transport > 0 && (
            <div className="flex justify-between max-w-xs">
              <span>Forward Transport:</span>
              <span>৳ {b.pricing.forward_transport.toLocaleString()}</span>
            </div>
          )}
          {b.pricing?.hotel_total > 0 && (
            <div className="flex justify-between max-w-xs">
              <span>Hotel Stay:</span>
              <span>৳ {b.pricing.hotel_total.toLocaleString()}</span>
            </div>
          )}
          {b.pricing?.return_transport > 0 && (
            <div className="flex justify-between max-w-xs">
              <span>Return Transport:</span>
              <span>৳ {b.pricing.return_transport.toLocaleString()}</span>
            </div>
          )}
          <div className="flex justify-between max-w-xs font-bold text-on-surface bg-surface-container-high rounded-md px-2 py-1.5 mt-1">
            <span>Grand Total:</span>
            <span>৳ {b.pricing?.grand_total?.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
