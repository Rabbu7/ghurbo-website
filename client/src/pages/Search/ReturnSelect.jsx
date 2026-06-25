import { useState, useEffect } from 'react'
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

  // Guard: redirect to search page if returnLegs is invalid or empty
  useEffect(() => {
    if (!returnLegs || !Array.isArray(returnLegs) || returnLegs.length === 0) {
      navigate('/search')
    }
  }, [returnLegs, navigate])

  const [activeLegIndex, setActiveLegIndex] = useState(0)
  const [selectedPerLeg, setSelectedPerLeg] = useState({})
  const [sortBy, setSortBy] = useState('earliest')
  const [filterType, setFilterType] = useState([])

  if (!returnLegs || !Array.isArray(returnLegs) || returnLegs.length === 0) {
    return null
  }

  const handleSelect = (operator) => {
    setSelectedPerLeg(prev => ({
      ...prev,
      [activeLegIndex]: operator
    }))
    setActiveLegIndex(prev => prev + 1)
  }

  const handleChange = (index) => {
    setSelectedPerLeg(prev => {
      const next = { ...prev }
      for (let i = index; i < returnLegs.length; i++) {
        delete next[i]
      }
      return next
    })
    setActiveLegIndex(index)
  }

  const handleFilterToggle = (type) => {
    setFilterType(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const handleClearFilters = () => {
    setFilterType([])
  }

  // Active leg computations
  const activeLeg = returnLegs[activeLegIndex]
  const rawOperators = activeLeg?.operators || []

  const filteredOperators = rawOperators.filter(op => {
    if (filterType.length === 0) return true
    const opMode = op.mode || activeLeg.mode
    return filterType.some(type => {
      if (type === 'launch' || type === 'ship') {
        return opMode === 'launch' || opMode === 'ship'
      }
      return type === opMode
    })
  })

  const sortedOperators = [...filteredOperators].sort((a, b) => {
    if (sortBy === 'price') {
      const priceA = a.seat_types?.[0]?.price || 0
      const priceB = b.seat_types?.[0]?.price || 0
      return priceA - priceB
    }
    if (sortBy === 'earliest') {
      const depA = a.schedules?.[0]?.departure || ''
      const depB = b.schedules?.[0]?.departure || ''
      return depA.localeCompare(depB)
    }
    return 0
  })

  const selectedReturnOperators = Object.values(selectedPerLeg)
  const allReturnSelected = returnLegs.length > 0 && selectedReturnOperators.length === returnLegs.length

  const returnSubtotal = selectedReturnOperators.reduce((sum, op) => sum + (op.seat_types?.[0]?.price || 0), 0)
  const forwardTotal = pricing?.forward_transport || 0
  const grandTotal = forwardTotal + returnSubtotal

  const handleContinue = () => {
    if (!allReturnSelected) return
    selectReturnLeg(selectedReturnOperators)
    navigate('/search/return-seats')
  }

  const forwardLegsSummary = Array.isArray(selectedForwardLeg)
    ? selectedForwardLeg.map(op => op.operator_name).join(' + ')
    : 'Not selected'

  const returnSummary = allReturnSelected
    ? selectedReturnOperators.map(op => op.operator_name).join(' + ')
    : 'Select Return to Proceed'

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
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

      <main className="pt-28 pb-32 px-4 md:px-12 max-w-7xl mx-auto flex-grow w-full">
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
          <div className="flex gap-3 justify-center md:justify-end font-headline">
            <button
              onClick={() => setSortBy('earliest')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors border-none cursor-pointer ${
                sortBy === 'earliest'
                  ? 'bg-primary text-on-primary font-bold'
                  : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
              }`}
            >
              Earliest
            </button>
            <button
              onClick={() => setSortBy('price')}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-medium transition-colors border-none cursor-pointer ${
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
                <button 
                  onClick={handleClearFilters}
                  className="text-primary text-xs font-bold hover:underline border-none bg-transparent cursor-pointer"
                >
                  Reset All
                </button>
              </div>
              {/* Transport Type */}
              <div className="mb-8">
                <p className="text-xs font-bold uppercase tracking-widest text-on-surface-variant/60 mb-4">Transport Type</p>
                <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => handleFilterToggle('bus')}
                    className="w-full flex items-center gap-3 cursor-pointer group bg-transparent border-none text-left p-0"
                  >
                    <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${filterType.includes('bus') ? 'border-primary bg-primary' : 'border-outline group-hover:border-primary bg-surface-container-lowest'}`}>
                      {filterType.includes('bus') && <span className="material-symbols-outlined text-on-primary text-[10px] font-bold">check</span>}
                    </div>
                    <span className={`text-sm ${filterType.includes('bus') ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>Bus</span>
                  </button>
                  <button 
                    onClick={() => handleFilterToggle('train')}
                    className="w-full flex items-center gap-3 cursor-pointer group bg-transparent border-none text-left p-0"
                  >
                    <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${filterType.includes('train') ? 'border-primary bg-primary' : 'border-outline group-hover:border-primary bg-surface-container-lowest'}`}>
                      {filterType.includes('train') && <span className="material-symbols-outlined text-on-primary text-[10px] font-bold">check</span>}
                    </div>
                    <span className={`text-sm ${filterType.includes('train') ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>Train</span>
                  </button>
                  <button 
                    onClick={() => handleFilterToggle('launch')}
                    className="w-full flex items-center gap-3 cursor-pointer group bg-transparent border-none text-left p-0"
                  >
                    <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${filterType.includes('launch') ? 'border-primary bg-primary' : 'border-outline group-hover:border-primary bg-surface-container-lowest'}`}>
                      {filterType.includes('launch') && <span className="material-symbols-outlined text-on-primary text-[10px] font-bold">check</span>}
                    </div>
                    <span className={`text-sm ${filterType.includes('launch') ? 'font-bold text-on-surface' : 'font-medium text-on-surface-variant'}`}>Ship / Cruise</span>
                  </button>
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
                  <button className="bg-surface-container-lowest text-on-surface px-3 py-2 rounded-md text-xs font-bold border border-transparent hover:border-primary transition-all cursor-pointer">Morning</button>
                  <button className="bg-surface-container-lowest text-on-surface px-3 py-2 rounded-md text-xs font-bold border border-transparent hover:border-primary transition-all cursor-pointer">Afternoon</button>
                  <button className="bg-surface-container-lowest text-on-surface px-3 py-2 rounded-md text-xs font-bold border border-transparent hover:border-primary transition-all cursor-pointer">Evening</button>
                  <button className="bg-surface-container-lowest text-on-surface px-3 py-2 rounded-md text-xs font-bold border border-transparent hover:border-primary transition-all cursor-pointer">Night</button>
                </div>
              </div>
            </div>
          </aside>

          {/* Return Legs Selection List */}
          <section className="lg:col-span-9 space-y-6">
            {returnLegs.map((leg, index) => {
              const isCompleted = selectedPerLeg[index] !== undefined
              const isActive = activeLegIndex === index
              const isLocked = index > activeLegIndex

              // Completed Leg State
              if (isCompleted) {
                const op = selectedPerLeg[index]
                const cheapestSeat = op.seat_types?.[0]
                return (
                  <div key={index} className="bg-surface-container-low p-6 rounded-2xl flex items-center justify-between transition-all">
                    <div className="flex items-center gap-4">
                      <span className="material-symbols-outlined text-primary text-2xl font-bold">check_circle</span>
                      <div>
                        <h4 className="font-headline font-bold text-lg text-on-surface">
                          Leg {index + 1}: {leg.from} → {leg.to} ({leg.mode?.toUpperCase()})
                        </h4>
                        <p className="text-sm text-on-surface-variant">
                          {op.operator_name} • {op.schedules?.[0]?.departure} - {op.schedules?.[0]?.arrival} • ৳ {cheapestSeat?.price?.toLocaleString() || '0'} ({cheapestSeat?.type})
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => handleChange(index)}
                      className="px-5 py-2 rounded-full hover:bg-surface-container-high text-primary font-bold transition-all text-sm border-none bg-transparent cursor-pointer"
                    >
                      Change
                    </button>
                  </div>
                )
              }

              // Active Leg State
              if (isActive) {
                return (
                  <div key={index} className="bg-surface-container-lowest ring-2 ring-primary p-8 rounded-2xl space-y-6 transition-all">
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-primary mb-1 block">Active Selection</span>
                        <h3 className="font-headline font-extrabold text-2xl text-on-surface">
                          Leg {index + 1}: {leg.from} → {leg.to}
                        </h3>
                        <p className="text-xs text-on-surface-variant font-medium mt-1">
                          Mode: <span className="uppercase font-bold text-primary">{leg.mode}</span> • Est: {leg.estimated_hours} hours
                        </p>
                      </div>
                    </div>

                    {/* Operators List */}
                    <div className="space-y-4">
                      {rawOperators.length === 0 ? (
                        <div className="text-center py-10 bg-surface-container-low rounded-xl p-6">
                          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">
                            {leg.mode === 'train' ? 'train' : leg.mode === 'launch' || leg.mode === 'ship' ? 'directions_boat' : 'directions_bus'}
                          </span>
                          <h4 className="font-headline font-bold text-lg mb-2">No operators available</h4>
                          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                            We couldn't find any {leg.mode} operators for this leg. Try searching a different route.
                          </p>
                        </div>
                      ) : filteredOperators.length === 0 ? (
                        <div className="text-center py-10 bg-surface-container-low rounded-xl p-6">
                          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">filter_list_off</span>
                          <h4 className="font-headline font-bold text-lg mb-2">No {leg.mode} operators available for this leg.</h4>
                          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                            Try a different filter or select from available options.
                          </p>
                        </div>
                      ) : (
                        sortedOperators.map((op, idx) => (
                          <div
                            key={idx}
                            className="bg-surface-container-low rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between hover:shadow-md transition-all border border-transparent"
                          >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                              <div className="w-12 h-12 rounded-xl bg-surface-container-lowest flex items-center justify-center shrink-0">
                                <span className="material-symbols-outlined text-2xl text-on-surface-variant">
                                  {leg.mode === 'train' ? 'train' : leg.mode === 'launch' || leg.mode === 'ship' ? 'directions_boat' : 'directions_bus'}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-headline font-bold text-on-surface text-lg">{op.operator_name}</h4>
                                <p className="text-xs font-semibold text-on-surface-variant">
                                  {leg.mode?.toUpperCase()} • {leg.from} → {leg.to}
                                </p>
                              </div>
                            </div>

                            <div className="flex-1 grid grid-cols-3 items-center gap-4 w-full text-center">
                              <div>
                                <h5 className="text-lg font-headline font-bold text-on-surface">
                                  {op.schedules?.[0]?.departure || '--:--'}
                                </h5>
                                <p className="text-[10px] text-on-surface-variant font-medium">{leg.from}</p>
                              </div>
                              <div className="flex flex-col items-center">
                                <span className="text-[10px] font-bold text-on-surface-variant mb-1">
                                  {op.schedules?.[0]?.duration_hours}h
                                </span>
                                <div className="w-full flex items-center gap-2">
                                  <div className="h-[1px] flex-1 border-t border-dashed border-outline-variant"></div>
                                  <span className="material-symbols-outlined text-outline-variant text-sm">schedule</span>
                                  <div className="h-[1px] flex-1 border-t border-dashed border-outline-variant"></div>
                                </div>
                              </div>
                              <div>
                                <h5 className="text-lg font-headline font-bold text-on-surface">
                                  {op.schedules?.[0]?.arrival || '--:--'}
                                </h5>
                                <p className="text-[10px] text-on-surface-variant font-medium">{leg.to}</p>
                              </div>
                            </div>

                            <div className="flex flex-col items-center md:items-end gap-2 w-full md:w-auto">
                              <div className="flex flex-wrap gap-2 justify-center md:justify-end">
                                {op.seat_types?.map((st, sIdx) => (
                                  <div key={sIdx} className="text-xs bg-surface-container-lowest px-2.5 py-1 rounded-lg">
                                    <span className="text-on-surface-variant font-medium">{st.type}: </span>
                                    <span className="font-bold text-on-surface">৳ {st.price}</span>
                                  </div>
                                ))}
                              </div>
                              <button
                                onClick={() => handleSelect(op)}
                                className="w-full md:w-36 mt-2 font-bold py-2.5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary hover:scale-[1.02] active:scale-98 transition-all text-sm border-none shadow-sm cursor-pointer"
                              >
                                Select
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              }

              // Locked Leg State
              return (
                <div key={index} className="bg-surface-container-low p-6 rounded-2xl opacity-50 flex items-center gap-4 select-none animate-pulse">
                  <span className="material-symbols-outlined text-on-surface-variant text-2xl">lock</span>
                  <div>
                    <h4 className="font-headline font-bold text-lg text-on-surface-variant">
                      Leg {index + 1}: {leg.from} → {leg.to} ({leg.mode?.toUpperCase()})
                    </h4>
                    <p className="text-xs text-on-surface-variant">Complete previous leg first</p>
                  </div>
                </div>
              )
            })}
          </section>
        </div>
      </main>

      <Footer />

      {/* Sticky Bottom Summary Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-surface-container-lowest/80 backdrop-blur-xl border-t border-outline/10 shadow-[0_-10px_40px_-15px_rgba(0,106,78,0.15)]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Departure Trip</span>
              <div className="flex items-center gap-2">
                <span className="font-bold text-on-surface">{searchParams.origin} <span className="text-primary">→</span> {searchParams.destination}</span>
                <span className="hidden md:inline text-on-surface-variant/40 text-sm">|</span>
                <span className="text-sm font-medium text-on-surface-variant max-w-[200px] truncate">{forwardLegsSummary}</span>
              </div>
            </div>
            <div className="h-8 w-[1px] bg-outline-variant/30 hidden md:block"></div>
            <div className="flex flex-col">
              <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Return Trip</span>
              <span className={`text-sm font-bold ${allReturnSelected ? 'text-primary' : 'text-primary italic'}`}>
                {returnSummary}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-6 w-full md:w-auto">
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-outline uppercase tracking-wider">
                Return Subtotal (৳{returnSubtotal.toLocaleString()}) • Grand Total
              </p>
              <p className="text-xl font-black text-on-surface">
                ৳{grandTotal.toLocaleString()}
              </p>
            </div>
            <button
              onClick={handleContinue}
              disabled={!allReturnSelected}
              className={`w-full md:w-auto px-10 py-4 rounded-full font-bold text-sm transition-all border-none cursor-pointer ${
                allReturnSelected
                  ? 'bg-primary text-on-primary hover:scale-[1.02] active:scale-98 shadow-lg shadow-primary/20'
                  : 'opacity-60 cursor-not-allowed bg-surface-container-highest text-on-surface-variant'
              }`}
            >
              Continue to Seat Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
