import { useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { getBookingById, cancelBooking } from '../../api/booking.api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function CancelRefund() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [reason, setReason] = useState('Change in travel plans')
  const [details, setDetails] = useState('')

  const { data, isLoading } = useQuery({
    queryKey: ['booking', id],
    queryFn: () => getBookingById(id),
  })
  const booking = data?.booking

  const cancelMutation = useMutation({
    mutationFn: () => cancelBooking(id, { reason, details }),
    onSuccess: () => {
      toast.success('Booking cancelled. Refund will be processed per policy.')
      queryClient.invalidateQueries({ queryKey: ['myBookings'] })
      navigate('/dashboard/history')
    },
    onError: () => {
      toast.error('Could not cancel booking. Please try again.')
    },
  })

  const getTripTitle = (b) => {
    const from = b?.forward_legs?.[0]?.from
    const to = b?.forward_legs?.[0]?.to
    return from && to ? `${from} → ${to}` : b?.ref_code
  }

  const getDateRange = (b) => {
    const dep = b?.forward_legs?.[0]?.departure
    return dep ? dayjs(dep).format('MMM D, YYYY') : '—'
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <main className="flex-grow pt-32 px-6 max-w-5xl mx-auto w-full">
          <p className="text-on-surface-variant pt-12">Loading booking...</p>
        </main>
        <Footer />
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <main className="flex-grow pt-32 px-6 max-w-5xl mx-auto w-full text-center flex flex-col items-center justify-center">
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">
            Booking not found
          </h2>
          <button
            onClick={() => navigate('/dashboard/history')}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-bold text-sm"
          >
            Back to Booking History
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  if (booking?.status === 'CANCELLED') {
    return (
      <div className="min-h-screen flex flex-col bg-surface text-on-surface">
        <Navbar />
        <main className="flex-grow pt-32 px-6 max-w-5xl mx-auto w-full text-center flex flex-col items-center justify-center">
          <h2 className="text-2xl font-headline font-bold text-on-surface mb-4">
            This booking has already been cancelled.
          </h2>
          <button
            onClick={() => navigate('/dashboard/history')}
            className="px-6 py-2.5 bg-primary text-on-primary rounded-full font-bold text-sm"
          >
            Back to Booking History
          </button>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface selection:bg-primary-container">
      <Navbar />

      {/* Main Content Canvas */}
      <main className="flex-grow pt-32 pb-20 px-6 max-w-5xl mx-auto w-full">
        {/* Hero Header Section */}
        <header className="mb-12 text-center md:text-left">
          <Link
            to="/dashboard/history"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-semibold mb-6 hover:bg-surface-container-highest transition-colors"
          >
            <span className="material-symbols-outlined text-sm">arrow_back</span>
            Manage Bookings
          </Link>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-primary mb-4 font-headline animate-fade-in">
            Cancel Your Trip
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-body">
            We understand that plans change. Review your booking details and refund estimate below to
            proceed with the cancellation.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Booking & Reason */}
          <div className="lg:col-span-7 space-y-8">
            {/* Booking Details Card */}
            <section className="bg-surface-container-lowest rounded-lg p-8 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16"></div>
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                <div>
                  <span className="text-xs font-bold uppercase tracking-widest text-on-surface-variant opacity-60">
                    Booking Reference
                  </span>
                  <h3 className="text-2xl font-bold text-primary font-headline">
                    {booking.ref_code}
                  </h3>
                </div>
                <div className="px-4 py-2 rounded-xl bg-surface-container-low border border-outline-variant/10">
                  <span className="text-sm font-semibold text-primary capitalize">
                    Status: {booking.status?.toLowerCase()}
                  </span>
                </div>
              </div>
              <div className="flex items-start gap-6">
                <div className="w-24 h-24 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt={getTripTitle(booking)}
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ7zYburFxGSdDwv9igCvoyaUwYEmXBOUVrHqELujk8-yjP00eY1inYhSvp2bS0U8YG0WEJmYIA1SaVjoo_R9MnC4F9RvRneUjJ4f0Eb6JkjLvHqOvzATwCsGR7XIa7YgoAarGO9nrTwTnkQGip112rA6Wn2deypYM1ELURrvTfLNEXJ8zoX1x8GNevZpUg6UyLxvsyYcK8ds2KW3xDpnRFqrBFSRxLOgUp5zu7LLBwQIu2dT5ho_JAzTYZ7Fo0wEd1iCC4uI1bHs"
                  />
                </div>
                <div className="flex-grow">
                  <p className="text-sm font-medium text-on-surface-variant">Destination</p>
                  <h4 className="text-xl font-bold mb-2 font-headline">{getTripTitle(booking)}</h4>
                  <div className="flex flex-wrap gap-4 text-sm text-on-surface-variant">
                    <span className="flex items-center gap-1.5">
                      <span className="material-symbols-outlined text-base text-primary">
                        calendar_today
                      </span>
                      {getDateRange(booking)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* Reason Selection Section */}
            <section className="bg-surface-container-low rounded-lg p-8">
              <h3 className="text-xl font-bold text-primary mb-6 flex items-center gap-2 font-headline">
                <span className="material-symbols-outlined">help_center</span>
                Reason for Cancellation
              </h3>
              <div className="space-y-4">
                <label className="flex items-center p-4 bg-surface-container-lowest rounded-xl cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all">
                  <input
                    className="w-5 h-5 text-primary focus:ring-primary border-outline-variant"
                    name="reason"
                    type="radio"
                    checked={reason === 'Change in travel plans'}
                    onChange={() => setReason('Change in travel plans')}
                  />
                  <span className="ml-4 font-medium">Change in travel plans</span>
                </label>
                <label className="flex items-center p-4 bg-surface-container-lowest rounded-xl cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all">
                  <input
                    className="w-5 h-5 text-primary focus:ring-primary border-outline-variant"
                    name="reason"
                    type="radio"
                    checked={reason === 'Medical emergency or health issues'}
                    onChange={() => setReason('Medical emergency or health issues')}
                  />
                  <span className="ml-4 font-medium">Medical emergency or health issues</span>
                </label>
                <label className="flex items-center p-4 bg-surface-container-lowest rounded-xl cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all">
                  <input
                    className="w-5 h-5 text-primary focus:ring-primary border-outline-variant"
                    name="reason"
                    type="radio"
                    checked={reason === 'Flight/Transport delays elsewhere'}
                    onChange={() => setReason('Flight/Transport delays elsewhere')}
                  />
                  <span className="ml-4 font-medium">Flight/Transport delays elsewhere</span>
                </label>
                <label className="flex items-center p-4 bg-surface-container-lowest rounded-xl cursor-pointer border-2 border-transparent hover:border-primary/20 transition-all">
                  <input
                    className="w-5 h-5 text-primary focus:ring-primary border-outline-variant"
                    name="reason"
                    type="radio"
                    checked={reason === 'Found a better deal/alternative'}
                    onChange={() => setReason('Found a better deal/alternative')}
                  />
                  <span className="ml-4 font-medium">Found a better deal/alternative</span>
                </label>
                <textarea
                  value={details}
                  onChange={(e) => setDetails(e.target.value)}
                  className="w-full mt-2 bg-surface-container-lowest border-0 rounded-xl p-4 text-on-surface focus:ring-2 focus:ring-primary h-24 placeholder-on-surface-variant/50"
                  placeholder="Additional details (Optional)"
                />
              </div>
            </section>

            {/* Refund Terms Section */}
            <section className="bg-surface-container rounded-lg p-8">
              <h3 className="text-xl font-bold text-primary mb-4 flex items-center gap-2 font-headline">
                <span className="material-symbols-outlined">info</span>
                Refund Terms &amp; Timeline
              </h3>
              <ul className="space-y-4 text-on-surface-variant font-body">
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span>
                    The refund will be processed to your <strong>original payment method</strong> used during booking.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span>
                    A processing timeline of <strong>5-7 business days</strong> applies from the moment of confirmation.
                  </span>
                </li>
                <li className="flex gap-4">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                  <span>
                    Cancellations made less than 24 hours before travel are subject to a higher fee as per policy.
                  </span>
                </li>
              </ul>
            </section>
          </div>

          {/* Right Column: Sticky Summary & Actions */}
          <div className="lg:col-span-5 lg:sticky lg:top-32 space-y-6">
            {/* Refund Summary Card */}
            <div className="bg-surface-container-highest rounded-lg p-8 shadow-sm">
              <h3 className="text-xl font-bold text-primary mb-6 font-headline">Refund Summary</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center font-body">
                  <span className="text-on-surface-variant">Amount Paid</span>
                  <span className="font-bold">৳ {booking.pricing?.grand_total?.toLocaleString()}</span>
                </div>
                <div className="h-px bg-outline-variant/20 my-4"></div>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Your refund amount will be confirmed once cancellation is processed, per the policy terms
                  above.
                </p>
              </div>
              <div className="space-y-3">
                <button
                  onClick={() => cancelMutation.mutate()}
                  disabled={cancelMutation.isPending}
                  className="w-full py-4 rounded-full bg-gradient-to-br from-primary to-primary-dim text-on-primary font-headline font-extrabold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
                >
                  {cancelMutation.isPending ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
                <button
                  onClick={() => navigate('/dashboard/history')}
                  className="w-full py-4 rounded-full bg-surface-container-lowest text-primary font-headline font-extrabold border border-primary/10 hover:bg-surface-container-high transition-colors"
                >
                  Keep My Trip
                </button>
              </div>
            </div>

            {/* Support Anchor */}
            <div className="bg-surface-container-low rounded-lg p-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container">
                    support_agent
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold font-headline">Need help?</p>
                  <p className="text-xs text-on-surface-variant font-body">Our curator team is online.</p>
                </div>
              </div>
              <button
                onClick={() => toast('Live chat coming soon')}
                className="text-primary font-bold text-sm hover:underline font-headline"
              >
                Chat Now
              </button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
