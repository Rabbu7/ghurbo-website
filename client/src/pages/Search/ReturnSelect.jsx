import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function ReturnSelect() {
  const navigate = useNavigate()
  const {
    searchParams,
    returnLegs,
    selectReturnLeg,
    selectedForwardLeg,
    pricing,
  } = useBooking()

  const [selectedReturn, setSelectedReturn] = useState(null)
  const [sortBy, setSortBy] = useState('earliest')

  // Flatten return operators
  const allReturnOperators = returnLegs?.flatMap(leg =>
    (leg.operators || []).map(op => ({ ...op, leg }))
  ) || []

  const sortedReturnOperators = [...allReturnOperators].sort((a, b) => {
    if (sortBy === 'price')
      return (a.seat_types?.[0]?.price || 0) - (b.seat_types?.[0]?.price || 0)
    if (sortBy === 'earliest')
      return (a.schedules?.[0]?.departure || '').localeCompare(
        b.schedules?.[0]?.departure || ''
      )
    return 0
  })

  const handleSelectReturn = (op) => {
    setSelectedReturn(op)
    selectReturnLeg(op)
  }

  const handleContinue = () => {
    if (!selectedReturn) return
    navigate('/search/return-seats')
  }

  return (
    <div className="bg-background text-on-background min-h-screen pb-32">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          display: inline-block;
          line-height: 1;
        }
      `}</style>

      <Navbar />

      <main className="pt-28 px-4 md:px-12 max-w-7xl mx-auto">
        {/* Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between max-w-2xl mx-auto relative">
            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-surface-container-highest -z-10 -translate-y-1/2"></div>
            {/* Step 1: Complete */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-on-primary shadow-lg shadow-primary/20">
                <span className="material-symbols-outlined text-sm">check</span>
              </div>
              <span className="text-xs font-semibold text-on-surface-variant">Departure Selected</span>
            </div>
            {/* Step 2: Active */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-on-primary ring-4 ring-primary-container shadow-xl">
                <span className="material-symbols-outlined">directions_bus</span>
              </div>
              <span className="text-xs font-bold text-primary">Select Return</span>
            </div>
            {/* Step 3: Pending */}
            <div className="flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                <span className="material-symbols-outlined text-sm">payments</span>
              </div>
              <span className="text-xs font-medium text-on-surface-variant/60">Hotel &amp; Pay</span>
            </div>
          </div>
        </div>

        {/* Header Title & Route */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black text-on-surface mb-2 tracking-tight">Select Return Journey</h1>
            <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4 text-on-surface-variant">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg">{searchParams.destination || 'Destination'}</span>
                <span className="material-symbols-outlined text-primary">arrow_forward</span>
                <span className="font-bold text-lg">{searchParams.origin || 'Origin'}</span>
              </div>
              <div className="hidden md:block w-1.5 h-1.5 rounded-full bg-outline-variant/30"></div>
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary text-sm">calendar_month</span>
                <span className="font-medium">{searchParams.returnDate || searchParams.date || ''}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-3 justify-center md:justify-end">
            <button
              onClick={() => setSortBy('earliest')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${
                sortBy === 'earliest'
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Earliest
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors ${
                sortBy === 'price'
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Sort by Price
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 flex flex-col gap-6">
            <div className="bg-surface-container-low rounded-lg p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="font-bold text-lg">Filters</h2>
                <button className="text-primary text-xs font-bold hover:underline">Reset All</button>
              </div>
              {/* Transport Type */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Transport Type</p>
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-primary group-hover:bg-primary/10 flex items-center justify-center transition-all">
                      <div className="w-2.5 h-2.5 bg-primary rounded-sm opacity-100"></div>
                    </div>
                    <span className="text-sm font-medium">Bus</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-outline transition-all group-hover:border-primary"></div>
                    <span className="text-sm font-medium">Train</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-outline transition-all group-hover:border-primary"></div>
                    <span className="text-sm font-medium">Ship / Cruise</span>
                  </label>
                </div>
              </div>
              {/* Price Range */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Price Range (৳)</p>
                <input className="w-full accent-primary bg-surface-container-highest rounded-full h-1.5 appearance-none cursor-pointer" max="15000" min="500" step="500" type="range"/>
                <div className="flex justify-between mt-2 text-xs font-medium text-on-surface-variant">
                  <span>৳500</span>
                  <span>৳15,000+</span>
                </div>
              </div>
              {/* Time Filter */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Departure Time</p>
                <div className="grid grid-cols-2 gap-2">
                  <button className="bg-surface-container-lowest text-on-surface px-3 py-2 rounded-md text-xs font-bold border border-transparent hover:border-primary transition-all">Morning</button>
                  <button className="bg-surface-container-lowest text-on-surface px-3 py-2 rounded-md text-xs font-bold border border-transparent hover:border-primary transition-all">Afternoon</button>
                  <button className="bg-surface-container-lowest text-on-surface px-3 py-2 rounded-md text-xs font-bold border border-transparent hover:border-primary transition-all">Evening</button>
                  <button className="bg-surface-container-lowest text-on-surface px-3 py-2 rounded-md text-xs font-bold border border-transparent hover:border-primary transition-all">Night</button>
                </div>
              </div>
            </div>
          </aside>

          {/* Transport List */}
          <div className="lg:col-span-9 flex flex-col gap-6">
            {allReturnOperators.length === 0 && (
              <div className="text-center py-20 text-on-surface-variant font-medium">
                No return operators found for this route.
              </div>
            )}

            {sortedReturnOperators.map((op, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectReturn(op)}
                className={`bg-surface-container-lowest rounded-lg p-6 transition-transform hover:scale-[1.01] duration-300 group cursor-pointer ${
                  selectedReturn === op ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="flex flex-col md:flex-row gap-6 items-center">
                  <div className="w-24 h-24 rounded-xl bg-surface-container overflow-hidden flex-shrink-0 relative">
                    <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                      <span className="material-symbols-outlined text-primary text-3xl">
                        {op.mode === 'train' ? 'train' :
                         op.mode === 'ship' || op.mode === 'launch' ? 'directions_boat' :
                         'directions_bus'}
                      </span>
                    </div>
                  </div>
                  <div className="flex-grow flex flex-col md:flex-row md:items-center justify-between gap-6 w-full">
                    <div>
                      <h3 className="text-xl font-bold text-on-surface mb-1">
                        {op.operator_name}
                      </h3>
                      <p className="text-sm font-semibold text-primary bg-primary-container/30 px-2 py-0.5 rounded-full inline-block">
                        {op.seat_types?.[0]?.type} • {op.mode?.toUpperCase()}
                      </p>
                      <div className="mt-4 flex items-center gap-8">
                        <div className="text-center md:text-left">
                          <p className="text-lg font-black text-on-surface leading-none">
                            {op.schedules?.[0]?.departure || '--:--'}
                          </p>
                          <p className="text-xs font-medium text-on-surface-variant">
                            {op.leg?.from}
                          </p>
                        </div>
                        <div className="flex flex-col items-center flex-grow max-w-[120px]">
                          <p className="text-[10px] font-bold text-outline uppercase tracking-tighter mb-1">
                            {op.schedules?.[0]?.duration_hours}h
                          </p>
                          <div className="w-full h-[1px] bg-outline-variant relative">
                            <div className="absolute -top-[3px] -left-1 w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
                            <div className="absolute -top-[3px] -right-1 w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
                          </div>
                          <p className="text-[10px] font-bold text-on-surface-variant mt-1">Direct</p>
                        </div>
                        <div className="text-center md:text-right">
                          <p className="text-lg font-black text-on-surface leading-none">
                            {op.schedules?.[0]?.arrival || '--:--'}
                          </p>
                          <p className="text-xs font-medium text-on-surface-variant">
                            {op.leg?.to}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-3 min-w-[160px]">
                      <div className="text-right">
                        <p className="text-3xl font-black text-on-surface leading-none">
                          ৳{op.seat_types?.[0]?.price?.toLocaleString()}
                        </p>
                        <p className="text-xs font-medium text-on-surface-variant mt-1">Per Person</p>
                      </div>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSelectReturn(op) }}
                        className={`w-full py-3 px-6 rounded-full font-bold text-sm transition-all ${
                          selectedReturn === op
                            ? 'bg-primary text-on-primary'
                            : 'bg-gradient-to-br from-primary to-primary-dim text-on-primary hover:shadow-lg hover:shadow-primary/30 active:scale-95'
                        }`}
                      >
                        {selectedReturn === op ? '✓ Selected' : 'Select for Return'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Sticky Bottom Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-emerald-100 py-4 px-6 md:px-12 shadow-2xl">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Departure Trip</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-on-surface">{searchParams.origin} <span className="text-primary">→</span> {searchParams.destination}</span>
                <span className="hidden md:inline text-on-surface-variant/40 text-sm">|</span>
                <span className="text-sm font-medium text-on-surface-variant">{selectedForwardLeg?.operator_name || 'Not selected'}</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/30 hidden md:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Return Trip</span>
              {selectedReturn ? (
                <span className="text-sm font-bold text-primary">{selectedReturn.operator_name}</span>
              ) : (
                <span className="text-sm font-bold text-primary italic">Select Return to Proceed</span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Subtotal (1 Passenger)</p>
              <p className="text-xl font-black text-on-surface">
                ৳{(
                  (pricing?.forward_transport || 0) +
                  (selectedReturn?.seat_types?.[0]?.price || 0)
                ).toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleContinue}
              disabled={!selectedReturn}
              className={`w-full md:w-auto px-10 py-4 rounded-full font-bold text-sm transition-all ${
                selectedReturn
                  ? 'bg-primary text-on-primary'
                  : 'opacity-60 cursor-not-allowed bg-surface-container-highest text-on-surface-variant'
              }`}
            >
              Continue to Seat Selection
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
