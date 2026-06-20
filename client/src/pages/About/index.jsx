import { Link } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import buildersPortrait from '../../assets/builders2.jpeg'

export default function About() {
  return (
    <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          display: inline-block;
          line-height: 1;
          vertical-align: middle;
        }
      `}</style>

      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <main className="pt-20">
        {/* 1. Hero Section */}
        <section className="relative h-[870px] flex items-center justify-center overflow-hidden mx-4 my-4 rounded-xl">
          <div className="absolute inset-0 z-0">
            <img 
              alt="Lush green river landscape of Bangladesh" 
              className="w-full h-full object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDfNb-kvXQsMmaWFVsq4-VE0KQfOmPP_qXFgDa9bLYFVeV-7m2VOIf2-SCiV9vXH4dK-PegTjer1UMjT8OQZQu8UOCmHYmD_Q-3b0sX_PJ7a-UkyqRGbvGzRRmbhoBegBLkCROigAhUAHt8_yKcUWoqn29t5P2mBZQs9jTM5LVoP96q4fGz7WpSXII33Jf1wzCtLh-65ltxk-xYcqQ4KsDrF_Yqu0to0E7pG0gM3oj127F-03qHh5XHDJDh0fOsQzVcAuwMo1tPQOQ"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-on-surface/40 via-transparent to-on-surface/60"></div>
          </div>
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tighter leading-tight mb-6 font-headline">
              The Verdant Curator <br/> of Bangladesh
            </h1>
            <p className="text-xl md:text-2xl text-on-primary/90 font-medium mb-10 max-w-2xl mx-auto leading-relaxed">
              Simplifying domestic travel by framing the lush, riverine beauty of our delta through a lens of sophisticated modernism.
            </p>
            <div className="flex flex-col md:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const genesisSection = document.getElementById('genesis')
                  genesisSection?.scrollIntoView({ behavior: 'smooth' })
                }}
                className="bg-primary hover:bg-primary-container text-on-primary px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Discover Our Mission
              </button>
            </div>
          </div>
        </section>

        {/* 2. Our Story */}
        <section id="genesis" className="max-w-7xl mx-auto px-8 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <span className="text-tertiary font-headline font-bold tracking-widest uppercase text-sm">Our Genesis</span>
              <h2 className="text-4xl md:text-5xl font-black text-on-surface leading-tight font-headline">Eliminating the Friction of Discovery.</h2>
              <div className="space-y-6 text-lg text-on-surface-variant leading-relaxed">
                <p>
                  GHURBO was born from a singular frustration: the fragmented nature of exploring Bangladesh's hidden gems. For too long, travelers faced a labyrinth of disconnected bookings and unreliable information.
                </p>
                <p>
                  We envisioned a platform that serves as a digital concierge—one that promotes accessible tourism while curating experiences that honor the natural heritage of our delta. We don't just sell tickets; we weave narratives.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-[4/5] rounded-xl overflow-hidden shadow-2xl rotate-2">
                <img 
                  alt="Traditional wooden boat on a quiet river" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuC2eCuJ3Luq9r8UcJOsWHdP2ZCo3b2HUpkPfutgu_lpRxx3nFrL1b8pgyzK_G8M0Pab0wGquFn1k6WwtbxzBK4ACZWuxDPnnKQveQ-vNAwKIG02QOdujufVS5fR-22Xibrs1C1EFJkWTkWClndnWbT2sEQnd-e-RdVyw2RtPfWwpSHRZxHXpd10yJs2sZ1boXYfevf-hcjlmgrh70opCLNERGamTmvWXfTVRQDPK5rv0SVcK2Y91a0mRtBvmNXRT6VzRufZisvKEjE"
                />
              </div>
              <div className="absolute -bottom-8 -left-8 w-64 aspect-square rounded-xl overflow-hidden shadow-2xl -rotate-6">
                <img 
                  alt="Local artisan at work" 
                  className="w-full h-full object-cover" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBz2siqu51OJFZpBOIkPUVmHh9p5b1OWODR_7bQo-rxfkK_hH8DVVBKm9b54JQwVCfKEx-IZrDFInwU6lHBfgGmzySappakTIT1H0wRAzuSKfmIs-b40s629mir3pWjzKa5mC5IZK-fgZsayOyQmHVfgxl48ANnd1SUuF6n2driqNjDOexpFvest0_OLPBh2oG0Kq8H4NrXfVTvhoxL_ruzbPTr8QSkOVbTebW5YsDiuqIm33MXHFddT9LmjQG0rNblH1vhlmWsKuE"
                />
              </div>
            </div>
          </div>
        </section>

        {/* 3. Core Values */}
        <section className="bg-surface-container-low py-24">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-black text-on-surface font-headline">The Pillars of GHURBO</h2>
              <p className="text-on-surface-variant mt-4 text-lg">Our commitment to a better travel ecosystem.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Value 1 */}
              <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm hover:shadow-on-surface/5 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-primary-container flex items-center justify-center text-on-primary-container mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-on-surface font-headline">Sustainability</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Promoting eco-conscious travel that preserves the delicate ecosystem of the Sundarbans and beyond.</p>
              </div>
              {/* Value 2 */}
              <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm hover:shadow-on-surface/5 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-secondary-container flex items-center justify-center text-on-secondary-container mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>accessible_forward</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-on-surface font-headline">Accessibility</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Ensuring travel information and experiences are reachable for every citizen, regardless of tech-savviness.</p>
              </div>
              {/* Value 3 */}
              <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm hover:shadow-on-surface/5 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-tertiary flex items-center justify-center text-on-primary mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>verified_user</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-on-surface font-headline">Reliability</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Verified partnerships and real-time updates that turn fragmented plans into seamless journeys.</p>
              </div>
              {/* Value 4 */}
              <div className="bg-surface-container-lowest p-8 rounded-lg shadow-sm hover:shadow-on-surface/5 transition-all group">
                <div className="w-14 h-14 rounded-2xl bg-surface-container-high flex items-center justify-center text-on-surface-variant mb-6 group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>rocket_launch</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-on-surface font-headline">Innovation</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed">Leveraging the full potential of the MERN stack to deliver a fast, responsive, and intuitive experience.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Impact Stats */}
        <section className="py-24 max-w-7xl mx-auto px-8">
          <div className="bg-on-surface text-surface-bright rounded-xl p-12 md:p-20 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full blur-3xl -mr-32 -mt-32"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-16 text-center relative z-10">
              <div className="space-y-4">
                <div className="text-6xl font-black text-primary-container tracking-tighter font-headline">64</div>
                <div className="text-lg font-bold text-on-surface-variant font-headline">Destinations Covered</div>
                <p className="text-outline-variant text-sm px-4">From the hills of Sylhet to the beaches of Cox's Bazar.</p>
              </div>
              <div className="space-y-4">
                <div className="text-6xl font-black text-primary-container tracking-tighter font-headline">12k+</div>
                <div className="text-lg font-bold text-on-surface-variant font-headline">Happy Travelers</div>
                <p className="text-outline-variant text-sm px-4">Trusted by explorers across the country and beyond.</p>
              </div>
              <div className="space-y-4">
                <div className="text-6xl font-black text-primary-container tracking-tighter font-headline">450+</div>
                <div className="text-lg font-bold text-on-surface-variant font-headline">Partner Networks</div>
                <p className="text-outline-variant text-sm px-4">Direct collaboration with local guides and eco-resorts.</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Meet the Vision */}
        <section className="max-w-7xl mx-auto px-8 py-24">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <div className="lg:w-1/3">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary rounded-xl rotate-3 group-hover:rotate-6 transition-transform"></div>
                <img 
                  alt="Founder Portrait" 
                  className="relative rounded-xl w-full object-cover aspect-square grayscale group-hover:grayscale-0 transition-all" 
                  src={buildersPortrait}
                />
              </div>
            </div>
            <div className="lg:w-2/3 space-y-8">
              <h2 className="text-4xl font-black text-on-surface font-headline">Pioneering Digital Transformation</h2>
              <p className="text-xl text-on-surface-variant leading-relaxed">
                At the heart of GHURBO is a commitment to modern engineering. Our leadership team chose the <span className="text-primary font-bold">MERN stack</span> not just for its performance, but for its flexibility in building a truly dynamic travel ecosystem.
              </p>
              <p className="text-lg text-on-surface-variant">
                We are merging the art of storytelling with the science of software to ensure that every click leads to a real-world memory. Our vision is to set the gold standard for travel technology in South Asia.
              </p>
              <div className="flex items-center gap-4">
                <span className="font-headline font-bold text-on-surface uppercase tracking-widest text-sm">The Engineering Board</span>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Call to Action */}
        <section className="py-24 px-8 text-center bg-surface-container-high mx-4 mb-20 rounded-xl">
          <h2 className="text-4xl md:text-5xl font-black text-on-surface mb-6 font-headline">Ready to see the delta?</h2>
          <p className="text-on-surface-variant text-lg max-w-xl mx-auto mb-10">
            Experience the curated magic of Bangladesh with our latest hand-picked itineraries.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center gap-3 bg-on-surface text-surface-container-lowest px-12 py-5 rounded-full font-black text-xl hover:bg-primary transition-colors shadow-2xl hover:scale-[1.02] active:scale-[0.98] duration-200"
          >
            Explore the Delta
            <span className="material-symbols-outlined">east</span>
          </Link>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
