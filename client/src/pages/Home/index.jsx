import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useBooking } from '../../context/BookingContext'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Home() {
  const navigate = useNavigate()
  const { setSearchParams } = useBooking()
  const [origin, setOrigin] = useState('')
  const [destination, setDestination] = useState('')
  const [date, setDate] = useState('')
  const [activeFilter, setActiveFilter] = useState('Coastal')
  const [tripType, setTripType] = useState('one_way')
  const [returnDate, setReturnDate] = useState('')

  const handleSearch = () => {
    if (!origin || !destination) return
    setSearchParams({
      origin,
      destination,
      date,
      returnDate,
      tripType,
    })
    navigate('/search')
  }

  return (
    <div className="bg-background font-body text-on-surface selection:bg-primary-container">
      {/* TopNavBar */}
      <Navbar />

      <main className="pt-24">
        {/* Hero Section */}
        <section className="relative px-6 md:px-12 lg:px-20 py-12 min-h-[870px] flex flex-col justify-center">
          <div className="absolute inset-0 z-0 overflow-hidden px-6 md:px-12 py-6">
            <div className="w-full h-full rounded-xl bg-surface-container-highest relative overflow-hidden">
              <img
                alt="Sundarbans Mangrove Forest"
                className="w-full h-full object-cover opacity-80 mix-blend-multiply"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNFPuj6Qy0jXh7oYhimIP49Q2PCBNUR8Kq80BHitPTw3dLoDBIw3JBknym3JAftAz0_P-XB7pzESkz-QnXEIAivpZldFgqWe6YBkTbB6-BksgvR-K9S-zMRP3pKm_L-JxzXOShOHNKjjU0X-66fMFJjwsDA9MRRZMQ0dkXR8svGAdjMYR9brPHJ90WxAydz6ASSwkLhHl1R3U831G1ERTwNjCtcTo0iXh_Pxt_i4cvPetHtpGpVCeD2g_39NbTsXsTKc7C3ts-xhM"
              />
              <div className="absolute inset-0 bg-black/30 z-10"></div>
              <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent"></div>
            </div>
          </div>
          <div className="relative z-10 max-w-4xl">
            <h1
              className="font-headline text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight mb-8 text-white"
              style={{ textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              Discover the Soul of the <span className="text-primary-fixed">Evergreen</span> Delta.
            </h1>
            <p
              className="font-body text-xl max-w-2xl mb-12 text-white/90"
              style={{ textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              Journey through misty tea gardens, serene riverways, and the world&apos;s longest golden sands. Curated experiences for the modern explorer.
            </p>

            {/* Search Bento Box */}
            <div className="bg-surface-container-lowest p-2 rounded-xl shadow-xl max-w-5xl" style={{ boxShadow: '0 20px 40px -5px rgba(0, 54, 44, 0.06)' }}>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                <div className="col-span-1 md:col-span-4 flex gap-2 px-4 pt-3">
                  <button
                    onClick={() => setTripType('one_way')}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                      tripType === 'one_way'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    One Way
                  </button>
                  <button
                    onClick={() => setTripType('round_trip')}
                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all ${
                      tripType === 'round_trip'
                        ? 'bg-primary text-on-primary'
                        : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
                    }`}
                  >
                    Round Trip
                  </button>
                </div>

                <div className="p-4 flex flex-col gap-1 hover:bg-surface-container-low rounded-lg transition-colors group">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-2">Origin</label>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">location_on</span>
                    <input className="bg-transparent border-none focus:ring-0 font-headline font-bold text-lg w-full placeholder:text-outline-variant" placeholder="Dhaka" type="text" value={origin} onChange={e => setOrigin(e.target.value)} />
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-1 hover:bg-surface-container-low rounded-lg transition-colors">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-2">Destination</label>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">explore</span>
                    <input className="bg-transparent border-none focus:ring-0 font-headline font-bold text-lg w-full placeholder:text-outline-variant" placeholder="Cox's Bazar" type="text" value={destination} onChange={e => setDestination(e.target.value)} />
                  </div>
                </div>
                <div className="p-4 flex flex-col gap-1 hover:bg-surface-container-low rounded-lg transition-colors">
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-2">Date</label>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary">calendar_month</span>
                    <input className="bg-transparent border-none focus:ring-0 font-headline font-bold text-lg w-full placeholder:text-outline-variant" placeholder="24 Oct, 2024" type="date" value={date} onChange={e => setDate(e.target.value)} />
                  </div>
                </div>

                {tripType === 'round_trip' && (
                  <div className="col-span-1 md:col-span-4 px-4 pb-2 flex flex-col gap-1 hover:bg-surface-container-low rounded-lg transition-colors">
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-widest px-2">
                      Return Date
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-primary text-xl">event_available</span>
                      <input
                        type="date"
                        value={returnDate}
                        onChange={e => setReturnDate(e.target.value)}
                        className="bg-transparent border-none outline-none font-headline font-bold text-lg w-full text-on-surface placeholder:text-outline-variant"
                      />
                    </div>
                  </div>
                )}

                <div className="p-2">
                  <button onClick={handleSearch} className="w-full h-full bg-primary hover:bg-primary-dim text-on-primary rounded-lg font-headline font-bold text-lg flex items-center justify-center gap-2 transition-all group">
                    <span className="material-symbols-outlined transition-transform group-hover:scale-110">search</span>
                    Explore
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick Filters */}
        <section className="px-6 md:px-12 lg:px-20 mb-20">
          <div className="flex flex-wrap gap-4 items-center">
            <span className="font-headline font-bold text-on-surface-variant mr-4">Quick Search:</span>
            <button
              onClick={() => setActiveFilter('Coastal')}
              className={`${
                activeFilter === 'Coastal'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container-high text-on-surface'
              } px-6 py-2 rounded-full font-headline font-semibold flex items-center gap-2 hover:bg-secondary-fixed transition-colors`}
            >
              <span className="material-symbols-outlined text-lg">beach_access</span> Coastal
            </button>
            <button
              onClick={() => setActiveFilter('Wildlife')}
              className={`${
                activeFilter === 'Wildlife'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container-high text-on-surface'
              } px-6 py-2 rounded-full font-headline font-semibold flex items-center gap-2 hover:bg-surface-container-highest transition-colors`}
            >
              <span className="material-symbols-outlined text-lg">forest</span> Wildlife
            </button>
            <button
              onClick={() => setActiveFilter('Heritage')}
              className={`${
                activeFilter === 'Heritage'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container-high text-on-surface'
              } px-6 py-2 rounded-full font-headline font-semibold flex items-center gap-2 hover:bg-surface-container-highest transition-colors`}
            >
              <span className="material-symbols-outlined text-lg">temple_buddhist</span> Heritage
            </button>
            <button
              onClick={() => setActiveFilter('Hill Tracts')}
              className={`${
                activeFilter === 'Hill Tracts'
                  ? 'bg-secondary-container text-on-secondary-container'
                  : 'bg-surface-container-high text-on-surface'
              } px-6 py-2 rounded-full font-headline font-semibold flex items-center gap-2 hover:bg-surface-container-highest transition-colors`}
            >
              <span className="material-symbols-outlined text-lg">filter_hdr</span> Hill Tracts
            </button>
          </div>
        </section>

        {/* Featured Destinations - Asymmetric Layout */}
        <section className="px-6 md:px-12 lg:px-20 mb-32">
          <div className="flex justify-between items-end mb-12">
            <div className="max-w-xl">
              <h2 className="font-headline text-4xl font-extrabold mb-4 tracking-tight">Handpicked Escapes</h2>
              <p className="text-on-surface-variant leading-relaxed">Beyond the maps. Explore curated destinations that capture the authentic spirit of Bangladesh.</p>
            </div>
            <button onClick={() => navigate('/search')} className="text-primary font-headline font-bold flex items-center gap-1 group">
              View All Destinations{' '}
              <span className="material-symbols-outlined text-lg group-hover:translate-x-1 transition-transform">arrow_forward</span>
            </button>
          </div>
          <div className="grid grid-cols-12 gap-8">
            {/* Large Feature */}
            <div className="col-span-12 lg:col-span-7 group">
              <div className="relative h-[500px] rounded-xl overflow-hidden shadow-lg" style={{ boxShadow: '0 20px 40px -5px rgba(0, 54, 44, 0.06)' }}>
                <img
                  alt="Cox's Bazar Beach"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqn8OsRsDdbVT9uUpHeg2dkThFMt_tA_97kPK1k0J2Y7r4zoeVDbHAd112cDxoOyo0ehYXTVXREYz4IqBtu4zOF1raVWpeVhe3tt4YWsDqCQfoMopcOjGUGdfF5zPhFSh3oVbL-I0KAmdeu-oVewUDMul5VAfpIOlHdx2EaDywZx1oOZP_qoDiPHPL8Tn3-j2REDmOGLr3fbc6ZkSsrwI5DcnxjS3qQ4ncGKLo8xu9FZH_OKeN-2uBB5CtdFYEpOMxSkd8eEzR2VM"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 text-on-primary">
                  <span className="bg-tertiary text-on-tertiary px-3 py-1 rounded-full text-xs font-bold tracking-widest uppercase mb-4 inline-block">Trending</span>
                  <h3 className="font-headline text-4xl font-bold mb-2">Cox&apos;s Bazar</h3>
                  <p className="text-on-primary/80 max-w-md">Walk the 120km unbroken sea beach, where the Bay of Bengal meets the golden horizon.</p>
                </div>
              </div>
            </div>
            {/* Secondary Features Stack */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-8">
                <div className="group relative h-[234px] rounded-xl overflow-hidden shadow-lg" style={{ boxShadow: '0 20px 40px -5px rgba(0, 54, 44, 0.06)' }}>
                  <img
                    alt="Sylhet Tea Gardens"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBV6MgFj-IGG_ddWUOMtih3ZlqvHErE9sj7dLHhuz4YpWkzx90tOyIhl0MGMkX9pgLZAL9sj7w0kRzK4w8WSB9EdcoV04d_4Jgunporas9yFh5KAg4QKsR7oNIVBIeyjH_XtbQRVl5xBHDtbK1nYyoCKLXskrjYLVajSSUgLMn9KJfzyTizEfutBPxmEuVy6K2eTL81bfpBOp57u0RS1bEkYA72EucQL6O5p4qtXz2tA5nYdOQ7tuXUE_l0qKPBb4sA47RB_Drq9oM"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-on-primary">
                    <h3 className="font-headline text-2xl font-bold">Sylhet</h3>
                    <p className="text-sm text-on-primary/80">Rolling hills and aromatic tea gardens.</p>
                  </div>
                </div>
                <div className="group relative h-[234px] rounded-xl overflow-hidden shadow-lg" style={{ boxShadow: '0 20px 40px -5px rgba(0, 54, 44, 0.06)' }}>
                  <img
                    alt="Rangamati Lake"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuArdrNUaHg_z5PDGfuhbKT0Hz3IbGJYyaDnQL3wYpKo4Uy26RPQZ2HGIvk5R2PzzdsYkEkokBzksbvNtV9z6EovNBNptImbL8hrZKSPvgKDppTNo9cysRqCZzJSWbUh6LnIYDWVCKXVEr97JLY_Bsx2up0-hrm2A4P0LMMfbd3I53yEgyiEPsLxKaMggTFRQ8dCF17v9KHjrXxVpLS6oN2KGP7scQuX2GTDZvo5kvQgwLek0N15JRRNw0Cfy68WUSsCayWC2TBZp5E"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-6 text-on-primary">
                    <h3 className="font-headline text-2xl font-bold">Rangamati</h3>
                    <p className="text-sm text-on-primary/80">Boat rides across the heart of the hill tracts.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Routes Bento Grid */}
        <section className="px-6 md:px-12 lg:px-20 mb-32">
          <h2 className="font-headline text-4xl font-extrabold mb-12 tracking-tight text-center">Seamless Travel Routes</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {/* Route Card 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-lg hover:bg-surface-container transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">directions_bus</span>
                </div>
                <span className="text-tertiary font-bold">৳ 1,200</span>
              </div>
              <h4 className="font-headline font-bold text-xl mb-1">Dhaka → Cox&apos;s Bazar</h4>
              <p className="text-on-surface-variant text-sm mb-6">Non-AC &amp; AC sleeper buses</p>
              <button onClick={() => navigate('/search')} className="w-full py-3 rounded-full bg-surface-container-high font-bold group-hover:bg-primary group-hover:text-on-primary transition-all">Book Now</button>
            </div>
            {/* Route Card 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-lg hover:bg-surface-container transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-secondary">
                  <span className="material-symbols-outlined">train</span>
                </div>
                <span className="text-tertiary font-bold">৳ 650</span>
              </div>
              <h4 className="font-headline font-bold text-xl mb-1">Dhaka → Sylhet</h4>
              <p className="text-on-surface-variant text-sm mb-6">Parabat &amp; Upaban Express</p>
              <button onClick={() => navigate('/search')} className="w-full py-3 rounded-full bg-surface-container-high font-bold group-hover:bg-primary group-hover:text-on-primary transition-all">Book Now</button>
            </div>
            {/* Route Card 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-lg hover:bg-surface-container transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary">
                  <span className="material-symbols-outlined">flight</span>
                </div>
                <span className="text-tertiary font-bold">৳ 4,500</span>
              </div>
              <h4 className="font-headline font-bold text-xl mb-1">Dhaka → Jashore</h4>
              <p className="text-on-surface-variant text-sm mb-6">Biman Bangladesh &amp; US-Bangla</p>
              <button onClick={() => navigate('/search')} className="w-full py-3 rounded-full bg-surface-container-high font-bold group-hover:bg-primary group-hover:text-on-primary transition-all">Book Now</button>
            </div>
            {/* Route Card 4 */}
            <div className="bg-surface-container-lowest p-6 rounded-lg hover:bg-surface-container transition-colors group">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
                  <span className="material-symbols-outlined">directions_boat</span>
                </div>
                <span className="text-tertiary font-bold">৳ 1,800</span>
              </div>
              <h4 className="font-headline font-bold text-xl mb-1">Dhaka → Barishal</h4>
              <p className="text-on-surface-variant text-sm mb-6">Luxury Triple-Deck Launches</p>
              <button onClick={() => navigate('/search')} className="w-full py-3 rounded-full bg-surface-container-high font-bold group-hover:bg-primary group-hover:text-on-primary transition-all">Book Now</button>
            </div>
          </div>
        </section>

        {/* Editorial Content Block */}
        <section className="px-6 md:px-12 lg:px-20 mb-32">
          <div className="bg-surface-container-low rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2">
            <div className="p-12 md:p-20 flex flex-col justify-center">
              <span className="text-primary font-bold tracking-[0.2em] uppercase text-sm mb-6">Our Commitment</span>
              <h2 className="font-headline text-4xl md:text-5xl font-extrabold mb-8 leading-tight">Authentic Travels, <br />Responsible Tourism.</h2>
              <p className="text-on-surface-variant text-lg leading-relaxed mb-10">
                At GHURBO, we believe in travel that gives back. We partner with local guides and eco-friendly resorts to ensure your journey through Bangladesh respects the environment and empowers local communities.
              </p>
              <div className="flex gap-8">
                <div>
                  <div className="text-3xl font-black text-primary mb-1">500+</div>
                  <div className="text-sm font-bold text-on-surface-variant uppercase tracking-tighter">Local Guides</div>
                </div>
                <div>
                  <div className="text-3xl font-black text-primary mb-1">20k+</div>
                  <div className="text-sm font-bold text-on-surface-variant uppercase tracking-tighter">Happy Explorers</div>
                </div>
              </div>
            </div>
            <div className="relative min-h-[400px]">
              <img
                alt="Traditional Boat"
                className="absolute inset-0 w-full h-full object-cover"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBW4Us1Uz-V7g_tBKTKPE-yRJDkIkDnnRERHPbuFU1OypvTdbBRmoxEdoucExK0SoJIsMr_WZonLMi0uxCxPRbsIidSZnhrlbzOzXtRLipXVSB2g8axdhITPQdwBYazUXxqgMDkN7CjX7w4eAW6rC4htXZ4OBwxUCr2bzqa-PqlzLF5zpdZp37jvbgW0PWf-jjAT2HcdpW2l_nkinr3vcvmZQWgMVS49QsddX-Iq80oioNdHTPgzRIQFVztyPzi0hasoFHbrOMvZlk"
              />
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* FAB for Mobile Quick Action */}
      <div className="md:hidden fixed bottom-8 right-8 z-50">
        <button onClick={() => navigate('/search')} className="w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center" style={{ boxShadow: '0 20px 40px -5px rgba(0, 54, 44, 0.06)' }}>
          <span className="material-symbols-outlined">map</span>
        </button>
      </div>
    </div>
  )
}
