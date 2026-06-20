export default function BookingStatusBadge({ status = 'CONFIRMED' }) {
  const cls = status === 'CONFIRMED' ? 'bg-primary text-on-primary' : 'bg-rose-500 text-white'
  return <span className={`px-2 py-1 rounded-full ${cls}`}>{status}</span>
}
