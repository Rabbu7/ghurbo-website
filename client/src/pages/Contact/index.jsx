import { useState } from 'react'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function Contact() {
  const [openFaq, setOpenFaq] = useState(null)
  const toggleFaq = (index) => setOpenFaq(openFaq === index ? null : index)

  const faqs = [
    {
      question: 'How do I customize my riverine itinerary?',
      answer: 'Our curators specialize in bespoke journeys. Once you select a base itinerary, you can use the "Modify" button to add private boat tours, heritage stays, or culinary workshops. Alternatively, schedule a call with a curator to build from scratch.'
    },
    {
      question: 'What is your sustainability pledge?',
      answer: 'GHURBO commits 5% of every booking to local reforestation and water purification projects in the Sundarbans. We partner exclusively with eco-certified lodges and local guides.'
    },
    {
      question: 'Can I book for a large private group?',
      answer: 'Yes, we offer exclusive charter options for groups of 10 or more. This includes private vessels and dedicated concierge staff throughout the journey.'
    }
  ]

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: 'Trip Inquiry',
    message: ''
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Mock form submission
    setFormSubmitted(true)
    setTimeout(() => setFormSubmitted(false), 3000)
    setFormData({ name: '', email: '', subject: 'Trip Inquiry', message: '' })
  }

  return (
    <div className="min-h-screen bg-surface text-on-surface font-body selection:bg-primary-container selection:text-on-primary-container">
      <style>{`
        .material-symbols-outlined {
          font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
          font-family: 'Material Symbols Outlined';
          display: inline-block;
          line-height: 1;
        }
      `}</style>

      {/* Navigation */}
      <Navbar />

      <main className="pt-32 pb-20">
        {/* Hero Search Section */}
        <section className="max-w-7xl mx-auto px-6 mb-24">
          <div className="relative bg-surface-container-low rounded-xl p-12 md:p-24 overflow-hidden flex flex-col items-center text-center">
            {/* Decorative background elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary-container/30 rounded-full -mr-20 -mt-20 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-secondary-container/20 rounded-full -ml-20 -mb-20 blur-3xl"></div>
            <h1 className="text-5xl md:text-7xl font-extrabold text-on-surface mb-8 tracking-tight max-w-3xl font-headline">
              How can we help?
            </h1>
            <div className="w-full max-w-2xl relative">
              <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                <span className="material-symbols-outlined text-on-surface-variant/60">search</span>
              </div>
              <input 
                className="w-full pl-16 pr-8 py-6 bg-surface-container-lowest rounded-xl border-none shadow-xl shadow-on-surface/5 focus:ring-2 focus:ring-primary text-lg outline-none text-on-surface placeholder:text-on-surface-variant/40" 
                placeholder="Search for itineraries, bookings, or policies..." 
                type="text"
              />
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <span className="text-on-surface-variant text-sm font-medium">Popular:</span>
              <button type="button" className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-sm font-medium hover:bg-secondary-container/80 transition-colors">
                Refund Policy
              </button>
              <button type="button" className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-sm font-medium hover:bg-secondary-container/80 transition-colors">
                Visa Support
              </button>
              <button type="button" className="bg-secondary-container text-on-secondary-container px-4 py-1.5 rounded-full text-sm font-medium hover:bg-secondary-container/80 transition-colors">
                Group Travel
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Categories & Accordion */}
        <section className="max-w-7xl mx-auto px-6 mb-32">
          <div className="grid lg:grid-cols-12 gap-16">
            {/* Sidebar Navigation */}
            <aside className="lg:col-span-4">
              <div className="sticky top-32 space-y-2">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3 font-headline text-on-surface">
                  <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>help_center</span>
                  Support Topics
                </h2>
                <button type="button" className="w-full flex items-center justify-between p-5 rounded-lg bg-primary-container text-on-primary-container font-bold text-left">
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>confirmation_number</span>
                    Booking &amp; Planning
                  </span>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
                <button type="button" className="w-full flex items-center justify-between p-5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors text-left text-on-surface-variant font-medium">
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>payments</span>
                    Payments &amp; Billing
                  </span>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
                <button type="button" className="w-full flex items-center justify-between p-5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors text-left text-on-surface-variant font-medium">
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>cancel_schedule_send</span>
                    Cancellations &amp; Refunds
                  </span>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
                <button type="button" className="w-full flex items-center justify-between p-5 rounded-lg bg-surface-container-low hover:bg-surface-container-high transition-colors text-left text-on-surface-variant font-medium">
                  <span className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>eco</span>
                    Sustainable Travel
                  </span>
                  <span className="material-symbols-outlined">chevron_right</span>
                </button>
              </div>
            </aside>
            {/* Accordion Items */}
            <div className="lg:col-span-8 space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-surface-container-lowest rounded-xl overflow-hidden shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleFaq(index)}
                    className="w-full p-6 flex justify-between items-center text-left hover:bg-surface-container-low transition-colors"
                  >
                    <span className="font-headline font-bold text-on-surface text-lg">{faq.question}</span>
                    <span className={`material-symbols-outlined text-primary transition-transform ${openFaq === index ? 'rotate-180' : ''}`}>
                      expand_more
                    </span>
                  </button>
                  {openFaq === index && (
                    <div className="px-6 pb-6 text-on-surface-variant leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Get In Touch Section */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Contact Info Cards */}
            <div className="space-y-8">
              <div className="max-w-md">
                <h2 className="text-4xl font-extrabold mb-6 tracking-tight font-headline text-on-surface">Get in Touch</h2>
                <p className="text-on-surface-variant text-lg mb-10 leading-relaxed font-body">
                  We prefer conversations over tickets. Reach out via any channel and our team in Dhaka will respond within 4 hours.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {/* Phone */}
                <div className="bg-surface-container-low p-8 rounded-lg flex flex-col items-start gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-primary">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 font-headline text-on-surface">Call Us</h4>
                    <p className="text-on-surface-variant">+880 1711 000 000</p>
                  </div>
                </div>
                {/* Email */}
                <div className="bg-surface-container-low p-8 rounded-lg flex flex-col items-start gap-4 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>mail</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg mb-1 font-headline text-on-surface">Email Support</h4>
                    <p className="text-on-surface-variant">curator@ghurbo.travel</p>
                  </div>
                </div>
                {/* Office */}
                <div className="bg-surface-container-low p-8 rounded-lg flex flex-col items-start gap-4 sm:col-span-2 shadow-sm">
                  <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center text-on-surface">
                    <span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>location_on</span>
                  </div>
                  <div className="grid sm:grid-cols-2 gap-8 w-full">
                    <div>
                      <h4 className="font-bold text-lg mb-1 font-headline text-on-surface">Dhaka Studio</h4>
                      <p className="text-on-surface-variant">IIT, Jahangirnagar University, Savar, Dhaka</p>
                    </div>
                    <div className="relative h-24 rounded-md overflow-hidden bg-outline-variant/20">
                      <img 
                        className="w-full h-full object-cover opacity-60 grayscale hover:grayscale-0 transition-all duration-500" 
                        alt="Jahangirnagar University Dhaka Studio Location" 
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuDHnhixO_2z2JVeG-3RpC5wjlgMmDS0v_a5L9P3u0oyYIrFgKOEB7-kTykaQ0dvkXdMQYbuOA4qr82udR7u_Qp36yLrnrPhrHfbqisz8ghDLafGKr2FOZGQa8EDpv3uF_IFbycsimQjWsi4oxUI8jQtVSLNRdL_1KNL5gMS27vG4OknxoDH9PY406FRerbXuWrOzO5i0BZDp-rdnN2pa_8uPRbn5HoTuk-JUTQnI467e9x0IRzXahuNR3U1uYBcoGXKcXLohTYNEGQ"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-surface-container-lowest p-8 md:p-12 rounded-xl shadow-2xl shadow-on-surface/5">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-2">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your Name"
                      className="w-full bg-surface-container rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all text-on-surface placeholder:text-on-surface-variant/40"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-on-surface-variant mb-2">Email Address</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="email@example.com"
                      className="w-full bg-surface-container rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all text-on-surface placeholder:text-on-surface-variant/40"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2">Subject</label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full bg-surface-container rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none transition-all text-on-surface"
                  >
                    <option>Trip Inquiry</option>
                    <option>Billing Issue</option>
                    <option>Sustainability Partnership</option>
                    <option>Media/Press</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-on-surface-variant mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell us how we can craft your perfect journey..."
                    rows="6"
                    className="w-full bg-surface-container rounded-xl p-4 focus:ring-2 focus:ring-primary outline-none resize-none transition-all text-on-surface placeholder:text-on-surface-variant/40"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary py-4 rounded-full font-headline font-bold text-lg hover:opacity-90 active:scale-95 transition-all shadow-lg shadow-primary/20"
                >
                  Send Message
                </button>
                {formSubmitted && (
                  <p className="text-center text-primary font-bold animate-pulse">Message sent successfully!</p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
