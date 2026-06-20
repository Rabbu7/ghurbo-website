import axios from './axios'

export const getAdminDashboard = async () => {
  const { data } = await axios.get('/admin/dashboard')
  return data
}

export const getAdminBookings = async ({ page = 1, limit = 10 } = {}) => {
  const { data } = await axios.get(`/admin/bookings?page=${page}&limit=${limit}`)
  return data
}

export const approvePartner = async (id) => {
  const { data } = await axios.patch(`/admin/partners/${id}/approve`)
  return data
}
