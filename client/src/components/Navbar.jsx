import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setDropdownOpen(false)
    navigate('/')
  }

  const getLinkClass = (path) => {
    const isActive = location.pathname === path
    return isActive
      ? "text-on-surface border-b-2 border-primary transition-colors"
      : "text-on-surface-variant hover:text-primary transition-colors"
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-surface-container-lowest/80 backdrop-blur-xl shadow-sm shadow-on-surface/5 flex justify-between items-center px-8 py-4 max-w-full mx-auto">
      <Link to="/" className="text-2xl font-black text-on-surface tracking-tighter font-headline">GHURBO</Link>
      <div className="hidden md:flex items-center gap-8 font-headline font-bold tracking-tight">
        <Link to="/" className={getLinkClass('/')}>Destinations</Link>
        <Link to="/experiences" className={getLinkClass('/experiences')}>Experiences</Link>
        <Link to="/about" className={getLinkClass('/about')}>About</Link>
        <Link to="/contact" className={getLinkClass('/contact')}>Contact</Link>
      </div>
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <button
              type="button"
              className="p-2 text-on-surface-variant hover:text-primary transition-colors"
              aria-label="Notifications"
            >
              <span className="material-symbols-outlined text-2xl">notifications</span>
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(o => !o)}
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
                  <Link
                    to="/dashboard/history"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 text-sm font-semibold text-on-surface hover:bg-surface-container transition-colors"
                  >
                    <span className="material-symbols-outlined text-xl text-on-surface-variant">history</span>
                    Booking History
                  </Link>
                  <div className="h-px bg-surface-container mx-4 my-1" />
                  <button
                    type="button"
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-tertiary hover:bg-surface-container transition-colors rounded-xl"
                  >
                    <span className="material-symbols-outlined text-xl">logout</span>
                    Logout
                  </button>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="px-6 py-2 rounded-full font-headline font-bold text-on-surface-variant hover:text-primary transition-colors">Login</Link>
            <Link to="/register" className="bg-gradient-to-br from-primary to-primary-container px-6 py-2 rounded-full text-on-primary font-headline font-bold scale-95 hover:scale-100 duration-200 ease-in-out">Register</Link>
          </>
        )}
      </div>
    </nav>
  )
}
