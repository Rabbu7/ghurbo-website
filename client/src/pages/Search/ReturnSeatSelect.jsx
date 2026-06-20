/* eslint-disable no-unused-vars */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function ReturnSeatSelect() {
  const navigate = useNavigate()
  const {
    searchParams,
    selectReturnLeg,
    selectedReturnLeg,
    pricing,
    setPricing,
  } = useBooking()

  const [selectedSeats, setSelectedSeats] = useState([])
  const [selectedSeatType, setSelectedSeatType] = useState(
    selectedReturnLeg?.seat_types?.[0] || null
  )

  if (!selectedReturnLeg) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex flex-col">
        <style>{`
          .material-symbols-outlined {
            font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
            font-family: 'Material Symbols Outlined';
            display: inline-block;
            line-height: 1;
          }
        `}</style>
        <Navbar />
        <main className="pt-24 pb-12 px-4 md:px-12 max-w-7xl mx-auto flex-grow flex items-center justify-center">
          <div className="text-center py-20 text-on-surface-variant">
            No return operator selected.
            <button onClick={() => navigate('/search/return')}
              className="ml-2 text-primary font-bold underline">
              Go back and choose one
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // Generate a 2+2 seat grid (4 cols, 10 rows = 40 seats)
  // Layout: [A, B, aisle, C, D] per row
  const ROWS = 10
  const generateSeats = () => {
    const seatsList = []
    // Randomly mark some as booked for demo
    const bookedSeats = ['1A', '1B', '3C', '3D', '5A', '6B', '7C', '8D', '2A', '4C']
    for (let r = 1; r <= ROWS; r++) {
      ['A', 'B', 'C', 'D'].forEach(col => {
        const id = `${r}${col}`
        seatsList.push({
          id,
          booked: bookedSeats.includes(id),
          row: r,
          col,
        })
      })
    }
    return seatsList
  }
  const seats = generateSeats()

  const toggleSeat = (seat) => {
    if (seat.booked) return
    setSelectedSeats(prev =>
      prev.find(s => s.id === seat.id)
        ? prev.filter(s => s.id !== seat.id)
        : [...prev, seat]
    )
  }

  const pricePerSeat = selectedSeatType?.price || 0
  const totalFare = pricePerSeat * (selectedSeats.length || 0)

  const handleProceed = () => {
    if (selectedSeats.length === 0) return
    selectReturnLeg({
      ...selectedReturnLeg,
      selectedSeats: selectedSeats.map(s => s.id),
      selectedSeatType,
      totalFare,
    })
    setPricing({
      ...pricing,
      return_transport: totalFare,
      grand_total: (pricing?.forward_transport || 0) +
                   (pricing?.hotel_total || 0) +
                   totalFare,
    })
    navigate('/hotels')
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
        .editorial-shadow {
          box-shadow: 0 40px 40px -5px rgba(0, 54, 44, 0.06);
        }
        .glass-nav {
          background: rgba(215, 255, 243, 0.7);
          backdrop-filter: blur(24px);
        }
      `}</style>

      <Navbar />

      <main className="pt-24 pb-12 px-4 md:px-12 max-w-7xl mx-auto flex-grow">
        {/* Progress Bar */}
        <div className="mb-12 mt-6">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-highest -z-10 -translate-y-1/2"></div>
            {/* Step 1: Complete */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant">Departure Selected</span>
            </div>
            {/* Step 2: Complete */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant">Select Return</span>
            </div>
            {/* Step 3: Active */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary ring-4 ring-primary-container shadow-xl">
                <span className="material-symbols-outlined">event_seat</span>
              </div>
              <span className="text-xs font-bold text-primary">Return Seats</span>
            </div>
            {/* Step 4: Pending */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">payments</span>
              </div>
              <span className="text-xs font-medium text-on-surface-variant/60">Hotel &amp; Pay</span>
            </div>
          </div>
        </div>

        {/* Header Section */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <span className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-2 block">Route Selection</span>
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-surface">
                {searchParams.destination || ''} to {searchParams.origin || ''}
              </h1>
              <p className="text-on-surface-variant mt-2 text-lg">
                {searchParams.returnDate || searchParams.date || ''} • 1 Passenger
              </p>
            </div>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-surface-container-low px-5 py-3 rounded-xl font-medium hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
                Filters
              </button>
              <button className="flex items-center gap-2 bg-surface-container-low px-5 py-3 rounded-xl font-medium hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined" data-icon="swap_vert">swap_vert</span>
                Sort by Price
              </button>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Selected Return Operator Details */}
          <div className="lg:col-span-7 space-y-6">
            <div className="rounded-lg p-6 flex flex-col gap-6 bg-surface-container-lowest editorial-shadow ring-2 ring-primary">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl flex items-center justify-center text-primary bg-surface-container-high">
                    <span className="material-symbols-outlined text-4xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                      {selectedReturnLeg.mode === 'train' ? 'train' :
                       selectedReturnLeg.mode === 'ship' || selectedReturnLeg.mode === 'launch' ? 'directions_boat' :
                       'directions_bus'}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-xl font-headline font-bold">{selectedReturnLeg.operator_name}</h3>
                    <div className="flex items-center gap-2 text-on-surface-variant text-sm mt-1">
                      <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                      <span className="font-bold text-on-surface">4.5</span>
                      <span>(reviews)</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  {selectedReturnLeg.seat_types?.[0]?.available_seats <= 10 && (
                    <span className="text-tertiary font-bold text-sm bg-tertiary-container/20 px-3 py-1 rounded-full">
                      Only {selectedReturnLeg.seat_types[0].available_seats} seats left
                    </span>
                  )}
                  <div className="text-2xl font-headline font-black text-primary mt-2">
                    ৳{selectedReturnLeg.seat_types?.[0]?.price?.toLocaleString()}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl">
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {selectedReturnLeg.schedules?.[0]?.departure || '--:--'}
                  </div>
                  <div className="text-xs text-on-surface-variant uppercase font-semibold">
                    {selectedReturnLeg.leg?.from}
                  </div>
                </div>
                <div className="flex-grow px-4 flex flex-col items-center">
                  <div className="text-xs text-on-surface-variant mb-1">
                    {selectedReturnLeg.schedules?.[0]?.duration_hours}h
                  </div>
                  <div className="w-full h-px bg-outline-variant relative">
                    <div className="absolute -top-1 left-0 w-2 h-2 rounded-full bg-primary"></div>
                    <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-primary"></div>
                  </div>
                  <div className="text-xs font-medium text-primary mt-1">Direct</div>
                </div>
                <div className="text-center">
                  <div className="text-lg font-bold">
                    {selectedReturnLeg.schedules?.[0]?.arrival || '--:--'}
                  </div>
                  <div className="text-xs text-on-surface-variant uppercase font-semibold">
                    {selectedReturnLeg.leg?.to}
                  </div>
                </div>
              </div>

              {/* Seat Type Selector Chips */}
              <div className="flex flex-wrap gap-2">
                {selectedReturnLeg.seat_types?.map((st, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedSeatType(st)}
                    className={`px-3 py-1 text-xs font-semibold rounded-full flex items-center gap-1 transition-colors ${
                      selectedSeatType?.type === st.type
                        ? 'bg-primary text-on-primary'
                        : 'bg-secondary-container text-on-secondary-container'
                    }`}
                  >
                    {st.type}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Seat Selection Sidebar */}
          <div className="lg:col-span-5">
            <div className="bg-surface-container-lowest rounded-lg editorial-shadow p-8 sticky top-28">
              <h2 className="text-2xl font-headline font-bold mb-6">
                Select Your Seats {selectedReturnLeg ? '— ' + selectedReturnLeg.operator_name : ''}
              </h2>
              <div className="flex justify-center gap-8 mb-8 text-xs font-semibold uppercase tracking-wider">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-surface-container-high"></div>
                  <span>Available</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-sm">check</span>
                  </div>
                  <span>Selected</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-8 h-8 rounded-md bg-error-container/20 relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-full h-px bg-error/30 rotate-45"></div>
                    </div>
                  </div>
                  <span>Booked</span>
                </div>
              </div>

              {/* Dynamic Seat Selection Map */}
              <div className="max-w-[280px] mx-auto bg-surface-container-low p-6 rounded-xl relative">
                {/* Driver */}
                <div className="flex justify-end mb-6">
                  <div className="w-10 h-10 rounded-full border-2 border-outline-variant flex items-center justify-center text-on-surface-variant">
                    <span className="material-symbols-outlined">radio_button_checked</span>
                  </div>
                </div>
                {/* Seat grid 2+2 layout */}
                <div className="space-y-3">
                  {Array.from({ length: ROWS }, (_, rowIdx) => {
                    const row = rowIdx + 1
                    const leftSeats = seats.filter(s => s.row === row && ['A', 'B'].includes(s.col))
                    const rightSeats = seats.filter(s => s.row === row && ['C', 'D'].includes(s.col))
                    return (
                      <div key={row} className="flex items-center gap-2">
                        <span className="text-xs text-on-surface-variant w-4 text-right">{row}</span>
                        <div className="flex gap-2">
                          {leftSeats.map(seat => (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat)}
                              disabled={seat.booked || !selectedReturnLeg}
                              className={`w-10 h-10 rounded-md text-xs font-bold transition-all relative ${
                                seat.booked
                                  ? 'bg-error-container/20 cursor-not-allowed'
                                  : selectedSeats.find(s => s.id === seat.id)
                                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                                  : 'bg-surface-container-high hover:bg-primary-container'
                              }`}
                            >
                              {seat.booked ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-full h-px bg-error/30 rotate-45"></div>
                                </div>
                              ) : selectedSeats.find(s => s.id === seat.id)
                                ? <span className="material-symbols-outlined text-sm">check</span>
                                : seat.col}
                            </button>
                          ))}
                        </div>
                        <div className="w-4" /> {/* aisle */}
                        <div className="flex gap-2">
                          {rightSeats.map(seat => (
                            <button
                              key={seat.id}
                              onClick={() => toggleSeat(seat)}
                              disabled={seat.booked || !selectedReturnLeg}
                              className={`w-10 h-10 rounded-md text-xs font-bold transition-all relative ${
                                seat.booked
                                  ? 'bg-error-container/20 cursor-not-allowed'
                                  : selectedSeats.find(s => s.id === seat.id)
                                  ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                                  : 'bg-surface-container-high hover:bg-primary-container'
                              }`}
                            >
                              {seat.booked ? (
                                <div className="absolute inset-0 flex items-center justify-center">
                                  <div className="w-full h-px bg-error/30 rotate-45"></div>
                                </div>
                              ) : selectedSeats.find(s => s.id === seat.id)
                                ? <span className="material-symbols-outlined text-sm">check</span>
                                : seat.col}
                            </button>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Summary Footer */}
              <div className="mt-8 pt-8 border-t border-surface-container-high">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-on-surface-variant font-medium">Selected Seats</span>
                  <span className="font-bold text-primary">
                    {selectedSeats.map(s => s.id).join(', ') || 'None'}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-6">
                  <span className="text-xl font-headline font-bold">Total Fare</span>
                  <span className="text-3xl font-headline font-black text-primary">
                    ৳{totalFare.toLocaleString()}
                  </span>
                </div>
                <button
                  onClick={handleProceed}
                  disabled={selectedSeats.length === 0 || !selectedReturnLeg}
                  className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-full font-headline font-extrabold text-lg editorial-shadow hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:pointer-events-none"
                >
                  Proceed to Hotels
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
