import api from './axios'

export async function listHotels(query) {
  const res = await api.get('/hotels', { params: query })
  return res.data
}

export async function getHotel(id) {
  const res = await api.get(`/hotels/${id}`)
  return res.data
}
