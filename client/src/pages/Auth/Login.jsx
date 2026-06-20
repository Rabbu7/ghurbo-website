import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { login as loginRequest } from '../../api/auth.api'
import Footer from '../../components/Footer'
import facebookIcon from '../../assets/facebook-f-brands-solid-full.svg'
import googleIcon from '../../assets/google-brands-solid-full.svg'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [remember, setRemember] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await loginRequest({ email: identity, password })
      login(res.user, res.token)
      const getRedirectPath = (user) => {
        if (user.role === 'admin') return '/admin'
        if (user.role === 'partner') {
          if (!user.isApproved) return '/'
          return user.partnerType === 'transport' ? '/partner/transport' : '/partner/hotel'
        }
        return '/dashboard'
      }
      navigate(getRedirectPath(res.user), { replace: true })
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface font-body text-on-surface selection:bg-primary-container selection:text-on-primary-container min-h-screen flex flex-col">
      <style>{`
        .bg-editorial-gradient {
          background: linear-gradient(135deg, #00694d 0%, #9ef4d0 100%);
        }
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          display: inline-block;
          line-height: 1;
        }
      `}</style>

      <main className="flex-grow flex items-center justify-center p-6 md:p-12">
        <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 bg-surface-container-low rounded-xl overflow-hidden shadow-sm shadow-on-surface/5">
          {/* Left Side: Editorial Branding & Image */}
          <div className="relative hidden lg:flex flex-col justify-end p-12 overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img
                alt="Scenic view of a boat on a serene river in Bangladesh"
                className="w-full h-full object-cover grayscale-[20%] brightness-75 scale-105"
                data-alt="Lush green river landscape of Bangladesh with traditional boat"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBjxv8Oqp6lRulqwXzJW4h3otaf4FOm2o2YMFCTWLRsntGQrLfZ9mCir3wxIGJKTX7iKobnILjT1-NaP-lxP-NABzTcAtDPuouzV9OhwlcUFSJ3YXWqyCEnq_Awf6B2WO-0im5FWc3JHY_8OQZJWM5wen1zVbHbwBpSDyn_EMtIcjgqcTwg38f8bNG2KJcJDF_E9VKF4csbzQSG1TMWopqwYDPOP9oF5Oi0h9B-_ZPq6N2G96psEW7HimDqxnPllqxxuTg14zSpd4U"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-on-surface/80 via-transparent to-transparent"></div>
            </div>
            <div className="relative z-10">
              <h1 className="font-headline text-5xl font-black text-on-primary tracking-tighter mb-4">GHURBO</h1>
              <p className="text-on-primary/80 text-xl font-headline font-medium max-w-sm">Discover the verdant soul of the riverine delta.</p>
            </div>
          </div>

          {/* Right Side: Login Interface */}
          <div className="bg-surface-container-lowest p-8 md:p-16 flex flex-col justify-center">
            <div className="mb-10 lg:hidden">
              <span className="font-headline text-2xl font-black text-primary tracking-tighter">GHURBO</span>
            </div>
            <div className="max-w-md w-full mx-auto">
              <header className="mb-8">
                <h2 className="font-headline text-3xl font-extrabold tracking-tight text-on-surface mb-2">Welcome Back</h2>
                <p className="text-on-surface-variant font-medium">Please enter your details to access your journey.</p>
              </header>
              <form className="space-y-6" onSubmit={handleSubmit}>
                {/* Identity Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1" htmlFor="identity">Email or Phone Number</label>
                  <div className="relative group">
                    <input
                      className="w-full h-14 px-5 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary transition-all font-medium placeholder:text-on-surface-variant/40"
                      id="identity"
                      placeholder="name@example.com"
                      type="text"
                      value={identity}
                      onChange={e => setIdentity(e.target.value)}
                    />
                    <span className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50">mail</span>
                  </div>
                </div>

                {/* Password Input */}
                <div className="space-y-2">
                  <label className="block text-sm font-semibold text-on-surface-variant ml-1" htmlFor="password">Password</label>
                  <div className="relative group">
                    <input
                      className="w-full h-14 px-5 bg-surface-container rounded-lg border-none focus:ring-2 focus:ring-primary transition-all font-medium placeholder:text-on-surface-variant/40"
                      id="password"
                      placeholder="••••••••"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                    />
                    <span
                      onClick={() => setShowPassword(p => !p)}
                      className="material-symbols-outlined absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant/50 cursor-pointer"
                    >
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between px-1">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className="relative flex items-center justify-center">
                      <input
                        className="peer appearance-none w-5 h-5 rounded-sm border-2 border-outline-variant checked:bg-primary checked:border-primary transition-all cursor-pointer"
                        type="checkbox"
                        checked={remember}
                        onChange={e => setRemember(e.target.checked)}
                      />
                      <span className="material-symbols-outlined absolute text-[14px] text-on-primary scale-0 peer-checked:scale-100 transition-transform pointer-events-none">check</span>
                    </div>
                    <span className="text-sm font-medium text-on-surface-variant group-hover:text-on-surface transition-colors">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm font-bold text-primary hover:text-primary-dim transition-colors">Forgot password?</Link>
                </div>

                {/* Error Message */}
                {error && (
                  <p className="text-error text-sm font-medium text-center">{error}</p>
                )}

                {/* Primary Action */}
                <button
                  disabled={loading}
                  className="w-full h-14 bg-editorial-gradient text-on-primary font-headline font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 group disabled:opacity-50"
                  type="submit"
                >
                  <span>{loading ? 'Logging in...' : 'Login to Account'}</span>
                  <span className="material-symbols-outlined transition-transform group-hover:translate-x-1">arrow_forward</span>
                </button>

                {/* Divider */}
                <div className="relative py-4 flex items-center gap-4">
                  <div className="flex-grow h-px bg-surface-container-high"></div>
                  <span className="text-xs font-bold text-on-surface-variant/60 uppercase tracking-widest">or continue with</span>
                  <div className="flex-grow h-px bg-surface-container-high"></div>
                </div>

                {/* Social Logins */}
                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-3 h-14 bg-surface-container rounded-full hover:bg-surface-container-high transition-all group" type="button">
                    <img
                      alt="Google"
                      className="w-5 h-5 object-contain"
                      data-alt="Google logo icon"
                      src={googleIcon}
                    />
                    <span className="text-sm font-bold text-on-surface">Google</span>
                  </button>
                  <button className="flex items-center justify-center gap-3 h-14 bg-surface-container rounded-full hover:bg-surface-container-high transition-all group" type="button">
                    <img
                      alt="Facebook"
                      className="w-5 h-5 object-contain"
                      data-alt="Facebook logo icon"
                      src={facebookIcon}
                    />
                    <span className="text-sm font-bold text-on-surface">Facebook</span>
                  </button>
                </div>
              </form>

              <footer className="mt-10 text-center">
                <p className="text-on-surface-variant font-medium">
                  Don't have an account?
                  <Link to="/register" className="text-primary font-bold hover:underline underline-offset-4 ml-1">Create Account</Link>
                </p>
              </footer>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
