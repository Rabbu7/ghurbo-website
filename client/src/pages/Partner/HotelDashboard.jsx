import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { getPartnerDashboard } from '../../api/partner.api'

export default function HotelPartnerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  const { data, isLoading } = useQuery({
    queryKey: ['partnerDashboard'],
    queryFn: getPartnerDashboard,
  })

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
      </div>
    )
  }

  const partner = data?.partner
  const hotels = data?.hotels || []
  const stats = data?.stats
  const recentBookings = data?.recentBookings || []

  const maxRevenue = Math.max(...(stats?.revenueByDay?.map(d => d.amount) || [0]), 1)

  const handleComingSoon = () => toast('Coming soon')

  const fmtAxis = (iso) => {
    if (!iso) return ''
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const firstDate = stats?.revenueByDay?.[0]?.date ? fmtAxis(stats.revenueByDay[0].date) : ''
  const middleDate = stats?.revenueByDay?.length 
    ? fmtAxis(stats.revenueByDay[Math.floor(stats.revenueByDay.length / 2)].date) 
    : ''
  const lastDate = stats?.revenueByDay?.length 
    ? fmtAxis(stats.revenueByDay[stats.revenueByDay.length - 1].date) 
    : ''

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body">
      {/* SideNavBar (Desktop) */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 bg-surface-container-low p-4 gap-2 z-50">
        <div className="mb-8 px-4">
          <h1 className="text-lg font-extrabold text-on-surface leading-tight font-headline">Provider Portal</h1>
          <p className="text-xs text-on-surface-variant opacity-70">Management Suite</p>
        </div>
        <nav className="flex flex-col gap-2 flex-grow">
          {/* Dashboard is active, on this page, not a Link */}
          <span className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-high text-on-surface font-bold transition-all duration-300 ease-in-out cursor-default">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-bold">Dashboard</span>
          </span>
          <button 
            onClick={handleComingSoon}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high/50 transition-all duration-300 ease-in-out w-full text-left"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-medium">Inventory</span>
          </button>
          <button 
            onClick={handleComingSoon}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high/50 transition-all duration-300 ease-in-out w-full text-left"
          >
            <span className="material-symbols-outlined">confirmation_number</span>
            <span className="font-medium">Bookings</span>
          </button>
          <button 
            onClick={handleComingSoon}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high/50 transition-all duration-300 ease-in-out w-full text-left"
          >
            <span className="material-symbols-outlined">payments</span>
            <span className="font-medium">Revenue</span>
          </button>
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <button 
            onClick={handleComingSoon}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 px-6 rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-primary/10 hover:opacity-90 transition-opacity"
          >
            <span className="material-symbols-outlined">add</span>
            Add Listing
          </button>
          <button
            onClick={() => { logout(); navigate('/') }}
            className="text-on-surface-variant text-sm font-medium text-center py-2 hover:text-on-surface transition-colors cursor-pointer"
          >
            Logout
          </button>
        </div>
      </aside>

      {/* Main Canvas */}
      <main className="md:ml-64 p-6 lg:p-10 space-y-8 pb-24 md:pb-10">
        {/* TopAppBar */}
        <header className="flex justify-between items-center mb-10">
          <div>
            <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">Hotel Dashboard</h2>
            <p className="text-on-surface-variant font-medium">Welcome back, {user?.name}, owner of {partner?.business_name}</p>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-3 bg-surface-container-low rounded-full hover:bg-surface-container-high transition-colors">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-on-surface-variant hover:text-primary transition-colors"
                aria-label="Profile"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_circle
                </span>
              </button>
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-lg shadow-2xl py-2 z-50">
                  <Link
                    to="/profile"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl text-on-surface-variant">person</span>
                    View Profile
                  </Link>
                  <button
                    onClick={() => {
                      setMenuOpen(false)
                      logout()
                      navigate('/')
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-tertiary hover:bg-surface-container transition-colors text-left"
                  >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Availability Bento Grid */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hotels.length === 0 ? (
            <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-dim p-8 rounded-lg relative overflow-hidden group flex flex-col justify-center items-start">
              <div className="relative z-10">
                <p className="text-on-primary/80 font-medium mb-1">Status Overview</p>
                <h3 className="text-2xl font-extrabold text-on-primary mb-4 font-headline">You haven't listed any hotels yet.</h3>
                <button 
                  onClick={handleComingSoon}
                  className="bg-surface-container-lowest text-primary px-6 py-2.5 rounded-full font-bold shadow-md hover:bg-surface-container-low transition-colors"
                >
                  Add Your First Listing
                </button>
              </div>
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            </div>
          ) : (
            <div className="md:col-span-2 bg-gradient-to-br from-primary to-primary-dim p-8 rounded-lg relative overflow-hidden group">
              <div className="relative z-10">
                <p className="text-on-primary/80 font-medium mb-1">Status Overview</p>
                <h3 className="text-5xl font-extrabold text-on-primary mb-4 font-headline">{stats?.roomsAvailableToday ?? 0} Rooms Available Today</h3>
                <div className="flex gap-4">
                  <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-on-primary text-sm font-semibold">{stats?.occupancyRate ?? 0}% Occupancy</span>
                  <span className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-full text-on-primary text-sm font-semibold">{stats?.checkInsToday ?? 0} Check-ins</span>
                </div>
              </div>
              <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
            </div>
          )}

          {/* Manage Rooms CTA */}
          <div className="bg-surface-container-lowest p-8 rounded-lg flex flex-col justify-between items-start">
            <div>
              <span className="material-symbols-outlined text-primary text-4xl mb-4">bed</span>
              <h4 className="text-xl font-bold mb-2 font-headline">Manage Room Types</h4>
              <p className="text-on-surface-variant text-sm leading-relaxed">Adjust pricing, update amenities, or modify inventory for your deluxe suites.</p>
            </div>
            <button 
              onClick={handleComingSoon}
              className="mt-6 text-primary font-bold flex items-center gap-1 group"
            >
              Quick Edit <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">chevron_right</span>
            </button>
          </div>
        </section>

        {/* Main Content Area: Split Revenue & Bookings */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Revenue Overview (Left 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-surface-container-low p-8 rounded-lg">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-xl font-bold font-headline">Revenue Overview</h3>
                  <p className="text-on-surface-variant text-sm">Last 30 Days Activity</p>
                </div>
                <div className="flex gap-2">
                  <span className="px-3 py-1 bg-surface-container-highest rounded-full text-xs font-bold text-primary">Monthly</span>
                </div>
              </div>
              {/* Simulated Editorial-style Chart */}
              <div className="h-64 flex items-end gap-1 md:gap-2 group">
                {stats?.revenueByDay?.map((day) => (
                  <div 
                    key={day.date}
                    className="flex-1 bg-primary/20 rounded-t-md hover:bg-primary transition-colors"
                    style={{ height: `${Math.max((day.amount / maxRevenue) * 100, 2)}%` }}
                    title={`${day.date}: ৳${day.amount.toLocaleString()}`}
                  />
                ))}
              </div>
              <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-on-surface-variant tracking-widest uppercase">
                <span>{firstDate}</span>
                <span>{middleDate}</span>
                <span>{lastDate}</span>
              </div>
              <div className="mt-8 pt-6 bg-surface-container-high rounded-md p-4 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Total Revenue</p>
                  <p className="text-2xl font-extrabold text-primary font-headline">৳{stats?.totalRevenue?.toLocaleString() ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs text-on-surface-variant font-bold uppercase tracking-wider">Avg Daily Rate</p>
                  <p className="text-2xl font-extrabold text-primary font-headline">৳{stats?.avgDailyRate?.toLocaleString() ?? 0}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Bookings Table (Right 5) */}
          <div className="lg:col-span-5 bg-surface-container-lowest p-8 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold font-headline">Recent Bookings</h3>
              <button 
                onClick={handleComingSoon}
                className="text-primary text-sm font-bold hover:underline"
              >
                View All
              </button>
            </div>
            <div className="space-y-6">
              {recentBookings.length === 0 ? (
                <p className="text-on-surface-variant text-sm text-center py-8">
                  No bookings yet.
                </p>
              ) : (
                recentBookings.slice(0, 5).map(b => (
                  <div key={b._id} className="flex items-center gap-4 p-4 rounded-xl hover:bg-surface-container transition-colors">
                    <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center flex-shrink-0">
                      <span className="text-secondary font-bold">
                        {b.guest_name.split(' ').map(n => n[0]).slice(0,2).join('')}
                      </span>
                    </div>
                    <div className="flex-grow min-w-0">
                      <p className="font-bold text-on-surface truncate">{b.guest_name}</p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {b.nights} {b.nights === 1 ? 'Night' : 'Nights'} •{' '}
                        {new Date(b.check_in).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        {' - '}
                        {new Date(b.check_out).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase
                        ${b.status === 'CONFIRMED' ? 'bg-primary-container text-on-primary-container'
                          : b.status === 'PENDING' ? 'bg-tertiary-container/20 text-tertiary'
                          : b.status === 'CANCELLED' ? 'bg-error-container text-on-error-container'
                          : 'bg-surface-container-high text-on-surface-variant'}`}>
                        {b.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Inventory Highlight (Asymmetric Layout) */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="order-2 md:order-1 relative">
            <div className="rounded-lg overflow-hidden h-96 shadow-2xl">
              <img className="w-full h-full object-cover" alt="Luxury hotel room overlooking emerald river" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBwjWPNhw1QciY6ib9QCB_zrNXq2uL7b0or1jb-91rCHxQpaK9gG2CWm7w-2czv4diXZj4uOxGNwfRtq5VrUXpqF-9AsDfToi2iW3IFZ-BpGYg02RFFsoYrcpBLKhxtc5oX5cs64_gXWVS5b-ua5vQ79oarS4nI0v7_kMstKUW4Fp-rLlWfHb9NN9UTmkZTFy-wJEBOi6CsVxpm2aeX_pLFdHK1s0cd65Dnb7xZ49RNVvwUuH_6kfP_UbmJk9xjB2AfSu67RlyirOg"/>
            </div>
            {/* Overlapping Decorative Element */}
            <div className="absolute -bottom-6 -right-6 bg-surface-container-highest p-6 rounded-lg w-48 shadow-xl hidden lg:block">
              <p className="text-xs font-bold text-on-surface-variant mb-1">Your Listings</p>
              <p className="text-lg font-extrabold text-primary font-headline">{stats?.totalHotels ?? 0} {stats?.totalHotels === 1 ? 'Hotel' : 'Hotels'}</p>
              <p className="text-sm text-on-surface-variant">{stats?.totalRoomCapacity ?? 0} total rooms</p>
            </div>
          </div>
          <div className="order-1 md:order-2 space-y-6">
            <h3 className="text-4xl font-extrabold leading-tight font-headline">Manage Your Listings</h3>
            <p className="text-on-surface-variant text-lg">Keep your room types, pricing, and amenities up to date to stay visible to travelers searching your city.</p>
            <div className="flex flex-wrap gap-3">
              <button 
                onClick={handleComingSoon}
                className="bg-primary text-on-primary px-8 py-4 rounded-full font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                Manage Rooms
              </button>
              <button 
                onClick={handleComingSoon}
                className="bg-surface-container-highest text-primary px-8 py-4 rounded-full font-bold shadow-md hover:opacity-90 transition-opacity"
              >
                View Analytics
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* BottomNavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/70 backdrop-blur-xl flex justify-around items-center p-4 z-50 shadow-lg">
        <button className="flex flex-col items-center gap-1 text-on-surface font-bold">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px]">Dashboard</span>
        </button>
        <button 
          onClick={handleComingSoon}
          className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="text-[10px]">Inventory</span>
        </button>
        <button 
          onClick={handleComingSoon}
          className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="text-[10px]">Bookings</span>
        </button>
        <button 
          onClick={handleComingSoon}
          className="flex flex-col items-center gap-1 text-on-surface-variant hover:text-on-surface"
        >
          <span className="material-symbols-outlined">payments</span>
          <span className="text-[10px]">Revenue</span>
        </button>
      </nav>

      {/* FAB (Contextual for Home/Dashboard) */}
      <button 
        onClick={handleComingSoon}
        className="fixed bottom-24 right-6 md:bottom-10 md:right-10 w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary-container text-on-primary shadow-2xl flex items-center justify-center group z-40"
      >
        <span className="material-symbols-outlined text-3xl transition-transform group-hover:rotate-90">add</span>
      </button>
    </div>
  )
}
