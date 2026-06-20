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
  const [sortBy, setSortBy] = useState('earliest')
  const [selectedTransport, setSelectedTransport] = useState(null)
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

  // Flatten operators from all legs into a single list
  const allOperators = results?.forward_legs?.flatMap(leg =>
    (leg.operators || []).map(op => ({ ...op, leg }))
  ) || []

  // Sort operators
  const sortedOperators = [...allOperators].sort((a, b) => {
    if (sortBy === 'price')
      return (a.seat_types?.[0]?.price || 0) - (b.seat_types?.[0]?.price || 0)
    if (sortBy === 'earliest')
      return (a.schedules?.[0]?.departure || '').localeCompare(
        b.schedules?.[0]?.departure || ''
      )
    return 0
  })

  const handleSelectOperator = (operator) => {
    setSelectedTransport(operator)
    selectForwardLeg(operator)
  }

  const handleContinue = () => {
    if (!selectedTransport) return
    navigate('/search/outbound')
  }

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

      <main className="pt-28 pb-20 px-4 md:px-8 max-w-7xl mx-auto flex-grow">
        {/* Search Context Header */}
        <header className="mb-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-headline font-extrabold text-on-surface tracking-tight mb-2">
                {searchParams.origin || 'Origin'} to {searchParams.destination || 'Destination'}
              </h1>
              <p className="text-on-surface-variant font-medium flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">calendar_today</span>
                {searchParams.date || ''} • 1 Passenger
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
              className="flex items-center gap-2 px-6 py-3 bg-surface-container-low rounded-xl text-on-surface-variant font-bold hover:bg-surface-container-highest transition-all"
            >
              <span className="material-symbols-outlined">edit</span>
              Modify Search
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Filters Sidebar */}
          <aside className="lg:col-span-3 sticky top-28 space-y-8">
            <div className="bg-surface-container-low p-6 rounded-lg">
              <h3 className="font-headline font-bold text-lg mb-6 flex items-center justify-between">
                Filters
                <span className="text-sm font-label text-primary font-semibold cursor-pointer">Clear All</span>
              </h3>
              {/* Transport Type */}
              <div className="mb-8">
                <label className="block text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Transport Type</label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-outline group-hover:border-primary transition-colors flex items-center justify-center bg-surface-container-lowest">
                      <div className="w-2.5 h-2.5 bg-primary rounded-sm opacity-0"></div>
                    </div>
                    <span className="font-medium text-on-surface">Bus</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-primary transition-colors flex items-center justify-center bg-primary">
                      <span className="material-symbols-outlined text-on-primary text-xs" style={{ fontVariationSettings: "'wght' 700" }}>check</span>
                    </div>
                    <span className="font-bold text-on-surface">Train</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 rounded border-2 border-outline group-hover:border-primary transition-colors flex items-center justify-center bg-surface-container-lowest">
                      <div className="w-2.5 h-2.5 bg-primary rounded-sm opacity-0"></div>
                    </div>
                    <span className="font-medium text-on-surface">Ship / Launch</span>
                  </label>
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
                  <button className="p-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs font-bold text-center hover:bg-primary-container hover:border-primary transition-all">
                    Morning<br /><span className="opacity-60">06:00-12:00</span>
                  </button>
                  <button className="p-3 rounded-xl border border-primary bg-primary-container text-xs font-bold text-center transition-all">
                    Afternoon<br /><span className="opacity-60">12:00-18:00</span>
                  </button>
                  <button className="p-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs font-bold text-center hover:bg-primary-container transition-all">
                    Evening<br /><span className="opacity-60">18:00-00:00</span>
                  </button>
                  <button className="p-3 rounded-xl border border-outline-variant bg-surface-container-lowest text-xs font-bold text-center hover:bg-primary-container transition-all">
                    Night<br /><span className="opacity-60">00:00-06:00</span>
                  </button>
                </div>
              </div>
            </div>
          </aside>

          {/* Results List */}
          <section className="lg:col-span-9 space-y-6">
            {/* Sorting Bar */}
            <div className="flex items-center gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <span className="text-sm font-bold text-on-surface-variant whitespace-nowrap">Sort by:</span>
              <button
                onClick={() => setSortBy('price')}
                className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  sortBy === 'price'
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                Price (Low to High)
              </button>
              <button
                onClick={() => setSortBy('earliest')}
                className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  sortBy === 'earliest'
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                Earliest Departure
              </button>
              <button
                onClick={() => setSortBy('duration')}
                className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  sortBy === 'duration'
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                Duration
              </button>
              <button
                onClick={() => setSortBy('rated')}
                className={`px-5 py-2 rounded-full font-bold text-sm whitespace-nowrap transition-all ${
                  sortBy === 'rated'
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'bg-surface-container-highest text-on-surface'
                }`}
              >
                Top Rated
              </button>
            </div>

            {/* Dynamic Card Rendering */}
            {loading && (
              <div className="text-center py-20 text-on-surface-variant font-medium">
                Searching routes...
              </div>
            )}
            {error && (
              <div className="text-center py-20 text-error font-medium">{error}</div>
            )}
            {!loading && !error && sortedOperators.map((op, idx) => (
              <div
                key={idx}
                onClick={() => handleSelectOperator(op)}
                className={`bg-surface-container-lowest rounded-lg editorial-shadow overflow-hidden group cursor-pointer transition-all ${
                  selectedTransport === op ? 'ring-2 ring-primary' : ''
                }`}
              >
                <div className="p-8 flex flex-col md:flex-row gap-8">
                  <div className="md:w-1/4 flex items-start gap-4">
                    <div className="w-16 h-16 rounded-xl bg-surface-container-low flex items-center justify-center">
                      <span className="material-symbols-outlined text-3xl text-on-surface-variant">
                        {op.mode === 'train' ? 'train' :
                         op.mode === 'ship' || op.mode === 'launch' ? 'directions_boat' :
                         'directions_bus'}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-headline font-bold text-on-surface">{op.operator_name}</h4>
                      <p className="text-xs font-bold text-secondary mt-1">
                        {op.mode?.toUpperCase()} • {op.leg?.from} → {op.leg?.to}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 items-center gap-6">
                    <div className="text-center">
                      <h4 className="text-xl font-headline font-bold text-on-surface">
                        {op.schedules?.[0]?.departure || '--:--'}
                      </h4>
                      <p className="text-xs font-medium text-on-surface-variant">{op.leg?.from}</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <span className="text-xs font-bold text-on-surface-variant mb-1">
                        {op.schedules?.[0]?.duration_hours}h
                      </span>
                      <div className="w-full flex items-center gap-2">
                        <div className="h-[1px] flex-1 border-t-2 border-dashed border-outline-variant"></div>
                        <span className="material-symbols-outlined text-outline-variant">schedule</span>
                        <div className="h-[1px] flex-1 border-t-2 border-dashed border-outline-variant"></div>
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="text-xl font-headline font-bold text-on-surface">
                        {op.schedules?.[0]?.arrival || '--:--'}
                      </h4>
                      <p className="text-xs font-medium text-on-surface-variant">{op.leg?.to}</p>
                    </div>
                  </div>
                  <div className="md:w-48 flex flex-col justify-center items-center md:items-end gap-3">
                    <div className="text-right">
                      <p className="text-sm font-medium text-on-surface-variant">Starts from</p>
                      <h3 className="text-2xl font-headline font-black text-on-surface">
                        ৳ {op.seat_types?.[0]?.price?.toLocaleString() || 'N/A'}
                      </h3>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSelectOperator(op)
                      }}
                      className={`w-full font-bold py-3 rounded-full transition-all ${
                        selectedTransport === op
                          ? 'bg-primary text-on-primary'
                          : 'bg-gradient-to-br from-primary to-primary-container text-on-primary hover:scale-105'
                      }`}
                    >
                      {selectedTransport === op ? '✓ Selected' : 'Select'}
                    </button>
                    {op.seat_types?.[0]?.available_seats <= 12 && (
                      <span className="text-xs font-bold text-tertiary">
                        Only {op.seat_types[0].available_seats} seats left
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Pagination/Load More */}
            {!loading && !error && (
              <div className="pt-10 flex flex-col items-center">
                <button className="px-8 py-4 rounded-full bg-surface-container-low text-on-surface font-bold flex items-center gap-3 hover:bg-surface-container-highest transition-colors">
                  Show more results
                  <span className="material-symbols-outlined">expand_more</span>
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {/* Floating Selection Bar */}
      {selectedTransport && (
        <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-surface-container-lowest/80 backdrop-blur-xl border-t border-outline/10 shadow-[0_-10px_40px_-15px_rgba(0,106,78,0.15)]">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary">
                <span className="material-symbols-outlined">flight_takeoff</span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">Departure Selected</p>
                <div className="flex items-center gap-3">
                  <span className="font-headline font-extrabold text-on-surface text-lg">
                    {selectedTransport.operator_name}
                  </span>
                  <span className="text-on-surface-variant font-medium">
                    • {selectedTransport.schedules?.[0]?.departure} - {selectedTransport.schedules?.[0]?.arrival}
                  </span>
                  <span className="font-bold text-primary ml-2">
                    ৳ {selectedTransport.seat_types?.[0]?.price?.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <button
                onClick={handleContinue}
                className="flex-1 md:flex-none px-8 py-4 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-105 transition-transform flex items-center justify-center gap-3"
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
