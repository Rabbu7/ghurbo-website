import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import dayjs from 'dayjs'
import { useQuery } from '@tanstack/react-query'
import { useBooking } from '../../context/BookingContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { listHotels } from '../../api/hotel.api'

const CATEGORY_STARS = { luxury: 5, standard: 4, budget: 3 }
const FALLBACK_IMAGE = "https://lh3.googleusercontent.com/aida-public/AB6AXuAMPQVF7ALIZfUewNsU0Fv_yZf9Kos4s-K_LRqRmHh9rJm3dIPDFCmPfeUtpjH4_v3zQt7vrDf5VsWzm41bL0uqRkzACFKeEjd75cL9784BeUGbN_fIcNvKLpsCF7UMhk5vvqXQQ0kLh_j-RQEORUTP7m-5htTt0uEnvTB2x1QWanGOn-ipscjOyOn61SSreaKaM4oP8jzwcRD112bO2aMwd1ff-7EzUZdjTjAlV3r9zOLW-MGGWF92CwOWddQDeWIVgiStIvWqecI"

const formatCount = (n) => (n >= 1000 ? (n / 1000).toFixed(1) + 'k' : String(n))

export default function HotelSelection() {
  const navigate = useNavigate()
  const { searchParams, pricing, setPricing, selectHotel } = useBooking()

  const [selectedStars, setSelectedStars] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHotel, setSelectedHotel] = useState(null)
  const [selectedRoomType, setSelectedRoomType] = useState(null)
  const [roomCount, setRoomCount] = useState(1)
  const [manualNights, setManualNights] = useState(1)

  const { data: hotelsResponse, isLoading, isError } = useQuery({
    queryKey: ['hotels', searchParams.destination],
    queryFn: () => listHotels({ city: searchParams.destination || undefined }),
  })

  const hotels = (hotelsResponse?.hotels || []).map(h => ({
    id: h._id,
    name: h.name,
    city: h.city,
    district: h.district,
    category: h.category,
    stars: CATEGORY_STARS[h.category] || 4,
    rating: h.rating,
    reviewsCount: h.reviews_count,
    rooms: (h.rooms || []).map(r => ({
      type: r.type,
      price: r.price,
      totalRooms: r.total_rooms,
    })),
    amenities: h.amenities || [],
    image: (h.images && h.images[0]) || FALLBACK_IMAGE,
  }))

  const isRoundTrip = Boolean(searchParams.returnDate)
  const nights = isRoundTrip
    ? Math.max(1, dayjs(searchParams.returnDate).diff(dayjs(searchParams.date), 'day'))
    : manualNights

  const filtered = hotels.filter(h => {
    const starMatch = selectedStars.length === 0 || selectedStars.includes(h.stars)
    const nameMatch = h.name.toLowerCase().includes(searchTerm.toLowerCase())
    return starMatch && nameMatch
  })

  const toggleStar = (star) => {
    setSelectedStars(prev =>
      prev.includes(star) ? prev.filter(s => s !== star) : [...prev, star]
    )
  }

  const handleToggleHotel = (hotel) => {
    if (selectedHotel?.id === hotel.id) {
      setSelectedHotel(null)
      setSelectedRoomType(null)
    } else {
      setSelectedHotel(hotel)
      setSelectedRoomType(hotel.rooms[0])
      setRoomCount(1)
    }
  }

  const subtotal = selectedRoomType ? selectedRoomType.price * roomCount * nights : 0

  const handleConfirm = () => {
    if (!selectedHotel || !selectedRoomType) return
    selectHotel({
      hotel_id: selectedHotel.id,
      hotel_name: selectedHotel.name,
      room_type: selectedRoomType.type,
      room_count: roomCount,
      check_in: searchParams.date,
      check_out: isRoundTrip
        ? searchParams.returnDate
        : dayjs(searchParams.date).add(nights, 'day').format('YYYY-MM-DD'),
      nights,
      price_per_night: selectedRoomType.price,
      total_price: subtotal,
    })
    setPricing({
      ...pricing,
      hotel_total: subtotal,
      grand_total: (pricing?.forward_transport || 0) +
                   (pricing?.return_transport || 0) +
                   subtotal,
    })
    navigate('/booking/summary')
  }

  const handleSkipHotel = () => {
    setSelectedHotel(null)
    setSelectedRoomType(null)
    selectHotel(null)
    setPricing({
      ...pricing,
      hotel_total: 0,
      grand_total: (pricing?.forward_transport || 0) +
                   (pricing?.return_transport || 0),
    })
    navigate('/booking/summary')
  }

  return (
    <div className="bg-surface font-body text-on-surface min-h-screen flex flex-col">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          display: inline-block;
          line-height: 1;
        }
        .glass-nav { backdrop-filter: blur(24px); }
      `}</style>

      <Navbar />

      <main className={`pt-28 px-6 max-w-7xl mx-auto flex-grow ${selectedHotel ? 'pb-44' : 'pb-20'}`}>
        <header className="mb-12">
          <h1 className="font-headline text-5xl font-extrabold tracking-tighter text-on-surface mb-4">
            {searchParams.destination || "Cox's Bazar"} Escapes
          </h1>
          <p className="text-on-surface-variant text-lg max-w-2xl font-medium leading-relaxed">
            Discover curated stays where the world's longest natural beach meets architectural elegance.
          </p>
          <p className="text-on-surface-variant text-sm font-semibold mt-2">
            {isRoundTrip
              ? `${searchParams.date} — ${searchParams.returnDate} • ${nights} ${nights === 1 ? 'night' : 'nights'}`
              : `Check-in ${searchParams.date || ''} • choose your stay length below`}
          </p>
        </header>

        <div className="flex flex-col md:flex-row gap-6 mb-8 items-end">
          <div className="flex-1 w-full">
            <label className="block text-sm font-bold text-on-surface-variant mb-2 px-2">Refine Search</label>
            <div className="bg-surface-container-lowest rounded-full px-6 py-3 flex items-center shadow-sm">
              <span className="material-symbols-outlined text-primary mr-3">search</span>
              <input
                className="bg-transparent border-none focus:ring-0 w-full text-on-surface font-medium placeholder:text-outline-variant outline-none"
                placeholder="Search hotels..."
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            {[5, 4, 3].map(star => {
              const isSelected = selectedStars.includes(star)
              return (
                <button
                  key={star}
                  onClick={() => toggleStar(star)}
                  className={`px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${
                    isSelected ? 'bg-secondary-container text-on-secondary-container' : 'bg-surface-container-highest text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]" style={{ fontVariationSettings: isSelected ? "'FILL' 1" : "'FILL' 0" }}>star</span>
                  {star}-Star
                </button>
              )
            })}
            <button className="bg-surface-container-highest text-on-surface-variant px-4 py-3 rounded-full font-bold flex items-center gap-2 hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">tune</span>
            </button>
          </div>
        </div>

        <div className="mb-12 flex justify-start">
          <button onClick={handleSkipHotel} className="text-sm font-semibold text-primary underline hover:opacity-80 transition-opacity">
            Already arranged your own stay? Skip hotel selection →
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            {isLoading && (
              <div className="text-center py-20 text-on-surface-variant font-medium">
                Loading hotels...
              </div>
            )}
            {isError && (
              <div className="text-center py-20 text-tertiary font-medium">
                Couldn't load hotels right now. Please try again.
              </div>
            )}

            {!isLoading && !isError && (
              <>
                {filtered.length === 0 && (
                  <div className="text-center py-20 text-on-surface-variant font-medium">
                    No hotels found for {searchParams.destination || 'this destination'} yet.
                    <br />
                    <span className="text-sm">Try Cox's Bazar, Sylhet, Sreemangal, Bandarban, Rangamati, Sundarbans, Kuakata, Sajek Valley, or Saint Martin Island.</span>
                  </div>
                )}

                {filtered.map(hotel => {
                  const isSelected = selectedHotel?.id === hotel.id
                  const lowestPrice = Math.min(...hotel.rooms.map(r => r.price))
                  return (
                    <article
                      key={hotel.id}
                      onClick={() => handleToggleHotel(hotel)}
                      className={`bg-surface-container-lowest rounded-lg overflow-hidden flex flex-col md:flex-row group transition-all duration-300 cursor-pointer ${isSelected ? 'ring-2 ring-primary' : ''}`}
                    >
                      <div className="md:w-2/5 relative h-64 md:h-auto overflow-hidden">
                        <img className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt={hotel.name} src={hotel.image} />
                        <div className="absolute top-4 left-4 bg-surface/90 backdrop-blur-md px-3 py-1 rounded-full flex items-center gap-1 shadow-sm">
                          <span className="material-symbols-outlined text-[16px] text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
                          <span className="text-xs font-black text-on-surface">{hotel.rating} ({formatCount(hotel.reviewsCount)})</span>
                        </div>
                      </div>
                      <div className="md:w-3/5 p-8 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h2 className="font-headline text-2xl font-extrabold text-on-surface">{hotel.name}</h2>
                            <span className="material-symbols-outlined text-outline hover:text-error cursor-pointer transition-colors">favorite</span>
                          </div>
                          <div className="flex items-center gap-2 text-on-surface-variant mb-6">
                            <span className="material-symbols-outlined text-primary text-[18px]">location_on</span>
                            <span className="text-sm font-semibold uppercase tracking-wider">
                              {hotel.city}{hotel.district && hotel.district !== hotel.city ? `, ${hotel.district}` : ''}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {hotel.amenities.map((a, i) => (
                              <span key={i} className="bg-surface-container-low text-on-primary-fixed-variant px-3 py-1 rounded-md text-[11px] font-bold uppercase">{a}</span>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-end justify-between border-t border-surface-container-low pt-6">
                          <div>
                            <span className="text-on-surface-variant text-sm font-medium">From</span>
                            <div className="flex items-baseline gap-1">
                              <span className="text-3xl font-extrabold text-on-surface">৳{lowestPrice.toLocaleString()}</span>
                              <span className="text-on-surface-variant text-sm">/night</span>
                            </div>
                          </div>
                          <button
                            onClick={(e) => { e.stopPropagation(); handleToggleHotel(hotel) }}
                            className={`px-8 py-3 rounded-full font-bold shadow-lg transition-all ${isSelected ? 'bg-primary text-on-primary' : 'bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-primary/20 hover:shadow-primary/30'}`}
                          >
                            {isSelected ? '✓ Selected' : 'Select Room'}
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </>
            )}
          </div>

          <div className="lg:col-span-4 space-y-8">
            <section className="bg-surface-container-low rounded-lg p-1 overflow-hidden h-[400px] relative">
              <div className="w-full h-full rounded-md overflow-hidden bg-surface-container-highest">
                <img className="w-full h-full object-cover grayscale opacity-50 mix-blend-multiply" alt="Stylized map showing hotel locations along the coast" src="https://lh3.googleusercontent.com/aida-public/AB6AXuARTBThXcpymnVkAUJhayyjL_vTJjRp8iLOH6tctc41y5F3qy1U5LQ3K3ngkF5ZHYhdQWY1sQ4waJ9sg4KgtRwrP6AVvdYSHiqX4jaJxm1q2QFmetPNobU60Dk6QrzQQp9DlsMb1XuqOIgeNII09vWQgWYUVsI-0Cn0PYWEf6UAOSoYYJ3XAKecKWbB6SBjUv1yNDPWXfJ2WPTQTWbo4ZcgcdVN-R85VAs0Cvio79vdgs1RFfvRbMWeFkMMRkgUyespWXxz9-GKZrA" />
              </div>
              <div className="absolute bottom-6 left-6 right-6">
                <button className="w-full bg-surface-container-lowest text-on-surface py-3 rounded-full font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-white transition-colors">
                  <span className="material-symbols-outlined">map</span>
                  View Full Area Map
                </button>
              </div>
            </section>

            <section className="bg-surface-container-high rounded-lg p-8 relative overflow-hidden">
              <div className="relative z-10">
                <span className="text-tertiary font-bold text-xs uppercase tracking-[0.2em] mb-4 block">Traveler's Choice</span>
                <h3 className="font-headline text-2xl font-extrabold text-on-surface mb-4 leading-tight">Plan the perfect itinerary</h3>
                <p className="text-on-surface-variant text-sm mb-6 leading-relaxed">Our curators recommend pairing your stay with a local sunrise tour and a regional dinner experience.</p>
                <button className="bg-on-surface text-surface px-6 py-2 rounded-full font-bold text-sm hover:opacity-90 transition-opacity">Explore Guide</button>
              </div>
              <span className="material-symbols-outlined absolute -bottom-10 -right-10 text-[200px] text-surface-container-highest opacity-30 rotate-12">explore</span>
            </section>

            <section className="bg-surface-container-lowest rounded-lg p-6 border-l-4 border-primary">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-low flex items-center justify-center font-bold text-primary">KA</div>
                <div>
                  <p className="font-bold text-on-surface leading-none">Karim Ahmed</p>
                  <p className="text-xs text-on-surface-variant font-medium">Verified guest</p>
                </div>
              </div>
              <p className="italic text-on-surface-variant text-sm leading-relaxed">"The view from the rooftop was unparalleled. A core memory now."</p>
            </section>
          </div>
        </div>
      </main>

      {selectedHotel && (
        <div className="fixed bottom-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-t border-emerald-100 py-4 px-6 md:px-12 shadow-2xl">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-6 flex-wrap">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Hotel</span>
                <span className="font-bold text-on-surface">{selectedHotel.name}</span>
              </div>
              <div className="h-8 w-[1px] bg-outline-variant/30 hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Room Type</span>
                <div className="flex gap-2 flex-wrap">
                  {selectedHotel.rooms.map((rt, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedRoomType(rt)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${selectedRoomType?.type === rt.type ? 'bg-primary text-on-primary' : 'bg-secondary-container text-on-secondary-container'}`}
                    >
                      {rt.type} · ৳{rt.price.toLocaleString()}
                    </button>
                  ))}
                </div>
              </div>
              <div className="h-8 w-[1px] bg-outline-variant/30 hidden md:block"></div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Rooms</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => setRoomCount(r => Math.max(1, r - 1))} className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface">−</button>
                  <span className="font-bold w-4 text-center">{roomCount}</span>
                  <button onClick={() => setRoomCount(r => Math.min(selectedRoomType?.totalRooms || 5, r + 1))} className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface">+</button>
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-outline uppercase tracking-wider">Nights</span>
                {isRoundTrip ? (
                  <span className="font-bold text-on-surface">{nights} (set by return date)</span>
                ) : (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setManualNights(n => Math.max(1, n - 1))} className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface">−</button>
                    <span className="font-bold w-4 text-center">{manualNights}</span>
                    <button onClick={() => setManualNights(n => n + 1)} className="w-7 h-7 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-on-surface">+</button>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-6 w-full md:w-auto">
              <div className="text-right hidden sm:block">
                <p className="text-[10px] font-bold text-outline uppercase tracking-wider">Subtotal</p>
                <p className="text-xl font-black text-on-surface">৳{subtotal.toLocaleString()}</p>
              </div>
              <button onClick={handleConfirm} className="w-full md:w-auto px-10 py-4 rounded-full font-bold text-sm bg-primary text-on-primary hover:shadow-lg transition-all">
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  )
}