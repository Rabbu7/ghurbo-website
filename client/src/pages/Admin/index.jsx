import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { getAdminDashboard, getAdminBookings, approvePartner } from '../../api/admin.api'

export default function AdminDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)
  const [trendRange, setTrendRange] = useState('Weekly') // 'Weekly' | 'Monthly'
  const [page, setPage] = useState(1)
  const [showAllPending, setShowAllPending] = useState(false)
  const [bookingSearch, setBookingSearch] = useState('')

  // Close profile dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const { data: dashData, isLoading: dashLoading } = useQuery({
    queryKey: ['adminDashboard'],
    queryFn: getAdminDashboard,
  })

  const { data: bookingsData, isLoading: bookingsLoading } = useQuery({
    queryKey: ['adminBookings', page],
    queryFn: () => getAdminBookings({ page, limit: 10 }),
  })

  const kpis = dashData?.kpis
  const bookingTrends = dashData?.bookingTrends || []
  const pendingPartners = dashData?.pendingPartners || []
  const bookings = bookingsData?.bookings || []
  const totalPages = bookingsData?.totalPages || 1
  const totalBookingsCount = bookingsData?.total || 0

  const chartData = trendRange === 'Weekly' ? bookingTrends.slice(-7) : bookingTrends
  const maxCount = Math.max(...chartData.map(d => d.count), 1)

  const filteredBookings = bookingSearch
    ? bookings.filter(b =>
        b.traveler_name.toLowerCase().includes(bookingSearch.toLowerCase()) ||
        b.ref_code.toLowerCase().includes(bookingSearch.toLowerCase())
      )
    : bookings

  const formatCompact = (n) => {
    if (n >= 1000000) return `৳${(n / 1000000).toFixed(1)}M`
    if (n >= 1000) return `৳${(n / 1000).toFixed(1)}k`
    return `৳${n ?? 0}`
  }

  const handleComingSoon = () => toast('Coming soon')

  const handleApprove = async (id) => {
    try {
      await approvePartner(id)
      toast.success('Partner approved')
      queryClient.invalidateQueries({ queryKey: ['adminDashboard'] })
    } catch {
      toast.error('Could not approve partner')
    }
  }

  const visiblePending = showAllPending ? pendingPartners : pendingPartners.slice(0, 2)

  const PercentBadge = ({ value }) => {
    if (value === null) {
      return <span className="text-on-surface-variant font-bold text-sm">—</span>
    }
    return (
      <span className={`font-bold text-sm px-2 py-1 rounded-lg flex items-center gap-1
        ${value >= 0 ? 'text-primary bg-primary/10' : 'text-error bg-error/10'}`}>
        <span className="material-symbols-outlined text-xs">
          {value >= 0 ? 'trending_up' : 'trending_down'}
        </span>
        {Math.abs(value)}%
      </span>
    )
  }

  const initials = (name) => name.split(' ').map(n => n[0]).slice(0, 2).join('')

  const getXAxisLabels = () => {
    if (trendRange === 'Weekly') {
      return chartData.map(d => {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        const dateObj = new Date(d.date)
        return days[dateObj.getDay()]
      })
    } else {
      return chartData.map((d, index) => {
        if (index % 5 === 0 || index === chartData.length - 1) {
          const dateObj = new Date(d.date)
          return dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
        }
        return ''
      })
    }
  }
  const xAxisLabels = getXAxisLabels()

  if (dashLoading || bookingsLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased overflow-x-hidden">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          display: inline-block;
          line-height: 1;
        }
      `}</style>

      {/* SideNavBar */}
      <nav className="fixed left-0 top-0 h-full flex flex-col py-6 px-4 h-screen w-64 border-r-0 rounded-r-3xl bg-surface-container-low z-50 shadow-sm shadow-on-surface/5">
        <div className="mb-10 px-4">
          <h1 className="text-2xl font-bold text-on-surface tracking-tight font-headline">Admin</h1>
          <p className="text-xs text-on-surface-variant/70 font-medium">Travel Curator Panel</p>
        </div>
        <div className="flex flex-col gap-2 flex-grow overflow-y-auto">
          {/* Active: Dashboard */}
          <div className="flex items-center gap-3 px-4 py-3 bg-surface-container-lowest text-primary rounded-xl font-bold shadow-sm scale-98 transition-transform cursor-default">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-label">Dashboard</span>
          </div>
          <button 
            onClick={handleComingSoon}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-colors duration-200 text-left w-full rounded-xl"
          >
            <span className="material-symbols-outlined">event_available</span>
            <span className="font-label">Bookings</span>
          </button>
          <button 
            onClick={handleComingSoon}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-colors duration-200 text-left w-full rounded-xl"
          >
            <span className="material-symbols-outlined">hotel</span>
            <span className="font-label">Hotels</span>
          </button>
          <button 
            onClick={handleComingSoon}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-colors duration-200 text-left w-full rounded-xl"
          >
            <span className="material-symbols-outlined">directions_bus</span>
            <span className="font-label">Transport</span>
          </button>
          <button 
            onClick={handleComingSoon}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-colors duration-200 text-left w-full rounded-xl"
          >
            <span className="material-symbols-outlined">group</span>
            <span className="font-label">Users</span>
          </button>
        </div>
        <div className="mt-auto flex flex-col gap-2 pt-6">
          <button 
            onClick={handleComingSoon}
            className="flex items-center gap-3 px-4 py-3 text-on-surface-variant hover:text-primary hover:bg-surface-container-high/50 transition-colors duration-200 text-left w-full rounded-xl"
          >
            <span className="material-symbols-outlined">settings</span>
            <span className="font-label">Settings</span>
          </button>
          <button 
            onClick={() => { logout(); navigate('/') }}
            className="flex items-center gap-3 px-4 py-3 text-error hover:bg-error-container/10 transition-colors duration-200 text-left w-full rounded-xl"
          >
            <span className="material-symbols-outlined">logout</span>
            <span className="font-label">Logout</span>
          </button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="pl-64 min-h-screen">
        {/* TopAppBar */}
        <header className="flex justify-between items-center w-full pr-8 py-4 sticky top-0 z-40 bg-surface-container-lowest/80 backdrop-blur-xl shadow-sm shadow-on-surface/5">
          <div className="flex items-center gap-8 pl-8 flex-1">
            <div className="relative w-full max-w-md group">
              <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
              <input 
                className="w-full bg-surface-container border-none rounded-full py-3 pl-12 pr-4 text-on-surface focus:ring-2 focus:ring-primary/20 placeholder:text-on-surface-variant/50 font-body shadow-sm outline-none" 
                placeholder="Search bookings by name or ref code..." 
                type="text"
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
              />
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleComingSoon} className="hover:bg-surface-container rounded-full p-2 transition-colors relative">
              <span className="material-symbols-outlined">notifications</span>
              <span className="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-full"></span>
            </button>
            <button onClick={handleComingSoon} className="hover:bg-surface-container rounded-full p-2 transition-colors">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            
            {/* Account dropdown trigger */}
            <div className="relative ml-2" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(o => !o)}
                className="p-2 text-on-surface-variant hover:text-primary transition-colors flex items-center"
                aria-label="Profile"
              >
                <span
                  className="material-symbols-outlined text-2xl"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  account_circle
                </span>
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-surface-container-lowest rounded-lg shadow-2xl py-2 z-50">
                  <div className="px-4 py-3 border-b border-surface-container-high">
                    <p className="text-sm font-bold text-on-surface truncate">{user?.name}</p>
                    <p className="text-xs text-on-surface-variant truncate">{user?.email}</p>
                  </div>
                  <Link
                    to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl text-on-surface-variant">person</span>
                    View Profile
                  </Link>
                  <button
                    type="button"
                    onClick={() => { logout(); navigate('/') }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-tertiary hover:bg-surface-container transition-colors rounded-xl text-left"
                  >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Dashboard Canvas */}
        <div className="p-8 space-y-8">
          {/* Header Section */}
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-4xl font-extrabold text-on-surface tracking-tight font-headline">Dashboard Overview</h2>
              <p className="text-on-surface-variant mt-1 font-body">Welcome back, {user?.name}. Here's what's happening today.</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-surface-container-highest px-6 py-2.5 rounded-full font-bold text-on-primary-container flex items-center gap-2 text-sm select-none">
                <span className="material-symbols-outlined text-[20px]">calendar_today</span>
                Last 30 Days
              </div>
            </div>
          </div>

          {/* KPI Cards Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* KPI 1 */}
            <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border-none relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-container rounded-2xl text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>group</span>
                </div>
                <PercentBadge value={kpis?.totalUsersChange} />
              </div>
              <p className="text-on-surface-variant text-sm font-medium">Total Users</p>
              <h3 className="text-3xl font-extrabold text-on-surface mt-1">{kpis?.totalUsers?.toLocaleString() ?? 0}</h3>
            </div>

            {/* KPI 2 */}
            <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border-none relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-secondary/5 rounded-full blur-2xl group-hover:bg-secondary/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-secondary-container rounded-2xl text-secondary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                </div>
                <PercentBadge value={kpis?.totalBookingsChange} />
              </div>
              <p className="text-on-surface-variant text-sm font-medium">Total Bookings</p>
              <h3 className="text-3xl font-extrabold text-on-surface mt-1">{kpis?.totalBookings?.toLocaleString() ?? 0}</h3>
            </div>

            {/* KPI 3 */}
            <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border-none relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-tertiary/5 rounded-full blur-2xl group-hover:bg-tertiary/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-tertiary/10 rounded-2xl text-tertiary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                </div>
                <PercentBadge value={kpis?.monthlyRevenueChange} />
              </div>
              <p className="text-on-surface-variant text-sm font-medium">Monthly Revenue</p>
              <h3 className="text-3xl font-extrabold text-on-surface mt-1">{formatCompact(kpis?.monthlyRevenue)}</h3>
            </div>

            {/* KPI 4 */}
            <div className="bg-surface-container-lowest p-6 rounded-lg shadow-sm border-none relative overflow-hidden group">
              <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-container rounded-2xl text-primary">
                  <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>handshake</span>
                </div>
                <PercentBadge value={kpis?.totalPartnersChange} />
              </div>
              <p className="text-on-surface-variant text-sm font-medium">Partner Count</p>
              <h3 className="text-3xl font-extrabold text-on-surface mt-1">{kpis?.totalPartners?.toLocaleString() ?? 0}</h3>
            </div>
          </div>

          {/* Visual Trends & Quick Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Trend Chart */}
            <div className="lg:col-span-2 bg-surface-container-low rounded-lg p-8 relative overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h3 className="text-2xl font-bold text-on-surface font-headline">Booking Trends</h3>
                  <p className="text-on-surface-variant text-sm">Volume of daily bookings across all channels</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setTrendRange('Weekly')}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-all duration-200 ${trendRange === 'Weekly' ? 'bg-surface-container-lowest text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-lowest/40'}`}
                  >
                    Weekly
                  </button>
                  <button 
                    onClick={() => setTrendRange('Monthly')}
                    className={`px-4 py-1.5 rounded-full text-sm font-bold shadow-sm transition-all duration-200 ${trendRange === 'Monthly' ? 'bg-surface-container-lowest text-on-surface' : 'text-on-surface-variant hover:bg-surface-container-lowest/40'}`}
                  >
                    Monthly
                  </button>
                </div>
              </div>
              
              {/* Chart Visualization */}
              <div className="h-64 w-full flex items-end justify-between gap-4 mt-4">
                {chartData.map((day) => (
                  <div 
                    key={day.date}
                    className={`flex-1 rounded-t-xl transition-all cursor-pointer group relative
                      ${day.isToday ? 'bg-primary/60' : 'bg-primary/20 hover:bg-primary/40'}`}
                    style={{ height: `${Math.max((day.count / maxCount) * 100, 2)}%` }}
                  >
                    <div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-2 py-1 rounded text-xs font-bold z-10">
                      {day.count}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 px-1 text-on-surface-variant text-xs font-medium">
                {xAxisLabels.map((label, idx) => (
                  <span key={idx} className="flex-1 text-center truncate">{label}</span>
                ))}
              </div>
            </div>

            {/* Pending Approvals & Quick Actions */}
            <div className="space-y-6">
              <div className="bg-surface-container-high p-6 rounded-lg relative overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold text-on-surface font-headline">Pending Partners</h3>
                  {pendingPartners.length > 0 && (
                    <span className="bg-tertiary text-on-tertiary text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Urgent</span>
                  )}
                </div>
                <div className="space-y-4">
                  {pendingPartners.length === 0 ? (
                    <p className="text-on-surface-variant text-sm">No pending applications right now.</p>
                  ) : (
                    visiblePending.map(p => (
                      <div key={p._id} className="flex items-center gap-4 bg-surface-container-lowest/50 p-3 rounded-xl">
                        <div className="w-10 h-10 rounded-lg shrink-0 bg-primary-container flex items-center justify-center text-primary">
                          <span className="material-symbols-outlined text-[20px]">
                            {p.type === 'transport' ? 'directions_bus' : p.type === 'both' ? 'apartment' : 'hotel'}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-sm truncate text-on-surface">{p.business_name}</p>
                          <p className="text-[11px] text-on-surface-variant uppercase tracking-tighter">
                            {p.type} • {p.location}
                          </p>
                        </div>
                        <div className="flex gap-1 shrink-0">
                          <button 
                            onClick={() => handleApprove(p._id)}
                            className="px-3 py-1.5 bg-primary text-on-primary rounded-full text-[10px] font-bold hover:opacity-90 active:scale-95 transition-all"
                          >
                            Approve
                          </button>
                          <button 
                            onClick={handleComingSoon}
                            className="px-3 py-1.5 bg-surface-container-highest text-on-surface-variant rounded-full text-[10px] font-bold hover:bg-surface-container-high transition-colors"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
                {pendingPartners.length > 2 && (
                  <button 
                    onClick={() => setShowAllPending(!showAllPending)}
                    className="w-full mt-6 py-2 text-primary font-bold text-sm hover:underline text-center"
                  >
                    {showAllPending ? 'Show Less' : `View All Requests (${pendingPartners.length})`}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleComingSoon}
                  className="flex flex-col items-center justify-center p-4 bg-primary text-on-primary rounded-xl gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-sm shadow-primary/20"
                >
                  <span className="material-symbols-outlined">add_business</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Add Partner</span>
                </button>
                <button 
                  onClick={handleComingSoon}
                  className="flex flex-col items-center justify-center p-4 bg-secondary text-on-secondary rounded-xl gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-sm shadow-secondary/20"
                >
                  <span className="material-symbols-outlined">analytics</span>
                  <span className="text-[10px] font-bold uppercase tracking-widest">Reports</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Bookings Section */}
          <div className="bg-surface-container-lowest rounded-lg p-8 shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-2xl font-bold text-on-surface font-headline">Recent Bookings</h3>
              <button onClick={handleComingSoon} className="text-primary font-bold hover:underline">Download CSV</button>
            </div>
            <div className="space-y-4">
              {/* Header Row */}
              <div className="grid grid-cols-12 px-4 text-xs font-bold text-on-surface-variant uppercase tracking-widest mb-2">
                <div className="col-span-4">Traveler / ID</div>
                <div className="col-span-3">Destination</div>
                <div className="col-span-2">Amount</div>
                <div className="col-span-2">Status</div>
                <div className="col-span-1 text-right">Action</div>
              </div>

              {filteredBookings.length === 0 ? (
                <p className="text-center text-on-surface-variant text-sm py-10">No bookings found.</p>
              ) : (
                filteredBookings.map(b => (
                  <div key={b._id} className="grid grid-cols-12 items-center px-4 py-4 hover:bg-surface-container-low rounded-2xl transition-all group">
                    <div className="col-span-4 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center font-bold text-primary shrink-0">
                        {initials(b.traveler_name)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold truncate text-on-surface">{b.traveler_name}</p>
                        <p className="text-[11px] text-on-surface-variant font-mono">{b.ref_code}</p>
                      </div>
                    </div>
                    <div className="col-span-3">
                      <p className="font-medium text-sm text-on-surface truncate">{b.destination}</p>
                      <p className="text-[11px] text-on-surface-variant italic truncate">{b.detail}</p>
                    </div>
                    <div className="col-span-2">
                      <p className="font-bold text-on-surface">৳ {b.grand_total.toLocaleString()}</p>
                    </div>
                    <div className="col-span-2">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase
                        ${b.status === 'CONFIRMED' ? 'bg-primary-container text-on-primary-container'
                          : b.status === 'PENDING' ? 'bg-tertiary-container/30 text-tertiary'
                          : b.status === 'CANCELLED' ? 'bg-error-container/30 text-error'
                          : 'bg-surface-container text-on-surface-variant'}`}>
                        {b.status}
                      </span>
                    </div>
                    <div className="col-span-1 text-right">
                      <button onClick={handleComingSoon} className="opacity-0 group-hover:opacity-100 p-2 hover:bg-surface-container-low rounded-full transition-all">
                        <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="mt-8 flex items-center justify-between pt-6">
              <p className="text-sm text-on-surface-variant">
                Showing {bookings.length} of {totalBookingsCount.toLocaleString()} bookings
              </p>
              <div className="flex items-center gap-3">
                <button 
                  disabled={page === 1} 
                  onClick={() => setPage(p => p - 1)}
                  className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center disabled:opacity-30 hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">chevron_left</span>
                </button>
                <span className="text-xs font-bold text-on-surface">Page {page} of {totalPages}</span>
                <button 
                  disabled={page === totalPages} 
                  onClick={() => setPage(p => p + 1)}
                  className="w-8 h-8 rounded-full bg-surface-container-highest flex items-center justify-center disabled:opacity-30 hover:bg-surface-container-high transition-colors"
                >
                  <span className="material-symbols-outlined text-sm">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
