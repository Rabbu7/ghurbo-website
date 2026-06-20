import api from './axios'

export async function searchRoute(payload) {
  const res = await api.post('/search/route', payload)
  return res.data
}

export async function getDestinations() {
  const res = await api.get('/search/destinations')
  return res.data
}
