import api from './axios'

export async function searchRoute(params) {
  const res = await api.post('/search/route', params)
  return res.data
}

export async function getDestinations() {
  const res = await api.get('/search/destinations')
  return res.data
}

export async function autocomplete(query) {
  const res = await api.get(`/search/autocomplete?q=${encodeURIComponent(query)}`)
  return res.data
}
