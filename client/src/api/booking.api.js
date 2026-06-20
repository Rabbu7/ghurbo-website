import api from './axios'

export async function createBooking(payload) {
  const res = await api.post('/bookings/create', payload)
  return res.data
}

export async function myBookings() {
  const res = await api.get('/bookings/my')
  return res.data
}

export async function getBookingById(id) {
  const res = await api.get(`/bookings/${id}`)
  return res.data
}

export async function cancelBooking(id, payload) {
  const res = await api.patch(`/bookings/${id}/cancel`, payload)
  return res.data
}

export async function getTicket(id) {
  const res = await api.get(`/bookings/${id}/ticket`)
  return res.data
}

