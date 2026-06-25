/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function OutboundSelect() {
  const navigate = useNavigate()
  const {
    searchParams,
    selectForwardLeg,
    selectedForwardLeg,
    setPricing,
  } = useBooking()

  const [legSeatSelections, setLegSeatSelections] = useState({})
  const [activeLegIndex, setActiveLegIndex] = useState(0)

  // Guard: redirect to search page if selectedForwardLeg is invalid
  useEffect(() => {
    if (!selectedForwardLeg || !Array.isArray(selectedForwardLeg) || selectedForwardLeg.length === 0) {
      navigate('/search')
    }
  }, [selectedForwardLeg, navigate])

  // Initialize seat selections for all legs with default first seat type
  useEffect(() => {
    if (selectedForwardLeg && Array.isArray(selectedForwardLeg)) {
      const initial = {}
      selectedForwardLeg.forEach((op, i) => {
        initial[i] = {
          seats: [],
          seatType: op.seat_types?.[0] || null
        }
      })
      setLegSeatSelections(initial)
      setActiveLegIndex(0)
    }
  }, [selectedForwardLeg])

  if (!selectedForwardLeg || !Array.isArray(selectedForwardLeg) || selectedForwardLeg.length === 0) {
    return null
  }

  // Generate deterministic seat grid per leg
  const generateSeatsForLeg = (legIndex) => {
    const seatsList = []
    const bookedPatterns = [
      ['1A', '1B', '3C', '3D', '5A', '6B', '7C', '8D', '2A', '4C'],
      ['2B', '2C', '4A', '4B', '6C', '6D', '8A', '9B', '10C', '5D'],
      ['1C', '1D', '3A', '3B', '5C', '5D', '7A', '7B', '9C', '9D']
    ]
    const booked = bookedPatterns[legIndex % bookedPatterns.length]
    for (let r = 1; r <= 10; r++) {
      ['A', 'B', 'C', 'D'].forEach(col => {
        const id = `${r}${col}`
        seatsList.push({
          id,
          booked: booked.includes(id),
          row: r,
          col,
        })
      })
    }
    return seatsList
  }

  const activeLegSeats = generateSeatsForLeg(activeLegIndex)
  const activeLeg = selectedForwardLeg[activeLegIndex]

  const toggleSeat = (seat) => {
    if (seat.booked) return
    setLegSeatSelections(prev => {
      const current = prev[activeLegIndex] || { seats: [], seatType: null }
      const exists = current.seats.find(s => s.id === seat.id)
      const nextSeats = exists
        ? current.seats.filter(s => s.id !== seat.id)
        : [...current.seats, seat]
      return {
        ...prev,
        [activeLegIndex]: {
          ...current,
          seats: nextSeats
        }
      }
    })
  }

  const selectSeatType = (legIndex, seatType) => {
    setLegSeatSelections(prev => {
      const current = prev[legIndex] || { seats: [] }
      const seats = current.seatType?.type === seatType.type ? current.seats : []
      return {
        ...prev,
        [legIndex]: {
          ...current,
          seatType,
          seats
        }
      }
    })
  }

  const totalSum = Object.values(legSeatSelections).reduce((sum, item) => {
    const price = item.seatType?.price || 0
    const count = item.seats?.length || 0
    return sum + (price * count)
  }, 0)

  const canProceed = selectedForwardLeg.length > 0 && selectedForwardLeg.every((_, i) => {
    const sel = legSeatSelections[i]
    return sel && sel.seats && sel.seats.length > 0
  })

  const handleProceed = () => {
    if (!canProceed) return

    const enrichedLegs = selectedForwardLeg.map((op, i) => ({
      ...op,
      selectedSeats: legSeatSelections[i].seats.map(s => s.id),
      selectedSeatType: legSeatSelections[i].seatType,
      totalFare: legSeatSelections[i].seatType.price * legSeatSelections[i].seats.length,
    }))

    selectForwardLeg(enrichedLegs)
    const forward_transport = enrichedLegs.reduce((sum, leg) => sum + (leg.totalFare || 0), 0)

    setPricing({
      forward_transport,
      hotel_total: 0,
      return_transport: 0,
      grand_total: forward_transport,
    })

    if (searchParams.tripType === 'round_trip') {
      navigate('/search/return')
    } else {
      navigate('/hotels')
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
        .editorial-shadow {
          box-shadow: 0 40px 40px -5px rgba(0, 54, 44, 0.06);
        }
      `}</style>

      <Navbar />

      <main className="pt-28 pb-12 px-4 md:px-12 max-w-7xl mx-auto flex-grow w-full">
        {/* Header Section */}
        <header className="mb-12">
          <div>
            <span className="text-on-surface-variant font-bold uppercase tracking-widest text-xs mb-2 block">Seat Selection</span>
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-on-surface">
              {searchParams.origin || ''} to {searchParams.destination || ''}
            </h1>
            <p className="text-on-surface-variant mt-2 text-lg">
              {searchParams.date || ''} • Outbound Leg Journey
            </p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Transport Summary List */}
          <div className="lg:col-span-7 space-y-6">
            {selectedForwardLeg.map((op, i) => {
              const isCompleted = legSeatSelections[i] && legSeatSelections[i].seats.length > 0
              const isActive = activeLegIndex === i
              return (
                <div
                  key={i}
                  onClick={() => setActiveLegIndex(i)}
                  className={`rounded-2xl p-6 flex flex-col gap-4 cursor-pointer transition-all ${
                    isActive
                      ? 'bg-surface-container-lowest editorial-shadow ring-2 ring-primary'
                      : 'bg-surface-container-low hover:bg-surface-container-high'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
                        <span className="material-symbols-outlined text-2xl text-on-surface-variant">
                          {op.mode === 'train' ? 'train' : op.mode === 'launch' || op.mode === 'ship' ? 'directions_boat' : 'directions_bus'}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-headline font-bold flex items-center gap-2 text-on-surface">
                          {op.operator_name}
                          {isCompleted && (
                            <span className="material-symbols-outlined text-primary text-lg font-bold">check_circle</span>
                          )}
                        </h3>
                        <p className="text-xs text-on-surface-variant font-medium">
                          Leg {i + 1}: {op.from} → {op.to}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-[10px] text-on-surface-variant font-black uppercase tracking-wider">
                        {op.schedules?.[0]?.departure} - {op.schedules?.[0]?.arrival}
                      </p>
                      {isCompleted && (
                        <span className="inline-block mt-1.5 bg-primary/10 text-primary text-[10px] font-bold px-2.5 py-0.5 rounded-full">
                          Seats: {legSeatSelections[i].seats.map(s => s.id).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Seat type selector buttons */}
                  <div className="flex flex-wrap gap-2 pt-2">
                    {op.seat_types?.map((st, stIdx) => {
                      const currentSelType = legSeatSelections[i]?.seatType
                      const isSel = currentSelType?.type === st.type
                      return (
                        <button
                          key={stIdx}
                          onClick={(e) => {
                            e.stopPropagation()
                            selectSeatType(i, st)
                            setActiveLegIndex(i)
                          }}
                          className={`px-3 py-1.5 text-xs font-semibold rounded-full border-none transition-colors cursor-pointer ${
                            isSel
                              ? 'bg-primary text-on-primary font-bold'
                              : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                          }`}
                        >
                          {st.type} — ৳ {st.price}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Seat Selection Map (Active Leg Only) */}
          <div className="lg:col-span-5">
            {activeLeg && (
              <div className="bg-surface-container-lowest rounded-2xl editorial-shadow p-8 sticky top-28">
                <h2 className="text-2xl font-headline font-bold mb-2 text-on-surface">
                  Seats for Leg {activeLegIndex + 1}
                </h2>
                <p className="text-xs text-on-surface-variant font-semibold uppercase tracking-wider mb-6">
                  {activeLeg.from} → {activeLeg.to} • {activeLeg.operator_name}
                </p>

                {/* Legend */}
                <div className="flex justify-center gap-6 mb-8 text-xs font-semibold uppercase tracking-wider">
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-surface-container-low"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-primary text-on-primary flex items-center justify-center">
                      <span className="material-symbols-outlined text-sm">check</span>
                    </div>
                    <span>Selected</span>
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <div className="w-8 h-8 rounded-md bg-error/15 relative">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-px bg-error/30 rotate-45"></div>
                      </div>
                    </div>
                    <span>Booked</span>
                  </div>
                </div>

                {/* Seat Map */}
                <div className="max-w-[280px] mx-auto bg-surface-container-low p-6 rounded-2xl relative mb-8">
                  <div className="flex justify-end mb-6">
                    <div className="w-10 h-10 rounded-full border-2 border-outline-variant flex items-center justify-center text-on-surface-variant">
                      <span className="material-symbols-outlined text-xl">radio_button_checked</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {Array.from({ length: 10 }, (_, rowIdx) => {
                      const row = rowIdx + 1
                      const leftSeats = activeLegSeats.filter(s => s.row === row && ['A', 'B'].includes(s.col))
                      const rightSeats = activeLegSeats.filter(s => s.row === row && ['C', 'D'].includes(s.col))
                      return (
                        <div key={row} className="flex items-center gap-2">
                          <span className="text-xs text-on-surface-variant w-4 text-right">{row}</span>
                          <div className="flex gap-2">
                            {leftSeats.map(seat => {
                              const activeLegSel = legSeatSelections[activeLegIndex]
                              const isSelected = activeLegSel?.seats?.some(s => s.id === seat.id)
                              return (
                                <button
                                  key={seat.id}
                                  onClick={() => toggleSeat(seat)}
                                  disabled={seat.booked}
                                  className={`w-10 h-10 rounded-md text-xs font-bold transition-all relative border-none cursor-pointer ${
                                    seat.booked
                                      ? 'bg-error/15 cursor-not-allowed text-error/30'
                                      : isSelected
                                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                                      : 'bg-surface-container-lowest hover:bg-primary-container text-on-surface'
                                  }`}
                                >
                                  {seat.booked ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-full h-px bg-error/30 rotate-45"></div>
                                    </div>
                                  ) : isSelected ? (
                                    <span className="material-symbols-outlined text-sm">check</span>
                                  ) : (
                                    seat.col
                                  )}
                                </button>
                              )
                            })}
                          </div>
                          <div className="w-4" /> {/* aisle */}
                          <div className="flex gap-2">
                            {rightSeats.map(seat => {
                              const activeLegSel = legSeatSelections[activeLegIndex]
                              const isSelected = activeLegSel?.seats?.some(s => s.id === seat.id)
                              return (
                                <button
                                  key={seat.id}
                                  onClick={() => toggleSeat(seat)}
                                  disabled={seat.booked}
                                  className={`w-10 h-10 rounded-md text-xs font-bold transition-all relative border-none cursor-pointer ${
                                    seat.booked
                                      ? 'bg-error/15 cursor-not-allowed text-error/30'
                                      : isSelected
                                      ? 'bg-primary text-on-primary shadow-lg shadow-primary/20'
                                      : 'bg-surface-container-lowest hover:bg-primary-container text-on-surface'
                                  }`}
                                >
                                  {seat.booked ? (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-full h-px bg-error/30 rotate-45"></div>
                                    </div>
                                  ) : isSelected ? (
                                    <span className="material-symbols-outlined text-sm">check</span>
                                  ) : (
                                    seat.col
                                  )}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Summary Footer */}
                <div className="pt-6 border-t border-outline-variant/15 space-y-4">
                  {selectedForwardLeg.map((op, idx) => {
                    const sel = legSeatSelections[idx]
                    const seatIds = sel?.seats?.map(s => s.id).join(', ') || 'None'
                    return (
                      <div key={idx} className="flex justify-between items-center text-xs">
                        <span className="text-on-surface-variant font-medium">Leg {idx + 1} ({op.operator_name})</span>
                        <span className="font-bold text-primary">{seatIds}</span>
                      </div>
                    )
                  })}
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-xl font-headline font-bold text-on-surface">Total Fare</span>
                    <span className="text-3xl font-headline font-black text-primary">
                      ৳ {totalSum.toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={handleProceed}
                    disabled={!canProceed}
                    className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-full font-headline font-extrabold text-lg editorial-shadow hover:scale-[0.98] transition-transform disabled:opacity-50 disabled:pointer-events-none border-none cursor-pointer"
                  >
                    {searchParams.tripType === 'round_trip'
                      ? 'Continue to Return'
                      : 'Proceed to Hotels'}
                  </button>
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
