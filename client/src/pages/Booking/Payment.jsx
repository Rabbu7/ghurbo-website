import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import toast from 'react-hot-toast'
import { useBooking } from '../../context/BookingContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { createBooking } from '../../api/booking.api'
import { initiatePayment, confirmPaymentWebhook } from '../../api/payment.api'

export default function Payment() {
  const navigate = useNavigate()
  const { searchParams, selectedForwardLeg, selectedReturnLeg, selectedHotel, pricing, setBookingId, setRefCode } = useBooking()
  const isRoundTrip = searchParams.tripType === 'round_trip'

  const [paymentMethod, setPaymentMethod] = useState('bkash') // 'bkash' | 'nagad' | 'card'
  const [phone, setPhone] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  if (!selectedForwardLeg) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col">
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

  const buildLegPayload = (leg, fromCity, toCity, dateStr) => {
    if (!leg) return null
    const departureTime = leg.schedules?.[0]?.departure
    const departure = departureTime
      ? dayjs(`${dateStr}T${departureTime}`).toDate()
      : dayjs(dateStr).toDate()
    return {
      from: leg.leg?.from || fromCity,
      to: leg.leg?.to || toCity,
      mode: leg.mode,
      operator_id: leg._id,
      operator_name: leg.operator_name,
      seat_type: leg.selectedSeatType?.type,
      seat_numbers: leg.selectedSeats || [],
      departure,
      price: leg.totalFare || 0,
    }
  }

  const handlePay = async () => {
    if ((paymentMethod === 'bkash' || paymentMethod === 'nagad') && !phone) return
    if (paymentMethod === 'card' && (!cardNumber || !expiry || !cvv)) return

    setIsProcessing(true)
    try {
      const forward_legs = [buildLegPayload(selectedForwardLeg, searchParams.origin, searchParams.destination, searchParams.date)]
      const return_legs = isRoundTrip && selectedReturnLeg
        ? [buildLegPayload(selectedReturnLeg, searchParams.destination, searchParams.origin, searchParams.returnDate)]
        : []

      const hotelPayload = selectedHotel ? {
        hotel_id: selectedHotel.hotel_id,
        hotel_name: selectedHotel.hotel_name,
        room_type: selectedHotel.room_type,
        room_count: selectedHotel.room_count,
        check_in: selectedHotel.check_in,
        check_out: selectedHotel.check_out,
        nights: selectedHotel.nights,
        price_per_night: selectedHotel.price_per_night,
        total_price: selectedHotel.total_price,
      } : undefined

      const bookingRes = await createBooking({
        trip_type: searchParams.tripType,
        forward_legs,
        hotel: hotelPayload,
        return_legs,
        pricing,
      })

      const newBookingId = bookingRes.booking._id
      const newRefCode = bookingRes.booking.ref_code

      const paymentRes = await initiatePayment({
        booking_id: newBookingId,
        method: paymentMethod,
        amount: pricing.grand_total,
      })

      await confirmPaymentWebhook({
        transaction_id: paymentRes.transaction_id,
        status: 'SUCCESS',
      })

      setBookingId(newBookingId)
      setRefCode(newRefCode)
      navigate('/booking/confirmation')
    } catch (err) {
      toast.error('Something went wrong processing your payment. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          display: inline-block;
          line-height: 1;
        }
        .glass-card {
          background: rgba(255, 255, 255, 0.7);
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
      `}</style>

      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 flex-grow">
        <section className="lg:col-span-7 space-y-8">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-primary">Finalize Booking</h1>
            <p className="text-on-surface-variant font-medium">Confirm your details and choose a secure payment method to lock in your riverine adventure.</p>
          </div>
          <div className="space-y-6">
            <h2 className="text-xl font-headline font-bold flex items-center gap-2">
              <span className="material-symbols-outlined text-primary">account_balance_wallet</span>
              Payment Methods
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {/* bKash Payment Option */}
              <label className="group relative flex items-center justify-between p-6 rounded-lg bg-surface-container-lowest cursor-pointer hover:bg-surface transition-all shadow-sm">
                <input
                  checked={paymentMethod === 'bkash'}
                  onChange={() => setPaymentMethod('bkash')}
                  className="hidden peer"
                  name="payment"
                  type="radio"
                />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-primary rounded-md">
                    <span className="text-on-primary font-bold text-xs">bKash</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">bKash Wallet</p>
                    <p className="text-xs text-on-surface-variant">Instant payment via bKash</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                </div>
              </label>

              {/* Nagad Payment Option */}
              <label className="group relative flex items-center justify-between p-6 rounded-lg bg-surface-container-lowest cursor-pointer hover:bg-surface transition-all shadow-sm">
                <input
                  checked={paymentMethod === 'nagad'}
                  onChange={() => setPaymentMethod('nagad')}
                  className="hidden peer"
                  name="payment"
                  type="radio"
                />
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 flex items-center justify-center bg-tertiary rounded-md">
                    <span className="text-on-primary font-bold text-xs">Nagad</span>
                  </div>
                  <div>
                    <p className="font-bold text-on-surface">Nagad Account</p>
                    <p className="text-xs text-on-surface-variant">Pay with your Nagad wallet</p>
                  </div>
                </div>
                <div className="w-6 h-6 rounded-full border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                  <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                </div>
              </label>

              {/* Card Payment Option */}
              <div className="p-6 rounded-lg bg-surface-container-low/50 space-y-4">
                <label className="flex items-center justify-between cursor-pointer">
                  <input
                    checked={paymentMethod === 'card'}
                    onChange={() => setPaymentMethod('card')}
                    className="hidden peer"
                    name="payment"
                    type="radio"
                  />
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 flex items-center justify-center bg-secondary rounded-md">
                      <span className="material-symbols-outlined text-white">credit_card</span>
                    </div>
                    <p className="font-bold text-on-surface">Credit / Debit Card</p>
                  </div>
                  <div className="w-6 h-6 rounded-full border-2 border-outline-variant peer-checked:border-primary peer-checked:bg-primary flex items-center justify-center transition-all">
                    <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                  </div>
                </label>

                {paymentMethod === 'card' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                    <input
                      className="w-full bg-surface-container-lowest rounded-xl p-4 border-none focus:ring-2 focus:ring-primary text-sm font-medium"
                      placeholder="Card Number"
                      type="text"
                      value={cardNumber}
                      onChange={e => setCardNumber(e.target.value)}
                    />
                    <div className="grid grid-cols-2 gap-4">
                      <input
                        className="w-full bg-surface-container-lowest rounded-xl p-4 border-none focus:ring-2 focus:ring-primary text-sm font-medium"
                        placeholder="MM/YY"
                        type="text"
                        value={expiry}
                        onChange={e => setExpiry(e.target.value)}
                      />
                      <input
                        className="w-full bg-surface-container-lowest rounded-xl p-4 border-none focus:ring-2 focus:ring-primary text-sm font-medium"
                        placeholder="CVV"
                        type="text"
                        value={cvv}
                        onChange={e => setCvv(e.target.value)}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* bKash/Nagad Phone Input */}
              {(paymentMethod === 'bkash' || paymentMethod === 'nagad') && (
                <div className="px-2 mt-2">
                  <label className="block text-xs font-bold text-on-surface-variant mb-2 uppercase tracking-wide">
                    {paymentMethod === 'bkash' ? 'bKash' : 'Nagad'} Account Number
                  </label>
                  <input
                    type="tel"
                    placeholder="01XXXXXXXXX"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full bg-surface-container-lowest rounded-xl p-4 border-none focus:ring-2 focus:ring-primary text-sm font-medium"
                  />
                </div>
              )}
            </div>
            <div className="p-4 rounded-xl bg-surface-container flex items-start gap-3">
              <span className="material-symbols-outlined text-primary">verified_user</span>
              <p className="text-xs text-on-surface-variant leading-relaxed">Your transaction is secured with 256-bit SSL encryption. We never store your sensitive payment credentials on our servers.</p>
            </div>
          </div>
        </section>

        <aside className="lg:col-span-5">
          <div className="sticky top-28 space-y-6">
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm space-y-6">
              <div className="flex items-center gap-4 pb-6">
                <div className="w-20 h-20 rounded-md overflow-hidden flex-shrink-0">
                  <img
                    className="w-full h-full object-cover"
                    alt="Traditional wooden boat"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBXPGhuM2FYm8tBFZfTkKoRq78OCHIw72c8zIP-Hl68x3grzJ93UKwwx74RpKxovw6WKQo25poOrEr4r5QbwC1i_8TzKJXXC1f46IKUFaQep44AUwUTEUUT7KfJbOGUEPsL83YvMb2h7m4ZTWkpOMapjoFd8Igt9gBp4ZCYv_Nk-VSd325Jxyo3xNBbZT0HUtSaX-Y-g8L_vXKcC9ckPMungh3N9aL1OHhDHZVpvoSHX_REFAOMDObJ9kqXzU1cZw2X1vIBM48j8wA"
                  />
                </div>
                <div>
                  <h3 className="font-headline font-bold text-lg text-primary">
                    {searchParams.origin} → {searchParams.destination}
                  </h3>
                  <p className="text-sm text-on-surface-variant font-medium">
                    {selectedHotel ? `${selectedHotel.nights} ${selectedHotel.nights === 1 ? 'Night' : 'Nights'} Stay` : 'Transport Only'}
                  </p>
                  <p className="text-sm text-on-surface-variant">Departure: {searchParams.date}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-on-surface-variant">Outbound ({selectedForwardLeg.operator_name})</span>
                  <span className="font-semibold">৳{(pricing?.forward_transport || 0).toLocaleString()}</span>
                </div>
                {isRoundTrip && selectedReturnLeg && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">Return ({selectedReturnLeg.operator_name})</span>
                    <span className="font-semibold">৳{(pricing?.return_transport || 0).toLocaleString()}</span>
                  </div>
                )}
                {selectedHotel && (
                  <div className="flex justify-between text-sm">
                    <span className="text-on-surface-variant">{selectedHotel.hotel_name}</span>
                    <span className="font-semibold">৳{(pricing?.hotel_total || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-4 mt-4 flex justify-between items-baseline">
                  <span className="text-lg font-headline font-bold">Total Amount</span>
                  <span className="text-3xl font-headline font-extrabold text-primary">
                    ৳{(pricing?.grand_total || 0).toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={handlePay}
                disabled={isProcessing}
                className={`w-full py-5 px-8 bg-gradient-to-br from-primary to-primary-container text-on-primary rounded-full font-bold text-lg shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2 ${isProcessing ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? 'Processing...' : (
                  <>
                    Pay Securely
                    <span className="material-symbols-outlined">lock</span>
                  </>
                )}
              </button>
              <p className="text-center text-[10px] uppercase tracking-widest text-on-surface-variant font-bold opacity-60">Money-back guarantee within 48 hours</p>
            </div>
            <div className="relative rounded-lg overflow-hidden h-40 group">
              <img
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                alt="Sunset view of paddy field"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBHpY2bOao8D86UR3xg2CCJPlTO10bcCJ7hRqtlaFj6lA2P58LReaFsFVedeC3q7q9HV779q5p_WgV6Fb-2YuRfAmr-UmZm9V46Y5Kl1u78_G089lNz_zZpGVLSZbd5IpyW-mGsPp6EHMFeKL0ZOiff-WrtMT-6izH0FdMtT52pN6s9GvqIhKUacF6SbsQDqAWx7-VjnDuvWaQc_jbr9Z2huhpnK3W6Q_baPYj9gLJrXjefywoX3PVcM8zG7Chs2_onbmPZN5dEsIE"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex items-end p-6">
                <p className="text-white text-sm italic">"Travel is the only thing you buy that makes you richer."</p>
              </div>
            </div>
          </div>
        </aside>
      </main>

      <Footer />
    </div>
  )
}
