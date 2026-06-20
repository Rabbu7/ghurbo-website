import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function TripSummary() {
  const navigate = useNavigate()
  const { searchParams, selectedForwardLeg, selectedReturnLeg, selectedHotel, pricing } = useBooking()

  const isRoundTrip = searchParams.tripType === 'round_trip'

  const getModeIcon = (mode) => {
    switch (mode) {
      case 'train':
        return 'train'
      case 'ship':
      case 'launch':
        return 'directions_boat'
      case 'bus':
      default:
        return 'directions_bus'
    }
  }

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

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          display: inline-block;
          line-height: 1;
        }
        .glass-effect {
          backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
        }
      `}</style>

      <Navbar />

      <main className="pt-24 pb-32 px-6 max-w-4xl mx-auto flex-grow">
        {/* Header Section */}
        <section className="mb-10">
          <span className="text-primary font-semibold tracking-widest text-xs uppercase">Your Adventure Awaits</span>
          <h1 className="text-4xl md:text-5xl font-extrabold text-on-surface mt-2 tracking-tight font-headline">Trip Summary</h1>
          <div className="flex items-center gap-3 mt-4 text-on-surface-variant">
            <span className="material-symbols-outlined text-primary">calendar_month</span>
            <span className="font-medium">
              {searchParams.date}{isRoundTrip && ` - ${searchParams.returnDate}`}
            </span>
            <span className="mx-2 text-outline-variant opacity-30">|</span>
            <span className="font-medium">{searchParams.origin} to {searchParams.destination}</span>
          </div>
        </section>

        {/* Bento Grid Layout for Summary */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column (Outbound, Return, Hotel) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            {/* Outbound Transport Card */}
            <div className="bg-surface-container-lowest rounded-lg p-6 flex flex-col gap-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary-container flex items-center justify-center">
                    <span className="material-symbols-outlined text-on-primary-container">
                      {getModeIcon(selectedForwardLeg.mode)}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold font-headline">Outbound Transport</h3>
                    <p className="text-on-surface-variant text-sm">{searchParams.date}</p>
                  </div>
                </div>
                <button onClick={() => navigate('/search')} className="text-primary font-bold text-sm hover:underline">
                  Edit
                </button>
              </div>
              <div className="flex flex-col md:flex-row justify-between items-center py-4 bg-surface-container-low rounded-xl px-6">
                <div className="text-center md:text-left">
                  <p className="text-lg font-bold text-on-surface">{searchParams.origin}</p>
                </div>
                <div className="flex flex-col items-center flex-1 px-8 gap-2 py-4 md:py-0">
                  <p className="text-xs font-bold text-primary">{selectedForwardLeg.operator_name}</p>
                  <div className="w-full h-[2px] bg-outline-variant/30 relative flex items-center justify-center my-2">
                    <span className="material-symbols-outlined text-primary text-lg bg-surface-container-low px-2 leading-none">
                      {getModeIcon(selectedForwardLeg.mode)}
                    </span>
                  </div>
                  <p className="text-[10px] text-on-surface-variant">
                    {selectedForwardLeg.schedules?.[0]?.departure || '--:--'} — {selectedForwardLeg.schedules?.[0]?.arrival || '--:--'}
                  </p>
                </div>
                <div className="text-center md:text-right">
                  <p className="text-lg font-bold text-on-surface">{searchParams.destination}</p>
                </div>
              </div>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-2 bg-primary-container/30 px-3 py-1.5 rounded-full">
                  <span className="material-symbols-outlined text-primary text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>event_seat</span>
                  <span className="text-xs font-bold text-on-surface">
                    {selectedForwardLeg.selectedSeatType?.type || 'Standard'}
                  </span>
                </div>
                {selectedForwardLeg.selectedSeats && selectedForwardLeg.selectedSeats.length > 0 && (
                  <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full">
                    <span className="text-xs font-bold text-on-surface-variant">
                      Seats: {selectedForwardLeg.selectedSeats.join(', ')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Return Transport Card */}
            {isRoundTrip && (
              <div className="bg-surface-container-lowest rounded-lg p-6 flex flex-col gap-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary-container flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-secondary-container">
                        {selectedReturnLeg ? getModeIcon(selectedReturnLeg.mode) : 'directions_bus'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold font-headline">Return</h3>
                      <p className="text-on-surface-variant text-sm">{searchParams.returnDate}</p>
                    </div>
                  </div>
                  <button onClick={() => navigate('/search/return')} className="text-primary font-bold text-sm hover:underline">
                    Edit
                  </button>
                </div>
                <div className="flex flex-col md:flex-row justify-between items-center py-4 bg-surface-container-low rounded-xl px-6">
                  <div className="text-center md:text-left">
                    <p className="text-lg font-bold text-on-surface">{searchParams.destination}</p>
                  </div>
                  <div className="flex flex-col items-center flex-1 px-8 gap-2 py-4 md:py-0">
                    <p className="text-xs font-bold text-on-secondary-container">
                      {selectedReturnLeg?.operator_name || 'No Return Selected'}
                    </p>
                    <div className="w-full h-[2px] bg-outline-variant/30 relative flex items-center justify-center my-2">
                      <span className="material-symbols-outlined text-on-secondary-container text-sm bg-surface-container-low px-2 leading-none">
                        {selectedReturnLeg ? getModeIcon(selectedReturnLeg.mode) : 'directions_bus'}
                      </span>
                    </div>
                    <p className="text-[10px] text-on-surface-variant">
                      {selectedReturnLeg?.schedules?.[0]?.departure || '--:--'} — {selectedReturnLeg?.schedules?.[0]?.arrival || '--:--'}
                    </p>
                  </div>
                  <div className="text-center md:text-right">
                    <p className="text-lg font-bold text-on-surface">{searchParams.origin}</p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2 bg-secondary-container/30 px-3 py-1.5 rounded-full">
                    <span className="material-symbols-outlined text-on-secondary-container text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>event_seat</span>
                    <span className="text-xs font-bold text-on-surface">
                      {selectedReturnLeg?.selectedSeatType?.type || 'Standard'}
                    </span>
                  </div>
                  {selectedReturnLeg?.selectedSeats && selectedReturnLeg.selectedSeats.length > 0 && (
                    <div className="flex items-center gap-2 bg-surface-container-high px-3 py-1.5 rounded-full">
                      <span className="text-xs font-bold text-on-surface-variant">
                        Seats: {selectedReturnLeg.selectedSeats.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Hotel Selection Card */}
            {selectedHotel ? (
              <div className="bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col md:flex-row">
                <div className="md:w-1/3 relative h-48 md:h-auto">
                  <img
                    alt={selectedHotel.hotel_name}
                    className="w-full h-full object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAMPQVF7ALIZfUewNsU0Fv_yZf9Kos4s-K_LRqRmHh9rJm3dIPDFCmPfeUtpjH4_v3zQt7vrDf5VsWzm41bL0uqRkzACFKeEjd75cL9784BeUGbN_fIcNvKLpsCF7UMhk5vvqXQQ0kLh_j-RQEORUTP7m-5htTt0uEnvTB2x1QWanGOn-ipscjOyOn61SSreaKaM4oP8jzwcRD112bO2aMwd1ff-7EzUZdjTjAlV3r9zOLW-MGGWF92CwOWddQDeWIVgiStIvWqecI"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 bg-primary text-on-primary text-[10px] font-bold rounded-full uppercase">
                    {selectedHotel.nights} {selectedHotel.nights === 1 ? 'NIGHT' : 'NIGHTS'}
                  </div>
                </div>
                <div className="p-6 md:w-2/3 flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold leading-tight font-headline">{selectedHotel.hotel_name}</h3>
                      <button onClick={() => navigate('/hotels')} className="text-primary font-bold text-sm hover:underline">
                        Edit
                      </button>
                    </div>
                    <p className="text-sm font-semibold text-on-surface-variant mt-2">
                      {selectedHotel.room_type} · {selectedHotel.room_count} {selectedHotel.room_count === 1 ? 'Room' : 'Rooms'}
                    </p>
                  </div>
                  <div className="mt-6 flex justify-between items-center">
                    <span className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Stay Dates</span>
                    <span className="text-sm font-semibold">
                      {selectedHotel.check_in} - {selectedHotel.check_out}
                    </span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-surface-container-lowest rounded-lg p-6 flex flex-col justify-between border-l-4 border-primary">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold leading-tight text-on-surface font-headline">Accommodation</h3>
                    <button onClick={() => navigate('/hotels')} className="text-primary font-bold text-sm hover:underline">
                      Edit
                    </button>
                  </div>
                  <div className="flex items-center gap-3 py-2">
                    <span className="material-symbols-outlined text-primary text-3xl">home_work</span>
                    <div>
                      <p className="font-bold text-on-surface text-lg">Own Arrangement</p>
                      <p className="text-sm text-on-surface-variant">No hotel booked through GHURBO</p>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-on-surface-variant/80 mt-4 leading-relaxed">
                  You can change your selection or add a hotel stay anytime before finalizing your booking.
                </p>
              </div>
            )}
          </div>

          {/* Right Column (Price Summary) */}
          <div className="lg:col-span-4">
            <div className="bg-surface-container-high rounded-lg p-6 sticky top-28">
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 font-headline">
                <span className="material-symbols-outlined text-primary">receipt_long</span>
                Price Summary
              </h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-on-surface-variant">Outbound ({selectedForwardLeg.operator_name})</span>
                  <span className="font-bold">৳{(pricing?.forward_transport || 0).toLocaleString()}</span>
                </div>
                {isRoundTrip && selectedReturnLeg && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant">Return ({selectedReturnLeg.operator_name})</span>
                    <span className="font-bold">৳{(pricing?.return_transport || 0).toLocaleString()}</span>
                  </div>
                )}
                {selectedHotel && (
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-on-surface-variant font-medium">
                      {selectedHotel.hotel_name} ({selectedHotel.nights} {selectedHotel.nights === 1 ? 'Night' : 'Nights'})
                    </span>
                    <span className="font-bold">৳{(pricing?.hotel_total || 0).toLocaleString()}</span>
                  </div>
                )}
                <div className="pt-4 mt-4 border-t border-outline-variant/20">
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-xs text-on-surface-variant font-bold uppercase tracking-widest">Total Cost</p>
                      <p className="text-3xl font-black text-primary tracking-tight">৳{(pricing?.grand_total || 0).toLocaleString()}</p>
                    </div>
                    <span className="bg-primary-container text-on-primary-container text-[10px] font-black px-2 py-1 rounded-md mb-2">FINAL PRICE</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirm Action Area */}
        <div className="mt-12 flex flex-col md:flex-row items-center justify-between gap-6 bg-primary/5 p-8 rounded-xl">
          <div className="text-center md:text-left">
            <h4 className="text-lg font-bold font-headline">Ready to finalize your trip?</h4>
            <p className="text-sm text-on-surface-variant">By clicking confirm, you agree to our booking terms and cancellation policies.</p>
          </div>
          <button
            onClick={() => navigate('/booking/payment')}
            className="w-full md:w-auto px-10 py-4 bg-gradient-to-r from-primary to-primary-container text-on-primary font-bold text-lg rounded-full shadow-lg hover:opacity-90 transition-opacity active:scale-[0.98] duration-200"
          >
            Confirm Booking
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
