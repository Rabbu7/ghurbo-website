import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { register as registerRequest } from '../../api/auth.api'
import { applyPartner } from '../../api/partner.api'
import toast from 'react-hot-toast'
import Footer from '../../components/Footer'

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [role, setRole] = useState('user')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [terms, setTerms] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Partner-specific fields
  const [businessName, setBusinessName] = useState('')
  const [partnerType, setPartnerType] = useState('hotel')
  const [address, setAddress] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }
    if (!terms) {
      setError('Please accept the terms and conditions')
      return
    }
    if (role === 'partner') {
      if (!businessName.trim()) {
        setError('Business Name is required')
        return
      }
      if (!address.trim()) {
        setError('Business Address is required')
        return
      }
    }

    setLoading(true)
    try {
      const res = await registerRequest({ name, email, phone, password, role })
      login(res.user, res.token)

      if (role === 'partner') {
        try {
          await applyPartner({
            business_name: businessName,
            type: partnerType,
            contact_info: {
              phone,
              address,
              email,
            },
          })
          toast.success('Application submitted — pending review')
          navigate('/')
        } catch (partnerErr) {
          console.error('Partner application failed:', partnerErr)
          toast.error('Account created, but partner application failed — you can retry from your profile')
          navigate('/')
        }
      } else {
        navigate('/')
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface text-on-surface min-h-screen selection:bg-primary-container selection:text-on-primary-container flex flex-col">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          display: inline-block;
          line-height: 1;
        }
      `}</style>

      <main className="flex-grow flex flex-col md:flex-row">
        {/* Brand/Hero Side */}
        <section className="relative hidden md:flex md:w-5/12 lg:w-1/2 flex-col justify-between p-12 overflow-hidden bg-primary">
          <div className="absolute inset-0 z-0">
            <img
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              data-alt="Lush green tea gardens of Sylhet Bangladesh"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhIOh7xznTPRMqWBwWa0lKscYTqmuBXU5iRropzK_ixzPw_RABLvMg4T4oS_1_ckwgEpJ0hu-wncAoMR9pAC9THrH6YMHS6gKYVyDwAjQJlEkKc7jya1CUR_AKJemBFvfTCtrtWh7pDaErciEzHtTHnbMfHLVrPemFUE1A87gTv-owWRUlaDE_GbNdYYqArpHhsnJabTJKknGnTtw25JtcHOAj4fc1YB68ItGXgQjzYv7IkNNaD-TCKXB5JX7hvnBUGvd3BXkTt60"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-primary via-primary/40 to-transparent"></div>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2">
              <span className="text-3xl font-['Plus_Jakarta_Sans'] font-black text-on-primary tracking-tighter">GHURBO</span>
            </div>
          </div>
          <div className="relative z-10 max-w-lg">
            <h1 className="text-5xl lg:text-6xl font-headline font-extrabold text-on-primary tracking-tight leading-[1.1]">
              Discover the <span className="text-primary-fixed">Verdant Beauty</span> of Bengal.
            </h1>
            <p className="mt-6 text-xl text-on-primary/80 leading-relaxed font-body">
              Join our community of mindful travelers and local curators. Your journey through the riverine delta starts here.
            </p>
          </div>
          <div className="relative z-10">
            <div className="flex -space-x-4">
              <img
                className="w-12 h-12 rounded-full border-4 border-primary object-cover"
                data-alt="User profile photo avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPgncjDugRAW_cJy0n4Rde2R4VXhOkmg5CLbXOd-_xIJfw3L5g0IqTR_Dc04T4j0ykCdzdUe2uuBRgjQtUAIX14HPkTjdkrz_vDndQgSTPTzWoqJMCeNX1vz1OOISW1QclkvEViMgL9_x2XT_dHfrL7FuKA_zlbBaQqWfxmqrqTH-74z8fdcN9fzhj8yqu8GHBpNLR5KrueEc4YBMNyniSrn9mJlVyTmIs_v1nlq8D-_UjBpRzXvSJ3F7jMZpLwh_wuXBHpJvueE0"
              />
              <img
                className="w-12 h-12 rounded-full border-4 border-primary object-cover"
                data-alt="User profile photo avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCW0P3FFwP_wOwk4uL1SCcysvvX1_0DguYabLz8LbZ0G8WlC1Xl60UW1uxhRnpNGs9Gshn7kT4XWMtwSJ93VVPBW4gOdJl1gdETPKaSzRFFXspWkgwWFpfBAlZ-CBr-v2_byNlIlOD3mMog2sE4nRj_nXb73BGWTX8ahMWSsdfEv8bMVODc-WPms3SVvbu3kKC09Hq_7H0d4jFVTQxz_4-dsugrevU0iATUbdHjjQe3SplZEvbd3VAeLstaQJmJrkAuJ0cIbLxz80o"
              />
              <img
                className="w-12 h-12 rounded-full border-4 border-primary object-cover"
                data-alt="User profile photo avatar"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBairSXNFAho6X-6TG_AsHwRivFSHlignEzYVUxwOcjtdw6Z6lCRbV7EgVcexm3zMmsXMwMMQgD3neKd08LcP8_5EC7TAOkPg0NBU8ZYjES7DEMmNkjIrsCFtZUQwziz4ffYyY5SxD6cfb7fs9P7dfkOhMcWKe3YAWlwa6wuZ0OfrdHfVoC_XCOeW1IyXm9JvgOwQZq_GAabZmrKQtTSjtwAG77iCxwvRiQwboUTDm8QIX6ZaA0kcZAm3uE9W8XnrhqE2WiEhpm_yw"
              />
              <div className="w-12 h-12 rounded-full border-4 border-primary bg-primary-container flex items-center justify-center text-on-primary-container font-bold text-sm">
                +2k
              </div>
            </div>
            <p className="mt-3 text-sm text-on-primary/60 font-medium">Join over 2,000+ travelers today.</p>
          </div>
        </section>

        {/* Form Side */}
        <section className="flex-1 flex flex-col justify-center items-center p-6 md:p-12 lg:p-20 bg-surface">
          {/* Mobile Header Only */}
          <div className="md:hidden w-full mb-12 flex justify-center">
            <span className="text-3xl font-['Plus_Jakarta_Sans'] font-black text-primary tracking-tighter">GHURBO</span>
          </div>
          <div className="w-full max-w-md">
            <header className="mb-10 text-center md:text-left">
              <h2 className="text-3xl font-headline font-bold text-on-surface">Create an account</h2>
              <p className="text-on-surface-variant mt-2">Start your premium travel experience today.</p>
            </header>
            <form className="space-y-5" onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div className="flex gap-4 p-1 bg-surface-container-low rounded-xl mb-8">
                <label className="flex-1 relative cursor-pointer">
                  <input
                    checked={role === 'user'}
                    onChange={() => setRole('user')}
                    className="peer sr-only"
                    name="role"
                    type="radio"
                  />
                  <div className="py-3 text-center rounded-lg font-semibold text-on-surface-variant transition-all peer-checked:bg-surface-container-lowest peer-checked:text-primary peer-checked:shadow-sm">
                    Traveler
                  </div>
                </label>
                <label className="flex-1 relative cursor-pointer">
                  <input
                    checked={role === 'partner'}
                    onChange={() => setRole('partner')}
                    className="peer sr-only"
                    name="role"
                    type="radio"
                  />
                  <div className="py-3 text-center rounded-lg font-semibold text-on-surface-variant transition-all peer-checked:bg-surface-container-lowest peer-checked:text-primary peer-checked:shadow-sm">
                    Partner
                  </div>
                </label>
              </div>

              <div className="space-y-4">
                {/* Name Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="name">Full Name</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">person</span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-on-surface-variant/40"
                      id="name"
                      placeholder="Enter your name"
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                    />
                  </div>
                </div>

                {/* Email Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="email">Email Address</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">mail</span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-on-surface-variant/40"
                      id="email"
                      placeholder="name@company.com"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                {/* Phone Field */}
                <div className="space-y-1.5">
                  <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="phone">Phone Number</label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">call</span>
                    <input
                      className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-on-surface-variant/40"
                      id="phone"
                      placeholder="+880 1XXX-XXXXXX"
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                    />
                  </div>
                </div>

                {role === 'partner' && (
                  <>
                    {/* Business Name */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="businessName">Business Name</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">domain</span>
                        <input
                          className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-on-surface-variant/40"
                          id="businessName"
                          placeholder="Enter your business name"
                          type="text"
                          required
                          value={businessName}
                          onChange={e => setBusinessName(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Partner Type */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface-variant px-1">Partner Type</label>
                      <div className="flex gap-4 p-1 bg-surface-container-low rounded-xl">
                        <label className="flex-1 relative cursor-pointer">
                          <input
                            checked={partnerType === 'hotel'}
                            onChange={() => setPartnerType('hotel')}
                            className="peer sr-only"
                            name="partnerType"
                            type="radio"
                          />
                          <div className="py-2 text-sm text-center rounded-lg font-semibold text-on-surface-variant transition-all peer-checked:bg-surface-container-lowest peer-checked:text-primary peer-checked:shadow-sm">
                            Hotel Partner
                          </div>
                        </label>
                        <label className="flex-1 relative cursor-pointer">
                          <input
                            checked={partnerType === 'transport'}
                            onChange={() => setPartnerType('transport')}
                            className="peer sr-only"
                            name="partnerType"
                            type="radio"
                          />
                          <div className="py-2 text-sm text-center rounded-lg font-semibold text-on-surface-variant transition-all peer-checked:bg-surface-container-lowest peer-checked:text-primary peer-checked:shadow-sm">
                            Transport Partner
                          </div>
                        </label>
                        <label className="flex-1 relative cursor-pointer">
                          <input
                            checked={partnerType === 'both'}
                            onChange={() => setPartnerType('both')}
                            className="peer sr-only"
                            name="partnerType"
                            type="radio"
                          />
                          <div className="py-2 text-sm text-center rounded-lg font-semibold text-on-surface-variant transition-all peer-checked:bg-surface-container-lowest peer-checked:text-primary peer-checked:shadow-sm">
                            Both
                          </div>
                        </label>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-1.5">
                      <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="address">Business Address</label>
                      <div className="relative">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">location_on</span>
                        <input
                          className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-on-surface-variant/40"
                          id="address"
                          placeholder="123 Dhaka St, Bangladesh"
                          type="text"
                          required
                          value={address}
                          onChange={e => setAddress(e.target.value)}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="password">Password</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">lock</span>
                      <input
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-on-surface-variant/40"
                        id="password"
                        placeholder="••••••••"
                        type="password"
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                      />
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div className="space-y-1.5">
                    <label className="text-sm font-semibold text-on-surface-variant px-1" htmlFor="confirm_password">Confirm</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant text-xl">key</span>
                      <input
                        className="w-full pl-12 pr-4 py-3.5 bg-surface-container-lowest border-none rounded-xl focus:ring-2 focus:ring-primary/20 transition-all text-on-surface placeholder:text-on-surface-variant/40"
                        id="confirm_password"
                        placeholder="••••••••"
                        type="password"
                        value={confirmPassword}
                        onChange={e => setConfirmPassword(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 mt-6">
                <input
                  className="mt-1 w-5 h-5 rounded border-outline-variant text-primary focus:ring-primary transition-all bg-surface-container-lowest"
                  id="terms"
                  type="checkbox"
                  checked={terms}
                  onChange={e => setTerms(e.target.checked)}
                />
                <label className="text-sm text-on-surface-variant leading-relaxed" htmlFor="terms">
                  I agree to the <Link to="/about" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">Terms of Service</Link> and <Link to="/about" className="text-primary font-semibold hover:underline decoration-2 underline-offset-4">Privacy Policy</Link>.
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-error text-sm font-medium text-center">{error}</p>
              )}

              {/* Submit Button */}
              <button
                disabled={loading}
                className="w-full mt-8 py-4 px-6 bg-gradient-to-r from-primary to-primary-dim text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 active:scale-95 transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                type="submit"
              >
                <span>{loading ? 'Creating Account...' : 'Create Account'}</span>
                <span className="material-symbols-outlined group-hover:translate-x-1 transition-transform">arrow_forward</span>
              </button>
            </form>

            <footer className="mt-10 text-center">
              <p className="text-on-surface-variant">
                Already have an account?
                <Link to="/login" className="text-primary font-bold hover:underline decoration-2 underline-offset-4 ml-1">Log in</Link>
              </p>
            </footer>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
