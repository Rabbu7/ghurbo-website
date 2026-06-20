import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="w-full rounded-t-[3rem] mt-20 bg-surface-container-low flex flex-col md:flex-row justify-between items-center px-12 py-10">
      <div className="flex flex-col items-center md:items-start gap-4 mb-8 md:mb-0">
        <div className="text-lg font-bold text-on-surface font-headline">GHURBO</div>
        <p className="text-on-surface-variant/80 font-body text-sm max-w-xs text-center md:text-left">
          Redefining Bangladeshi tourism through editorial discovery and seamless booking.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-8 mb-8 md:mb-0">
        <Link to="/about" className="font-body text-sm text-on-surface-variant/80 hover:underline decoration-primary underline-offset-4 transition-opacity opacity-80 hover:opacity-100">About Us</Link>
        <span className="font-body text-sm text-on-surface-variant/80 hover:underline decoration-primary underline-offset-4 transition-opacity opacity-80 hover:opacity-100">Travel Guide</span>
        <Link to="/contact" className="font-body text-sm text-on-surface-variant/80 hover:underline decoration-primary underline-offset-4 transition-opacity opacity-80 hover:opacity-100">Contact Support</Link>
        <span className="font-body text-sm text-on-surface-variant/80 hover:underline decoration-primary underline-offset-4 transition-opacity opacity-80 hover:opacity-100">Privacy Policy</span>
        <span className="font-body text-sm text-on-surface-variant/80 hover:underline decoration-primary underline-offset-4 transition-opacity opacity-80 hover:opacity-100">Terms of Service</span>
      </div>
      <div className="text-on-surface font-body text-sm text-center md:text-right">
        © 2026 GHURBO Bangladesh. All rights reserved.
      </div>
    </footer>
  )
}

