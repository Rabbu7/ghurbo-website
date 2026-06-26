import { useMemo } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useAuth } from '../../context/AuthContext'
import { myBookings } from '../../api/booking.api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function UserDashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const { data, isLoading } = useQuery({
    queryKey: ['myBookings'],
    queryFn: myBookings,
  })

  const bookings = data?.bookings || []

  // Current = CONFIRMED or PENDING (upcoming)
  const currentBookings = useMemo(() => {
    return bookings.filter(b => {
      if (b.status === 'PENDING') return true
      if (b.status === 'CONFIRMED') {
        const dep = b.forward_legs?.[0]?.departure
        if (dep && dayjs(dep).isBefore(dayjs())) {
          return false // completed, goes to history
        }
        return true
      }
      return false
    })
  }, [bookings])

  // History = CANCELLED + Completed (CONFIRMED in the past)
  const pastBookings = useMemo(() => {
    return bookings.filter(b => {
      if (b.status === 'CANCELLED') return true
      if (b.status === 'CONFIRMED') {
        const dep = b.forward_legs?.[0]?.departure
        if (dep && dayjs(dep).isBefore(dayjs())) {
          return true // completed
        }
      }
      return false
    })
  }, [bookings])

  // Derive a human-readable trip title from booking legs
  const getTripTitle = (booking) => {
    const from = booking.forward_legs?.[0]?.from
    const to   = booking.forward_legs?.[0]?.to
    if (from && to) return `${from} → ${to}`
    return booking.ref_code
  }

  // Derive date range string
  const getDateRange = (booking) => {
    const dep = booking.forward_legs?.[0]?.departure
    const ci  = booking.hotel?.check_in
    const co  = booking.hotel?.check_out
    if (ci && co) return `${dayjs(ci).format('MMM DD')} – ${dayjs(co).format('MMM DD')}`
    if (dep)      return dayjs(dep).format('MMM DD, YYYY')
    return '—'
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-container">
      <Navbar />

      <main className="flex-grow pt-28 pb-20 px-6 max-w-screen-2xl mx-auto w-full">
        {/* Welcome & Profile Summary Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-12">
          {/* Profile Info Card */}
          <div className="md:col-span-8 bg-surface-container-lowest rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary-container/30 transition-colors duration-500"></div>
            <div className="relative w-32 h-32 flex-shrink-0">
              <img
                alt="User Profile"
                className="w-full h-full object-cover rounded-xl shadow-sm border-4 border-surface-container-low"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzlB2jr2yoCB8M_sgRCyNrvXk98WTLFGZpXByUGiBKqyfHKhkTrg7uylEcAQTl0RE1QZPNLKhczrQGadARAfGH5-b1Foxndsc_nlF9Uq-vjvj44yaoi2SB3SVKcGRc0fGz_ccbUy8VukTIehaHccEGF2CGbqHI-qIY8BL1keXX-KvO1fwL6hdUc7RdFA70bXA-gi1bQuUvzgJ0qyfeykeeSzaBJAg1MCdmogw0zgjCFq4rU6-T0hDsHZCWEPy4kJE4htj_qGKYNBk"
              />
            </div>
            <div className="flex-grow space-y-4 text-center md:text-left z-10">
              <div>
                <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">
                  Hello, {user?.name || 'Guest'}
                </h1>
                <p className="text-on-surface-variant font-medium mt-1">
                  Adventurer & River Guide Enthusiast
                </p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-sm font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>
                    stars
                  </span>
                  Elite Member
                </span>
                <span className="px-4 py-1.5 bg-surface-container-high text-on-surface-variant rounded-full text-sm font-semibold">
                  {bookings.length} Journeys
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 z-10">
              <Link
                className="flex items-center gap-2 text-primary font-bold hover:gap-3 transition-all underline-offset-4 hover:underline"
                to="/profile"
              >
                Profile Settings
                <span className="material-symbols-outlined">arrow_forward</span>
              </Link>
            </div>
          </div>

          {/* Booking Stats Card */}
          <div className="md:col-span-4 bg-primary-container rounded-xl p-8 flex flex-col justify-between relative overflow-hidden">
            <div className="z-10">
              <p className="text-on-primary-container/70 font-headline font-bold uppercase tracking-widest text-xs mb-2">
                Your Journeys
              </p>
              <h2 className="text-4xl font-headline font-black text-on-primary-container">
                {bookings.length}
              </h2>
              <p className="text-on-primary-container/60 text-sm mt-1">
                {currentBookings.length} active · {pastBookings.length} cancelled
              </p>
            </div>
            <div className="mt-8 z-10">
              <button
                onClick={() => navigate('/')}
                className="w-full bg-primary text-on-primary py-4 rounded-full font-headline font-extrabold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-transform"
              >
                Plan New Trip
              </button>
            </div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-on-primary-container/5 rounded-full blur-2xl"></div>
          </div>
        </section>

        {/* Main Dashboard Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-2">
            <div className="bg-surface-container-low rounded-lg p-3 space-y-1">
              <button className="w-full flex items-center gap-4 px-6 py-4 rounded-xl bg-surface-container-lowest text-on-surface font-bold shadow-sm cursor-default">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
                  dashboard
                </span>
                Overview
              </button>
              <Link
                to="/dashboard/history"
                className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">history</span>
                Booking History
              </Link>
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
                to="/profile"
                className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors"
              >
                <span className="material-symbols-outlined">person</span>
                Profile
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
              <h3 className="font-headline font-bold text-on-tertiary-container mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-on-tertiary-container/80 mb-4">
                Our curators are available 24/7 for support.
              </p>
              <button className="text-tertiary font-bold hover:underline">
                Contact Support
              </button>
            </div>
          </aside>

          {/* Dashboard Body */}
          <div className="lg:col-span-9 space-y-10">
            {/* Active Bookings Section */}
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-headline font-black tracking-tight flex items-center gap-3">
                  Current Bookings
                  <span className="bg-primary-container text-on-primary-container text-xs px-2 py-1 rounded-md">
                    {currentBookings.length} Active
                  </span>
                </h2>
              </div>

              {isLoading ? (
                <p className="text-on-surface-variant">Loading bookings...</p>
              ) : currentBookings.length === 0 ? (
                <div className="bg-surface-container-lowest rounded-lg p-12 text-center">
                  <span className="material-symbols-outlined text-4xl text-on-surface-variant">
                    luggage
                  </span>
                  <p className="mt-4 font-headline font-bold text-on-surface">
                    No active bookings
                  </p>
                  <p className="text-sm text-on-surface-variant mt-1">
                    Ready for your next adventure?
                  </p>
                  <button
                    onClick={() => navigate('/')}
                    className="mt-6 px-6 py-2.5 bg-primary text-on-primary rounded-full font-bold text-sm"
                  >
                    Search Trips
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {currentBookings.map((b) => {
                    const isConfirmed = b.status === 'CONFIRMED'
                    return (
                      <div
                        key={b._id}
                        className="bg-surface-container-lowest rounded-lg p-6 flex flex-col md:flex-row gap-6 hover:shadow-xl hover:shadow-on-surface/5 transition-all duration-500 group"
                      >
                        <div className="w-full md:w-56 h-40 flex-shrink-0 overflow-hidden rounded-md relative">
                          <img
                            alt={getTripTitle(b)}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBpHekN2d0_H6FwjylBxVetuRMokDLAcM2_ICtA99SOdbAV2TkSGThoh5ioP8P3rqlt5V8kDQMlfG5CVeTL_F-u9xAfLpcXpCiZg8jHQ2E_ME8f3GMJdKHWeMS_dtkJEWrY3R8y8RzlxpsA2tA1DPVoowvxBTbzfDdFd-LBug6cMEfPsVCFU84UmP3AkhQ34BgrwJPKxtuMDvR0lG47LBQGuJFj75pU4VUOoNRCQH4BQMSWJP6nyQRlAN730F6OwJ2FJQozSLDRxPU"
                          />
                          <div
                            className={`absolute top-3 left-3 px-3 py-1 backdrop-blur-md rounded-full text-xs font-bold ${
                              isConfirmed
                                ? 'bg-white/90 text-primary'
                                : 'bg-tertiary-container/90 text-on-tertiary-container'
                            }`}
                          >
                            {isConfirmed ? 'Upcoming' : 'Pending Payment'}
                          </div>
                        </div>
                        <div className="flex-grow flex flex-col justify-between">
                          <div>
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="text-xl font-headline font-extrabold text-on-surface">
                                {getTripTitle(b)}
                              </h3>
                              <div className="text-right">
                                <p className="text-xs uppercase font-bold text-on-surface-variant/60 tracking-widest">
                                  Booking ID
                                </p>
                                <p className="font-mono text-sm font-bold">
                                  #{b.ref_code}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-4 text-on-surface-variant mb-4">
                              <div className="flex items-center gap-1.5 text-sm font-medium">
                                <span className="material-symbols-outlined text-base">
                                  calendar_today
                                </span>
                                {getDateRange(b)}
                              </div>
                              <div className="flex items-center gap-1.5 text-sm font-medium">
                                <span className="material-symbols-outlined text-base">
                                  bed
                                </span>
                                {b.hotel ? b.hotel.room_type : 'Own Arrangement'}
                              </div>
                            </div>
                          </div>
                          <div>
                            <div className="h-px bg-surface-container-low mb-4" />
                            <div className="flex flex-wrap items-center justify-between pt-4 mt-2 gap-4">
                              <div className="flex items-center gap-2">
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    isConfirmed ? 'bg-primary animate-pulse' : 'bg-tertiary'
                                  }`}
                                ></div>
                                <span
                                  className={`text-sm font-bold ${
                                    isConfirmed ? 'text-primary' : 'text-tertiary'
                                  }`}
                                >
                                  {isConfirmed
                                    ? 'Payment: Confirmed'
                                    : `Payment: Pending (৳${b.pricing?.grand_total?.toLocaleString()})`}
                                </span>
                              </div>
                              <div className="flex gap-3">
                                <button
                                  onClick={() => navigate(`/dashboard/cancel/${b._id}`)}
                                  className="px-5 py-2 rounded-full bg-surface-container-high text-on-surface-variant font-bold text-sm hover:bg-surface-container-highest transition-colors active:scale-95"
                                >
                                  Cancel Booking
                                </button>
                                {isConfirmed ? (
                                  <button
                                    onClick={() => navigate('/dashboard/history')}
                                    className="px-5 py-2 rounded-full bg-primary text-on-primary font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                                  >
                                    View Details
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => navigate('/booking/payment')}
                                    className="px-5 py-2 rounded-full bg-primary text-on-primary font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95"
                                  >
                                    Pay Now
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Past History */}
            {!isLoading && pastBookings.length > 0 && (
              <div>
                <h2 className="text-xl font-headline font-black tracking-tight mb-6">
                  Recent History
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {pastBookings.map((b) => {
                    const isCancelled = b.status === 'CANCELLED'
                    return (
                      <div
                        key={b._id}
                        className="bg-surface-container-low rounded-lg p-5 hover:bg-surface-container transition-colors duration-300 flex flex-col justify-between min-h-[160px]"
                      >
                        <div>
                          <p className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1">
                            {dayjs(b.createdAt).format('MMMM YYYY')}
                          </p>
                          <h4 className="font-headline font-bold text-on-surface mb-3">
                            {getTripTitle(b)}
                          </h4>
                        </div>
                        <div className="flex justify-between items-center">
                          {isCancelled ? (
                            <span className="text-sm font-semibold text-tertiary flex items-center gap-1">
                              <span className="material-symbols-outlined text-sm">cancel</span>
                              Cancelled
                            </span>
                          ) : (
                            <span className="text-sm font-semibold text-on-surface-variant flex items-center gap-1">
                              <span
                                className="material-symbols-outlined text-sm"
                                style={{ fontVariationSettings: "'FILL' 1" }}
                              >
                                check_circle
                              </span>
                              Completed
                            </span>
                          )}
                          <button
                            onClick={() => navigate('/')}
                            className="text-primary font-bold text-sm hover:underline"
                          >
                            Rebook
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
