/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'
import axios from '../../api/axios'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function SearchResults() {
  const navigate = useNavigate()
  const { searchParams, setForwardLegs, selectForwardLeg, setReturnLegs } = useBooking()

  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  
  // Selection flow state
  const [activeLegIndex, setActiveLegIndex] = useState(0)
  const [selectedPerLeg, setSelectedPerLeg] = useState({})
  
  // Scoped filters / sorting state
  const [sortBy, setSortBy] = useState('earliest')
  const [filterType, setFilterType] = useState([])
  const [filterTime, setFilterTime] = useState('')

  useEffect(() => {
    const fetchResults = async () => {
      if (!searchParams.origin || !searchParams.destination) {
        navigate('/')
        return
      }
      setLoading(true)
      setError('')
      try {
        const res = await axios.post('/search/route', {
          origin: searchParams.origin,
          destination: searchParams.destination,
          tripType: searchParams.tripType || 'one_way',
        })
        setResults(res.data.data)
        if (res.data.data.forward_legs) {
          setForwardLegs(res.data.data.forward_legs)
        }
        if (res.data.data.return_legs) {
          setReturnLegs(res.data.data.return_legs)
        }
      } catch (err) {
        console.error(err)
        setError('No routes found. Please try a different search.')
      } finally {
        setLoading(false)
      }
    }
    fetchResults()
  }, [searchParams, navigate, setForwardLegs, setReturnLegs])

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
      for (let i = index; i < (results?.forward_legs?.length || 0); i++) {
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

  const handleTimeFilter = (time) => {
    setFilterTime(filterTime === time ? '' : time)
  }

  const selectedOperators = Object.values(selectedPerLeg)
  const totalSum = selectedOperators.reduce((sum, op) => sum + (op.seat_types?.[0]?.price || 0), 0)
  const allLegsSelected = results?.forward_legs?.length > 0 && selectedOperators.length === results.forward_legs.length

  const handleContinue = () => {
    selectForwardLeg(selectedOperators)
    if (searchParams.tripType === 'round_trip') {
      navigate('/search/outbound')
    } else {
      navigate('/search/outbound')
    }
  }

  // Active leg computations
  const activeLeg = results?.forward_legs?.[activeLegIndex]
  const rawOperators = activeLeg?.operators || []

  const filteredOperators = rawOperators.filter(op => {
    // Transport type filter
    if (filterType.length > 0) {
      const opMode = op.mode || activeLeg.mode
      const typeMatch = filterType.some(type => {
        if (type === 'launch' || type === 'ship') {
          return opMode === 'launch' || opMode === 'ship'
        }
        return type === opMode
      })
      if (!typeMatch) return false
    }
    
    // Departure time filter
    if (filterTime) {
      const departure = op.schedules?.[0]?.departure || ''
      const hour = parseInt(departure.split(':')[0])
      
      if (filterTime === 'morning' && (hour < 6 || hour >= 12)) return false
      if (filterTime === 'afternoon' && (hour < 12 || hour >= 18)) return false
      if (filterTime === 'evening' && (hour < 18 || hour >= 24)) return false
      if (filterTime === 'night' && (hour < 0 || hour >= 6)) return false
    }
    
    return true
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
    if (sortBy === 'duration') {
      const durA = a.schedules?.[0]?.duration_hours || 0
      const durB = b.schedules?.[0]?.duration_hours || 0
      return durA - durB
    }
    return 0
  })

  return (
    <div className="bg-background text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          display: inline-block;
          line-height: 1;
          font-family: 'Material Symbols Outlined';
        }
        .editorial-shadow {
          box-shadow: 0 20px 40px -5px rgba(0, 54, 44, 0.06);
        }
      `}</style>

      <Navbar />

      <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex-grow w-full">
        {/* Search Context Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
                {searchParams.origin || 'Origin'} to {searchParams.destination || 'Destination'}
              </h1>
              <p className="text-on-surface-variant font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">calendar_today</span>
                {searchParams.date || ''} • Passenger
              </p>
              {searchParams.tripType === 'round_trip' && (
                <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider">
                  <span className="material-symbols-outlined text-sm">sync_alt</span>
                  Round Trip
                </div>
              )}
            </div>
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-2 px-6 py-3 bg-surface-container-low rounded-xl text-on-surface-variant font-bold hover:bg-surface-container-highest transition-all border-none outline-none"
            >
              <span className="material-symbols-outlined">edit</span>
              Modify Search
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 sticky top-28 space-y-8">
            <div className="bg-surface-container-low p-6 rounded-2xl">
              <h3 className="font-headline font-bold text-lg mb-6 flex items-center justify-between">
                Filters
                <button 
                  onClick={() => { handleClearFilters(); setFilterTime('') }}
                  className="text-sm font-label text-primary font-semibold cursor-pointer border-none bg-transparent hover:underline"
                >
                  Clear All
                </button>
              </h3>
              {/* Transport Type */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Transport Type</label>
                <div className="space-y-3">
                  <button 
                    onClick={() => handleFilterToggle('bus')}
                    className="w-full flex items-center gap-3 cursor-pointer group bg-transparent border-none text-left p-0"
                  >
                    <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${filterType.includes('bus') ? 'border-primary bg-primary' : 'border-outline group-hover:border-primary bg-surface-container-lowest'}`}>
                      {filterType.includes('bus') && <span className="material-symbols-outlined text-on-primary text-xs" style={{ fontVariationSettings: "'wght' 700" }}>check</span>}
                    </div>
                    <span className={`font-medium ${filterType.includes('bus') ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>Bus</span>
                  </button>
                  <button 
                    onClick={() => handleFilterToggle('train')}
                    className="w-full flex items-center gap-3 cursor-pointer group bg-transparent border-none text-left p-0"
                  >
                    <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${filterType.includes('train') ? 'border-primary bg-primary' : 'border-outline group-hover:border-primary bg-surface-container-lowest'}`}>
                      {filterType.includes('train') && <span className="material-symbols-outlined text-on-primary text-xs" style={{ fontVariationSettings: "'wght' 700" }}>check</span>}
                    </div>
                    <span className={`font-medium ${filterType.includes('train') ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>Train</span>
                  </button>
                  <button 
                    onClick={() => handleFilterToggle('launch')}
                    className="w-full flex items-center gap-3 cursor-pointer group bg-transparent border-none text-left p-0"
                  >
                    <div className={`w-5 h-5 rounded border-2 transition-colors flex items-center justify-center ${filterType.includes('launch') ? 'border-primary bg-primary' : 'border-outline group-hover:border-primary bg-surface-container-lowest'}`}>
                      {filterType.includes('launch') && <span className="material-symbols-outlined text-on-primary text-xs" style={{ fontVariationSettings: "'wght' 700" }}>check</span>}
                    </div>
                    <span className={`font-medium ${filterType.includes('launch') ? 'font-bold text-on-surface' : 'text-on-surface-variant'}`}>Ship / Launch</span>
                  </button>
                </div>
              </div>
              {/* Price Range */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Price Range</label>
                <div className="relative h-2 bg-surface-container-highest rounded-full mb-6">
                  <div className="absolute left-1/4 right-1/4 h-full bg-primary rounded-full"></div>
                  <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-5 h-5 bg-surface-container-lowest border-4 border-primary rounded-full shadow-md"></div>
                  <div className="absolute right-1/4 top-1/2 -translate-y-1/2 w-5 h-5 bg-surface-container-lowest border-4 border-primary rounded-full shadow-md"></div>
                </div>
                <div className="flex justify-between text-sm font-bold text-on-surface">
                  <span>৳ 450</span>
                  <span>৳ 2,500</span>
                </div>
              </div>
              {/* Departure Time */}
              <div>
                <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Departure Time</label>
                <div className="grid grid-cols-2 gap-2">
                  <button 
                    onClick={() => handleTimeFilter('morning')}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      filterTime === 'morning'
                        ? 'border-primary bg-primary-container text-primary'
                        : 'border-outline-variant bg-surface-container-lowest hover:bg-primary-container hover:border-primary'
                    }`}
                  >
                    Morning<br /><span className="opacity-60">06:00-12:00</span>
                  </button>
                  <button 
                    onClick={() => handleTimeFilter('afternoon')}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      filterTime === 'afternoon'
                        ? 'border-primary bg-primary-container text-primary'
                        : 'border-outline-variant bg-surface-container-lowest hover:bg-primary-container hover:border-primary'
                    }`}
                  >
                    Afternoon<br /><span className="opacity-60">12:00-18:00</span>
                  </button>
                  <button 
                    onClick={() => handleTimeFilter('evening')}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      filterTime === 'evening'
                        ? 'border-primary bg-primary-container text-primary'
                        : 'border-outline-variant bg-surface-container-lowest hover:bg-primary-container hover:border-primary'
                    }`}
                  >
                    Evening<br /><span className="opacity-60">18:00-00:00</span>
                  </button>
                  <button 
                    onClick={() => handleTimeFilter('night')}
                    className={`p-3 rounded-xl border text-xs font-bold text-center transition-all ${
                      filterTime === 'night'
                        ? 'border-primary bg-primary-container text-primary'
                        : 'border-outline-variant bg-surface-container-lowest hover:bg-primary-container hover:border-primary'
                    }`}
                  >
                    Night<br /><span className="opacity-60">00:00-06:00</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Results List */}
          <section className="lg:col-span-9 space-y-6">
            {loading && (
              <div className="text-center py-20 text-on-surface-variant font-medium">
                Searching routes...
              </div>
            )}
            {error && (
              <div className="text-center py-20 text-error font-medium">{error}</div>
            )}
            {!loading && !error && results?.forward_legs?.map((leg, index) => {
              const isCompleted = selectedPerLeg[index] !== undefined
              const isActive = activeLegIndex === index
              const isLocked = index > activeLegIndex

              // Completed Leg State
              if (isCompleted) {
                const op = selectedPerLeg[index]
                const cheapestSeat = op.seat_types?.[0]
                return (
                  <div key={index} className="bg-surface-container p-6 rounded-2xl flex items-center justify-between transition-all">
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
                      className="px-5 py-2 rounded-full hover:bg-surface-container-high text-primary font-bold transition-all text-sm border-none bg-transparent"
                    >
                      Change
                    </button>
                  </div>
                )
              }

              // Active Leg State
              if (isActive) {
                return (
                  <div key={index} className="bg-surface-container-low p-8 rounded-2xl space-y-6 transition-all ring-1 ring-primary/20">
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
                      
                      {/* Scoped Sort Chips */}
                      <div className="flex items-center gap-2 bg-surface-container-low p-1 rounded-full border border-outline-variant/15 self-start">
                        <button
                          onClick={() => setSortBy('price')}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border-none ${
                            sortBy === 'price'
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'text-on-surface-variant hover:text-on-surface bg-transparent'
                          }`}
                        >
                          Price
                        </button>
                        <button
                          onClick={() => setSortBy('earliest')}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border-none ${
                            sortBy === 'earliest'
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'text-on-surface-variant hover:text-on-surface bg-transparent'
                          }`}
                        >
                          Earliest
                        </button>
                        <button
                          onClick={() => setSortBy('duration')}
                          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all border-none ${
                            sortBy === 'duration'
                              ? 'bg-primary text-on-primary shadow-sm'
                              : 'text-on-surface-variant hover:text-on-surface bg-transparent'
                          }`}
                        >
                          Duration
                        </button>
                      </div>
                    </div>

                    {/* Operators List */}
                    <div className="space-y-4">
                      {rawOperators.length === 0 ? (
                        <div className="text-center py-10 bg-surface-container-lowest rounded-xl p-6">
                          <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">
                            {leg.mode === 'train' ? 'train' : leg.mode === 'launch' || leg.mode === 'ship' ? 'directions_boat' : 'directions_bus'}
                          </span>
                          <h4 className="font-headline font-bold text-lg mb-2">No operators available</h4>
                          <p className="text-sm text-on-surface-variant max-w-md mx-auto">
                            We couldn't find any {leg.mode} operators for this leg. Try searching a different route.
                          </p>
                        </div>
                      ) : filteredOperators.length === 0 ? (
                        <div className="text-center py-10 bg-surface-container-lowest rounded-xl p-6">
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
                            className="bg-surface-container-lowest rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-center justify-between hover:shadow-md transition-all border border-transparent"
                          >
                            <div className="flex items-center gap-4 w-full md:w-auto">
                              <div className="w-12 h-12 rounded-xl bg-surface-container-low flex items-center justify-center shrink-0">
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
                                  <div key={sIdx} className="text-xs bg-surface-container-low px-2.5 py-1 rounded-lg">
                                    <span className="text-on-surface-variant font-medium">{st.type}: </span>
                                    <span className="font-bold text-on-surface">৳ {st.price}</span>
                                  </div>
                                ))}
                              </div>
                              <button
                                onClick={() => handleSelect(op)}
                                className="w-full md:w-36 mt-2 font-bold py-2.5 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary hover:scale-[1.02] active:scale-98 transition-all text-sm border-none shadow-sm"
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

      {/* Floating Selection Bar */}
      {allLegsSelected && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-surface-container-lowest/80 backdrop-blur-xl border-t border-outline/10 shadow-[0_-10px_40px_-15px_rgba(0,106,78,0.15)]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">check_circle</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">All Legs Selected</p>
                <div className="flex items-center gap-3">
                  <span className="font-headline font-extrabold text-on-surface text-lg">
                    {results?.forward_legs?.length} legs selected
                  </span>
                  <span className="text-on-surface-variant font-medium">
                    • Total Cost
                  </span>
                  <span className="font-bold text-primary ml-2 text-xl">
                    ৳ {totalSum.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto font-headline">
              <button
                onClick={handleContinue}
                className="w-full md:w-auto px-8 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-98 transition-transform flex items-center justify-center gap-3 border-none cursor-pointer"
              >
                Continue to Seat Selection
                <span className="material-symbols-outlined">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
