import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { useQuery } from '@tanstack/react-query'
import { useBooking } from '../../context/BookingContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { getTicket } from '../../api/booking.api'

export default function Confirmation() {
  const navigate = useNavigate()
  const { searchParams, selectedForwardLeg, selectedReturnLeg, selectedHotel, pricing, bookingId, refCode } = useBooking()
  const isRoundTrip = searchParams?.tripType === 'round_trip'

  const { data: ticketData, isLoading: ticketLoading } = useQuery({
    queryKey: ['ticket', bookingId],
    queryFn: () => getTicket(bookingId),
    enabled: Boolean(bookingId),
  })
  const ticket = ticketData?.ticket

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'train': return 'train'
      case 'ship':
      case 'launch': return 'directions_boat'
      case 'bus':
      default: return 'directions_bus'
    }
  }

  const handleAddToCalendar = () => {
    const start = dayjs(searchParams?.date).format('YYYYMMDD')
    const end = dayjs(searchParams?.returnDate || searchParams?.date).add(1, 'day').format('YYYYMMDD')
    const text = encodeURIComponent(`GHURBO Trip: ${searchParams?.origin} to ${searchParams?.destination}`)
    const details = encodeURIComponent(`Booking Reference: ${refCode}`)
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${start}/${end}&details=${details}`
    window.open(url, '_blank')
  }

  if (!selectedForwardLeg || !bookingId) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
        <Navbar />
        <main className="pt-24 pb-12 px-6 max-w-7xl mx-auto flex-grow flex items-center justify-center">
          <div className="text-center py-20 text-on-surface-variant">
            No trip selected yet.
            <button onClick={() => navigate('/search')} className="ml-2 text-primary font-bold underline">
              Start a search
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  const nights = selectedHotel?.nights || 0
  const room_count = selectedHotel?.room_count || 1

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-body">
      <Navbar />

      <main className="min-h-screen pt-24 pb-32 px-4 md:px-0 flex-grow">
        <div className="max-w-2xl mx-auto space-y-8">
          {/* Success Header Section */}
          <section className="text-center space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-container text-on-primary-container shadow-xl shadow-primary/10">
              <span className="material-symbols-outlined text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-4xl font-extrabold tracking-tight text-on-surface font-headline">Booking Confirmed!</h1>
              <p className="text-on-surface-variant font-medium">Pack your bags, your adventure begins soon.</p>
            </div>
            <div className="inline-block px-6 py-2 rounded-full bg-surface-container-high text-on-surface-variant text-sm font-bold tracking-widest uppercase">
              ID: {refCode}
            </div>
          </section>

          {/* Main Confirmation Card (The Bento/Layered Approach) */}
          <div className="bg-surface-container-lowest rounded-xl shadow-2xl shadow-emerald-900/5 overflow-hidden">
            {/* Header Image/Graphic Area */}
            <div className="relative h-48 bg-emerald-900 overflow-hidden">
              <img
                alt="Scenic travel background"
                className="w-full h-full object-cover opacity-60"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLxkAtYYR0xmY0YdvWFQnnLwIFNebOj1MJ1ZwZoXojlM638t_sPkqS3-b5hq0fM9sFhCyr4wdXW4eKHLm3_PQg6l_oz3FBSrmIfoB8pFBV1WqByiZMupSOzT5MKLPod70guUVRBLTCQiPODYBc2JWehoK20mIZwGYT6wQyicbCr249gP9SJIkKu_mlk-6Zzxl9VUwOeoPRWfao4TxrYXMGLUMRLbrmimS6KV5_Kc3w0oF6FYrqYYQvMkt3FnbthfKG3xyiQAaLiGw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-container-lowest to-transparent"></div>
              <div className="absolute bottom-6 left-8">
                <span className="bg-tertiary text-on-tertiary text-xs font-bold px-3 py-1 rounded-full">UPCOMING TRIP</span>
                <h2 className="text-2xl font-bold text-on-surface mt-2 font-headline">
                  {searchParams?.origin} → {searchParams?.destination}
                </h2>
              </div>
            </div>

            <div className="p-8 space-y-8">
              {/* Outbound Transport Section */}
              <div className="flex gap-6">
                <div className="flex-none w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">{getModeIcon(selectedForwardLeg.mode)}</span>
                </div>
                <div className="flex-1 space-y-1">
                  <span className="text-xs font-bold text-primary tracking-wide uppercase">Outbound Journey</span>
                  <h3 className="font-bold text-lg text-on-surface font-headline">{selectedForwardLeg.operator_name}</h3>
                  <div className="flex items-center gap-2 text-on-surface-variant">
                    <span className="font-medium">{searchParams?.origin}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                    <span className="font-medium">{searchParams?.destination}</span>
                  </div>
                  <p className="text-sm text-on-surface-variant/80">
                    {searchParams?.date}
                    {selectedForwardLeg.schedules?.[0]?.departure ? `, ${selectedForwardLeg.schedules[0].departure}` : ''}
                    {selectedForwardLeg.selectedSeats?.length ? ` • Seat: ${selectedForwardLeg.selectedSeats.join(', ')}` : ''}
                  </p>
                </div>
              </div>

              {/* Return Transport Section (only if isRoundTrip) */}
              {isRoundTrip && (
                <>
                  <div className="h-px bg-surface-container-low"></div>
                  <div className="flex gap-6">
                    <div className="flex-none w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                      <span className="material-symbols-outlined">
                        {selectedReturnLeg ? getModeIcon(selectedReturnLeg.mode) : 'directions_bus'}
                      </span>
                    </div>
                    <div className="flex-1 space-y-1">
                      <span className="text-xs font-bold text-primary tracking-wide uppercase">Return Journey</span>
                      <h3 className="font-bold text-lg text-on-surface font-headline">
                        {selectedReturnLeg ? selectedReturnLeg.operator_name : 'Return leg not selected'}
                      </h3>
                      <div className="flex items-center gap-2 text-on-surface-variant">
                        <span className="font-medium">{searchParams?.destination}</span>
                        <span className="material-symbols-outlined text-sm">arrow_forward</span>
                        <span className="font-medium">{searchParams?.origin}</span>
                      </div>
                      <p className="text-sm text-on-surface-variant/80">
                        {searchParams?.returnDate}
                        {selectedReturnLeg?.schedules?.[0]?.departure ? `, ${selectedReturnLeg.schedules[0].departure}` : ''}
                        {selectedReturnLeg?.selectedSeats?.length ? ` • Seat: ${selectedReturnLeg.selectedSeats.join(', ')}` : ''}
                      </p>
                    </div>
                  </div>
                </>
              )}

              {/* Subtle Divider */}
              <div className="h-px bg-surface-container-low"></div>

              {/* Hotel Section */}
              {selectedHotel ? (
                <div className="flex gap-6">
                  <div className="flex-none w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">hotel</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-bold text-primary tracking-wide uppercase">Accommodation</span>
                    <h3 className="font-bold text-lg text-on-surface font-headline">{selectedHotel.hotel_name}</h3>
                    <p className="text-on-surface-variant font-medium">
                      {nights} {nights === 1 ? 'Night' : 'Nights'} • {room_count} {room_count === 1 ? 'Room' : 'Rooms'}
                    </p>
                    <p className="text-sm text-on-surface-variant/80">Check-in: {selectedHotel.check_in}</p>
                  </div>
                </div>
              ) : (
                <div className="flex gap-6">
                  <div className="flex-none w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined">home_work</span>
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="text-xs font-bold text-primary tracking-wide uppercase">Accommodation</span>
                    <h3 className="font-bold text-lg text-on-surface font-headline">Own Arrangement</h3>
                    <p className="text-sm text-on-surface-variant/80">Own Arrangement — no hotel booked through GHURBO</p>
                  </div>
                </div>
              )}

              {/* Payment Summary Box */}
              <div className="bg-surface-container-low rounded-lg p-6 flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-on-surface-variant uppercase tracking-wider">Total Paid</p>
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-black text-primary">৳</span>
                    <span className="text-3xl font-black text-primary">
                      {(pricing?.grand_total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-on-primary-fixed-variant bg-primary-fixed px-3 py-1 rounded-full text-xs font-bold">
                    <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                    SUCCESS
                  </div>
                </div>
              </div>

              {/* QR Code Placeholder Section */}
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="w-36 h-36 rounded-xl bg-surface-container-low flex items-center justify-center overflow-hidden">
                  {ticketLoading && <span className="material-symbols-outlined text-4xl text-on-surface-variant animate-pulse">qr_code_2</span>}
                  {ticket?.qr_code && <img src={ticket.qr_code} alt="Booking QR code" className="w-full h-full object-contain" />}
                </div>
                <p className="text-xs text-on-surface-variant font-medium">Scan at check-in • {refCode}</p>
              </div>

              {/* Primary Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                  onClick={() => toast('PDF download coming soon — your QR code and ticket details above are valid for now.')}
                  className="w-full py-4 rounded-full bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">download</span>
                  Download E-Ticket
                </button>
                <button
                  onClick={() => navigate('/dashboard')}
                  className="w-full py-4 rounded-full border-2 border-outline-variant text-primary font-bold hover:bg-surface-container-low transition-colors flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined">dashboard</span>
                  Go to Dashboard
                </button>
              </div>

              {/* Secondary Action */}
              <button
                onClick={handleAddToCalendar}
                className="w-full text-on-surface-variant hover:text-primary font-semibold text-sm flex items-center justify-center gap-2 py-2 transition-colors"
              >
                <span className="material-symbols-outlined text-lg">calendar_add_on</span>
                Add to Google Calendar
              </button>
            </div>
          </div>

          {/* Need Help Section */}
          <section className="bg-surface-container rounded-lg p-8 text-center space-y-6">
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-on-surface font-headline font-headline">Need Help?</h3>
              <p className="text-on-surface-variant text-sm max-w-sm mx-auto">Our 24/7 support team is here to assist you with your booking or itinerary changes.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <a className="flex items-center gap-2 text-primary font-bold hover:underline" href="tel:+88012345678">
                <span className="material-symbols-outlined">call</span>
                +880 1234-5678
              </a>
              <a className="flex items-center gap-2 text-primary font-bold hover:underline" href="mailto:support@ghurbo.com">
                <span className="material-symbols-outlined">mail</span>
                support@ghurbo.com
              </a>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
