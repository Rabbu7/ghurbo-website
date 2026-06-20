import { lazy, Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import AuthProvider from './context/AuthContext.jsx'
import BookingProvider from './context/BookingContext.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import PartnerRoute from './components/PartnerRoute.jsx'
import AdminRoute from './components/AdminRoute.jsx'
import PartnerGate from './components/PartnerGate.jsx'

// Lazy-loaded page components
const Home = lazy(() => import('./pages/Home/index.jsx'))
const Login = lazy(() => import('./pages/Auth/Login.jsx'))
const Register = lazy(() => import('./pages/Auth/Register.jsx'))
const About = lazy(() => import('./pages/About/index.jsx'))
const Contact = lazy(() => import('./pages/Contact/index.jsx'))
const SearchResults = lazy(() => import('./pages/Search/index.jsx'))
const OutboundSelect = lazy(() => import('./pages/Search/OutboundSelect.jsx'))
const ReturnSelect = lazy(() => import('./pages/Search/ReturnSelect.jsx'))
const ReturnSeatSelect = lazy(() => import('./pages/Search/ReturnSeatSelect.jsx'))
const HotelSelection = lazy(() => import('./pages/Hotels/index.jsx'))
const TripSummary = lazy(() => import('./pages/Booking/TripSummary.jsx'))
const Payment = lazy(() => import('./pages/Booking/Payment.jsx'))
const Confirmation = lazy(() => import('./pages/Booking/Confirmation.jsx'))
const UserDashboard = lazy(() => import('./pages/User/Dashboard.jsx'))
const BookingHistory = lazy(() => import('./pages/User/BookingHistory.jsx'))
const CancelRefund = lazy(() => import('./pages/User/CancelRefund.jsx'))
const Profile = lazy(() => import('./pages/User/Profile.jsx'))
const HotelPartnerDashboard = lazy(() => import('./pages/Partner/HotelDashboard.jsx'))
const TransportPartnerDashboard = lazy(() => import('./pages/Partner/TransportDashboard.jsx'))
const AdminDashboard = lazy(() => import('./pages/Admin/index.jsx'))

// Simple page loader component used as a suspense fallback
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-surface">
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-primary"></div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Toaster position="top-right" />
          <PartnerGate />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />

              {/* Booking flow routes */}
              <Route path="/search" element={<SearchResults />} />
              <Route path="/search/outbound" element={<OutboundSelect />} />
              <Route path="/search/return" element={<ReturnSelect />} />
              <Route path="/search/return-seats" element={<ReturnSeatSelect />} />
              <Route path="/hotels" element={<HotelSelection />} />
              <Route path="/booking/summary" element={<TripSummary />} />
              <Route path="/booking/payment" element={<Payment />} />
              <Route path="/booking/confirmation" element={<Confirmation />} />

              {/* Protected user routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <UserDashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/history"
                element={
                  <ProtectedRoute>
                    <BookingHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard/cancel/:id"
                element={
                  <ProtectedRoute>
                    <CancelRefund />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Protected partner route */}
              <Route path="/partner/hotel" element={
                <PartnerRoute type="hotel"><HotelPartnerDashboard /></PartnerRoute>
              } />
              <Route path="/partner/transport" element={
                <PartnerRoute type="transport"><TransportPartnerDashboard /></PartnerRoute>
              } />

              {/* Protected admin route */}
              <Route
                path="/admin"
                element={
                  <AdminRoute>
                    <AdminDashboard />
                  </AdminRoute>
                }
              />
            </Routes>
          </Suspense>
        </Router>
      </BookingProvider>
    </AuthProvider>
  )
}
