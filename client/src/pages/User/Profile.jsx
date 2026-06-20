import { useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { useAuth } from '../../context/AuthContext'
import { updateProfile } from '../../api/auth.api'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Profile() {
  const { user, login, token } = useAuth()

  // Pre-populate from live user context
  const [name, setName]             = useState(user?.name || '')
  const [phone, setPhone]           = useState(user?.phone || '')
  const [birthDate, setBirthDate]   = useState(user?.birthDate?.slice(0, 10) || '')
  const [city, setCity]             = useState(user?.city || '')
  const [postalCode, setPostalCode] = useState(user?.postalCode || '')
  const [country, setCountry]       = useState(user?.country || 'Bangladesh')

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword]         = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    if (newPassword && newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (newPassword && newPassword.length < 8) {
      toast.error('New password must be at least 8 characters')
      return
    }
    setSaving(true)
    try {
      const payload = { name, phone, birthDate: birthDate || undefined, city, postalCode, country }
      if (currentPassword && newPassword) {
        payload.currentPassword = currentPassword
        payload.newPassword = newPassword
      }
      const res = await updateProfile(payload)
      // Refresh AuthContext with updated user (token unchanged)
      login(res.user, token)
      toast.success('Profile updated successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save changes')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface selection:bg-primary-container min-h-screen flex flex-col font-body">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          display: inline-block;
          line-height: 1;
        }
      `}</style>

      <Navbar />

      <main className="pt-28 pb-20 px-6 max-w-screen-2xl mx-auto flex-grow w-full">
        {/* Header Summary Section */}
        <section className="mb-12">
          <div className="bg-surface-container-lowest rounded-xl p-8 flex flex-col md:flex-row gap-8 items-center md:items-start relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/20 rounded-full -mr-20 -mt-20 blur-3xl group-hover:bg-primary-container/30 transition-colors duration-500"></div>
            <div className="relative w-32 h-32 flex-shrink-0">
              <img
                alt="User Profile"
                className="w-full h-full object-cover rounded-xl shadow-sm border-4 border-surface-container-low"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDzlB2jr2yoCB8M_sgRCyNrvXk98WTLFGZpXByUGiBKqyfHKhkTrg7uylEcAQTl0RE1QZPNLKhczrQGadARAfGH5-b1Foxndsc_nlF9Uq-vjvj44yaoi2SB3SVKcGRc0fGz_ccbUy8VukTIehaHccEGF2CGbqHI-qIY8BL1keXX-KvO1fwL6hdUc7RdFA70bXA-gi1bQuUvzgJ0qyfeykeeSzaBJAg1MCdmogw0zgjCFq4rU6-T0hDsHZCWEPy4kJE4htj_qGKYNBk"
              />
              <button
                onClick={() => toast('Photo upload coming soon')}
                className="absolute -bottom-2 -right-2 bg-primary text-white p-2 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-sm">edit</span>
              </button>
            </div>
            <div className="flex-grow space-y-4 text-center md:text-left z-10">
              <div>
                <h1 className="text-4xl font-headline font-extrabold text-on-surface tracking-tight">Salam, {user?.name}</h1>
                <p className="text-on-surface-variant font-medium mt-1">Manage your personal information and security settings.</p>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <span className="px-4 py-1.5 bg-secondary-container text-on-secondary-container rounded-full text-sm font-semibold flex items-center gap-2">
                  <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 1" }}>stars</span>
                  Elite Member
                </span>
                <button
                  onClick={() => toast('Photo upload coming soon')}
                  className="px-6 py-1.5 bg-surface-container-high text-on-surface-variant rounded-full text-sm font-bold hover:bg-surface-variant transition-colors"
                >
                  Change Photo
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Main Content Area */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Sidebar Navigation */}
          <aside className="lg:col-span-3 space-y-2">
            <div className="bg-surface-container-low rounded-lg p-3 space-y-1">
              <Link className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors" to="/dashboard">
                <span className="material-symbols-outlined">dashboard</span>
                Overview
              </Link>
              <Link className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors" to="/dashboard/history">
                <span className="material-symbols-outlined">history</span>
                Booking History
              </Link>
              <a className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors" href="#">
                <span className="material-symbols-outlined">favorite</span>
                Saved Spots
              </a>
              <a className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors" href="#">
                <span className="material-symbols-outlined">account_balance_wallet</span>
                Transactions
              </a>
              <Link className="w-full flex items-center gap-4 px-6 py-4 rounded-xl bg-surface-container-lowest text-on-surface font-bold shadow-sm" to="/profile">
                <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
                Profile
              </Link>
              <a className="w-full flex items-center gap-4 px-6 py-4 rounded-xl text-on-surface-variant font-medium hover:bg-surface-container-high transition-colors" href="#">
                <span className="material-symbols-outlined">settings</span>
                Settings
              </a>
            </div>
            <div className="bg-tertiary-container/20 rounded-lg p-6 mt-6 border border-tertiary/10">
              <span className="material-symbols-outlined text-tertiary text-4xl mb-4">help_center</span>
              <h3 className="font-headline font-bold text-on-tertiary-container mb-2">Need Help?</h3>
              <p className="text-sm text-on-tertiary-container/80 mb-4">Our curators are available 24/7 for support.</p>
              <button onClick={() => toast('Support portal link coming soon')} className="text-tertiary font-bold hover:underline">Contact Support</button>
            </div>
          </aside>

          {/* Profile Settings Body */}
          <div className="lg:col-span-9 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Personal Information */}
              <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary">person</span>
                  <h2 className="text-xl font-headline font-black">Personal Information</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1">Full Name</label>
                    <input
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary transition-all font-medium"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1">Email Address</label>
                    <div className="relative">
                      <input
                        className="w-full bg-surface-container border-none rounded-xl px-4 py-3 text-on-surface-variant cursor-not-allowed opacity-75 font-medium"
                        readOnly
                        type="email"
                        value={user?.email || ''}
                      />
                      <span className="material-symbols-outlined absolute right-4 top-3 text-sm text-on-surface-variant">lock</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1">Phone</label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary transition-all font-medium"
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1">Birth Date</label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary transition-all font-medium"
                        type="date"
                        value={birthDate}
                        onChange={e => setBirthDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Address Section */}
              <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary">location_on</span>
                  <h2 className="text-xl font-headline font-black">Address Details</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1">Country</label>
                    <select
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary transition-all appearance-none font-medium"
                      value={country}
                      onChange={e => setCountry(e.target.value)}
                    >
                      <option value="Bangladesh">Bangladesh</option>
                      <option value="United Arab Emirates">United Arab Emirates</option>
                      <option value="Singapore">Singapore</option>
                      <option value="Thailand">Thailand</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1">City</label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary transition-all font-medium"
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1">Postal Code</label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary transition-all font-medium"
                        type="text"
                        value={postalCode}
                        onChange={e => setPostalCode(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <div className="flex items-center justify-between p-4 bg-secondary-container/30 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-secondary">verified_user</span>
                        <div>
                          <p className="text-sm font-bold text-on-secondary-container">
                            {user?.isVerified ? 'Identity Verified' : 'Identity Not Verified'}
                          </p>
                          <p className="text-xs text-on-secondary-container/70 font-medium">
                            {user?.isVerified ? 'NID document approved' : 'NID verification required'}
                          </p>
                        </div>
                      </div>
                      {user?.isVerified ? (
                        <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                      ) : (
                        <span className="material-symbols-outlined text-tertiary" style={{ fontVariationSettings: "'FILL' 1" }}>cancel</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary">security</span>
                  <h2 className="text-xl font-headline font-black">Security</h2>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1">Current Password</label>
                    <input
                      className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary transition-all font-medium"
                      placeholder="••••••••"
                      type="password"
                      value={currentPassword}
                      onChange={e => setCurrentPassword(e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1">New Password</label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary transition-all font-medium"
                        placeholder="••••••••"
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest mb-1.5 ml-1">Confirm</label>
                      <input
                        className="w-full bg-surface-container-low border-none rounded-xl px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary transition-all font-medium"
                        placeholder="••••••••"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                  <p className="text-[11px] text-on-surface-variant italic px-1 font-medium">Min 8 chars with symbols required.</p>
                </div>
              </div>

              {/* Connections Section */}
              <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <span className="material-symbols-outlined text-primary">share</span>
                  <h2 className="text-xl font-headline font-black">Connections</h2>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm">
                        <img className="w-5 h-5" alt="Google Logo" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBJj9XZufx4POePGA94n3ERyBq2RNRdtZVxpDPhEXr-FZQOpondUFXn3elKqkdtHtumWEbVkK1H7RUOaBMFUAEMrIIdG8EsRuZM5O2lSuuzv-UOe_S9OyF1zHBOxedtsQYc9jNi1LRhSXlfvtr1elXWeNekOTVLvtH22SJCZJkLCPhYG-7xIetHuTXxU6Vp-CMLG-UZbk4bcxU9tGPki7spENU9Mn6m6E6pxebE5-agQXLxfYzcmgtLGTgj4pb34sSOr5nvQgcJmaU" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">Google</p>
                        <p className="text-xs text-on-surface-variant font-medium">Connected</p>
                      </div>
                    </div>
                    <button onClick={() => toast('OAuth integration coming soon')} className="text-xs font-bold text-tertiary hover:underline px-2">Disconnect</button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-surface-container-low rounded-2xl">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-on-surface-variant rounded-full flex items-center justify-center shadow-sm">
                        <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"></path></svg>
                      </div>
                      <div>
                        <p className="text-sm font-bold">Facebook</p>
                        <p className="text-xs text-on-surface-variant font-medium">Not connected</p>
                      </div>
                    </div>
                    <button onClick={() => toast('OAuth integration coming soon')} className="px-4 py-1.5 bg-primary text-on-primary rounded-full text-xs font-bold hover:shadow-md transition-all">Link</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Global Actions */}
            <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm border border-outline-variant/10">
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-lg font-headline font-bold">Ready to save?</h3>
                  <p className="text-sm text-on-surface-variant font-medium">Updates will be applied immediately to your profile.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-8 py-3.5 bg-primary text-on-primary font-headline font-extrabold rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                  <button
                    onClick={() => toast('Account deactivation requires contacting support')}
                    className="px-6 py-3.5 text-tertiary font-bold hover:bg-tertiary/10 rounded-full transition-all text-sm"
                  >
                    Deactivate Account
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
