import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { getPartnerDashboard } from '../../api/partner.api'

export default function TransportPartnerDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)
  const [chartRange, setChartRange] = useState('7D') // '7D' | '30D'

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
  const operators = data?.operators || []
  const stats = data?.transportStats
  const recentTicketSales = data?.recentTicketSales || []

  const chartData = chartRange === '7D'
    ? (stats?.revenueByDay || []).slice(-7)
    : (stats?.revenueByDay || [])
  const maxRevenue = Math.max(...chartData.map(d => d.amount), 1)

  const formatCompact = (n) => n >= 1000 ? `৳${(n / 1000).toFixed(1)}k` : `৳${n ?? 0}`

  const fmtDeparture = (iso) => {
    const dep = new Date(iso)
    const diffMs = dep - new Date()
    const diffMin = Math.round(diffMs / 60000)
    if (diffMin < 60) return `Departs in ${diffMin} min`
    if (diffMin < 1440) return `Departs in ${Math.round(diffMin / 60)} hr`
    return `Departs ${dep.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}, ${dep.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}`
  }

  const handleComingSoon = () => toast('Coming soon')

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body antialiased">
      {/* Sidebar Navigation Shell */}
      <aside className="hidden md:flex flex-col h-screen w-64 fixed left-0 top-0 border-r-0 bg-surface-container-low p-4 gap-2 z-50">
        <div className="mb-8 px-4 py-2">
          <h1 className="text-lg font-extrabold text-on-surface tracking-tight font-headline">Provider Portal</h1>
          <p className="text-xs text-on-surface-variant opacity-70">Management Suite</p>
        </div>
        <nav className="flex flex-col gap-2">
          {/* Dashboard -> active state */}
          <span className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface-container-high text-on-surface font-bold transition-all duration-300 cursor-default">
            <span className="material-symbols-outlined">dashboard</span>
            <span className="font-bold">Dashboard</span>
          </span>
          <button 
            onClick={handleComingSoon}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high/50 transition-all duration-300 w-full text-left"
          >
            <span className="material-symbols-outlined">inventory_2</span>
            <span className="font-medium">Inventory</span>
          </button>
          <button 
            onClick={handleComingSoon}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high/50 transition-all duration-300 w-full text-left"
          >
            <span className="material-symbols-outlined">confirmation_number</span>
            <span className="font-medium">Bookings</span>
          </button>
          <button 
            onClick={handleComingSoon}
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-on-surface-variant hover:bg-surface-container-high/50 transition-all duration-300 w-full text-left"
          >
            <span className="material-symbols-outlined">payments</span>
            <span className="font-medium">Revenue</span>
          </button>
        </nav>
        <div className="mt-auto flex flex-col gap-2">
          <button 
            onClick={handleComingSoon}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold py-4 rounded-full shadow-lg shadow-primary/10 hover:shadow-xl transition-all"
          >
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

      {/* Top Navigation Shell */}
      <header className="fixed top-0 right-0 left-0 md:left-64 flex justify-between items-center px-6 py-3 bg-surface/70 backdrop-blur-xl z-40 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="md:hidden">
            <span className="material-symbols-outlined text-primary">menu</span>
          </div>
          <div className="text-xl font-bold text-on-surface font-headline">Transport Dashboard</div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface">
              <span className="material-symbols-outlined">notifications</span>
            </button>
            <button className="p-2 rounded-full hover:bg-surface-container-high transition-colors text-on-surface">
              <span className="material-symbols-outlined">help_outline</span>
            </button>
            <div className="relative">
              <button
                type="button"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-on-surface-variant hover:text-primary transition-colors ml-2"
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
        </div>
      </header>

      {/* Main Content Canvas */}
      <main className="pt-20 pb-24 md:pb-8 md:pl-64 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Dashboard Header Section */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-on-surface tracking-tight font-headline">Trip Overview</h2>
              <p className="text-on-surface-variant mt-1">Managing your active fleet for today, {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}.</p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={handleComingSoon}
                className="px-6 py-3 bg-surface-container-highest text-on-primary-container font-semibold rounded-full hover:bg-surface-variant transition-colors"
              >
                Manage Fleet
              </button>
              <button 
                onClick={handleComingSoon}
                className="px-6 py-3 bg-gradient-to-br from-primary to-primary-container text-on-primary font-bold rounded-full flex items-center gap-2"
              >
                <span className="material-symbols-outlined">add</span>
                Add Trip
              </button>
            </div>
          </div>

          {/* Bento Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {/* Summary Card 1: Trips Today */}
            <div className="col-span-1 bg-surface-container-lowest p-6 rounded-lg flex flex-col justify-between shadow-sm">
              <div className="flex justify-between items-start">
                <div className="p-3 bg-primary-container rounded-2xl">
                  <span className="material-symbols-outlined text-primary">directions_bus</span>
                </div>
              </div>
              <div className="mt-8">
                <p className="text-on-surface-variant text-sm font-medium">Active Routes</p>
                <h3 className="text-4xl font-extrabold text-on-surface mt-1 font-headline">{stats?.totalRoutes ?? 0} {stats?.totalRoutes === 1 ? 'Route' : 'Routes'}</h3>
              </div>
            </div>

            {/* Summary Card 2: Next Departure Seats */}
            <div className="col-span-1 lg:col-span-2 bg-surface-container-lowest p-6 rounded-lg shadow-sm overflow-hidden relative">
              {stats?.nextDeparture ? (
                <div className="relative z-10 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-2 text-primary font-bold mb-1">
                      <span className="material-symbols-outlined text-sm">timer</span>
                      <span className="text-xs uppercase tracking-widest">Next: {stats.nextDeparture.operator_name}</span>
                    </div>
                    <h3 className="text-2xl font-bold font-headline">{stats.nextDeparture.from} to {stats.nextDeparture.to}</h3>
                    <p className="text-on-surface-variant text-sm">{fmtDeparture(stats.nextDeparture.departure)}</p>
                  </div>
                  <div className="mt-6">
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-semibold">Seat Availability</span>
                      <span className="text-xl font-extrabold text-primary font-headline">
                        {stats.nextDeparture.total_seats - stats.nextDeparture.booked_seats} / {stats.nextDeparture.total_seats}
                      </span>
                    </div>
                    <div className="w-full bg-surface-container h-3 rounded-full overflow-hidden">
                      <div 
                        className="bg-primary h-full rounded-full" 
                        style={{ width: `${stats.nextDeparture.total_seats ? (stats.nextDeparture.booked_seats / stats.nextDeparture.total_seats) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-2">{stats.nextDeparture.available_seats} seats remaining</p>
                  </div>
                </div>
              ) : (
                <div className="relative z-10 h-full flex flex-col justify-center">
                  <p className="text-on-surface-variant text-sm">No upcoming departures with confirmed passengers yet.</p>
                </div>
              )}
              {/* Decorative background element */}
              <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none">
                <span className="material-symbols-outlined text-[160px]">airline_seat_recline_normal</span>
              </div>
            </div>

            {/* Summary Card 3: Today's Revenue */}
            <div className="col-span-1 bg-surface-container-lowest p-6 rounded-lg flex flex-col justify-between shadow-sm">
              <div className="p-3 bg-tertiary-container/20 w-fit rounded-2xl">
                <span className="material-symbols-outlined text-tertiary">account_balance_wallet</span>
              </div>
              <div className="mt-8">
                <p className="text-on-surface-variant text-sm font-medium">Today's Revenue</p>
                <h3 className="text-4xl font-extrabold text-on-surface mt-1 font-headline">{formatCompact(stats?.todayRevenue)}</h3>
                {stats?.revenueChangePercent === null ? (
                  <p className="text-xs text-on-surface-variant mt-1">No data from yesterday yet</p>
                ) : (
                  <p className="text-xs text-on-surface-variant mt-1 flex items-center gap-1">
                    <span className="material-symbols-outlined text-primary text-xs">
                      {stats.revenueChangePercent >= 0 ? 'trending_up' : 'trending_down'}
                    </span>
                    {Math.abs(stats.revenueChangePercent)}% from yesterday
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Insights Section: Revenue and Recent Sales */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Revenue Trend Visualization */}
            <div className="lg:col-span-2 bg-surface-container-low p-8 rounded-lg relative overflow-hidden">
              <div className="flex justify-between items-center mb-10">
                <h3 className="text-xl font-bold font-headline">Revenue Trends</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setChartRange('7D')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${chartRange === '7D' ? 'bg-surface-container-lowest text-primary' : 'hover:bg-surface-container-lowest text-on-surface-variant'}`}
                  >
                    7D
                  </button>
                  <button 
                    onClick={() => setChartRange('30D')}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-colors ${chartRange === '30D' ? 'bg-surface-container-lowest text-primary' : 'hover:bg-surface-container-lowest text-on-surface-variant'}`}
                  >
                    30D
                  </button>
                </div>
              </div>
              <div className="h-64 flex items-end justify-between gap-4 px-2">
                {chartData.map((day) => (
                  <div 
                    key={day.date}
                    className={`flex-1 rounded-t-xl transition-all relative group cursor-pointer
                      ${day.isToday ? 'bg-primary-container/30 border-t-2 border-dashed border-primary/20'
                        : 'bg-primary/20 hover:bg-primary/40'}`}
                    style={{ height: `${Math.max((day.amount / maxRevenue) * 100, 2)}%` }}
                  >
                    <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {formatCompact(day.amount)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 px-2 text-[10px] font-bold text-on-surface-variant uppercase tracking-tighter opacity-60">
                {chartRange === '7D' ? (
                  chartData.map(d => (
                    <span key={d.date}>
                      {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })}
                    </span>
                  ))
                ) : (
                  chartData.map((d, i) => (
                    i % 5 === 0 ? (
                      <span key={d.date}>
                        {new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    ) : null
                  ))
                )}
              </div>
            </div>

            {/* Busiest Route Card */}
            <div className="bg-gradient-to-br from-tertiary to-tertiary-dim p-8 rounded-lg text-on-tertiary flex flex-col justify-between relative shadow-2xl">
              {stats?.busiestRoute ? (
                <div>
                  <h3 className="text-2xl font-extrabold leading-tight font-headline">Your Busiest Route</h3>
                  <p className="mt-4 text-sm text-on-tertiary/80 leading-relaxed font-body">
                    {stats.busiestRoute.route} is your top performer with {stats.busiestRoute.count} confirmed {stats.busiestRoute.count === 1 ? 'ticket' : 'tickets'} sold.
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-2xl font-extrabold leading-tight font-headline font-headline">No ticket sales yet</h3>
                  <p className="mt-4 text-sm text-on-tertiary/80 leading-relaxed font-body">
                    Your busiest route will show up here once you have confirmed bookings.
                  </p>
                </div>
              )}
              <button 
                onClick={handleComingSoon}
                className="mt-8 bg-on-tertiary text-tertiary font-bold py-3 px-6 rounded-full w-fit hover:bg-white transition-colors"
              >
                Manage Routes
              </button>
              {/* Visual element */}
              <div className="absolute -top-12 -right-8 opacity-20 rotate-12 pointer-events-none">
                <span className="material-symbols-outlined text-[140px]">campaign</span>
              </div>
            </div>

            {/* Recent Ticket Sales Table */}
            <div className="lg:col-span-3 mt-4">
              <div className="bg-surface-container-lowest rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 flex justify-between items-center border-b border-surface-container-low">
                  <h3 className="text-xl font-bold font-headline">Recent Ticket Sales</h3>
                  <button 
                    onClick={handleComingSoon}
                    className="text-primary font-bold text-sm hover:underline"
                  >
                    Download CSV
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead className="bg-surface-container-low text-on-surface-variant uppercase text-[10px] font-bold tracking-widest">
                      <tr>
                        <th className="px-6 py-4">Passenger</th>
                        <th className="px-6 py-4">Route</th>
                        <th className="px-6 py-4">Seat #</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4 text-right">Fare</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-surface-container-low">
                      {recentTicketSales.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-6 py-10 text-center text-on-surface-variant text-sm">
                            No ticket sales yet.
                          </td>
                        </tr>
                      ) : (
                        recentTicketSales.slice(0, 5).map(t => (
                          <tr key={`${t.booking_id}-${t.from}-${t.departure}`} className="hover:bg-surface-container transition-colors">
                            <td className="px-6 py-5">
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary-container text-primary flex items-center justify-center font-bold text-xs flex-shrink-0">
                                  {t.passenger_name.split(' ').map(n => n[0]).slice(0,2).join('')}
                                </div>
                                <div>
                                  <p className="font-bold text-sm text-on-surface">{t.passenger_name}</p>
                                  <p className="text-[10px] text-on-surface-variant">Ref: {t.ref_code}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-5">
                              <p className="text-sm font-medium text-on-surface">{t.from} ➔ {t.to}</p>
                              <p className="text-[10px] text-on-surface-variant">
                                {new Date(t.departure).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })},{' '}
                                {new Date(t.departure).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
                              </p>
                            </td>
                            <td className="px-6 py-5 font-mono text-sm text-on-surface">{t.seat_numbers.join(', ') || '—'}</td>
                            <td className="px-6 py-5">
                              <span className={`px-3 py-1 text-[10px] font-bold rounded-full
                                ${t.status === 'CONFIRMED' ? 'bg-primary-container text-on-primary-container'
                                  : t.status === 'PENDING' ? 'bg-tertiary-container/20 text-tertiary'
                                  : t.status === 'CANCELLED' ? 'bg-error-container text-on-error-container'
                                  : 'bg-surface-container text-on-surface-variant'}`}>
                                {t.status}
                              </span>
                            </td>
                            <td className="px-6 py-5 text-right font-bold text-sm text-on-surface">৳{t.price.toLocaleString()}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                <div className="p-6 bg-surface-container-low text-center">
                  <button 
                    onClick={handleComingSoon}
                    className="text-primary font-bold text-sm flex items-center gap-2 mx-auto"
                  >
                    View All Transactions
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Bottom NavBar (Mobile Only) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface/90 backdrop-blur-xl flex justify-around items-center py-4 px-2 z-50 border-t-0 shadow-[0_-10px_30px_-15px_rgba(0,0,0,0.1)]">
        <button className="flex flex-col items-center gap-1 text-on-surface font-bold">
          <span className="material-symbols-outlined">dashboard</span>
          <span className="text-[10px]">Dashboard</span>
        </button>
        <button 
          onClick={handleComingSoon}
          className="flex flex-col items-center gap-1 text-on-surface-variant"
        >
          <span className="material-symbols-outlined">inventory_2</span>
          <span className="text-[10px] font-medium">Inventory</span>
        </button>
        <button 
          onClick={handleComingSoon}
          className="flex flex-col items-center gap-1 text-on-surface-variant"
        >
          <span className="material-symbols-outlined">confirmation_number</span>
          <span className="text-[10px] font-medium">Bookings</span>
        </button>
        <button 
          onClick={handleComingSoon}
          className="flex flex-col items-center gap-1 text-on-surface-variant"
        >
          <span className="material-symbols-outlined">payments</span>
          <span className="text-[10px] font-medium">Revenue</span>
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
